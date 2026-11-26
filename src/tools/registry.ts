// 工具注册表：11 个分类 + 40 个 P0 工具 + 2 个即将推出占位（契约见 contracts.ts）。
import type { CategoryDefinition, ToolCategoryId, ToolDefinition } from './contracts'

/** 11 个分类，顺序固定为 1..11。 */
export const categories: CategoryDefinition[] = [
  { id: 'converters', name: '转换器', nameEn: 'Converters', icon: '🔄', order: 1,
    description: '结构化数据互转与常用单位换算' },
  { id: 'encoders', name: '编解码', nameEn: 'Encoders', icon: '🔐', order: 2,
    description: '文本与数据的编码、解码和压缩' },
  { id: 'formatters', name: '格式化', nameEn: 'Formatters', icon: '✨', order: 3,
    description: '代码与结构化数据的美化、压缩和校验' },
  { id: 'generators', name: '生成器', nameEn: 'Generators', icon: '🎲', order: 4,
    description: '密码、标识与占位内容的一键生成' },
  { id: 'text', name: '文本', nameEn: 'Text', icon: '📝', order: 5,
    description: '文本对比、统计、预览与批量处理' },
  { id: 'network', name: '网络', nameEn: 'Network', icon: '🌐', order: 6,
    description: 'IP 地址与网络相关计算' },
  { id: 'testers', name: '测试', nameEn: 'Testers', icon: '🧪', order: 7,
    description: '表达式、Schema 与 URL 的在线调试' },
  { id: 'colors', name: '颜色', nameEn: 'Colors', icon: '🎨', order: 8,
    description: '颜色转换与可访问性对比度检查' },
  { id: 'images', name: '图片', nameEn: 'Images', icon: '🖼️', order: 9,
    description: '图片格式转换与体积压缩' },
  { id: 'references', name: '参考', nameEn: 'References', icon: '📚', order: 10,
    description: '开发常用的状态码与类型速查字典' },
  { id: 'calculators', name: '计算器', nameEn: 'Calculators', icon: '🧮', order: 11,
    description: '数学表达式与百分比计算（即将推出）' }
]

