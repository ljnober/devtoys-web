# DevToys Web — 线上站点全量自动化验收报告（QA-live）

> 执行人：严过关（Yan）· QA 工程师 software-qa-engineer
> 日期：2026-11-26
> 被测站点：`https://tool.nober.cn/`（GitHub 仓库 `ljnober/devtoys-web`，`gh-pages` 分支已部署）
> 脚本：`tests/live-e2e.mjs`（零新增 npm 依赖，可重复执行；`BASE_URL` 可覆盖目标地址）
> 报告数据：脚本机器可读输出（`===E2E_RESULT_JSON===`）实测值

---

## 1. 结论摘要

| 项 | 结果 |
|---|---|
| 总断言数 | **69** |
| 通过 | **69** |
| 失败 | **0** |
| 通过率 | **100%** |
| 40 条工具路由 | **40/40** 标题正确、真实 UI、无「开发中」、零 JS 异常、零 console error |
| 关键交互 | **23 项**全部通过（含 JSON↔YAML、Schema 必填校验、MIME `.json`） |
| 操作栏 | **3 个工具**实测复制/下载/清空/交换全部通过 |
| 外部请求 | **0**（全程 CDP Network 监听，累计 101 个请求全部同源 `tool.nober.cn`） |
| localStorage 用户输入 | **0**（检查时仅主题键或空） |
| JS 运行时异常 / console error | **0 / 0** |
| 站点源码 Bug | **0** |
| 路由决策 | **NoOne（全部通过，线上验收通过）** |
| 环境阻塞项 | **HTTPS 证书尚未签发 `tool.nober.cn`**（详见 §3），非源码 Bug |

**验收标准映射**：站点可达、首页目录、40 工具路由、关键交互、操作栏、中文搜索、隐私红线、响应式与主题、深链与兜底、HTTPS/证书核查，全部完成实测。

---

## 2. 执行命令与环境

```bash
cd C:/Users/liujian/WorkBuddy/spaces/2026_11_26_09-29-37/devtoys-web
node tests/live-e2e.mjs
# 可选：BASE_URL=https://tool.nober.cn node tests/live-e2e.mjs
# 证书签发后可强制正常校验：STRICT_TLS=1 node tests/live-e2e.mjs
```

- **Node**：v22.22.2
- **浏览器**：Microsoft Edge headless（`--headless=new`），CDP（Node 内置 WebSocket / fetch）驱动
- **依赖**：仅 Node 22 内置模块（`fs` / `path` / `os` / `crypto` / `https` / `child_process` / `WebSocket` / `fetch`），**零新增 npm 依赖**
- **监听**：全程 `Network.enable` + `Runtime.enable` + `Log.enable` + `Security.enable`
- **脚本输出**：以 `===E2E_RESULT_JSON===` 包裹机器可读结果；失败退出码 1，便于 CI 复用
- **页面产物来源**：线上实际部署内容，不依赖本地 `dist/`（脚本仅读取本地 `src/tools/registry.ts` 获取 40 个工具 id）

---

## 3. HTTPS 与证书状态（环境事实，非源码 Bug）

| 项 | 实测值 |
|---|---|
| HTTP(S) 状态码 | `200` |
| 预检最终 URL | `https://tool.nober.cn/` |
| 浏览器 CDP 最终 URL | `https://tool.nober.cn/#/` |
| 证书 subject | `CN=*.github.io` |
| 证书 issuer | `C=US, O=Let's Encrypt, CN=YR1` |
| 有效期 | `Sep 30 23:44:46 2026 GMT` → `Dec 29 23:44:45 2026 GMT` |
| 证书 altnames | `*.github.com` / `*.github.io` / `*.githubusercontent.com` / `github.com` / `github.io` / `githubusercontent.com`（**不含 `tool.nober.cn`**） |
| 是否签发 `tool.nober.cn` | **否** |
| 严格 TLS 校验 | **失败**：`ERR_TLS_CERT_ALTNAME_INVALID: Hostname/IP does not match certificate's altnames` |
| 浏览器自动化处理 | 启动参数 `--ignore-certificate-errors` + CDP `Security.setIgnoreCertificateErrors({ignore:true})` |
| 测试结束后复查 | 仍为 `CN=*.github.io`，严格校验仍失败（`curl` 返回 `000`），证书**尚未切换** |
| 正常校验重跑关键页面 | **本次不可执行**：证书未签发；脚本已支持 `STRICT_TLS=1`，待签发后可直接重跑 |

