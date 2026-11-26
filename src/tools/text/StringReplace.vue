<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/replace.vue 移植（MIT）：保留查找/替换/行首行尾四种模式，
// 改为受控输入 + IoPanel 双栏，并从 ToolView 注入的 option.regex 读取正则开关。
import { computed, inject, isRef, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import IoPanel from '@/components/IoPanel.vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type ToolOptions = Record<string, string | number | boolean>
type Scope = 'text' | 'line-start' | 'line-end'

const injected = inject<Ref<ToolOptions> | ToolOptions | null>('devtoys:toolOptions', null)
const useRegex = computed<boolean>(() => {
  const values = injected ? (isRef(injected) ? injected.value : injected) : null
  return Boolean(values?.regex ?? false)
})

const source = ref('')
const find = ref('')
const replacement = ref('')
const scope = ref<Scope>('text')
const caseSensitive = ref(true)

/** 把字面量字符串转成安全正则，避免用户输入被当作元字符。 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 构建查找正则：行首/行尾模式使用多行锚点。 */
function buildPattern(): RegExp {
  const literal = escapeRegExp(find.value)
  const base = scope.value === 'line-start'
    ? `^${literal}`
    : scope.value === 'line-end' ? `${literal}$` : literal
  const flags = scope.value === 'text'
    ? (caseSensitive.value ? 'g' : 'gi')
    : (caseSensitive.value ? 'gm' : 'gim')
  return new RegExp(base, flags)
}

const output = ref<ToolResult>({ kind: 'text', text: '' })
const matchCount = ref(0)

/** 输入或选项变化时即时重算；正则语法错误转成中文状态提示。 */
function recalculate(): void {
  if (!source.value) {
    output.value = { kind: 'text', text: '' }
    matchCount.value = 0
    emit('output-change', output.value)
    emit('status-change', { state: 'idle' })
    return
  }
  if (!find.value && scope.value === 'text') {
    output.value = { kind: 'text', text: source.value }
    matchCount.value = 0
    emit('output-change', output.value)
    emit('status-change', { state: 'success', message: '请输入要查找的内容' })
    return
  }

  try {
    if (!useRegex.value && scope.value !== 'text') {
      const lines = source.value.split('\n').map(line => scope.value === 'line-start'
        ? `${replacement.value}${line}`
        : `${line}${replacement.value}`)
      output.value = { kind: 'text', text: lines.join('\n') }
      matchCount.value = lines.length
    } else {
      const pattern = buildPattern()
      const matches = source.value.match(new RegExp(pattern.source, pattern.flags))
      matchCount.value = matches?.length ?? 0
      output.value = { kind: 'text', text: source.value.replace(pattern, replacement.value) }
    }
    emit('output-change', output.value)
    emit('status-change', {
      state: 'success',
      message: `完成 ${matchCount.value} 处替换`
    })
  } catch {
    output.value = { kind: 'text', text: '' }
    matchCount.value = 0
    emit('output-change', output.value)
    emit('status-change', { state: 'error', message: '正则表达式无效，请检查语法后重试' })
  }
}

watch([source, find, replacement, scope, caseSensitive, useRegex], recalculate, { immediate: true })

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(text => { source.value = text }) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-replace">
    <div class="dt-replace__controls">
      <label class="dt-control">
        <span>查找范围</span>
        <select v-model="scope">
          <option value="text">文本</option>
          <option value="line-start">行首</option>
          <option value="line-end">行尾</option>
        </select>
      </label>
      <label class="dt-control dt-control--grow">
        <span>查找内容</span>
        <input v-model="find" type="text" :placeholder="useRegex ? '输入正则表达式' : '输入要查找的文本'" />
      </label>
      <label class="dt-control dt-control--grow">
        <span>替换为</span>
        <input v-model="replacement" type="text" placeholder="替换内容，正则可用 $1 引用分组" />
      </label>
      <label class="dt-control dt-control--check">
        <input v-model="caseSensitive" type="checkbox" />
        <span>区分大小写</span>
      </label>
    </div>
    <p class="dt-replace__hint">
      当前模式：{{ useRegex ? '正则表达式（由注册表选项控制）' : '普通文本' }}，已处理 {{ matchCount }} 处
    </p>
    <IoPanel
      v-model="source"
      :output="output"
      input-label="原文"
      output-label="替换结果" />
  </div>
</template>

<style scoped>
.dt-replace__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--dt-space-3);
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
.dt-control--grow {
  flex: 1 1 180px;
}
.dt-control--check {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  min-height: var(--dt-touch-target);
}
.dt-control input[type='text'],
.dt-control select {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-control input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--dt-primary);
}
.dt-replace__hint {
  margin: 0 0 var(--dt-space-3);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
