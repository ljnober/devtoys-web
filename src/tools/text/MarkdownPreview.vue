<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/markdown.vue 移植（MIT）：保留 marked + 代码高亮渲染，
// 已剔除原文中拉取远端 README 的 fetch、图片代理与外链资源，只保留本地渲染逻辑。
import { computed, onUnmounted, ref, watch } from 'vue'
import { inject } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const source = ref('')

/** HTML 文本转义，作为代码高亮失败时的兜底。 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 创建本地渲染器：代码块走 highlight.js，图片链接一律屏蔽以遵守离线红线。 */
const renderer = new marked.Renderer()
renderer.code = (code: string, language?: string, _isEscaped?: boolean): string => {
  let highlighted = ''
  try {
    if (language && hljs.getLanguage(language)) {
      highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value
    } else {
      highlighted = hljs.highlightAuto(code).value
    }
  } catch {
    highlighted = escapeHtml(code)
  }
  const languageClass = language ? ` class="hljs language-${escapeHtml(language)}"` : ' class="hljs"'
  return `<pre><code${languageClass}>${highlighted}</code></pre>`
}
renderer.image = (_href: string | null, _title: string | null, text: string): string =>
  `<span class="dt-md-blocked">（已屏蔽外部图片：${escapeHtml(text || '未命名')}）</span>`

/** 渲染后本地清洗：移除脚本/表单/外链属性，禁止任何远端资源加载。 */
function sanitizeHtml(html: string): string {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input,button')
    .forEach(element => element.remove())
  template.content.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()
      const isRemote = (name === 'href' || name === 'src') &&
        !value.startsWith('#') && !value.startsWith('./') && !value.startsWith('data:image/')
      if (name.startsWith('on') || isRemote ||
          (name === 'style' && value.includes('url('))) {
        element.removeAttribute(attribute.name)
      }
    })
  })
  return template.innerHTML
}

const html = computed<string>(() => {
  if (!source.value) {
    return ''
  }
  try {
    const rendered = marked.parse(source.value, {
      renderer,
      mangle: false,
      headerIds: false
    }) as string
    return sanitizeHtml(rendered)
  } catch {
    return '<p>渲染失败，请检查 Markdown 语法</p>'
  }
})

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: source.value ? html.value : ''
}))

watch(result, next => {
  emit('output-change', next)
  emit('status-change', next.text ? { state: 'success' } : { state: 'idle' })
}, { immediate: true })

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap(text => { source.value = text }) ?? null
onUnmounted(() => { stopSwap?.() })
</script>

<template>
  <div class="dt-markdown">
    <label class="dt-field">
      <span class="dt-field__label">Markdown 源码</span>
      <textarea v-model="source" class="dt-textarea" rows="14" spellcheck="false"
        placeholder="# 标题&#10;&#10;输入 Markdown，右侧即时预览"></textarea>
    </label>
    <div class="dt-markdown__preview">
      <div class="dt-field__label">渲染预览（本地渲染，无外部资源）</div>
      <div class="dt-markdown__body" v-html="html"></div>
      <p v-if="!html" class="dt-markdown__empty">预览结果将显示在这里</p>
    </div>
  </div>
</template>

<style scoped>
.dt-markdown {
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
.dt-markdown__preview {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--dt-space-2);
}
.dt-markdown__body {
  min-height: 320px;
  max-height: 480px;
  overflow: auto;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-fg);
  line-height: 1.7;
  word-break: break-word;
}
.dt-markdown__empty {
  margin: 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-markdown__body :deep(h1),
.dt-markdown__body :deep(h2),
.dt-markdown__body :deep(h3) {
  color: var(--dt-fg);
}
.dt-markdown__body :deep(a) {
  color: var(--dt-primary);
}
.dt-markdown__body :deep(blockquote) {
  margin: var(--dt-space-2) 0;
  padding-left: var(--dt-space-3);
  border-left: 3px solid var(--dt-primary);
  color: var(--dt-muted);
}
.dt-markdown__body :deep(code) {
  padding: 2px 4px;
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-family: var(--dt-font-mono);
}
.dt-markdown__body :deep(pre) {
  overflow: auto;
  padding: var(--dt-space-3);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
}
.dt-markdown__body :deep(pre code) {
  padding: 0;
  background: transparent;
}
.dt-blocked {
  color: var(--dt-muted);
}
@media (max-width: 768px) {
  .dt-markdown {
    grid-template-columns: 1fr;
  }
  .dt-textarea,
  .dt-markdown__body {
    min-height: 220px;
  }
}
</style>
