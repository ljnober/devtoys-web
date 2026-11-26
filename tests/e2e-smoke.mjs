#!/usr/bin/env node
/**
 * devtoys-web 浏览器端到端冒烟测试（零新增 npm 依赖）。
 *
 * 执行方式：node tests/e2e-smoke.mjs
 *
 * 实现要点：
 *   1. 用 Node 内置 http 模块托管 dist/（本地静态服务，无外部网络依赖）；
 *   2. 以 Edge/Chrome headless + CDP（Node 内置 WebSocket / fetch）驱动真实浏览器；
 *   3. 覆盖 41 条工具路由、首页目录/搜索、10 项关键交互、操作栏、隐私红线、
 *      响应式/主题、深链刷新与无效 id 兜底；
 *   4. 全程监听 Network.requestWillBeSent / Runtime.exceptionThrown。
 *
 * 本脚本只读取源码与 dist，不修改任何业务源码；可在 CI/本地重复执行。
 */

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const REGISTRY = path.join(ROOT, 'src', 'tools', 'registry.ts')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------------------------------------------------------------------------
// 断言 / 结果收集
// ---------------------------------------------------------------------------
const results = []
let currentGroup = 'setup'

function group(name) {
  currentGroup = name
  console.log(`\n### ${name}`)
}

function record(name, pass, detail = '') {
  results.push({ group: currentGroup, name, pass: Boolean(pass), detail: String(detail) })
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ` — ${detail}` : ''}`)
  return Boolean(pass)
}

function expect(condition, name, detail = '') {
  return record(name, condition, detail || (condition ? '' : '断言不成立'))
}

// ---------------------------------------------------------------------------
// 从注册表读取 41 个工具（避免测试与源码清单漂移）
// ---------------------------------------------------------------------------
function readToolRegistry() {
  const source = fs.readFileSync(REGISTRY, 'utf8')
  const start = source.indexOf('export const tools')
  const end = source.indexOf('export const comingSoonTools')
  if (start < 0 || end < 0) {
    throw new Error('无法在 registry.ts 中定位 tools / comingSoonTools 数组')
  }
  const block = source.slice(start, end)
  const entries = [...block.matchAll(/\{\s*id: '([^']+)'[\s\S]*?\bname: '([^']+)'/g)]
    .map((match) => ({ id: match[1], name: match[2] }))
  return entries
}

// ---------------------------------------------------------------------------
// 本地静态服务器
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let pathname
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
    } catch {
      res.writeHead(400).end('bad request')
      return
    }
    const requested = pathname === '/' || !path.extname(pathname) ? '/index.html' : pathname
    const file = path.join(DIST, requested)
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end('forbidden')
      return
    }
    fs.readFile(file, (error, buffer) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('not found')
        return
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store'
      })
      res.end(buffer)
    })
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port })
    })
  })
}

// ---------------------------------------------------------------------------
// 最小 CDP 客户端（Node 22 内置 WebSocket）
// ---------------------------------------------------------------------------
class CdpClient {
  constructor(ws) {
    this.ws = ws
    this.seq = 0
    this.pending = new Map()
    this.handlers = new Map()
    ws.addEventListener('message', (event) => this.#onMessage(event.data))
  }

  static async connect(url) {
    const ws = new WebSocket(url)
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true })
      ws.addEventListener('error', (event) => reject(new Error(`CDP WebSocket 连接失败: ${event?.message ?? url}`)), { once: true })
    })
    return new CdpClient(ws)
  }

  #onMessage(raw) {
    let message
    try {
      message = JSON.parse(raw)
    } catch {
      return
    }
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id)
      this.pending.delete(message.id)
      if (message.error) {
        reject(new Error(`${message.error.message ?? 'CDP error'} (${JSON.stringify(message.error)})`))
      } else {
        resolve(message.result ?? {})
      }
      return
    }
    if (message.method) {
      for (const handler of this.handlers.get(message.method) ?? []) {
        try {
          handler(message.params ?? {})
        } catch {
          // 单个监听器异常不影响其他监听器
        }
      }
    }
  }

  on(method, handler) {
    if (!this.handlers.has(method)) {
      this.handlers.set(method, [])
    }
    this.handlers.get(method).push(handler)
  }

  send(method, params = {}) {
    const id = ++this.seq
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  async evaluate(expression) {
    const response = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true
    })
    if (response.exceptionDetails) {
      const detail = response.exceptionDetails.exception?.description ?? response.exceptionDetails.text
      throw new Error(`Runtime.evaluate 异常: ${detail}\n表达式: ${expression.slice(0, 200)}`)
    }
    return response.result?.value
  }

  close() {
    try {
      this.ws.close()
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// 浏览器启动 / 连接
// ---------------------------------------------------------------------------
function findBrowser() {
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
  ]
  const found = candidates.find((candidate) => fs.existsSync(candidate))
  if (!found) {
    throw new Error(`未找到 Edge/Chrome 可执行文件，尝试过: ${candidates.join(', ')}`)
  }
  return found
}

async function waitForDebugPort(profileDir, timeoutMs = 20000) {
  const portFile = path.join(profileDir, 'DevToolsActivePort')
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (fs.existsSync(portFile)) {
      const firstLine = fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]
      if (/^\d+$/.test(firstLine)) {
        return Number(firstLine)
      }
    }
    await delay(100)
  }
  throw new Error(`等待浏览器 CDP 端口超时: ${portFile}`)
}

async function connectPage(profileDir) {
  const debugPort = await waitForDebugPort(profileDir)
  const listUrl = `http://127.0.0.1:${debugPort}/json/list`
  const deadline = Date.now() + 10000
  let targets = []
  while (Date.now() < deadline) {
    try {
      targets = await (await fetch(listUrl)).json()
      const page = targets.find((target) => target.type === 'page')
      if (page?.webSocketDebuggerUrl) {
        return CdpClient.connect(page.webSocketDebuggerUrl)
      }
    } catch {
      // 浏览器尚未完全就绪
    }
    await delay(150)
  }
  throw new Error(`未找到可连接的 page target: ${JSON.stringify(targets)}`)
}

