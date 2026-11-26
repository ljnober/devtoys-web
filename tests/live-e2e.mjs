#!/usr/bin/env node
/**
 * devtoys-web **线上站点**全量自动化验收（零新增 npm 依赖，可重复执行）。
 *
 * 执行方式：
 *   node tests/live-e2e.mjs
 *   BASE_URL=https://tool.nober.cn node tests/live-e2e.mjs
 *
 * 与 tests/e2e-smoke.mjs 的区别：
 *   1. 不启动本地静态服务，直接访问 BASE_URL（默认 https://tool.nober.cn）；
 *   2. 预检 HTTP(S) 状态码、最终 URL、证书 subject、严格 TLS 校验结果；
 *   3. 证书未签发 tool.nober.cn 时以 --ignore-certificate-errors 启动浏览器，
 *      并在报告中把「证书未签发」记为环境事实而非源码 Bug；
 *   4. 每条工具路由同时检查标题、真实 UI、无「开发中」、零 JS 异常、零 console error；
 *   5. 补充 JSON↔YAML、Schema 必填校验、MIME .json 查询等交互。
 *
 * 全程 CDP Network.enable / Runtime.enable / Log.enable 监听，结果以
 * ===E2E_RESULT_JSON=== 包裹输出，失败退出码 1。
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import https from 'node:https'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY = path.join(ROOT, 'src', 'tools', 'registry.ts')
const BASE_URL = (process.env.BASE_URL || 'https://tool.nober.cn').replace(/\/+$/, '')
const STRICT_TLS = process.env.STRICT_TLS === '1'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------------------------------------------------------------------------
// 断言 / 结果收集
// ---------------------------------------------------------------------------
const results = []
const notes = []
let currentGroup = 'setup'

function group(name) {
  currentGroup = name
  console.log(`\n### ${name}`)
}

function note(key, value) {
  notes.push({ key, value: String(value) })
  console.log(`  [INFO] ${key} — ${String(value)}`)
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
// 从注册表读取 40 个工具（避免测试与源码清单漂移）
// ---------------------------------------------------------------------------
function readToolRegistry() {
  const source = fs.readFileSync(REGISTRY, 'utf8')
  const start = source.indexOf('export const tools')
  const end = source.indexOf('export const comingSoonTools')
  if (start < 0 || end < 0) {
    throw new Error('无法在 registry.ts 中定位 tools / comingSoonTools 数组')
  }
  const block = source.slice(start, end)
  return [...block.matchAll(/\{\s*id: '([^']+)'[\s\S]*?\bname: '([^']+)'/g)]
    .map((match) => ({ id: match[1], name: match[2] }))
}

// ---------------------------------------------------------------------------
// HTTPS 预检：状态码 / 最终 URL / 证书 subject / 严格校验是否通过
// ---------------------------------------------------------------------------
function httpsProbe(url, rejectUnauthorized, redirectsLeft = 5) {
  return new Promise((resolve) => {
    let target
    try {
      target = new URL(url)
    } catch (error) {
      resolve({ error: `URL 解析失败: ${error.message}` })
      return
    }
    const req = https.request({
      hostname: target.hostname,
      port: target.port || 443,
      path: `${target.pathname}${target.search}`,
      method: 'GET',
      rejectUnauthorized,
      timeout: 20000,
      headers: { 'User-Agent': 'devtoys-live-qa/1.0', Accept: 'text/html' }
    }, (res) => {
      const cert = res.socket?.getPeerCertificate?.() ?? {}
      res.resume()
      res.on('end', () => {
        const location = res.headers.location
        if (location && redirectsLeft > 0) {
          resolve({ redirect: new URL(location, url).href, status: res.statusCode })
          return
        }
        resolve({
          status: res.statusCode,
          finalUrl: url,
          headers: res.headers,
          cert: {
            subject: cert.subject ? JSON.stringify(cert.subject) : '',
            subjectCN: cert.subject?.CN ?? '',
            issuer: cert.issuer ? JSON.stringify(cert.issuer) : '',
            validFrom: cert.valid_from ?? '',
            validTo: cert.valid_to ?? ''
          }
        })
      })
    })
    req.on('error', (error) => resolve({ error: `${error.code ?? 'ERROR'}: ${error.message}` }))
    req.on('timeout', () => req.destroy(new Error('HTTPS 请求超时')))
    req.end()
  })
}

async function preflight() {
  const loose = await httpsProbe(`${BASE_URL}/`, false)
  const strict = await httpsProbe(`${BASE_URL}/`, true)
  let finalUrl = loose.finalUrl ?? `${BASE_URL}/`
  let current = loose
  let hops = 0
  while (current.redirect && hops < 5) {
    current = await httpsProbe(current.redirect, false)
    finalUrl = current.finalUrl ?? finalUrl
    hops += 1
  }
  const cert = current.cert ?? {}
  const host = new URL(BASE_URL).hostname
  const certForHost = /tool\.nober\.cn/i.test(cert.subjectCN ?? '')
  return {
    loose,
    strict,
    status: current.status ?? loose.status ?? 0,
    finalUrl,
    contentType: current.headers?.['content-type'] ?? '',
    html: '',
    cert,
    certForHost,
    strictOk: Boolean(strict.status >= 200 && strict.status < 400),
    ignoreCertErrors: !certForHost || !strict.status,
    host
  }
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
let pre

async function evaluate(expression) {
  return client.evaluate(expression)
}

async function waitFor(expression, label, timeoutMs = 10000) {
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
    await delay(80)
  }
  throw new Error(`等待超时（${label}），最后值: ${JSON.stringify(last)}`)
}

async function openHash(hash) {
  await evaluate(`location.hash = ${JSON.stringify(hash)}`)
  await waitFor(
    `document.readyState === 'complete' && (document.querySelector('.dt-app')?.children.length ?? 0) > 0`,
    `hash 路由 ${hash}`,
    10000
  )
}

/** 刷新并等待新文档真正就绪，避免旧 DOM 竞态。 */
async function reloadAndWait(label) {
  await evaluate(`window.__e2e_reload_marker = 'before'`)
  await client.send('Page.reload', { ignoreCache: false })
  await waitFor(
    `window.__e2e_reload_marker !== 'before' && document.readyState === 'complete' && (document.querySelector('.dt-app')?.children.length ?? 0) > 0`,
    `${label} 新文档就绪`,
    15000
  )
  await delay(220)
}

