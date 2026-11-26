<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/regex.vue 移植（MIT）：保留实时匹配列表思路，
// 结果区改为本地转义后的高亮片段，禁止把用户文本作为 HTML 直接渲染。
import { computed, inject, isRef, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

type ToolOptions = Record<string, string | number | boolean>

const injected = inject<Ref<ToolOptions> | ToolOptions | null>('devtoys:toolOptions', null)
const flagsOption = computed<string>(() => {
  const values = injected ? (isRef(injected) ? injected.value : injected) : null
  return String(values?.flags ?? 'g')
})

const pattern = ref('')
const text = ref('')

/** 单条匹配结果。 */
interface RegexMatch {
  value: string
  index: number
  groups: string[]
  start: number
  end: number
}

/** HTML 转义，用户输入只允许以纯文本节点进入高亮区。 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 归一化标志：保留用户选择并去重，强制加入 g 以一次性找出全部匹配。 */
function normalizeFlags(source: string): string {
  const unique = Array.from(new Set(source.split('')))
    .filter(flag => 'gimsuy'.includes(flag))
    .join('')
  return unique.includes('g') ? unique : `${unique}g`
}

interface ScanResult {
  matches: RegexMatch[]
  error: string
}

/** 实时扫描文本；零宽匹配会手动推进 lastIndex，避免死循环。 */
function scan(): ScanResult {
  if (!pattern.value || !text.value) {
    return { matches: [], error: '' }
  }
  try {
    const regex = new RegExp(pattern.value, normalizeFlags(flagsOption.value))
    const matches: RegexMatch[] = []
    let guard = 0
    let found: RegExpExecArray | null = regex.exec(text.value)
    while (found !== null && guard < 500) {
      guard += 1
      const start = found.index
      const end = start + found[0].length
      matches.push({
        value: found[0],
        index: start,
        groups: found.slice(1).map(group => group ?? ''),
        start,
        end
      })
      if (found[0].length === 0) {
        regex.lastIndex += 1
        if (regex.lastIndex > text.value.length) {
          break
        }
      }
      found = regex.exec(text.value)
    }
    return { matches, error: '' }
  } catch {
    return { matches: [], error: '正则表达式无效，请检查语法后重试' }
  }
}

const scanned = computed<ScanResult>(scan)

/** 用匹配区间拼接高亮 HTML；区间外的文本全部转义。 */
const highlighted = computed<string>(() => {
  if (!text.value || scanned.value.error) {
    return ''
  }
  const matches = scanned.value.matches.slice().sort((a, b) => a.start - b.start)
  let cursor = 0
  let html = ''
  matches.forEach(match => {
    if (match.start < cursor) {
      return
    }
    html += escapeHtml(text.value.slice(cursor, match.start))
    const hit = match.end > match.start ? text.value.slice(match.start, match.end) : '⌀'
    html += `<mark class="dt-regex-hit">${escapeHtml(hit)}</mark>`
    cursor = match.end
  })
  html += escapeHtml(text.value.slice(cursor))
  return html
})

const output = computed<ToolResult>(() => {
  if (scanned.value.error || !text.value || !pattern.value) {
    return { kind: 'text', text: '' }
  }
  const lines = scanned.value.matches.map((match, index) => {
    const groups = match.groups.length ? ` | 分组：${match.groups.join(' , ')}` : ''
    return `第 ${index + 1} 处（位置 ${match.index}）：${match.value}${groups}`
  })
  return { kind: 'text', text: lines.length ? lines.join('\n') : '未找到匹配' }
})

watch([pattern, text, flagsOption], () => {
  emit('output-change', output.value)
  if (scanned.value.error) {
    emit('status-change', { state: 'error', message: scanned.value.error })
  } else if (!pattern.value || !text.value) {
    emit('status-change', { state: 'idle' })
  } else {
    emit('status-change', {
      state: 'success',
      message: `找到 ${scanned.value.matches.length} 处匹配`
    })
  }
}, { immediate: true })

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(value => { text.value = value }) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-regex">
    <div class="dt-regex__inputs">
      <label class="dt-control dt-control--grow">
        <span>正则表达式</span>
        <input v-model="pattern" type="text" spellcheck="false" placeholder="例如：\d+" />
      </label>
      <label class="dt-control">
        <span>标志（来自选项）</span>
        <input :value="flagsOption" type="text" readonly />
      </label>
    </div>

    <label class="dt-field">
      <span class="dt-field__label">测试文本</span>
      <textarea v-model="text" class="dt-textarea" rows="8" spellcheck="false"
        placeholder="输入待匹配的文本，匹配结果会实时高亮"></textarea>
    </label>

    <div class="dt-regex__summary" :class="{ 'is-error': scanned.error }">
      {{ scanned.error || `匹配 ${scanned.matches.length} 处` }}
    </div>
    <div class="dt-regex__highlight" aria-label="匹配高亮结果">
      <pre v-if="highlighted"><code v-html="highlighted"></code></pre>
      <p v-else>高亮结果将显示在这里</p>
    </div>

    <ol v-if="scanned.matches.length" class="dt-regex__list">
      <li v-for="(match, index) in scanned.matches" :key="index">
        <span class="dt-regex__index">#{{ index + 1 }}</span>
        <span class="dt-regex__value">{{ match.value || '（零宽匹配）' }}</span>
        <span class="dt-regex__pos">位置 {{ match.index }}</span>
        <span v-if="match.groups.length" class="dt-regex__groups">
          分组：{{ match.groups.join(' / ') }}
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.dt-regex__inputs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-3);
}
.dt-control {
  display: grid;
  gap: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-control--grow {
  flex: 1 1 240px;
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
.dt-field {
  display: grid;
  gap: var(--dt-space-2);
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
.dt-regex__summary {
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  color: var(--dt-success);
  font-size: var(--dt-font-size-sm);
}
.dt-regex__summary.is-error {
  color: var(--dt-danger);
}
.dt-regex__highlight {
  min-height: 100px;
  max-height: 260px;
  overflow: auto;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-regex__highlight pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
.dt-regex__highlight p {
  margin: 0;
  color: var(--dt-muted);
}
.dt-regex__list {
  margin: var(--dt-space-3) 0 0;
  padding-left: var(--dt-space-5);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-regex__list li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  padding: var(--dt-space-1) 0;
}
.dt-regex__index,
.dt-regex__pos,
.dt-regex__groups {
  color: var(--dt-muted);
}
.dt-regex__value {
  font-family: var(--dt-font-mono);
}
</style>

<style>
.dt-regex-hit {
  background: var(--dt-warning);
  color: var(--dt-primary-contrast);
  border-radius: 2px;
}
</style>
