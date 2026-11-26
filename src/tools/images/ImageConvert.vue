<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/imageconvert.vue 移植（MIT）：Canvas + toBlob 全部本地处理。
import { computed, inject, onUnmounted, ref, watch, type Ref } from 'vue'
import type { ToolViewProps, ToolViewEmits, ToolResult, ToolStatus } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type Options = Record<string, string | number | boolean>
const SUPPORTED = ['image/png', 'image/jpeg', 'image/webp'] as const

const injectedOptions = inject<Ref<Options> | null>('devtoys:toolOptions', null)
const targetFormat = computed<string>(() => {
  const value = injectedOptions?.value?.format
  return typeof value === 'string' && SUPPORTED.includes(value as typeof SUPPORTED[number])
    ? value
    : 'image/jpeg'
})

const sourceFile = ref<File | null>(null)
const sourceUrl = ref('')
const outputUrl = ref('')
const outputBlob = ref<Blob | null>(null)
const sourceName = ref('')
const sourceSize = ref(0)
const outputSize = ref(0)
const busy = ref(false)

const extension = computed<string>(() => {
  if (targetFormat.value === 'image/png') return 'png'
  return targetFormat.value === 'image/webp' ? 'webp' : 'jpg'
})

const filename = computed<string>(() => `${sourceName.value || props.toolId}.${extension.value}`)

const result = computed<ToolResult>(() => ({
  kind: 'blob',
  blob: outputBlob.value ?? undefined,
  filename: filename.value,
  mimeType: targetFormat.value
}))

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

/** 从主题令牌取背景色，避免硬编码颜色；JPEG 无透明通道需先铺底。 */
function fillBackground(context: CanvasRenderingContext2D, width: number, height: number): void {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--dt-card-bg')
    .trim()
  if (color) {
    context.fillStyle = color
    context.fillRect(0, 0, width, height)
  }
}

async function convert(): Promise<void> {
  if (!sourceUrl.value || !sourceFile.value) {
    return
  }
  busy.value = true
  emit('status-change', { state: 'processing' })
  try {
    const image = await loadImage(sourceUrl.value)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, image.naturalWidth)
    canvas.height = Math.max(1, image.naturalHeight)
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('当前浏览器不支持 Canvas 2D')
    }
    if (targetFormat.value === 'image/jpeg') {
      fillBackground(context, canvas.width, canvas.height)
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        item => item ? resolve(item) : reject(new Error('图片导出失败，请重试')),
        targetFormat.value,
        0.92
      )
    })

    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
    }
    outputBlob.value = blob
    outputSize.value = blob.size
    outputUrl.value = URL.createObjectURL(blob)
    emit('output-change', result.value)
    emit('status-change', { state: 'success', message: `已转换为 ${extension.value.toUpperCase()} 格式` })
  } catch (error) {
    outputBlob.value = null
    outputSize.value = 0
    if (outputUrl.value) {
      URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = ''
    }
    emitError(error instanceof Error ? error.message : '图片转换失败，请重试')
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
    emitError('请选择 PNG、JPEG 或 WebP 图片文件')
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
  void convert()
}

watch(targetFormat, () => { void convert() })
onUnmounted(() => {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
})

function onDownload(): void {
  if (!outputBlob.value) {
    emitError('请先选择图片并等待转换完成')
    return
  }
  props.actions.download(result.value, filename.value)
}
</script>

<template>
  <div class="dt-image">
    <label class="dt-image__upload">
      <input type="file" accept="image/png,image/jpeg,image/webp,image/*" @change="onFileChange" />
      <span>选择本地图片（PNG / JPEG / WebP，20 MB 以内）</span>
    </label>

    <div class="dt-image__body">
      <figure class="dt-image__figure">
        <figcaption>原图</figcaption>
        <img v-if="sourceUrl" :src="sourceUrl" alt="原图预览" />
        <p v-else class="dt-image__placeholder">尚未选择图片</p>
      </figure>
      <figure class="dt-image__figure">
        <figcaption>转换结果（{{ extension.toUpperCase() }}）</figcaption>
        <img v-if="outputUrl" :src="outputUrl" alt="转换结果预览" />
        <p v-else class="dt-image__placeholder">转换结果将显示在这里</p>
      </figure>
    </div>

    <p class="dt-image__meta">
      <template v-if="sourceFile">
        原图 {{ readableSize(sourceSize) }} → 结果 {{ outputBlob ? readableSize(outputSize) : '处理中' }}
        <span v-if="busy">（正在转换…）</span>
      </template>
      <template v-else>选择图片后可在上方「目标格式」选项中切换 PNG / JPEG / WebP。</template>
    </p>

    <button class="dt-image__button" type="button" :disabled="!outputBlob" @click="onDownload">
      ⬇️ 下载转换结果
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
.dt-image__meta {
  margin: var(--dt-space-4) 0 var(--dt-space-3);
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