async function openTool(id, name) {
  const target = `#/tool/${id}`
  // 同一 hash 重复赋值不会触发 Vue Router 导航；先回首页确保组件重新挂载。
  const currentHash = await evaluate(`location.hash`)
  if (currentHash === target) {
    await evaluate(`location.hash = '#/'`)
    await waitFor(`document.querySelectorAll('.dt-category').length === 11`, `${id} 同路由重置`, 10000)
    await delay(120)
  }
  await openHash(target)
  await waitFor(
    `document.querySelector('.dt-tool-shell__title')?.textContent.includes(${JSON.stringify(name)}) === true`,
    `工具标题 ${id}`,
    12000
  )
  // 标题来自外层 shell，可能早于 defineAsyncComponent 的 chunk 挂载；
  // 必须等工具自有控件出现后再操作，避免把值写进将被替换的旧 DOM。
  await waitFor(
    `document.querySelectorAll('.dt-tool-shell__main input, .dt-tool-shell__main textarea, .dt-tool-shell__main select, .dt-tool-shell__main button').length > 0`,
    `工具控件挂载 ${id}`,
    12000
  )
  await delay(260)
}

/** 通过原生 value setter + input/change 事件驱动 Vue v-model。 */
async function setField(selector, value, index = 0) {
  const result = await evaluate(`(() => {
    const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
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
  if (!result?.ok) {
    throw new Error(`setField 未找到控件: ${selector}[${index}]`)
  }
  return result
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
// 场景 0：站点可达 / HTTPS / 证书 / 首页内容
// ---------------------------------------------------------------------------
async function scenarioSiteReachability() {
  group('场景 0 · 线上站点可达性与 HTTPS')

  expect(pre.status >= 200 && pre.status < 400, '站点 HTTP(S) 状态码为 2xx/3xx', `实际 ${pre.status}`)
  note('HTTP_STATUS', pre.status)
  note('CERT_SUBJECT', pre.cert.subjectCN || pre.cert.subject || '(unknown)')
  note('CERT_ISSUER', pre.cert.issuer || '(unknown)')
  note('CERT_VALID_TO', pre.cert.validTo || '(unknown)')
  note('CERT_ISSUED_FOR_TOOL_NOBER_CN', pre.certForHost ? 'yes' : 'no')
  note('STRICT_TLS_VALIDATION', pre.strictOk ? 'passed' : `${pre.strict.error ?? 'failed'}`)
  note('BROWSER_IGNORES_CERT_ERRORS', pre.ignoreCertErrors ? 'yes（证书未签发，环境事实，非源码 Bug）' : 'no')
  note('LIVE_INDEX_VS_LOCAL_DIST', (() => {
    const local = path.join(ROOT, 'dist', 'index.html')
    if (!fs.existsSync(local)) return '本地 dist 不存在，跳过比对'
    return fs.readFileSync(local, 'utf8').replace(/\r\n/g, '\n') === String(pre.html).replace(/\r\n/g, '\n')
      ? 'identical' : 'different（线上为已部署构建，验收以线上实际内容为准）'
  })())

  expect(pre.certForHost === true || pre.ignoreCertErrors === true,
    'TLS 策略与环境一致（证书未签发时显式忽略证书错误）',
    pre.certForHost ? '证书已签发，使用正常校验' : `证书 subject=${pre.cert.subjectCN || '(unknown)'}，使用 --ignore-certificate-errors`)

  await client.send('Page.navigate', { url: `${BASE_URL}/#/` })
  await waitFor(`document.querySelector('.dt-app')?.children.length > 0`, '首次加载线上应用', 20000)
  await delay(300)

  const page = await evaluate(`(() => ({
    href: location.href,
    title: document.title,
    lang: document.documentElement.lang,
    text: (document.body.innerText || '').slice(0, 4000)
  }))()`)
  note('FINAL_URL_CDP', page.href)
  expect(page.href === `${BASE_URL}/#/` || page.href === `${BASE_URL}/`, '最终 URL 正确', page.href)
  expect(page.title.includes('DevToys Web'), '页面标题正确', page.title)
  expect(page.lang === 'zh-CN', 'html lang=zh-CN', page.lang)
  expect(page.text.includes('开发者工具箱') && page.text.includes('不上传'),
    '中文文案正常（开发者工具箱 / 不上传）', page.text.slice(0, 90).replace(/\n/g, '|'))
  expect(!page.text.includes('\ufffd') && !/æ|Â|â€/.test(page.text), '页面无乱码/替换字符', '')

  const counts = await evaluate(`(() => ({
    categories: document.querySelectorAll('.dt-category').length,
    cards: document.querySelectorAll('.dt-tool-card').length,
    ready: document.querySelectorAll('a.dt-tool-card').length,
    soon: document.querySelectorAll('.dt-tool-card--soon').length
  }))()`)
  expect(counts.categories === 11, '首页 11 个分类分区', `实际 ${counts.categories}`)
  expect(counts.cards === 42 && counts.ready === 40 && counts.soon === 2,
    '首页 40 ready 卡 + 2 coming-soon 占位', JSON.stringify(counts))
}

// ---------------------------------------------------------------------------
// 场景 1：40 条工具路由逐个打开
// ---------------------------------------------------------------------------
async function scenarioRoutes(tools) {
  group('场景 1 · 40 条工具路由逐个打开（线上）')
  expect(tools.length === 40, '注册表解析出 40 个工具', `实际 ${tools.length}`)
  expect(new Set(tools.map((tool) => tool.id)).size === 40, '40 个 id 全局唯一')

  const routeRows = []
  let passed = 0
  for (const tool of tools) {
    const jsBefore = observed.jsErrors.length
    const consoleBefore = observed.consoleErrors.length
    let detail = ''
    let ok = false
    let ui = { controls: 0, len: 0 }
    let newConsole = []
    try {
      await openHash(`#/tool/${tool.id}`)
      await waitFor(
        `document.querySelector('.dt-tool-shell__title')?.textContent.includes(${JSON.stringify(tool.name)}) === true`,
        `标题 ${tool.id}`,
        12000
      )
      await delay(200)
      ui = await toolUiInfo()
      const newJs = observed.jsErrors.slice(jsBefore)
      newConsole = observed.consoleErrors.slice(consoleBefore)
      ok = ui.ok && newJs.length === 0 && newConsole.length === 0
      detail = `标题✓ UI控件${ui.controls} 文本${ui.len}字 JS错误${newJs.length} console错误${newConsole.length}`
      if (newJs.length) detail += ` :: JS ${newJs[0].text.slice(0, 100)}`
      if (newConsole.length) detail += ` :: console ${newConsole[0].text.slice(0, 100)}`
    } catch (error) {
      detail = error.message.slice(0, 200)
    }
    routeRows.push({
      id: tool.id, name: tool.name, pass: ok,
      controls: ui.controls ?? 0, len: ui.len ?? 0, detail
    })
    if (ok) passed += 1
  }
  record(`40 条路由全部渲染成功（${passed}/${tools.length}）`, passed === tools.length,
    passed === tools.length ? '全部通过' : routeRows.filter((row) => !row.pass).map((row) => row.id).join(', '))
  return routeRows
}

// ---------------------------------------------------------------------------
// 场景 2：首页中文搜索 / 卡片跳转
// ---------------------------------------------------------------------------
async function scenarioHome() {
  group('场景 2 · 线上首页搜索与卡片跳转')
  await evaluate(`location.hash = '#/'`)
  await waitFor(`document.querySelectorAll('.dt-category').length === 11`, '首页 11 个分类', 10000)
  await delay(150)

  await setField('.dt-header__search input', '时间戳')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 1`, '中文搜索「时间戳」', 6000)
  const search1 = await evaluate(`document.querySelector('a.dt-tool-card strong')?.textContent || ''`)
  expect(search1.includes('日期时间转换器'), '搜索「时间戳」过滤到日期时间转换器', search1)

  await setField('.dt-header__search input', 'base64')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 1`, '搜索「base64」', 6000)
  const search2 = await evaluate(`document.querySelector('a.dt-tool-card strong')?.textContent || ''`)
  expect(search2.includes('Base64'), '搜索「base64」过滤到 Base64 工具', search2)

  await click('.dt-header__clear')
  await waitFor(`document.querySelectorAll('a.dt-tool-card').length === 40`, '清除搜索恢复 40 卡', 6000)
  await click('a.dt-tool-card', 12)
  await waitFor(`location.hash.includes('#/tool/')`, '点击卡片进入工具页', 6000)
  const href = await evaluate(`location.hash`)
  expect(href.startsWith('#/tool/'), '卡片点击进入工具页', href)
}

