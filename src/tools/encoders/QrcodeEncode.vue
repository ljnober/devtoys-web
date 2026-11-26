<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/qrcode.vue、rqrcode.vue 移植（MIT）：二维码生成与图片解码。
import { computed, inject, isRef, onUnmounted, ref, watch, type Ref } from 'vue'
import QRCode from 'qrcode'
import qrcodeParser from 'qrcode-parser'
import type { ToolResult, ToolStatus, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>
const mode = ref<'encode' | 'decode'>('encode')
const textInput = ref('')
const decodedText = ref('')
const dataUrl = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })

const injectedOptions = inject<Ref<Options> | Options | null>('devtoys:toolOptions', null)
function readOption(key: string, fallback: string | number): string | number | boolean {
  if (!injectedOptions) {
    return fallback
  }
  const source = isRef(injectedOptions) ? injectedOptions.value : injectedOptions
  return source[key] ?? fallback
}
const size = computed<number>(() => Number(readOption('size', 256)))
const level = computed<string>(() => String(readOption('level', 'M')))

const toolBus = inject<{ onSwap(callback: (text: string) => void): () => void } | null>('devtoys:toolBus', null)

/** 把本地生成的 data URL 转为可下载的 PNG Blob，全程不发起网络请求。 */
function dataUrlToBlob(url: string): Blob {
  const binary = atob(url.split(',')[1] ?? '')
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new Blob([bytes as BlobPart], { type: 'image/png' })
}

async function compute(): Promise<void> {
  if (mode.value === 'decode') {
    const value = decodedText.value.trim()
    result.value = { kind: 'text', text: value }
    status.value = value ? { state: 'success' } : { state: 'idle' }
    return
  }
  const value = textInput.value.trim()
  if (!value) {
    dataUrl.value = ''
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
    return
  }
  status.value = { state: 'processing' }
  try {
    const url = await QRCode.toDataURL(value, {
      errorCorrectionLevel: level.value as QRCode.QRCodeErrorCorrectionLevel,
      width: Math.max(64, Math.min(1024, size.value)),
      margin: 2
    })
    dataUrl.value = url
    result.value = {
      kind: 'blob',
      blob: dataUrlToBlob(url),
      filename: 'qrcode.png',
      mimeType: 'image/png'
    }
    status.value = { state: 'success' }
  } catch {
    dataUrl.value = ''
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'error', message: '二维码生成失败，请检查文本长度或容错级别' }
  }
}

async function onFileChange(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }
  status.value = { state: 'processing' }
  try {
    decodedText.value = await qrcodeParser(file)
    result.value = { kind: 'text', text: decodedText.value }
    status.value = decodedText.value
      ? { state: 'success' }
      : { state: 'error', message: '未能从图片中识别出二维码，请更换图片后重试' }
  } catch {
    decodedText.value = ''
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'error', message: '图片解析失败，请确认选择的是二维码图片' }
  }
}

watch([textInput, mode, size, level], () => { void compute() })
watch(result, value => emit('output-change', value), { immediate: true })
watch(status, value => emit('status-change', value), { immediate: true })

function handleSwap(text: string): void {
  if (mode.value === 'decode') {
    mode.value = 'encode'
  }
  textInput.value = text
  if (!text) {
    dataUrl.value = ''
    decodedText.value = ''
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
  }
}
const stopSwap = toolBus?.onSwap(handleSwap) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-qrcode">
    <div class="dt-qrcode__modes" role="group" aria-label="二维码操作">
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'encode' }" @click="mode = 'encode'">
        生成二维码
      </button>
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'decode' }" @click="mode = 'decode'">
        解码图片
      </button>
    </div>

    <template v-if="mode === 'encode'">
      <label class="dt-qrcode__label" for="qrcode-text">待编码文本</label>
      <textarea
        id="qrcode-text"
        v-model="textInput"
        class="dt-qrcode__textarea"
        rows="6"
        placeholder="输入要生成二维码的文本或链接"></textarea>
      <div class="dt-qrcode__preview">
        <img v-if="dataUrl" :src="dataUrl" alt="生成的二维码预览" />
        <p v-else>输入文本后在此预览二维码（本地生成）</p>
      </div>
    </template>

    <template v-else>
      <label class="dt-qrcode__label" for="qrcode-file">选择二维码图片</label>
      <input id="qrcode-file" type="file" accept="image/*" @change="onFileChange" />
      <label class="dt-qrcode__label" for="qrcode-decoded">解码结果</label>
      <textarea
        id="qrcode-decoded"
        :value="decodedText"
        class="dt-qrcode__textarea"
        rows="6"
        readonly
        placeholder="识别结果将显示在这里"></textarea>
    </template>
  </div>
</template>

<style scoped>
.dt-qrcode__modes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-4);
}
.dt-qrcode__modes .is-active {
  border-color: var(--dt-primary);
  color: var(--dt-primary);
}
.dt-qrcode__label {
  display: block;
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-qrcode__textarea {
  width: 100%;
  min-height: 140px;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  resize: vertical;
}
.dt-qrcode input[type='file'] {
  min-height: var(--dt-touch-target);
  color: var(--dt-fg);
}
.dt-qrcode__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  margin-top: var(--dt-space-4);
  padding: var(--dt-space-4);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
  color: var(--dt-muted);
}
.dt-qrcode__preview img {
  max-width: 100%;
  max-height: 320px;
}
</style>
