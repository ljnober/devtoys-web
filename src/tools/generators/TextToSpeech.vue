<script setup lang="ts">
// 文字转语音：默认角色使用浏览器系统语音；上传音频后本地提取声纹，
// 用 piper-plus 的零样本模型合成克隆语音。模型、音频与声纹均不上传。
// 智能韵律开关三档：本地规则 / 本地小模型（浏览器内推理，文本不出本机）/
// 云端大模型（自配置接口，会外发文本）。
import { computed, inject, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { AudioResult, parseSsml } from 'piper-plus'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import {
  createVoiceId,
  deleteVoiceProfile,
  listVoiceProfiles,
  saveVoiceProfile,
  type VoiceProfile
} from '@/utils/voiceProfiles'
import ModelSelect from '@/components/ModelSelect.vue'
import TtsProgressPanel, { type TtsStage } from '@/components/TtsProgressPanel.vue'
import { getTtsModel, ttsModels } from '@/data/ttsModels'
import { getSpeakerEncoder, getTtsRuntime } from '@/utils/ttsRuntime'
import {
  buildRuleSsml,
  disposeLocalLlm,
  generateSsml,
  getLocalLlm,
  getProsodyEngine,
  prosodyEngines,
  type CloudProsodyConfig,
  type ProsodyEngineId
} from '@/utils/prosody'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>
const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)

function option(key: string, fallback: number): number {
  const raw = Number(injectedOptions?.value?.[key] ?? fallback)
  return Number.isFinite(raw) ? raw : fallback
}

const rate = computed(() => Math.min(3, Math.max(0.5, option('rate', 1))))
const pitch = computed(() => Math.min(2, Math.max(0.5, option('pitch', 1))))

interface SystemVoiceOption {
  uri: string
  label: string
}

const text = ref('')
const modelId = ref('zs-v1')
const systemVoices = ref<SystemVoiceOption[]>([])
const customVoices = ref<VoiceProfile[]>([])
const roleId = ref('')
const busy = ref(false)
const note = ref('')
const audioBlob = ref<Blob | null>(null)
const audioUrl = ref('')
const audioDuration = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)

// —— 韵律引擎与进度状态 ——
const prosodyEngineId = ref<ProsodyEngineId>('rules')
const cloudEndpoint = ref('')
const cloudModel = ref('')
const cloudApiKey = ref('')
const showCloudConfig = ref(false)
const stage = ref<TtsStage | null>(null)
const stagePercent = ref(0)
const sentenceIndex = ref(0)
const sentenceTotal = ref(0)
const synthesizedSeconds = ref(0)
const stageDetail = ref('')
let abortController: AbortController | null = null
/** 逐句合成循环中置为 true，下一次句间检查即退出。 */
let cancelRequested = false

const uploadName = ref('')
const uploadFile = ref<File | null>(null)
const consent = ref(false)
const enrolling = ref(false)
const progressMessage = ref('')

const result = computed<ToolResult>(() => ({
  kind: 'blob',
  blob: audioBlob.value ?? undefined,
  filename: 'tts-result.wav',
  mimeType: 'audio/wav'
}))

const selectedModel = computed(() => getTtsModel(modelId.value))
const hasCustomRole = computed(() => roleId.value.startsWith('custom:'))
const selectedCustomVoice = computed<VoiceProfile | undefined>(() => {
  if (!hasCustomRole.value) return undefined
  const id = roleId.value.slice(7)
  return customVoices.value.find(voice => voice.id === id)
})
const selectedProsodyEngine = computed(() => getProsodyEngine(prosodyEngineId.value))
const cloudConfig = computed<CloudProsodyConfig | undefined>(() => {
  if (prosodyEngineId.value !== 'cloud') return undefined
  return {
    endpoint: cloudEndpoint.value.trim(),
    model: cloudModel.value.trim(),
    apiKey: cloudApiKey.value.trim()
  }
})

function emitError(message: string): void {
  emit('output-change', { kind: 'text', text: '' })
  emit('status-change', { state: 'error', message } as ToolStatus)
}

function emitSuccess(message: string): void {
  emit('status-change', { state: 'success', message } as ToolStatus)
}

function resetProgress(): void {
  stage.value = null
  stagePercent.value = 0
  sentenceIndex.value = 0
  sentenceTotal.value = 0
  synthesizedSeconds.value = 0
  stageDetail.value = ''
}

