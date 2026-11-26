# 测试报告：纯函数与核心工具单元测试

> 执行人：严过关（QA 工程师，纯函数/核心工具单测）｜Node v22.22.2｜日期：2026-11-26
> 目的：证明核心工具逻辑正确（而非确认代码存在）。所有断言均真实执行。

---

## 1. 执行方式与结果

| 项 | 内容 |
|---|---|
| 执行命令 | `npm test` → `node --experimental-strip-types --test tests/tools.test.ts` |
| 依赖 | 零新增依赖（仅用 `node:test` + `node:assert/strict` + `node:fs`） |
| **测试结果** | **tests 95 ｜ suites 14 ｜ pass 95 ｜ fail 0 ｜ skipped 0** |
| 耗时 | ~0.28 s |
| 路由决策 | **NoOne**（必需断言与缺陷回归断言全部通过；原 BUG-1 / ISSUE-2 已由原作者修复，见 §6） |

- 测试文件：`tests/tools.test.ts`（14 个 describe 分组、95 条断言用例，其中 4 条为缺陷修复回归）
- `package.json`：仅新增 `"test"` 脚本，未改依赖与其他字段
- 运行轮次：Round 1 编写+运行 → 发现 3 处**测试代码**断言错误，自行修复 → Round 2 回归全绿。缺陷修复后追加 4 条回归断言并重跑，95/95 全绿。

---

## 2. 覆盖清单（对照任务要求的 10 类断言）

| # | 要求 | 覆盖情况 | 关键断言 |
|---|---|---|---|
| 1 | 注册表结构 | ✅ | `categories=11`（id 与 order 固定）、`tools=40`（全 ready）、`comingSoonTools=2`（全 coming-soon）、40 个 id 唯一且 kebab-case（含占位共 42 不重复）、**每个 tool 的 `componentPath` 均对应真实 `.vue` 文件**、`kind='text'` 的 13 个 `transformPath` 均在 `transformers.ts` 导出且为函数（`ipv6Parse` 静态核对，见 §5）、`source='base'` 必带 `baseSourcePath`、select 选项带 values、`getTool/getToolsByCategory/searchTools` 行为 |
| 2 | JSON 格式化 | ✅ | indent 2/4/`\t`、minify、嵌套往返、非法 JSON 中文错误、空输入中文错误 |
| 3 | JSON↔YAML | ✅ | JSON→YAML 结构、中文+嵌套双向无损往返、YAML→JSON 美化、空输入、非法 JSON |
| 4 | 进制转换 | ✅ | 10→2、16→10、2→16、`2^64` BigInt 精度、负数与 0x/0b 前缀、非法字符/越界进制中文错误 |
| 5 | 数据大小 | ✅ | GB→MB（1024）、bit→B（8→1）、MB→bit（8388608）、千分位、空输入、负数/非法单位 |
| 6 | URL 编解码 | ✅ | 中文编码、百分号解码、`plusAsSpace` 编/解码两种方向、空输入、残缺百分序列中文错误 |
| 7 | HTML 实体 / Hex↔ASCII | ✅ | 命名/数字实体编解码、中文往返、`\u00a0`、`E4 BD A0`→「你」、分隔符 ` / : / 0x`、UTF-8 字节级往返 |
| 8 | SQL/XML/HTML/CSS 格式化 | ✅ | SQL 关键字大写+换行、XML 美化/collapse/非法错误、HTML 行内合并+层级缩进、CSS 规则/引号/注释、空输入中文错误 |
| 9 | 自研纯函数 | ✅ | `ip.ts`：IPv4 `/24` 全字段、`/32`、点分掩码、私有地址判定、非法前缀/掩码；IPv6 `::` 展开、IPv4 映射、压缩、非法地址。`jsonpath.ts`：`$.a[0].b`、`$[*]`、`$..b`、切片/负索引、路径、`$` 校验、结果上限。`jsonSchema.ts`：required 缺失、type、minimum、min>max、enum/const/pattern、非法正则不抛异常、items 递归下标、布尔 schema。`color.ts`：HEX/命名/RGB/HSL 解析、RGB↔HSL↔HSV 往返、黑白对比度 **21:1**、`evaluateWcag(4.5)`、三种色盲矩阵 |
| 10 | 边界与错误路径 | ✅ | 空输入统一返回空文本、非法 JSON、非法正则、Schema 缺 required、min>max、1000 位二进制/超大数、5000 字长文本、5000 元素数组 `$[*]` 被 MAX_RESULTS 截断不崩溃 |

