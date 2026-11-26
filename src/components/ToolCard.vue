<script setup lang="ts">
// 工具卡片：图标 + 中文名 + 一句话描述；coming-soon 卡片不可点击。
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import type { ToolDefinition } from '@/tools/contracts'

const props = defineProps<{ tool: ToolDefinition }>()
const isComingSoon = computed<boolean>(() => props.tool.state === 'coming-soon')
</script>

<template>
  <component
    :is="isComingSoon ? 'div' : RouterLink"
    class="dt-tool-card dt-card"
    :class="{ 'dt-tool-card--soon': isComingSoon }"
    :to="isComingSoon ? undefined : { name: 'tool', params: { id: tool.id } }"
    :aria-disabled="isComingSoon ? 'true' : undefined">
    <span class="dt-tool-card__icon" aria-hidden="true">{{ tool.icon }}</span>
    <span class="dt-tool-card__body">
      <strong>{{ tool.name }}</strong>
      <small>{{ tool.description }}</small>
    </span>
    <span v-if="isComingSoon" class="dt-tool-card__tag">即将推出</span>
  </component>
</template>

<style scoped>
.dt-tool-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-3);
  min-height: 88px;
  padding: var(--dt-space-4);
  color: var(--dt-fg);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
a.dt-tool-card:hover {
  border-color: var(--dt-primary);
  box-shadow: var(--dt-shadow-hover);
}
.dt-tool-card--soon {
  opacity: 0.65;
  cursor: default;
}
.dt-tool-card__icon {
  font-size: 28px;
  line-height: 1.3;
}
.dt-tool-card__body {
  display: grid;
  gap: var(--dt-space-1);
  min-width: 0;
}
.dt-tool-card__body small {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-tool-card__tag {
  position: absolute;
  top: var(--dt-space-2);
  right: var(--dt-space-2);
  padding: 0 var(--dt-space-2);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
