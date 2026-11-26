<script setup lang="ts">
// 通用输入/输出双栏：输入 textarea + 输出只读高亮（可切纯文本），移动端纵向堆叠。
import { computed, ref } from 'vue'
import hljs from 'highlight.js'
import type { ToolResult } from '@/tools/contracts'

interface Props {
  modelValue?: string
  output?: ToolResult
  inputLabel?: string
  outputLabel?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  inputLabel: '输入',
  outputLabel: '输出',
  placeholder: '请在此输入内容，所有处理均在本地完成'
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

/** 高亮视图与纯文本视图的切换状态。 */
const showRaw = ref(false)

const outputText = computed<string>(() => {
  const result = props.output
  if (!result) {
    return ''
  }
  return result.kind === 'text'
    ? (result.text ?? '')
    : '（二进制结果，请点击下载按钮保存）'
})

/** highlight.js 会对用户文本做实体转义，v-html 不会引入脚本。 */
const highlighted = computed<string>(() => {
  const text = outputText.value
  if (!text || text.startsWith('（二进制结果')) {
    return ''
  }
  try {
    return hljs.highlightAuto(text).value
  } catch {
    return ''
  }
})

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="dt-io">
    <div class="dt-io__pane">
      <label class="dt-io__label">{{ inputLabel }}</label>
      <textarea
        class="dt-io__textarea"
        :value="modelValue"
        :placeholder="placeholder"
        rows="12"
        spellcheck="false"
        @input="onInput"></textarea>
    </div>

    <div class="dt-io__pane">
      <div class="dt-io__head">
        <label class="dt-io__label">{{ outputLabel }}</label>
        <button
          v-if="highlighted"
          class="dt-io__toggle"
          type="button"
          @click="showRaw = !showRaw">
          {{ showRaw ? '高亮视图' : '纯文本' }}
        </button>
      </div>
      <pre v-if="highlighted && !showRaw" class="dt-io__highlight"><code v-html="highlighted"></code></pre>
      <textarea
        v-else
        class="dt-io__textarea"
        :value="outputText"
        rows="12"
        readonly
        spellcheck="false"></textarea>
    </div>
  </div>
</template>

<style scoped>
.dt-io {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
}
.dt-io__pane {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--dt-space-2);
  min-width: 0;
}
.dt-io__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-2);
}
.dt-io__label {
  font-size: var(--dt-font-size-sm);
  color: var(--dt-muted);
}
.dt-io__toggle {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-1) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-io__textarea,
.dt-io__highlight {
  width: 100%;
  min-height: 240px;
  margin: 0;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  line-height: 1.6;
  overflow: auto;
  resize: vertical;
}
.dt-io__highlight {
  white-space: pre-wrap;
  word-break: break-word;
}
.dt-io__highlight :deep(.hljs-keyword),
.dt-io__highlight :deep(.hljs-selector-tag) {
  color: var(--dt-primary);
}
.dt-io__highlight :deep(.hljs-string),
.dt-io__highlight :deep(.hljs-attr) {
  color: var(--dt-success);
}
.dt-io__highlight :deep(.hljs-number),
.dt-io__highlight :deep(.hljs-literal) {
  color: var(--dt-warning);
}
.dt-io__highlight :deep(.hljs-comment) {
  color: var(--dt-muted);
}
@media (max-width: 768px) {
  .dt-io {
    grid-template-columns: 1fr;
  }
  .dt-io__textarea,
  .dt-io__highlight {
    min-height: 160px;
  }
}
</style>
