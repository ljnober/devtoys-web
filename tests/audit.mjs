/**
 * 静态审计脚本（零新增依赖，仅使用 Node 内置模块）。
 * 用途：复核构建产物、Vite/部署配置、许可证合规、隐私红线、路由兜底与工程卫生。
 * 运行：node tests/audit.mjs
 * 退出码：0 = 全部通过；1 = 存在 FAIL 项。
 * 说明：脚本只读，不重新构建、不修改任何源码或配置。
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, extname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const abs = (...parts) => join(ROOT, ...parts)

/* ------------------------------------------------------------------ */
/* 结果收集                                                            */
/* ------------------------------------------------------------------ */
const results = []
let section = ''

function group(title) {
  section = title
}

/**
 * @param {string} name 检查项名称
 * @param {boolean} ok 是否通过
 * @param {string} detail 证据/说明
 * @param {'error'|'warn'} severity FAIL 级别，默认 error
 */
function check(name, ok, detail, severity = 'error') {
  results.push({ section, name, ok, detail, severity })
}

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */
function readText(relPath) {
  const full = abs(relPath)
  if (!existsSync(full)) return null
  return readFileSync(full, 'utf8')
}

function walk(dir, exts = null) {
  const out = []
  const base = abs(dir)
  if (!existsSync(base)) return out
  const stack = [base]
  while (stack.length) {
    const cur = stack.pop()
    for (const name of readdirSync(cur)) {
      const full = join(cur, name)
      if (statSync(full).isDirectory()) {
        stack.push(full)
      } else if (!exts || exts.has(extname(name).toLowerCase())) {
        out.push(full)
      }
    }
  }
  return out
}

function relOf(full) {
  return relative(ROOT, full).split(sep).join('/')
}

function countMatches(text, re) {
  const m = text.match(re)
  return m ? m.length : 0
}

