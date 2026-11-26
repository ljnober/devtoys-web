<script setup lang="ts">
// 首页：隐私横幅 + 11 个分类分区 + 40 张工具卡片 + 计算器占位卡。
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
      <section class="dt-home__hero dt-card">
        <div>
          <h1>开发者工具箱</h1>
          <p>{{ totalVisible }} 款高频工具，打开即用；所有计算都在你的浏览器中完成。</p>
        </div>
        <p class="dt-home__privacy">🔒 所有工具在本地浏览器运行，不上传任何数据</p>
      </section>

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

      <footer class="dt-home__footer">
        DevToys Web · 纯静态站点 · 数据只留在你的设备上
      </footer>
    </div>
  </div>
</template>

<style scoped>
.dt-home {
  padding-bottom: var(--dt-space-7);
}
.dt-home__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  margin-top: var(--dt-space-5);
  padding: var(--dt-space-5);
}
.dt-home__hero h1 {
  margin: 0;
  font-size: var(--dt-font-size-xl);
}
.dt-home__hero p {
  margin: var(--dt-space-2) 0 0;
  color: var(--dt-muted);
}
.dt-home__privacy {
  padding: var(--dt-space-2) var(--dt-space-4);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-home__summary {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  margin: var(--dt-space-5) 0 0;
  color: var(--dt-muted);
}
.dt-home__summary button {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-1) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
}
.dt-home__footer {
  margin-top: var(--dt-space-7);
  padding-top: var(--dt-space-5);
  border-top: 1px solid var(--dt-border);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  text-align: center;
}
@media (max-width: 768px) {
  .dt-home__hero {
    padding: var(--dt-space-4);
  }
  .dt-home__hero h1 {
    font-size: var(--dt-font-size-lg);
  }
  .dt-home__summary {
    flex-wrap: wrap;
  }
}
</style>
