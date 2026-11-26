<script setup lang="ts">
// IPv4 子网计算器：位运算全部在 src/utils/ip.ts 中完成，页面只负责输入与展示。
import { computed, ref, watch } from 'vue'
import { calculateIpv4Subnet } from '@/utils/ip'
import type { Ipv4SubnetInfo } from '@/utils/ip'
import type { ToolResult, ToolViewEmits, ToolViewProps } from '@/tools/contracts'

const props = defineProps<ToolViewProps>()
const emit = defineEmits<ToolViewEmits>()
void props

const cidr = ref('192.168.1.10/24')

interface SubnetState {
  info: Ipv4SubnetInfo | null
  error: string
}

const state = computed<SubnetState>(() => {
  if (!cidr.value.trim()) {
    return { info: null, error: '' }
  }
  try {
    return { info: calculateIpv4Subnet(cidr.value), error: '' }
  } catch (error) {
    return {
      info: null,
      error: error instanceof Error ? error.message : 'CIDR 格式无效'
    }
  }
})

/** 展示用字段，顺序固定便于核对。 */
const fields = computed<Array<{ label: string; value: string }>>(() => {
  const info = state.value.info
  if (!info) {
    return []
  }
  return [
    { label: '输入地址', value: info.input },
    { label: '子网掩码', value: info.mask },
    { label: '反掩码', value: info.wildcardMask },
    { label: '网络地址', value: info.network },
    { label: '广播地址', value: info.broadcast },
    { label: '首个可用主机', value: info.firstHost },
    { label: '末个可用主机', value: info.lastHost },
    { label: '前缀长度', value: `/${info.prefix}` },
    { label: '地址总数', value: info.totalAddresses.toLocaleString('zh-CN') },
    { label: '可用主机数', value: info.usableHosts.toLocaleString('zh-CN') },
    { label: '地址类型', value: info.isPrivate ? '私有地址（RFC1918）' : '公网地址' }
  ]
})

const output = computed<ToolResult>(() => ({
  kind: 'text',
  text: state.value.info
    ? fields.value.map(item => `${item.label}：${item.value}`).join('\n')
    : ''
}))

watch(output, next => {
  emit('output-change', next)
  if (state.value.error) {
    emit('status-change', { state: 'error', message: state.value.error })
  } else if (!next.text) {
    emit('status-change', { state: 'idle' })
  } else {
    emit('status-change', { state: 'success', message: '子网计算完成' })
  }
}, { immediate: true })
</script>

<template>
  <div class="dt-subnet">
    <label class="dt-field">
      <span class="dt-field__label">IPv4 地址 / CIDR</span>
      <input v-model="cidr" type="text" spellcheck="false" placeholder="例如 192.168.1.10/24" />
    </label>
    <p class="dt-subnet__hint">也支持 192.168.1.10/255.255.255.0 形式的子网掩码</p>
    <p v-if="state.error" class="dt-subnet__error">{{ state.error }}</p>

    <div v-if="state.info" class="dt-subnet__grid">
      <div v-for="item in fields" :key="item.label" class="dt-subnet__card">
        <span class="dt-subnet__label">{{ item.label }}</span>
        <span class="dt-subnet__value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dt-field {
  display: grid;
  gap: var(--dt-space-2);
}
.dt-field__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-field input {
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-family: var(--dt-font-mono);
  font-size: var(--dt-font-size-sm);
}
.dt-subnet__hint {
  margin: var(--dt-space-2) 0 var(--dt-space-4);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-subnet__error {
  margin: 0 0 var(--dt-space-4);
  color: var(--dt-danger);
}
.dt-subnet__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--dt-space-3);
}
.dt-subnet__card {
  display: grid;
  gap: var(--dt-space-1);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
}
.dt-subnet__label {
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-subnet__value {
  font-family: var(--dt-font-mono);
  word-break: break-all;
}
</style>
