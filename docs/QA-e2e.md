# DevToys Web — 浏览器端到端验证报告（QA-e2e）

> 执行人：严过关（Yan）团队 · QA 工程师 software-qa-engineer-2
> 日期：2026-11-26
> 脚本：`tests/e2e-smoke.mjs`（零新增 npm 依赖，可重复执行）
> 被测产物：`dist/`（本地静态服务托管）

---

## 1. 结论摘要

| 项 | 结果 |
|---|---|
| 总断言数 | **57** |
| 通过 | **57** |
| 失败 | **0** |
| 40 条工具路由 | **40/40** 全部渲染成功，无「开发中」占位、无 JS 运行时错误 |
| 外部请求 | **EXTERNAL_REQUESTS = []**（累计 101 个请求全部同源） |
| localStorage 用户输入泄露 | **0**（仅写入 `devtoys-web:theme`） |
| 源码 Bug | **0** |
| 路由决策 | **NoOne（全部通过，可交付）** |

**验收标准映射**：PRD A4/A5/A6/A7/A8/A9 通过；架构 §5.1 T02–T07 验收点全部通过（T02b 选项重算已专项验证）。

---

## 2. 执行命令与环境

```bash
cd C:/Users/liujian/WorkBuddy/spaces/2026_11_26_09-29-37/devtoys-web
node tests/e2e-smoke.mjs
```

- **浏览器**：Microsoft Edge 158.0.4370.33（headless=new），通过 CDP 驱动
- **静态服务**：Node 内置 `http` 模块随机端口托管 `dist/`（无外部网络依赖）
- **依赖**：仅 Node 22 内置模块（`http` / `fs` / `path` / `os` / `crypto` / `child_process` / `WebSocket` / `fetch`），**零新增 npm 依赖**
- **隐私监听**：全程开启 `Network.enable` + `Runtime.enable` + `Log.enable`

脚本输出以 `===E2E_RESULT_JSON===` 包裹机器可读结果，便于 CI 解析；失败时退出码为 1。

---

## 3. 40 条路由逐个结果

断言内容：打开 `/#/tool/<id>` → 出现工具标题 → 工具自有 UI（控件数 > 0、文本 > 20 字）→ 不出现「开发中」占位 → 该路由期间零 `Runtime.exceptionThrown`。

| # | id | 工具名 | 控件数 | 文本字数 | JS 错误 | 结果 |
|---:|---|---|---:|---:|---:|:---:|
| 1 | `json-yaml` | JSON ↔ YAML 转换 | 8 | 116 | 0 | ✅ |
| 2 | `json-xml` | JSON ↔ XML 转换 | 8 | 116 | 0 | ✅ |
| 3 | `number-base` | 进制转换器 | 9 | 121 | 0 | ✅ |
| 4 | `date-time` | 日期时间转换器 | 7 | 89 | 0 | ✅ |
| 5 | `data-size` | 数据大小单位转换 | 9 | 138 | 0 | ✅ |
| 6 | `base64-text` | Base64 文本编解码 | 10 | 139 | 0 | ✅ |
| 7 | `url-encode` | URL 编解码 | 8 | 88 | 0 | ✅ |
| 8 | `html-entity` | HTML 实体编解码 | 8 | 95 | 0 | ✅ |
| 9 | `gzip` | GZip 压缩/解压 | 9 | 114 | 0 | ✅ |
| 10 | `jwt-decode` | JWT 解码器 | 7 | 102 | 0 | ✅ |
| 11 | `hex-ascii` | Hex ↔ ASCII 转换 | 8 | 111 | 0 | ✅ |
| 12 | `qrcode-encode` | 二维码编解码 | 10 | 128 | 0 | ✅ |
| 13 | `json-format` | JSON 格式化/压缩/校验 | 9 | 112 | 0 | ✅ |
| 14 | `sql-format` | SQL 格式化 | 8 | 86 | 0 | ✅ |
| 15 | `xml-format` | XML 格式化 | 9 | 86 | 0 | ✅ |
| 16 | `html-format` | HTML 格式化 | 8 | 84 | 0 | ✅ |
| 17 | `css-format` | CSS 格式化 | 8 | 80 | 0 | ✅ |
| 18 | `hash-generator` | 哈希/校验和生成器 | 12 | 222 | 0 | ✅ |
| 19 | `password-generator` | 密码生成器 | 12 | 179 | 0 | ✅ |
| 20 | `uuid-generator` | UUID 生成器 | 8 | 150 | 0 | ✅ |
| 21 | `lorem-ipsum` | Lorem Ipsum 生成器 | 9 | 155 | 0 | ✅ |
| 22 | `random-number` | 随机数生成器 | 9 | 150 | 0 | ✅ |
| 23 | `text-diff` | 文本对比（Diff） | 7 | 106 | 0 | ✅ |
| 24 | `text-stats` | 文本分析/统计 | 6 | 145 | 0 | ✅ |
| 25 | `markdown-preview` | Markdown 预览 | 6 | 126 | 0 | ✅ |
| 26 | `string-replace` | 字符串替换 | 12 | 134 | 0 | ✅ |
| 27 | `line-tool` | 行工具 | 13 | 139 | 0 | ✅ |
| 28 | `ipv4-subnet` | IPv4 子网计算器 | 6 | 321 | 0 | ✅ |
| 29 | `ipv6-parse` | IPv6 解析/展开 | 7 | 89 | 0 | ✅ |
| 30 | `regex-tester` | 正则表达式测试 | 9 | 114 | 0 | ✅ |
| 31 | `jsonpath-tester` | JSONPath 测试 | 7 | 178 | 0 | ✅ |
| 32 | `json-schema-validator` | JSON Schema 验证 | 7 | 209 | 0 | ✅ |
| 33 | `url-parser` | URL 解析器 | 6 | 105 | 0 | ✅ |
| 34 | `color-converter` | 颜色选择器/转换 | 17 | 223 | 0 | ✅ |
| 35 | `contrast-checker` | 颜色对比度计算器 | 9 | 198 | 0 | ✅ |
| 36 | `color-blind-sim` | 色盲模拟器 | 9 | 184 | 0 | ✅ |
| 37 | `image-convert` | 图片格式转换 | 8 | 215 | 0 | ✅ |
| 38 | `image-compress` | 图片压缩 | 8 | 181 | 0 | ✅ |
| 39 | `http-status` | HTTP 状态码查询 | 12 | 3011 | 0 | ✅ |
| 40 | `mime-types` | MIME 类型查询 | 6 | 1672 | 0 | ✅ |

