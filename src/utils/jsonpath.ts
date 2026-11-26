// 轻量 JSONPath 子集解析器：支持 $、.key、[index]、['key']、[*]、..key、[start:end]。
// 零新增依赖、纯函数、不依赖 DOM；完整 JSONPath 规范留 P1。

/** 单条路径匹配结果。 */
export interface JsonPathMatch {
  /** 规范化后的匹配路径，如 $.a[0].b */
  path: string
  /** 匹配到的值（只读引用） */
  value: unknown
}

/** 解析后的路径片段。 */
type PathSegment =
  | { kind: 'property'; name: string }
  | { kind: 'index'; index: number }
  | { kind: 'wildcard' }
  | { kind: 'slice'; start: number | null; end: number | null }
  | { kind: 'recursive'; name: string | null }

/** 结果数量上限，避免 pathological 表达式让页面卡死。 */
const MAX_RESULTS = 2000

/** 判断属性名能否用点号安全表示。 */
function isIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
}

/** 拼接下一级路径。 */
function appendProperty(path: string, name: string): string {
  return isIdentifier(name) ? `${path}.${name}` : `${path}['${name.replace(/'/g, "\\'")}']`
}

/**
 * 解析 JSONPath 表达式为片段数组。
 * @param expression 用户输入的表达式，如 `$.a[0].b`
 * @throws 表达式语法错误时抛出中文错误
 */
export function parseJsonPath(expression: string): PathSegment[] {
  const source = expression.trim()
  if (!source) {
    throw new Error('JSONPath 表达式不能为空')
  }
  if (source[0] !== '$') {
    throw new Error('JSONPath 表达式必须以 $ 开头')
  }

  const segments: PathSegment[] = []
  let cursor = 1

  /** 读取点号后的属性名，直到遇到 . 或 [ 。 */
  function readBareName(): string {
    const start = cursor
    while (cursor < source.length && source[cursor] !== '.' && source[cursor] !== '[') {
      cursor += 1
    }
    const name = source.slice(start, cursor)
    if (!name) {
      throw new Error('JSONPath 属性名不能为空')
    }
    return name
  }

  /** 读取方括号内的字符串字面量（单引号或双引号）。 */
  function readQuoted(): string {
    const quote = source[cursor]
    cursor += 1
    let result = ''
    while (cursor < source.length && source[cursor] !== quote) {
      if (source[cursor] === '\\' && cursor + 1 < source.length) {
        result += source[cursor + 1]
        cursor += 2
      } else {
        result += source[cursor]
        cursor += 1
      }
    }
    if (cursor >= source.length) {
      throw new Error('JSONPath 字符串字面量缺少结束引号')
    }
    cursor += 1
    return result
  }

  while (cursor < source.length) {
    const char = source[cursor]
    if (char === '.') {
      cursor += 1
      if (source[cursor] === '.') {
        // 递归下降：..name 或 ..*
        cursor += 1
        if (source[cursor] === '*') {
          cursor += 1
          segments.push({ kind: 'recursive', name: null })
        } else {
          segments.push({ kind: 'recursive', name: readBareName() })
        }
      } else if (source[cursor] === "'" || source[cursor] === '"') {
        segments.push({ kind: 'property', name: readQuoted() })
      } else {
        segments.push({ kind: 'property', name: readBareName() })
      }
      continue
    }

    if (char === '[') {
      cursor += 1
      while (cursor < source.length && /\s/.test(source[cursor])) {
        cursor += 1
      }
      if (source[cursor] === "'" || source[cursor] === '"') {
        const name = readQuoted()
        while (cursor < source.length && /\s/.test(source[cursor])) {
          cursor += 1
        }
        if (source[cursor] !== ']') {
          throw new Error('JSONPath 方括号中引号键缺少结束符 ]')
        }
        cursor += 1
        segments.push({ kind: 'property', name })
      } else {
        const start = cursor
        while (cursor < source.length && source[cursor] !== ']') {
          cursor += 1
        }
        if (cursor >= source.length) {
          throw new Error('JSONPath 方括号缺少结束符 ]')
        }
        const content = source.slice(start, cursor).trim()
        cursor += 1
        if (content === '*') {
          segments.push({ kind: 'wildcard' })
        } else if (content.includes(':')) {
          const parts = content.split(':')
          if (parts.length !== 2) {
            throw new Error('JSONPath 切片仅支持 [start:end] 形式')
          }
          const startValue = parts[0].trim() === '' ? null : Number(parts[0].trim())
          const endValue = parts[1].trim() === '' ? null : Number(parts[1].trim())
          if ([startValue, endValue].some(value => value !== null && !Number.isInteger(value))) {
            throw new Error('JSONPath 切片下标必须是整数')
          }
          segments.push({ kind: 'slice', start: startValue, end: endValue })
        } else if (/^-?\d+$/.test(content)) {
          segments.push({ kind: 'index', index: Number(content) })
        } else if (content) {
          segments.push({ kind: 'property', name: content })
        } else {
          throw new Error('JSONPath 方括号内容不能为空')
        }
      }
      continue
    }

    throw new Error('JSONPath 表达式包含无法识别的字符，请使用 . 或 [] 访问属性')
  }

  return segments
}

