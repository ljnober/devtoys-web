<script setup lang="ts">
// 随机数生成器：Web Crypto 安全随机，支持整数与小数两种模式。
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

const config = computed(() => ({
  min: Number(option('min', 0)),
  max: Number(option('max', 100)),
  integer: Boolean(option('integer', true))
}))

function cryptoApi(): Crypto {
  const api = globalThis.crypto
  if (!api || typeof api.getRandomValues !== 'function') {
    throw new Error('当前环境不支持安全随机数，请使用 HTTPS 或本地访问')
  }
  return api
}

/** 32 位安全随机整数，采用拒绝采样消除取模偏差。 */
function secureIndex(max: number): number {
  const buffer = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / max) * max
  let value = 0
  do {
    cryptoApi().getRandomValues(buffer)
    value = buffer[0] ?? 0
  } while (value >= limit)
  return value % max
}

/** 生成 [0, 1) 区间的小数。 */
function secureUnit(): number {
  const buffer = new Uint32Array(1)
  cryptoApi().getRandomValues(buffer)
  return (buffer[0] ?? 0) / 0x100000000
}

const result = computed<ToolResult>(() => ({
  kind: 'text',
  text: text.value,
  filename: 'random-number.txt',
  mimeType: 'text/plain;charset=utf-8'
}))

function fail(message: string): void {
  text.value = ''
  emit('output-change', { kind: 'text', text: '' })
  emit('status-change', { state: 'error', message })
}

function generate(): void {
  const settings = config.value
  if (!Number.isFinite(settings.min) || !Number.isFinite(settings.max)) {
    fail('请输入有效的数值范围')
    return
  }
  if (settings.min > settings.max) {
    fail('最小值不能大于最大值')
    return
  }
  try {
    let value: number
    if (settings.integer) {
      const min = Math.ceil(settings.min)
      const max = Math.floor(settings.max)
      if (min > max) {
        fail('当前范围内没有整数，请调整范围或切换为小数模式')
        return
      }
      const span = max - min + 1
      if (!Number.isSafeInteger(span)) {
        fail('数值范围过大，请缩小范围后重试')
        return
      }
      value = min + secureIndex(span)
    } else {
      value = Number((settings.min + secureUnit() * (settings.max - settings.min)).toFixed(6))
    }
    text.value = String(value)
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: '已生成安全随机数' })
  } catch (error) {
    fail(error instanceof Error ? error.message : '随机数生成失败，请重试')
  }
}

watch(config, () => { generate() })
generate()
</script>

<template>
  <div class="dt-gen">
    <div class="dt-gen__head">
      <span class="dt-gen__label">生成的随机数</span>
      <button class="dt-gen__button" type="button" @click="generate">🎯 生成一次</button>
    </div>
    <div class="dt-gen__output" aria-label="生成的随机数">{{ text || '—' }}</div>
    <p class="dt-gen__tip">范围与「仅整数」选项在工具页上方设置；每次点击都使用新的安全随机字节。</p>
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
  min-height: 120px;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-wrap: anywhere;
}
.dt-gen__tip {
  margin: var(--dt-space-3) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