function requestCancel(): void {
  cancelRequested = true
  abortController?.abort()
  abortController = null
  stageDetail.value = '正在取消…'
  // 下载/推理无法真正中止底层 fetch，先收起面板并复位按钮，
  // 后台任务完成后结果会被丢弃。
  stage.value = null
  note.value = '已取消本次生成。'
  emit('status-change', { state: 'idle' } as ToolStatus)
  emit('output-change', { kind: 'text', text: '' })
}

/** 与取消标志竞争：一旦取消立即抛 AbortError，不等后台任务结束。 */
function raceCancel<T>(task: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setInterval(() => {
      if (cancelRequested) {
        clearInterval(timer)
        reject(new DOMException('已取消', 'AbortError'))
      }
    }, 100)
    task.then(
      value => {
        clearInterval(timer)
        if (cancelRequested) reject(new DOMException('已取消', 'AbortError'))
        else resolve(value)
      },
      error => {
        clearInterval(timer)
        reject(error)
      }
    )
  })
}

function checkCancelled(): void {
  if (cancelRequested) {
    throw new DOMException('已取消', 'AbortError')
  }
}

function refreshSystemVoices(): void {
  if (typeof speechSynthesis === 'undefined') {
    systemVoices.value = []
    return
  }
  const voices = speechSynthesis.getVoices()
  systemVoices.value = voices.map(voice => ({
    uri: voice.voiceURI,
    label: `${voice.name}（${voice.lang}${voice.localService ? ' · 本地' : ''}）`
  }))
  if (roleId.value !== 'model-default' && !roleId.value.startsWith('custom:')
    && !systemVoices.value.some(voice => `system:${voice.uri}` === roleId.value)) {
    const preferred = voices.find(voice => voice.lang.toLowerCase().startsWith('zh')) ?? voices[0]
    roleId.value = preferred ? `system:${preferred.voiceURI}` : ''
  }
}

async function refreshCustomVoices(): Promise<void> {
  try {
    customVoices.value = await listVoiceProfiles()
  } catch (error) {
    note.value = error instanceof Error ? error.message : '本地角色库读取失败'
  }
}

function onVoicesChanged(): void {
  refreshSystemVoices()
}

function onModelChange(): void {
  if (roleId.value.startsWith('custom:') && !selectedModel.value?.supportsCloning) {
    roleId.value = 'model-default'
  }
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = ''
  }
  audioBlob.value = null
  emit('output-change', { kind: 'text', text: '' })
  note.value = selectedModel.value?.credit
    ? `已切换模型；使用生成音频时请标注「${selectedModel.value.credit}」。`
    : '已切换模型，重新生成即可使用新音色。'
}

onMounted(() => {
  refreshSystemVoices()
  void refreshCustomVoices()
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
  }
})

onBeforeUnmount(() => {
  requestCancel()
  // 离开工具页时释放小模型占用的内存/显存（缓存仍在，下次进入秒加载）
  disposeLocalLlm()
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
    speechSynthesis.cancel()
  }
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})

function onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) return
  if (!file.type.startsWith('audio/')) {
    emitError('请选择音频文件')
    return
  }
  if (file.size > 25 * 1024 * 1024) {
    emitError('参考音频超过 25 MB，请选择更小的文件')
    return
  }
  uploadFile.value = file
  uploadName.value = file.name.replace(/\.[^.]+$/, '')
}

async function decodeAudio(file: File): Promise<AudioBuffer> {
  const AudioContextClass = window.AudioContext
    ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) {
    throw new Error('当前浏览器不支持音频解码')
  }
  const context = new AudioContextClass()
  try {
    return await context.decodeAudioData(await file.arrayBuffer())
  } finally {
    await context.close()
  }
}

