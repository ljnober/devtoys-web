// 编解码类纯函数：URL 编解码、HTML 实体编解码、Hex ↔ ASCII。
// 基于 HeHang0/devtoys:src/views/url.vue、html.vue 移植算法（MIT）。
// he 为 CommonJS 包：用默认导入以兼容 Node 原生 ESM 的独立函数测试。
import he from 'he'
import type { ToolResult, ToolTransform } from '../tools/contracts'

function text(value: string): ToolResult {
  return { kind: 'text', text: value }
}

function invalid(message: string): never {
  throw new Error(message)
}

export const urlEncode: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  const plusAsSpace = Boolean(options.plusAsSpace ?? false)
  // 含百分号转义序列时视为待解码，否则视为原文编码。
  if (/%[0-9a-fA-F]{2}/.test(raw)) {
    try {
      const normalized = plusAsSpace ? raw.replace(/\+/g, ' ') : raw
      return text(decodeURIComponent(normalized))
    } catch {
      invalid('解码失败，请检查百分号转义序列是否完整')
    }
  }
  const encoded = encodeURIComponent(raw)
  return text(plusAsSpace ? encoded.replace(/%20/g, '+') : encoded)
}

export const htmlEntity: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  // 含完整实体（&nbsp; / &#160; / &#xA0;）时视为待解码。
  if (/&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/.test(raw)) {
    return text(he.decode(raw))
  }
  const named = String(options.mode ?? 'named') === 'named'
  return text(he.encode(raw, {
    useNamedReferences: named,
    decimal: !named
  }))
}

export const hexAscii: ToolTransform = (input, options) => {
  const raw = input.trim()
  if (!raw) {
    return text('')
  }
  const separator = String(options.separator ?? ' ')
  const compact = raw.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '')
  // 仅含十六进制字符与常见分隔符、且字节数成对时，按 Hex → 文本处理。
  const looksHex = /^[0-9a-fA-F\s:0x]+$/i.test(raw)
    && compact.length > 0
    && compact.length % 2 === 0

  if (looksHex) {
    const bytes = new Uint8Array(compact.length / 2)
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Number.parseInt(compact.slice(index * 2, index * 2 + 2), 16)
    }
    return text(new TextDecoder().decode(bytes))
  }

  const bytes = new TextEncoder().encode(raw)
  const parts = Array.from(bytes, byte => byte.toString(16).padStart(2, '0').toUpperCase())
  return text(separator === '0x'
    ? parts.map(part => `0x${part}`).join(' ')
    : parts.join(separator))
}
