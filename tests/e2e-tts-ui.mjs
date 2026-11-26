// TTS 工具专项 E2E：验证韵律引擎开关与进度面板的真实渲染与交互。
// 复用 e2e-smoke.mjs 的无依赖 CDP 方案（Edge/Chrome headless + Node 内置 WebSocket）。
// 运行：先 npm run build，再 node tests/e2e-tts-ui.mjs
// 说明：不做真实模型下载断言（首次需 40MB 下载，环境依赖大），
// 只验证 UI 状态机：开关、配置区显隐、面板出现与阶段标签、取消可用性。
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist 不存在，请先 npm run build')
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8'
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// —— 与 e2e-smoke 相同的最小 CDP 客户端 ——
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
      ws.addEventListener('error', () => reject(new Error(`CDP WebSocket 连接失败: ${url}`)), { once: true })
    })
    return new CdpClient(ws)
  }
  #onMessage(raw) {
    const message = JSON.parse(raw)
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id)
      this.pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message ?? 'CDP error'))
      else resolve(message.result ?? {})
      return
    }
    if (message.method) {
      for (const handler of this.handlers.get(message.method) ?? []) {
        try { handler(message.params ?? {}) } catch { /* ignore */ }
      }
    }
  }
  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, [])
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
      expression, returnByValue: true, awaitPromise: true, userGesture: true
    })
    if (response.exceptionDetails) {
      throw new Error(`Runtime.evaluate 异常: ${response.exceptionDetails.exception?.description ?? response.exceptionDetails.text}`)
    }
    return response.result?.value
  }
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
    const requested = pathname === '/' || !path.extname(pathname) ? '/index.html' : pathname
    const file = path.join(DIST, requested)
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end()
      return
    }
    fs.readFile(file, (error, buffer) => {
      if (error) { res.writeHead(404).end(); return }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' })
      res.end(buffer)
    })
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })))
}

function findBrowser() {
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
  ]
  const found = candidates.find((c) => fs.existsSync(c))
  if (!found) throw new Error('未找到 Edge/Chrome')
  return found
}

async function waitForDebugPort(profileDir, timeoutMs = 20000) {
  const portFile = path.join(profileDir, 'DevToolsActivePort')
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (fs.existsSync(portFile)) {
      const firstLine = fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]
      if (/^\d+$/.test(firstLine)) return Number(firstLine)
    }
    await delay(100)
  }
  throw new Error(`等待浏览器 CDP 端口超时: ${portFile}`)
}

// —— 测试主体 ——
const results = []
function record(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? '✓' : '✗'} ${name}${detail ? ` :: ${detail}` : ''}`)
}

async function waitFor(client, expression, label, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs
  let last
  while (Date.now() < deadline) {
    try {
      last = await client.evaluate(expression)
      if (last) return last
    } catch (error) {
      last = error.message
    }
    await delay(60)
  }
  throw new Error(`等待超时（${label}），最后值: ${JSON.stringify(last)}`)
}

const { server, port } = await startStaticServer()
const origin = `http://127.0.0.1:${port}`
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devtoys-tts-profile-'))
const browserPath = findBrowser()
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-component-update', '--disable-default-apps',
  '--disable-sync', '--disable-extensions', '--no-proxy-server',
  '--remote-debugging-port=0', `--user-data-dir=${profileDir}`,
  '--window-size=1280,900', 'about:blank'
], { stdio: 'ignore', windowsHide: true })