**结论**：DNS 与站点内容正常（HTTP 200），但证书仍为 GitHub Pages 默认证书，普通浏览器/脚本直接访问会报 `SEC_E_WRONG_PRINCIPAL` / `ERR_TLS_CERT_ALTNAME_INVALID`。这是**证书签发与 DNS 配置的时序问题**，不是站点代码缺陷。建议为 `tool.nober.cn` 在 GitHub Pages 中完成自定义域名证书签发后，用 `STRICT_TLS=1 node tests/live-e2e.mjs` 复核。

**额外信息项**：线上 `index.html` 引用的 bundle 为 `assets/index-d14f14b5.js` / `assets/index-fd6f0ec7.css`，与当前本地 `dist/index.html`（`index-02a8204f.js` / `index-8b9590d8.css`）不同，说明线上是此前已部署的构建。验收一律以线上实际内容为准；功能断言全部通过，未发现由版本差异导致的问题。

---

## 4. 站点可达与首页内容

| 断言 | 期望 | 实测 | 结果 |
|---|---|---|---|
| HTTP(S) 状态码 | 2xx/3xx | 200 | ✅ |
| 最终 URL | `https://tool.nober.cn/` | `https://tool.nober.cn/`（CDP `#/`） | ✅ |
| 页面标题 | 含 `DevToys Web` | `DevToys Web - 本地开发者工具箱` | ✅ |
| `html lang` | `zh-CN` | `zh-CN` | ✅ |
| 中文文案 | 含「开发者工具箱」「不上传」 | hero「40 款高频工具，打开即用…」+「所有工具在本地浏览器运行，不上传任何数据」 | ✅ |
| 乱码检查 | 无 `\ufffd` / `æ` / `â€` 等 | 未发现 | ✅ |
| 分类分区 | 11 | 11 | ✅ |
| 工具卡 | 40 ready + 2 coming-soon（共 42） | `{categories:11, cards:42, ready:40, soon:2}` | ✅ |
| 中文搜索「时间戳」 | 1 条：日期时间转换器 | 日期时间转换器 | ✅ |
| 搜索「base64」 | 1 条：Base64 文本编解码 | Base64 文本编解码 | ✅ |
| 清除搜索 / 卡片跳转 | 恢复 40 卡；进入 `#/tool/...` | 40 卡；`#/tool/json-format` | ✅ |

---

## 5. 40 条工具路由逐项结果

断言口径：打开 `https://tool.nober.cn/#/tool/<id>` → 出现与 registry 一致的工具标题 → `.dt-tool-shell__main` 内有真实控件（控件数 > 0、文本 > 20 字）→ 无「开发中」占位 → 该路由期间 `Runtime.exceptionThrown` = 0 且 `Log.entryAdded(error)` = 0。

