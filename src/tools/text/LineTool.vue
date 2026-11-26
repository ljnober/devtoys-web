<script setup lang="ts">
// 行工具：排序 / 去重 / 去空行，纯本地字符串处理，零网络请求。
import { computed, inject, isRef, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

type ToolOptions = Record<string, string | number | boolean>
type Mode = 'sort' | 'unique' | 'trim-empty'

const injected = inject<Ref<ToolOptions> | ToolOptions | null>('devtoys:toolOptions', null)
const mode = computed<Mode>(() => {
  const values = injected ? (isRef(injected) ? injected.value : injected) : null
  const raw = String(values?.mode ?? 'sort')
  return raw === 'unique' || raw === 'trim-empty' ? raw : 'sort'
})

const source = ref('')
const descending = ref(false)
const ignoreCase = ref(false)
const trimWhitespace = ref(true)
const prefix = ref('')
const suffix = ref('')

/** 按当前模式处理每一行。 */
function processLines(input: string): string[] {
  let lines = input.split(/\r?\n/)
  if (trimWhitespace.value) {
    lines = lines.map(line => line.trim())
  }
  if (mode.value === 'trim-empty') {
    lines = lines.filter(line => line.length > 0)
  }
  if (mode.value === 'unique') {
    const seen = new Set<string>()
    lines = lines.filter(line => {
      const key = ignoreCase.value ? line.toLowerCase() : line
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
  if (mode.value === 'sort') {
    lines = lines.slice().sort((a, b) => {
      const left = ignoreCase.value ? a.toLowerCase() : a
      const right = ignoreCase.value ? b.toLowerCase() : b
      const compared = left.localeCompare(right, 'zh-CN')
      return descending.value ? -compared : compared
    })
  }
  return lines.map(line => `${prefix.value}${line}${suffix.value}`)
}

const output = computed<ToolResult>(() => ({
  kind: 'text',
  text: source.value ? processLines(source.value).join('\n') : ''
}))

const lineCount = computed<number>(() =>
  output.value.text ? output.value.text.split('\n').length : 0
)

watch(output, next => {
  emit('output-change', next)
  emit('status-change', next.text
    ? { state: 'success', message: `已处理 ${lineCount.value} 行` }
    : { state: 'idle' })
}, { immediate: true })

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(text => { source.value = text }) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-lines">
    <div class="dt-lines__controls">
      <label class="dt-control">
        <span>每行前缀</span>
        <input v-model="prefix" type="text" placeholder="可选" />
      </label>
      <label class="dt-control">
        <span>每行后缀</span>
        <input v-model="suffix" type="text" placeholder="可选" />
      </label>
      <label class="dt-control dt-control--check">
        <input v-model="descending" type="checkbox" />
        <span>降序排序</span>
      </label>
      <label class="dt-control dt-control--check">
        <input v-model="ignoreCase" type="checkbox" />
        <span>忽略大小写</span>
      </label>
      <label class="dt-control dt-control--check">
        <input v-model="trimWhitespace" type="checkbox" />
        <span>去除行首尾空白</span>
      </label>
    </div>
    <p class="dt-lines__hint">
      处理方式由工具选项控制：{{ mode === 'sort' ? '排序' : mode === 'unique' ? '去重' : '去空行' }}
    </p>
    <IoPanel
      v-model="source"
      :output="output"
      input-label="原始行"
      output-label="处理结果" />
  </div>
</template>

<style scoped>
.dt-lines__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: flex-end;
  margin-bottom: var(--dt-space-3);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-control {
  display: grid;
  gap: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-control--check {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  min-height: var(--dt-touch-target);
}
.dt-control input[type='text'] {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
}
.dt-control input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--dt-primary);
}
.dt-lines__hint {
  margin: 0 0 var(--dt-space-3);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
