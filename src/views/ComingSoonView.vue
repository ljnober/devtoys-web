<script setup lang="ts">
// 未实现工具 / 无效工具 id 的兜底视图，避免白屏。
import { RouterLink } from 'vue-router'
import ComingSoon from '@/tools/ComingSoon.vue'

defineProps<{ toolId?: string }>()
</script>

<template>
  <div class="dt-soon-view dt-container">
    <ComingSoon :tool-id="toolId" />
    <div class="dt-soon-view__back">
      <RouterLink class="dt-button" :to="{ name: 'home' }">← 返回全部工具</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dt-soon-view {
  padding-top: var(--dt-space-5);
}
.dt-soon-view__back {
  display: flex;
  justify-content: center;
  margin-top: var(--dt-space-4);
}
</style>
