<script setup lang="ts">
// JSON Schema 验证器：调用自研常用关键字子集校验器（type/required/properties/items/enum/pattern/数值范围）。
import { computed, ref, watch } from 'vue'
import { validateJsonSchema } from '@/utils/jsonSchema'
import type { SchemaIssue } from '@/utils/jsonSchema'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const schemaText = ref('')
const dataText = ref('')

interface ValidationState {
  issues: SchemaIssue[]
  error: string
  ready: boolean
}

const state = computed<ValidationState>(() => {
  if (!schemaText.value.trim() || !dataText.value.trim()) {
    return { issues: [], error: '', ready: false }
  }
  let schema: unknown
  let data: unknown
  try {
    schema = JSON.parse(schemaText.value)
  } catch {
    return { issues: [], error: 'Schema 不是合法 JSON，请检查语法', ready: false }
  }
  try {
    data = JSON.parse(dataText.value)
  } catch {
    return { issues: [], error: '待校验数据不是合法 JSON，请检查语法', ready: false }
  }
  const result = validateJsonSchema(data, schema)
  return { issues: result.issues, error: '', ready: true }
})

const output = computed<ToolResult>(() => {
  if (!state.value.ready || state.value.error) {
    return { kind: 'text', text: '' }
  }
  if (!state.value.issues.length) {
    return { kind: 'text', text: '校验通过，数据符合 Schema 约束' }
  }
  return {
    kind: 'text',
    text: state.value.issues
      .map(issue => `${issue.path}：${issue.message}`)
      .join('\n')
  }
})

watch([schemaText, dataText], () => {
  emit('output-change', output.value)
  if (state.value.error) {
    emit('status-change', { state: 'error', message: state.value.error })
  } else if (!state.value.ready) {
    emit('status-change', { state: 'idle' })
  } else if (state.value.issues.length) {
    emit('status-change', {
      state: 'error',
      message: `校验未通过，共 ${state.value.issues.length} 个问题`
    })
  } else {
    emit('status-change', { state: 'success', message: '校验通过' })
  }
}, { immediate: true })
</script>

<template>
  <div class="dt-schema">
    <div class="dt-schema__grid">
      <label class="dt-field">
        <span class="dt-field__label">JSON Schema</span>
        <textarea v-model="schemaText" class="dt-textarea" rows="14" spellcheck="false"
          placeholder='例如 {"type":"object","required":["name"]}'></textarea>
      </label>
      <label class="dt-field">
        <span class="dt-field__label">待校验 JSON</span>
        <textarea v-model="dataText" class="dt-textarea" rows="14" spellcheck="false"
          placeholder='例如 {"name":"示例"}'></textarea>
      </label>
    </div>

    <p class="dt-schema__note">
      支持 type、required、properties、items、enum、pattern、minimum/maximum 等常用关键字；完整 Draft-07 暂未支持。
    </p>

    <div class="dt-schema__results">
      <p v-if="state.error" class="is-error">{{ state.error }}</p>
      <p v-else-if="!state.ready" class="is-empty">填写两侧内容后自动校验</p>
      <p v-else-if="!state.issues.length" class="is-pass">校验通过，数据符合 Schema 约束</p>
      <ul v-else>
        <li v-for="(issue, index) in state.issues" :key="index">
          <code>{{ issue.path }}</code>
          <span>{{ issue.message }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dt-schema__grid {
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
  min-height: 280px;
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
.dt-schema__note {
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-schema__results {
  min-height: 110px;
  max-height: 260px;
  overflow: auto;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-size: var(--dt-font-size-sm);
}
.dt-schema__results ul {
  margin: 0;
  padding-left: var(--dt-space-4);
}
.dt-schema__results li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  padding: var(--dt-space-1) 0;
}
.dt-schema__results code {
  color: var(--dt-primary);
  font-family: var(--dt-font-mono);
}
.is-error {
  margin: 0;
  color: var(--dt-danger);
}
.is-pass {
  margin: 0;
  color: var(--dt-success);
}
.is-empty {
  margin: 0;
  color: var(--dt-muted);
}
@media (max-width: 768px) {
  .dt-schema__grid {
    grid-template-columns: 1fr;
  }
  .dt-textarea {
    min-height: 200px;
  }
}
</style>