注册表同时校验：解析出 40 条工具、40 个 id 全局唯一。

---

## 4. 首页目录与搜索

| 断言 | 期望 | 实际 | 结果 |
|---|---|---|---|
| 分类分区数 | 11 | 11 | ✅ |
| ready 工具卡 | 40 | 40 | ✅ |
| coming-soon 占位卡 | 2 | 2 | ✅ |
| 隐私标识 | 含「不上传」 | 首页 hero 常驻 | ✅ |
| 中文搜索「时间戳」 | 过滤到日期时间转换器 | 日期时间转换器（1 条） | ✅ |
| 搜索「base64」 | 过滤到 Base64 工具 | Base64 文本编解码（1 条） | ✅ |
| 清除搜索 | 恢复 40 卡 | 40 | ✅ |
| 点击卡片 | 进入对应 `/#/tool/<id>` | `#/tool/json-format` | ✅ |

---

## 5. 关键交互实测

| # | 工具 | 输入 | 期望 / 实际输出 | 结果 |
|---:|---|---|---|---|
| 1 | JSON 格式化 | `{"a":1}` | 输出 `{\n  "a": 1\n}`（2 空格缩进） | ✅ |
| 2 | JSON 格式化 · 选项 | 缩进改 4 | 输出重算为 4 空格缩进（T02b） | ✅ |
| 3 | JSON 格式化 · 选项 | 勾选压缩 | 输出重算为 `{"a":1}`（T02b） | ✅ |
| 4 | Base64 | `你好` | `5L2g5aW9`（UTF-8 正确编码） | ✅ |
| 5 | Base64 · 交换 | 点击交换 | 输入变编码值、自动切解码并还原「你好」 | ✅ |
| 6 | JWT | 标准 HS256 样例 token | 解析出 Header / Payload / Signature，含 `John Doe` | ✅ |
| 7 | 正则 tester | `\d+` / `abc123def456` | 实时高亮 `123`、`456`，计数「匹配 2 处」 | ✅ |
| 8 | 哈希 | `abc` | SHA-256 = `ba7816bf…20015ad` | ✅ |
| 9 | 哈希 · 选项 | 算法改 MD5 | 主摘要重算为 `90015098…e17f72` | ✅ |
| 10 | JSONPath | `$.a[0].b` | 返回路径 `$.a[0].b` = `"示例值"`；改 JSON 后重算 | ✅ |
| 11 | IPv4 子网 | `192.168.1.10/24` | 掩码 `255.255.255.0`、网络 `192.168.1.0`、广播 `192.168.1.255` | ✅ |
| 12 | IPv4 子网 | `10.0.0.1/8` | 重算为 `10.0.0.0` / `10.255.255.255` | ✅ |
| 13 | 颜色转换 | `#ff0000` | `HEX：#FF0000`、`RGB：rgb(255, 0, 0)` | ✅ |
| 14 | 颜色转换 | `#00ff00` | 重算为 `rgb(0, 255, 0)` | ✅ |
| 15 | HTTP 状态码 | 搜索 `404` | `404 Not Found — 请求的资源不存在，服务器无法找到对应内容` | ✅ |
| 16 | 二维码 | `https://tool.nober.cn` | 生成 `data:image/png;base64,…`（4674 字符本地图片） | ✅ |

