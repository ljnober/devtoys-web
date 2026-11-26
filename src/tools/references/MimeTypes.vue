<script setup lang="ts">
// MIME 类型双向检索：扩展名与 MIME 类型互查，使用本地静态字典。
import { computed, ref, watch } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import { mimeTypes } from '@/data/mimeTypes'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const keyword = ref('')

const filtered = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) {
    return mimeTypes.slice(0, 50)
  }
  const normalized = query.replace(/^\./, '')
  const matched = mimeTypes.filter(entry =>
    entry.extension.toLowerCase().includes(normalized)
    || entry.mimeType.toLowerCase().includes(query)
    || entry.description.includes(query)
  )
  // 扩展名精确命中排在前面，便于 .json 直接得到 application/json。
  return matched.slice().sort((left, right) => {
    const leftExact = left.extension.slice(1).toLowerCase() === normalized ? 0 : 1
    const rightExact = right.extension.slice(1).toLowerCase() === normalized ? 0 : 1
    return leftExact - rightExact
  })
})

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: filtered.value
    .map(item => `${item.extension} → ${item.mimeType} — ${item.description}`)
    .join('\n'),
  filename: 'mime-types.txt',
  mimeType: 'text/plain;charset=utf-8'
}))

watch(filtered, () => {
  if (filtered.value.length === 0) {
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', { state: 'idle' })
    return
  }
  emit('output-change', result.value)
  emit('status-change', { state: 'success', message: `找到 ${filtered.value.length} 个 MIME 类型` })
}, { immediate: true })
</script>

<template>
  <div class="dt-ref">
    <input
      v-model="keyword"
      class="dt-ref__search"
      type="search"
      placeholder="输入扩展名或 MIME 类型，例如 .json、application/pdf" />

    <p class="dt-ref__count">共 {{ filtered.length }} 条结果<span v-if="!keyword">（默认展示常用类型）</span></p>

    <div v-if="filtered.length" class="dt-ref__list">
      <article v-for="item in filtered" :key="item.extension" class="dt-ref__item">
        <span class="dt-ref__ext">{{ item.extension }}</span>
        <div class="dt-ref__body">
          <div class="dt-ref__mime">{{ item.mimeType }}</div>
          <div class="dt-ref__desc">{{ item.description }}</div>
        </div>
      </article>
    </div>
    <p v-else class="dt-ref__empty">没有匹配的 MIME 类型，请更换关键词。</p>
  </div>
</template>

<style scoped>
.dt-ref__search {
  width: 100%;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
}
.dt-ref__count,
.dt-ref__empty {
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-ref__list {
  display: grid;
  gap: var(--dt-space-2);
}
.dt-ref__item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-3);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
}
.dt-ref__ext {
  min-width: 88px;
  color: var(--dt-primary);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size);
}
.dt-ref__body {
  min-width: 0;
  overflow-wrap: anywhere;
}
.dt-ref__mime {
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-ref__desc {
  margin-top: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