let client
const jsErrors = []
try {
  const debugPort = await waitForDebugPort(profileDir)
  const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()
  const page = targets.find((t) => t.type === 'page')
  client = await CdpClient.connect(page.webSocketDebuggerUrl)
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Network.enable')
  client.on('Runtime.exceptionThrown', (params) => {
    jsErrors.push(params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text ?? '')
  })

  await client.evaluate(`location.href = ${JSON.stringify(`${origin}/#/tool/text-to-speech`)}`)
  await waitFor(client, `document.querySelector('.dt-tts') !== null`, 'TTS 工具页加载', 15000)
  await delay(300)

  // 1. 韵律引擎下拉
  const prosody = await client.evaluate(`(() => {
    const el = document.querySelector('#tts-prosody')
    if (!el) return { exists: false }
    return {
      exists: true,
      value: el.value,
      options: [...el.options].map(o => o.value)
    }
  })()`)
  record('语气语速下拉存在', prosody.exists === true)
  record('默认引擎为本地规则 rules', prosody.value === 'rules', `当前 ${prosody.value}`)
  record('引擎下拉恰有 rules/cloud/off 三项', JSON.stringify(prosody.options?.sort()) === JSON.stringify(['cloud', 'off', 'rules']), JSON.stringify(prosody.options))

  // 2. cloud 切换：配置入口显隐
  await client.evaluate(`(() => {
    const el = document.querySelector('#tts-prosody')
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    setter.call(el, 'cloud')
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })()`)
  await delay(250)
  const cloudToggle = await client.evaluate(`document.querySelector('.dt-tts__cloud-toggle') !== null`)
  record('cloud 引擎显示「配置接口」入口', cloudToggle === true)

  if (cloudToggle) {
    await client.evaluate(`document.querySelector('.dt-tts__cloud-toggle').click()`)
    await delay(250)
    const hasEndpoint = await client.evaluate(`document.querySelector('.dt-tts__cloud-form input[type="url"]') !== null`)
    const hasModel = await client.evaluate(`document.querySelector('.dt-tts__cloud-form input[type="text"]') !== null`)
    const hasKey = await client.evaluate(`document.querySelector('.dt-tts__cloud-form input[type="password"]') !== null`)
    record('展开后提供 接口地址/模型/Key 三个输入', hasEndpoint && hasModel && hasKey)
  }

  await client.evaluate(`(() => {
    const el = document.querySelector('#tts-prosody')
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    setter.call(el, 'off')
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })()`)
  await delay(250)
  const cloudGone = await client.evaluate(`document.querySelector('.dt-tts__cloud-toggle') === null`)
  record('切回 off 后配置入口消失', cloudGone === true)

  // 3. 空闲时无进度面板
  const idle = await client.evaluate(`document.querySelector('.dt-progress') === null`)
  record('空闲时进度面板不渲染', idle === true)

  // 4. 触发生成（模型会开始下载，仅断言 UI 状态机）
  await client.evaluate(`(() => {
    const el = document.querySelector('#tts-prosody')
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    setter.call(el, 'rules')
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })()`)
  await client.evaluate(`(() => {
    const el = document.querySelector('#tts-text')
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
    setter.call(el, '你好，世界！今天怎么样？再见。')
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })()`)
  await client.evaluate(`(() => {
    const el = document.querySelector('#tts-role')
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
    setter.call(el, 'model-default')
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })()`)
  await delay(150)
  await client.evaluate(`document.querySelector('.dt-tts__actions .dt-tts__button').click()`)
  await delay(500)

  // 面板出现 + 阶段标签
  try {
    await waitFor(client, `document.querySelector('.dt-progress') !== null`, '进度面板出现', 8000)
    record('点击生成后进度面板出现', true)
  } catch {
    record('点击生成后进度面板出现', false, '8 秒内未见面板（可能模型秒加载完成，见下一条）')
  }

  const stageLabels = await client.evaluate(`[...document.querySelectorAll('.dt-progress__step .dt-progress__label')].map(el => el.textContent)`)
  const expected = ['下载模型', '准备引擎', '分析文本', '合成语音', '完成']
  record('五阶段标签齐全', expected.every((s) => stageLabels.includes(s)), stageLabels.join(','))

  const summary = await client.evaluate(`(document.querySelector('.dt-progress__summary')?.textContent || '').trim()`)
  record('进度摘要非空（模型名或下载提示）', summary.length > 0, summary.slice(0, 50))

  const hasCancel = await client.evaluate(`document.querySelector('.dt-progress__cancel') !== null`)
  record('生成期间提供取消按钮', hasCancel === true)

  // 5. 点取消 → 面板收起、按钮恢复
  if (hasCancel) {
    await client.evaluate(`document.querySelector('.dt-progress__cancel').click()`)
    await delay(600)
    const panelGone = await client.evaluate(`document.querySelector('.dt-progress') === null`)
    const buttonRestored = await client.evaluate(`(() => {
      const btn = document.querySelector('.dt-tts__actions .dt-tts__button')
      return btn && !btn.disabled && !btn.textContent.includes('…')
    })()`)
    record('取消后进度面板收起', panelGone === true)
    record('取消后生成按钮恢复可用', buttonRestored === true)
    const cancelNote = await client.evaluate(`(document.querySelector('.dt-tts__note')?.textContent || '').includes('取消')`)
    record('取消后提示「已取消」', cancelNote === true)
  }

  record('全程零 JS 错误', jsErrors.length === 0, jsErrors.slice(0, 2).join(' | '))

  const failed = results.filter((r) => !r.pass)
  console.log('\n=== TTS UI E2E 结果 ===')
  console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length }, null, 0))
  process.exitCode = failed.length ? 1 : 0
} finally {
  try { client?.ws?.close() } catch { /* ignore */ }
  if (process.platform === 'win32' && browser.pid) {
    spawnSync('taskkill', ['/PID', String(browser.pid), '/T', '/F'], { stdio: 'ignore' })
  }
  server.close()
}
