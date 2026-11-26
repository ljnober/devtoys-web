<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/ligen.vue 移植（MIT）：段落与语言选项改用注册表契约。
import { computed, inject, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import { LOREM_EN_WORDS, LOREM_ZH_FRAGMENTS } from '@/data/lorem'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>

const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)
const text = ref('')

function option(key: string, fallback: string | number | boolean): string | number | boolean {
  const value = injectedOptions?.value?.[key]
  return value === undefined ? fallback : value
}

const config = computed(() => {
  const raw = Number(option('count', 3))
  const count = Number.isFinite(raw) ? Math.min(20, Math.max(1, Math.trunc(raw))) : 3
  return { count, language: option('language', 'en') === 'zh' ? 'zh' : 'en' }
})

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function randomItem<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]!
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function englishSentence(): string {
  const words = Array.from({ length: randomInt(8, 16) }, () => randomItem(LOREM_EN_WORDS))
  return `${capitalize(words.join(' '))}.`
}

function chineseSentence(): string {
  const parts = Array.from({ length: randomInt(4, 8) }, () => randomItem(LOREM_ZH_FRAGMENTS))
  return `${parts.join('，')}。`
}

function paragraph(): string {
  const sentence = config.value.language === 'zh' ? chineseSentence : englishSentence
  return Array.from({ length: randomInt(4, 7) }, sentence).join(config.value.language === 'zh' ? '' : ' ')
}

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: text.value,
  filename: `lorem-${config.value.language}.txt`,
  mimeType: 'text/plain;charset=utf-8'
}))

function generate(): void {
  try {
    text.value = Array.from({ length: config.value.count }, paragraph).join('\n\n')
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: `已生成 ${config.value.count} 段占位文本` })
  } catch {
    text.value = ''
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', { state: 'error', message: '占位文本生成失败，请重试' })
  }
}

watch(config, () => { generate() })
generate()
</script>

<template>
  <div class="dt-gen">
    <div class="dt-gen__head">
      <span class="dt-gen__label">生成的占位文本</span>
      <button class="dt-gen__button" type="button" @click="generate">🔄 重新生成</button>
    </div>
    <textarea
      class="dt-gen__output"
      :value="text"
      rows="14"
      readonly
      spellcheck="false"
      aria-label="生成的占位文本"></textarea>
    <p class="dt-gen__tip">段落数与语言由工具页上方的选项控制；文本在本地词库中即时组合生成。</p>
  </div>
</template>

<style scoped>
.dt-gen__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-2);
}
.dt-gen__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-gen__button {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px solid var(--dt-primary);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-primary);
  color: var(--dt-primary-contrast);
}
.dt-gen__output {
  width: 100%;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-sans);
  font-size: var(--dt-font-size);
  line-height: 1.8;
  resize: vertical;
}
.dt-gen__tip {
  margin: var(--dt-space-3) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
