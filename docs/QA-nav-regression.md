# QA 导航改造回归验证报告

- 验证人：严过关（QA Engineer）
- 验证对象：左侧 280px 常驻可折叠分类导航改造（首页 / 工具页 / 移动端抽屉）
- 项目根：`C:/Users/liujian/WorkBuddy/spaces/2026_11_26_09-29-37/devtoys-web`
- 验证方式：Node 单测 + Vite 生产构建 + Edge headless/CDP 真实浏览器 E2E（零新增依赖）
- 验证日期：2026-11-26

## 一、总览结论

| 项目 | 结果 | 明细 |
| --- | --- | --- |
| `npm test` | ✅ 通过 | 95/95 单测通过，14 个 suite，0 失败 |
| `npm run build` | ✅ 通过 | type-check + vite build 均通过；产物 `dist/` 完整 |
| dist 无外链 CDN | ✅ 通过 | `index.html` 仅引用本地 `./assets/*`；HTML/CSS/JS 中无 `src/href/url()/fetch()/import()` 形式的外部资源引用 |
| `node tests/e2e-smoke.mjs` | ✅ 通过 | 57/57 断言通过；40 条工具路由全绿；JS 异常 0；外部请求 0 |
| 导航专项验证 | ✅ 通过 | 32/32 断言通过（桌面侧栏、搜索、工具页联动、移动端抽屉、深色主题、隐私红线） |
| **源码 Bug** | **无** | 未发现任何功能回归，路由决策：**NoOne** |

> 说明：构建日志中出现 `chunk > 500 kB` 的 Vite 提示，属于既有体积告警，不影响构建与功能，非本次改造引入的缺陷。

## 二、E2E 冒烟（57 条断言）结果

| 场景 | 断言数 | 通过 | 失败 |
| --- | --- | --- | --- |
| 1 · 40 条工具路由逐个打开 | 3 | 3 | 0 |
| 2 · 首页目录与搜索 | 6 | 6 | 0 |
| 3 · 关键交互实测（JSON/Base64/JWT/正则/哈希/JSONPath/IPv4/颜色/HTTP/二维码） | 18 | 18 | 0 |
| 4 · 操作栏四按钮实测 | 14 | 14 | 0 |
| 5 · 隐私红线 | 3 | 3 | 0 |
| 6 · 响应式与主题 | 9 | 9 | 0 |
| 7 · 深链刷新与无效 id + 全流程 JS 异常 | 4 | 4 | 0 |
| 附加：40 条路由逐条明细 | 40/40 | 40 | 0 |
| **合计** | **57** | **57** | **0** |

关键功能证据（节选）：

- JSON 格式化 `{"a":1}` → `"{\n  \"a\": 1\n}"`；缩进改 4 → `"{\n    \"a\": 1\n}"`；压缩 → `{"a":1}`
- Base64 输入「你好」→ `5L2g5aW9`，交换后解码还原中文
- SHA-256(`abc`) → `ba7816bf…`，切换 MD5 后摘要重算
- JWT 解码出 Header/Payload/Signature；正则匹配计数 2；二维码产出本地 `data:image/png`
- 外部请求 `[]`（累计 101 个请求全部同源）；localStorage 无用户输入 sentinel；JS 异常 `[]`

## 三、导航专项逐项结果（Edge headless + CDP，32/32）

### 3.1 桌面 1440×900 · 侧栏结构与折叠

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 1 | 侧栏存在且常驻可见 | ✅ | `display: block` |
| 2 | 侧栏宽约 280px 且贴左 | ✅ | `width=280, left=0` |
| 3 | 11 个分类 + 11 个 chevron | ✅ | `categories=11, chevrons=11` |
| 4 | 3 个快捷入口 + 所有工具 + 侧栏搜索框 | ✅ | `quickLinks=3, allTools=1, searchInputs=1`（快捷入口：密码生成器 / JSON 格式化工具 / JSON <> YAML 转换器） |
| 5 | 首页无横向溢出 | ✅ | `scrollWidth=1425 ≤ innerWidth=1440` |
| 6 | 点击分类标题展开工具列表 | ✅ | 工具列表 0→1；`aria-expanded=true`；含 5 个可点击工具链接 |
| 7 | 再次点击分类标题折叠 | ✅ | 工具列表 1→0；`aria-expanded=false` |

### 3.2 侧栏搜索过滤首页卡片

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 8 | 搜索框只在侧栏（header 中已移除） | ✅ | `inSidebar=true, inHeader=false` |
| 9 | 输入 `base64` 后首页卡片 42 → 1 | ✅ | `before=42, after=1`（命中 Base64 文本编解码） |
| 10 | 清除搜索恢复 42 | ✅ | `restored=42` |

