// 格式化器类纯函数：JSON / SQL / XML / HTML / CSS，全部在浏览器本地同步完成。
// 基于 HeHang0/devtoys:src/views/formatter.vue 移植（MIT）
import { format as formatSql } from 'sql-formatter'
import formatXml from 'xml-formatter'
import type { ToolResult, ToolTransform } from '../tools/contracts'

type Options = Readonly<Record<string, string | number | boolean>>

/** 统一的文本结果构造器，避免各格式化函数返回结构不一致。 */
function textResult(text: string): ToolResult {
  return { kind: 'text', text, mimeType: 'text/plain;charset=utf-8' }
}

/** 把 registry 的 indent 选项（2 / 4 / '\t' / 数字）转换为实际缩进字符串。 */
function indentation(value: string | number | boolean | undefined, fallback: string): string {
  if (value === '\t') {
    return '\t'
  }
  const size = Number(value)
  if (!Number.isFinite(size)) {
    return fallback
  }
  return ' '.repeat(Math.min(8, Math.max(0, Math.trunc(size))))
}

/** 数字型缩进选项的边界保护。 */
function indentSize(value: string | number | boolean | undefined, fallback: number): number {
  const size = Number(value)
  if (!Number.isFinite(size)) {
    return fallback
  }
  return Math.min(8, Math.max(0, Math.trunc(size)))
}

/**
 * JSON 美化 / 压缩 / 校验。
 * options: indent（2 | 4 | '\t'）、minify（布尔）。
 * 解析失败时抛出中文错误，由 defineTextTool 转成 error 状态。
 */
export const jsonFormat: ToolTransform = (input: string, options: Options): ToolResult => {
  const source = input.trim()
  if (!source) {
    throw new Error('输入为空，请粘贴需要处理的 JSON')
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(source)
  } catch {
    throw new Error('JSON 格式无效，请检查括号与引号后重试')
  }
  if (options.minify === true) {
    return textResult(JSON.stringify(parsed))
  }
  return textResult(JSON.stringify(parsed, null, indentation(options.indent, '  ')))
}

/**
 * SQL 语句格式化，底层使用基座自带的 sql-formatter。
 * options: uppercase（关键字大写）。
 */
export const sqlFormat: ToolTransform = (input: string, options: Options): ToolResult => {
  if (!input.trim()) {
    throw new Error('输入为空，请粘贴需要格式化的 SQL')
  }
  try {
    const formatted = formatSql(input, {
      language: 'sql',
      keywordCase: options.uppercase === true ? 'upper' : 'preserve',
      tabWidth: 2,
      useTabs: false,
      linesBetweenQueries: 1
    })
    return textResult(formatted)
  } catch {
    throw new Error('SQL 解析失败，请检查语句后重试')
  }
}

/**
 * XML 缩进美化 / 空白压缩，底层使用基座自带的 xml-formatter。
 * options: indent（数字）、collapse（压缩标签间空白）。
 */
export const xmlFormat: ToolTransform = (input: string, options: Options): ToolResult => {
  const source = input.trim()
  if (!source) {
    throw new Error('输入为空，请粘贴需要格式化的 XML')
  }
  try {
    if (options.collapse === true) {
      // 只压缩标签之间的空白，不触碰标签属性与文本内容。
      return textResult(source.replace(/>\s+</g, '><'))
    }
    const formatted = formatXml(source, {
      indentation: ' '.repeat(indentSize(options.indent, 2)),
      lineSeparator: '\n',
      // 文本节点与宿主元素保持同一行，得到 <a>1</a> 而非三行展开。
      collapseContent: true,
      throwOnFailure: true
    })
    return textResult(formatted)
  } catch {
    throw new Error('XML 格式无效，请检查标签配对后重试')
  }
}

/** 无需换行的 HTML 空元素，遇到它们不增加缩进层级。 */
const HTML_VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr'
])

/** HTML 词法切分：注释、CDATA、doctype、script/style 整块、闭合/开放标签、文本。 */
const HTML_TOKEN_PATTERN = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<![A-Za-z][^>]*>|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<\/[^>]+>|<[^>]+>|[^<]+/gi

/**
 * HTML 源码缩进：纯前端词法扫描，零新增依赖。
 * options: indent（数字）。
 */
