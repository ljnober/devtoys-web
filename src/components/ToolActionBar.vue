<script setup lang="ts">
// 固定四个操作：复制 / 下载 / 清空 / 交换，全部通过冻结的 ToolActions 调用。
import type { ToolActions, ToolResult } from '@/tools/contracts'

const props = withDefaults(defineProps<{
  actions: ToolActions
  text?: string
  result?: ToolResult
  hasOutput?: boolean
}>(), {
  text: '',
  hasOutput: false
})

async function onCopy(): Promise<void> {
  await props.actions.copy(props.text)
}

function onDownload(): void {
  props.actions.download(props.result ?? { kind: 'text', text: props.text })
}

function onClear(): void {
  props.actions.clear()
}

function onSwap(): void {
  props.actions.swap()
}
</script>

<template>
  <div class="dt-actions" role="group" aria-label="工具操作">
    <button class="dt-button" type="button" :disabled="!hasOutput" @click="onCopy">📋 复制</button>
    <button class="dt-button" type="button" :disabled="!hasOutput" @click="onDownload">⬇️ 下载</button>
    <button class="dt-button" type="button" @click="onClear">🧹 清空</button>
    <button class="dt-button" type="button" :disabled="!hasOutput" @click="onSwap">⇄ 交换</button>
  </div>
</template>

<style scoped>
.dt-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin-top: var(--dt-space-4);
}
</style>
