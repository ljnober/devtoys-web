<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/base64.vue 移植（MIT）：文本 Base64 编解码 + URL-safe 模式。
import { computed, inject, isRef, onUnmounted, ref, watch, type Ref } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import type { ToolResult, ToolStatus, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>
const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })

const injectedOptions = inject<Ref<Options> | Options | null>('devtoys:toolOptions', null)
const urlSafe = computed<boolean>(() => {
  if (!injectedOptions) {
    return false
  }
  const source = isRef(injectedOptions) ? injectedOptions.value : injectedOptions
  return Boolean(source.urlSafe ?? false)
})

const toolBus = inject<{ onSwap(callback: (text: string) => void): () => void } | null>('devtoys:toolBus', null)

function utf8ToBinary(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return binary
}

function binaryToUtf8(binary: string): string {
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)))
}

function convert(value: string): string {
  const raw = value.trim()
  if (!raw) {
    return ''
  }
  if (mode.value === 'encode') {
    let encoded = btoa(utf8ToBinary(raw))
    if (urlSafe.value) {
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    return encoded
  }
  let normalized = raw.replace(/\s/g, '')
  if (urlSafe.value) {
    normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')
  }
  while (normalized.length % 4) {
    normalized += '='
  }
  return binaryToUtf8(atob(normalized))
}

function compute(): void {
  try {
    const value = convert(input.value)
    result.value = { kind: 'text', text: value }
    status.value = value ? { state: 'success' } : { state: 'idle' }
  } catch {
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'error', message: 'Base64 解码失败，请检查输入内容或 URL-safe 选项' }
  }
}

watch([input, mode, urlSafe], compute)
watch(result, value => emit('output-change', value), { immediate: true })
watch(status, value => emit('status-change', value), { immediate: true })

function handleSwap(text: string): void {
  input.value = text
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  if (!text) {
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
  }
}
const stopSwap = toolBus?.onSwap(handleSwap) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-base64">
    <div class="dt-base64__modes" role="group" aria-label="转换方向">
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'encode' }" @click="mode = 'encode'">
        文本 → Base64
      </button>
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'decode' }" @click="mode = 'decode'">
        Base64 → 文本
      </button>
    </div>
    <IoPanel
      v-model="input"
      :output="result"
      :input-label="mode === 'encode' ? '原文' : 'Base64 文本'"
      :output-label="mode === 'encode' ? 'Base64 结果' : '解码结果'"
      placeholder="请输入待转换的文本，所有处理均在本地完成" />
  </div>
</template>

<style scoped>
.dt-base64__modes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-4);
}
.dt-base64__modes .is-active {
  border-color: var(--dt-primary);
  color: var(--dt-primary);
}
</style>
