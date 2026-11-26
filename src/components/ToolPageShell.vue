<script setup lang="ts">
// 工具页布局：桌面左侧分类导航 + 标题说明 + 选项/内容/操作插槽，移动端用抽屉。
import { RouterLink } from 'vue-router'
import MobileNavDrawer from './MobileNavDrawer.vue'
import type { CategoryDefinition, ToolDefinition } from '@/tools/contracts'

const props = defineProps<{
  definition: ToolDefinition
  categories: CategoryDefinition[]
  navOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:navOpen', value: boolean): void
  (e: 'navigate', category: CategoryDefinition['id']): void
}>()

function openDrawer(): void {
  emit('update:navOpen', true)
}
</script>

<template>
  <div class="dt-tool-shell">
    <MobileNavDrawer
      :categories="categories"
      :open="navOpen"
      @update:open="emit('update:navOpen', $event)"
      @select="emit('navigate', $event)" />

    <aside class="dt-tool-shell__aside" aria-label="分类导航">
      <RouterLink class="dt-tool-shell__back" :to="{ name: 'home' }">← 全部工具</RouterLink>
      <button
        v-for="category in categories"
        :key="category.id"
        class="dt-tool-shell__nav-item"
        :class="{ 'is-current': category.id === definition.category }"
        type="button"
        @click="emit('navigate', category.id)">
        <span aria-hidden="true">{{ category.icon }}</span>
        <span>{{ category.name }}</span>
      </button>
    </aside>

    <main class="dt-tool-shell__main">
      <div class="dt-tool-shell__title-row">
        <button
          class="dt-tool-shell__menu"
          type="button"
          aria-label="打开分类导航"
          @click="openDrawer">☰</button>
        <div>
          <h1 class="dt-tool-shell__title">
            <span aria-hidden="true">{{ definition.icon }}</span>
            {{ definition.name }}
          </h1>
          <p class="dt-tool-shell__desc">{{ definition.description }}</p>
        </div>
        <span class="dt-tool-shell__privacy">🔒 本地处理 · 不上传</span>
      </div>

      <slot name="options"></slot>
      <slot></slot>
      <slot name="actions"></slot>
    </main>
  </div>
</template>

<style scoped>
.dt-tool-shell {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--dt-space-5);
  max-width: var(--dt-page-width);
  margin: 0 auto;
  padding: var(--dt-space-5) var(--dt-space-5) var(--dt-space-7);
}
.dt-tool-shell__aside {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-1);
  align-self: start;
  position: sticky;
  top: calc(var(--dt-header-height) + var(--dt-space-4));
}
.dt-tool-shell__back {
  min-height: var(--dt-touch-target);
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--dt-space-2);
}
.dt-tool-shell__nav-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid transparent;
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-fg);
  text-align: left;
}
.dt-tool-shell__nav-item:hover {
  background: var(--dt-code-bg);
}
.dt-tool-shell__nav-item.is-current {
  border-color: var(--dt-primary);
  color: var(--dt-primary);
}
.dt-tool-shell__main {
  min-width: 0;
}
.dt-tool-shell__title-row {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-5);
  flex-wrap: wrap;
}
.dt-tool-shell__title {
  margin: 0;
  font-size: var(--dt-font-size-xl);
}
.dt-tool-shell__desc {
  margin: var(--dt-space-1) 0 0;
  color: var(--dt-muted);
}
.dt-tool-shell__privacy {
  margin-left: auto;
  padding: var(--dt-space-1) var(--dt-space-3);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  white-space: nowrap;
}
.dt-tool-shell__menu {
  display: none;
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  font-size: var(--dt-font-size-lg);
}
@media (max-width: 768px) {
  .dt-tool-shell {
    grid-template-columns: 1fr;
    gap: var(--dt-space-4);
    padding: var(--dt-space-4) var(--dt-space-4) var(--dt-space-7);
  }
  .dt-tool-shell__aside {
    display: none;
  }
  .dt-tool-shell__menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .dt-tool-shell__privacy {
    margin-left: 0;
  }
}
</style>
