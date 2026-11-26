<script setup lang="ts">
// ≤768px 分类抽屉：从左侧滑出，触摸目标不小于 44px。
import type { CategoryDefinition } from '@/tools/contracts'

defineProps<{
  categories: CategoryDefinition[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'select', id: CategoryDefinition['id']): void
}>()

function close(): void {
  emit('update:open', false)
}

function select(id: CategoryDefinition['id']): void {
  emit('select', id)
  close()
}
</script>

<template>
  <div v-if="open" class="dt-drawer">
    <div class="dt-drawer__mask" @click="close"></div>
    <nav class="dt-drawer__panel" aria-label="分类导航">
      <div class="dt-drawer__head">
        <strong>工具分类</strong>
        <button class="dt-drawer__close" type="button" aria-label="关闭分类导航" @click="close">✕</button>
      </div>
      <button
        v-for="category in categories"
        :key="category.id"
        class="dt-drawer__item"
        type="button"
        @click="select(category.id)">
        <span aria-hidden="true">{{ category.icon }}</span>
        <span>{{ category.name }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.dt-drawer {
  position: fixed;
  inset: 0;
  z-index: 100;
}
.dt-drawer__mask {
  position: absolute;
  inset: 0;
  background: var(--dt-overlay);
}
.dt-drawer__panel {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(80vw, 300px);
  overflow-y: auto;
  padding: var(--dt-space-4);
  background: var(--dt-card-bg);
  box-shadow: var(--dt-shadow-hover);
}
.dt-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-4);
}
.dt-drawer__close,
.dt-drawer__item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  width: 100%;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid transparent;
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-fg);
  text-align: left;
}
.dt-drawer__close {
  width: var(--dt-touch-target);
  justify-content: center;
}
.dt-drawer__item:hover {
  border-color: var(--dt-border);
  background: var(--dt-code-bg);
}
</style>
