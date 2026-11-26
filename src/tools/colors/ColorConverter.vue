<script setup lang="ts">
// 基于 HeHang0/devtoys:src/views/color.vue 移植（MIT）：保留 HEX/HSV 等格式互转与预览思路，
// 移除 @simonwep/pickr 外部依赖，改为原生取色输入 + 自研转换函数。
import { computed, ref, watch } from 'vue'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'
import {
  hslToRgb,
  hsvToRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToHsv
} from '@/utils/color'
import type { RgbColor } from '@/utils/color'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()

const rgb = ref<RgbColor>({ r: 255, g: 0, b: 0 })
const rgbChannels: Array<'r' | 'g' | 'b'> = ['r', 'g', 'b']
const hslChannels: Array<'h' | 's' | 'l'> = ['h', 's', 'l']
const hsvChannels: Array<'h' | 's' | 'v'> = ['h', 's', 'v']
const hexInput = ref('#ff0000')
const hsl = computed(() => rgbToHsl(rgb.value))
const hsv = computed(() => rgbToHsv(rgb.value))
const hex = computed<string>(() => rgbToHex(rgb.value))

/** 数值输入事件统一读取 input.value。 */
function readNumber(event: Event): number {
  return Number((event.target as HTMLInputElement).value)
}

/** HEX / RGB / HSL / HSV 输入都归一到同一个 RGB 状态。 */
function setRgb(next: RgbColor): void {
  rgb.value = next
  emit('status-change', { state: 'success', message: '颜色转换完成' })
}

/** 手动输入 HEX 或其他 CSS 颜色字符串。 */
function onColorTextInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  const parsed = parseColor(value)
  if (parsed) {
    setRgb(parsed)
  } else {
    emit('status-change', { state: 'error', message: '颜色格式无效，请输入 #RRGGBB、rgb(...) 或 hsl(...)' })
  }
}

/** 原生取色器变化。 */
function onNativeColor(event: Event): void {
  const parsed = parseColor((event.target as HTMLInputElement).value)
  if (parsed) {
    setRgb(parsed)
  }
}

/** RGB 单通道变化。 */
function onRgbChannel(channel: 'r' | 'g' | 'b', event: Event): void {
  setRgb({ ...rgb.value, [channel]: readNumber(event) })
}

/** HSL 单分量变化。 */
function onHslChannel(channel: 'h' | 's' | 'l', event: Event): void {
  setRgb(hslToRgb({ ...hsl.value, [channel]: readNumber(event) }))
}

/** HSV 单分量变化。 */
function onHsvChannel(channel: 'h' | 's' | 'v', event: Event): void {
  setRgb(hsvToRgb({ ...hsv.value, [channel]: readNumber(event) }))
}

/** 同步 HEX 输入框，仅在用户未输入非法值时覆盖。 */
watch(hex, value => {
  const parsed = parseColor(hexInput.value)
  if (parsed) {
    hexInput.value = value
  }
}, { immediate: true })

const output = computed<ToolResult>(() => ({
  kind: 'text',
  text: [
    `HEX：${hex.value.toUpperCase()}`,
    `RGB：rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`,
    `HSL：hsl(${Math.round(hsl.value.h)}, ${Math.round(hsl.value.s)}%, ${Math.round(hsl.value.l)}%)`,
    `HSV：hsv(${Math.round(hsv.value.h)}, ${Math.round(hsv.value.s)}%, ${Math.round(hsv.value.v)}%)`
  ].join('\n')
}))

watch(output, next => emit('output-change', next), { immediate: true })

async function onCopy(): Promise<void> {
  await props.actions.copy(output.value.text ?? '')
}
</script>

<template>
  <div class="dt-color">
    <div class="dt-color__top">
      <div class="dt-color__swatch" :style="{ backgroundColor: hex }">
        颜色预览
      </div>
      <div class="dt-color__fields">
        <label class="dt-control dt-control--grow">
          <span>HEX / CSS 颜色</span>
          <input :value="hexInput" type="text" spellcheck="false" @input="onColorTextInput" />
        </label>
        <label class="dt-control">
          <span>取色器</span>
          <input type="color" :value="hex" @input="onNativeColor" />
        </label>
      </div>
    </div>

    <div class="dt-color__grid">
      <section class="dt-color__group">
        <h2>RGB（0-255）</h2>
        <label v-for="channel in rgbChannels" :key="channel" class="dt-control">
          <span>{{ channel.toUpperCase() }}</span>
          <input type="number" min="0" max="255" :value="rgb[channel]"
            @input="onRgbChannel(channel, $event)" />
        </label>
      </section>
      <section class="dt-color__group">
        <h2>HSL</h2>
        <label v-for="channel in hslChannels" :key="channel" class="dt-control">
          <span>{{ channel.toUpperCase() }}</span>
          <input type="number" :value="Math.round(hsl[channel])"
            @input="onHslChannel(channel, $event)" />
        </label>
      </section>
      <section class="dt-color__group">
        <h2>HSV</h2>
        <label v-for="channel in hsvChannels" :key="channel" class="dt-control">
          <span>{{ channel.toUpperCase() }}</span>
          <input type="number" :value="Math.round(hsv[channel])"
            @input="onHsvChannel(channel, $event)" />
        </label>
      </section>
    </div>

    <div class="dt-color__result">
      <pre>{{ output.text }}</pre>
      <button class="dt-button" type="button" @click="onCopy">📋 复制全部格式</button>
    </div>
  </div>
</template>

<style scoped>
.dt-color__top {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  align-items: stretch;
  margin-bottom: var(--dt-space-4);
}
.dt-color__swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  min-height: 96px;
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  color: var(--dt-primary-contrast);
  font-weight: 600;
}
.dt-color__fields {
  display: flex;
  flex: 1 1 260px;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--dt-space-3);
}
.dt-control {
  display: grid;
  gap: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-control--grow {
  flex: 1 1 180px;
}
.dt-control input[type='text'],
.dt-control input[type='number'] {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-control input[type='color'] {
  width: 100%;
  height: var(--dt-touch-target);
  padding: 2px;
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
}
.dt-color__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--dt-space-3);
}
.dt-color__group {
  display: grid;
  gap: var(--dt-space-2);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-color__group h2 {
  margin: 0;
  font-size: var(--dt-font-size);
}
.dt-color__result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  margin-top: var(--dt-space-4);
}
.dt-color__result pre {
  margin: 0;
  padding: var(--dt-space-3);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
  white-space: pre-wrap;
}
</style>
