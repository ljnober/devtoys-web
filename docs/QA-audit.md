# QA 静态审计与 GitHub Pages 部署配置验证报告

> 审计人：严过关（Yan，QA 工程师）｜ 版本：v1.0 ｜ 日期：2026-11-26
> 审计对象：`devtoys-web` 交付物（构建产物 + 配置 + 源码）
> 依据：ARCHITECTURE.md §1.3(V1–V6)/§7/§8、PRD.md 验收标准、src/tools/registry.ts
> 方式：只读复核，**未重新构建**（复用主理人已完成的干净全量构建产物）
> 可复现命令：`node tests/audit.mjs`（零新增依赖，退出码 0=通过）

---

## 一、结论摘要

| 项 | 结果 |
|---|---|
| 审计用例总数 | 41 |
| PASS | 40 |
| WARN | 1（`.gitignore` 未忽略 `reference/`，非阻塞，见 §6） |
| FAIL | 0 |
| 智能路由 | **NoOne（源码/配置无 Bug）**；1 项工程卫生建议交 team-lead 决策 |
| 是否可进入部署（任务 #5） | **可以**（WARN 项不影响功能与隐私，但建议在首次提交前处理） |

> 说明：首轮运行出现 4 个 FAIL，经逐条复核**全部为审计脚本自身的误报**（匹配到说明性注释/占位卡），
> 已修正脚本断言后复跑归零。源码与配置**无需修改**。误报明细见 §7。

---

## 二、逐项审计结果

### 1. 构建产物 `dist/` —— 全部通过 ✅

| 检查 | 结果 | 证据 |
|---|---|---|
| `dist/index.html` 存在 | PASS | 文件存在，`lang="zh-CN"`、中文 title/description |
| `dist/CNAME` 内容严格为 `tool.nober.cn` | PASS | 字节 `74 6f 6f 6c 2e 6e 6f 62 65 72 2e 63 6e 0a` = `tool.nober.cn\n`（单行 + 结尾换行，符合规范） |
| `dist/logo.svg` 存在 | PASS | 文件存在；index.html favicon 指向 `./logo.svg`（本地） |
| dist 全部 js/css/html 无 CDN / 外链字体 | PASS | 扫描 79 个文件，`cdnjs`/`jsdelivr`/`unpkg`/`fonts.googleapis`/`fonts.gstatic` 零命中 |
| index.html 无外链 script/link | PASS | 仅 `./assets/index-*.js`、`./assets/index-*.css` 相对路径 |

> 产物内出现的 `https://www.w3.org`（SVG 命名空间）、`https://www.npmjs.com`、`https://element-plus.org`、
> `https://github.com`、`https://marked.js.org`、`https://mths.be`、`https://example.com`
> 均为三方库许可证头/弃用告警/文档链接/占位示例文本，**不产生任何资源请求**，不构成外链风险。

### 2. Vite 配置 —— 全部通过 ✅

| 检查 | 结果 | 证据 |
|---|---|---|
| `base: './'` | PASS | `vite.config.ts:9` |
| `build.outDir: 'dist'` | PASS | `vite.config.ts:11` |
| 无 cdn2/monaco/PWA/basicSsl 插件 | PASS | `plugins: [vue()]` 仅此一项；无对应包名/调用 |

**为何相对 `base` 对自定义域名是必需的（架构 §8.2）**：同一份产物需同时服务两个入口——
项目页 `https://ljnober.github.io/devtoys-web/`（路径前缀 `/devtoys-web/`）与自定义域
`https://tool.nober.cn/`（**根路径**）。若写死 `'/devtoys-web/'`，自定义域名下所有 JS/CSS 会 404；
相对路径 `./assets/...` 在两者下均能正确解析。这是"按项目路径配置"的安全实现。
补充：`build.modulePreload.polyfill=false`（`:14`）关闭了含 `fetch()` 的内联 polyfill，进一步降低隐私巡检噪声。

### 3. GitHub Actions 部署工作流 —— 全部通过 ✅

`.github/workflows/deploy.yml` 存在且字段合理：