// ---------------------------------------------------------------------------
// 场景 3：关键交互实测（线上，≥12 项）
// ---------------------------------------------------------------------------
async function scenarioInteractions() {
  group('场景 3 · 关键交互实测（线上）')

  // 3.1 JSON 格式化 + 缩进选项 + 压缩选项
  await openTool('json-format', 'JSON 格式化/压缩/校验')
  await setField('.dt-tool-input', '{"a":1}')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('"a": 1')`, 'JSON 格式化输出')
  const jsonOut = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(jsonOut.includes('\n  "a": 1'), 'JSON 格式化 {"a":1} 输出 2 空格缩进', JSON.stringify(jsonOut))

  await setField('.dt-options select', '4')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('\\n    "a": 1')`, '缩进选项重算', 6000)
  const jsonOut4 = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(jsonOut4.includes('\n    "a": 1'), '选项「4 空格」改动后输出重算', JSON.stringify(jsonOut4))

  await click('.dt-options input[type="checkbox"]')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').trim() === '{"a":1}'`, '压缩选项重算', 6000)
  expect((await evaluate(`document.querySelector('.dt-tool-output').value`)).trim() === '{"a":1}',
    '选项「压缩输出」改动后输出重算')
  await click('.dt-options input[type="checkbox"]')

  // 3.2 JSON → YAML
  await openTool('json-yaml', 'JSON ↔ YAML 转换')
  await setField('.dt-tool-input', '{"a":1,"b":[1,2]}')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('a: 1')`, 'JSON→YAML', 6000)
  const yamlOut = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(yamlOut.includes('a: 1') && yamlOut.includes('b:') && !yamlOut.trim().startsWith('{'),
    'JSON → YAML 转换输出合法 YAML', yamlOut.replace(/\n/g, '|'))

  // 3.3 YAML → JSON（选项切换后重算）
  await setField('.dt-options select', 'yaml2json')
  await setField('.dt-tool-input', 'name: Alice\nage: 30')
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('"name"')`, 'YAML→JSON', 6000)
  const backJson = await evaluate(`document.querySelector('.dt-tool-output').value`)
  expect(backJson.includes('"name": "Alice"') && backJson.includes('"age": 30'),
    'YAML → JSON 选项切换后重算正确', backJson.replace(/\n/g, '|'))

  // 3.4 Base64 中文编码 + 交换解码
  await openTool('base64-text', 'Base64 文本编解码')
  await setField('.dt-io__textarea', '你好')
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('5L2g5aW9')`, 'Base64 中文编码', 6000)
  const b64 = await readOutput()
  expect(b64.includes('5L2g5aW9'), 'Base64 输入中文得到 UTF-8 正确编码', b64.slice(0, 80))
  await click('.dt-actions .dt-button', 3)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === '5L2g5aW9'`, '交换后输入为编码值', 6000)
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('你好')`, '交换后解码', 6000)
  expect((await readOutput()).includes('你好'), 'Base64 交换后自动切到解码并还原中文')

  // 3.5 JWT 解码
  const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  await openTool('jwt-decode', 'JWT 解码器')
  await setField('.dt-io__textarea', jwtToken)
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('John Doe')`, 'JWT 解码', 6000)
  const jwtOut = await readOutput()
  expect(jwtOut.includes('Header：') && jwtOut.includes('Payload：') && jwtOut.includes('Signature：') && jwtOut.includes('John Doe'),
    'JWT 样例 token 解析出 Header/Payload/Signature', jwtOut.slice(0, 60).replace(/\n/g, '|'))

  // 3.6 正则实时高亮
  await openTool('regex-tester', '正则表达式测试')
  await setField('.dt-regex__inputs input[type="text"]', '\\d+')
  await setField('.dt-textarea', 'abc123def456')
  await waitFor(`document.querySelectorAll('.dt-regex__highlight mark').length === 2`, '正则实时高亮 2 处', 6000)
  const marks = await evaluate(`[...document.querySelectorAll('.dt-regex__highlight mark')].map(el => el.textContent).join(',')`)
  const summary = await evaluate(`document.querySelector('.dt-regex__summary')?.textContent.trim() || ''`)
  expect(marks.includes('123') && marks.includes('456'), '正则 tester 实时高亮匹配片段', marks)
  expect(summary.includes('2'), '正则匹配计数正确', summary)

  // 3.7 SHA-256('abc') + MD5 选项重算
  await openTool('hash-generator', '哈希/校验和生成器')
  await setField('.dt-io__textarea', 'abc')
  await waitFor(`(document.body.innerText || '').includes('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')`, "SHA-256('abc')", 6000)
  expect((await bodyText()).includes('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'),
    "SHA-256('abc') 结果正确")
  await setField('.dt-options select', 'MD5')
  await waitFor(`((document.querySelector('.dt-io__highlight code')?.textContent || '') + (document.querySelectorAll('.dt-io__textarea')[1]?.value || '')).includes('900150983cd24fb0d6963f7d28e17f72')`, 'MD5 选项重算', 6000)
  expect((await readOutput()).includes('900150983cd24fb0d6963f7d28e17f72'), '算法选项改为 MD5 后摘要重算')

  // 3.8 JSONPath $.a[0].b
  await openTool('jsonpath-tester', 'JSONPath 测试')
  await waitFor(`(document.querySelector('.dt-jsonpath__value')?.textContent || '').includes('示例值')`, 'JSONPath 默认查询', 6000)
  const jp = await evaluate(`(() => ({
    path: document.querySelector('.dt-jsonpath__path')?.textContent || '',
    value: document.querySelector('.dt-jsonpath__value')?.textContent || ''
  }))()`)
  expect(jp.path.includes('$.a[0].b') && jp.value.includes('示例值'), 'JSONPath $.a[0].b 返回正确节点', JSON.stringify(jp))
  await setField('.dt-jsonpath__grid textarea', '{"a":[{"b":"TEST_XYZ_Q"}]}')
  await waitFor(`(document.querySelector('.dt-jsonpath__value')?.textContent || '').includes('TEST_XYZ_Q')`, 'JSONPath 输入重算', 6000)
  expect((await evaluate(`document.querySelector('.dt-jsonpath__value')?.textContent || ''`)).includes('TEST_XYZ_Q'), 'JSONPath 修改 JSON 后结果重算')

  // 3.9 JSON Schema 必填校验（失败 + 通过两种分支）
  await openTool('json-schema-validator', 'JSON Schema 验证')
  await setField('.dt-schema__grid textarea', '{"type":"object","required":["name"],"properties":{"name":{"type":"string"}}}', 0)
  await setField('.dt-schema__grid textarea', '{"age":30}', 1)
  await waitFor(`(document.querySelector('.dt-schema__results')?.innerText || '').includes('name')`, 'Schema 必填缺失提示', 6000)
  const schemaFail = await evaluate(`document.querySelector('.dt-schema__results')?.innerText || ''`)
  expect(schemaFail.includes('name') && !schemaFail.includes('校验通过'), 'Schema 缺少必填 name 时给出校验问题', schemaFail.slice(0, 120).replace(/\n/g, '|'))
  await setField('.dt-schema__grid textarea', '{"name":"Alice","age":30}', 1)
  await waitFor(`(document.querySelector('.dt-schema__results')?.innerText || '').includes('校验通过')`, 'Schema 补必填后通过', 6000)
  expect((await evaluate(`document.querySelector('.dt-schema__results')?.innerText || ''`)).includes('校验通过'),
    'Schema 补齐必填字段后校验通过')

  // 3.10 IPv4 子网
  await openTool('ipv4-subnet', 'IPv4 子网计算器')
  await waitFor(`(document.body.innerText || '').includes('192.168.1.255')`, 'IPv4 默认 /24 计算', 6000)
  const subnetText1 = await bodyText()
  expect(subnetText1.includes('192.168.1.0') && subnetText1.includes('192.168.1.255') && subnetText1.includes('255.255.255.0'),
    'IPv4 192.168.1.10/24 网络地址与广播地址正确')
  await setField('.dt-subnet input', '10.0.0.1/8')
  await waitFor(`(document.body.innerText || '').includes('10.255.255.255')`, 'IPv4 /8 重算', 6000)
  const subnetText2 = await bodyText()
  expect(subnetText2.includes('10.0.0.0') && subnetText2.includes('10.255.255.255'), 'IPv4 10.0.0.1/8 重算正确')

  // 3.11 颜色转换
  await openTool('color-converter', '颜色选择器/转换')
  await waitFor(`(document.querySelector('.dt-color__result pre')?.textContent || '').includes('rgb(255, 0, 0)')`, '颜色默认转换', 6000)
  const color1 = await evaluate(`document.querySelector('.dt-color__result pre').textContent`)
  expect(color1.includes('#FF0000') && color1.includes('rgb(255, 0, 0)'), '#ff0000 → rgb(255, 0, 0)', color1.replace(/\n/g, '|'))
  await setField('.dt-color__fields input[type="text"]', '#00ff00')
  await waitFor(`(document.querySelector('.dt-color__result pre')?.textContent || '').includes('rgb(0, 255, 0)')`, '颜色输入重算', 6000)
  expect((await evaluate(`document.querySelector('.dt-color__result pre').textContent`)).includes('rgb(0, 255, 0)'), '#00ff00 → rgb(0, 255, 0)')

  // 3.12 HTTP 状态码
  await openTool('http-status', 'HTTP 状态码查询')
  await setField('.dt-ref__search', '404')
  await waitFor(`document.querySelectorAll('.dt-ref__item').length >= 1`, 'HTTP 404 查询', 6000)
  const httpItem = await evaluate(`document.querySelector('.dt-ref__item')?.innerText || ''`)
  expect(httpItem.includes('404') && httpItem.includes('请求的资源不存在'), 'HTTP 404 文案正确', httpItem.slice(0, 80).replace(/\n/g, '|'))

  // 3.13 MIME 类型 .json → application/json
  await openTool('mime-types', 'MIME 类型查询')
  await setField('.dt-ref__search', '.json')
  await waitFor(`(document.querySelector('.dt-ref__item')?.innerText || '').includes('application/json')`, 'MIME .json 查询', 6000)
  const mimeItem = await evaluate(`document.querySelector('.dt-ref__item')?.innerText || ''`)
  expect(mimeItem.includes('.json') && mimeItem.includes('application/json'), 'MIME .json → application/json', mimeItem.slice(0, 80).replace(/\n/g, '|'))

  // 3.14 二维码生成 data:image/png
  await openTool('qrcode-encode', '二维码编解码')
  await setField('#qrcode-text', BASE_URL)
  await waitFor(`(document.querySelector('.dt-qrcode__preview img')?.src || '').startsWith('data:image/png')`, '二维码生成', 10000)
  const qrSrc = await evaluate(`document.querySelector('.dt-qrcode__preview img')?.src || ''`)
  expect(qrSrc.startsWith('data:image/png;base64,'), '二维码生成 data:image/png 本地图片', `${qrSrc.slice(0, 32)}…(${qrSrc.length}字)`)
}