| # | id | 工具名 | 控件数 | 文本字数 | JS 错误 | console 错误 | 结果 |
|---:|---|---|---:|---:|---:|---:|:---:|
| 1 | `json-yaml` | JSON ↔ YAML 转换 | 6 | 110 | 0 | 0 | ✅ |
| 2 | `json-xml` | JSON ↔ XML 转换 | 6 | 110 | 0 | 0 | ✅ |
| 3 | `number-base` | 进制转换器 | 7 | 115 | 0 | 0 | ✅ |
| 4 | `date-time` | 日期时间转换器 | 5 | 75 | 0 | 0 | ✅ |
| 5 | `data-size` | 数据大小单位转换 | 7 | 132 | 0 | 0 | ✅ |
| 6 | `base64-text` | Base64 文本编解码 | 6 | 102 | 0 | 0 | ✅ |
| 7 | `url-encode` | URL 编解码 | 6 | 82 | 0 | 0 | ✅ |
| 8 | `html-entity` | HTML 实体编解码 | 6 | 89 | 0 | 0 | ✅ |
| 9 | `gzip` | GZip 压缩/解压 | 5 | 92 | 0 | 0 | ✅ |
| 10 | `jwt-decode` | JWT 解码器 | 5 | 90 | 0 | 0 | ✅ |
| 11 | `hex-ascii` | Hex ↔ ASCII 转换 | 6 | 105 | 0 | 0 | ✅ |
| 12 | `qrcode-encode` | 二维码编解码 | 7 | 90 | 0 | 0 | ✅ |
| 13 | `json-format` | JSON 格式化/压缩/校验 | 7 | 106 | 0 | 0 | ✅ |
| 14 | `sql-format` | SQL 格式化 | 6 | 80 | 0 | 0 | ✅ |
| 15 | `xml-format` | XML 格式化 | 7 | 80 | 0 | 0 | ✅ |
| 16 | `html-format` | HTML 格式化 | 6 | 78 | 0 | 0 | ✅ |
| 17 | `css-format` | CSS 格式化 | 6 | 74 | 0 | 0 | ✅ |
| 18 | `hash-generator` | 哈希/校验和生成器 | 6 | 118 | 0 | 0 | ✅ |
| 19 | `password-generator` | 密码生成器 | 10 | 107 | 0 | 0 | ✅ |
| 20 | `uuid-generator` | UUID 生成器 | 6 | 79 | 0 | 0 | ✅ |
| 21 | `lorem-ipsum` | Lorem Ipsum 生成器 | 7 | 96 | 0 | 0 | ✅ |
| 22 | `random-number` | 随机数生成器 | 8 | 90 | 0 | 0 | ✅ |
| 23 | `text-diff` | 文本对比（Diff） | 5 | 71 | 0 | 0 | ✅ |
| 24 | `text-stats` | 文本分析/统计 | 5 | 70 | 0 | 0 | ✅ |
| 25 | `markdown-preview` | Markdown 预览 | 5 | 84 | 0 | 0 | ✅ |
| 26 | `string-replace` | 字符串替换 | 6 | 77 | 0 | 0 | ✅ |
| 27 | `line-tool` | 行工具 | 6 | 84 | 0 | 0 | ✅ |
| 28 | `ipv4-subnet` | IPv4 子网计算器 | 5 | 86 | 0 | 0 | ✅ |
| 29 | `ipv6-parse` | IPv6 解析/展开 | 5 | 83 | 0 | 0 | ✅ |
| 30 | `regex-tester` | 正则表达式测试 | 6 | 74 | 0 | 0 | ✅ |
| 31 | `jsonpath-tester` | JSONPath 测试 | 5 | 89 | 0 | 0 | ✅ |
| 32 | `json-schema-validator` | JSON Schema 验证 | 5 | 85 | 0 | 0 | ✅ |
| 33 | `url-parser` | URL 解析器 | 5 | 76 | 0 | 0 | ✅ |
| 34 | `color-converter` | 颜色选择器/转换 | 17 | 223 | 0 | 0 | ✅ |
| 35 | `contrast-checker` | 颜色对比度计算器 | 9 | 198 | 0 | 0 | ✅ |
| 36 | `color-blind-sim` | 色盲模拟器 | 9 | 184 | 0 | 0 | ✅ |
| 37 | `image-convert` | 图片格式转换 | 8 | 215 | 0 | 0 | ✅ |
| 38 | `image-compress` | 图片压缩 | 6 | 77 | 0 | 0 | ✅ |
| 39 | `http-status` | HTTP 状态码查询 | 5 | 80 | 0 | 0 | ✅ |
| 40 | `mime-types` | MIME 类型查询 | 6 | 1672 | 0 | 0 | ✅ |

注册表同时校验：解析出 40 个工具、40 个 id 全局唯一。

---

## 6. 关键交互实测（线上，23 项）

