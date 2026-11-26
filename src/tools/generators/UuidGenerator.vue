<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/uuid.vue 移植（MIT）：改用 Web Crypto 生成标准 v4 UUID。
import { computed, inject, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>

const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)
const text = ref('')

function option(key: string, fallback: string | number | boolean): string | number | boolean {
  const value = injectedOptions?.value?.[key]
  return value === undefined ? fallback : value
}

const count = computed<number>(() => {
  const raw = Number(option('count', 1))
  if (!Number.isFinite(raw)) {
    return 1
  }
  return Math.min(1000, Math.max(1, Math.trunc(raw)))
})

/** 按 RFC 4122 设置版本位（4）与变体位（10xx）。 */
function uuidV4(): string {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('当前环境不支持安全随机数，请使用 HTTPS 或本地访问')
  }
  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: text.value,
  filename: 'uuid.txt',
  mimeType: 'text/plain;charset=utf-8'
}))

function generate(): void {
  try {
    const values: string[] = []
    for (let index = 0; index < count.value; index += 1) {
      values.push(uuidV4())
    }
    text.value = values.join('\n')
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: `已生成 ${count.value} 个 UUID v4` })
  } catch (error) {
    text.value = ''
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', {
      state: 'error',
      message: error instanceof Error ? error.message : 'UUID 生成失败，请重试'
    })
  }
}

watch(count, () => { generate() })
generate()
</script>

<template>
  <div class="dt-gen">
    <div class="dt-gen__head">
      <span class="dt-gen__label">生成的 UUID v4</span>
      <button class="dt-gen__button" type="button" @click="generate">🔄 重新生成</button>
    </div>
    <textarea
      class="dt-gen__output"
      :value="text"
      rows="10"
      readonly
      spellcheck="false"
      aria-label="生成的 UUID 列表"></textarea>
    <p class="dt-gen__tip">生成数量由工具页上方的选项控制，每行一个；全部由浏览器本地安全随机数生成。</p>
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
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  line-height: 1.6;
  resize: vertical;
}
.dt-gen__tip {
  margin: var(--dt-space-3) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