### 3.3 侧栏分类内工具链接跳转

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 11 | 展开后工具链接可点击并跳转到 `/#/tool/<id>` | ✅ | 点击「JSON ↔ YAML 转换」→ `location.hash=#/tool/json-yaml`，标题渲染为「🧩 JSON ↔ YAML 转换」 |

### 3.4 工具页联动与核心功能

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 12 | 当前工具所属分类自动展开 | ✅ | json-format 页展开「转换器 / 格式化」，其中「格式化」包含当前工具 |
| 13 | 当前工具高亮且 `aria-current=page` | ✅ | `currentText=JSON 格式化/压缩/校验, count=1, aria-current=page, inExpanded=true` |
| 14 | JSON 2 空格缩进 | ✅ | `"{\n  \"a\": 1\n}"` |
| 15 | 选项改 4 空格后重算 | ✅ | `"{\n    \"a\": 1\n}"` |
| 16 | Base64 中文编码 | ✅ | `你好 → 5L2g5aW9` |
| 17 | 切工具后侧栏高亮同步 | ✅ | Base64 页高亮「Base64 文本编解码」 |
| 18 | SHA-256(`abc`) | ✅ | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` |
| 19 | 1440px 工具页无横向溢出 | ✅ | `1425 ≤ 1440` |

### 3.5 深色主题

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 20 | 切换深色主题改变侧栏背景 | ✅ | `rgb(247,247,248) → rgb(21,27,38)` |
| 21 | 刷新后主题与侧栏背景保持 | ✅ | `theme=dark, localStorage=dark, bg=rgb(21,27,38)` |

### 3.6 375px 移动端抽屉

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 22 | 常驻侧栏隐藏、汉堡可见 | ✅ | `sidebarDisplay=none, menuDisplay=flex` |
| 23 | 首页无横向溢出 | ✅ | `375 ≤ 375` |
| 24 | 汉堡打开抽屉且含 11 个可折叠分类 | ✅ | `panel=true, categories=11, chevrons=11` |
| 25 | 抽屉内快捷入口与搜索框齐全 | ✅ | `quickLinks=3, search=true` |
| 26 | 抽屉内分类可展开 | ✅ | 工具列表出现，`aria-expanded=true` |
| 27 | 抽屉可关闭 | ✅ | 点击关闭按钮后面板消失 |
| 28 | 工具页无横向溢出 | ✅ | `375 ≤ 375` |
| 29 | 工具页内汉堡可打开含 11 分类抽屉 | ✅ | `cats=11` |

### 3.7 隐私与稳定性红线

| # | 验证项 | 结果 | 实测证据 |
| --- | --- | --- | --- |
| 30 | JS 运行时异常 0 | ✅ | `jsErrors=[]` |
| 31 | 外部网络请求 0 | ✅ | 27 个请求全部同源，`external=[]` |
| 32 | console error 0 | ✅ | `consoleErrors=[]` |

**失败项：无。**

## 四、测试脚本调整（仅测试，不动源码）

原 E2E 脚本中有 5 处断言基于改造前的 DOM 结构，属于**测试脚本过时**，不是功能回归；已按新设计同步更新 `tests/e2e-smoke.mjs`：

| 位置 | 原断言 | 更新后 | 判定依据 |
| --- | --- | --- | --- |
| `scenarioHome` L459/L464 | `.dt-header__search input` | `.dt-side__search input` | 搜索框按设计下沉到侧栏 `AppSidebar`，与首页共用 `search store`；实测输入后过滤正常 |
| `scenarioHome` L469 | `.dt-header__clear` | `.dt-side__clear` | 清空按钮随搜索框迁移；实测清除后卡片恢复 42 |
| `scenarioResponsiveAndTheme` L740 起 | 工具页内嵌 `.dt-tool-shell__aside` 的 grid 双栏 / 移动端 `display:none` | 全局 `.dt-app__sidebar`：桌面常驻 280px、移动端 `display:none` 且汉堡可见 | 分类导航已上移到全局壳层，工具页不再内嵌 aside；新断言直接验证本次改造的验收标准 |

未修改任何业务源码。导航专项验证脚本置于项目外 `C:/Users/liujian/WorkBuddy/spaces/2026_11_26_09-29-37/qa-nav-verify.mjs`，运行日志 `qa-nav-verify.log`，不进入仓库。

## 五、最终结论

本次左侧可折叠分类导航改造**通过独立回归验证**：40 个工具功能、95 条单测、57 条 E2E 断言与 32 条导航专项断言全部通过；桌面/移动布局、搜索联动、主题持久化、隐私红线均无回归。

- 源码 Bug：**0**
- 已知问题：**无（非阻断项仅 Vite 既有 chunk 体积告警）**
- 路由决策：**NoOne**