export const htmlFormat: ToolTransform = (input: string, options: Options): ToolResult => {
  if (!input.trim()) {
    throw new Error('输入为空，请粘贴需要格式化的 HTML')
  }
  const unit = ' '.repeat(indentSize(options.indent, 2))
  const tokens = input.match(HTML_TOKEN_PATTERN) ?? []

  // 合并「开始标签 + 短文本 + 结束标签」为一行，保留 <span>hi</span> 这类行内结构。
  const mergedTokens: string[] = []
  for (let index = 0; index < tokens.length; index += 1) {
    const current = tokens[index]?.trim() ?? ''
    const next = tokens[index + 1]?.trim() ?? ''
    const after = tokens[index + 2]?.trim() ?? ''
    if (current.startsWith('<') && !current.startsWith('</') && !current.startsWith('<!')
      && next && !next.startsWith('<') && after.startsWith('</')) {
      const openingTag = /^<([A-Za-z][\w:-]*)/.exec(current)?.[1]?.toLowerCase() ?? ''
      const closingTag = /^<\/([A-Za-z][\w:-]*)/.exec(after)?.[1]?.toLowerCase() ?? ''
      if (openingTag && openingTag === closingTag) {
        mergedTokens.push(current + next + after)
        index += 2
        continue
      }
    }
    mergedTokens.push(tokens[index] ?? '')
  }

  const lines: string[] = []
  let depth = 0

  for (const rawToken of mergedTokens) {
    const token = rawToken.trim()
    if (!token) {
      continue
    }
    // 注释 / CDATA / DOCTYPE 保持原文，仅按当前层级整体缩进。
    if (token.startsWith('<!--') || token.startsWith('<![CDATA[') || /^<![A-Za-z]/.test(token)) {
      token.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim()
        if (trimmed) {
          lines.push(unit.repeat(depth) + trimmed)
        }
      })
      continue
    }
    // script / style 整块已经在词法阶段合并，不再单独增减层级。
    if (/^<(script|style)\b[\s\S]*<\/\1\s*>$/i.test(token)) {
      token.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim()
        if (trimmed) {
          lines.push(unit.repeat(depth) + trimmed)
        }
      })
      continue
    }
    // 词法合并产生的「同一 token 内完整元素」：<span class="x">hi</span>。
    // 它自带结束标签，净深度为 0，不能再走下面的通用开始标签分支增加缩进。
    if (/^<([A-Za-z][\w:-]*)\b[^>]*>[\s\S]*<\/\1\s*>$/i.test(token)) {
      lines.push(unit.repeat(depth) + token)
      continue
    }
    if (token.startsWith('</')) {
      depth = Math.max(0, depth - 1)
      lines.push(unit.repeat(depth) + token)
      continue
    }
    if (token.startsWith('<')) {
      const tagName = /^<([A-Za-z][\w:-]*)/.exec(token)?.[1]?.toLowerCase() ?? ''
      lines.push(unit.repeat(depth) + token)
      if (tagName && !HTML_VOID_TAGS.has(tagName) && !/\/$/.test(token.replace(/>$/, ''))) {
        depth += 1
      }
      continue
    }
    lines.push(unit.repeat(depth) + token)
  }

  return textResult(lines.join('\n'))
}

/**
 * CSS 规则缩进：字符状态机处理括号、分号、字符串与注释，零新增依赖。
 * options: indent（数字）。
 */
export const cssFormat: ToolTransform = (input: string, options: Options): ToolResult => {
  if (!input.trim()) {
    throw new Error('输入为空，请粘贴需要格式化的 CSS')
  }
  const unit = ' '.repeat(indentSize(options.indent, 2))
  const lines: string[] = []
  let buffer = ''
  let depth = 0
  let quote = ''
  let inComment = false

  /** 把缓冲区内容收敛为一行并清空缓冲区；声明行补上冒号后的空格。 */
  function flush(suffix: string): void {
    let value = buffer.replace(/\s+/g, ' ').trim()
    buffer = ''
    if (!value) {
      return
    }
    if (suffix === ';') {
      value = value.replace(/^([^:]+):\s*/, '$1: ')
    }
    lines.push(unit.repeat(depth) + value + suffix)
  }

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index] ?? ''
    const next = input[index + 1] ?? ''

    if (inComment) {
      buffer += char
      if (char === '*' && next === '/') {
        buffer += next
        index += 1
        inComment = false
      }
      continue
    }
    if (quote) {
      buffer += char
      if (char === '\\' && index + 1 < input.length) {
        buffer += input[index + 1] ?? ''
        index += 1
        continue
      }
      if (char === quote) {
        quote = ''
      }
      continue
    }
    if (char === '/' && next === '*') {
      buffer += char + next
      index += 1
      inComment = true
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      buffer += char
      continue
    }
    if (char === '{') {
      const selector = buffer.replace(/\s+/g, ' ').trim()
      if (selector) {
        flush(' {')
      } else {
        lines.push(unit.repeat(depth) + '{')
      }
      buffer = ''
      depth += 1
      continue
    }
    if (char === ';') {
      flush(';')
      continue
    }
    if (char === '}') {
      flush(';')
      depth = Math.max(0, depth - 1)
      let closing = '}'
      if (input[index + 1] === ';') {
        closing += ';'
        index += 1
      }
      lines.push(unit.repeat(depth) + closing)
      continue
    }
    buffer += char
  }
  flush('')

  return textResult(lines.join('\n'))
}