| 检查 | 结果 |
|---|---|
| `npm ci` + `npm run build` | PASS |
| `peaceiris/actions-gh-pages@v4` 推 `gh-pages` 分支 | PASS（`publish_branch: gh-pages`） |
| `cname: tool.nober.cn` | PASS（gh-pages 分支根再次确保 CNAME） |
| `permissions: contents: write` | PASS（peaceiris 推送所需） |
| `on.push.branches: [main]` + `workflow_dispatch` | PASS |
| `Verify no CDN links` 步骤 | PASS（主理人红线固化进 CI） |
| YAML 语法合理性（顶层键齐全、无 Tab） | PASS |

### 4. 许可证合规 —— 全部通过 ✅

| 检查 | 结果 | 证据 |
|---|---|---|
| `LICENSE.md` MIT 原文 + `Copyright (c) 2023 He Hang` | PASS | `:1,:3` |
| `NOTICE.md` 衍生声明 | PASS | `:3` 含来源链接/MIT/Copyright |
| `README.md` 署名 | PASS | `:26` |
| `source='base'` 21 个工具组件 MIT 注释覆盖 | PASS | **21/21** 全部含 `MIT`/`HeHang0/devtoys` 注释 |

### 5. 隐私红线 —— 全部通过 ✅

| 检查 | 结果 | 证据 |
|---|---|---|
| `src/` 无真实用户数据外发 | PASS | 82 文件扫描，无 `fetch(`/`XMLHttpRequest(`/`axios`/外链资源真实调用 |
| `dist/` 无真实用户数据外发 | PASS | 79 文件扫描，命中均为已知例外 |
| 无分析统计（GA/百度统计/埋点） | PASS | `google-analytics`/`sendBeacon`/`umeng`/`hm.js` 零命中 |

**已知例外裁决**：

| 例外 | 裁决 | 依据 |
|---|---|---|
| `qrcode-parser` 三方库 `XMLHttpRequest` | **不判为 Bug** | 仅存在于三方库"输入为 URL"分支；本项目 `QrcodeEncode.vue:82` 只把本地 `File` 传给 `qrcodeParser(file)`，从不走 URL 分支 |
| `src/data/httpStatus.ts` 的 `WebSocket` | **不判为 Bug** | `:14` 是 HTTP 101 状态码的说明文本（"常用于 WebSocket 握手"），非 API 调用；编译后位于 `HttpStatus-*.js` 数据字典中 |
| `main.ts:31` 注释中的 `XMLHttpRequest` | **不判为 Bug** | 注释说明"避免把 el-upload 的 XHR 打进产物"，是反向说明 |
| UrlParser `https://example.com` | **不判为 Bug** | 输入框 placeholder/错误示例文本 |

**未发现新的真实外发行为。**

### 6. 路由与兜底 —— 全部通过 ✅

| 检查 | 结果 | 证据 |
|---|---|---|
| `/` 首页路由 | PASS | `src/router/index.ts:9` |
| `/tool/:id` 工具路由 | PASS | `:10` |
| 404 兜底 | PASS | `:11` `/:pathMatch(.*)*` |
| 深链刷新不 404 | PASS | `:15` 采用 `createWebHashHistory()`（hash 模式），从根本上规避 Pages 深链 404 |
| loader 缺失组件返回 ComingSoon | PASS | `src/tools/loader.ts:21-31`（无模块 / 加载异常均回退占位，避免白屏） |
| 40 个 ready 工具 componentPath 对应真实 `.vue` | PASS | 40/40 命中 |

**占位卡裁决**：注册表共 42 条 componentPath = 40 个 `state:'ready'` + 2 个 `state:'coming-soon'`。
`calculators/MathExpression`、`calculators/PercentageCalculator` 属 `comingSoonTools`（架构 §3.1 定义的不可点击占位卡），
按设计**无对应 SFC**，不纳入"40 工具文件齐全"校验；点击/加载时会命中 loader 的 ComingSoon 回退。此项**不判为 Bug**。

### 7. 无遗留 todo / 占位实现 —— 全部通过 ✅

- `src/utils/transforms-{converters,encoders,formatters,network}.ts` 无 `尚未实现`/`待实现`/`TODO`/`FIXME`。
- `src/tools/**/*.vue`（不含 ComingSoon）共 **40** 个，与注册表 ready 数量一致。

### 8. 工程卫生 —— 基本通过（1 WARN）

