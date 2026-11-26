<script setup lang="ts">
// 工具卡片：紫色图标块 + 中文名 + 单行描述；coming-soon 卡片不可点击。
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
    <span class="dt-tool-card__icon" aria-hidden="true">
      <span class="dt-tool-card__glyph">{{ tool.icon }}</span>
    </span>
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
  align-items: center;
  gap: var(--dt-space-3);
  min-height: 64px;
  padding: var(--dt-space-2) var(--dt-space-3);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: var(--dt-radius-sm);
  background: var(--dt-icon-bg);
}
.dt-tool-card__glyph {
  display: inline-block;
  max-width: 32px;
  overflow: hidden;
  color: var(--dt-icon-fg);
  font-size: var(--dt-font-size-lg);
  line-height: 1;
  text-align: center;
  filter: grayscale(1) brightness(0) invert(1);
}
.dt-tool-card__body {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.dt-tool-card__body strong {
  overflow: hidden;
  font-size: var(--dt-font-size-sm);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dt-tool-card__body small {
  overflow: hidden;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dt-tool-card__tag {
  position: absolute;
  top: var(--dt-space-1);
  right: var(--dt-space-2);
  padding: 0 var(--dt-space-1);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
