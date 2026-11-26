<script setup lang="ts">
// JSONPath 测试器：调用自研轻量解析器（$ / . / [] / [*] / ..），零新增依赖。
import { computed, ref, watch } from 'vue'
import { queryJsonPath } from '@/utils/jsonpath'
import type { JsonPathMatch } from '@/utils/jsonpath'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const jsonText = ref('{\n  "a": [\n    { "b": "示例值" }\n  ]\n}')
const expression = ref('$.a[0].b')

/** 格式化任意值为单行 JSON 文本。 */
function formatValue(value: unknown): string {
  try {
    const text = JSON.stringify(value)
    return text === undefined ? String(value) : text
  } catch {
    return String(value)
  }
}

interface QueryState {
  matches: JsonPathMatch[]
  error: string
}

const state = computed<QueryState>(() => {
  if (!jsonText.value.trim() || !expression.value.trim()) {
    return { matches: [], error: '' }
  }
  let data: unknown
  try {
    data = JSON.parse(jsonText.value)
  } catch {
    return { matches: [], error: 'JSON 格式无效，请检查括号、引号与逗号' }
  }
  try {
    return { matches: queryJsonPath(data, expression.value), error: '' }
  } catch (error) {
    return {
      matches: [],
      error: error instanceof Error ? error.message : 'JSONPath 表达式无效'
    }
  }
})

const output = computed<ToolResult>(() => {
  if (state.value.error || !state.value.matches.length) {
    return { kind: 'text', text: '' }
  }
  return {
    kind: 'text',
    text: state.value.matches
      .map(match => `${match.path} = ${formatValue(match.value)}`)
      .join('\n')
  }
})

watch([jsonText, expression], () => {
  emit('output-change', output.value)
  if (state.value.error) {
    emit('status-change', { state: 'error', message: state.value.error })
  } else if (!jsonText.value.trim() || !expression.value.trim()) {
    emit('status-change', { state: 'idle' })
  } else {
    emit('status-change', {
      state: 'success',
      message: `找到 ${state.value.matches.length} 个结果`
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="dt-jsonpath">
    <label class="dt-control">
      <span>JSONPath 表达式</span>
      <input v-model="expression" type="text" spellcheck="false"
        placeholder="例如 $.a[0].b、$.items[*].name、$..name" />
    </label>
    <p class="dt-jsonpath__hint">
      支持 $、.属性、[下标]、['属性']、[*]、..递归、[start:end]
    </p>

    <div class="dt-jsonpath__grid">
      <label class="dt-field">
        <span class="dt-field__label">JSON 数据</span>
        <textarea v-model="jsonText" class="dt-textarea" rows="14" spellcheck="false"
          placeholder="在这里粘贴 JSON 数据"></textarea>
      </label>
      <div class="dt-field">
        <span class="dt-field__label">查询结果</span>
        <div class="dt-jsonpath__results">
          <p v-if="state.error" class="is-error">{{ state.error }}</p>
          <template v-else-if="state.matches.length">
            <div v-for="(match, index) in state.matches" :key="index" class="dt-jsonpath__item">
              <span class="dt-jsonpath__path">{{ match.path }}</span>
              <span class="dt-jsonpath__value">{{ formatValue(match.value) }}</span>
            </div>
          </template>
          <p v-else class="is-empty">暂无匹配结果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dt-control {
  display: grid;
  gap: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-control input {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-jsonpath__hint {
  margin: var(--dt-space-2) 0 var(--dt-space-3);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-jsonpath__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
}
.dt-field {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--dt-space-2);
  min-width: 0;
}
.dt-field__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-textarea {
  width: 100%;
  min-height: 320px;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  line-height: 1.6;
  resize: vertical;
}
.dt-jsonpath__results {
  min-height: 320px;
  max-height: 460px;
  overflow: auto;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-jsonpath__item {
  display: grid;
  gap: 2px;
  padding: var(--dt-space-2) 0;
  border-bottom: 1px solid var(--dt-border);
  word-break: break-all;
}
.dt-jsonpath__path {
  color: var(--dt-primary);
}
.dt-jsonpath__value {
  color: var(--dt-fg);
}
.is-error {
  margin: 0;
  color: var(--dt-danger);
}
.is-empty {
  margin: 0;
  color: var(--dt-muted);
}
@media (max-width: 768px) {
  .dt-jsonpath__grid {
    grid-template-columns: 1fr;
  }
  .dt-textarea,
  .dt-jsonpath__results {
    min-height: 220px;
  }
}
</style>