async function createRole(): Promise<void> {
  if (!selectedModel.value?.supportsCloning) {
    emitError('当前模型不支持声音克隆，请先切换到「零样本克隆 zs-v1」')
    return
  }
  if (!uploadFile.value) {
    emitError('请先选择一段参考音频')
    return
  }
  if (!uploadName.value.trim()) {
    emitError('请为角色填写名称')
    return
  }
  if (!consent.value) {
    emitError('请先确认你有权使用该声音')
    return
  }
  enrolling.value = true
  progressMessage.value = '正在解码参考音频'
  resetProgress()
  stage.value = 'engine'
  stageDetail.value = '正在解码参考音频'
  emit('status-change', { state: 'processing' } as ToolStatus)
  try {
    const buffer = await decodeAudio(uploadFile.value)
    if (buffer.duration < 2 || buffer.duration > 60) {
      throw new Error('参考音频需为 2 到 60 秒，建议使用 3 到 10 秒清晰人声')
    }
    progressMessage.value = '正在提取声纹特征'
    const encoder = await getSpeakerEncoder(info => {
      progressMessage.value = info.message
    })
    const embedding = await encoder.encode(buffer)
    const profile: VoiceProfile = {
      id: createVoiceId(),
      name: uploadName.value.trim(),
      embedding,
      createdAt: Date.now(),
      duration: buffer.duration
    }
    await saveVoiceProfile(profile)
    await refreshCustomVoices()
    roleId.value = `custom:${profile.id}`
    uploadFile.value = null
    uploadName.value = ''
    consent.value = false
    note.value = `角色「${profile.name}」已保存在本机浏览器，未上传任何音频。`
    emitSuccess('自定义音色角色已生成')
  } catch (error) {
    emitError(error instanceof Error ? error.message : '角色生成失败，请重试')
  } finally {
    enrolling.value = false
    progressMessage.value = ''
    stage.value = null
    stageDetail.value = ''
  }
}

async function removeRole(id: string): Promise<void> {
  try {
    await deleteVoiceProfile(id)
    if (roleId.value === `custom:${id}`) roleId.value = 'model-default'
    await refreshCustomVoices()
    emitSuccess('角色已从本机删除')
  } catch (error) {
    emitError(error instanceof Error ? error.message : '角色删除失败，请重试')
  }
}

function stopPlayback(): void {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
  audioElement.value?.pause()
}

function playBlob(blob: Blob): void {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  audioUrl.value = URL.createObjectURL(blob)
  window.setTimeout(() => {
    void audioElement.value?.play().catch(() => {
      note.value = '音频已生成，可点击播放器手动播放。'
    })
  }, 0)
}

async function synthesizeSystem(voiceUri: string): Promise<void> {
  if (typeof speechSynthesis === 'undefined') {
    throw new Error('当前浏览器不支持系统语音朗读')
  }
  stopPlayback()
  const voice = speechSynthesis.getVoices().find(item => item.voiceURI === voiceUri)
  const utterance = new SpeechSynthesisUtterance(text.value)
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  utterance.rate = rate.value
  utterance.pitch = pitch.value
  emit('status-change', { state: 'processing' } as ToolStatus)
  utterance.onend = () => emitSuccess('朗读完成')
  utterance.onerror = () => emitError('系统语音朗读失败，请更换角色后重试')
  speechSynthesis.speak(utterance)
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = ''
  }
  audioBlob.value = null
  emit('output-change', { kind: 'text', text: '' })
  note.value = '系统音色只能试听，无法导出 WAV；如需下载请选择模型音色或自定义角色。'
}

