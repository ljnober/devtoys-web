// 纯函数 / 核心工具单元测试（node:test + node:assert，零新增依赖）。
// 运行：node --experimental-strip-types --test tests/tools.test.ts
// 覆盖：PRD A4 抽查项、冻结注册表契约、全部 text 类 transform、自研纯函数与错误边界。
import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import type { ToolResult } from '../src/tools/contracts.ts'
import { getTtsModel, ttsModels } from '../src/data/ttsModels.ts'
import {
  buildRuleSsml,
  buildSsmlFromMarks,
  escapeXmlText,
  generateSsml,
  getProsodyEngine,
  prosodyEngines,
  splitIntoClauses,
  type ProsodyMark
} from '../src/utils/prosody.ts'
import {
  categories,
  tools,
  comingSoonTools,
  getTool,
  getToolsByCategory,
  searchTools
} from '../src/tools/registry.ts'
import * as converterTransforms from '../src/utils/transforms-converters.ts'
import * as encoderTransforms from '../src/utils/transforms-encoders.ts'
import * as formatterTransforms from '../src/utils/transforms-formatters.ts'
import { jsonYaml, numberBase, dataSize } from '../src/utils/transforms-converters.ts'
import { urlEncode, htmlEntity, hexAscii } from '../src/utils/transforms-encoders.ts'
import {
  jsonFormat,
  sqlFormat,
  xmlFormat,
  htmlFormat,
  cssFormat
} from '../src/utils/transforms-formatters.ts'
import {
  formatIpv4,
  parseIpv4,
  calculateIpv4Subnet,
  parseIpv6Groups,
  expandIpv6,
  compressIpv6
} from '../src/utils/ip.ts'
import { queryJsonPath } from '../src/utils/jsonpath.ts'
import { validateJsonSchema } from '../src/utils/jsonSchema.ts'
import {
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  hslToRgb,
  hsvToRgb,
  relativeLuminance,
  contrastRatio,
  evaluateWcag,
  applyColorMatrix
} from '../src/utils/color.ts'

// ——— 测试辅助 ———

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EXPECTED_CATEGORY_IDS = [
  'converters', 'encoders', 'formatters', 'generators', 'text',
  'network', 'testers', 'colors', 'images', 'references', 'calculators'
]

/** 断言结果为文本并取出文本，统一验证 ToolResult 形状。 */
function textOf(result: ToolResult): string {
  assert.equal(result.kind, 'text', 'transform 应返回 text 类型的 ToolResult')
  assert.equal(typeof result.text, 'string', 'text 类型结果必须携带字符串 text')
  return result.text as string
}

/** 断言调用抛出中文错误（契约 §7.2：禁止裸异常给 UI）。 */
function assertThrowsChinese(fn: () => unknown, fragment?: string): void {
  assert.throws(fn, (error: unknown) => {
    assert.ok(error instanceof Error, '应抛出 Error 实例')
    assert.ok(/[\u4e00-\u9fa5]/.test(error.message), `错误信息应包含中文，实际：${error.message}`)
    if (fragment) {
      assert.ok(error.message.includes(fragment), `错误信息应包含「${fragment}」，实际：${error.message}`)
    }
    return true
  })
}

// ——— 1. 注册表（冻结契约 §3 / PRD A9）———