### PRD A4（7 个抽查工具）单测覆盖说明
- ✅ 已覆盖：JSON 格式化/校验、JSON↔YAML、进制转换（3/7）
- ⏭ 移交浏览器 QA：Base64 编解码、时间戳转换、正则测试、哈希生成（4/7 为 custom SFC、无纯函数导出，详见 §5）

---

## 3. 测试代码自身修复（Round 1 自行修复，非源码问题）

| 问题 | 修复 |
|---|---|
| 原生 Node ESM 无法解析 `transformers.ts` 的无扩展名 re-export | 改为「静态核对桶文件导出名 + 运行时核对各具体实现模块函数导出」 |
| `transforms-network.ts` 内部 `./ip` 无扩展名，Node ESM 无法 import | 不再运行时导入该包装层，改为静态核对导出契约；底层 `expandIpv6/compressIpv6` 由 `ip.ts` 用例运行时覆盖 |
| 错误地认为 `'%ZZ'` 会触发解码失败（实际被当作原文编码为 `'%25ZZ'`） | 改用 `'%E4%BD'`（匹配百分序列但 UTF-8 不完整）触发中文错误 |
| 错误地认为 `xmlFormat` 对 `<a><b></a>` 抛错（xml-formatter 会修复） | 改用 `'not xml at all'` 触发中文错误 |
| 超大数期望值手算错误（`1023999999999000`） | 修正为精确值 `1023999999998976`（源码 BigInt 换算结果正确） |

---

## 4. 发现的源码问题（未改源码，已上报 team-lead）

### BUG-1（功能，建议修复）JSONPath 方括号字符串键 `$['key']` 抛异常
- **文件:行号**：`src/utils/jsonpath.ts:110-111`（缺 `]` 消费），错误发生于 `:146`
- **输入**：`queryJsonPath({ 'a-b': 7 }, "$['a-b']")`（`.["a-b"]` 形式同样受影响）
- **期望**：返回 `[{ path: "$['a-b']", value: 7 }]`（文件第 1 行注释明确声明支持 `['key']`，且实现了 `readQuoted()`）
- **实际**：抛出 `Error('JSONPath 表达式包含无法识别的字符，请使用 . 或 [] 访问属性')`
- **原因**：方括号分支的带引号路径调用 `readQuoted()` 后，游标停在 `]`，未跳过该结束符即 `continue`，下一轮循环把 `]` 当作无法识别字符
- **建议修复**：在 `segments.push({ kind: 'property', name: readQuoted() })` 后补 `cursor += 1`（并校验 `]` 存在）
- **影响**：Required 断言只要求 `$.a[0].b`、`$[*]`、`$..b`，均通过，故单测未硬性失败；但这是公开声明功能的实际缺陷，建议 Engineer 修复并补测
- **状态（更新）**：✅ **已由原作者修复**，回归断言见 §6.1

### ISSUE-2（体验/缩进，低）htmlFormat 合并行内元素后父级闭合标签多缩进一级
- **文件:行号**：`src/utils/transforms-formatters.ts:137-138`（合并 token）与 `:181`（深度递增）
- **输入**：`htmlFormat('<div><span>hi</span></div>', { indent: 2 })`
- **期望**：`"<div>\n  <span>hi</span>\n</div>"`
- **实际**：`"<div>\n  <span>hi</span>\n  </div>"`（`</div>` 多 2 空格）
- **原因**：合并后的 `<span>hi</span>` token 同时含开闭标签，净深度变化应为 0，但 `:181` 仅看开头 `<tag` 就 `depth += 1`
- **说明**：任务要求为「基本正确性」，单测原只断言结构正确、不断言精确列位；移交浏览器 QA 确认视觉影响
- **状态（更新）**：✅ **已由原作者修复**，回归断言见 §6.2

### ISSUE-3（已裁决：非缺陷）urlEncode 的 plusAsSpace 对「仅含 +、无百分序列」输入按原文编码
- **文件:行号**：`src/utils/transforms-encoders.ts:20-31`（解码判定在 `:22`）
- **现象**：`urlEncode('hello+world', { plusAsSpace: true })` 返回 `'hello%2Bworld'`（按原文编码），而非 `'hello world'`
- **结论（主理人裁决）**：**不是缺陷**。该行为属于「根据输入是否含百分号转义序列自动判断编码/解码方向」的既有设计，符合 registry 中 `urlEncode` 的选项语义；不应作为 Bug 修复。
- **补充**：当输入含至少一个 `%XX` 时 plusAsSpace 正常生效（`'%E4%BD%A0+x'` → `'你 x'` ✅），单测已覆盖此正确路径。**改进方向**：新增显式的「编码 / 解码」方向选项以消除自动判断的歧义，已列入 **P1** 迭代，不在首版范围。