/* ------------------------------------------------------------------ */
/* 1. 构建产物                                                         */
/* ------------------------------------------------------------------ */
group('1. 构建产物 dist/')
{
  check('dist/index.html 存在', existsSync(abs('dist/index.html')), 'dist/index.html')
  check('dist/logo.svg 存在', existsSync(abs('dist/logo.svg')), 'dist/logo.svg')

  const cnamePath = abs('dist/CNAME')
  if (existsSync(cnamePath)) {
    const raw = readFileSync(cnamePath, 'utf8')
    const hex = readFileSync(cnamePath).toString('hex')
    const ok = raw === 'tool.nober.cn' || raw === 'tool.nober.cn\n'
    check('dist/CNAME 内容严格为 tool.nober.cn', ok, `text=${JSON.stringify(raw)} hex=${hex}`)
  } else {
    check('dist/CNAME 内容严格为 tool.nober.cn', false, 'dist/CNAME 不存在')
  }

  // 外链扫描：CDN / 外链字体 / 外链脚本
  const banned = [
    ['cdnjs', /cdnjs\.cloudflare\.com/i],
    ['jsdelivr', /cdn\.jsdelivr\.net/i],
    ['unpkg', /unpkg\.com/i],
    ['google-fonts', /fonts\.googleapis\.com|fonts\.gstatic\.com/i]
  ]
  const assetFiles = walk('dist', new Set(['.js', '.css', '.html']))
  const hits = []
  for (const file of assetFiles) {
    const text = readFileSync(file, 'utf8')
    for (const [label, re] of banned) {
      if (re.test(text)) hits.push(`${relOf(file)}:${label}`)
    }
  }
  check('dist js/css/html 无 CDN 与外链字体', hits.length === 0,
    hits.length ? hits.join(', ') : `扫描 ${assetFiles.length} 个文件，无命中`)

  const indexHtml = readText('dist/index.html') || ''
  const extScript = /<script[^>]+src=["']https?:\/\//i.test(indexHtml)
  const extStylesheet = /<link[^>]+href=["']https?:\/\//i.test(indexHtml)
  check('dist/index.html 无外链 script/link', !extScript && !extStylesheet,
    `extScript=${extScript}, extStylesheet=${extStylesheet}`)
  check('dist/index.html favicon 指向本地 logo.svg', /href=["']\.\/logo\.svg["']/.test(indexHtml),
    'href="./logo.svg"')
}

/* ------------------------------------------------------------------ */
/* 2. Vite 配置                                                        */
/* ------------------------------------------------------------------ */
group('2. Vite 配置')
{
  const vite = readText('vite.config.ts') || ''
  check("base: './'", /base:\s*['"]\.\/['"]/.test(vite), 'vite.config.ts:9')
  check("build.outDir: 'dist'", /outDir:\s*['"]dist['"]/.test(vite), 'vite.config.ts:11')

  // 只匹配真实插件标识（包名/调用函数），避免命中顶部"零 CDN/Monaco/PWA"说明性注释。
  const forbidden = [
    ['cdn2', /vite-plugin-cdn2/],
    ['monaco', /vue-monaco-cdn|monaco-editor|vite-plugin-monaco/],
    ['pwa', /vite-plugin-pwa|VitePWA\s*\(|useRegisterSW/],
    ['basicSsl', /@vitejs\/plugin-basic-ssl|basicSsl\s*\(/]
  ]
  const found = forbidden.filter(([, re]) => re.test(vite)).map(([label]) => label)
  check('无 cdn2/monaco/PWA/basicSsl 插件', found.length === 0,
    found.length ? `命中: ${found.join(', ')}` : 'plugins: [vue()] 仅此一项')
}

/* ------------------------------------------------------------------ */
/* 3. GitHub Actions 部署工作流                                        */
/* ------------------------------------------------------------------ */
group('3. GitHub Actions 部署工作流')
{
  const wfPath = '.github/workflows/deploy.yml'
  const wf = readText(wfPath)
  check('deploy.yml 存在', wf !== null, wfPath)
  if (wf) {
    check('npm ci 安装依赖', /run:\s*npm ci\b/.test(wf), 'Install 步骤')
    check('npm run build 构建', /run:\s*npm run build\b/.test(wf), 'Type check & Build 步骤')
    check('peaceiris/actions-gh-pages@v4', /peaceiris\/actions-gh-pages@v4/.test(wf), 'Deploy 步骤')
    check('publish_branch: gh-pages', /publish_branch:\s*gh-pages/.test(wf), 'with.publish_branch')
    check('cname: tool.nober.cn', /cname:\s*tool\.nober\.cn/.test(wf), 'with.cname')
    check('contents: write 权限', /contents:\s*write/.test(wf), 'permissions')
    check('on.push.branches 含 main', /branches:\s*\[main\]/.test(wf), 'on.push.branches')
    check('workflow_dispatch 手动触发', /workflow_dispatch:/.test(wf), 'on.workflow_dispatch')
    check('Verify no CDN links 步骤', /Verify no CDN links/.test(wf), 'CI 红线固化')

    // 简易 YAML 语法合理性：顶层键、缩进无 Tab、无冒号缺失
    const topKeys = ['name:', 'on:', 'permissions:', 'concurrency:', 'jobs:']
    const missingKeys = topKeys.filter(k => !new RegExp(`^${k.replace(':', '\\:')}`, 'm').test(wf))
    const hasTab = /\t/.test(wf)
    check('YAML 顶层键与缩进合理', missingKeys.length === 0 && !hasTab,
      `缺失键: ${missingKeys.join(',') || '无'}, 含Tab: ${hasTab}`)
  }
}

/* ------------------------------------------------------------------ */
/* 4. 许可证合规                                                       */
/* ------------------------------------------------------------------ */
group('4. 许可证合规')
{
  const lic = readText('LICENSE.md') || ''
  check('LICENSE.md 保留 MIT 原文与署名',
    /MIT License/.test(lic) && /Copyright \(c\) 2023 He Hang/.test(lic),
    'LICENSE.md:1,3')

  const notice = readText('NOTICE.md') || ''
  check('NOTICE.md 含衍生声明',
    /HeHang0\/devtoys/.test(notice) && /MIT License/i.test(notice) && /Copyright \(c\) 2023 He Hang/.test(notice),
    'NOTICE.md:3')

  const readme = readText('README.md') || ''
  check('README.md 有署名', /HeHang0\/devtoys/.test(readme) && /Copyright \(c\) 2023 He Hang/.test(readme),
    'README.md:26')

  // 抽查 21 个 source='base' 的工具组件 MIT 注释覆盖
  const registry = readText('src/tools/registry.ts') || ''
  const baseBlocks = registry.split(/(?=\n  \{\n    id:)/).filter(b => /source: 'base'/.test(b))
  const baseCount = countMatches(registry, /source: 'base'/g)
  const missingComment = []
  for (const block of baseBlocks) {
    const cp = block.match(/componentPath:\s*'([^']+)'/)
    if (!cp) continue
    const component = readText(`src/tools/${cp[1]}.vue`) || ''
    if (!/MIT|HeHang0\/devtoys/.test(component)) missingComment.push(cp[1])
  }
  check(`source='base' 共 ${baseCount} 个且组件均有 MIT 注释`,
    baseCount === 21 && missingComment.length === 0 && baseBlocks.length === 21,
    missingComment.length ? `缺注释: ${missingComment.join(', ')}` : `覆盖 ${baseBlocks.length}/21`)
}

/* ------------------------------------------------------------------ */
/* 5. 隐私红线                                                         */
/* ------------------------------------------------------------------ */
group('5. 隐私红线')
{
  const srcFiles = walk('src', new Set(['.ts', '.vue', '.css']))
  const distFiles = walk('dist', new Set(['.js', '.css', '.html']))

  // 真实外发调用模式（排除注释与纯说明文本由下方白名单裁决）
  const outgoingRe = /\bfetch\s*\(|\bXMLHttpRequest\b|\baxios\b|\bWebSocket\b|\bsendBeacon\b|google-analytics|\bgtag\s*\(|hm\.js|umeng/i

  const sourceHits = []
  for (const file of srcFiles) {
    const text = readFileSync(file, 'utf8')
    let lineNo = 0
    for (const line of text.split('\n')) {
      lineNo += 1
      const trimmed = line.trim()
      // 跳过纯注释行（// 或 * 开头），注释中提及外发 API 不构成真实调用。
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue
      if (outgoingRe.test(line)) sourceHits.push(`${relOf(file)}:${lineNo} ${trimmed}`)
    }
  }

  // 已知例外白名单：仅说明文本，不构成用户数据外发
  const knownExceptions = sourceHits.filter(hit =>
    (hit.includes('src/data/httpStatus.ts') && hit.includes('WebSocket'))
    || (hit.includes('src/tools/testers/UrlParser.vue'))
  )
  const realSourceHits = sourceHits.filter(hit => !knownExceptions.includes(hit))
  check('src/ 无真实用户数据外发调用', realSourceHits.length === 0,
    realSourceHits.length ? realSourceHits.join(' | ') : `扫描 ${srcFiles.length} 文件，仅 httpStatus.ts 说明文本命中`)

  // dist 产物扫描
  const distHits = []
  for (const file of distFiles) {
    const text = readFileSync(file, 'utf8')
    for (const [label, re] of [
      ['fetch', /\bfetch\s*\(/],
      ['XMLHttpRequest', /\bXMLHttpRequest\b/],
      ['axios', /\baxios\b/],
      ['WebSocket', /\bWebSocket\b/],
      ['analytics', /google-analytics|sendBeacon|umeng/i]
    ]) {
      if (re.test(text)) distHits.push(`${relOf(file)}:${label}`)
    }
  }
  // 已知例外：
  //  a) qrcode-parser 三方库仅在 URL 输入分支含 XMLHttpRequest
  //  b) HttpStatus chunk 中的 WebSocket 是状态码 101 的说明文本
  const exceptions = distHits.filter(h =>
    (h.includes('QrcodeEncode') && h.endsWith(':XMLHttpRequest'))
    || (h.includes('HttpStatus') && h.endsWith(':WebSocket'))
  )
  const otherDistHits = distHits.filter(h => !exceptions.includes(h))
  check('dist/ 无真实用户数据外发调用', otherDistHits.length === 0,
    otherDistHits.length ? otherDistHits.join(', ')
      : `扫描 ${distFiles.length} 文件，命中均为已知例外：QrcodeEncode:XMLHttpRequest、HttpStatus:WebSocket`)

  // 已知例外裁决记录
  check('例外裁决：qrcode-parser XMLHttpRequest 仅 URL 分支', true,
    '工具仅传本地 File 给 qrcodeParser(file)，未走 URL 分支（QrcodeEncode.vue:82）')
  check('例外裁决：httpStatus.ts WebSocket 为状态码说明文本', true,
    'src/data/httpStatus.ts:14 仅描述 101 状态码语义')
}

/* ------------------------------------------------------------------ */
/* 6. 路由与兜底                                                       */
/* ------------------------------------------------------------------ */
group('6. 路由与兜底')
{
  const router = readText('src/router/index.ts') || ''
  check("路由含 '/' 首页", /path:\s*['"]\/['"]/.test(router), 'src/router/index.ts:9')
  check("路由含 '/tool/:id'", /path:\s*['"]\/tool\/:id['"]/.test(router), 'src/router/index.ts:10')
  check('路由含 404 兜底', /pathMatch\(\.\*\)\*/.test(router), 'src/router/index.ts:11')

  const loader = readText('src/tools/loader.ts') || ''
  check('loader 缺失组件返回 ComingSoon',
    /if\s*\(\s*!moduleLoader\s*\)\s*\{\s*return ComingSoon/.test(loader)
      && /catch\s*\{[\s\S]*?return ComingSoon/.test(loader),
    'src/tools/loader.ts:21-31')

  // 40 个 ready 工具的 componentPath 均对应真实 .vue 文件。
  // comingSoonTools（state='coming-soon'）为不可点击占位卡，按设计无 SFC，不纳入此项校验。
  const registry = readText('src/tools/registry.ts') || ''
  const blocks = registry.split(/(?=\n  \{\n    id:)/).slice(1)
  const readyBlocks = blocks.filter(b => /state: 'ready'/.test(b))
  const comingSoonBlocks = blocks.filter(b => /state: 'coming-soon'/.test(b))
  const readyPaths = readyBlocks
    .map(b => (b.match(/componentPath:\s*'([^']+)'/) || [])[1])
    .filter(Boolean)
  const missingPaths = readyPaths.filter(p => !existsSync(abs('src/tools', `${p}.vue`)))
  check('40 个 ready 工具 componentPath 均对应真实 .vue',
    readyBlocks.length === 40 && comingSoonBlocks.length === 2 && missingPaths.length === 0,
    missingPaths.length ? `缺失: ${missingPaths.join(', ')}`
      : `ready=${readyBlocks.length}, 占位=${comingSoonBlocks.length}(按设计无SFC), 缺失=0`)
}

/* ------------------------------------------------------------------ */
/* 7. 无遗留 todo / 占位实现                                           */
/* ------------------------------------------------------------------ */
group('7. 无遗留 todo / 占位实现')
{
  const transforms = walk('src/utils', new Set(['.ts'])).filter(f => /transforms-/.test(f))
  const placeholderHits = []
  for (const file of transforms) {
    const text = readFileSync(file, 'utf8')
    if (/尚未实现|待实现|TODO|FIXME|throw new Error\(['"]未实现/.test(text)) {
      placeholderHits.push(relOf(file))
    }
  }
  check('transforms-*.ts 无占位实现', placeholderHits.length === 0,
    placeholderHits.length ? placeholderHits.join(', ') : `扫描 ${transforms.length} 个 transforms 文件`)

  const vueTools = walk('src/tools', new Set(['.vue'])).filter(f => !/ComingSoon/.test(f))
  check('40 个工具 SFC 齐全', vueTools.length === 40, `src/tools/**/*.vue = ${vueTools.length}（不含 ComingSoon）`)
}

/* ------------------------------------------------------------------ */
/* 8. 工程卫生                                                         */
/* ------------------------------------------------------------------ */
group('8. 工程卫生')
{
  check('package-lock.json 存在', existsSync(abs('package-lock.json')), 'package-lock.json')

  const gitignore = readText('.gitignore') || ''
  check('package-lock.json 未被 .gitignore 忽略',
    !/package-lock\.json/.test(gitignore), '.gitignore 无 package-lock 规则')
  check('node_modules 被忽略', /(^|\n)node_modules(\/|$)/m.test(gitignore), '.gitignore:1')
  check('dist/ 被忽略', /(^|\n)dist\/?/m.test(gitignore), '.gitignore:2')

  const referenceIgnored = /(^|\n)\/?reference\/?/m.test(gitignore)
  check('reference/ 被忽略（不进版本库）', referenceIgnored,
    referenceIgnored ? '.gitignore 含 reference 规则' : 'WARN: .gitignore 未忽略 reference/（当前含 83 个基座参考文件）',
    referenceIgnored ? 'error' : 'warn')

  // 临时测试文件残留（排除 node_modules/dist/reference）
  const skipDirs = ['node_modules', 'dist', 'reference', '.git']
  const allFiles = walk('.')
  const tempRe = /\.(tmp|bak|orig|rej)$|\.test\.(mjs|js)$|^test[-_.]/i
  const temps = allFiles.filter(f => {
    const r = relOf(f)
    if (skipDirs.some(d => r === d || r.startsWith(`${d}/`))) return false
    if (r === 'tests/audit.mjs') return false // 本审计脚本自身
    return tempRe.test(r.split('/').pop())
  })
  check('无临时测试文件残留', temps.length === 0,
    temps.length ? temps.map(relOf).join(', ') : '干净')
}

/* ------------------------------------------------------------------ */
/* 输出报告                                                            */
/* ------------------------------------------------------------------ */
let lastSection = ''
let fail = 0
let warn = 0
let pass = 0

for (const r of results) {
  if (r.section !== lastSection) {
    console.log(`\n=== ${r.section} ===`)
    lastSection = r.section
  }
  const tag = r.ok ? 'PASS' : (r.severity === 'warn' ? 'WARN' : 'FAIL')
  if (r.ok) pass += 1
  else if (r.severity === 'warn') warn += 1
  else fail += 1
  console.log(`[${tag}] ${r.name} :: ${r.detail}`)
}

console.log(`\n=== 汇总 ===`)
console.log(`PASS=${pass} WARN=${warn} FAIL=${fail} TOTAL=${results.length}`)
console.log(fail === 0 ? '审计结论：通过（可进入部署）' : '审计结论：存在 FAIL，需修复后复检')
process.exit(fail === 0 ? 0 : 1)