| 检查 | 结果 | 证据 |
|---|---|---|
| `package-lock.json` 存在且未被忽略 | PASS | 151 KB，`.gitignore` 无相关规则（保证 Actions `npm ci` 可复现） |
| `node_modules` 被忽略 | PASS | `.gitignore:1` |
| `dist/` 被忽略 | PASS | `.gitignore:2` |
| 无临时测试文件残留 | PASS | 无 `.tmp`/`.bak`/`.orig`/`.rej` 等 |
| `reference/` 被忽略 | **WARN** | `.gitignore` 未含 `reference/` 规则，当前 `reference/` 含 83 个基座参考文件（详见 §6） |

---

## 三、WARN 详情与修复建议（非阻塞）

**事项**：`.gitignore` 未忽略 `reference/`（83 个基座参考文件，来自 `HeHang0/devtoys`）。

- **影响**：任务 #5 首次 `git init` + 提交时，若不加规则，`reference/` 会进入版本库，使仓库体积增大、目录不够干净。
- **不判为 FAIL 的理由**：`NOTICE.md:5` 明确"基座源码（reference/ 目录）保留供移植参考"，说明团队对该目录有保留意图；
  且这些文件为 MIT 开源基座代码，提交不构成隐私/许可证违规，不影响部署功能。
- **精确位置与修复建议**：在 `.gitignore` 追加一行
  ```
  /reference/
  ```
  由 team-lead 在任务 #5 首次提交前决定并执行（`.gitignore` 不在本人独占文件范围内，未擅自修改）。
- **若不处理的后果**：仅仓库冗余，无功能/合规风险。

---

## 四、用户需在 GitHub 与 DNS 侧手动完成的步骤（任务 #5 交付说明）

> 代码侧已就绪；以下步骤需 team-lead/用户在推送后手动完成（架构 §8.3/§8.5）。

**GitHub 侧：**
1. 新建公开仓库 `ljnober/devtoys-web`；推送 `main` 分支（含 `.github/workflows/deploy.yml`）。
2. 确认 Workflow 首次运行绿（build + Verify no CDN links + Deploy 均成功）。
3. 仓库 → Settings → Pages → Build and deployment → Source 选 **Deploy from a branch**。
4. Branch 选 **`gh-pages`**，目录选 **/(root)**，Save。
5. Custom domain 填 `tool.nober.cn`（GitHub 可能自动回写 CNAME，内容一致即可）。
6. 勾选 **Enforce HTTPS**。

**DNS 侧（nober.cn 的 DNS 服务商）：**
7. 添加记录：类型 `CNAME`，主机记录 `tool`，记录值 `ljnober.github.io`。
8. 等待 DNS 生效（通常几分钟至数小时）。

**验收命令（DNS 生效后）：**
- `curl -I https://ljnober.github.io/devtoys-web/` → HTTP 200
- `curl -I https://tool.nober.cn` → HTTP 200 且 HTTPS 正常
- 切到 `gh-pages` 分支确认根目录含 `index.html`、`assets/`、`CNAME`

---

## 五、重现与维护

- 审计脚本：`tests/audit.mjs`（只读、零依赖、可重复执行）。
- 复跑：`node tests/audit.mjs`；退出码 0 表示无 FAIL。
- 四个审计分组覆盖：构建产物 / Vite 配置 / Actions / 许可证 / 隐私 / 路由 / 占位 / 工程卫生。

## 六、误报修正记录（Round 1 → Round 2）

| # | 首轮 FAIL | 复核结论 | 处理 |
|---|---|---|---|
| 1 | "命中 monaco" | 匹配到 `vite.config.ts:1` 说明性注释"零…Monaco…"，非真实插件 | 修正断言为只匹配插件包名/调用 |
| 2 | `main.ts` XMLHttpRequest | 注释"避免把 el-upload 的 XHR 打进产物"，反向说明 | 跳过纯注释行 |
| 3 | dist HttpStatus WebSocket | 状态码 101 说明文本，已知例外 | 加入例外白名单 |
| 4 | 2 个 componentPath 缺失 | `comingSoonTools` 占位卡按设计无 SFC | 仅校验 40 个 ready 工具，占位单列 |

> 四者均为**审计脚本断言问题**，源码/配置无 Bug；按"测试有错自行修复"原则处理，未改动任何源码或配置。