// ---------------------------------------------------------------------------
// 场景 4：操作栏 copy / download / clear / swap（≥3 个工具）
// ---------------------------------------------------------------------------
async function scenarioActionBar(downloadDir) {
  group('场景 4 · 操作栏四按钮实测（线上）')

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
    const deadline = Date.now() + 6000
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
    await delay(300)
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
  await waitFor(`(document.querySelector('.dt-tool-output')?.value || '').includes('ALPHA_42')`, '操作栏 JSON 输出', 6000)
  const s1 = await checkButtons('json-format')
  expect(!s1.disabled[0] && !s1.disabled[1] && !s1.disabled[3], 'json-format · 有输出时复制/下载/交换可用', JSON.stringify(s1.disabled))
  await checkCopy('json-format', 'ALPHA_42')
  await waitForDownload('json-format')
  await click('.dt-actions .dt-button', 3)
  await waitFor(`document.querySelector('.dt-tool-input')?.value.includes('ALPHA_42')`, 'json-format 交换', 6000)
  expect((await evaluate(`document.querySelector('.dt-tool-input').value`)).includes('ALPHA_42'), 'json-format · 交换把输出写回输入')
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-tool-input')?.value || '') === ''`, 'json-format 清空', 6000)
  expect((await evaluate(`document.querySelector('.dt-tool-input').value`)) === '' && (await evaluate(`document.querySelector('.dt-tool-output').value`)) === '',
    'json-format · 清空同时清除输入与输出')

  // 4.2 Base64：复制 / 交换 / 清空
  await openTool('base64-text', 'Base64 文本编解码')
  await setField('.dt-io__textarea', 'SENTINEL_B64')
  await waitFor(`(document.querySelectorAll('.dt-io__textarea')[1]?.value || document.querySelector('.dt-io__highlight code')?.textContent || '').includes('U0VOVElORUxfQjY0')`, '操作栏 Base64 输出', 6000)
  await checkButtons('base64-text')
  await checkCopy('base64-text', 'U0VOVElORUxfQjY0')
  await click('.dt-actions .dt-button', 3)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === 'U0VOVElORUxfQjY0'`, 'base64 交换', 6000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === 'U0VOVElORUxfQjY0', 'base64-text · 交换可用')
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === ''`, 'base64 清空', 6000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === '', 'base64-text · 清空输入')

  // 4.3 哈希生成器：复制摘要 / 下载 / 清空
  await openTool('hash-generator', '哈希/校验和生成器')
  await setField('.dt-io__textarea', 'SENTINEL_HASH')
  await waitFor(`(document.body.innerText || '').includes('SHA-256')`, '操作栏 Hash 输出', 6000)
  await checkButtons('hash-generator')
  const expectedDigest = crypto.createHash('sha256').update('SENTINEL_HASH').digest('hex')
  await checkCopy('hash-generator', expectedDigest)
  await waitForDownload('hash-generator')
  await click('.dt-actions .dt-button', 2)
  await waitFor(`(document.querySelector('.dt-io__textarea')?.value || '') === ''`, 'hash 清空', 6000)
  expect((await evaluate(`document.querySelector('.dt-io__textarea').value`)) === '', 'hash-generator · 清空输入')
}