function killBrowser(child) {
  if (!child?.pid) {
    return
  }
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try {
      child.kill('SIGKILL')
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// 测试上下文（由 main 注入）
// ---------------------------------------------------------------------------
const observed = {
  requests: [],
  jsErrors: [],
  consoleErrors: [],
  sentinels: []
}

let client
let origin

async function evaluate(expression) {
  return client.evaluate(expression)
}

async function waitFor(expression, label, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs
  let last = undefined
  while (Date.now() < deadline) {
    try {
      last = await evaluate(expression)
      if (last) {
        return last
      }
    } catch (error) {
      last = error.message
    }
    await delay(60)
  }
  throw new Error(`等待超时（${label}），最后值: ${JSON.stringify(last)}`)
}

async function openHash(hash) {
  await evaluate(`location.hash = ${JSON.stringify(hash)}`)
  await waitFor(
    `document.readyState === 'complete' && (document.querySelector('.dt-app')?.children.length ?? 0) > 0`,
    `hash 路由 ${hash}`,
    8000
  )
}

/**
 * 刷新并等待新文档真正就绪。
 * Page.reload 返回时旧 DOM 可能仍可访问，直接用旧上下文断言会误判；
 * 因此在旧上下文打标记，刷新后等标记消失再继续。
 */
async function reloadAndWait(label) {
  await evaluate(`window.__e2e_reload_marker = 'before'`)
  await client.send('Page.reload', { ignoreCache: false })
  await waitFor(
    `window.__e2e_reload_marker !== 'before' && document.readyState === 'complete' && (document.querySelector('.dt-app')?.children.length ?? 0) > 0`,
    `${label} 新文档就绪`,
    10000
  )
  await delay(180)
}

async function openTool(id, name) {
  await openHash(`#/tool/${id}`)
  await waitFor(
    `document.querySelector('.dt-tool-shell__title')?.textContent.includes(${JSON.stringify(name)}) === true`,
    `工具标题 ${id}`,
    8000
  )
  // 等待 defineAsyncComponent 的本地 chunk 完成加载
  await delay(220)
}

/** 通过原生 value setter + input/change 事件驱动 Vue v-model。 */
async function setField(selector, value) {
  return evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return { ok: false, reason: 'not found' };
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
      : el.tagName === 'SELECT' ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, ${JSON.stringify(String(value))});
    else el.value = ${JSON.stringify(String(value))};
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, value: el.value };
  })()`)
}

async function click(selector, index = 0) {
  return evaluate(`(() => {
    const nodes = document.querySelectorAll(${JSON.stringify(selector)});
    const el = nodes[${index}];
    if (!el) return { ok: false, count: nodes.length };
    el.click();
    return { ok: true, count: nodes.length, text: (el.textContent || '').trim() };
  })()`)
}

async function bodyText() {
  return evaluate(`document.body.innerText || ''`)
}

async function readOutput() {
  return evaluate(`(() => {
    const textTool = document.querySelector('.dt-tool-output');
    if (textTool) return textTool.value || '';
    const hl = document.querySelector('.dt-io__highlight code');
    if (hl) return hl.textContent || '';
    const areas = document.querySelectorAll('.dt-io__textarea');
    return areas.length > 1 ? (areas[1].value || '') : '';
  })()`)
}

async function toolUiInfo() {
  return evaluate(`(() => {
    const main = document.querySelector('.dt-tool-shell__main');
    if (!main) return { ok: false, reason: 'no main' };
    const text = (main.innerText || '').trim();
    const controls = main.querySelectorAll('input, textarea, select, button').length;
    const hasSoon = text.includes('开发中') || !!document.querySelector('.dt-coming-soon');
    return { ok: !hasSoon && controls > 0 && text.length > 20, controls, len: text.length, hasSoon };
  })()`)
}

// ---------------------------------------------------------------------------
// 场景 1：41 条工具路由逐个打开
// ---------------------------------------------------------------------------
async function scenarioRoutes(tools) {
  group('场景 1 · 41 条工具路由逐个打开')
  expect(tools.length === 41, '注册表解析出 41 个工具', `实际 ${tools.length}`)
  expect(new Set(tools.map((tool) => tool.id)).size === 41, '41 个 id 全局唯一')

  const routeRows = []
  let passed = 0
  for (const tool of tools) {
    const errorsBefore = observed.jsErrors.length
    let detail = ''
    let ok = false
    try {
      await openHash(`#/tool/${tool.id}`)
      await waitFor(
        `document.querySelector('.dt-tool-shell__title')?.textContent.includes(${JSON.stringify(tool.name)}) === true`,
        `标题 ${tool.id}`,
        8000
      )
      await delay(180)
      const ui = await toolUiInfo()
      const newErrors = observed.jsErrors.slice(errorsBefore)
      ok = ui.ok && newErrors.length === 0
      detail = `标题✓ UI控件${ui.controls} 文本${ui.len}字 JS错误${newErrors.length}`
      if (newErrors.length) {
        detail += ` :: ${newErrors[0].text.slice(0, 120)}`
      }
    } catch (error) {
      detail = error.message.slice(0, 180)
    }
    routeRows.push({ id: tool.id, name: tool.name, pass: ok, detail })
    if (ok) {
      passed += 1
    }
  }
  record(`41 条路由全部渲染成功（${passed}/${tools.length}）`, passed === tools.length,
    passed === tools.length ? '全部通过' : routeRows.filter((row) => !row.pass).map((row) => row.id).join(', '))
  return routeRows
}

