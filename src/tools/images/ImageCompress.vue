<script setup lang="ts">
// 图片压缩：Canvas 重编码 + 逐级质量/尺寸回退，全部在浏览器本地完成，零网络请求。
import { computed, inject, onUnmounted, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>

const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)
const quality = computed<number>(() => {
  const raw = Number(injectedOptions?.value?.quality ?? 0.8)
  if (!Number.isFinite(raw)) {
    return 0.8
  }
  return Math.min(1, Math.max(0.05, raw))
})

const sourceFile = ref<File | null>(null)
const sourceUrl = ref('')
const outputUrl = ref('')
const outputBlob = ref<Blob | null>(null)
const sourceName = ref('')
const sourceSize = ref(0)
const outputSize = ref(0)
const busy = ref(false)
const note = ref('')

const result = computed<ToolResult>(() => ({
  kind: 'blob',
  blob: outputBlob.value ?? undefined,
  filename: `${sourceName.value || props.toolId}_compressed.jpg`,
  mimeType: 'image/jpeg'
}))

const ratio = computed<string>(() => {
  if (!sourceSize.value || !outputSize.value) {
    return '—'
  }
  return `${((1 - outputSize.value / sourceSize.value) * 100).toFixed(1)}%`
})

function readableSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function emitError(message: string): void {
  emit('output-change', { kind: 'text', text: '' })
  emit('status-change', { state: 'error', message })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => { resolve(image) }
    image.onerror = () => { reject(new Error('图片加载失败，请更换文件后重试')) }
    image.src = url
  })
}

/** 按给定质量与缩放比例重编码，JPEG 透明区域用主题令牌色铺底。 */
function encode(image: HTMLImageElement, targetQuality: number, scale: number): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    return Promise.reject(new Error('当前浏览器不支持 Canvas 2D'))
  }
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--dt-card-bg')
    .trim()
  if (color) {
    context.fillStyle = color
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      item => item ? resolve(item) : reject(new Error('图片导出失败，请重试')),
      'image/jpeg',
      targetQuality
    )
  })
}

async function compress(): Promise<void> {
  if (!sourceUrl.value || !sourceFile.value) {
    return
  }
  busy.value = true
  note.value = ''
  emit('status-change', { state: 'processing' })
  try {
    const image = await loadImage(sourceUrl.value)
    const qualities = Array.from(new Set([
      quality.value,
      Math.max(0.15, Number((quality.value - 0.2).toFixed(2))),
      0.35
    ]))
    let smallest: Blob | null = null
    for (const scale of [1, 0.85, 0.7]) {
      for (const value of qualities) {
        const blob = await encode(image, value, scale)
        if (!smallest || blob.size < smallest.size) {
          smallest = blob
        }
        if (blob.size < sourceFile.value.size * 0.9) {
          break
        }
      }
      if (smallest && smallest.size < sourceFile.value.size * 0.9) {
        break
      }
    }
    if (!smallest) {
      throw new Error('图片压缩失败，请重试')
    }
    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
    }
    outputBlob.value = smallest
    outputSize.value = smallest.size
    outputUrl.value = URL.createObjectURL(smallest)
    note.value = smallest.size < sourceFile.value.size
      ? '压缩完成，未上传任何数据。'
      : '已选择重编码后体积最小的结果；原图本身较小，建议换用更大的图片。'
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: '图片压缩完成' })
  } catch (error) {
    outputBlob.value = null
    outputSize.value = 0
    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = ''
    }
    emitError(error instanceof Error ? error.message : '图片压缩失败，请重试')
  } finally {
    busy.value = false
  }
}

function onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) {
    return
  }
  if (!file.type.startsWith('image/')) {
    emitError('请选择图片文件')
    return
  }
  if (file.size > 20 * 1024 * 1024) {
    emitError('图片超过 20 MB，请选择更小的文件')
    return
  }
  if (sourceUrl.value) {
    URL.revokeObjectURL(sourceUrl.value)
  }
  sourceFile.value = file
  sourceName.value = file.name.replace(/\.[^.]+$/, '')
  sourceSize.value = file.size
  sourceUrl.value = URL.createObjectURL(file)
  void compress()
}

watch(quality, () => { void compress() })
onUnmounted(() => {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
})

function onDownload(): void {
  if (!outputBlob.value) {
    emitError('请先选择图片并等待压缩完成')
    return
  }
  props.actions.download(result.value, result.value.filename)
}
</script>

<template>
  <div class="dt-image">
    <label class="dt-image__upload">
      <input type="file" accept="image/*" @change="onFileChange" />
      <span>选择本地图片（20 MB 以内）</span>
    </label>

    <div class="dt-image__body">
      <figure class="dt-image__figure">
        <figcaption>原图</figcaption>
        <img v-if="sourceUrl" :src="sourceUrl" alt="原图预览" />
        <p v-else class="dt-image__placeholder">尚未选择图片</p>
      </figure>
      <figure class="dt-image__figure">
        <figcaption>压缩结果</figcaption>
        <img v-if="outputUrl" :src="outputUrl" alt="压缩结果预览" />
        <p v-else class="dt-image__placeholder">压缩结果将显示在这里</p>
      </figure>
    </div>

    <div class="dt-image__stats">
      <span>原图 {{ readableSize(sourceSize) }}</span>
      <span>压缩后 {{ outputBlob ? readableSize(outputSize) : '—' }}</span>
      <span>减少 {{ ratio }}</span>
      <span v-if="busy">正在压缩…</span>
    </div>
    <p class="dt-image__note">{{ note || '压缩质量由工具页上方的选项控制；处理全程在本地完成。' }}</p>

    <button class="dt-image__button" type="button" :disabled="!outputBlob" @click="onDownload">
      ⬇️ 下载压缩结果
    </button>
  </div>
</template>

<style scoped>
.dt-image__upload {
  display: inline-flex;
  align-items: center;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px dashed var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-fg);
  cursor: pointer;
}
.dt-image__upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.dt-image__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
  margin-top: var(--dt-space-4);
}
.dt-image__figure {
  min-width: 0;
  margin: 0;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-code-bg);
  text-align: center;
}
.dt-image__figure figcaption {
  margin-bottom: var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-image__figure img {
  display: block;
  max-width: 100%;
  max-height: 320px;
  margin: 0 auto;
}
.dt-image__placeholder {
  min-height: 160px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-image__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  margin: var(--dt-space-4) 0 var(--dt-space-2);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-image__note {
  margin: 0 0 var(--dt-space-3);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-image__button {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px solid var(--dt-primary);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-primary);
  color: var(--dt-primary-contrast);
}
.dt-image__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
@media (max-width: 768px) {
  .dt-image__body {
    grid-template-columns: 1fr;
  }
}
</style>
