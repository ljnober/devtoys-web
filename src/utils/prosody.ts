// 智能韵律引擎：把普通文本自动转换为带停顿与语速控制的 SSML。
// 三条路径：本地规则（零依赖）、本地小模型（浏览器内推理，文本不出本机）、
// 云端大模型（用户自配置接口，会外发文本）。
// onnxruntime-web 的 jsep wasm/mjs 由 Vite 以 ?url 静态打包成同源文件，
// 供 transformers.js 的 ONNX 运行时使用（避免 jsdelivr CDN 外部请求）。
// 注意：?url 是 Vite 专有语法，只在 getLocalLlm 运行时动态导入，
// 保证 Node 单测直接 import 本模块时不经过该路径。
export type ProsodyEngineId = 'off' | 'rules' | 'local-llm' | 'cloud'

export interface ProsodyEngineDefinition {
  id: ProsodyEngineId
  name: string
  description: string
  needsNetwork: boolean
  /** 首次使用需下载的模型体积标签（用于选择器展示）。 */
  sizeLabel?: string
}

/** 供下拉选择用的引擎清单（单一配置源，禁止散落到组件里）。 */
export const prosodyEngines: ProsodyEngineDefinition[] = [
  {
    id: 'rules',
    name: '本地规则（默认）',
    description: '按标点自动插入停顿，问句放慢、感叹句加快，纯本地零下载',
    needsNetwork: false
  },
  {
    id: 'local-llm',
    name: '本地小模型',
    description: 'Qwen2.5-0.5B 在浏览器内推理语气语速，效果更自然；首次下载约 470 MB',
    needsNetwork: false,
    sizeLabel: '470 MB'
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

// ——— 本地小模型引擎（浏览器内推理，文本不出本机）———

export interface LocalLlmProgress {
  stage: 'download' | 'load' | 'generate'
  /** download 阶段 0–100。 */
  percent?: number
  message: string
}

/**
 * Qwen2.5-0.5B-Instruct 的 q4f16 量化（460.6 MB）：Transformers.js 兼容仓库。
 * 首次下载后浏览器缓存，之后完全离线。
 */
const LOCAL_LLM_MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct'
/** 指定 q4f16 量化文件，避免默认拉 fp16（951 MB）。 */
const LOCAL_LLM_DTYPE = 'q4f16'

type TextGenerationPipeline = {
  (text: string, options?: {
    max_new_tokens?: number
    temperature?: number
    do_sample?: boolean
    return_full_text?: boolean
  }): Promise<Array<{ generated_text: Array<{ role: string; content: string }> | string }>>
  dispose?(): Promise<void>
}

let localLlmPipeline: Promise<TextGenerationPipeline> | null = null

export function disposeLocalLlm(): void {
  const pending = localLlmPipeline
  localLlmPipeline = null
  void pending?.then(pipeline => pipeline.dispose?.()).catch(() => {})
}

/**
 * 获取（并复用）本地小模型生成管线。
 * transformers.js 自带浏览器缓存（Cache Storage），进度按文件回调。
 * WASM 运行时从本站加载（Vite ?url 导入），避免默认 jsdelivr CDN 外部请求。
 */
export function getLocalLlm(
  onProgress?: (info: LocalLlmProgress) => void
): Promise<TextGenerationPipeline> {
  if (localLlmPipeline) return localLlmPipeline
  localLlmPipeline = (async () => {
    onProgress?.({ stage: 'download', percent: 0, message: '正在下载本地小模型（首次约 470 MB，之后离线）' })
    const { pipeline, env } = await import('@huggingface/transformers')
    // 与 TTS 模型同策略：优先镜像，失败回退官方源；推理优先 WebGPU，回退 WASM。
    env.allowLocalModels = false
    env.remoteHost = 'https://hf-mirror.com'
    env.remotePathTemplate = '{model}/resolve/{revision}/'
    // hf-mirror 对两类跨域请求会漏掉 CORS 响应头（官方源正常）：
    //   ① Range:bytes=0-0 —— transformers.js 用它探测文件元数据，触发 preflight 失败；
    //   ② cache:'no-store' —— Chrome 下会改写请求上下文，同样导致 CORS 拒绝。
    // 二者叠加时模型根本无法下载。包装 env.fetch 在源头剥离 Range 与 no-store：
    // 经真实浏览器对照验证，裸 GET / 带空 Headers 均 200，只有 no-store 会失败。
    // transformers.js 遇到 200（服务端忽略 Range）时自行读 content-length 作为
    // 文件大小，仅损失一点进度精度，不影响功能与缓存。
    const originalFetch = env.fetch ?? globalThis.fetch
    env.fetch = (url: string | URL, init?: RequestInit) => {
      if (!init) return originalFetch(url, init)
      const headers = init.headers
      const hasRange = headers instanceof Headers
        ? headers.has('range')
        : Boolean(headers && Object.keys(headers as Record<string, string>).some(
          key => key.toLowerCase() === 'range'
        ))
      const needFix = hasRange || init.cache === 'no-store'
      if (!needFix) return originalFetch(url, init)
      const safeInit = { ...init } as RequestInit & { headers?: HeadersInit }
      if (safeInit.cache === 'no-store') safeInit.cache = 'default'
      if (hasRange) {
        if (safeInit.headers instanceof Headers) {
          safeInit.headers = new Headers(safeInit.headers)
          safeInit.headers.delete('range')
        } else if (safeInit.headers) {
          safeInit.headers = Object.fromEntries(
            Object.entries(safeInit.headers as Record<string, string>)
              .filter(([key]) => key.toLowerCase() !== 'range')
          )
        }
      }
      return originalFetch(url, safeInit)
    }
    // transformers.js 默认从 jsdelivr 拉 ort-wasm（外部请求）；改为同源文件。
    // 用根依赖 onnxruntime-web 1.31.1 的 jsep 构建（与 TTS 运行时同源，1.31.x 二进制兼容）。
    // ?url 动态导入只在浏览器运行到这里时发生；Vite 构建期静态替换为哈希资源 URL。
    const [{ default: ortWasmMjs }, { default: ortWasm }] = await Promise.all([
      import('onnxruntime-web/ort-wasm-simd-threaded.jsep.mjs?url'),
      import('onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm?url')
    ])
    const onnxWasmEnv = env.backends?.onnx?.wasm
    if (onnxWasmEnv) {
      onnxWasmEnv.wasmPaths = { mjs: ortWasmMjs, wasm: ortWasm }
    }
    const progressByName = new Map<string, { loaded: number; total: number }>()
    const pipe = await pipeline('text-generation', LOCAL_LLM_MODEL_ID, {
      dtype: LOCAL_LLM_DTYPE,
      progress_callback: (info: unknown) => {
        const event = info as { status?: string; name?: string; progress?: number; loaded?: number; total?: number }
        if (event.status === 'progress' && event.name) {
          progressByName.set(event.name, { loaded: event.loaded ?? 0, total: event.total ?? 0 })
          let loaded = 0
          let total = 0
          for (const item of progressByName.values()) {
            loaded += item.loaded
            total += item.total
          }
          if (total > 0) {
            onProgress?.({
              stage: 'download',
              percent: Math.min(100, Math.round((loaded / total) * 100)),
              message: `正在下载本地小模型 ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} MB`
            })
          }
        } else if (event.status === 'ready') {
          onProgress?.({ stage: 'generate', message: '本地小模型就绪' })
        }
      }
    })
    onProgress?.({ stage: 'load', message: '正在初始化本地小模型推理' })
    return pipe as unknown as TextGenerationPipeline
  })().catch(error => {
    localLlmPipeline = null
    throw error
  })
  return localLlmPipeline
}

/** 本地小模型的系统提示：与云端引擎共用同一标注协议。 */
const LOCAL_LLM_PROMPT = [
  '你是语音合成韵律标注助手。把用户文本按句子输出 JSON 数组，',
  '每项形如 {"text":"原句","rate":1.0,"pauseMs":400}。',
  'rate 是 0.6 到 1.6 的语速倍率（小于 1 加快、大于 1 放慢），',
  'pauseMs 是这句话之后停顿的毫秒数（0 到 1200）。',
  '根据每句的情绪与语义决定数值：疑问句略放慢、长句拆短停顿、',
  '感叹句加快并缩短停顿、陈述句用 1.0。只输出 JSON 数组，不要解释。'
].join('')

/** 用本地小模型生成句级韵律标注；输出复用 buildSsmlFromMarks 转成 SSML。 */
export async function generateLocalLlmMarks(
  text: string,
  signal?: AbortSignal
): Promise<ProsodyMark[]> {
  const pipe = await getLocalLlm()
  const messages = [
    { role: 'system', content: LOCAL_LLM_PROMPT },
    { role: 'user', content: text }
  ]
  // transformers.js 无原生推理中止；取消由外层 raceCancel 竞争退出，
  // 生成结束后仍检查一次 signal 丢弃过期结果。
  const output = await pipe(JSON.stringify(messages), {
    max_new_tokens: 600,
    temperature: 0.2,
    do_sample: true,
    return_full_text: false
  })
  if (signal?.aborted) throw new DOMException('已取消', 'AbortError')
  const generated = output?.[0]?.generated_text
  const content = typeof generated === 'string'
    ? generated
    : generated?.filter(m => m?.role === 'assistant').map(m => m?.content ?? '').join('') ?? ''
  const jsonText = extractJsonArray(content)
  if (!jsonText) {
    throw new Error('本地小模型标注格式无法解析')
  }
  const parsed = JSON.parse(jsonText) as ProsodyMark[]
  if (!Array.isArray(parsed)) {
    throw new Error('本地小模型标注不是数组')
  }
  const marks = parsed
    .filter(item => typeof item?.text === 'string' && item.text.trim().length > 0)
    .map(item => ({
      text: item.text.trim(),
      rate: clampNumber(item.rate, 0.6, 1.6, 1),
      pauseMs: Math.round(clampNumber(item.pauseMs, 0, 1200, 400))
    }))
  if (!marks.length) {
    throw new Error('本地小模型标注结果为空')
  }
  return marks
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
 * local-llm / cloud 失败时由调用方回退规则引擎，保证「永远能出声」。
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
  if (engineId === 'local-llm') {
    const marks = await generateLocalLlmMarks(text, signal)
    return buildSsmlFromMarks(marks, context)
  }
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
