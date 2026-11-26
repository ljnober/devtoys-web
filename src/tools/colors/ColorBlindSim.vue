<script setup lang="ts">
// 色盲模拟器：Canvas 2D 读取本地图片像素并应用颜色矩阵，结果以 Blob 输出，零网络请求。
import { computed, inject, isRef, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { COLOR_BLIND_MATRICES } from '@/utils/color'
import type { ColorBlindType } from '@/utils/color'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

type ToolOptions = Record<string, string | number | boolean>

const injected = inject<Ref<ToolOptions> | ToolOptions | null>('devtoys:toolOptions', null)
const blindType = computed<ColorBlindType>(() => {
  const values = injected ? (isRef(injected) ? injected.value : injected) : null
  const raw = String(values?.type ?? 'deuteranopia')
  return raw === 'protanopia' || raw === 'tritanopia' ? raw : 'deuteranopia'
})

const sourceDataUrl = ref('')
const previewDataUrl = ref('')
const fileName = ref('')
const originalSize = ref('')
const result = ref<ToolResult>({ kind: 'text', text: '' })
const fileInput = ref<HTMLInputElement | null>(null)

/** 读取本地图片文件，数据只存在于浏览器内存中。 */
function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files.length ? input.files[0] : null
  if (!file) {
    return
  }
  if (!file.type.startsWith('image/')) {
    emit('status-change', { state: 'error', message: '请选择图片文件（PNG / JPEG / WebP 等）' })
    return
  }
  fileName.value = file.name
  originalSize.value = `${(file.size / 1024).toFixed(1)} KB`
  const reader = new FileReader()
  reader.onload = () => {
    sourceDataUrl.value = String(reader.result ?? '')
    render()
  }
  reader.onerror = () => {
    emit('status-change', { state: 'error', message: '图片读取失败，请重新选择文件' })
  }
  reader.readAsDataURL(file)
}

/** 把矩阵结果限制在 0-255。 */
function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

/** 用颜色矩阵重绘图片并导出 PNG Blob。 */
function render(): void {
  if (!sourceDataUrl.value) {
    return
  }
  emit('status-change', { state: 'processing' })
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height
    const context = canvas.getContext('2d')
    if (!context) {
      emit('status-change', { state: 'error', message: '当前浏览器不支持 Canvas 图像处理' })
      return
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const frame = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = frame.data
    const matrix = COLOR_BLIND_MATRICES[blindType.value]
    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      pixels[index] = clampByte(matrix[0] * red + matrix[1] * green + matrix[2] * blue)
      pixels[index + 1] = clampByte(matrix[3] * red + matrix[4] * green + matrix[5] * blue)
      pixels[index + 2] = clampByte(matrix[6] * red + matrix[7] * green + matrix[8] * blue)
    }
    context.putImageData(frame, 0, 0)
    previewDataUrl.value = canvas.toDataURL('image/png')

    canvas.toBlob(blob => {
      if (!blob) {
        emit('status-change', { state: 'error', message: '图片导出失败，请重试' })
        return
      }
      result.value = {
        kind: 'blob',
        blob,
        filename: `color-blind-${blindType.value}.png`,
        mimeType: 'image/png'
      }
      emit('output-change', result.value)
      emit('status-change', { state: 'success', message: '模拟完成，可下载结果图片' })
    }, 'image/png')
  }
  image.onerror = () => {
    emit('status-change', { state: 'error', message: '图片加载失败，请重新选择文件' })
  }
  image.src = sourceDataUrl.value
}

/** 类型切换时重算预览。 */
watch(blindType, () => { void render() })

/** 下载走冻结契约的 actions，不直接创建链接。 */
function onDownload(): void {
  if (result.value.kind === 'blob') {
    props.actions.download(result.value)
  }
}

/** 清空本地预览与上传控件。 */
function onReset(): void {
  sourceDataUrl.value = ''
  previewDataUrl.value = ''
  fileName.value = ''
  originalSize.value = ''
  result.value = { kind: 'text', text: '' }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('output-change', result.value)
  emit('status-change', { state: 'idle' })
}

onUnmounted(() => {
  sourceDataUrl.value = ''
  previewDataUrl.value = ''
})

emit('output-change', result.value)
emit('status-change', { state: 'idle' })
</script>

<template>
  <div class="dt-blind">
    <div class="dt-blind__controls">
      <label class="dt-control dt-control--grow">
        <span>选择本地图片</span>
        <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" />
      </label>
      <button class="dt-button" type="button" :disabled="!sourceDataUrl" @click="onDownload">
        ⬇️ 下载模拟结果
      </button>
      <button class="dt-button" type="button" :disabled="!sourceDataUrl" @click="onReset">
        🧹 清空图片
      </button>
    </div>

    <p class="dt-blind__note">
      当前模拟类型：{{ blindType === 'protanopia' ? '红色盲' : blindType === 'tritanopia' ? '蓝色盲' : '绿色盲' }}
      （由工具选项控制），图片只在浏览器本地处理。
    </p>
    <p v-if="fileName" class="dt-blind__file">{{ fileName }} · {{ originalSize }}</p>

    <div class="dt-blind__grid">
      <figure class="dt-blind__figure">
        <figcaption>原图</figcaption>
        <img v-if="sourceDataUrl" :src="sourceDataUrl" alt="原始图片预览" />
        <p v-else class="dt-blind__empty">请选择一张本地图片</p>
      </figure>
      <figure class="dt-blind__figure">
        <figcaption>模拟结果</figcaption>
        <img v-if="previewDataUrl" :src="previewDataUrl" alt="色盲模拟结果预览" />
        <p v-else class="dt-blind__empty">模拟结果将显示在这里</p>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.dt-blind__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
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
.dt-control input[type='file'] {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-blind__note,
.dt-blind__file {
  margin: var(--dt-space-2) 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-blind__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-4);
  margin-top: var(--dt-space-3);
}
.dt-blind__figure {
  margin: 0;
  min-width: 0;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-blind__figure figcaption {
  margin-bottom: var(--dt-space-2);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-blind__figure img {
  display: block;
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
}
.dt-blind__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  margin: 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
@media (max-width: 768px) {
  .dt-blind__grid {
    grid-template-columns: 1fr;
  }
}
</style>
