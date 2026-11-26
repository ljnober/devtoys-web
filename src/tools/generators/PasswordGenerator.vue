<script setup lang="ts">
// 密码生成器：Web Crypto 安全随机 + 字符集约束，全部本地完成。
import { computed, inject, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'

defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{}:,.?/'

const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)
const text = ref('')

function option(key: string, fallback: string | number | boolean): string | number | boolean {
  const value = injectedOptions?.value?.[key]
  return value === undefined ? fallback : value
}

const config = computed(() => ({
  length: clamp(Number(option('length', 16)), 4, 128),
  uppercase: Boolean(option('uppercase', true)),
  lowercase: Boolean(option('lowercase', true)),
  digits: Boolean(option('digits', true)),
  symbols: Boolean(option('symbols', false))
}))

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min
  }
  return Math.min(max, Math.max(min, Math.trunc(value)))
}

/** 拒绝采样，避免对 2^32 取模带来的分布偏差。 */
function secureIndex(max: number): number {
  if (max <= 0) {
    return 0
  }
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('当前环境不支持安全随机数，请使用 HTTPS 或本地访问')
  }
  const buffer = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / max) * max
  let value = 0
  do {
    cryptoApi.getRandomValues(buffer)
    value = buffer[0] ?? 0
  } while (value >= limit)
  return value % max
}

function pick(source: string): string {
  return source[secureIndex(source.length)] ?? ''
}

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: text.value,
  filename: 'password.txt',
  mimeType: 'text/plain;charset=utf-8'
}))

function fail(message: string): void {
  text.value = ''
  emit('output-change', { kind: 'text', text: '' })
  emit('status-change', { state: 'error', message })
}

function generate(): void {
  const settings = config.value
  const sets: string[] = []
  if (settings.uppercase) sets.push(UPPER)
  if (settings.lowercase) sets.push(LOWER)
  if (settings.digits) sets.push(DIGITS)
  if (settings.symbols) sets.push(SYMBOLS)

  if (sets.length === 0) {
    fail('请至少选择一种字符类型')
    return
  }
  try {
    const all = sets.join('')
    // 先保证每个勾选的字符集至少出现一次，再随机填充剩余长度。
    const chars = sets.map(pick)
    while (chars.length < settings.length) {
      chars.push(pick(all))
    }
    for (let index = chars.length - 1; index > 0; index -= 1) {
      const target = secureIndex(index + 1)
      const temp = chars[index] ?? ''
      chars[index] = chars[target] ?? ''
      chars[target] = temp
    }
    text.value = chars.slice(0, settings.length).join('')
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: `已生成 ${settings.length} 位随机密码` })
  } catch (error) {
    fail(error instanceof Error ? error.message : '密码生成失败，请重试')
  }
}

watch(config, () => { generate() })
generate()
</script>

<template>
  <div class="dt-gen">
    <div class="dt-gen__head">
      <span class="dt-gen__label">生成的密码</span>
      <button class="dt-gen__button" type="button" @click="generate">🔄 重新生成</button>
    </div>
    <textarea
      class="dt-gen__output"
      :value="text"
      rows="5"
      readonly
      spellcheck="false"
      aria-label="生成的密码"></textarea>
    <p class="dt-gen__tip">长度与字符类型由工具页上方的选项控制；随机数来自浏览器 Web Crypto，不上传任何数据。</p>
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
  font-size: var(--dt-font-size-lg);
  line-height: 1.6;
  overflow-wrap: anywhere;
  resize: vertical;
}
.dt-gen__tip {
  margin: var(--dt-space-3) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
