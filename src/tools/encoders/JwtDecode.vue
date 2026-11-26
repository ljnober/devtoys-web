<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/jwt.vue 移植（MIT）：解析 Header / Payload / Signature。
import { inject, onUnmounted, ref, watch } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import type { ToolResult, ToolStatus, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const input = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })
const toolBus = inject<{ onSwap(callback: (text: string) => void): () => void } | null>('devtoys:toolBus', null)

/** JWT 使用 Base64URL，需要补回 + / 与 padding。 */
function decodePart(part: string): string {
  let normalized = part.replace(/-/g, '+').replace(/_/g, '/')
  while (normalized.length % 4) {
    normalized += '='
  }
  const binary = atob(normalized)
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)))
}

function convert(value: string): string {
  const raw = value.trim()
  if (!raw) {
    return ''
  }
  const parts = raw.split('.')
  if (parts.length !== 3) {
    throw new Error('JWT 格式无效，应包含 Header.Payload.Signature 三段')
  }
  let header: unknown
  let payload: unknown
  try {
    header = JSON.parse(decodePart(parts[0]))
    payload = JSON.parse(decodePart(parts[1]))
  } catch {
    throw new Error('JWT 的 Header 或 Payload 不是合法 JSON')
  }
  return [
    'Header：',
    JSON.stringify(header, null, 2),
    '',
    'Payload：',
    JSON.stringify(payload, null, 2),
    '',
    `Signature：${parts[2]}`
  ].join('\n')
}

function compute(): void {
  try {
    const value = convert(input.value)
    result.value = { kind: 'text', text: value }
    status.value = value ? { state: 'success' } : { state: 'idle' }
  } catch (error) {
    result.value = { kind: 'text', text: '' }
    status.value = {
      state: 'error',
      message: error instanceof Error ? error.message : 'JWT 解码失败，请检查输入'
    }
  }
}

watch(input, compute)
watch(result, value => emit('output-change', value), { immediate: true })
watch(status, value => emit('status-change', value), { immediate: true })

function handleSwap(text: string): void {
  input.value = text
  if (!text) {
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
  }
}
const stopSwap = toolBus?.onSwap(handleSwap) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <IoPanel
    v-model="input"
    :output="result"
    input-label="JWT 令牌"
    output-label="解码结果"
    placeholder="粘贴形如 xxxxx.yyyyy.zzzzz 的 JWT 令牌" />
</template>