---

## 6. 操作栏（copy / download / clear / swap）

在 **3 个工具**上实测四个按钮：

| 工具 | 复制 | 下载 | 清空 | 交换 | 结果 |
|---|:---:|:---:|:---:|:---:|:---:|
| `json-format` | 剪贴板 = 格式化 JSON（含 `ALPHA_42`） | `json-format.txt`，29 bytes | 输入/输出同时清空 | 输出写回输入 | ✅ |
| `base64-text` | 剪贴板 = `U0VOVElORUxfQjY0` | 按钮可用 | 输入清空 | 输出写回输入并切模式 | ✅ |
| `hash-generator` | 剪贴板 = SHA-256(`SENTINEL_HASH`) | `hash-generator.txt`，64 bytes | 输入清空 | 按钮可用 | ✅ |

按钮标签实测为 `["📋 复制","⬇️ 下载","🧹 清空","⇄ 交换"]`；有输出时复制/下载/交换均启用，清空始终可用。

---

## 7. 隐私红线

| 断言 | 结果 | 说明 |
|---|---|---|
| `EXTERNAL_REQUESTS=[]` | ✅ | 全程 101 个网络请求，全部指向本地静态服务；`data:` / `blob:` 本地资源不计入 |
| localStorage 无用户输入 | ✅ | 7 个 sentinel（`ALPHA_42`、`U0VOVElORUxfQjY0`、`John Doe`、`5L2g5aW9`、`TEST_XYZ_Q` 等）均未出现在 localStorage |
| localStorage 仅主题键 | ✅ | 实际 keys 为空（主题切换前检查）；切换后仅 `devtoys-web:theme` |
| JS 运行时异常 | ✅ | 全流程 `Runtime.exceptionThrown` = 0，`Log.entryAdded(error)` = 0 |

---

## 8. 响应式与主题

| 视口 | 页面 | scrollWidth ≤ innerWidth | 布局 | 结果 |
|---|---|---|---|---|
| 375 × 812（mobile） | 首页 | 375 ≤ 375 | — | ✅ |
| 375 × 812（mobile） | 工具页 | 375 ≤ 375 | 单栏（1 列），侧栏 `display:none` | ✅ |
| 1280 × 900 | 首页 | 1265 ≤ 1280 | — | ✅ |
| 1280 × 900 | 工具页 | 1265 ≤ 1280 | 双栏（2 列），侧栏 `display:flex` | ✅ |

主题：点击切换后 `html[data-theme="dark"]`、`html.dark` 生效，`localStorage['devtoys-web:theme'] = 'dark'`；**刷新后仍为 dark**（已用新文档标记规避旧 DOM 竞态）。

---

## 9. 深链与兜底

| 场景 | 期望 | 实际 | 结果 |
|---|---|---|---|
| `/#/tool/color-converter` 直接打开 | 工具标题出现 | `🎨 颜色选择器/转换` | ✅ |
| 上述深链刷新 | 不 404、不白屏 | 标题存在，body 335 字，无 `.dt-not-found` | ✅ |
| `/#/tool/this-tool-does-not-exist-xyz` | ComingSoon 而非白屏 | `该工具 · 开发中`，body 104 字 | ✅ |
| `/#/tool/math-expression`（coming-soon id） | 开发中占位页 | 含「开发中」 | ✅ |

---

## 10. 测试轮次与问题处理

按 2 轮硬上限执行：

**Round 1**：57 断言中 55 通过、2 失败。经判定 **2 项均为测试脚本自身 Bug，非源码 Bug**：

1. `hash-generator · 复制按钮写入剪贴板` —— 断言误用 `'SHA'` 作为 sentinel，但十六进制摘要不含该字符串。实测剪贴板为正确的 `SHA-256('SENTINEL_HASH')`。**修复**：改用 Node `crypto.createHash('sha256')` 计算期望摘要作为 sentinel。
2. `/#/tool/color-converter 深链刷新` —— `Page.reload` 返回时旧 DOM 仍可访问，`waitFor` 命中旧标题后立即读取到新文档尚未挂载的空 body。实测刷新后工具页正常。**修复**：新增 `reloadAndWait()`，在旧上下文打标记并等待标记消失 + `readyState=complete` + `#app` 有内容后再断言；同样应用于主题刷新测试。

**Round 2（回归）**：**57/57 全部通过**，无失败、无 Known Issues。

### 源码 Bug 报告

无。未发现需要转交工程师（Alex）的源码缺陷。

---

## 11. 交付物

- `tests/e2e-smoke.mjs` —— 可重复执行的浏览器 E2E 冒烟脚本（零新增依赖）
- `docs/QA-e2e.md` —— 本报告

**路由决策：NoOne（全部通过）**
