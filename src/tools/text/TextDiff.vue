<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/textdiff.vue 移植（MIT）：保留双栏输入 + 差异高亮结构，
// 差异算法改为本地逐行 LCS，避免基座 Editor / Monaco 的外链依赖。
import { computed, inject, onUnmounted, ref, watch } from 'vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

/** 一行差异结果。 */
interface DiffRow {
  type: 'same' | 'added' | 'removed'
  text: string
}

const original = ref('')
const modified = ref('')

/** 超过该规模时退化为逐行对比，避免 O(n*m) 卡死页面。 */
const LCS_LIMIT = 400000

/**
 * 逐行 LCS 对比，返回按原文档顺序排列的差异行。
 * 基于 HeHang0/devtoys 的 diff 展示思路重写（MIT）。
 */
function diffLines(before: string, after: string): DiffRow[] {
  const left = before.split(/\r?\n/)
  const right = after.split(/\r?\n/)
  if (left.length * right.length > LCS_LIMIT) {
    const fallback: DiffRow[] = []
    const length = Math.max(left.length, right.length)
    for (let index = 0; index < length; index += 1) {
      if (left[index] === right[index]) {
        fallback.push({ type: 'same', text: left[index] ?? '' })
      } else {
        if (left[index] !== undefined) fallback.push({ type: 'removed', text: left[index] })
        if (right[index] !== undefined) fallback.push({ type: 'added', text: right[index] })
      }
    }
    return fallback
  }

  const table: number[][] = []
  for (let i = 0; i <= left.length; i += 1) {
    table.push(new Array<number>(right.length + 1).fill(0))
  }
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      table[i][j] = left[i] === right[j]
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }

  const rows: DiffRow[] = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      rows.push({ type: 'same', text: left[i] })
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      rows.push({ type: 'removed', text: left[i] })
      i += 1
    } else {
      rows.push({ type: 'added', text: right[j] })
      j += 1
    }
  }
  while (i < left.length) {
    rows.push({ type: 'removed', text: left[i] })
    i += 1
  }
  while (j < right.length) {
    rows.push({ type: 'added', text: right[j] })
    j += 1
  }
  return rows
}

const rows = computed<DiffRow[]>(() => {
  if (!original.value && !modified.value) {
    return []
  }
  return diffLines(original.value, modified.value)
})

const changedCount = computed<number>(() =>
  rows.value.filter(row => row.type !== 'same').length
)

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: rows.value
    .map(row => {
      const sign = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '
      return `${sign} ${row.text}`
    })
    .join('\n')
}))

watch(result, next => {
  emit('output-change', next)
  emit('status-change', next.text
    ? { state: 'success', message: `对比完成，共 ${changedCount.value} 处差异` }
    : { state: 'idle' })
}, { immediate: true })

/** 交换事件把输出写回右侧文本，便于再次比较。 */
interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(text => { modified.value = text }) ?? null
onUnmounted(() => { stopSwap?.() })

function rowSign(row: DiffRow): string {
  return row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '
}
</script>

<template>
  <div class="dt-diff">
    <div class="dt-diff__inputs">
      <label class="dt-field">
        <span class="dt-field__label">原文本</span>
        <textarea v-model="original" class="dt-textarea" rows="8" spellcheck="false"
          placeholder="在这里输入原始文本"></textarea>
      </label>
      <label class="dt-field">
        <span class="dt-field__label">新文本</span>
        <textarea v-model="modified" class="dt-textarea" rows="8" spellcheck="false"
          placeholder="在这里输入修改后的文本"></textarea>
      </label>
    </div>

    <div class="dt-diff__summary">
      共 {{ rows.length }} 行，{{ changedCount }} 处差异
    </div>
    <div class="dt-diff__rows" role="region" aria-label="差异高亮结果">
      <div v-for="(row, index) in rows" :key="index" class="dt-diff__row" :class="`is-${row.type}`">
        <span class="dt-diff__sign">{{ rowSign(row) }}</span>
        <span class="dt-diff__text">{{ row.text || ' ' }}</span>
      </div>
      <p v-if="!rows.length" class="dt-diff__empty">请输入文本后查看逐行差异</p>
    </div>
  </div>
</template>

<style scoped>
.dt-diff__inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
}
.dt-field {
  display: grid;
  gap: var(--dt-space-2);
  min-width: 0;
}
.dt-field__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-textarea {
  width: 100%;
  min-height: 180px;
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
.dt-diff__summary {
  margin: var(--dt-space-4) 0 var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-diff__rows {
  max-height: 420px;
  overflow: auto;
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-diff__row {
  display: flex;
  gap: var(--dt-space-3);
  padding: 2px var(--dt-space-3);
  border-left: 3px solid transparent;
  white-space: pre-wrap;
  word-break: break-all;
}
.dt-diff__row.is-added {
  border-left-color: var(--dt-success);
  background: var(--dt-card-bg);
  color: var(--dt-success);
}
.dt-diff__row.is-removed {
  border-left-color: var(--dt-danger);
  background: var(--dt-card-bg);
  color: var(--dt-danger);
}
.dt-diff__sign {
  width: 1em;
  flex: 0 0 1em;
  text-align: center;
}
.dt-diff__empty {
  margin: 0;
  padding: var(--dt-space-4);
  color: var(--dt-muted);
}
@media (max-width: 768px) {
  .dt-diff__inputs {
    grid-template-columns: 1fr;
  }
  .dt-textarea {
    min-height: 140px;
  }
}
</style>