---

## 5. 移交项（不属纯函数单测范围，交浏览器 QA）

1. **custom SFC 工具**（无纯函数导出，不在单测硬测）：Base64 文本编解码、GZip、JWT 解码、二维码、日期时间转换、哈希/密码/UUID/Lorem/随机数生成、文本对比/统计/Markdown 预览/字符串替换/行工具、IPv4 子网计算器（UI）、正则测试、JSONPath 测试（UI）、JSON Schema 验证（UI）、URL 解析器、颜色选择器/对比度/色盲模拟、图片转换/压缩、HTTP 状态码/MIME 查询。以上需由浏览器 QA 覆盖交互与渲染。
2. **PRD A4 未被单测覆盖的 4 项**：Base64 编解码、时间戳转换、正则测试、哈希生成 → 请在浏览器验证一次完整输入输出。
3. **`jsonXml` 的 `xml2json` 方向**依赖 `DOMParser`（浏览器 API），Node 无该全局对象，移交浏览器 QA；`json2xml` 方向为纯函数但不在本轮必需断言内。
4. **`ipv6Parse` transform 包装层**：因 `./ip` 无扩展名在 Node ESM 不可直接 import，本轮以源码静态核对 + `ip.ts` 展开/压缩纯函数运行时覆盖；请在浏览器确认工具页实际输出。
5. ~~ISSUE-2 / ISSUE-3（§4）~~：ISSUE-2 已由原作者修复并补回归断言（见 §6）；ISSUE-3 经主理人裁决非缺陷，改进列入 P1，无需移交浏览器 QA 判断。

---

## 6. 缺陷修复回归

原作者修复 BUG-1 与 ISSUE-2 后，在 `tests/tools.test.ts` 新增 **4 条回归断言**，重跑 `npm test`：**tests 95 ｜ pass 95 ｜ fail 0**（较修复前 91 条 +4）。QA 未修改任何源码。

### 6.1 BUG-1 回归（JSONPath 方括号引号键）
- **修复源码**：`src/utils/jsonpath.ts:110-119` —— `readQuoted()` 后跳过空白并校验/消费结束 `]`，缺失时抛中文错误「JSONPath 方括号中引号键缺少结束符 ]」。
- **回归断言**：
  - `$['a-b']` 与 `$["a-b"]` 均返回 `[7]`；规范化路径为 `$['a-b']`；`$['c_d']` 返回 `[9]`。
  - `"$['a-b'"`、`'$["a-b"'`、`"$['a-b'  "` 三种缺 `]` 输入均抛含「缺少结束符」的中文错误。
- **结果**：✅ 全部通过（2 条新增用例）。

### 6.2 ISSUE-2 回归（htmlFormat 成对标签缩进）
- **修复源码**：`src/utils/transforms-formatters.ts:173-178` —— 新增「同 token 内成对标签」判断（`/^<([A-Za-z][\w:-]*)\b[^>]*>[\s\S]*<\/\1\s*>$/i`），已合并元素净深度为 0，不再走通用开始标签分支增加缩进。
- **回归断言**（逐行精确比对）：
  - `<div><span>hi</span></div>` → `"<div>\n  <span>hi</span>\n</div>"`
  - `<div><span class="x">hi</span></div>` → `"<div>\n  <span class="x">hi</span>\n</div>"`
  - `<div><section><span class="hl">你好</span></section></div>` → `"<div>\n  <section>\n    <span class="hl">你好</span>\n  </section>\n</div>"`
  - `<div><span>hi</span><span>bye</span></div>` → `"<div>\n  <span>hi</span>\n  <span>bye</span>\n</div>"`
- **结果**：✅ 全部通过（2 条新增用例），含带 class 的 span 与多层嵌套场景。

---

## 7. 结论

- 任务要求的 10 类断言全部通过，`npm test` 全绿（95/95），核心纯函数逻辑正确。
- 原 BUG-1、ISSUE-2 已由原作者修复，4 条回归断言全部通过；ISSUE-3 经主理人裁决非缺陷（显式方向选项列入 P1）。
- 未修改任何源码；仅新增/更新 `tests/tools.test.ts`、本报告与 `package.json` 的 `test` 脚本。
