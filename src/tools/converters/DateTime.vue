<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/date.vue 移植（MIT）：时间戳 ↔ 本地日期时间，格式 YYYY-MM-DD HH:mm:ss。
import { inject, onUnmounted, ref, watch } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import type { ToolResult, ToolStatus, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const input = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })

/** 交换事件总线由 ToolView 提供，取消订阅函数必须调用。 */
const toolBus = inject<{ onSwap(callback: (text: string) => void): () => void } | null>('devtoys:toolBus', null)

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatLocal(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new Error('日期无效，请输入有效的时间戳或日期文本')
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function describe(date: Date, milliseconds: number): string {
  return [
    `本地时间：${formatLocal(date)}（本地时区）`,
    `Unix 时间戳（秒）：${Math.floor(milliseconds / 1000)}`,
    `Unix 时间戳（毫秒）：${milliseconds}`,
    `ISO 8601：${date.toISOString()}`
  ].join('\n')
}

function convert(value: string): string {
  const raw = value.trim()
  if (!raw) {
    return ''
  }
  if (/^-?\d+$/.test(raw)) {
    const numeric = Number(raw)
    const milliseconds = raw.replace('-', '').length <= 10 ? numeric * 1000 : numeric
    return describe(new Date(milliseconds), milliseconds)
  }
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    throw new Error('无法识别该日期，请输入时间戳或标准日期文本')
  }
  return describe(date, date.getTime())
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
      message: error instanceof Error ? error.message : '日期转换失败，请检查输入'
    }
  }
}

watch(input, compute)
watch(result, value => emit('output-change', value), { immediate: true })
watch(status, value => emit('status-change', value), { immediate: true })

/** 收到交换文本后写入输入；空串则清空输入与输出。 */
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
    input-label="时间戳 / 日期"
    output-label="转换结果"
    placeholder="输入秒级或毫秒级时间戳，或日期文本（如 2024-01-01 12:00:00）" />
</template>