| # | 工具 | 操作 / 输入 | 实测输出 | 结果 |
|---:|---|---|---|---|
| 1 | JSON 格式化 | `{"a":1}` | `{\n  "a": 1\n}`（2 空格缩进） | ✅ |
| 2 | JSON 格式化 | 选项改「4 空格」 | `{\n    "a": 1\n}`，重算生效 | ✅ |
| 3 | JSON 格式化 | 勾选「压缩输出」 | `{"a":1}`，重算生效 | ✅ |
| 4 | JSON ↔ YAML | 输入 `{"a":1,"b":[1,2]}` | `a: 1 / b: - 1 - 2`，合法 YAML | ✅ |
| 5 | JSON ↔ YAML | 方向切 `yaml2json`，输入 `name: Alice\nage: 30` | `{"name": "Alice", "age": 30}` | ✅ |
| 6 | Base64 | 输入中文 `你好` | `5L2g5aW9`（UTF-8 正确） | ✅ |
| 7 | Base64 | 点击交换 | 输入变编码值，解码恢复「你好」 | ✅ |
| 8 | JWT 解码 | 标准 HS256 token | 解析出 Header / Payload / Signature，含 `John Doe` | ✅ |
| 9 | 正则测试 | `\d+` / `abc123def456` | 高亮 `123,456` | ✅ |
| 10 | 正则测试 | 匹配计数 | `匹配 2 处` | ✅ |
| 11 | 哈希 | 输入 `abc` | SHA-256 = `ba7816bf…20015ad` | ✅ |
| 12 | 哈希 | 算法改 MD5 | `90015098…e17f72`，重算正确 | ✅ |
| 13 | JSONPath | 默认 `$.a[0].b` | 路径与值 `"示例值"` 正确 | ✅ |
| 14 | JSONPath | 改 JSON 为 `{"a":[{"b":"TEST_XYZ_Q"}]}` | 结果重算为 `TEST_XYZ_Q` | ✅ |
| 15 | Schema 验证 | `required:["name"]` + 缺字段数据 | `$.name 缺少必填字段 name` | ✅ |
| 16 | Schema 验证 | 补齐 `name` | `校验通过，数据符合 Schema 约束` | ✅ |
| 17 | IPv4 子网 | `192.168.1.10/24` | 掩码 `255.255.255.0`、网络 `192.168.1.0`、广播 `192.168.1.255` | ✅ |
| 18 | IPv4 子网 | 改 `10.0.0.1/8` | `10.0.0.0` / `10.255.255.255` | ✅ |
| 19 | 颜色转换 | `#ff0000` | `HEX:#FF0000`、`RGB:rgb(255, 0, 0)`、HSL/HSV 同步 | ✅ |
| 20 | 颜色转换 | 改 `#00ff00` | `rgb(0, 255, 0)` | ✅ |
| 21 | HTTP 状态码 | 搜索 `404` | `404 Not Found — 请求的资源不存在，服务器无法找到对应内容` | ✅ |
| 22 | MIME 类型 | 搜索 `.json` | `.json → application/json — JSON 数据` | ✅ |
| 23 | 二维码 | 输入 `https://tool.nober.cn` | `data:image/png;base64,…`（4674 字符本地图片） | ✅ |

---

## 7. 操作栏（复制 / 下载 / 清空 / 交换）

按钮标签实测为 `["📋 复制","⬇️ 下载","🧹 清空","⇄ 交换"]`。

| 工具 | 复制 | 下载 | 清空 | 交换 | 结果 |
|---|:---:|:---:|:---:|:---:|:---:|
| `json-format` | 剪贴板含 `ALPHA_42` | `json-format.txt`，29 bytes | 输入/输出同时清空 | 输出写回输入 | ✅ |
| `base64-text` | 剪贴板 `U0VOVElORUxfQjY0` | 按钮可用 | 输入清空 | 输出写回并切模式 | ✅ |
| `hash-generator` | 剪贴板 = SHA-256(`SENTINEL_HASH`) | `hash-generator.txt`，64 bytes | 输入清空 | 按钮可用 | ✅ |

---

## 8. 隐私红线

