<script setup lang="ts">
// 语音生成进度面板：阶段步骤条 + 下载百分比 + 分句计数 + 已生成时长 + 取消。
// 纯展示组件，状态由父组件持有；空闲时整块隐藏，不占版面。
import { computed } from 'vue'

export type TtsStage = 'download' | 'engine' | 'analyze' | 'synthesize' | 'done'

const props = defineProps<{
  /** 当前阶段。idle 时由父组件隐藏整个面板。 */
  stage: TtsStage | null
  /** download 阶段：0–100 百分比；其他阶段忽略。 */
  percent?: number
  /** synthesize 阶段：当前句序号（从 1 起）。 */
  sentenceIndex?: number
  /** synthesize 阶段：总句数。 */
  sentenceTotal?: number
  /** 已合成音频秒数。 */
  synthesizedSeconds?: number
  /** 阶段内的补充说明，例如「HF 镜像加载失败，正在尝试备用源」。 */
  detail?: string
  /** 是否处于可取消状态。 */
  cancellable?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const STAGES: Array<{ id: TtsStage; label: string }> = [
  { id: 'download', label: '下载模型' },
  { id: 'engine', label: '准备引擎' },
  { id: 'analyze', label: '分析文本' },
  { id: 'synthesize', label: '合成语音' },
  { id: 'done', label: '完成' }
]

const stageOrder: Record<TtsStage, number> = {
  download: 0,
  engine: 1,
  analyze: 2,
  synthesize: 3,
  done: 4
}

const activeOrder = computed(() => (props.stage ? stageOrder[props.stage] : -1))

function stageState(id: TtsStage): 'done' | 'active' | 'pending' {
  if (activeOrder.value < 0) return 'pending'
  const order = stageOrder[id]
  if (order < activeOrder.value) return 'done'
  if (order === activeOrder.value) return 'active'
  return 'pending'
}

const percentLabel = computed(() => {
  const value = Math.round(props.percent ?? 0)
  return `${Math.min(100, Math.max(0, value))}%`
})

/** 不确定时长的阶段（引擎/分析）用流动光效而不是百分比。 */
const isIndeterminate = computed(() =>
  props.stage === 'engine' || (props.stage === 'analyze')
)

const showBar = computed(() =>
  props.stage === 'download' || props.stage === 'synthesize' || isIndeterminate.value
)

const summary = computed(() => {
  if (props.stage === 'download') {
    return props.detail || '首次使用会下载模型并缓存到浏览器'
  }
  if (props.stage === 'synthesize') {
    const parts: string[] = []
    if (props.sentenceTotal && props.sentenceTotal > 0) {
      parts.push(`第 ${Math.max(1, props.sentenceIndex ?? 1)} / ${props.sentenceTotal} 句`)
    }
    if (props.synthesizedSeconds !== undefined && props.synthesizedSeconds > 0) {
      parts.push(`已生成 ${props.synthesizedSeconds.toFixed(1)} 秒`)
    }
    if (props.detail) parts.push(props.detail)
    return parts.join(' · ') || '正在逐句合成'
  }
  return props.detail || ''
})
</script>

<template>
  <div v-if="stage" class="dt-progress" role="status" aria-live="polite">
    <ol class="dt-progress__steps">
      <li
        v-for="item in STAGES"
        :key="item.id"
        class="dt-progress__step"
        :data-state="stageState(item.id)">
        <span class="dt-progress__dot" aria-hidden="true"></span>
        <span class="dt-progress__label">{{ item.label }}</span>
      </li>
    </ol>

    <div v-if="showBar" class="dt-progress__track">
      <div
        class="dt-progress__fill"
        :class="{ 'dt-progress__fill--indeterminate': isIndeterminate }"
        :style="isIndeterminate ? undefined : { width: stage === 'download' ? percentLabel : ((sentenceIndex ?? 0) / Math.max(1, sentenceTotal ?? 1) * 100).toFixed(1) + '%' }"></div>
    </div>
    <div class="dt-progress__meta">
      <span class="dt-progress__summary">{{ summary }}</span>
      <button
        v-if="cancellable"
        class="dt-progress__cancel"
        type="button"
        @click="emit('cancel')">取消</button>
    </div>
  </div>
</template>

<style scoped>
.dt-progress {
  margin-top: var(--dt-space-3);
  padding: var(--dt-space-3) var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-code-bg);
}
.dt-progress__steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2) var(--dt-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.dt-progress__step {
  display: flex;
  align-items: center;
  gap: var(--dt-space-1);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-progress__step[data-state='done'] {
  color: var(--dt-success);
}
.dt-progress__step[data-state='done'] .dt-progress__dot::after {
  content: '✓';
  color: var(--dt-success);
  font-size: 10px;
}
.dt-progress__step[data-state='active'] {
  color: var(--dt-primary);
  font-weight: 600;
}
.dt-progress__dot {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.dt-progress__step[data-state='active'] .dt-progress__dot {
  animation: dt-progress-pulse 1.2s ease-in-out infinite;
}
@keyframes dt-progress-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35); }
  50% { box-shadow: 0 0 0 5px rgba(37, 99, 235, 0); }
}
.dt-progress__track {
  margin-top: var(--dt-space-3);
  height: 6px;
  border-radius: var(--dt-radius-pill);
  background: var(--dt-border);
  overflow: hidden;
}
.dt-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--dt-primary);
  transition: width 0.25s ease-out;
}
.dt-progress__fill--indeterminate {
  width: 40%;
  animation: dt-progress-slide 1.4s ease-in-out infinite;
}
@keyframes dt-progress-slide {
  0% { margin-left: -40%; }
  100% { margin-left: 100%; }
}
.dt-progress__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  margin-top: var(--dt-space-2);
}
.dt-progress__summary {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-progress__cancel {
  min-height: 32px;
  padding: 0 var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  color: var(--dt-danger);
  font-size: var(--dt-font-size-sm);
  cursor: pointer;
}
.dt-progress__cancel:hover {
  border-color: var(--dt-danger);
}
</style>