// ---------------------------------------------------------------------------
// 场景 2：首页目录 / 中文搜索 / 卡片跳转
// ---------------------------------------------------------------------------
async function scenarioHome() {
  group('场景 2 · 首页目录与搜索')
  await evaluate(`location.hash = '#/'`)
  await waitFor(`document.querySelectorAll('.dt-category').length === 11`, '首页 11 个分类', 8000)
  await delay(150)

  const counts = await evaluate(`(() => ({
    categories: document.querySelectorAll('.dt-category').length,
    cards: document.querySelectorAll('.dt-tool-card').length,
    ready: document.querySelectorAll('a.dt-tool-card').length,
    soon: document.querySelectorAll('.dt-tool-card--soon').length,
    privacy: (document.body.innerText || '').includes('不上传')
  }))()`)
  expect(counts.categories === 11, '首页 11 个分类分区', `实际 ${counts.categories}`)
  expect(counts.cards === 43 && counts.ready === 41 && counts.soon === 2,
    '首页 41 ready 卡 + 2 coming-soon 占位', JSON.stringify(counts))
  expect(counts.privacy, '首页隐私标识常驻（不上传）')

  // 搜索框已按新版导航设计下沉到左侧常驻侧栏（AppSidebar），与首页共用 search store。
  await setField('.dt-side__search input', '时间戳')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 1`, '中文搜索「时间戳」', 4000)
  const search1 = await evaluate(`document.querySelector('a.dt-tool-card strong')?.textContent || ''`)
  expect(search1.includes('日期时间转换器'), '搜索「时间戳」过滤到日期时间转换器', search1)

  await setField('.dt-side__search input', 'base64')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 1`, '搜索「base64」', 4000)
  const search2 = await evaluate(`document.querySelector('a.dt-tool-card strong')?.textContent || ''`)
  expect(search2.includes('Base64'), '搜索「base64」过滤到 Base64 工具', search2)

  await click('.dt-side__clear')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 41`, '清除搜索恢复 41 卡', 4000)
  await click('a.dt-tool-card', 12)
  await waitFor(`location.hash.includes('#/tool/')`, '点击卡片进入工具页', 4000)
  const href = await evaluate(`location.hash`)
  expect(href.startsWith('#/tool/'), '卡片点击进入工具页', href)
}

// ---------------------------------------------------------------------------
// 场景 3：关键交互实测
// ---------------------------------------------------------------------------
async function scenarioInteractions() {
  group('场景 3 · 关键交互实测')

  // 3.1 JSON 格式化 + 缩进选项 + 压缩选项（T02b 选项改动重算）
  await openTool('json-format', 'JSON 格式化/压缩/校验')
  await setField('.dt-tool-input', '{"a":1}')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('"a": 1')`, 'JSON 格式化输出')
  const jsonOut = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(jsonOut.includes('\n  "a": 1'), 'JSON 格式化输入 {"a":1} 输出含 2 空格缩进', JSON.stringify(jsonOut))

  await setField('.dt-options select', '4')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('\\n    "a": 1')`, '缩进选项重算', 4000)
  const jsonOut4 = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(jsonOut4.includes('\n    "a": 1'), '选项栏「4 空格」改动后输出重算', JSON.stringify(jsonOut4))

  await click('.dt-options input[type="checkbox"]')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').trim() === '{"a":1}'`, '压缩选项重算', 4000)
  expect((await evaluate(`document.querySelector('.dt-tool-output').value`)).trim() === '{"a":1}',
    '选项栏「压缩输出」改动后输出重算')
  await click('.dt-options input[type="checkbox"]')

  // 3.2 Base64 中文编码 + 交换
  await openTool('base64-text', 'Base64 文本编解码')
  await setField('.dt-io__textarea', '你好')
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('5L2g5aW9')`, 'Base64 中文编码')
  const b64 = await readOutput()
  expect(b64.includes('5L2g5aW9'), 'Base64 输入中文得到 UTF-8 正确编码', b64.slice(0, 80))
  await click('.dt-actions .dt-button', 3)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === '5L2g5aW9'`, '交换后输入为编码值', 4000)
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('你好')`, '交换后解码', 4000)
  expect((await readOutput()).includes('你好'), 'Base64 交换后自动切到解码并还原中文')

  // 3.3 JWT 解码
  const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  await openTool('jwt-decode', 'JWT 解码器')
  await setField('.dt-io__textarea', jwtToken)
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('John Doe')`, 'JWT 解码')
  const jwtOut = await readOutput()
  expect(jwtOut.includes('Header：') && jwtOut.includes('Payload：') && jwtOut.includes('Signature：') && jwtOut.includes('John Doe'),
    'JWT 样例 token 解析出 Header/Payload/Signature', jwtOut.slice(0, 60).replace(/\n/g, '|'))

  // 3.4 正则实时高亮
  await openTool('regex-tester', '正则表达式测试')
  await setField('.dt-regex__inputs input[type="text"]', '\\d+')
  await setField('.dt-textarea', 'abc123def456')
  await waitFor(`document.querySelectorAll('.dt-regex__highlight mark').length === 2`, '正则实时高亮 2 处', 4000)
  const marks = await evaluate(`[...document.querySelectorAll('.dt-regex__highlight mark')].map(el => el.textContent).join(',')`)
  const summary = await evaluate(`document.querySelector('.dt-regex__summary')?.textContent.trim() || ''`)
  expect(marks.includes('123') && marks.includes('456'), '正则 tester 实时高亮匹配片段', marks)
  expect(summary.includes('2'), '正则匹配计数正确', summary)

  // 3.5 SHA-256('abc') + 算法选项重算
  await openTool('hash-generator', '哈希/校验和生成器')
  await setField('.dt-io__textarea', 'abc')
  await waitFor(`(document.body.innerText || '').includes('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')`, 'SHA-256(abc)')
  expect((await bodyText()).includes('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
    "SHA-256('abc') 结果正确")
  await setField('.dt-options select', 'MD5')
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('900150983cd24fb0d6963f7d28e17f72')`, 'MD5 选项重算', 4000)
  expect((await readOutput()).includes('900150983cd24fb0d6963f7d28e17f72'), '算法选项改为 MD5 后摘要重算')

  // 3.6 JSONPath $.a[0].b
  await openTool('jsonpath-tester', 'JSONPath 测试')
  await waitFor(`(document.querySelector('.dt-jsonpath__value')?.textContent || '').includes('示例值')`, 'JSONPath 默认查询', 4000)
  const jp = await evaluate(`(() => ({
    path: document.querySelector('.dt-jsonpath__path')?.textContent || '',
    value: document.querySelector('.dt-jsonpath__value')?.textContent || ''
  }))()`)
  expect(jp.path.includes('$.a[0].b') && jp.value.includes('示例值'), 'JSONPath $.a[0].b 返回正确节点', JSON.stringify(jp))
  await setField('.dt-jsonpath__grid textarea', '{"a":[{"b":"TEST_XYZ_Q"}]}')
  await waitFor(`(document.querySelector('.dt-jsonpath__value')?.textContent || '').includes('TEST_XYZ_Q')`, 'JSONPath 输入变化重算', 4000)
  expect((await evaluate(`document.querySelector('.dt-jsonpath__value')?.textContent || ''`)).includes('TEST_XYZ_Q'), 'JSONPath 修改 JSON 后结果重算')

  // 3.7 IPv4 子网
  await openTool('ipv4-subnet', 'IPv4 子网计算器')
  await waitFor(`(document.body.innerText || '').includes('192.168.1.255')`, 'IPv4 默认 /24 计算', 4000)
  const subnetText1 = await bodyText()
  expect(subnetText1.includes('192.168.1.0') && subnetText1.includes('192.168.1.255') && subnetText1.includes('255.255.255.0'),
    'IPv4 192.168.1.10/24 网络地址与广播地址正确')
  await setField('.dt-subnet input', '10.0.0.1/8')
  await waitFor(`(document.body.innerText || '').includes('10.255.255.255')`, 'IPv4 /8 重算', 4000)
  const subnetText2 = await bodyText()
  expect(subnetText2.includes('10.0.0.0') && subnetText2.includes('10.255.255.255'), 'IPv4 10.0.0.1/8 重算正确')

  // 3.8 颜色转换
  await openTool('color-converter', '颜色选择器/转换')
  await waitFor(`(document.querySelector('.dt-color__result pre')?.textContent || '').includes('rgb(255, 0, 0)')`, '颜色默认转换', 4000)
  const color1 = await evaluate(`document.querySelector('.dt-color__result pre').textContent`)
  expect(color1.includes('#FF0000') && color1.includes('rgb(255, 0, 0)'), '#ff0000 → rgb(255, 0, 0)', color1.replace(/\n/g, '|'))
  await setField('.dt-color__fields input[type="text"]', '#00ff00')
  await waitFor(`(document.querySelector('.dt-color__result pre')?.textContent || '').includes('rgb(0, 255, 0)')`, '颜色输入重算', 4000)
  expect((await evaluate(`document.querySelector('.dt-color__result pre').textContent`)).includes('rgb(0, 255, 0)'), '#00ff00 → rgb(0, 255, 0)')

  // 3.9 HTTP 状态码
  await openTool('http-status', 'HTTP 状态码查询')
  await setField('.dt-ref__search', '404')
  await waitFor(`document.querySelectorAll('.dt-ref__item').length >= 1`, 'HTTP 404 查询', 4000)
  const httpItem = await evaluate(`document.querySelector('.dt-ref__item')?.innerText || ''`)
  expect(httpItem.includes('404') && httpItem.includes('请求的资源不存在'), 'HTTP 404 文案正确', httpItem.slice(0, 80).replace(/\n/g, '|'))

  // 3.10 二维码生成 data:image/png
  await openTool('qrcode-encode', '二维码编解码')
  await setField('#qrcode-text', 'https://tool.nober.cn')
  await waitFor(`(document.querySelector('.dt-qrcode__preview img')?.src || '').startsWith('data:image/png')`, '二维码生成', 6000)
  const qrSrc = await evaluate(`document.querySelector('.dt-qrcode__preview img')?.src || ''`)
  expect(qrSrc.startsWith('data:image/png;base64,'), '二维码生成 data:image/png 本地图片', `${qrSrc.slice(0, 32)}…(${qrSrc.length}字)`)
}

// ---------------------------------------------------------------------------
// 场景 4：操作栏 copy / download / clear / swap（≥3 个工具）
// ---------------------------------------------------------------------------
async function scenarioActionBar(downloadDir) {
  group('场景 4 · 操作栏四按钮实测')

  async function checkButtons(label) {
    const state = await evaluate(`(() => {
      const buttons = [...document.querySelectorAll('.dt-actions .dt-button')];
      return {
        count: buttons.length,
        labels: buttons.map(b => (b.textContent || '').trim()),
        disabled: buttons.map(b => b.disabled)
      };
    })()`)
    expect(state.count === 4 && state.labels.some((t) => t.includes('复制')) && state.labels.some((t) => t.includes('下载')) && state.labels.some((t) => t.includes('清空')) && state.labels.some((t) => t.includes('交换')),
      `${label} · 操作栏含复制/下载/清空/交换`, JSON.stringify(state.labels))
    return state
  }

  async function waitForDownload(label) {
    for (const file of fs.readdirSync(downloadDir)) {
      try {
        fs.unlinkSync(path.join(downloadDir, file))
      } catch {
        // ignore
      }
    }
    await click('.dt-actions .dt-button', 1)
    const deadline = Date.now() + 4000
    while (Date.now() < deadline) {
      const files = fs.readdirSync(downloadDir).filter((name) => !name.endsWith('.crdownload'))
      if (files.length) {
        const stat = fs.statSync(path.join(downloadDir, files[0]))
        expect(stat.size > 0, `${label} · 下载按钮产出文件`, `${files[0]} (${stat.size} bytes)`)
        return
      }
      await delay(100)
    }
    record(`${label} · 下载按钮产出文件`, false, '下载目录未出现文件')
  }

  async function checkCopy(label, sentinel) {
    await evaluate(`navigator.clipboard.writeText('__e2e_reset__')`).catch(() => {})
    await click('.dt-actions .dt-button', 0)
    await delay(250)
    let clip = ''
    try {
      clip = await evaluate(`navigator.clipboard.readText()`)
    } catch (error) {
      record(`${label} · 复制按钮写入剪贴板`, false, `读取剪贴板失败: ${error.message.slice(0, 100)}`)
      return
    }
    expect(clip.includes(sentinel), `${label} · 复制按钮写入剪贴板`, `${clip.slice(0, 60)}`)
  }

  // 4.1 JSON 格式化：四按钮全测
  await openTool('json-format', 'JSON 格式化/压缩/校验')
  await setField('.dt-tool-input', '{"copycheck":"ALPHA_42"}')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('ALPHA_42')`, '操作栏 JSON 输出')
  const s1 = await checkButtons('json-format')
  expect(!s1.disabled[0] && !s1.disabled[1] && !s1.disabled[3], 'json-format · 有输出时复制/下载/交换可用', JSON.stringify(s1.disabled))
  await checkCopy('json-format', 'ALPHA_42')
  await waitForDownload('json-format')
  const outBeforeSwap = await evaluate(`document.querySelector('.dt-tool-output').value`)
  await click('.dt-actions .dt-button', 3)
  await waitFor(`document.querySelector('.dt-tool-input')?.value.includes('ALPHA_42')`, 'json-format 交换', 4000)
  expect((await evaluate(`document.querySelector('.dt-tool-input').value`)).includes('ALPHA_42'),
    'json-format · 交换把输出写回输入', outBeforeSwap.slice(0, 40).replace(/\n/g, '|'))
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-tool-input')?.value || '') === ''`, 'json-format 清空', 4000)
  expect((await evaluate(`document.querySelector('.dt-tool-input').value`)) === '' && (await evaluate(`document.querySelector('.dt-tool-output').value`)) === '',
    'json-format · 清空同时清除输入与输出')

  // 4.2 Base64：复制 / 交换 / 清空
  await openTool('base64-text', 'Base64 文本编解码')
  await setField('.dt-io__textarea', 'SENTINEL_B64')
  await waitFor(`(document.querySelectorAll('.dt-io__textarea')[1]?.value || document.querySelector('.dt-io__highlight code')?.textContent || '').includes('U0VOVElORUxfQjY0')`, '操作栏 Base64 输出')
  await checkButtons('base64-text')
  await checkCopy('base64-text', 'U0VOVElORUxfQjY0')
  await click('.dt-actions .dt-button', 3)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === 'U0VOVElORUxfQjY0'`, 'base64 交换', 4000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === 'U0VOVElORUxfQjY0', 'base64-text · 交换可用')
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === ''`, 'base64 清空', 4000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === '', 'base64-text · 清空输入')

  // 4.3 哈希生成器：复制摘要 / 下载 / 清空
  await openTool('hash-generator', '哈希/校验和生成器')
  await setField('.dt-io__textarea', 'SENTINEL_HASH')
  await waitFor(`(document.body.innerText || '').includes('SHA-256')`, '操作栏 Hash 输出', 4000)
  await checkButtons('hash-generator')
  const expectedDigest = crypto.createHash('sha256').update('SENTINEL_HASH').digest('hex')
  await checkCopy('hash-generator', expectedDigest)
  await waitForDownload('hash-generator')
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === ''`, 'hash 清空', 4000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === '', 'hash-generator · 清空输入')
}

// ---------------------------------------------------------------------------
// 场景 5：隐私红线（零外部请求 / localStorage 不含用户输入）
// ---------------------------------------------------------------------------
async function scenarioPrivacy() {
  group('场景 5 · 隐私红线')
  const external = observed.requests.filter((request) =>
    !request.url.startsWith(origin) &&
    !/^(data|blob|about|chrome|devtools|edge|javascript):/i.test(request.url)
  )
  observed.externalRequests = external
  expect(external.length === 0, `EXTERNAL_REQUESTS=[]（外部请求 ${external.length}）`,
    external.length ? JSON.stringify(external.slice(0, 5)) : `累计本地请求 ${observed.requests.length} 个，全部同源`)

  const storage = await evaluate(`(() => {
    const out = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      out[key] = localStorage.getItem(key);
    }
    return out;
  })()`)
  const serialized = JSON.stringify(storage)
  const leaked = observed.sentinels.filter((value) => serialized.includes(value))
  expect(leaked.length === 0, 'localStorage 未存入任何用户输入 sentinel',
    leaked.length ? leaked.join(', ') : `localStorage keys: ${Object.keys(storage).join(', ') || '(empty)'}`)
  const unexpectedKeys = Object.keys(storage).filter((key) => key !== 'devtoys-web:theme')
  record('localStorage 仅含主题偏好键', unexpectedKeys.length === 0,
    unexpectedKeys.length ? `额外键: ${unexpectedKeys.join(', ')}` : Object.keys(storage).join(', ') || '(empty)')
}

// ---------------------------------------------------------------------------
// 场景 6：响应式 + 主题
// ---------------------------------------------------------------------------
async function scenarioResponsiveAndTheme() {
  group('场景 6 · 响应式与主题')

  async function checkViewport(width, height, mobile, label) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile
    })
    await delay(150)
    await evaluate(`location.hash = '#/'`)
    await waitFor(`document.querySelectorAll('.dt-category').length === 11`, `${label} 首页`, 6000)
    await delay(120)
    const home = await evaluate(`(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    }))()`)
    expect(home.scrollWidth <= home.innerWidth + 1, `${label} 首页无横向溢出`, JSON.stringify(home))

    await openTool('json-format', 'JSON 格式化/压缩/校验')
    // 新版：分类导航移到全局 AppSidebar，工具页主体不再内嵌 aside。
    // 桌面侧栏常驻（约 280px）；移动端侧栏隐藏，由顶部汉堡打开抽屉。
    const tool = await evaluate(`(() => {
      const shell = document.querySelector('.dt-tool-shell');
      const sidebar = document.querySelector('.dt-app__sidebar');
      const menu = document.querySelector('.dt-header__menu');
      const columns = shell ? getComputedStyle(shell).gridTemplateColumns.trim().split(/\\s+/).length : 0;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        columns,
        sidebarDisplay: sidebar ? getComputedStyle(sidebar).display : 'missing',
        sidebarWidth: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : 0,
        menuDisplay: menu ? getComputedStyle(menu).display : 'missing'
      };
    })()`)
    expect(tool.scrollWidth <= tool.innerWidth + 1, `${label} 工具页无横向溢出`, JSON.stringify(tool))
    if (mobile) {
      expect(tool.sidebarDisplay === 'none' && tool.menuDisplay !== 'none',
        `${label} 工具页移动端隐藏侧栏并显示汉堡`, JSON.stringify(tool))
    } else {
      expect(tool.sidebarDisplay !== 'none' && tool.sidebarWidth >= 270 && tool.sidebarWidth <= 290,
        `${label} 工具页桌面常驻 280px 侧栏`, JSON.stringify(tool))
    }
  }

  await checkViewport(375, 812, true, '375px')
  await checkViewport(1280, 900, false, '1280px')

  // 主题切换 + 刷新持久化
  let theme = await evaluate(`document.documentElement.dataset.theme || ''`)
  if (theme !== 'light') {
    await click('.dt-theme-toggle')
    await delay(120)
  }
  await click('.dt-theme-toggle')
  await waitFor(`document.documentElement.dataset.theme === 'dark'`, '切换到 dark', 4000)
  const persisted = await evaluate(`localStorage.getItem('devtoys-web:theme')`)
  const darkClass = await evaluate(`document.documentElement.classList.contains('dark')`)
  expect(persisted === 'dark', '主题切换写入 localStorage devtoys-web:theme=dark', String(persisted))
  expect(darkClass, 'html.dark 类随主题切换生效')

  await reloadAndWait('主题刷新')
  const afterReload = await evaluate(`(() => ({
    theme: document.documentElement.dataset.theme || '',
    stored: localStorage.getItem('devtoys-web:theme'),
    dark: document.documentElement.classList.contains('dark')
  }))()`)
  expect(afterReload.theme === 'dark' && afterReload.dark && afterReload.stored === 'dark',
    '刷新后 dark 主题保持', JSON.stringify(afterReload))

  await client.send('Emulation.clearDeviceMetricsOverride')
}

// ---------------------------------------------------------------------------
// 场景 7：深链刷新 / 无效 id 兜底
// ---------------------------------------------------------------------------
async function scenarioDeepLinks() {
  group('场景 7 · 深链刷新与无效 id')

  await client.send('Page.navigate', { url: `${origin}/#/tool/color-converter` })
  await waitFor(`document.querySelector('.dt-tool-shell__title')?.textContent.includes('颜色选择器/转换') === true`, '深链直达', 8000)
  await reloadAndWait('深链刷新')
  await waitFor(`document.querySelector('.dt-tool-shell__title')?.textContent.includes('颜色选择器/转换') === true`, '深链刷新后标题', 8000)
  const deep = await evaluate(`(() => ({
    title: document.querySelector('.dt-tool-shell__title')?.textContent.trim() || '',
    notFound: !!document.querySelector('.dt-not-found'),
    bodyLen: (document.body.innerText || '').trim().length
  }))()`)
  expect(deep.title.includes('颜色选择器/转换') && !deep.notFound && deep.bodyLen > 40,
    '/#/tool/color-converter 深链刷新不 404、不白屏', JSON.stringify(deep))

  await openHash('#/tool/this-tool-does-not-exist-xyz')
  await waitFor(`!!document.querySelector('.dt-soon-view')`, '无效 id 兜底', 6000)
  const invalid = await evaluate(`(() => ({
    soon: !!document.querySelector('.dt-coming-soon'),
    text: (document.querySelector('.dt-coming-soon')?.innerText || '').slice(0, 120),
    bodyLen: (document.body.innerText || '').trim().length
  }))()`)
  expect(invalid.soon && invalid.text.includes('开发中') && invalid.bodyLen > 40,
    '无效 id 落到 ComingSoon 而不是白屏', JSON.stringify(invalid))

  await openHash('#/tool/math-expression')
  await waitFor(`!!document.querySelector('.dt-coming-soon')`, 'coming-soon id 兜底', 6000)
  expect((await evaluate(`document.querySelector('.dt-coming-soon')?.innerText || ''`)).includes('开发中'),
    'coming-soon id 显示「开发中」占位页')
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
let server
let browser
let profileDir
let downloadDir
let fatalError = null

