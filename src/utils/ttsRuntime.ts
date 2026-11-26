// 浏览器本地语音运行时：piper-plus 负责中文 G2P + VITS 合成，ONNX Runtime Web 负责推理。
// 可选多个静态模型；模型按需下载并缓存到浏览器，没有后端，不上传音频或文本。
import { PiperPlus, SpeakerEncoder } from 'piper-plus'
import * as ort from 'onnxruntime-web'
import ortWasmMjsUrl from 'onnxruntime-web/ort-wasm-simd-threaded.jsep.mjs?url'
import ortWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm?url'
import { getTtsModel } from '@/data/ttsModels'

export interface RuntimeProgress {
  stage: string
  message: string
  /** 模型下载进度：0–100；其他阶段缺省。 */
  percent?: number
}

const REVISION = '3620ed788667cb76f08bd6cf2db8152c1f4c8bd1'
const MODEL_HOSTS = [
  { name: 'HF 镜像', base: 'https://hf-mirror.com/' },
  { name: 'Hugging Face', base: 'https://huggingface.co/' }
] as const
const CACHE_NAME = 'devtoys-web-tts-models-v1'
const ENCODER_REPO = 'ayousanz/piper-plus-base'
const ENCODER_FILE = 'releases/zs-v1/campplus.onnx'
const ENCODER_SHA256 = 'a6ac6a63997761ae2997373e2ee1c47040854b4b759ea41ec48e4e42df0f4d73'

const MODEL_BASE = new URL('./models/piper-plus-zs-v1/', document.baseURI).href
const PINYIN_SINGLE_URL = `${MODEL_BASE}pinyin_single.json`
const PINYIN_PHRASES_URL = `${MODEL_BASE}pinyin_phrases.json`

let pinyinSingle: Uint8Array | null = null
let pinyinPhrases: Uint8Array | null = null

ort.env.wasm.simd = true
ort.env.wasm.numThreads = globalThis.crossOriginIsolated
  ? Math.max(1, Math.min(4, navigator.hardwareConcurrency || 1))
  : 1
ort.env.wasm.wasmPaths = { mjs: ortWasmMjsUrl, wasm: ortWasmUrl }

const ttsSessions = new Map<string, Promise<PiperPlus>>()
let encoderPromise: Promise<SpeakerEncoder> | null = null

/** piper-plus 默认按页面相对路径找拼音词典，这里改为读取仓库内同源小文件（2.6 MB）。 */
async function loadPinyinDictionaries(): Promise<void> {
  if (pinyinSingle && pinyinPhrases) return
  const [single, phrases] = await Promise.all([
    fetch(PINYIN_SINGLE_URL),
    fetch(PINYIN_PHRASES_URL)
  ])
  if (!single.ok || !phrases.ok) {
    throw new Error('本地拼音词典缺失，请检查 public/models/piper-plus-zs-v1 目录')
  }
  pinyinSingle = new Uint8Array(await single.arrayBuffer())
  pinyinPhrases = new Uint8Array(await phrases.arrayBuffer())
}

/** 用自定义 wasmLoader 注入词典，避免运行时拼出错误的 ../../assets/ 路径。 */
async function wasmLoader(): Promise<unknown> {
  await loadPinyinDictionaries()
  // piper-plus 未为该子路径提供 .d.ts，运行时由 Vite 静态打包。
  // @ts-expect-error missing declaration for wasm entry
  const module = await import('piper-plus/wasm/multilingual') as any
  const Base = module.WasmPhonemizer as new (config: string) => {
    setChineseDictionary?: (single: Uint8Array, phrases: Uint8Array) => void
  }
  class LocalDictionaryPhonemizer extends Base {
    constructor(config: string) {
      super(config)
      if (pinyinSingle && pinyinPhrases) {
        this.setChineseDictionary?.(pinyinSingle, pinyinPhrases)
      }
    }
  }
  return { default: module.default, WasmPhonemizer: LocalDictionaryPhonemizer }
}