/**
 * 执行 JSONPath 查询。
 * @param data 已解析的 JSON 数据
 * @param expression JSONPath 表达式
 * @returns 全部匹配项（保持文档顺序）
 */
export function queryJsonPath(data: unknown, expression: string): JsonPathMatch[] {
  const segments = parseJsonPath(expression)
  let current: JsonPathMatch[] = [{ path: '$', value: data }]

  for (const segment of segments) {
    const next: JsonPathMatch[] = []
    for (const entry of current) {
      collectSegment(entry, segment, next)
      if (next.length >= MAX_RESULTS) {
        return next
      }
    }
    current = next
  }

  return current
}

/** 对单个节点应用一个路径片段，结果写入 output。 */
function collectSegment(entry: JsonPathMatch, segment: PathSegment, output: JsonPathMatch[]): void {
  function push(path: string, value: unknown): void {
    if (output.length < MAX_RESULTS) {
      output.push({ path, value })
    }
  }

  switch (segment.kind) {
    case 'property': {
      const value = entry.value
      if (isRecord(value) && Object.prototype.hasOwnProperty.call(value, segment.name)) {
        push(appendProperty(entry.path, segment.name), value[segment.name])
      }
      break
    }
    case 'index': {
      const value = entry.value
      if (Array.isArray(value)) {
        const index = segment.index < 0 ? value.length + segment.index : segment.index
        if (index >= 0 && index < value.length) {
          push(`${entry.path}[${index}]`, value[index])
        }
      }
      break
    }
    case 'wildcard': {
      const value = entry.value
      if (Array.isArray(value)) {
        value.forEach((item, index) => push(`${entry.path}[${index}]`, item))
      } else if (isRecord(value)) {
        Object.keys(value).forEach(key => push(appendProperty(entry.path, key), value[key]))
      }
      break
    }
    case 'slice': {
      const value = entry.value
      if (Array.isArray(value)) {
        const start = normalizeSliceIndex(segment.start, value.length, 0)
        const end = normalizeSliceIndex(segment.end, value.length, value.length)
        for (let index = start; index < end; index += 1) {
          push(`${entry.path}[${index}]`, value[index])
        }
      }
      break
    }
    case 'recursive': {
      walkRecursive(entry.value, entry.path, segment.name, push)
      break
    }
  }
}

/** 递归下降：深度优先遍历所有后代，收集匹配属性的值。 */
function walkRecursive(
  value: unknown,
  path: string,
  name: string | null,
  push: (path: string, value: unknown) => void
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (name === null) {
        push(`${path}[${index}]`, item)
      }
      walkRecursive(item, `${path}[${index}]`, name, push)
    })
    return
  }
  if (!isRecord(value)) {
    return
  }
  Object.keys(value).forEach(key => {
    const childPath = appendProperty(path, key)
    if (name === null || name === key) {
      push(childPath, value[key])
    }
    walkRecursive(value[key], childPath, name, push)
  })
}

/** 处理切片下标的负数与边界。 */
function normalizeSliceIndex(value: number | null, length: number, fallback: number): number {
  if (value === null) {
    return fallback
  }
  const resolved = value < 0 ? length + value : value
  return Math.max(0, Math.min(length, resolved))
}

/** 判断是否为普通对象（排除 null 与数组）。 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