/** 40 个 P0 工具，state 全部为 ready，id 全局唯一。 */
export const tools: ToolDefinition[] = [
  {
    id: 'json-yaml',
    category: 'converters',
    name: 'JSON ↔ YAML 转换',
    description: 'JSON 与 YAML 互转，本地处理',
    icon: '🧩',
    keywords: ['json', 'yaml', '转换', '配置'],
    componentPath: 'converters/JsonYaml',
    kind: 'text',
    transformPath: 'jsonYaml',
    options: [{ key: 'direction', label: '转换方向', type: 'select',
                defaultValue: 'json2yaml',
                values: [{ label: 'JSON → YAML', value: 'json2yaml' },
                         { label: 'YAML → JSON', value: 'yaml2json' }] }],
    source: 'base',
    baseSourcePath: 'src/views/json2yaml.vue',
    state: 'ready'
  },
  {
    id: 'json-xml',
    category: 'converters',
    name: 'JSON ↔ XML 转换',
    description: 'JSON 与 XML 结构互转，纯浏览器解析',
    icon: '🔁',
    keywords: ['json', 'xml', '转换', '互转'],
    componentPath: 'converters/JsonXml',
    kind: 'text',
    transformPath: 'jsonXml',
    options: [{ key: 'direction', label: '转换方向', type: 'select',
                defaultValue: 'json2xml',
                values: [{ label: 'JSON → XML', value: 'json2xml' },
                         { label: 'XML → JSON', value: 'xml2json' }] }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'number-base',
    category: 'converters',
    name: '进制转换器',
    description: '二进制、八进制、十进制与十六进制互转',
    icon: '#️⃣',
    keywords: ['进制', '二进制', '十六进制', 'number base'],
    componentPath: 'converters/NumberBase',
    kind: 'text',
    transformPath: 'numberBase',
    options: [
      { key: 'from', label: '源进制', type: 'select', defaultValue: 10,
        values: [{ label: '二进制', value: 2 }, { label: '八进制', value: 8 },
                 { label: '十进制', value: 10 }, { label: '十六进制', value: 16 }] },
      { key: 'to', label: '目标进制', type: 'select', defaultValue: 16,
        values: [{ label: '二进制', value: 2 }, { label: '八进制', value: 8 },
                 { label: '十进制', value: 10 }, { label: '十六进制', value: 16 }] }
    ],
    source: 'base',
    baseSourcePath: 'src/views/number.vue',
    state: 'ready'
  },
  {
    id: 'date-time',
    category: 'converters',
    name: '日期时间转换器',
    description: 'Unix 时间戳与可读日期时间的双向转换',
    icon: '📅',
    keywords: ['时间戳', '日期', '时间', 'timestamp', 'unix'],
    componentPath: 'converters/DateTime',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/date.vue',
    state: 'ready'
  },
  {
    id: 'data-size',
    category: 'converters',
    name: '数据大小单位转换',
    description: 'bit、Byte、KB、MB、GB 等数据单位互转',
    icon: '💾',
    keywords: ['数据大小', '单位', '字节', 'data size'],
    componentPath: 'converters/DataSize',
    kind: 'text',
    transformPath: 'dataSize',
    options: [
      { key: 'from', label: '源单位', type: 'select', defaultValue: 'B',
        values: [{ label: 'bit', value: 'bit' }, { label: 'Byte', value: 'B' },
                 { label: 'KB', value: 'KB' }, { label: 'MB', value: 'MB' },
                 { label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }] },
      { key: 'to', label: '目标单位', type: 'select', defaultValue: 'MB',
        values: [{ label: 'bit', value: 'bit' }, { label: 'Byte', value: 'B' },
                 { label: 'KB', value: 'KB' }, { label: 'MB', value: 'MB' },
                 { label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }] }
    ],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'base64-text',
    category: 'encoders',
    name: 'Base64 文本编解码',
    description: '文本 Base64 编码与解码，支持 URL-safe 模式',
    icon: '🔤',
    keywords: ['base64', '编码', '解码', '文本'],
    componentPath: 'encoders/Base64Text',
    kind: 'custom',
    options: [{ key: 'urlSafe', label: 'URL-safe 模式', type: 'switch', defaultValue: false }],
    source: 'base',
    baseSourcePath: 'src/views/base64.vue',
    state: 'ready'
  },
  {
    id: 'url-encode',
    category: 'encoders',
    name: 'URL 编解码',
    description: 'URL 百分号编码与解码，支持空格转加号',
    icon: '🔗',
    keywords: ['url', '编码', '解码', '百分号'],
    componentPath: 'encoders/UrlEncode',
    kind: 'text',
    transformPath: 'urlEncode',
    options: [{ key: 'plusAsSpace', label: '加号表示空格', type: 'switch', defaultValue: false }],
    source: 'base',
    baseSourcePath: 'src/views/url.vue',
    state: 'ready'
  },
  {
    id: 'html-entity',
    category: 'encoders',
    name: 'HTML 实体编解码',
    description: '命名实体与数字实体的编码和解码',
    icon: '🏷️',
    keywords: ['html', '实体', '编码', '解码', 'entity'],
    componentPath: 'encoders/HtmlEntity',
    kind: 'text',
    transformPath: 'htmlEntity',
    options: [{ key: 'mode', label: '实体形式', type: 'select', defaultValue: 'named',
                values: [{ label: '命名实体', value: 'named' },
                         { label: '数字实体', value: 'numeric' }] }],
    source: 'base',
    baseSourcePath: 'src/views/html.vue',
    state: 'ready'
  },
  {
    id: 'gzip',
    category: 'encoders',
    name: 'GZip 压缩/解压',
    description: '使用浏览器原生 CompressionStream 压缩与还原文本',
    icon: '🗜️',
    keywords: ['gzip', '压缩', '解压', 'compression'],
    componentPath: 'encoders/Gzip',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'jwt-decode',
    category: 'encoders',
    name: 'JWT 解码器',
    description: '解析 JWT 的 Header、Payload 与 Signature',
    icon: '🔑',
    keywords: ['jwt', 'token', '解码', '令牌'],
    componentPath: 'encoders/JwtDecode',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/jwt.vue',
    state: 'ready'
  },
  {
    id: 'hex-ascii',
    category: 'encoders',
    name: 'Hex ↔ ASCII 转换',
    description: '十六进制字节串与 ASCII 文本互转',
    icon: '0️⃣',
    keywords: ['hex', 'ascii', '十六进制', '转换'],
    componentPath: 'encoders/HexAscii',
    kind: 'text',
    transformPath: 'hexAscii',
    options: [{ key: 'separator', label: '字节分隔符', type: 'select', defaultValue: ' ',
                values: [{ label: '空格', value: ' ' }, { label: '无分隔符', value: '' },
                         { label: '冒号', value: ':' }, { label: '0x 前缀', value: '0x' }] }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'qrcode-encode',
    category: 'encoders',
    name: '二维码编解码',
    description: '文本生成二维码图片，或从图片中解码文本',
    icon: '▦',
    keywords: ['二维码', 'qrcode', '生成', '解码'],
    componentPath: 'encoders/QrcodeEncode',
    kind: 'custom',
    options: [
      { key: 'size', label: '图片尺寸', type: 'number', defaultValue: 256 },
      { key: 'level', label: '容错级别', type: 'select', defaultValue: 'M',
        values: [{ label: 'L', value: 'L' }, { label: 'M', value: 'M' },
                 { label: 'Q', value: 'Q' }, { label: 'H', value: 'H' }] }
    ],
    source: 'base',
    baseSourcePath: 'src/views/qrcode.vue',
    state: 'ready'
  },
  {
    id: 'json-format',
    category: 'formatters',
    name: 'JSON 格式化/压缩/校验',
    description: '美化、压缩并校验 JSON 数据是否合法',
    icon: '🧱',
    keywords: ['json', '格式化', '压缩', '校验'],
    componentPath: 'formatters/JsonFormat',
    kind: 'text',
    transformPath: 'jsonFormat',
    options: [
      { key: 'indent', label: '缩进空格', type: 'select', defaultValue: 2,
        values: [{ label: '2 空格', value: 2 }, { label: '4 空格', value: 4 },
                 { label: 'Tab', value: '\t' }] },
      { key: 'minify', label: '压缩输出', type: 'switch', defaultValue: false }
    ],
    source: 'base',
    baseSourcePath: 'src/views/formatter.vue',
    state: 'ready'
  },
  {
    id: 'sql-format',
    category: 'formatters',
    name: 'SQL 格式化',
    description: 'SQL 语句缩进美化，便于阅读与排查',
    icon: '🗃️',
    keywords: ['sql', '格式化', '美化', '数据库'],
    componentPath: 'formatters/SqlFormat',
    kind: 'text',
    transformPath: 'sqlFormat',
    options: [{ key: 'uppercase', label: '关键字大写', type: 'switch', defaultValue: false }],
    source: 'base',
    baseSourcePath: 'src/views/sql.vue',
    state: 'ready'
  },
  {
    id: 'xml-format',
    category: 'formatters',
    name: 'XML 格式化',
    description: 'XML 文档缩进美化与压缩输出',
    icon: '📐',
    keywords: ['xml', '格式化', '缩进', '美化'],
    componentPath: 'formatters/XmlFormat',
    kind: 'text',
    transformPath: 'xmlFormat',
    options: [
      { key: 'indent', label: '缩进空格', type: 'number', defaultValue: 2 },
      { key: 'collapse', label: '压缩空白', type: 'switch', defaultValue: false }
    ],
    source: 'base',
    baseSourcePath: 'src/views/xml.vue',
    state: 'ready'
  },
  {
    id: 'html-format',
    category: 'formatters',
    name: 'HTML 格式化',
    description: 'HTML 源码缩进美化与标签整理',
    icon: '🏗️',
    keywords: ['html', '格式化', '美化', '代码'],
    componentPath: 'formatters/HtmlFormat',
    kind: 'text',
    transformPath: 'htmlFormat',
    options: [{ key: 'indent', label: '缩进空格', type: 'number', defaultValue: 2 }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'css-format',
    category: 'formatters',
    name: 'CSS 格式化',
    description: 'CSS 规则与声明的缩进整理',
    icon: '🎏',
    keywords: ['css', '格式化', '样式', '美化'],
    componentPath: 'formatters/CssFormat',
    kind: 'text',
    transformPath: 'cssFormat',
    options: [{ key: 'indent', label: '缩进空格', type: 'number', defaultValue: 2 }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'hash-generator',
    category: 'generators',
    name: '哈希/校验和生成器',
    description: '生成 MD5、SHA-1、SHA-256、SHA-512 摘要',
    icon: '#️⃣',
    keywords: ['哈希', '校验和', 'md5', 'sha256', 'hash'],
    componentPath: 'generators/HashGenerator',
    kind: 'custom',
    options: [{ key: 'algorithm', label: '算法', type: 'select', defaultValue: 'SHA-256',
                values: [{ label: 'MD5', value: 'MD5' }, { label: 'SHA-1', value: 'SHA-1' },
                         { label: 'SHA-256', value: 'SHA-256' }, { label: 'SHA-512', value: 'SHA-512' }] }],
    source: 'base',
    baseSourcePath: 'src/views/hash.vue',
    state: 'ready'
  },
  {
    id: 'password-generator',
    category: 'generators',
    name: '密码生成器',
    description: '基于 Web Crypto 生成可配置字符集的随机密码',
    icon: '🔒',
    keywords: ['密码', '随机', '生成', 'password'],
    componentPath: 'generators/PasswordGenerator',
    kind: 'custom',
    options: [
      { key: 'length', label: '长度', type: 'number', defaultValue: 16 },
      { key: 'uppercase', label: '包含大写字母', type: 'switch', defaultValue: true },
      { key: 'lowercase', label: '包含小写字母', type: 'switch', defaultValue: true },
      { key: 'digits', label: '包含数字', type: 'switch', defaultValue: true },
      { key: 'symbols', label: '包含符号', type: 'switch', defaultValue: false }
    ],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'uuid-generator',
    category: 'generators',
    name: 'UUID 生成器',
    description: '批量生成 UUID v4 唯一标识符',
    icon: '🆔',
    keywords: ['uuid', 'guid', '唯一标识', '生成'],
    componentPath: 'generators/UuidGenerator',
    kind: 'custom',
    options: [{ key: 'count', label: '生成数量', type: 'number', defaultValue: 1 }],
    source: 'base',
    baseSourcePath: 'src/views/uuid.vue',
    state: 'ready'
  },
  {
    id: 'lorem-ipsum',
    category: 'generators',
    name: 'Lorem Ipsum 生成器',
    description: '生成英文或中文占位文本，便于排版预览',
    icon: '📄',
    keywords: ['lorem', 'ipsum', '占位文本', '生成'],
    componentPath: 'generators/LoremIpsum',
    kind: 'custom',
    options: [
      { key: 'count', label: '段落数', type: 'number', defaultValue: 3 },
      { key: 'language', label: '文本语言', type: 'select', defaultValue: 'en',
        values: [{ label: '英文', value: 'en' }, { label: '中文', value: 'zh' }] }
    ],
    source: 'base',
    baseSourcePath: 'src/views/ligen.vue',
    state: 'ready'
  },
  {
    id: 'random-number',
    category: 'generators',
    name: '随机数生成器',
    description: '使用 Web Crypto 生成指定范围的随机数',
    icon: '🎯',
    keywords: ['随机数', '生成', 'random', 'crypto'],
    componentPath: 'generators/RandomNumber',
    kind: 'custom',
    options: [
      { key: 'min', label: '最小值', type: 'number', defaultValue: 0 },
      { key: 'max', label: '最大值', type: 'number', defaultValue: 100 },
      { key: 'integer', label: '仅整数', type: 'switch', defaultValue: true }
    ],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'text-diff',
    category: 'text',
    name: '文本对比（Diff）',
    description: '逐行对比两段文本并高亮差异',
    icon: '🔀',
    keywords: ['diff', '对比', '差异', '文本'],
    componentPath: 'text/TextDiff',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/textdiff.vue',
    state: 'ready'
  },
  {
    id: 'text-stats',
    category: 'text',
    name: '文本分析/统计',
    description: '统计字数、字符数、行数与段落数',
    icon: '📊',
    keywords: ['统计', '字数', '行数', 'text stats'],
    componentPath: 'text/TextStats',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/capitalization.vue',
    state: 'ready'
  },
  {
    id: 'markdown-preview',
    category: 'text',
    name: 'Markdown 预览',
    description: '输入 Markdown 实时渲染为 HTML 预览',
    icon: '⬇️',
    keywords: ['markdown', '预览', 'md', '渲染'],
    componentPath: 'text/MarkdownPreview',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/markdown.vue',
    state: 'ready'
  },
  {
    id: 'string-replace',
    category: 'text',
    name: '字符串替换',
    description: '支持普通文本与正则表达式的批量查找替换',
    icon: '🔎',
    keywords: ['替换', '查找', '正则', 'replace'],
    componentPath: 'text/StringReplace',
    kind: 'custom',
    options: [{ key: 'regex', label: '启用正则', type: 'switch', defaultValue: false }],
    source: 'base',
    baseSourcePath: 'src/views/replace.vue',
    state: 'ready'
  },
  {
    id: 'line-tool',
    category: 'text',
    name: '行工具',
    description: '多行文本排序、去重、去空行与加前后缀',
    icon: '📏',
    keywords: ['行工具', '排序', '去重', 'line'],
    componentPath: 'text/LineTool',
    kind: 'custom',
    options: [{ key: 'mode', label: '处理方式', type: 'select', defaultValue: 'sort',
                values: [{ label: '排序', value: 'sort' }, { label: '去重', value: 'unique' },
                         { label: '去空行', value: 'trim-empty' }] }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'ipv4-subnet',
    category: 'network',
    name: 'IPv4 子网计算器',
    description: '根据 CIDR 计算掩码、网络地址、广播地址与可用主机数',
    icon: '🌍',
    keywords: ['ipv4', '子网', 'cidr', '掩码', '网络'],
    componentPath: 'network/Ipv4Subnet',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'ipv6-parse',
    category: 'network',
    name: 'IPv6 解析/展开',
    description: '压缩与展开 IPv6 地址，展示完整 8 段形式',
    icon: '🛰️',
    keywords: ['ipv6', '解析', '展开', '地址'],
    componentPath: 'network/Ipv6Parse',
    kind: 'text',
    transformPath: 'ipv6Parse',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'regex-tester',
    category: 'testers',
    name: '正则表达式测试',
    description: '实时匹配正则表达式并高亮结果',
    icon: '.*',
    keywords: ['正则', 'regex', '表达式', '测试', '匹配'],
    componentPath: 'testers/RegexTester',
    kind: 'custom',
    options: [{ key: 'flags', label: '匹配标志', type: 'text', defaultValue: 'g' }],
    source: 'base',
    baseSourcePath: 'src/views/regex.vue',
    state: 'ready'
  },
  {
    id: 'jsonpath-tester',
    category: 'testers',
    name: 'JSONPath 测试',
    description: '用 JSONPath 表达式查询 JSON 数据（轻量子集）',
    icon: '🧭',
    keywords: ['jsonpath', 'json', '查询', '测试'],
    componentPath: 'testers/JsonpathTester',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'json-schema-validator',
    category: 'testers',
    name: 'JSON Schema 验证',
    description: '按常用 Schema 关键字校验 JSON 结构',
    icon: '✅',
    keywords: ['schema', 'json', '校验', '验证'],
    componentPath: 'testers/JsonSchemaValidator',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'url-parser',
    category: 'testers',
    name: 'URL 解析器',
    description: '拆解 URL 的协议、主机、路径与查询参数',
    icon: '🧩',
    keywords: ['url', '解析', '参数', '查询'],
    componentPath: 'testers/UrlParser',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'color-converter',
    category: 'colors',
    name: '颜色选择器/转换',
    description: 'HEX、RGB、HSL、HSV 颜色格式互转',
    icon: '🎨',
    keywords: ['颜色', '色值', 'hex', 'rgb', 'hsl'],
    componentPath: 'colors/ColorConverter',
    kind: 'custom',
    options: [],
    source: 'base',
    baseSourcePath: 'src/views/color.vue',
    state: 'ready'
  },
  {
    id: 'contrast-checker',
    category: 'colors',
    name: '颜色对比度计算器',
    description: '按 WCAG 公式计算前景/背景对比度与合规等级',
    icon: '◐',
    keywords: ['对比度', 'wcag', '无障碍', '颜色'],
    componentPath: 'colors/ContrastChecker',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'color-blind-sim',
    category: 'colors',
    name: '色盲模拟器',
    description: '用颜色矩阵模拟不同类型色盲下的图片效果',
    icon: '👁️',
    keywords: ['色盲', '模拟', '图片', 'color blind'],
    componentPath: 'colors/ColorBlindSim',
    kind: 'custom',
    options: [{ key: 'type', label: '模拟类型', type: 'select', defaultValue: 'deuteranopia',
                values: [{ label: '绿色盲', value: 'deuteranopia' },
                         { label: '红色盲', value: 'protanopia' },
                         { label: '蓝色盲', value: 'tritanopia' }] }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'image-convert',
    category: 'images',
    name: '图片格式转换',
    description: 'PNG、JPEG、WebP 图片格式互转',
    icon: '🖼️',
    keywords: ['图片', '格式', '转换', 'png', 'jpeg', 'webp'],
    componentPath: 'images/ImageConvert',
    kind: 'custom',
    options: [{ key: 'format', label: '目标格式', type: 'select', defaultValue: 'image/jpeg',
                values: [{ label: 'PNG', value: 'image/png' },
                         { label: 'JPEG', value: 'image/jpeg' },
                         { label: 'WebP', value: 'image/webp' }] }],
    source: 'base',
    baseSourcePath: 'src/views/imageconvert.vue',
    state: 'ready'
  },
  {
    id: 'image-compress',
    category: 'images',
    name: '图片压缩',
    description: '通过 Canvas 重编码降低图片体积',
    icon: '🗜️',
    keywords: ['图片', '压缩', '体积', 'canvas'],
    componentPath: 'images/ImageCompress',
    kind: 'custom',
    options: [{ key: 'quality', label: '压缩质量', type: 'number', defaultValue: 0.8 }],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'http-status',
    category: 'references',
    name: 'HTTP 状态码查询',
    description: '1xx 至 5xx HTTP 状态码含义速查',
    icon: '📡',
    keywords: ['http', '状态码', '404', '500', '查询'],
    componentPath: 'references/HttpStatus',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  },
  {
    id: 'mime-types',
    category: 'references',
    name: 'MIME 类型查询',
    description: '按扩展名或 MIME 类型双向检索',
    icon: '📇',
    keywords: ['mime', '类型', '扩展名', '查询'],
    componentPath: 'references/MimeTypes',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'ready'
  }
]

/** 计算器的 2 张不可点击占位卡，不计入 tools.length。 */
export const comingSoonTools: ToolDefinition[] = [
  {
    id: 'math-expression',
    category: 'calculators',
    name: '数学表达式计算',
    description: '安全解析并计算数学表达式（即将推出）',
    icon: '🧮',
    keywords: ['数学', '表达式', '计算', '计算器'],
    componentPath: 'calculators/MathExpression',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'coming-soon'
  },
  {
    id: 'percentage-calculator',
    category: 'calculators',
    name: '百分比计算器',
    description: '计算占比、增幅与折扣（即将推出）',
    icon: '％',
    keywords: ['百分比', '计算', '折扣', '占比'],
    componentPath: 'calculators/PercentageCalculator',
    kind: 'custom',
    options: [],
    source: 'new',
    state: 'coming-soon'
  }
]

/** 按 id 精确查找工具（包括 comingSoonTools）。 */
export function getTool(id: string): ToolDefinition | undefined {
  return tools.find(tool => tool.id === id)
    ?? comingSoonTools.find(tool => tool.id === id)
}

/** 按分类取工具列表（只读副本，不包含 comingSoonTools）。 */
export function getToolsByCategory(id: ToolCategoryId): ToolDefinition[] {
  return tools.filter(tool => tool.category === id)
}

/** 中英文模糊搜索：匹配 id、名称、描述、关键词与分类。 */
export function searchTools(keyword: string): ToolDefinition[] {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) {
    return tools.slice()
  }
  return tools.filter(tool =>
    [tool.id, tool.name, tool.description, tool.category, ...tool.keywords]
      .some(field => field.toLowerCase().includes(normalized))
  )
}
