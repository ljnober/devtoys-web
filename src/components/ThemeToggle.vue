<script setup lang="ts">
// 深/浅主题切换按钮，偏好由 theme store 持久化。
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isLight = computed<boolean>(() => themeStore.theme === 'light')
const label = computed<string>(() => isLight.value ? '切换到深色主题' : '切换到浅色主题')
const icon = computed<string>(() => isLight.value ? '🌙' : '☀️')
</script>

<template>
  <button
    class="dt-theme-toggle"
    type="button"
    :aria-label="label"
    :title="label"
    @click="themeStore.toggle()">
    <span aria-hidden="true">{{ icon }}</span>
  </button>
</template>

<style scoped>
.dt-theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  font-size: var(--dt-font-size-lg);
}
.dt-theme-toggle:hover {
  border-color: var(--dt-primary);
  box-shadow: var(--dt-shadow-hover);
}
</style>
