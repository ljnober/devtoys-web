// 颜色转换与可访问性纯函数：HEX / RGB / HSL / HSV 互转、WCAG 对比度、色盲模拟矩阵。
// 颜色数值属于工具数据；零新增依赖、零网络调用。

/** 0-255 范围的 RGB 颜色。 */
export interface RgbColor {
  r: number
  g: number
  b: number
}

/** 色相(0-360)、饱和度(0-100)、亮度(0-100)。 */
export interface HslColor {
  h: number
  s: number
  l: number
}

/** 色相(0-360)、饱和度(0-100)、明度(0-100)。 */
export interface HsvColor {
  h: number
  s: number
  v: number
}

/** WCAG 2.1 各级判定结果。 */
export interface WcagResult {
  ratio: number
  aaNormal: boolean
  aaLarge: boolean
  aaaNormal: boolean
  aaaLarge: boolean
}

/** 色盲模拟类型。 */
export type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia'

/** 3x3 颜色变换矩阵（行优先）。 */
export const COLOR_BLIND_MATRICES: Record<ColorBlindType, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525]
}

/** 常见 CSS 颜色名（工具数据，非 UI 样式）。 */
const NAMED_COLORS: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000',
  blue: '#0000ff', yellow: '#ffff00', orange: '#ffa500', purple: '#800080',
  gray: '#808080', grey: '#808080', pink: '#ffc0cb', cyan: '#00ffff',
  magenta: '#ff00ff', lime: '#00ff00', navy: '#000080', teal: '#008080',
  silver: '#c0c0c0', maroon: '#800000', olive: '#808000', aqua: '#00ffff',
  fuchsia: '#ff00ff', transparent: '#000000'
}

/** 把数值限制在 0-255 并取整。 */
function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

/** 解析颜色字符串，失败返回 null。 */
export function parseColor(input: string): RgbColor | null {
  let source = input.trim().toLowerCase()
  if (!source) {
    return null
  }
  if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, source)) {
    source = NAMED_COLORS[source]
  }

  if (source.startsWith('#')) {
    const hex = source.slice(1)
    if (/^[0-9a-f]{3}$/.test(hex)) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      }
    }
    if (/^[0-9a-f]{6}$/.test(hex) || /^[0-9a-f]{8}$/.test(hex)) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      }
    }
    return null
  }

  const rgbMatch = source.match(/^rgba?\(([^)]+)\)$/)
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/[,/\s]+/).filter(Boolean)
    if (parts.length < 3) {
      return null
    }
    const channels = parts.slice(0, 3).map(part => {
      if (part.endsWith('%')) {
        return clampByte(Number(part.slice(0, -1)) * 2.55)
      }
      return clampByte(Number(part))
    })
    if (channels.some(channel => !Number.isFinite(channel))) {
      return null
    }
    return { r: channels[0], g: channels[1], b: channels[2] }
  }

  const hslMatch = source.match(/^hsla?\(([^)]+)\)$/)
  if (hslMatch) {
    const parts = hslMatch[1].split(/[,/\s]+/).filter(Boolean)
    if (parts.length < 3) {
      return null
    }
    const hue = Number(parts[0].replace(/deg$/, ''))
    const saturation = Number(parts[1].replace('%', ''))
    const lightness = Number(parts[2].replace('%', ''))
    if (![hue, saturation, lightness].every(Number.isFinite)) {
      return null
    }
    return hslToRgb({ h: hue, s: saturation, l: lightness })
  }

  return null
}

/** RGB 转 HEX（小写六位）。 */
export function rgbToHex(color: RgbColor): string {
  const toHex = (value: number): string => {
    const raw = clampByte(value).toString(16)
    return raw.length === 1 ? `0${raw}` : raw
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

/** RGB 转 HSL。 */
export function rgbToHsl(color: RgbColor): HslColor {
  const r = clampByte(color.r) / 255
  const g = clampByte(color.g) / 255
  const b = clampByte(color.b) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2
  let hue = 0
  let saturation = 0

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1))
    switch (max) {
      case r: hue = 60 * (((g - b) / delta) % 6); break
      case g: hue = 60 * ((b - r) / delta + 2); break
      default: hue = 60 * ((r - g) / delta + 4); break
    }
  }
  if (hue < 0) {
    hue += 360
  }
  return { h: hue, s: saturation * 100, l: lightness * 100 }
}

/** RGB 转 HSV。 */
export function rgbToHsv(color: RgbColor): HsvColor {
  const r = clampByte(color.r) / 255
  const g = clampByte(color.g) / 255
  const b = clampByte(color.b) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0

  if (delta !== 0) {
    switch (max) {
      case r: hue = 60 * (((g - b) / delta) % 6); break
      case g: hue = 60 * ((b - r) / delta + 2); break
      default: hue = 60 * ((r - g) / delta + 4); break
    }
  }
  if (hue < 0) {
    hue += 360
  }
  return { h: hue, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 }
}

/** HSL 转 RGB。 */
export function hslToRgb(color: HslColor): RgbColor {
  const h = ((color.h % 360) + 360) % 360
  const s = Math.max(0, Math.min(100, color.s)) / 100
  const l = Math.max(0, Math.min(100, color.l)) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let rgb: [number, number, number]

  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]

  return {
    r: clampByte((rgb[0] + m) * 255),
    g: clampByte((rgb[1] + m) * 255),
    b: clampByte((rgb[2] + m) * 255)
  }
}

/** HSV 转 RGB。 */
export function hsvToRgb(color: HsvColor): RgbColor {
  const h = ((color.h % 360) + 360) % 360
  const s = Math.max(0, Math.min(100, color.s)) / 100
  const v = Math.max(0, Math.min(100, color.v)) / 100
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let rgb: [number, number, number]

  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]

  return {
    r: clampByte((rgb[0] + m) * 255),
    g: clampByte((rgb[1] + m) * 255),
    b: clampByte((rgb[2] + m) * 255)
  }
}

/** sRGB 通道线性化。 */
function linearize(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

/** WCAG 相对亮度。 */
export function relativeLuminance(color: RgbColor): number {
  return 0.2126 * linearize(color.r) + 0.7152 * linearize(color.g) + 0.0722 * linearize(color.b)
}

/** WCAG 对比度，返回 1 到 21 之间的数值。 */
export function contrastRatio(foreground: RgbColor, background: RgbColor): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** 按 WCAG 2.1 阈值判定 AA / AAA 文案与大字号是否通过。 */
export function evaluateWcag(ratio: number): WcagResult {
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5
  }
}

/** 应用色盲颜色矩阵，返回 0-255 的 RGB。 */
export function applyColorMatrix(color: RgbColor, type: ColorBlindType): RgbColor {
  const matrix = COLOR_BLIND_MATRICES[type]
  const channels = [color.r, color.g, color.b]
  return {
    r: clampByte(matrix[0] * channels[0] + matrix[1] * channels[1] + matrix[2] * channels[2]),
    g: clampByte(matrix[3] * channels[0] + matrix[4] * channels[1] + matrix[5] * channels[2]),
    b: clampByte(matrix[6] * channels[0] + matrix[7] * channels[1] + matrix[8] * channels[2])
  }
}
