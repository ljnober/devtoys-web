<script setup lang="ts">
// HTTP 状态码速查：使用本地静态字典，无任何网络请求。
import { computed, ref, watch } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import { httpStatuses, HTTP_STATUS_CATEGORIES } from '@/data/httpStatus'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const keyword = ref('')
const category = ref<string>('全部')

const filtered = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return httpStatuses.filter(item => {
    const inCategory = category.value === '全部' || item.category === category.value
    if (!inCategory) {
      return false
    }
    if (!query) {
      return true
    }
    return [String(item.code), item.name.toLowerCase(), item.description, item.category]
      .some(field => field.includes(query))
  })
})

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: filtered.value
    .map(item => `${item.code} ${item.name} — ${item.description}`)
    .join('\n'),
  filename: 'http-status.txt',
  mimeType: 'text/plain;charset=utf-8'
}))

watch(filtered, () => {
  if (filtered.value.length === 0) {
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', { state: 'idle' })
    return
  }
  emit('output-change', result.value)
  emit('status-change', { state: 'success', message: `找到 ${filtered.value.length} 个状态码` })
}, { immediate: true })
</script>

<template>
  <div class="dt-ref">
    <input
      v-model="keyword"
      class="dt-ref__search"
      type="search"
      placeholder="输入状态码或关键词，例如 404、NotFound、缓存" />

    <div class="dt-ref__tabs" role="group" aria-label="状态码分类">
      <button
        v-for="item in HTTP_STATUS_CATEGORIES"
        :key="item"
        class="dt-ref__tab"
        :class="{ 'is-active': category === item }"
        type="button"
        @click="category = item">
        {{ item }}
      </button>
    </div>

    <p class="dt-ref__count">共 {{ filtered.length }} 条结果</p>

    <div v-if="filtered.length" class="dt-ref__list">
      <article v-for="item in filtered" :key="item.code" class="dt-ref__item">
        <span class="dt-ref__code">{{ item.code }}</span>
        <div class="dt-ref__body">
          <div class="dt-ref__name">{{ item.name }}</div>
          <div class="dt-ref__desc">{{ item.description }}</div>
          <div class="dt-ref__category">{{ item.category }}</div>
        </div>
      </article>
    </div>
    <p v-else class="dt-ref__empty">没有匹配的状态码，请更换关键词或分类。</p>
  </div>
</template>

<style scoped>
.dt-ref__search,
.dt-ref__tab {
  min-height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
}
.dt-ref__search {
  width: 100%;
  padding: var(--dt-space-2) var(--dt-space-3);
}
.dt-ref__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin: var(--dt-space-3) 0;
}
.dt-ref__tab {
  padding: var(--dt-space-2) var(--dt-space-3);
  font-size: var(--dt-font-size-sm);
}
.dt-ref__tab.is-active {
  border-color: var(--dt-primary);
  color: var(--dt-primary);
}
.dt-ref__count,
.dt-ref__empty {
  margin: var(--dt-space-2) 0;
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
.dt-ref__code {
  min-width: 56px;
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-lg);
  color: var(--dt-primary);
}
.dt-ref__body {
  min-width: 0;
}
.dt-ref__name {
  font-weight: 600;
}
.dt-ref__desc {
  margin-top: var(--dt-space-1);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-ref__category {
  margin-top: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