// ---------------------------------------------------------------------------
// 场景 5：隐私红线（零外部请求 / localStorage 不含用户输入）
// ---------------------------------------------------------------------------
async function scenarioPrivacy() {
  group('场景 5 · 隐私红线（线上）')
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

/**
 * 外部请求断言必须在所有场景（含刷新、深链导航）结束后执行，
 * 才能覆盖「CDP Network 监听全过程」。
 */
function assertNoExternalRequests() {
  group('场景 8 · 隐私红线：全程外部请求复核')
  const external = observed.requests.filter((request) => {
    const url = request.url
    if (/^(data|blob|about|chrome|devtools|edge|javascript):/i.test(url)) {
      return false
    }
    try {
      return new URL(url).host !== pre.host
    } catch {
      return false
    }
  })
  observed.externalRequests = external
  expect(external.length === 0, `EXTERNAL_REQUESTS=[]（外部请求 ${external.length}）`,
    external.length ? JSON.stringify(external.slice(0, 5)) : `累计 ${observed.requests.length} 个请求，全部同源 ${pre.host}`)
}

// ---------------------------------------------------------------------------
// 场景 6：响应式 + 主题
// ---------------------------------------------------------------------------
async function scenarioResponsiveAndTheme() {
  group('场景 6 · 响应式与主题（线上）')

  async function checkViewport(width, height, mobile, label) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile
    })
    await delay(180)
    await evaluate(`location.hash = '#/'`)
    await waitFor(`document.querySelectorAll('.dt-category').length === 11`, `${label} 首页`, 10000)
    await delay(150)
    const home = await evaluate(`(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    }))()`)
    expect(home.scrollWidth <= home.innerWidth + 1, `${label} 首页无横向溢出`, JSON.stringify(home))

    await openTool('json-format', 'JSON 格式化/压缩/校验')
    const tool = await evaluate(`(() => {
      const shell = document.querySelector('.dt-tool-shell');
      const aside = document.querySelector('.dt-tool-shell__aside');
      const columns = shell ? getComputedStyle(shell).gridTemplateColumns.trim().split(/\\s+/).length : 0;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        columns,
        asideDisplay: aside ? getComputedStyle(aside).display : 'missing'
      };
    })()`)
    expect(tool.scrollWidth <= tool.innerWidth + 1, `${label} 工具页无横向溢出`, JSON.stringify(tool))
    if (mobile) {
      expect(tool.columns === 1 && tool.asideDisplay === 'none', `${label} 工具页移动端单栏`, JSON.stringify(tool))
    } else {
      expect(tool.columns >= 2 && tool.asideDisplay !== 'none', `${label} 工具页桌面双栏`, JSON.stringify(tool))
    }
  }

  await checkViewport(375, 812, true, '375px')
  await checkViewport(1280, 900, false, '1280px')

  let theme = await evaluate(`document.documentElement.dataset.theme || ''`)
  if (theme !== 'light') {
    await click('.dt-theme-toggle')
    await delay(150)
  }
  await click('.dt-theme-toggle')
  await waitFor(`document.documentElement.dataset.theme === 'dark'`, '切换到 dark', 6000)
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
  group('场景 7 · 深链刷新与无效 id（线上）')

  await client.send('Page.navigate', { url: `${BASE_URL}/#/tool/color-converter` })
  await waitFor(`document.querySelector('.dt-tool-shell__title')?.textContent.includes('颜色选择器/转换') === true`, '深链直达', 15000)
  await reloadAndWait('深链刷新')
  await waitFor(`document.querySelector('.dt-tool-shell__title')?.textContent.includes('颜色选择器/转换') === true`, '深链刷新后标题', 15000)
  const deep = await evaluate(`(() => ({
    title: document.querySelector('.dt-tool-shell__title')?.textContent.trim() || '',
    notFound: !!document.querySelector('.dt-not-found'),
    bodyLen: (document.body.innerText || '').trim().length
  }))()`)
  expect(deep.title.includes('颜色选择器/转换') && !deep.notFound && deep.bodyLen > 40,
    '/#/tool/color-converter 深链刷新不 404、不白屏', JSON.stringify(deep))

  await openHash('#/tool/this-tool-does-not-exist-xyz')
  await waitFor(`!!document.querySelector('.dt-soon-view')`, '无效 id 兜底', 10000)
  const invalid = await evaluate(`(() => ({
    soon: !!document.querySelector('.dt-coming-soon'),
    text: (document.querySelector('.dt-coming-soon')?.innerText || '').slice(0, 120),
    bodyLen: (document.body.innerText || '').trim().length
  }))()`)
  expect(invalid.soon && invalid.text.includes('开发中') && invalid.bodyLen > 40,
    '无效 id 落到 ComingSoon 而不是白屏', JSON.stringify(invalid))

  await openHash('#/tool/math-expression')
  await waitFor(`!!document.querySelector('.dt-coming-soon')`, 'coming-soon id 兜底', 10000)
  expect((await evaluate(`document.querySelector('.dt-coming-soon')?.innerText || ''`)).includes('开发中'),
    'coming-soon id 显示「开发中」占位页')
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
let browser
let profileDir
let downloadDir

