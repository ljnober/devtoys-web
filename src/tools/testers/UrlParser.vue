<script setup lang="ts">
// URL 解析器：使用浏览器原生 URL / URLSearchParams，零请求、零外链资源。
import { computed, ref, watch } from 'vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const urlText = ref('')

/** 键值展示项。 */
interface FieldItem {
  label: string
  value: string
}

interface ParseState {
  fields: FieldItem[]
  query: FieldItem[]
  hash: FieldItem[]
  error: string
}

/** 把 URLSearchParams 转成展示条目，保留空值与重复键。 */
function toItems(params: URLSearchParams): FieldItem[] {
  const items: FieldItem[] = []
  params.forEach((value, key) => items.push({ label: key, value }))
  return items
}

const state = computed<ParseState>(() => {
  const value = urlText.value.trim()
  if (!value) {
    return { fields: [], query: [], hash: [], error: '' }
  }
  try {
    const parsed = new URL(value)
    const fields: FieldItem[] = [
      { label: '完整地址', value: parsed.href },
      { label: '协议', value: parsed.protocol },
      { label: '主机名', value: parsed.hostname },
      { label: '端口', value: parsed.port || '（默认端口）' },
      { label: '主机（含端口）', value: parsed.host },
      { label: '路径', value: parsed.pathname },
      { label: '查询字符串', value: parsed.search || '（无）' },
      { label: '片段标识', value: parsed.hash || '（无）' }
    ]
    if (parsed.username) {
      fields.push({ label: '用户名', value: parsed.username })
    }
    if (parsed.password) {
      fields.push({ label: '密码', value: '••••••（已隐藏）' })
    }
    const hashQuery = parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash
    return {
      fields,
      query: toItems(parsed.searchParams),
      hash: hashQuery.includes('=') ? toItems(new URLSearchParams(hashQuery)) : [],
      error: ''
    }
  } catch {
    return {
      fields: [],
      query: [],
      hash: [],
      error: 'URL 格式无效，请输入完整地址，例如 https://example.com/path?a=1'
    }
  }
})

const output = computed<ToolResult>(() => {
  if (!state.value.fields.length) {
    return { kind: 'text', text: '' }
  }
  const sections = [
    state.value.fields.map(item => `${item.label}：${item.value}`).join('\n'),
    state.value.query.length
      ? `查询参数：\n${state.value.query.map(item => `  ${item.label} = ${item.value}`).join('\n')}`
      : '查询参数：无'
  ]
  if (state.value.hash.length) {
    sections.push(`片段参数：\n${state.value.hash.map(item => `  ${item.label} = ${item.value}`).join('\n')}`)
  }
  return { kind: 'text', text: sections.join('\n\n') }
})

watch(urlText, () => {
  emit('output-change', output.value)
  if (state.value.error) {
    emit('status-change', { state: 'error', message: state.value.error })
  } else if (!urlText.value.trim()) {
    emit('status-change', { state: 'idle' })
  } else {
    emit('status-change', { state: 'success', message: '解析完成' })
  }
}, { immediate: true })
</script>

<template>
  <div class="dt-url">
    <label class="dt-field">
      <span class="dt-field__label">待解析 URL</span>
      <input v-model="urlText" type="text" spellcheck="false"
        placeholder="https://example.com:8080/path?a=1#top" />
    </label>

    <p v-if="state.error" class="dt-url__error">{{ state.error }}</p>
    <p v-else-if="!urlText.trim()" class="dt-url__empty">输入 URL 后自动拆解为结构化字段</p>

    <div v-else class="dt-url__grid">
      <section class="dt-url__section">
        <h2>基础字段</h2>
        <dl>
          <template v-for="item in state.fields" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>
      </section>
      <section class="dt-url__section">
        <h2>查询参数（{{ state.query.length }}）</h2>
        <ul v-if="state.query.length">
          <li v-for="(item, index) in state.query" :key="index">
            <code>{{ item.label }}</code>
            <span>{{ item.value }}</span>
          </li>
        </ul>
        <p v-else class="dt-url__empty">无查询参数</p>
        <template v-if="state.hash.length">
          <h2>片段参数（{{ state.hash.length }}）</h2>
          <ul>
            <li v-for="(item, index) in state.hash" :key="index">
              <code>{{ item.label }}</code>
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dt-field {
  display: grid;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-4);
}
.dt-field__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-field input {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-url__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
}
.dt-url__section {
  min-width: 0;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-url__section h2 {
  margin: 0 0 var(--dt-space-3);
  font-size: var(--dt-font-size);
}
.dt-url__section dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--dt-space-2) var(--dt-space-3);
  margin: 0;
  font-size: var(--dt-font-size-sm);
}
.dt-url__section dt {
  color: var(--dt-muted);
}
.dt-url__section dd {
  margin: 0;
  word-break: break-all;
  font-family: var(--dt-font-mono);
}
.dt-url__section ul {
  margin: 0;
  padding-left: var(--dt-space-4);
  font-size: var(--dt-font-size-sm);
}
.dt-url__section li {
  display: flex;
  gap: var(--dt-space-2);
  padding: var(--dt-space-1) 0;
  word-break: break-all;
}
.dt-url__section code {
  color: var(--dt-primary);
}
.dt-url__error {
  color: var(--dt-danger);
}
.dt-url__empty {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
@media (max-width: 768px) {
  .dt-url__grid {
    grid-template-columns: 1fr;
  }
}
</style>
