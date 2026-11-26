<script setup lang="ts">
// 文字转语音：默认角色使用浏览器系统语音；上传音频后本地提取声纹，
// 用 piper-plus 的零样本模型合成克隆语音。模型、音频与声纹均不上传。
import { computed, inject, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import type { AudioResult } from 'piper-plus'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import {
  createVoiceId,
  deleteVoiceProfile,
  listVoiceProfiles,
  saveVoiceProfile,
  type VoiceProfile
} from '@/utils/voiceProfiles'
import ModelSelect from '@/components/ModelSelect.vue'
import { getTtsModel, ttsModels } from '@/data/ttsModels'
import { getSpeakerEncoder, getTtsRuntime } from '@/utils/ttsRuntime'

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
const progressMessage = ref('')
const note = ref('')
const audioBlob = ref<Blob | null>(null)
const audioUrl = ref('')
const audioDuration = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)

const uploadName = ref('')
const uploadFile = ref<File | null>(null)
const consent = ref(false)
const enrolling = ref(false)

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

function emitError(message: string): void {
  emit('output-change', { kind: 'text', text: '' })
  emit('status-change', { state: 'error', message } as ToolStatus)
}

function emitSuccess(message: string): void {
  emit('status-change', { state: 'success', message } as ToolStatus)
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
  progressMessage.value = `正在加载 ${definition.name}`
  const tts = await getTtsRuntime(modelId.value, info => {
    progressMessage.value = info.message
  })
  progressMessage.value = profile ? '正在生成克隆语音' : '正在生成语音'
  const audio: AudioResult = await tts.synthesize(text.value, {
    language: 'zh',
    speakerEmbedding: profile?.embedding,
    lengthScale: 1 / rate.value
  })
  const blob = audio.toBlob()
  audioBlob.value = blob
  audioDuration.value = audio.duration
  playBlob(blob)
  emit('output-change', result.value)
  emitSuccess(`已生成 ${audio.duration.toFixed(1)} 秒语音`)
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
    emitError(error instanceof Error ? error.message : '语音生成失败，请重试')
  } finally {
    busy.value = false
    progressMessage.value = ''
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

      <audio v-if="audioUrl" ref="audioElement" class="dt-tts__audio" controls :src="audioUrl"></audio>
      <p v-if="audioDuration" class="dt-tts__progress">生成时长 {{ audioDuration.toFixed(1) }} 秒</p>
      <p v-if="progressMessage" class="dt-tts__progress">{{ progressMessage }}</p>
      <p class="dt-tts__note">{{ note || '语速由工具页上方的选项控制；系统音色可直接试听，模型音色和自定义音色可试听并下载。' }}</p>
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
</style>