| 断言 | 结果 | 说明 |
|---|---|---|
| `EXTERNAL_REQUESTS=[]` | ✅ | 在**所有场景结束后**复核：累计 101 个 CDP 网络请求，非 `tool.nober.cn` 域名请求 **0** 个；`data:` / `blob:` 等本地资源不计入 |
| localStorage 无用户输入 sentinel | ✅ | 7 个 sentinel（`ALPHA_42`、`U0VOVElORUxfQjY0`、`SENTINEL_HASH`、 `5L2g5aW9`、`John Doe`、`TEST_XYZ_Q`、`Alice`）均未写入 |
| localStorage 仅主题偏好键 | ✅ | 隐私断言时为空；主题切换后仅 `devtoys-web:theme` |
| 全流程 JS 运行时异常 | ✅ | `Runtime.exceptionThrown` = **0** |
| 全流程 console error | ✅ | `Log.entryAdded(level=error)` = **0** |

---

## 9. 响应式与主题（线上）

| 视口 | 页面 | scrollWidth / innerWidth | 布局 | 结果 |
|---|---|---|---|---|
| 375 × 812（mobile） | 首页 | 375 / 375 | — | ✅ |
| 375 × 812（mobile） | 工具页 | 375 / 375 | 单栏（1 列），侧栏 `display:none` | ✅ |
| 1280 × 900 | 首页 | 1265 / 1280 | — | ✅ |
| 1280 × 900 | 工具页 | 1265 / 1280 | 双栏（2 列），侧栏 `display:flex` | ✅ |

主题：切换后 `html[data-theme="dark"]`、`html.dark` 生效，`localStorage['devtoys-web:theme'] = 'dark'`；刷新后仍为 dark（新文档标记规避旧 DOM 竞态）。

---

## 10. 深链与兜底（线上）

| 场景 | 期望 | 实测 | 结果 |
|---|---|---|---|
| `https://tool.nober.cn/#/tool/color-converter` 直接打开 | 工具标题出现 | `🎨 颜色选择器/转换` | ✅ |
| 上述深链刷新 | 不 404、不白屏 | 标题存在，body 335 字，`.dt-not-found` 不存在 | ✅ |
| `/#/tool/this-tool-does-not-exist-xyz` | ComingSoon 而非白屏 | `该工具 · 开发中`，body 104 字 | ✅ |
| `/#/tool/math-expression` | 开发中占位页 | 含「开发中」 | ✅ |

---

## 11. 测试轮次与问题处理

| 轮次 | 结果 | 说明 |
|---|---|---|
| Round 1 | **69/69 通过** | 完整跑通全部场景，0 失败；发现脚本自身覆盖缺口：外部请求断言在最后两个场景之前执行，未覆盖「全程」 |
| Round 2（覆盖修正后回归） | 中途 FATAL | 脚本把外部请求复核移到全流程末尾；同时首页卡片点击恰好落到 `json-format`，随后同 hash 赋值未触发 Vue Router 导航 + 异步组件未挂载，导致首个输入写入旧 DOM。**这是测试脚本竞态，不是站点源码 Bug**（Round 1 与最终回归同场景均通过） |
| 最终回归 | **69/69 通过** | 修复：`openTool` 同 hash 先回首页再进入，并等待工具自有控件挂载后才操作；`setField` 找不到控件直接报错；外部请求断言在全部场景结束后执行 |

### 源码 Bug 报告

**无**。未发现需要转交工程师（Alex）的源码缺陷；未修改任何业务源码。

### 测试脚本自身修复记录（QA 自修）

1. 外部请求断言移至全部场景末尾，覆盖刷新、深链导航后的网络请求。
2. `openTool()` 增加同 hash 重置与「工具控件挂载」等待，消除异步 chunk 与 DOM 替换竞态。
3. `setField()` 在控件缺失时抛出明确错误，避免静默写入失败造成误判。

---

## 12. 交付物与后续建议

- `tests/live-e2e.mjs` —— 可重复执行的线上全量验收脚本（零新增依赖，`BASE_URL` / `STRICT_TLS` 可配置）
- `docs/QA-live.md` —— 本报告

**后续建议（非阻塞）**：

1. 尽快完成 `tool.nober.cn` 自定义域名证书签发；签发后执行 `STRICT_TLS=1 node tests/live-e2e.mjs` 以正常 TLS 校验复核关键页面。
2. 线上 bundle 与当前本地 `dist/` 构建哈希不同，建议在下次发布时确认 gh-pages 已同步最新构建，避免线上/本地行为漂移。

**路由决策：NoOne（线上验收全部通过）**