async function main() {
  if (!fs.existsSync(DIST)) {
    throw new Error(`dist 目录不存在: ${DIST}，请先执行 npm run build`)
  }
  const tools = readToolRegistry()

  const staticServer = await startStaticServer()
  server = staticServer.server
  origin = `http://127.0.0.1:${staticServer.port}`
  console.log(`本地静态服务: ${origin}  (root=${DIST})`)

  profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devtoys-e2e-profile-'))
  downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devtoys-e2e-download-'))
  const browserPath = findBrowser()
  browser = spawn(browserPath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-extensions',
    '--no-proxy-server',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    '--window-size=1280,900',
    'about:blank'
  ], { stdio: 'ignore', windowsHide: true })
  console.log(`浏览器: ${browserPath} (pid=${browser.pid})`)

  client = await connectPage(profileDir)
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Network.enable')
  await client.send('Log.enable')
  await client.send('Page.bringToFront')
  await client.send('Browser.grantPermissions', {
    origin,
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite']
  }).catch(() => {})
  await client.send('Browser.setDownloadBehavior', {
    behavior: 'allow', downloadPath: downloadDir, eventsEnabled: true
  }).catch(async () => {
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir })
  })

  client.on('Network.requestWillBeSent', (params) => {
    observed.requests.push({ url: params.request?.url ?? '', type: params.type ?? '' })
  })
  client.on('Runtime.exceptionThrown', (params) => {
    const detail = params.exceptionDetails ?? {}
    observed.jsErrors.push({
      text: detail.exception?.description ?? detail.text ?? 'unknown JS error',
      url: detail.url ?? ''
    })
  })
  client.on('Log.entryAdded', (params) => {
    const entry = params.entry ?? {}
    if (entry.level === 'error') {
      observed.consoleErrors.push({ text: entry.text ?? '', url: entry.url ?? '' })
    }
  })

  observed.sentinels = [
    'ALPHA_42', 'U0VOVElORUxfQjY0', 'SENTINEL_HASH',
    '5L2g5aW9', 'John Doe', 'TEST_XYZ_Q', 'TESTVALUE'
  ]

  await client.send('Page.navigate', { url: `${origin}/#/` })
  await waitFor(`document.querySelector('.dt-app')?.children.length > 0`, '首次加载应用', 10000)

  const routes = await scenarioRoutes(tools)
  const homes = await scenarioHome()
  await scenarioInteractions()
  await scenarioActionBar(downloadDir)
  await scenarioPrivacy()
  await scenarioResponsiveAndTheme()
  await scenarioDeepLinks()
  void homes

  const errorsAtEnd = observed.jsErrors
  expect(errorsAtEnd.length === 0, `全流程零 JS 运行时异常（${errorsAtEnd.length}）`,
    errorsAtEnd.length ? errorsAtEnd.slice(0, 3).map((item) => item.text.slice(0, 160)).join(' || ') : '')

  const failed = results.filter((item) => !item.pass)
  const summary = {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    routes,
    externalRequests: observed.externalRequests ?? [],
    networkRequests: observed.requests.length,
    jsErrors: observed.jsErrors,
    consoleErrors: observed.consoleErrors,
    failures: failed.map((item) => ({ group: item.group, name: item.name, detail: item.detail }))
  }
  console.log('\n===E2E_RESULT_JSON===')
  console.log(JSON.stringify(summary, null, 2))
  console.log('===END_E2E_RESULT_JSON===')
  if (failed.length) {
    process.exitCode = 1
  }
}

main()
  .catch((error) => {
    fatalError = error
    console.error('\n[FATAL]', error?.stack ?? error)
    console.log('\n===E2E_RESULT_JSON===')
    console.log(JSON.stringify({
      total: results.length,
      passed: results.filter((item) => item.pass).length,
      failed: results.filter((item) => !item.pass).length + 1,
      fatal: String(error?.stack ?? error),
      failures: results.filter((item) => !item.pass)
    }, null, 2))
    console.log('===END_E2E_RESULT_JSON===')
    process.exitCode = 1
  })
  .finally(async () => {
    client?.close()
    if (browser) {
      killBrowser(browser)
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve))
    }
    for (const dir of [profileDir, downloadDir]) {
      if (dir) {
        try {
          fs.rmSync(dir, { recursive: true, force: true })
        } catch {
          // ignore
        }
      }
    }
    void fatalError
  })
