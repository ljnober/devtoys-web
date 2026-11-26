<script setup lang="ts">
// 单个分类区块：英文大写小标题 + 中文分类名 + 三列工具卡片网格。
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
      <span class="dt-category__eyebrow">{{ category.nameEn.toUpperCase() }}</span>
      <span class="dt-category__subtitle">{{ category.name }}</span>
    </div>

    <div v-if="tools.length || comingSoon?.length" class="dt-category__grid">
      <ToolCard v-for="tool in tools" :key="tool.id" :tool="tool" />
      <ToolCard v-for="tool in comingSoon ?? []" :key="tool.id" :tool="tool" />
    </div>
    <p v-else class="dt-category__empty">没有符合条件的工具，试试其他关键词。</p>
  </section>
</template>

<style scoped>
.dt-category {
  margin-top: var(--dt-space-5);
}
.dt-category__head {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-3);
}
.dt-category__eyebrow {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.dt-category__subtitle {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-category__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--dt-space-3);
}
.dt-category__empty {
  padding: var(--dt-space-4);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
@media (max-width: 1100px) {
  .dt-category__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .dt-category__grid {
    grid-template-columns: 1fr;
  }
}
</style>