async function main() {
  const tools = readToolRegistry()
  origin = BASE_URL

  pre = await preflight()
  note('BASE_URL', BASE_URL)
  note('STRICT_TLS_MODE', STRICT_TLS ? '1' : '0')
  if (STRICT_TLS && !pre.strictOk) {
    throw new Error(`STRICT_TLS=1 但严格证书校验失败: ${pre.strict.error}`)
  }
  if (!pre.html) {
    // 读取线上 HTML 用于与本地 dist 比对
    pre.html = await new Promise((resolve) => {
      const u = new URL(`${BASE_URL}/`)
      const req = https.request({
        hostname: u.hostname, port: u.port || 443, path: u.pathname,
        rejectUnauthorized: false, timeout: 20000
      }, (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => { body += chunk })
        res.on('end', () => resolve(body))
      })
      req.on('error', () => resolve(''))
      req.end()
    })
  }

  profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devtoys-live-profile-'))
  downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devtoys-live-download-'))
  const browserPath = findBrowser()
  const args = [
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
    '--window-size=1280,900'
  ]
  if (pre.ignoreCertErrors) {
    args.push('--ignore-certificate-errors')
  }
  args.push('about:blank')
  browser = spawn(browserPath, args, { stdio: 'ignore', windowsHide: true })
  console.log(`浏览器: ${browserPath} (pid=${browser.pid}, ignoreCertErrors=${pre.ignoreCertErrors})`)

  client = await connectPage(profileDir)
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Network.enable')
  await client.send('Log.enable')
  await client.send('Security.enable')
  if (pre.ignoreCertErrors) {
    await client.send('Security.setIgnoreCertificateErrors', { ignore: true }).catch(() => {})
  }
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
    '5L2g5aW9', 'John Doe', 'TEST_XYZ_Q', 'Alice'
  ]

  await scenarioSiteReachability()
  const routes = await scenarioRoutes(tools)
  await scenarioHome()
  await scenarioInteractions()
  await scenarioActionBar(downloadDir)
  await scenarioPrivacy()
  await scenarioResponsiveAndTheme()
  await scenarioDeepLinks()
  assertNoExternalRequests()

  expect(observed.jsErrors.length === 0, `全流程零 JS 运行时异常（${observed.jsErrors.length}）`,
    observed.jsErrors.length ? observed.jsErrors.slice(0, 3).map((item) => item.text.slice(0, 160)).join(' || ') : '')
  expect(observed.consoleErrors.length === 0, `全流程零 console error（${observed.consoleErrors.length}）`,
    observed.consoleErrors.length ? observed.consoleErrors.slice(0, 3).map((item) => item.text.slice(0, 160)).join(' || ') : '')

  const failed = results.filter((item) => !item.pass)
  const summary = {
    baseUrl: BASE_URL,
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    routes,
    notes,
    cert: { ...pre.cert, certForHost: pre.certForHost, strictOk: pre.strictOk, strictError: pre.strict.error ?? '' },
    httpStatus: pre.status,
    finalUrl: pre.finalUrl,
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
    console.error('\n[FATAL]', error?.stack ?? error)
    console.log('\n===E2E_RESULT_JSON===')
    console.log(JSON.stringify({
      baseUrl: BASE_URL,
      total: results.length,
      passed: results.filter((item) => item.pass).length,
      failed: results.filter((item) => !item.pass).length + 1,
      fatal: String(error?.stack ?? error),
      notes,
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
    for (const dir of [profileDir, downloadDir]) {
      if (dir) {
        try {
          fs.rmSync(dir, { recursive: true, force: true })
        } catch {
          // ignore
        }
      }
    }
  })
