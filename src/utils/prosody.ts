// 智能韵律引擎：把普通文本自动转换为带停顿与语速控制的 SSML。
// 纯本地、无网络：默认开启的「智能断句」不发送任何文本到外部。
export type ProsodyEngineId = 'off' | 'rules' | 'cloud'

export interface ProsodyEngineDefinition {
  id: ProsodyEngineId
  name: string
  description: string
  needsNetwork: boolean
}

/** 供下拉选择用的引擎清单（单一配置源，禁止散落到组件里）。 */
export const prosodyEngines: ProsodyEngineDefinition[] = [
  {
    id: 'rules',
    name: '本地规则（默认）',
    description: '按标点自动插入停顿，问句放慢、感叹句加快，纯本地处理',
    needsNetwork: false
  },
  {
    id: 'cloud',
    name: '云端大模型（实验）',
    description: '把文本发给所配置的大模型接口，生成更自然的语气标注；会外发文本',
    needsNetwork: true
  },
  {
    id: 'off',
    name: '关闭',
    description: '不做任何语气语速处理，整段按统一语速朗读',
    needsNetwork: false
  }
]

export function getProsodyEngine(id: string): ProsodyEngineDefinition | undefined {
  return prosodyEngines.find(engine => engine.id === id)
}

/** XML 属性与文本转义；文本不转义 & 会导致 SSML 解析失败。 */
export function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

interface ProsodyContext {
  /** 全局语速（工具选项 rate），SSML 速率按它换算。 */
  rate: number
}

/** 句末标点 → 停顿时长（毫秒）。问句加长以模拟疑问语气。 */
const SENTENCE_END_PAUSE: Record<string, number> = {
  '。': 420,
  '！': 300,
  '？': 560,
  '…': 500,
  '.': 380,
  '!': 280,
  '?': 520
}

/** 句中标点 → 停顿时长（毫秒），用于句内插入 <break>。 */
const CLAUSE_PAUSE: Record<string, number> = {
  '，': 220,
  '、': 160,
  '；': 320,
  '：': 300,
  '——': 340,
  ',': 200,
  ';': 300,
  ':': 280
}

/** 把句内逗号等替换成 <break>：先转义文本，再按标点拆段。 */
function insertClauseBreaks(sentence: string): string {
  const parts = sentence.split(/([，、；：—,\;:]+)/).filter(part => part.length > 0)
  let out = ''
  for (const part of parts) {
    const trimmed = part.trim()
    const pause = CLAUSE_PAUSE[trimmed]
    if (pause !== undefined) {
      out += `<break time="${pause}ms"/>`
    } else if (trimmed) {
      out += escapeXmlText(trimmed)
    }
  }
  return out
}

/**
 * 句级语气 → SSML rate 百分比。
 * piper-plus 的 prosody rate 是 length_scale 倍率（>1 更慢、<1 更快），
 * 最终 lengthScale = (1/全局语速) × 句倍率 × 语气系数；SSML 百分比 = 100/lengthScale。
 * 问句放慢约 12%，感叹句加快约 8%。
 */
function rateForSentence(text: string, globalRate: number): string {
  const endsWithQuestion = /[？?]\s*$/.test(text)
  const endsWithExclaim = /[！!]\s*$/.test(text)
  let lengthScale = 1 / globalRate
  if (endsWithQuestion) lengthScale *= 1.12
  else if (endsWithExclaim) lengthScale *= 0.92
  return `${Math.round((100 / lengthScale) * 10) / 10}%`
}

/**
 * 按句末标点切句（保留标点）。只用于展示「第 x / y 句」的进度，
 * 与规则引擎内部逻辑共享同一个切分结果。
 */
export function splitIntoClauses(text: string): string[] {
  const normalized = text.replace(/\r\n?/g, '\n').trim()
  if (!normalized) return []
  return normalized
    .split(/(?<=[。！？!?…])\s*/)
    .map(part => part.trim())
    .filter(part => part.length > 0)
}

/**
 * 规则引擎：把整段文本转成 SSML。
 * - 句号/问号/感叹号等句末标点 → 400ms 级停顿
 * - 逗号顿号等句中标点 → 160–320ms 停顿
 * - 问句整句放慢约 12%，感叹句加快约 8%
 * - 换行视为段落间隔（600ms）
 */