function modelUrl(host: string, repoId: string, revision: string | undefined, file: string): string {
  return `${host}${repoId}/resolve/${revision ?? 'main'}/${file}`
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  if (!globalThis.crypto?.subtle) return ''
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

/** 下载模型并缓存；优先 HF 镜像，失败自动回退官方源，SHA-256 校验防篡改。 */
async function fetchCachedModel(
  file: string,
  expectedSha256: string,
  repoId: string,
  revision?: string
): Promise<ArrayBuffer> {
  const cache = await caches.open(CACHE_NAME)
  const cacheKey = `${repoId}/${revision ?? 'main'}/${file}`
  const cached = await cache.match(cacheKey)
  if (cached?.ok) {
    const buffer = await cached.arrayBuffer()
    const actual = await sha256Hex(buffer)
    if (!actual || actual === expectedSha256) return buffer
    await cache.delete(cacheKey)
  }

  let lastError: unknown
  for (const host of MODEL_HOSTS) {
    try {
      const response = await fetch(modelUrl(host.base, repoId, revision, file))
      if (!response.ok) throw new Error(`${host.name} 返回 ${response.status}`)
      const buffer = await response.arrayBuffer()
      const actual = await sha256Hex(buffer)
      if (actual && actual !== expectedSha256) throw new Error(`${host.name} 模型校验失败`)
      await cache.put(cacheKey, new Response(buffer, {
        headers: { 'content-type': 'application/octet-stream' }
      }))
      return buffer
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(lastError instanceof Error ? lastError.message : '语音模型下载失败')
}

const PROGRESS_LABELS: Record<string, string> = {
  model: '正在下载语音模型',
  phonemizer: '正在准备中文音素库',
  ready: '本地语音引擎就绪'
}

/** 把 piper-plus 的阶段进度（0–1）换算成面板用的百分比；model 阶段之外无意义。 */
function stagePercent(stage: string, progress: number): number | undefined {
  if (stage !== 'model') return undefined
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0))
  return Math.round(clamped * 100)
}

/** 获取（并复用）指定模型的 TTS 会话；不同模型独立缓存。 */
export function getTtsRuntime(
  modelId: string,
  onProgress?: (info: RuntimeProgress) => void
): Promise<PiperPlus> {
  const existing = ttsSessions.get(modelId)
  if (existing) return existing

  const definition = getTtsModel(modelId)
  if (!definition) {
    return Promise.reject(new Error('不支持的语音模型'))
  }

  const session = (async () => {
    let lastError: unknown
    for (const host of MODEL_HOSTS) {
      try {
        return await PiperPlus.initialize({
          model: modelUrl(host.base, definition.repoId, definition.revision, definition.onnxFile),
          ort,
          wasmLoader,
          showModelNotice: false,
          onProgress: info => {
            onProgress?.({
              stage: info.stage,
              message: PROGRESS_LABELS[info.stage] ?? (info.message || '正在准备本地语音模型'),
              percent: stagePercent(info.stage, info.progress)
            })
          }
        })
      } catch (error) {
        lastError = error
        onProgress?.({ stage: 'model', message: `${host.name} 加载失败，正在尝试备用源` })
      }
    }
    throw lastError instanceof Error ? lastError : new Error('语音模型加载失败')
  })().catch(error => {
    ttsSessions.delete(modelId)
    throw error
  })

  ttsSessions.set(modelId, session)
  return session
}

/** 获取（并复用）声纹编码器；仅零样本克隆模型需要。 */
export function getSpeakerEncoder(onProgress?: (info: RuntimeProgress) => void): Promise<SpeakerEncoder> {
  if (!encoderPromise) {
    encoderPromise = (async () => {
      onProgress?.({ stage: 'encoder', message: '正在准备本地声纹模型' })
      const modelData = await fetchCachedModel(ENCODER_FILE, ENCODER_SHA256, ENCODER_REPO, REVISION)
      return SpeakerEncoder.initialize({
        modelData,
        ort,
        frontEnd: 'kaldi-fbank'
      })
    })().catch(error => {
      encoderPromise = null
      throw error
    })
  }
  return encoderPromise
}