describe('注册表结构与契约', () => {
  test('categories 恰为 11 个，id 与顺序固定为 1..11', () => {
    assert.equal(categories.length, 11)
    assert.deepEqual(categories.map(category => category.id), EXPECTED_CATEGORY_IDS)
    assert.deepEqual(categories.map(category => category.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    for (const category of categories) {
      assert.ok(category.name.length > 0, `${category.id} 需有中文名`)
      assert.ok(category.nameEn.length > 0, `${category.id} 需有英文标签`)
      assert.ok(category.description.length > 0, `${category.id} 需有描述`)
    }
  })

  test('tools 恰为 41 个且 state 全为 ready', () => {
    assert.equal(tools.length, 41)
    assert.ok(tools.every(tool => tool.state === 'ready'), '41 个工具必须全部 ready')
  })

  test('comingSoonTools 恰为 2 个且 state 全为 coming-soon', () => {
    assert.equal(comingSoonTools.length, 2)
    assert.ok(comingSoonTools.every(tool => tool.state === 'coming-soon'))
    assert.deepEqual(comingSoonTools.map(tool => tool.id).sort(),
      ['math-expression', 'percentage-calculator'])
  })

  test('41 个工具 id 全局唯一（含 2 个占位共 43 个不重复），且为 kebab-case', () => {
    const allIds = [...tools, ...comingSoonTools].map(tool => tool.id)
    assert.equal(new Set(allIds).size, allIds.length, 'id 必须全局唯一')
    assert.equal(new Set(tools.map(tool => tool.id)).size, 41)
    for (const id of allIds) {
      assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${id} 应为 kebab-case`)
    }
  })

  test('每个工具 category 合法，keywords 含中文，source=base 时带 baseSourcePath', () => {
    for (const tool of [...tools, ...comingSoonTools]) {
      assert.ok(EXPECTED_CATEGORY_IDS.includes(tool.category), `${tool.id} 分类非法`)
      assert.ok(tool.keywords.some(keyword => /[\u4e00-\u9fa5]/.test(keyword)),
        `${tool.id} 的 keywords 必须含中文`)
      assert.ok(tool.icon.length > 0, `${tool.id} 需有图标`)
      assert.ok(Array.isArray(tool.options), `${tool.id} 需有 options 数组`)
      if (tool.source === 'base') {
        assert.ok(tool.baseSourcePath, `${tool.id} source=base 必须有 baseSourcePath`)
      }
      for (const option of tool.options) {
        if (option.type === 'select') {
          assert.ok(option.values && option.values.length > 0,
            `${tool.id} 的 select 选项 ${option.key} 需提供 values`)
        }
      }
    }
  })

  test('每个工具的 componentPath 都对应真实的 .vue 文件', () => {
    for (const tool of tools) {
      const absolute = path.join(projectRoot, 'src', 'tools', `${tool.componentPath}.vue`)
      assert.ok(existsSync(absolute), `${tool.id} 的组件文件缺失：src/tools/${tool.componentPath}.vue`)
    }
  })

  test("kind='text' 的工具 transformPath 必须在 transformers.ts 有函数导出", () => {
    // transformers.ts 用无扩展名 re-export（Vite 可解析、原生 ESM 不可），
    // 故静态核对桶文件的导出名 + 运行时核对各具体实现模块的函数导出。
    const barrel = readFileSync(path.join(projectRoot, 'src', 'utils', 'transformers.ts'), 'utf8')
    const barrelExports = new Set<string>()
    for (const match of barrel.matchAll(/export\s*\{([^}]+)\}/g)) {
      for (const item of (match[1] ?? '').split(',')) {
        const name = item.trim().split(/\s+as\s+/).pop()?.trim()
        if (name) {
          barrelExports.add(name)
        }
      }
    }
    const implementations: Record<string, unknown> = {
      ...converterTransforms,
      ...encoderTransforms,
      ...formatterTransforms
    }
    // transforms-network.ts 内部用无扩展名 './ip'（Node 原生 ESM 不可解析），
    // 其 ipv6Parse 以源码静态核对导出 + ip.ts 纯函数运行时覆盖。
    const networkSource = readFileSync(
      path.join(projectRoot, 'src', 'utils', 'transforms-network.ts'), 'utf8')

    const textTools = tools.filter(tool => tool.kind === 'text')
    assert.ok(textTools.length > 0)
    for (const tool of textTools) {
      assert.ok(tool.transformPath, `${tool.id} kind=text 必须提供 transformPath`)
      const name = tool.transformPath
      assert.ok(barrelExports.has(name), `transformPath「${name}」未在 transformers.ts 导出（工具 ${tool.id}）`)
      if (name === 'ipv6Parse') {
        assert.match(networkSource, /export\s+const\s+ipv6Parse\b/,
          'ipv6Parse 必须在 transforms-network.ts 具名导出')
      } else {
        assert.equal(typeof implementations[name], 'function',
          `transformPath「${name}」未在具体实现模块导出为函数（工具 ${tool.id}）`)
      }
    }
  })

  test("kind='custom' 的工具不应声明 transformPath", () => {
    const invalid = tools.filter(tool => tool.kind === 'custom' && tool.transformPath)
    assert.deepEqual(invalid.map(tool => tool.id), [], 'custom 工具不应走文本变换管线')
  })

  test('getTool / getToolsByCategory / searchTools 行为正确', () => {
    assert.equal(getTool('json-format')?.name, 'JSON 格式化/压缩/校验')
    assert.equal(getTool('math-expression')?.state, 'coming-soon', 'getTool 应覆盖占位工具')
    assert.equal(getTool('不存在'), undefined)
    assert.equal(getToolsByCategory('converters').length, 5)
    assert.equal(getToolsByCategory('generators').length, 6)
    assert.equal(getToolsByCategory('calculators').length, 0, 'calculators 无 ready 工具')
    assert.equal(getTool('text-to-speech')?.category, 'generators')
    assert.equal(searchTools('').length, 41, '空关键词返回全部工具副本')
    assert.ok(searchTools('声音克隆').some(tool => tool.id === 'text-to-speech'))
    assert.ok(searchTools('json').length >= 4, '中英文模糊搜索应命中多个工具')
    assert.ok(searchTools('进制').some(tool => tool.id === 'number-base'))
    assert.deepEqual(searchTools('一定不存在的关键词'), [])
  })
})

// ——— 1b. 语音模型配置（多模型选择组件的单一配置源）———

describe('ttsModels：语音模型配置', () => {
  test('包含 3 个模型且 id 全局唯一', () => {
    assert.equal(ttsModels.length, 3)
    assert.equal(new Set(ttsModels.map(model => model.id)).size, 3)
  })

  test('每个模型都有选择组件所需的展示与推理字段', () => {
    for (const model of ttsModels) {
      assert.ok(model.name.length > 0, `${model.id} 需有名称`)
      assert.ok(model.description.length > 0, `${model.id} 需有描述`)
      assert.ok(model.sizeLabel.length > 0, `${model.id} 需有体积标签`)
      assert.ok(model.repoId.includes('/'), `${model.id} 需有 HF 仓库 id`)
      assert.ok(model.onnxFile.endsWith('.onnx'), `${model.id} 需有 ONNX 文件名`)
      assert.equal(typeof model.supportsCloning, 'boolean')
    }
  })

  test('getTtsModel 按 id 返回模型，未知 id 返回 undefined', () => {
    assert.equal(getTtsModel('zs-v1')?.supportsCloning, true)
    assert.equal(getTtsModel('css10')?.supportsCloning, false)
    assert.equal(getTtsModel('不存在'), undefined)
  })
})

// ——— 1c. 智能韵律引擎（TTS 语气语速自动生成）———

describe('prosody：智能韵律引擎', () => {
  test('引擎清单含 rules/local-llm/cloud/off，本地引擎不联网', () => {
    assert.deepEqual(
      prosodyEngines.map(engine => engine.id).sort(),
      ['cloud', 'local-llm', 'off', 'rules']
    )
    assert.equal(prosodyEngines.length, 4)
    assert.equal(getProsodyEngine('rules')?.needsNetwork, false)
    assert.equal(getProsodyEngine('local-llm')?.needsNetwork, false)
    assert.equal(getProsodyEngine('cloud')?.needsNetwork, true)
    assert.equal(getProsodyEngine('local-llm')?.sizeLabel, '470 MB')
    assert.equal(getProsodyEngine('不存在'), undefined)
  })

  test('escapeXmlText 转义 & < >，其余标点保留', () => {
    assert.equal(escapeXmlText('a&b<c>d'), 'a&amp;b&lt;c&gt;d')
    assert.equal(escapeXmlText('你好，世界！'), '你好，世界！')
  })

  test('splitIntoClauses 按句末标点切句并丢弃空段', () => {
    assert.deepEqual(splitIntoClauses('第一句。第二句！第三句？'), ['第一句。', '第二句！', '第三句？'])
    assert.deepEqual(splitIntoClauses(''), [])
    assert.deepEqual(splitIntoClauses('   \n  '), [])
    assert.deepEqual(splitIntoClauses('没有标点的整段'), ['没有标点的整段'])
  })

  test('buildRuleSsml：句末与句中停顿、问句放慢、感叹句加快、换行间隔', () => {
    const ssml = buildRuleSsml('你好，世界！今天怎么样？再见。', { rate: 1 })
    assert.ok(ssml.startsWith('<speak>'), '应以 <speak> 开头')
    assert.ok(ssml.endsWith('</speak>'), '应以 </speak> 结尾')
    assert.ok(ssml.includes('<break time="220ms"/>'), '逗号应插入 220ms 停顿')
    assert.ok(ssml.includes('<break time="300ms"/>'), '句号后应插入句末停顿')
    assert.ok(ssml.includes('<break time="560ms"/>'), '问句停顿应更长')
    assert.ok(ssml.includes('&amp;') === false, '无 & 时不应转义')
    const prosodies = ssml.match(/<prosody rate="([%.\d]+)">/g) ?? []
    assert.ok(prosodies.length === 3, '三句应各有一个 prosody')
    // 感叹句 108.7%（快），问句 89.3%（慢）：lengthScale 感叹 0.92 / 问句 1.12
    assert.ok(ssml.includes('rate="108.7%"'), '感叹句应加快')
    assert.ok(ssml.includes('rate="89.3%"'), '问句应放慢')
  })

  test('buildRuleSsml：特殊字符被转义，避免 XML 解析失败', () => {
    const ssml = buildRuleSsml('A&B<C>。', { rate: 1 })
    assert.ok(ssml.includes('A&amp;B&lt;C&gt;'))
    assert.ok(!ssml.includes('A&B'))
  })

  test('buildRuleSsml：全局语速叠加句级调节', () => {
    const fast = buildRuleSsml('你好。', { rate: 2 })
    assert.ok(fast.includes('rate="200%"'), '全局语速 2 倍（lengthScale 0.5）→ 200%')
    const slow = buildRuleSsml('你好。', { rate: 0.5 })
    assert.ok(slow.includes('rate="50%"'), '全局语速 0.5 倍（lengthScale 2）→ 50%')
  })

  test('buildSsmlFromMarks：本地/云端标注共用的 SSML 转换，速率范围约束生效', () => {
    const marks: ProsodyMark[] = [
      { text: '快一点说', rate: 0.7, pauseMs: 200 },
      { text: '慢一点说', rate: 1.4, pauseMs: 900 }
    ]
    const ssml = buildSsmlFromMarks(marks, { rate: 1 })
    assert.ok(ssml.startsWith('<speak>'))
    assert.ok(ssml.includes('<prosody rate="142.9%">'))
    assert.ok(ssml.includes('<prosody rate="71.4%">'))
    assert.ok(ssml.includes('<break time="200ms"/>'))
    assert.ok(ssml.includes('<break time="900ms"/>'))
    // 标注文本同样需要转义，防止破坏 XML
    const escaped = buildSsmlFromMarks([{ text: 'A&B<C>' }], { rate: 1 })
    assert.ok(escaped.includes('A&amp;B&lt;C&gt;'))
  })

  test('generateSsml：off 引擎原样返回文本，rules 引擎返回 SSML', async () => {
    const plain = '你好。'
    assert.equal(await generateSsml(plain, 'off', { rate: 1 }), plain)
    const ssml = await generateSsml(plain, 'rules', { rate: 1 })
    assert.notEqual(ssml, plain)
    assert.ok(ssml.startsWith('<speak>'))
  })

  test('generateSsml：cloud 未配置接口时抛出中文错误', async () => {
    await assert.rejects(
      () => generateSsml('你好。', 'cloud', { rate: 1 }),
      /未配置/
    )
  })
})

// ——— 2. JSON 格式化（PRD A4） / 非法输入中文错误 ———

describe('jsonFormat：JSON 格式化 / 压缩 / 校验', () => {
  test('indent=2 使用两空格缩进', () => {
    assert.equal(textOf(jsonFormat('{"a":1}', { indent: 2 })), '{\n  "a": 1\n}')
  })

  test('indent=4 使用四空格缩进', () => {
    assert.equal(textOf(jsonFormat('{"a":1}', { indent: 4 })), '{\n    "a": 1\n}')
  })

  test("indent='\\t' 使用制表符缩进", () => {
    assert.equal(textOf(jsonFormat('{"a":1}', { indent: '\t' })), '{\n\t"a": 1\n}')
  })

  test('minify=true 压缩空白', () => {
    assert.equal(textOf(jsonFormat('{ "a" : [ 1, 2 ] }', { minify: true })), '{"a":[1,2]}')
  })

  test('嵌套结构美化后仍可被 JSON.parse 还原', () => {
    const source = '{"user":{"name":"张三","tags":["a","b"]},"n":1}'
    const formatted = textOf(jsonFormat(source, { indent: 2 }))
    assert.deepEqual(JSON.parse(formatted), JSON.parse(source))
  })

  test('非法 JSON 抛出中文错误', () => {
    assertThrowsChinese(() => jsonFormat('{bad', {}), 'JSON 格式无效')
  })

  test('空输入抛出中文错误', () => {
    assertThrowsChinese(() => jsonFormat('   ', {}), '输入为空')
  })
})

// ——— 3. JSON ↔ YAML（PRD A4） ———

describe('jsonYaml：JSON ↔ YAML 双向转换', () => {
  test('JSON → YAML 输出标准缩进结构', () => {
    assert.equal(textOf(jsonYaml('{"a":1,"b":[1,2]}', {})), 'a: 1\nb:\n  - 1\n  - 2\n')
  })

  test('中文 + 嵌套结构 JSON → YAML → JSON 无损往返', () => {
    const source = { 名称: '张三', 详情: { 年龄: 30, 技能: ['Vue', 'TS'], 已启用: true } }
    const yamlText = textOf(jsonYaml(JSON.stringify(source), {}))
    const restored = JSON.parse(textOf(jsonYaml(yamlText, { direction: 'yaml2json' })))
    assert.deepEqual(restored, source)
  })

  test('YAML → JSON 直接解析中文键值并美化', () => {
    assert.equal(textOf(jsonYaml('名称: 张三\n年龄: 30', { direction: 'yaml2json' })),
      '{\n  "名称": "张三",\n  "年龄": 30\n}')
  })

  test('空输入返回空文本而不是抛错', () => {
    assert.equal(textOf(jsonYaml('  ', {})), '')
  })

  test('非法 JSON 抛出中文错误', () => {
    assertThrowsChinese(() => jsonYaml('{oops', {}), 'JSON 格式无效')
  })
})

// ——— 4. 进制转换（PRD A4） ———

describe('numberBase：BigInt 进制互转', () => {
  test('十进制 → 二进制', () => {
    assert.equal(textOf(numberBase('10', { from: 10, to: 2 })), '1010')
  })

  test('十六进制 → 十进制（大小写均可）', () => {
    assert.equal(textOf(numberBase('FF', { from: 16, to: 10 })), '255')
    assert.equal(textOf(numberBase('ff', { from: 16, to: 10 })), '255')
  })

  test('二进制 → 十六进制', () => {
    assert.equal(textOf(numberBase('11111111', { from: 2, to: 16 })), 'FF')
  })

  test('2^64 大数不丢失精度', () => {
    assert.equal(textOf(numberBase('18446744073709551616', { from: 10, to: 16 })),
      '10000000000000000')
  })

  test('负数与前缀（0x / 0b）处理', () => {
    assert.equal(textOf(numberBase('-255', { from: 10, to: 16 })), '-FF')
    assert.equal(textOf(numberBase('0xFF', { from: 16, to: 10 })), '255')
    assert.equal(textOf(numberBase('0b1010', { from: 2, to: 10 })), '10')
  })

  test('空输入返回空文本', () => {
    assert.equal(textOf(numberBase('', { from: 10, to: 16 })), '')
  })

  test('非法字符与越界进制抛出中文错误', () => {
    assertThrowsChinese(() => numberBase('129', { from: 2, to: 10 }), '不属于 2 进制')
    assertThrowsChinese(() => numberBase('10', { from: 1, to: 16 }), '进制范围')
    assertThrowsChinese(() => numberBase('10', { from: 10, to: 40 }), '进制范围')
  })
})

// ——— 5. 数据大小换算 ———

describe('dataSize：数据单位换算', () => {
  test('GB → MB（1 GB = 1024 MB）', () => {
    assert.equal(textOf(dataSize('1', { from: 'GB', to: 'MB' })), '1024')
  })

  test('bit → B（8 bit = 1 B）', () => {
    assert.equal(textOf(dataSize('8', { from: 'bit', to: 'B' })), '1')
  })

  test('MB → bit（1 MB = 8388608 bit）', () => {
    assert.equal(textOf(dataSize('1', { from: 'MB', to: 'bit' })), '8388608')
  })

  test('小数换算与千分位输入', () => {
    assert.equal(textOf(dataSize('1,024', { from: 'KB', to: 'MB' })), '1')
  })

  test('空输入返回空文本；负数、非法单位抛中文错误', () => {
    assert.equal(textOf(dataSize('  ', { from: 'B', to: 'MB' })), '')
    assertThrowsChinese(() => dataSize('-1', { from: 'B', to: 'MB' }), '非负')
    assertThrowsChinese(() => dataSize('1', { from: 'XX', to: 'MB' }), '不支持的数据单位')
  })
})

// ——— 6. URL 编解码 ———

describe('urlEncode：URL 百分号编解码', () => {
  test('中文编码为 UTF-8 百分号序列', () => {
    assert.equal(textOf(urlEncode('你好', {})), '%E4%BD%A0%E5%A5%BD')
  })

  test('百分号序列解码为中文', () => {
    assert.equal(textOf(urlEncode('%E4%BD%A0%E5%A5%BD', {})), '你好')
  })

  test('plusAsSpace=false 时加号保持原样，空格编码为 %20', () => {
    assert.equal(textOf(urlEncode('a b', { plusAsSpace: false })), 'a%20b')
    assert.equal(textOf(urlEncode('%E4%BD%A0+x', { plusAsSpace: false })), '你+x')
  })

  test('plusAsSpace=true 时空格编码为 +，解码时 + 还原为空格', () => {
    assert.equal(textOf(urlEncode('a b', { plusAsSpace: true })), 'a+b')
    assert.equal(textOf(urlEncode('%E4%BD%A0+x', { plusAsSpace: true })), '你 x')
  })

  test('空输入返回空文本；残缺百分号抛中文错误', () => {
    assert.equal(textOf(urlEncode('  ', {})), '')
    assertThrowsChinese(() => urlEncode('%E4%BD', {}), '解码失败')
  })
})

// ——— 7. HTML 实体 + Hex/ASCII ———

describe('htmlEntity / hexAscii：实体与字节级编解码', () => {
  test('htmlEntity：特殊字符编码为命名/数字实体', () => {
    const encoded = textOf(htmlEntity('<b>你好</b>', {}))
    assert.ok(encoded.includes('&lt;b&gt;'))
    assert.ok(encoded.includes('&#x4F60;'), '中文应编码为数字实体')
  })

  test('htmlEntity：命名实体与数字实体均可解码，中文编解码往返一致', () => {
    assert.equal(textOf(htmlEntity('&nbsp;&#160;&#xA0;', {})), '\u00a0\u00a0\u00a0')
    const encoded = textOf(htmlEntity('<b>你好</b>', {}))
    assert.equal(textOf(htmlEntity(encoded, {})), '<b>你好</b>')
  })

  test('htmlEntity：空输入返回空文本', () => {
    assert.equal(textOf(htmlEntity('  ', {})), '')
  })

  test('hexAscii：UTF-8 字节级 Hex → 文本（中文）', () => {
    assert.equal(textOf(hexAscii('E4 BD A0', {})), '你')
    assert.equal(textOf(hexAscii('48 69', {})), 'Hi')
  })

  test('hexAscii：文本 → 大写 Hex，支持自定义分隔符并往返一致', () => {
    assert.equal(textOf(hexAscii('你好', {})), 'E4 BD A0 E5 A5 BD')
    assert.equal(textOf(hexAscii('Hi', { separator: ':' })), '48:69')
    assert.equal(textOf(hexAscii('Hi', { separator: '0x' })), '0x48 0x69')
    assert.equal(textOf(hexAscii(textOf(hexAscii('你好', {})), {})), '你好')
  })

  test('hexAscii：空输入返回空文本', () => {
    assert.equal(textOf(hexAscii('  ', {})), '')
  })
})

// ——— 8. SQL / XML / HTML / CSS 格式化 ———

describe('格式化器：sqlFormat / xmlFormat / htmlFormat / cssFormat', () => {
  test('sqlFormat：关键字大写与结构化换行', () => {
    const formatted = textOf(sqlFormat('select a,b from t where a=1', { uppercase: true }))
    assert.match(formatted, /SELECT/)
    assert.match(formatted, /FROM/)
    assert.match(formatted, /WHERE/)
    assert.match(formatted, /\n/)
  })

  test('sqlFormat：空输入抛中文错误', () => {
    assertThrowsChinese(() => sqlFormat('  ', {}), '输入为空')
  })

  test('xmlFormat：按缩进美化嵌套结构', () => {
    assert.equal(textOf(xmlFormat('<root><a>1</a><b>2</b></root>', { indent: 2 })),
      '<root>\n  <a>1</a>\n  <b>2</b>\n</root>')
  })

  test('xmlFormat：collapse=true 只压缩标签间空白', () => {
    assert.equal(textOf(xmlFormat('<a>  1  </a>  <b>2</b>', { collapse: true })),
      '<a>  1  </a><b>2</b>')
  })

  test('xmlFormat：非法 XML 抛中文错误', () => {
    assertThrowsChinese(() => xmlFormat('not xml at all', { indent: 2 }), 'XML 格式无效')
  })

  test('htmlFormat：行内元素合并为一行且按层级缩进', () => {
    const formatted = textOf(htmlFormat('<div><span>hi</span></div>', { indent: 2 }))
    assert.ok(formatted.includes('<span>hi</span>'), '行内元素不应被拆行')
    assert.ok(formatted.includes('\n'), '应产生换行')
    assert.ok(formatted.includes('<div>'))
    assert.ok(formatted.includes('</div>'))
  })

  test('htmlFormat【回归 ISSUE-2】：同 token 成对标签净深度为 0，父级闭合标签不额外缩进', () => {
    // 修复前 <span>hi</span> 被当作普通开始标签 depth+1，导致 </div> 多缩进一级。
    assert.equal(textOf(htmlFormat('<div><span>hi</span></div>', { indent: 2 })),
      '<div>\n  <span>hi</span>\n</div>')
  })

  test('htmlFormat【回归 ISSUE-2】：带 class 的成对 span 逐行缩进正确', () => {
    assert.equal(textOf(htmlFormat('<div><span class="x">hi</span></div>', { indent: 2 })),
      '<div>\n  <span class="x">hi</span>\n</div>')
    assert.equal(
      textOf(htmlFormat('<div><section><span class="hl">你好</span></section></div>', { indent: 2 })),
      '<div>\n  <section>\n    <span class="hl">你好</span>\n  </section>\n</div>')
    assert.equal(textOf(htmlFormat('<div><span>hi</span><span>bye</span></div>', { indent: 2 })),
      '<div>\n  <span>hi</span>\n  <span>bye</span>\n</div>')
  })

  test('htmlFormat：空输入抛中文错误', () => {
    assertThrowsChinese(() => htmlFormat('  ', {}), '输入为空')
  })

  test('cssFormat：规则与声明分行并缩进', () => {
    assert.equal(textOf(cssFormat('a{color:red;}', { indent: 2 })),
      'a {\n  color: red;\n}')
  })

  test('cssFormat：能处理带引号与注释的声明', () => {
    const formatted = textOf(cssFormat('/*c*/.x{content:"a;b";color:blue;}', { indent: 2 }))
    assert.match(formatted, /content: "a;b";/)
    assert.match(formatted, /color: blue;/)
  })

  test('cssFormat：空输入抛中文错误', () => {
    assertThrowsChinese(() => cssFormat('  ', {}), '输入为空')
  })
})

// ——— 9. ipv6Parse transform（静态核对 + 底层纯函数覆盖）———

describe('ipv6Parse：text transform 包装契约', () => {
  test('transform 由 expandIpv6 / compressIpv6 组合并输出中文标签', () => {
    // transforms-network.ts 含无扩展名 './ip'，原生 ESM 不能直接 import；
    // 这里静态核对包装契约，实际展开/压缩行为由下方 ip.ts 用例运行时覆盖。
    const source = readFileSync(
      path.join(projectRoot, 'src', 'utils', 'transforms-network.ts'), 'utf8')
    assert.match(source, /expandIpv6\(value\)/)
    assert.match(source, /compressIpv6\(expanded\)/)
    assert.match(source, /展开：\$\{expanded\}/)
    assert.match(source, /压缩：\$\{compressed\}/)
    assert.equal(`展开：${expandIpv6('2001:db8::1')}\n压缩：${compressIpv6(expandIpv6('2001:db8::1'))}`,
      '展开：2001:0db8:0000:0000:0000:0000:0000:0001\n压缩：2001:db8::1')
  })

  test('底层纯函数对空输入返回空、非法地址抛中文错误', () => {
    assertThrowsChinese(() => parseIpv6Groups('gggg::1'), '地址段无效')
    assertThrowsChinese(() => parseIpv6Groups(''), '请输入')
  })
})

// ——— 10. 自研纯函数：ip ———

describe('ip.ts：IPv4 子网与 IPv6 展开/压缩', () => {
  test('parseIpv4 / formatIpv4 基本正确', () => {
    assert.equal(parseIpv4('192.168.1.10'), 3232235786)
    assert.equal(parseIpv4('999.1.1.1'), null)
    assert.equal(parseIpv4('192.168.1'), null)
    assert.equal(formatIpv4(3232235786), '192.168.1.10')
  })

  test('calculateIpv4Subnet：192.168.1.10/24 全字段正确', () => {
    const info = calculateIpv4Subnet('192.168.1.10/24')
    assert.deepEqual({
      address: info.address,
      mask: info.mask,
      wildcardMask: info.wildcardMask,
      network: info.network,
      broadcast: info.broadcast,
      firstHost: info.firstHost,
      lastHost: info.lastHost,
      prefix: info.prefix,
      totalAddresses: info.totalAddresses,
      usableHosts: info.usableHosts,
      isPrivate: info.isPrivate
    }, {
      address: '192.168.1.10',
      mask: '255.255.255.0',
      wildcardMask: '0.0.0.255',
      network: '192.168.1.0',
      broadcast: '192.168.1.255',
      firstHost: '192.168.1.1',
      lastHost: '192.168.1.254',
      prefix: 24,
      totalAddresses: 256,
      usableHosts: 254,
      isPrivate: true
    })
  })

  test('calculateIpv4Subnet：/32 与点分掩码写法', () => {
    const host = calculateIpv4Subnet('10.0.0.1/32')
    assert.equal(host.usableHosts, 0)
    assert.equal(host.network, '10.0.0.1')
    assert.equal(calculateIpv4Subnet('192.168.1.10/255.255.255.0').prefix, 24)
  })

  test('calculateIpv4Subnet：非法前缀 / 非连续掩码抛中文错误', () => {
    assertThrowsChinese(() => calculateIpv4Subnet(''), '请输入')
    assertThrowsChinese(() => calculateIpv4Subnet('192.168.1.1/33'), '0 到 32')
    assertThrowsChinese(() => calculateIpv4Subnet('192.168.1.1/255.0.255.0'), '子网掩码无效')
    assertThrowsChinese(() => calculateIpv4Subnet('1.2.3/24'), 'IPv4 地址格式无效')
  })

  test('parseIpv6Groups / expandIpv6：:: 压缩与 IPv4 映射展开', () => {
    assert.deepEqual(parseIpv6Groups('::1'), [0, 0, 0, 0, 0, 0, 0, 1])
    assert.equal(expandIpv6('2001:db8::1'), '2001:0db8:0000:0000:0000:0000:0000:0001')
    assert.equal(expandIpv6('::ffff:192.168.1.1'),
      '0000:0000:0000:0000:0000:ffff:c0a8:0101')
  })

  test('compressIpv6：最长零段压缩为 ::', () => {
    assert.equal(compressIpv6('2001:0db8:0000:0000:0000:0000:0000:0001'), '2001:db8::1')
    assert.equal(compressIpv6('::'), '::')
  })

  test('parseIpv6Groups：非法地址抛中文错误', () => {
    assertThrowsChinese(() => parseIpv6Groups(''), '请输入')
    assertThrowsChinese(() => parseIpv6Groups('2001::db8::1'), '只能出现一次')
    assertThrowsChinese(() => parseIpv6Groups('gggg::1'), '地址段无效')
  })
})

// ——— 11. 自研纯函数：jsonpath ———

describe('jsonpath.ts：轻量 JSONPath 查询', () => {
  const doc = { a: [{ b: 1 }, { b: 2 }], c: { b: 3 } }

  test('$.a[0].b 精确索引访问', () => {
    assert.deepEqual(queryJsonPath(doc, '$.a[0].b').map(match => match.value), [1])
  })

  test('$[*] 通配符返回所有顶层值', () => {
    const matches = queryJsonPath(doc, '$[*]')
    assert.deepEqual(matches.map(match => match.value), [[{ b: 1 }, { b: 2 }], { b: 3 }])
    assert.deepEqual(matches.map(match => match.path), ['$.a', '$.c'])
  })

  test('$..b 递归下降收集所有同名属性', () => {
    assert.deepEqual(queryJsonPath(doc, '$..b').map(match => match.value), [1, 2, 3])
  })

  test('切片 [start:end] 与负索引', () => {
    assert.deepEqual(queryJsonPath([0, 1, 2, 3, 4], '$[1:3]').map(match => match.value), [1, 2])
    assert.deepEqual(queryJsonPath([10, 20, 30], '$[-1]').map(match => match.value), [30])
  })

  test('不存在的路径返回空数组', () => {
    assert.deepEqual(queryJsonPath(doc, '$.nope'), [])
  })

  test('非法表达式（不以 $ 开头）抛中文错误', () => {
    assertThrowsChinese(() => queryJsonPath(doc, 'a.b'), '必须以 $ 开头')
  })

  test("jsonpath【回归 BUG-1】：方括号单引号/双引号带中划线键正确读取", () => {
    const data = { 'a-b': 7, c_d: 9 }
    assert.deepEqual(queryJsonPath(data, "$['a-b']").map(match => match.value), [7])
    assert.deepEqual(queryJsonPath(data, '$["a-b"]').map(match => match.value), [7])
    assert.deepEqual(queryJsonPath(data, '$["a-b"]').map(match => match.path), ["$['a-b']"])
    assert.deepEqual(queryJsonPath(data, "$['c_d']").map(match => match.value), [9])
  })

  test('jsonpath【回归 BUG-1】：引号键缺少结束 ] 抛中文错误', () => {
    assertThrowsChinese(() => queryJsonPath({ 'a-b': 7 }, "$['a-b'"), '缺少结束符')
    assertThrowsChinese(() => queryJsonPath({ 'a-b': 7 }, '$["a-b"'), '缺少结束符')
    assertThrowsChinese(() => queryJsonPath({ 'a-b': 7 }, "$['a-b'  "), '缺少结束符')
  })

  test('超大数组通配符查询被结果上限截断而不崩溃', () => {
    const huge = Array.from({ length: 5000 }, (_, index) => index)
    const matches = queryJsonPath(huge, '$[*]')
    assert.ok(matches.length <= 2000, '结果数量应受 MAX_RESULTS 约束')
    assert.equal(matches[0]?.value, 0)
  })
})

// ——— 12. 自研纯函数：jsonSchema ———

describe('jsonSchema.ts：必填 / 类型 / 数值 / 数组校验', () => {
  test('合法数据返回 valid=true 且无 issues', () => {
    const result = validateJsonSchema({ name: 'n', age: 20 }, {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' }, age: { type: 'integer', minimum: 0 } }
    })
    assert.equal(result.valid, true)
    assert.deepEqual(result.issues, [])
  })

  test('缺 required 字段报告中文错误与路径', () => {
    const result = validateJsonSchema({}, { type: 'object', required: ['name'] })
    assert.equal(result.valid, false)
    assert.ok(result.issues.some(issue => issue.path === '$' && issue.message.includes('缺少必填字段 name')))
  })

  test('类型不匹配报告中文错误', () => {
    const result = validateJsonSchema('abc', { type: 'integer' })
    assert.equal(result.valid, false)
    assert.ok(result.issues[0]?.message.includes('类型不匹配'))
  })

  test('minimum 违规报告中文错误及字段路径', () => {
    const result = validateJsonSchema({ age: 5 }, {
      type: 'object',
      properties: { age: { type: 'integer', minimum: 10 } }
    })
    assert.equal(result.valid, false)
    assert.ok(result.issues.some(issue => issue.path === '$.age' && issue.message.includes('不能小于 10')))
  })

  test('minimum > maximum 的矛盾约束同时报告两条问题', () => {
    const result = validateJsonSchema(7, { type: 'number', minimum: 10, maximum: 5 })
    assert.equal(result.valid, false)
    assert.equal(result.issues.length, 2)
  })

  test('enum / const / pattern 校验', () => {
    assert.equal(validateJsonSchema('x', { enum: ['a', 'b'] }).valid, false)
    assert.equal(validateJsonSchema('a', { enum: ['a', 'b'] }).valid, true)
    assert.equal(validateJsonSchema({ code: 'AB-123' }, {
      type: 'object', properties: { code: { pattern: '^[A-Z]{2}-\\d{3}$' } }
    }).valid, true)
  })

  test('非法 pattern 不抛异常，转为中文 issue（错误路径安全）', () => {
    const result = validateJsonSchema('abc', { type: 'string', pattern: '[' })
    assert.equal(result.valid, false)
    assert.ok(result.issues[0]?.message.includes('不是合法正则'))
  })

  test('items 递归校验数组元素并标注下标', () => {
    const result = validateJsonSchema([1, 'x'], { type: 'array', items: { type: 'integer' } })
    assert.equal(result.valid, false)
    assert.ok(result.issues.some(issue => issue.path === '$[1]'))
  })

  test('布尔 schema：false 拒绝所有值，true 放行', () => {
    assert.equal(validateJsonSchema(1, false).valid, false)
    assert.equal(validateJsonSchema(1, true).valid, true)
  })

  test('非对象 schema 报告「Schema 必须是对象或布尔值」', () => {
    const result = validateJsonSchema(1, 'oops' as unknown)
    assert.equal(result.valid, false)
    assert.ok(result.issues[0]?.message.includes('Schema 必须是对象或布尔值'))
  })
})

// ——— 13. 自研纯函数：color ———

describe('color.ts：颜色互转与 WCAG 对比度', () => {
  test('parseColor 支持 HEX / 命名 / rgb() / hsl()', () => {
    assert.deepEqual(parseColor('#fff'), { r: 255, g: 255, b: 255 })
    assert.deepEqual(parseColor('#ff0000'), { r: 255, g: 0, b: 0 })
    assert.deepEqual(parseColor('RED'), { r: 255, g: 0, b: 0 })
    assert.deepEqual(parseColor('rgb(255, 0, 0)'), { r: 255, g: 0, b: 0 })
    assert.deepEqual(parseColor('rgb(100%, 0%, 0%)'), { r: 255, g: 0, b: 0 })
    assert.deepEqual(parseColor('hsl(0, 100%, 50%)'), { r: 255, g: 0, b: 0 })
    assert.equal(parseColor('not-a-color'), null)
  })

  test('rgbToHex 输出小写六位并左侧补零', () => {
    assert.equal(rgbToHex({ r: 255, g: 0, b: 0 }), '#ff0000')
    assert.equal(rgbToHex({ r: 0, g: 8, b: 255 }), '#0008ff')
  })

  test('RGB ↔ HSL 互转（红/绿/蓝）', () => {
    assert.deepEqual(rgbToHsl({ r: 255, g: 0, b: 0 }), { h: 0, s: 100, l: 50 })
    assert.deepEqual(rgbToHsl({ r: 0, g: 255, b: 0 }), { h: 120, s: 100, l: 50 })
    assert.deepEqual(hslToRgb({ h: 0, s: 100, l: 50 }), { r: 255, g: 0, b: 0 })
    assert.deepEqual(hslToRgb(rgbToHsl({ r: 0, g: 0, b: 255 })), { r: 0, g: 0, b: 255 })
  })

  test('RGB ↔ HSV 互转', () => {
    assert.deepEqual(rgbToHsv({ r: 255, g: 0, b: 0 }), { h: 0, s: 100, v: 100 })
    assert.deepEqual(hsvToRgb({ h: 0, s: 100, v: 100 }), { r: 255, g: 0, b: 0 })
  })

  test('relativeLuminance / contrastRatio：黑白的对比度为 21:1', () => {
    assert.equal(relativeLuminance({ r: 255, g: 255, b: 255 }), 1)
    assert.equal(relativeLuminance({ r: 0, g: 0, b: 0 }), 0)
    assert.equal(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }), 21)
    assert.equal(contrastRatio({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 }), 1)
  })

  test('evaluateWcag：4.5 通过 AA 正文与大字、不通过 AAA 正文', () => {
    assert.deepEqual(evaluateWcag(4.5), {
      ratio: 4.5,
      aaNormal: true,
      aaLarge: true,
      aaaNormal: false,
      aaaLarge: true
    })
    assert.equal(evaluateWcag(7).aaaNormal, true)
    assert.equal(evaluateWcag(3).aaNormal, false)
  })

  test('applyColorMatrix：三种色盲矩阵均可计算且通道裁剪到 0-255', () => {
    const red = { r: 255, g: 0, b: 0 }
    assert.deepEqual(applyColorMatrix(red, 'protanopia'), { r: 145, g: 142, b: 0 })
    for (const type of ['protanopia', 'deuteranopia', 'tritanopia'] as const) {
      const result = applyColorMatrix(red, type)
      for (const channel of [result.r, result.g, result.b]) {
        assert.ok(channel >= 0 && channel <= 255)
      }
    }
  })
})

// ——— 14. 跨工具边界与错误路径汇总 ———

describe('边界与错误路径（跨工具）', () => {
  test('空输入：纯转换工具统一返回空文本（不抛错）', () => {
    assert.equal(textOf(jsonYaml('', {})), '')
    assert.equal(textOf(numberBase('', {})), '')
    assert.equal(textOf(dataSize('', {})), '')
    assert.equal(textOf(urlEncode('', {})), '')
    assert.equal(textOf(htmlEntity('', {})), '')
    assert.equal(textOf(hexAscii('', {})), '')
  })

  test('非法 JSON：格式化与 YAML 转换均抛中文错误', () => {
    assertThrowsChinese(() => jsonFormat('{ invalid json', {}), 'JSON')
    assertThrowsChinese(() => jsonYaml('{ invalid json', {}), 'JSON')
  })

  test('Schema 缺 required 与 min>max 均被报告（不抛裸异常）', () => {
    assert.equal(validateJsonSchema({}, { required: ['x'] }).valid, false)
    assert.equal(validateJsonSchema(0, { minimum: 5, maximum: 1 }).valid, false)
  })

  test('超长 / 超大数不崩溃', () => {
    const bigBinary = '1'.repeat(1000)
    const hex = textOf(numberBase(bigBinary, { from: 2, to: 16 }))
    assert.ok(hex.length > 0 && /^[0-9A-F]+$/.test(hex), '1000 位二进制应正常转十六进制')
    assert.equal(textOf(dataSize('999999999999', { from: 'GB', to: 'MB' })), '1023999999998976')
    assert.equal(textOf(htmlEntity('你'.repeat(5000), {})).length > 0, true)
  })
})