async function synthesizeModel(profile?: VoiceProfile): Promise<void> {
  const definition = selectedModel.value
  if (!definition) throw new Error('请选择语音模型')
  if (profile && !definition.supportsCloning) {
    throw new Error('当前模型不支持声音克隆，请切换到「零样本克隆 zs-v1」')
  }

  // —— 阶段 1/2：下载与引擎（仅首次或换模型时可见）——
  stage.value = 'download'
  stageDetail.value = `${definition.name} · ${definition.sizeLabel}`
  const tts = await raceCancel(getTtsRuntime(modelId.value, info => {
    if (info.stage === 'model') {
      stage.value = 'download'
      stagePercent.value = info.percent ?? stagePercent.value
      stageDetail.value = info.message
    } else if (info.stage === 'phonemizer') {
      stage.value = 'engine'
      stageDetail.value = info.message
    }
  }))

  // —— 阶段 3：分析文本 ——
  // rules 瞬时完成；local-llm 先预热小模型（首次下载约 470 MB，之后离线）；
  // cloud 把文本发给用户配置的接口。任一失败回退规则引擎。
  checkCancelled()
  stage.value = 'analyze'
  if (prosodyEngineId.value === 'local-llm') {
    stageDetail.value = '本地小模型分析语气语速（浏览器内推理，文本不出本机）'
    // 小模型首次下载复用 download 阶段的百分比条展示
    await raceCancel(getLocalLlm(info => {
      if (info.stage === 'download') {
        stage.value = 'download'
        stagePercent.value = info.percent ?? stagePercent.value
        stageDetail.value = info.message
      }
    }))
    stage.value = 'analyze'
    stageDetail.value = '本地小模型正在标注语气与语速'
  } else if (prosodyEngineId.value === 'cloud') {
    stageDetail.value = '云端引擎分析语气与语速（文本将发送到所配置接口）'
  } else {
    stageDetail.value = '本地规则分析标点与语气'
  }
  const context = { rate: rate.value }
  abortController = new AbortController()
  let ssmlOrText = text.value
  try {
    ssmlOrText = await raceCancel(generateSsml(
      text.value,
      prosodyEngineId.value,
      context,
      cloudConfig.value,
      abortController.signal
    ))
  } catch (error) {
    if ((error as DOMException)?.name === 'AbortError') throw error
    // 引擎失败回退规则引擎，保证可用性
    note.value = error instanceof Error ? error.message : '韵律生成失败，已回退本地规则'
    ssmlOrText = buildRuleSsml(text.value, context)
  } finally {
    abortController = null
  }

  // —— 阶段 4：逐句合成（支持取消与句级进度）——
  checkCancelled()
  stage.value = 'synthesize'
  const segments = parseSsml(ssmlOrText).filter(seg => seg.text.trim().length > 0)
  sentenceTotal.value = segments.length
  sentenceIndex.value = 0
  synthesizedSeconds.value = 0
  stageDetail.value = ''

  const sampleRate = tts.config?.audio?.sample_rate ?? 22050
  let samples = new Float32Array(0)
  for (const seg of segments) {
    checkCancelled()
    sentenceIndex.value += 1
    stageDetail.value = seg.text.length > 24 ? `${seg.text.slice(0, 24)}…` : seg.text
    // seg.rate 已被 generateSsml 换算为「相对全局 rate 的倍率」，
    // 与全局 lengthScale 相乘还原成模型 length_scale。
    const piece = await raceCancel(tts.synthesize(seg.text, {
      language: 'zh',
      speakerEmbedding: profile?.embedding,
      lengthScale: 1 / rate.value * (seg.rate ?? 1)
    }))
    const grown = new Float32Array(samples.length + piece.samples.length)
    grown.set(samples, 0)
    grown.set(piece.samples, samples.length)
    samples = grown
    synthesizedSeconds.value += piece.duration
    if (seg.breakMs > 0) {
      const nSilence = Math.floor((seg.breakMs / 1000) * sampleRate)
      const padded = new Float32Array(samples.length + nSilence)
      padded.set(samples, 0)
      samples = padded
    }
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  checkCancelled()

  const audio = new AudioResult(samples, sampleRate)
  const blob = audio.toBlob()
  audioBlob.value = blob
  audioDuration.value = audio.duration
  playBlob(blob)
  emit('output-change', result.value)
  emitSuccess(`已生成 ${audio.duration.toFixed(1)} 秒语音`)
  stage.value = 'done'
  note.value = `${definition.credit ? `请标注「${definition.credit}」；` : ''}模型「${definition.name}」在本机推理，首次使用会从公开镜像下载并缓存。`
}

async function synthesize(): Promise<void> {
  if (!text.value.trim()) {
    emitError('请输入要朗读的文字')
    return
  }
  if (!roleId.value) {
    emitError('请选择角色')
    return
  }
  busy.value = true
  note.value = ''
  cancelRequested = false
  abortController = null
  resetProgress()
  emit('status-change', { state: 'processing' } as ToolStatus)
  try {
    if (roleId.value.startsWith('system:')) {
      await synthesizeSystem(roleId.value.slice(7))
    } else {
      const profile = roleId.value === 'model-default' ? undefined : selectedCustomVoice.value
      if (roleId.value !== 'model-default' && !profile) {
        throw new Error('自定义角色已不存在，请重新选择')
      }
      await synthesizeModel(profile)
    }
  } catch (error) {
    if ((error as DOMException)?.name === 'AbortError') {
      stage.value = null
      note.value = '已取消本次生成。'
      emit('status-change', { state: 'idle' } as ToolStatus)
      emit('output-change', { kind: 'text', text: '' })
    } else {
      emitError(error instanceof Error ? error.message : '语音生成失败，请重试')
      stage.value = null
    }
  } finally {
    busy.value = false
    progressMessage.value = ''
    cancelRequested = false
    abortController = null
  }
}

function download(): void {
  if (!audioBlob.value) {
    emitError('请先使用模型音色或自定义角色生成语音')
    return
  }
  props.actions.download(result.value, 'tts-result.wav')
}
</script>

<template>
  <div class="dt-tts">
    <section class="dt-tts__section">
      <label class="dt-tts__label" for="tts-text">要朗读的文字</label>
      <textarea
        id="tts-text"
        v-model="text"
        class="dt-tts__text"
        rows="6"
        placeholder="输入中文或其他支持的语言文本，所有合成均在本机完成"></textarea>
    </section>

    <section class="dt-tts__section">
      <ModelSelect
        id="tts-model"
        v-model="modelId"
        label="语音模型"
        :models="ttsModels"
        @change="onModelChange" />
      <p class="dt-tts__hint">模型按需下载并缓存，不上传任何音频或文本。</p>

      <div class="dt-tts__row">
        <label class="dt-tts__label" for="tts-prosody">语气语速</label>
        <select id="tts-prosody" v-model="prosodyEngineId" class="dt-tts__select">
          <option v-for="engine in prosodyEngines" :key="engine.id" :value="engine.id">
            {{ engine.name }}
          </option>
        </select>
      </div>
      <p v-if="selectedProsodyEngine" class="dt-tts__hint">
        {{ selectedProsodyEngine.description }}<template v-if="selectedProsodyEngine.needsNetwork">（⚠️ 使用时会外发文本）</template><template v-else-if="selectedProsodyEngine.sizeLabel">（📦 首次下载 {{ selectedProsodyEngine.sizeLabel }}，之后离线）</template>
      </p>

      <div v-if="prosodyEngineId === 'cloud'" class="dt-tts__cloud">
        <button
          class="dt-tts__cloud-toggle"
          type="button"
          @click="showCloudConfig = !showCloudConfig">
          {{ showCloudConfig ? '收起接口配置' : '配置接口（OpenAI 兼容）' }}
        </button>
        <div v-if="showCloudConfig" class="dt-tts__cloud-form">
          <input
            v-model="cloudEndpoint"
            class="dt-tts__input"
            type="url"
            aria-label="接口地址"
            placeholder="接口地址，如 https://api.example.com/v1/chat/completions" />
          <input
            v-model="cloudModel"
            class="dt-tts__input"
            type="text"
            aria-label="模型名称"
            placeholder="模型名称，如 gpt-4o-mini" />
          <input
            v-model="cloudApiKey"
            class="dt-tts__input"
            type="password"
            aria-label="API Key"
            placeholder="API Key（可选，仅保存在当前页面）" />
          <p class="dt-tts__hint">配置只保存在内存，刷新即清空；文本会发送到该接口。</p>
        </div>
      </div>

      <div class="dt-tts__row">
        <label class="dt-tts__label" for="tts-role">角色</label>
        <select id="tts-role" v-model="roleId" class="dt-tts__select">
          <optgroup label="默认角色（系统语音）">
            <option v-for="voice in systemVoices" :key="voice.uri" :value="`system:${voice.uri}`">
              {{ voice.label }}
            </option>
          </optgroup>
          <optgroup label="模型音色">
            <option value="model-default">模型默认音色（可下载 WAV）</option>
          </optgroup>
          <optgroup v-if="customVoices.length" label="自定义角色（本地声纹）">
            <option
              v-for="voice in customVoices"
              :key="voice.id"
              :value="`custom:${voice.id}`"
              :disabled="!selectedModel?.supportsCloning">
              {{ voice.name }}{{ selectedModel?.supportsCloning ? '' : '（需切换克隆模型）' }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="dt-tts__actions">
        <button class="dt-tts__button" type="button" :disabled="busy || !text.trim() || !roleId" @click="synthesize">
          {{ busy ? '正在生成…' : '生成语音' }}
        </button>
        <button class="dt-tts__button dt-tts__button--ghost" type="button" @click="stopPlayback">停止</button>
        <button class="dt-tts__button dt-tts__button--ghost" type="button" :disabled="!audioBlob" @click="download">
          下载 WAV
        </button>
      </div>

      <TtsProgressPanel
        v-if="stage"
        :stage="stage"
        :percent="stagePercent"
        :sentence-index="sentenceIndex"
        :sentence-total="sentenceTotal"
        :synthesized-seconds="synthesizedSeconds"
        :detail="stageDetail"
        :cancellable="busy"
        @cancel="requestCancel" />

      <audio v-if="audioUrl" ref="audioElement" class="dt-tts__audio" controls :src="audioUrl"></audio>
      <p v-if="audioDuration" class="dt-tts__progress">生成时长 {{ audioDuration.toFixed(1) }} 秒</p>
      <p v-if="progressMessage" class="dt-tts__progress">{{ progressMessage }}</p>
      <p class="dt-tts__note">{{ note || '语气语速开关在上方；系统音色只能试听，模型音色和自定义音色可试听并下载。' }}</p>
    </section>

    <section class="dt-tts__section dt-tts__enroll">
      <h2 class="dt-tts__heading">上传音频生成角色</h2>
      <p class="dt-tts__hint">仅「零样本克隆 zs-v1」支持。提供 3–10 秒清晰人声，浏览器本地提取声纹并保存角色；音频、声纹都不会上传。</p>
      <div class="dt-tts__row">
        <label class="dt-tts__upload">
          <input type="file" accept="audio/*" @change="onFileChange" />
          <span>{{ uploadFile ? uploadFile.name : '选择本地音频（25 MB 以内）' }}</span>
        </label>
        <input v-model="uploadName" class="dt-tts__input" type="text" aria-label="角色名称" placeholder="角色名称" />
      </div>
      <label class="dt-tts__consent">
        <input v-model="consent" type="checkbox" />
        <span>我确认拥有这段声音或已获得授权，可用于本地合成</span>
      </label>
      <button class="dt-tts__button" type="button" :disabled="enrolling || !uploadFile" @click="createRole">
        {{ enrolling ? '正在生成角色…' : '生成角色' }}
      </button>

      <ul v-if="customVoices.length" class="dt-tts__roles">
        <li v-for="voice in customVoices" :key="voice.id">
          <span>{{ voice.name }} · {{ voice.duration.toFixed(1) }} 秒</span>
          <button type="button" @click="removeRole(voice.id)">删除</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dt-tts__section {
  margin-bottom: var(--dt-space-5);
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-tts__label {
  display: block;
  margin-bottom: var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-tts__text {
  width: 100%;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font: inherit;
  line-height: 1.6;
  resize: vertical;
}
.dt-tts__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-3);
}
.dt-tts__row .dt-tts__label {
  margin-bottom: 0;
}
.dt-tts__select,
.dt-tts__input {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font: inherit;
}
.dt-tts__select {
  flex: 1 1 260px;
}
.dt-tts__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
}
.dt-tts__button {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px solid var(--dt-primary);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-primary);
  color: var(--dt-primary-contrast);
}
.dt-tts__button--ghost {
  background: var(--dt-card-bg);
  color: var(--dt-fg);
}
.dt-tts__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.dt-tts__audio {
  width: 100%;
  margin-top: var(--dt-space-3);
}
.dt-tts__progress,
.dt-tts__note,
.dt-tts__hint {
  margin: var(--dt-space-3) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-tts__heading {
  margin: 0;
  font-size: var(--dt-font-size-lg);
}
.dt-tts__upload {
  display: inline-flex;
  align-items: center;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius-sm);
  color: var(--dt-fg);
  cursor: pointer;
}
.dt-tts__upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.dt-tts__consent {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  margin: var(--dt-space-3) 0;
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-tts__roles {
  margin: var(--dt-space-4) 0 0;
  padding: 0;
  list-style: none;
}
.dt-tts__roles li {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-3);
  padding: var(--dt-space-2) 0;
  border-bottom: 1px solid var(--dt-border);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-tts__roles button {
  border: 0;
  background: transparent;
  color: var(--dt-danger);
}
.dt-tts__cloud {
  margin: var(--dt-space-2) 0 var(--dt-space-3);
}
.dt-tts__cloud-toggle {
  min-height: 36px;
  padding: 0 var(--dt-space-3);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  cursor: pointer;
}
.dt-tts__cloud-toggle:hover {
  color: var(--dt-primary);
  border-color: var(--dt-primary);
}
.dt-tts__cloud-form {
  display: grid;
  gap: var(--dt-space-2);
  margin-top: var(--dt-space-2);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
}
.dt-tts__cloud-form .dt-tts__input {
  width: 100%;
  flex: none;
}
</style>
