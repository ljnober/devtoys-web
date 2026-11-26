<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/hash.vue 与 checksum.vue 移植（MIT）
import CryptoJS from 'crypto-js'
import { computed, inject, onUnmounted, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'
import IoPanel from '@/components/IoPanel.vue'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>
type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

const ALGORITHMS: readonly Algorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']
const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)

const input = ref('')
const digests = ref<Record<Algorithm, string>>(emptyDigests())

function emptyDigests(): Record<Algorithm, string> {
  return { 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' }
}

/** 主结果跟随 OptionBar 的「算法」选项，组件内不硬编码工具 id。 */
const algorithm = computed<Algorithm>(() => {
  const value = injectedOptions?.value?.algorithm
  return ALGORITHMS.includes(value as Algorithm) ? (value as Algorithm) : 'SHA-256'
})

const primaryResult = computed<ToolResult>(() => ({
  kind: 'text',
  text: digests.value[algorithm.value] ?? '',
  filename: `hash-${algorithm.value.toLowerCase()}.txt`,
  mimeType: 'text/plain;charset=utf-8'
}))

function hashText(value: string, target: Algorithm): string {
  switch (target) {
    case 'MD5': return CryptoJS.MD5(value).toString()
    case 'SHA-1': return CryptoJS.SHA1(value).toString()
    case 'SHA-256': return CryptoJS.SHA256(value).toString()
    case 'SHA-512': return CryptoJS.SHA512(value).toString()
  }
}

function publish(): void {
  emit('output-change', primaryResult.value)
  emit('status-change', { state: 'success', message: `已生成 ${algorithm.value} 摘要` })
}

function recompute(): void {
  if (!input.value) {
    digests.value = emptyDigests()
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', { state: 'idle' })
    return
  }
  try {
    const next = emptyDigests()
    ALGORITHMS.forEach(target => { next[target] = hashText(input.value, target) })
    digests.value = next
    publish()
  } catch {
    digests.value = emptyDigests()
    emit('output-change', { kind: 'text', text: '' })
    emit('status-change', { state: 'error', message: '摘要计算失败，请缩短输入后重试' })
  }
}

watch(input, () => { recompute() }, { immediate: true })
watch(algorithm, () => {
  const text = digests.value[algorithm.value] ?? ''
  if (text) {
    publish()
  }
})

interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}
const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
const stopSwap = swapBus?.onSwap((text: string) => { input.value = text }) ?? null
onUnmounted(() => { stopSwap?.() })

async function copyDigest(value: string): Promise<void> {
  if (value) {
    await props.actions.copy(value, '摘要')
  }
}
</script>

<template>
  <div class="dt-hash">
    <IoPanel
      :model-value="input"
      :output="primaryResult"
      input-label="待处理文本"
      output-label="当前算法摘要"
      placeholder="请输入需要生成摘要的文本，所有计算均在本地完成"
      @update:model-value="input = $event" />
    <p class="dt-hash__tip">选择工具页上方的「算法」选项，可切换复制与下载使用的主摘要。</p>

    <div class="dt-hash__grid">
      <section v-for="target in ALGORITHMS" :key="target" class="dt-hash__card">
        <header class="dt-hash__card-head">
          <strong>{{ target }}</strong>
          <button
            class="dt-hash__copy"
            type="button"
            :disabled="!digests[target]"
            @click="copyDigest(digests[target])">
            复制
          </button>
        </header>
        <code class="dt-hash__value">{{ digests[target] || '等待输入' }}</code>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dt-hash__tip {
  margin: var(--dt-space-3) 0 var(--dt-space-4);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-hash__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-3);
}
.dt-hash__card {
  min-width: 0;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-hash__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-2);
}
.dt-hash__copy {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-1) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-hash__copy:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.dt-hash__value {
  display: block;
  overflow-wrap: anywhere;
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  line-height: 1.6;
}
@media (max-width: 768px) {
  .dt-hash__grid {
    grid-template-columns: 1fr;
  }
}
</style>
