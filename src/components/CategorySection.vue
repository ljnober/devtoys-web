<script setup lang="ts">
// 单个分类区块：标题 + 数量 + 工具卡片网格。
import ToolCard from './ToolCard.vue'
import type { CategoryDefinition, ToolDefinition } from '@/tools/contracts'

defineProps<{
  category: CategoryDefinition
  tools: ToolDefinition[]
  comingSoon?: ToolDefinition[]
}>()
</script>

<template>
  <section :id="`category-${category.id}`" class="dt-category">
    <div class="dt-category__head">
      <h2 class="dt-category__title">
        <span aria-hidden="true">{{ category.icon }}</span>
        {{ category.name }}
        <small>{{ category.nameEn }}</small>
      </h2>
      <span class="dt-category__count">{{ tools.length }} 个工具</span>
    </div>
    <p class="dt-category__desc">{{ category.description }}</p>

    <div v-if="tools.length || comingSoon?.length" class="dt-grid">
      <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" />
      <ToolCard v-for="tool in comingSoon ?? []" :key="tool.id" :tool="tool" />
    </div>
    <p v-else class="dt-category__empty">没有符合条件的工具，试试其他关键词。</p>
  </section>
</template>

<style scoped>
.dt-category {
  margin-top: var(--dt-space-6);
}
.dt-category__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  flex-wrap: wrap;
}
.dt-category__title {
  display: inline-flex;
  align-items: baseline;
  gap: var(--dt-space-2);
  margin: 0;
  font-size: var(--dt-font-size-lg);
}
.dt-category__title small {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  font-weight: 400;
}
.dt-category__count {
  padding: var(--dt-space-1) var(--dt-space-3);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-category__desc {
  margin: var(--dt-space-1) 0 var(--dt-space-4);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-category__empty {
  padding: var(--dt-space-4);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius);
  color: var(--dt-muted);
}
</style>
