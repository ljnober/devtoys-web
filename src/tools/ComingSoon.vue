<script setup lang="ts">
// 未实现工具的统一占位（T02 美化版）：卡片提示 + 中文说明，保证不白屏。
import { computed } from 'vue'
import { getTool } from './registry'

const props = defineProps<{ toolId?: string }>()
const tool = computed(() => getTool(props.toolId ?? ''))
const name = computed<string>(() => tool.value?.name ?? '该工具')
</script>

<template>
  <div class="dt-coming-soon dt-card">
    <div class="dt-coming-soon__icon" aria-hidden="true">🚧</div>
    <h2>{{ name }} · 开发中</h2>
    <p>该工具正在实现中，敬请期待。</p>
    <p class="dt-coming-soon__privacy">🔒 当前所有可用工具均在浏览器本地运行，不会上传你的数据。</p>
    <div v-if="tool" class="dt-coming-soon__meta">
      <span>分类：{{ tool.category }}</span>
      <span>状态：即将推出</span>
    </div>
  </div>
</template>

<style scoped>
.dt-coming-soon {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--dt-space-6) var(--dt-space-5);
  text-align: center;
}
.dt-coming-soon__icon {
  font-size: 48px;
  line-height: 1.2;
}
.dt-coming-soon h2 {
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  font-size: var(--dt-font-size-lg);
}
.dt-coming-soon p {
  margin: var(--dt-space-2) 0;
  color: var(--dt-muted);
}
.dt-coming-soon__privacy {
  font-size: var(--dt-font-size-sm);
}
.dt-coming-soon__meta {
  display: flex;
  justify-content: center;
  gap: var(--dt-space-4);
  flex-wrap: wrap;
  margin-top: var(--dt-space-4);
  padding-top: var(--dt-space-4);
  border-top: 1px solid var(--dt-border);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
