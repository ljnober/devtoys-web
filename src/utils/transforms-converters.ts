// 转换器类纯函数：JSON↔YAML、JSON↔XML、进制转换、数据大小换算。
// 基于 HeHang0/devtoys:src/views/json2yaml.vue、number.vue 移植算法（MIT）。
import yaml from 'js-yaml'
import type { ToolResult, ToolTransform } from '../tools/contracts'

/** 构造文本结果，避免每个分支重复写对象字面量。 */
function text(value: string): ToolResult {
  return { kind: 'text', text: value }
}

/** 把非法输入统一抛成中文错误，由 factory 转成 status-change。 */
function invalid(message: string): never {
  throw new Error(message)
}

export const jsonYaml: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  if (options.direction === 'yaml2json') {
    const parsed = yaml.load(raw)
    if (parsed === undefined || parsed === null) {
      return text('')
    }
    return text(JSON.stringify(parsed, null, 2))
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    invalid('JSON 格式无效，请检查括号、引号和逗号后重试')
  }
  return text(yaml.dump(parsed, { noRefs: true, lineWidth: -1 }))
}

/** XML 特殊字符转义。 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** 递归把 JSON 值序列化为 XML；数组以同名标签重复。 */
function valueToXml(value: unknown, tag: string): string {
  if (value === null || value === undefined) {
    return `<${tag}/>`
  }
  if (Array.isArray(value)) {
    return value.map(item => valueToXml(item, tag)).join('')
  }
  if (typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([key, child]) => valueToXml(child, key))
      .join('')
    return children ? `<${tag}>${children}</${tag}>` : `<${tag}/>`
  }
  return `<${tag}>${escapeXml(String(value))}</${tag}>`
}

/** 递归把 DOM 节点还原为普通对象；同名兄弟节点自动合并为数组。 */
function nodeToValue(node: Element): unknown {
  const children = Array.from(node.children)
  if (!children.length) {
    return node.textContent ?? ''
  }
  const result: Record<string, unknown> = {}
  for (const child of children) {
    const value = nodeToValue(child)
    if (Object.prototype.hasOwnProperty.call(result, child.tagName)) {
      const previous = result[child.tagName]
      result[child.tagName] = Array.isArray(previous)
        ? [...previous, value]
        : [previous, value]
    } else {
      result[child.tagName] = value
    }
  }
  return result
}

export const jsonXml: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  if (options.direction === 'xml2json') {
    const document = new DOMParser().parseFromString(raw, 'application/xml')
    if (document.querySelector('parsererror')) {
      invalid('XML 格式无效，请检查标签闭合后重试')
    }
    const root = document.documentElement
    return text(JSON.stringify({ [root.tagName]: nodeToValue(root) }, null, 2))
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    invalid('JSON 格式无效，请检查后重试')
  }
  return text(valueToXml(parsed, 'root'))
}

/** 按任意 2..36 进制把字符串解析为 BigInt，避免大整数精度丢失。 */
function parseBigInt(input: string, base: number): bigint {
  const cleaned = input.replace(/[\s,]/g, '')
  if (!cleaned) {
    invalid('请输入有效的数字')
  }
  const negative = cleaned.startsWith('-')
  let digits = negative ? cleaned.slice(1) : cleaned
  if (base === 16) {
    digits = digits.replace(/^0x/i, '')
  } else if (base === 2) {
    digits = digits.replace(/^0b/i, '')
  } else if (base === 8) {
    digits = digits.replace(/^0o/i, '')
  }
  if (!digits) {
    invalid('数字内容为空')
  }

  let value = 0n
  for (const char of digits.toLowerCase()) {
    const digit = Number.parseInt(char, 36)
    if (!Number.isFinite(digit) || digit >= base) {
      invalid(`数字中包含不属于 ${base} 进制的字符「${char}」`)
    }
    value = value * BigInt(base) + BigInt(digit)
  }
  return negative ? -value : value
}

export const numberBase: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  const from = Number(options.from ?? 10)
  const to = Number(options.to ?? 16)
  if (from < 2 || from > 36 || to < 2 || to > 36) {
    invalid('进制范围必须在 2 到 36 之间')
  }
  return text(parseBigInt(raw, from).toString(to).toUpperCase())
}

/** 单位换算为 bit 的倍率（1 字节 = 8 bit，1 KB = 1024 Byte）。 */
const BYTE_FACTORS: Record<string, bigint> = {
  bit: 1n,
  B: 8n,
  KB: 8n * 1024n,
  MB: 8n * 1024n * 1024n,
  GB: 8n * 1024n * 1024n * 1024n,
  TB: 8n * 1024n * 1024n * 1024n * 1024n
}

export const dataSize: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  const amount = Number(raw.replace(/,/g, ''))
  if (!Number.isFinite(amount) || amount < 0) {
    invalid('请输入非负的数字')
  }
  const fromFactor = BYTE_FACTORS[String(options.from ?? 'B')]
  const toFactor = BYTE_FACTORS[String(options.to ?? 'MB')]
  if (!fromFactor || !toFactor) {
    invalid('不支持的数据单位')
  }
  // 用 BigInt 做整数部分换算，再补回小数，避免浮点累乘误差。
  const scaled = (BigInt(Math.trunc(amount * 1000)) * fromFactor) / toFactor
  const value = Number(scaled) / 1000
  return text(Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''))
}
