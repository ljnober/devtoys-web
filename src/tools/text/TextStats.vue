<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/capitalization.vue 移植（MIT）：保留 Inspector 统计面板思路，
// 统计逻辑改为本地纯计算，去除基座大小写转换与 Element Plus 依赖。
import { computed, onUnmounted, ref, watch } from 'vue'
import { inject } from 'vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const text = ref('')

/** 统计面板条目。 */
interface StatItem {
  label: string
  value: string | number
}

const stats = computed<StatItem[]>(() => {
  const value = text.value
  const lines = value ? value.split(/\r?\n/) : []
  const nonEmptyLines = lines.filter(line => line.trim().length > 0)
  const paragraphs = value.split(/\n\s*\n/).filter(part => part.trim().length > 0)
  const tokens = value.match(/[A-Za-z0-9_]+|[\u4e00-\u9fa5]/g) ?? []
  const byteLength = new TextEncoder().encode(value).length
  return [
    { label: '字符数（含空格）', value: value.length },
    { label: '字符数（不含空白）', value: value.replace(/\s/g, '').length },
    { label: '词数（中英文）', value: tokens.length },
    { label: '行数', value: lines.length },
    { label: '非空行数', value: nonEmptyLines.length },
    { label: '段落数', value: paragraphs.length },
    { label: '句子数', value: (value.match(/[。！？!?]/g) ?? []).length },
    { label: 'UTF-8 字节数', value: byteLength }
  ]
})

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: text.value
    ? stats.value.map(item => `${item.label}：${item.value}`).join('\n')
    : ''
}))

watch(result, next => {
  emit('output-change', next)
  emit('status-change', next.text ? { state: 'success' } : { state: 'idle' })
}, { immediate: true })

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(value => { text.value = value }) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-stats">
    <label class="dt-field">
      <span class="dt-field__label">待分析文本</span>
      <textarea v-model="text" class="dt-textarea" rows="10" spellcheck="false"
        placeholder="输入文本后即时统计，内容不会离开浏览器"></textarea>
    </label>

    <div class="dt-stats__grid">
      <div v-for="item in stats" :key="item.label" class="dt-stats__card">
        <span class="dt-stats__value">{{ item.value }}</span>
        <span class="dt-stats__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dt-field {
  display: grid;
  gap: var(--dt-space-2);
}
.dt-field__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-textarea {
  width: 100%;
  min-height: 220px;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  line-height: 1.6;
  resize: vertical;
}
.dt-stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--dt-space-3);
  margin-top: var(--dt-space-4);
}
.dt-stats__card {
  display: grid;
  gap: var(--dt-space-1);
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-stats__value {
  font-size: var(--dt-font-size-lg);
  font-weight: 600;
  color: var(--dt-primary);
}
.dt-stats__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