export function buildRuleSsml(text: string, context: ProsodyContext): string {
  const sentences = splitIntoClauses(text)
  const body = sentences.map(sentence => {
    const rate = rateForSentence(sentence, context.rate)
    const ending = sentence.match(/[。！？!?…]\s*$/)?.[0]?.trim() ?? ''
    const pause = SENTENCE_END_PAUSE[ending] ?? 300
    return [
      `    <prosody rate="${rate}">`,
      insertClauseBreaks(sentence),
      `</prosody>`,
      `    <break time="${pause}ms"/>`
    ].join('')
  })
  return [
    '<speak>',
    ...body,
    '    <break time="600ms"/>',
    '</speak>'
  ].join('\n')
}

// ——— 云端大模型引擎（实验）———

export interface CloudProsodyConfig {
  endpoint: string
  model: string
  apiKey: string
}

export interface ProsodyMark {
  /** 标注所覆盖的原文句子。 */
  text: string
  rate?: number
  pauseMs?: number
}

/** 提示词与解析逻辑见下；只允许受控的 SSML 输出，失败时回退规则引擎。 */
const CLOUD_SYSTEM_PROMPT = [
  '你是语音合成韵律标注助手。用户会给一段要转成语音的文本，',
  '你按句子输出 JSON 数组，每项形如 {"text":"原句","rate":1.0,"pauseMs":400}。',
  'rate 是 0.5 到 1.8 的语速倍率（小于 1 加快，大于 1 放慢）；',
  'pauseMs 是这句话之后停顿的毫秒数（0 到 1500）。',
  '根据句子的情绪与语义决定数值，例如疑问句略放慢、长句拆短停顿。只输出 JSON。'
].join('')

async function callCloud(
  text: string,
  config: CloudProsodyConfig,
  signal?: AbortSignal
): Promise<ProsodyMark[]> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(config.apiKey ? { authorization: `Bearer ${config.apiKey}` } : {})
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: CLOUD_SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    }),
    signal
  })
  if (!response.ok) {
    throw new Error(`韵律标注接口返回 ${response.status}`)
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content ?? ''
  const jsonText = extractJsonArray(content)
  if (!jsonText) {
    throw new Error('韵律标注返回格式无法解析')
  }
  const parsed = JSON.parse(jsonText) as ProsodyMark[]
  if (!Array.isArray(parsed)) {
    throw new Error('韵律标注返回不是数组')
  }
  return parsed
    .filter(item => typeof item?.text === 'string' && item.text.trim().length > 0)
    .map(item => ({
      text: item.text.trim(),
      rate: clampNumber(item.rate, 0.5, 1.8, 1),
      pauseMs: Math.round(clampNumber(item.pauseMs, 0, 1500, 400))
    }))
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.min(max, Math.max(min, num))
}

/** 从模型输出中提取 JSON 数组（容忍 ```json 包裹）。 */
function extractJsonArray(content: string): string | null {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const source = fenced ? fenced[1] : content
  const start = source.indexOf('[')
  const end = source.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  return source.slice(start, end + 1)
}

/** 云端标注 → SSML。句级 rate 倍率换算为百分比并叠合全局语速。 */
export function buildSsmlFromMarks(marks: ProsodyMark[], context: ProsodyContext): string {
  const body = marks.map(mark => {
    const scale = (mark.rate ?? 1) / context.rate
    const rate = `${Math.round((100 / scale) * 10) / 10}%`
    const pause = mark.pauseMs ? `\n      <break time="${mark.pauseMs}ms"/>` : ''
    return `    <prosody rate="${rate}">${escapeXmlText(mark.text)}</prosody>${pause}`
  })
  return [
    '<speak>',
    ...body,
    '</speak>'
  ].join('\n')
}

/**
 * 统一入口：按引擎生成 SSML。
 * cloud 失败时自动回退规则引擎，保证「永远能出声」。
 */
export async function generateSsml(
  text: string,
  engineId: ProsodyEngineId,
  context: ProsodyContext,
  cloudConfig?: CloudProsodyConfig,
  signal?: AbortSignal
): Promise<string> {
  if (engineId === 'off' || !text.trim()) return text
  if (engineId === 'rules') return buildRuleSsml(text, context)
  if (engineId === 'cloud') {
    if (!cloudConfig?.endpoint) {
      throw new Error('云端韵律引擎未配置接口地址，已回退本地规则')
    }
    const marks = await callCloud(text, cloudConfig, signal)
    if (!marks.length) throw new Error('云端韵律标注结果为空，已回退本地规则')
    return buildSsmlFromMarks(marks, context)
  }
  return text
}
