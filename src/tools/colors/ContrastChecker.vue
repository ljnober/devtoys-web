<script setup lang="ts">
// WCAG 2.1 对比度计算器：相对亮度与 4.5:1 / 3:1 / 7:1 阈值判定全部本地计算。
import { computed, ref, watch } from 'vue'
import { contrastRatio, evaluateWcag, parseColor } from '@/utils/color'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const foregroundText = ref('#000000')
const backgroundText = ref('#ffffff')

interface ContrastState {
  ratio: number
  error: string
}

const state = computed<ContrastState>(() => {
  const fg = parseColor(foregroundText.value)
  const bg = parseColor(backgroundText.value)
  if (!fg || !bg) {
    return { ratio: 0, error: '颜色格式无效，请输入 #RRGGBB、rgb(...) 或 hsl(...)' }
  }
  return { ratio: contrastRatio(fg, bg), error: '' }
})

const wcag = computed(() => evaluateWcag(state.value.ratio))

const output = computed<ToolResult>(() => {
  if (state.value.error) {
    return { kind: 'text', text: '' }
  }
  const ratio = state.value.ratio.toFixed(2)
  return {
    kind: 'text',
    text: [
      `前景色：${foregroundText.value}`,
      `背景色：${backgroundText.value}`,
      `对比度：${ratio} : 1`,
      `AA 正文（4.5:1）：${wcag.value.aaNormal ? '通过' : '未通过'}`,
      `AA 大字号（3:1）：${wcag.value.aaLarge ? '通过' : '未通过'}`,
      `AAA 正文（7:1）：${wcag.value.aaaNormal ? '通过' : '未通过'}`,
      `AAA 大字号（4.5:1）：${wcag.value.aaaLarge ? '通过' : '未通过'}`
    ].join('\n')
  }
})

watch([foregroundText, backgroundText], () => {
  emit('output-change', output.value)
  if (state.value.error) {
    emit('status-change', { state: 'error', message: state.value.error })
  } else {
    emit('status-change', {
      state: 'success',
      message: `对比度 ${state.value.ratio.toFixed(2)}:1，AA 正文${wcag.value.aaNormal ? '通过' : '未通过'}`
    })
  }
}, { immediate: true })

function onNativeColor(target: 'foreground' | 'background', event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (target === 'foreground') {
    foregroundText.value = value
  } else {
    backgroundText.value = value
  }
}

/** 判定标签的展示类名。 */
function levelClass(passed: boolean): string {
  return passed ? 'is-pass' : 'is-fail'
}
</script>

<template>
  <div class="dt-contrast">
    <div class="dt-contrast__inputs">
      <label class="dt-control dt-control--grow">
        <span>前景色（文字）</span>
        <input v-model="foregroundText" type="text" spellcheck="false" />
      </label>
      <label class="dt-control">
        <span>取色器</span>
        <input type="color" :value="foregroundText" @input="onNativeColor('foreground', $event)" />
      </label>
      <label class="dt-control dt-control--grow">
        <span>背景色</span>
        <input v-model="backgroundText" type="text" spellcheck="false" />
      </label>
      <label class="dt-control">
        <span>取色器</span>
        <input type="color" :value="backgroundText" @input="onNativeColor('background', $event)" />
      </label>
    </div>

    <p v-if="state.error" class="dt-contrast__error">{{ state.error }}</p>

    <template v-if="!state.error">
      <div class="dt-contrast__ratio">
        <span class="dt-contrast__number">{{ state.ratio.toFixed(2) }}</span>
        <span class="dt-contrast__unit">: 1</span>
      </div>
      <div class="dt-contrast__preview" :style="{ color: foregroundText, backgroundColor: backgroundText }">
        这是对比度预览文字（示例）
      </div>
      <div class="dt-contrast__levels">
        <span :class="levelClass(wcag.aaNormal)">AA 正文 4.5:1 {{ wcag.aaNormal ? '通过' : '未通过' }}</span>
        <span :class="levelClass(wcag.aaLarge)">AA 大字号 3:1 {{ wcag.aaLarge ? '通过' : '未通过' }}</span>
        <span :class="levelClass(wcag.aaaNormal)">AAA 正文 7:1 {{ wcag.aaaNormal ? '通过' : '未通过' }}</span>
        <span :class="levelClass(wcag.aaaLarge)">AAA 大字号 4.5:1 {{ wcag.aaaLarge ? '通过' : '未通过' }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dt-contrast__inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-4);
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
.dt-control input[type='text'] {
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
.dt-contrast__ratio {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-2);
  margin-bottom: var(--dt-space-3);
}
.dt-contrast__number {
  font-size: 40px;
  font-weight: 700;
  color: var(--dt-primary);
}
.dt-contrast__unit {
  color: var(--dt-muted);
}
.dt-contrast__preview {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  font-size: var(--dt-font-size-lg);
}
.dt-contrast__levels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
  margin-top: var(--dt-space-4);
}
.dt-contrast__levels span {
  padding: var(--dt-space-2) var(--dt-space-3);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-code-bg);
  font-size: var(--dt-font-size-sm);
}
.is-pass {
  color: var(--dt-success);
}
.is-fail {
  color: var(--dt-danger);
}
.dt-contrast__error {
  color: var(--dt-danger);
}
</style>
