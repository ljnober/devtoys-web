<script setup lang="ts">
// GZip 压缩/解压：原生 CompressionStream / DecompressionStream，输出 Base64 便于复制。
import { inject, onUnmounted, ref, watch } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import { base64ToBytes, bytesToBase64, gzipCompress, gzipDecompress } from '@/utils/gzip'
import type { ToolResult, ToolStatus, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const mode = ref<'compress' | 'decompress'>('compress')
const input = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })
const toolBus = injectBus()

/** 避免快速输入时旧异步任务覆盖新结果。 */
let sequence = 0

function injectBus(): { onSwap(callback: (text: string) => void): () => void } | null {
  // 单独封装是为了让交换订阅与组件其他 inject 保持一致的中文注释位置。
  return inject<{ onSwap(callback: (text: string) => void): () => void } | null>('devtoys:toolBus', null)
}

async function compute(): Promise<void> {
  const current = ++sequence
  const raw = input.value.trim()
  if (!raw) {
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
    return
  }
  status.value = { state: 'processing' }
  try {
    const value = mode.value === 'compress'
      ? bytesToBase64(await gzipCompress(raw))
      : await gzipDecompress(base64ToBytes(raw))
    if (current !== sequence) {
      return
    }
    result.value = { kind: 'text', text: value }
    status.value = { state: 'success' }
  } catch (error) {
    if (current !== sequence) {
      return
    }
    result.value = { kind: 'text', text: '' }
    status.value = {
      state: 'error',
      message: error instanceof Error ? error.message : 'GZip 处理失败，请检查输入或切换方向'
    }
  }
}

watch([input, mode], () => { void compute() })
watch(result, value => emit('output-change', value), { immediate: true })
watch(status, value => emit('status-change', value), { immediate: true })

function handleSwap(text: string): void {
  input.value = text
  mode.value = mode.value === 'compress' ? 'decompress' : 'compress'
  if (!text) {
    result.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
  }
}
const stopSwap = toolBus?.onSwap(handleSwap) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-gzip">
    <div class="dt-gzip__modes" role="group" aria-label="处理方向">
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'compress' }" @click="mode = 'compress'">
        压缩
      </button>
      <button type="button" class="dt-button" :class="{ 'is-active': mode === 'decompress' }" @click="mode = 'decompress'">
        解压
      </button>
    </div>
    <IoPanel
      v-model="input"
      :output="result"
      :input-label="mode === 'compress' ? '原文' : 'Base64 压缩数据'"
      :output-label="mode === 'compress' ? '压缩结果（Base64）' : '解压结果'"
      placeholder="压缩时输入文本；解压时输入压缩结果的 Base64 字符串" />
  </div>
</template>

<style scoped>
.dt-gzip__modes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-4);
}
.dt-gzip__modes .is-active {
  border-color: var(--dt-primary);
  color: var(--dt-primary);
}
</style>
