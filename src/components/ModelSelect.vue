<script setup lang="ts">
// 通用模型选择器：模型清单由 props 注入，不绑定任何具体工具或推理实现。
import { computed } from 'vue'
import type { TtsModelDefinition } from '@/data/ttsModels'

const props = withDefaults(defineProps<{
  modelValue: string
  models: TtsModelDefinition[]
  label?: string
  id?: string
  disabled?: boolean
  showDetails?: boolean
}>(), {
  label: '语音模型',
  id: 'model-select',
  disabled: false,
  showDetails: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const selected = computed(() => props.models.find(model => model.id === props.modelValue))

function onChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="dt-model-select">
    <div class="dt-model-select__row">
      <label class="dt-model-select__label" :for="id">{{ label }}</label>
      <select
        :id="id"
        class="dt-model-select__control"
        :value="modelValue"
        :disabled="disabled"
        @change="onChange">
        <option v-if="!models.length" value="" disabled>暂无可用模型</option>
        <option
          v-for="model in models"
          :key="model.id"
          :value="model.id">
          {{ model.name }} · {{ model.sizeLabel }}{{ model.supportsCloning ? ' · 可克隆' : '' }}
        </option>
      </select>
    </div>

    <template v-if="showDetails && selected">
      <p class="dt-model-select__hint">{{ selected.description }}</p>
      <p v-if="selected.credit" class="dt-model-select__hint">
        使用说明：生成音频需标注「{{ selected.credit }}」。
      </p>
    </template>
  </div>
</template>

<style scoped>
.dt-model-select__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dt-space-3);
  margin-bottom: var(--dt-space-2);
}
.dt-model-select__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-model-select__control {
  flex: 1 1 260px;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font: inherit;
}
.dt-model-select__hint {
  margin: var(--dt-space-1) 0 0;
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
</style>
