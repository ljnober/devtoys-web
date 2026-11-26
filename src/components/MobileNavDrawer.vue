<script setup lang="ts">
// ≤768px 导航抽屉：复用 AppSidebar 的同一套搜索与可折叠分类，触摸目标不小于 44px。
import AppSidebar from './AppSidebar.vue'
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
</script>

<template>
  <div v-if="open" class="dt-drawer">
    <div class="dt-drawer__mask" @click="close"></div>
    <nav class="dt-drawer__panel" aria-label="分类导航">
      <div class="dt-drawer__head">
        <strong>工具导航</strong>
        <button class="dt-drawer__close" type="button" aria-label="关闭分类导航" @click="close">✕</button>
      </div>
      <AppSidebar drawer @navigate="close" />
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--dt-space-4);
  background: var(--dt-sidebar-bg);
  box-shadow: var(--dt-shadow-hover);
}
.dt-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-3);
}
.dt-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-fg);
}
</style>
