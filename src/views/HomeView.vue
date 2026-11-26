<script setup lang="ts">
// 首页：参考站风格的「所有工具」标题 + 11 个英文大写分类标题 + 卡片目录。
import { computed } from 'vue'
import { categories } from '@/tools/registry'
import { useSearchStore } from '@/stores/search'
import CategorySection from '@/components/CategorySection.vue'
import type { ToolCategoryId, ToolDefinition } from '@/tools/contracts'

const searchStore = useSearchStore()

/** 按分类过滤搜索结果，空关键词时展示该分类全部工具。 */
function toolsFor(category: ToolCategoryId): ToolDefinition[] {
  return searchStore.results.filter(tool => tool.category === category)
}

function soonFor(category: ToolCategoryId): ToolDefinition[] {
  return searchStore.comingSoonResults.filter(tool => tool.category === category)
}

const totalVisible = computed<number>(() => searchStore.results.length)
</script>

<template>
  <div class="dt-home">
    <div class="dt-container">
      <header class="dt-home__hero">
        <h1>所有工具</h1>
        <p>免费的 Web 开发者工具</p>
      </header>

      <p v-if="searchStore.keyword" class="dt-home__summary">
        搜索「{{ searchStore.keyword }}」：找到 {{ totalVisible }} 个工具
        <button type="button" @click="searchStore.clear()">清除搜索</button>
      </p>

      <CategorySection
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :tools="toolsFor(category.id)"
        :coming-soon="soonFor(category.id)" />
    </div>
  </div>
</template>

<style scoped>
.dt-home {
  padding-bottom: var(--dt-space-7);
}
.dt-home__hero {
  margin-top: var(--dt-space-5);
}
.dt-home__hero h1 {
  margin: 0;
  font-size: var(--dt-font-size-lg);
  font-weight: 700;
}
.dt-home__hero p {
  margin: var(--dt-space-1) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-home__summary {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  margin: var(--dt-space-5) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-home__summary button {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-1) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
}
@media (max-width: 768px) {
  .dt-home__hero {
    margin-top: var(--dt-space-4);
  }
  .dt-home__summary {
    flex-wrap: wrap;
  }
}
</style>
