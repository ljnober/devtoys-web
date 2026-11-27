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
/** 仅用于向 piper-plus / ONNX Runtime 传递已缓存数据的内存路由，不产生网络请求。 */
const LOCAL_MODEL_HOST = 'https://tts-cache.invalid/'
interface LocalFetchRoute {
  data: ArrayBuffer
  contentType: string
}
const localFetchRoutes = new Map<string, LocalFetchRoute>()
let originalFetch: typeof fetch | null = null

function localModelUrl(modelId: string, file: string): string {
  return `${LOCAL_MODEL_HOST}${encodeURIComponent(modelId)}/${file}`
}

/** 安装一次全局 fetch 拦截；未命中内存路由时原样转发，避免并发初始化互相覆盖。 */
function installLocalFetch(): void {
  if (originalFetch) return
  originalFetch = globalThis.fetch.bind(globalThis)
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : (input as Request).url
    const route = localFetchRoutes.get(url)
    if (route) {
      return Promise.resolve(new Response(route.data, {
        headers: {
          'content-type': route.contentType,
          'content-length': String(route.data.byteLength)
        }
      }))
    }
    return originalFetch!(input, init)
  }) as typeof fetch
}

/** 所有内存路由都释放后还原全局 fetch，减少运行期副作用。 */
function uninstallLocalFetchIfIdle(): void {
  if (localFetchRoutes.size === 0 && originalFetch) {
    globalThis.fetch = originalFetch
    originalFetch = null
  }
}

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
  // @ts-ignore missing declaration for wasm entry
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

/** 带真实下载进度的响应读取；无流式体时退化为 arrayBuffer。 */
async function readResponseBuffer(
  response: Response,
  onProgress?: (loaded: number, total: number) => void
): Promise<ArrayBuffer> {
  const header = Number(response.headers.get('content-length') ?? 0)
  const total = Number.isFinite(header) && header > 0 ? header : 0
  if (!response.body || !onProgress) return response.arrayBuffer()
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      loaded += value.byteLength
      onProgress(loaded, total || loaded)
    }
  }
  const merged = new Uint8Array(loaded)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return merged.buffer
}

/**
 * 下载模型/配置并写入 Cache Storage；优先 HF 镜像，失败回退官方源。
 * expectedSha256 为空时跳过校验（上游未固定摘要的配置文件与部分模型）。
 */
async function fetchCachedModel(
  file: string,
  expectedSha256: string,
  repoId: string,
  revision?: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<ArrayBuffer> {
  const cache = await caches.open(CACHE_NAME)
  const cacheKey = `${repoId}/${revision ?? 'main'}/${file}`
  const cached = await cache.match(cacheKey)
  if (cached?.ok) {
    const buffer = await cached.arrayBuffer()
    const actual = await sha256Hex(buffer)
    if (!expectedSha256 || !actual || actual === expectedSha256) {
      onProgress?.(buffer.byteLength, buffer.byteLength)
      return buffer
    }
    await cache.delete(cacheKey)
  }

  let lastError: unknown
  for (const host of MODEL_HOSTS) {
    try {
      const response = await fetch(modelUrl(host.base, repoId, revision, file))
      if (!response.ok) throw new Error(`${host.name} 返回 ${response.status}`)
      const buffer = await readResponseBuffer(response, onProgress)
      const actual = await sha256Hex(buffer)
      if (expectedSha256 && actual && actual !== expectedSha256) {
        throw new Error(`${host.name} 模型校验失败`)
      }
      await cache.put(cacheKey, new Response(buffer, {
        headers: {
          'content-type': 'application/octet-stream',
          'content-length': String(buffer.byteLength)
        }
      }))
      return buffer
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(lastError instanceof Error ? lastError.message : '语音模型下载失败')
}

const PROGRESS_LABELS: Record<string, string> = {
  model: '正在创建本地语音引擎',
  phonemizer: '正在准备中文音素库',
  ready: '本地语音引擎就绪'
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
        // 模型与配置都先落到 Cache Storage；PiperPlus/ORT 只从内存路由读取，
        // 不再直接请求远端 URL，也不再使用 piper-plus 内部的 IndexedDB 缓存。
        onProgress?.({ stage: 'download', message: `正在下载语音模型（${host.name}）`, percent: 0 })
        const modelData = await fetchCachedModel(
          definition.onnxFile,
          definition.sha256 ?? '',
          definition.repoId,
          definition.revision,
          (loaded, total) => {
            onProgress?.({
              stage: 'download',
              message: `正在下载语音模型 ${Math.round(loaded / 1048576)} / ${Math.round(total / 1048576)} MB`,
              percent: total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : undefined
            })
          }
        )
        const configData = await fetchCachedModel(
          `${definition.onnxFile}.json`,
          '',
          definition.repoId,
          definition.revision
        )
        const modelUrl = localModelUrl(modelId, definition.onnxFile)
        const configUrl = localModelUrl(modelId, `${definition.onnxFile}.json`)
        installLocalFetch()
        localFetchRoutes.set(modelUrl, { data: modelData, contentType: 'application/octet-stream' })
        localFetchRoutes.set(configUrl, { data: configData, contentType: 'application/json' })
        try {
          return await PiperPlus.initialize({
            model: modelUrl,
            ort,
            wasmLoader,
            showModelNotice: false,
            onProgress: info => {
              onProgress?.({
                stage: info.stage === 'model' ? 'engine' : info.stage,
                message: PROGRESS_LABELS[info.stage] ?? (info.message || '正在准备本地语音模型')
              })
            }
          })
        } finally {
          localFetchRoutes.delete(modelUrl)
          localFetchRoutes.delete(configUrl)
          uninstallLocalFetchIfIdle()
        }
      } catch (error) {
        lastError = error
        onProgress?.({ stage: 'download', message: `${host.name} 加载失败，正在尝试备用源` })
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
