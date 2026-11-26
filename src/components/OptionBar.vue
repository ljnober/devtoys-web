<script setup lang="ts">
// 由 ToolDefinition.options 渲染下拉 / 开关 / 文本 / 数字控件。
import type { ToolOption } from '@/tools/contracts'

const props = defineProps<{
  options: ToolOption[]
  modelValue: Record<string, string | number | boolean>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string | number | boolean>): void
}>()

function update(key: string, value: string | number | boolean): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function onInput(key: string, event: Event): void {
  update(key, (event.target as HTMLInputElement | HTMLSelectElement).value)
}

/** 下拉框保留 option.values 中的原始值类型（number / string）。 */
function onSelect(option: ToolOption, event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  const matched = option.values?.find(value => String(value.value) === raw)
  update(option.key, matched?.value ?? raw)
}

function onNumber(key: string, event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  update(key, raw === '' ? 0 : Number(raw))
}

function onSwitch(key: string, event: Event): void {
  update(key, (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div v-if="options.length" class="dt-options">
    <label v-for="option in options" :key="option.key" class="dt-options__item">
      <span class="dt-options__label">{{ option.label }}</span>

      <select
        v-if="option.type === 'select'"
        :value="String(modelValue[option.key] ?? option.defaultValue)"
        @change="onSelect(option, $event)">
        <option
          v-for="value in option.values ?? []"
          :key="String(value.value)"
          :value="String(value.value)">
          {{ value.label }}
        </option>
      </select>

      <input
        v-else-if="option.type === 'switch'"
        type="checkbox"
        :checked="Boolean(modelValue[option.key] ?? option.defaultValue)"
        @change="onSwitch(option.key, $event)" />

      <input
        v-else-if="option.type === 'number'"
        type="number"
        :value="Number(modelValue[option.key] ?? option.defaultValue)"
        @input="onNumber(option.key, $event)" />

      <input
        v-else
        type="text"
        :value="String(modelValue[option.key] ?? option.defaultValue)"
        @input="onInput(option.key, $event)" />
    </label>
  </div>
</template>

<style scoped>
.dt-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  margin-bottom: var(--dt-space-4);
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius);
  background: var(--dt-card-bg);
}
.dt-options__item {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-2);
  min-height: var(--dt-touch-target);
}
.dt-options__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-options select,
.dt-options input[type='text'],
.dt-options input[type='number'] {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
}
.dt-options input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: var(--dt-primary);
}
@media (max-width: 768px) {
  .dt-options {
    flex-direction: column;
  }
}
</style>
