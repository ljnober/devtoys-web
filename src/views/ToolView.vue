<script setup lang="ts">
// /tool/:id 页面壳：懒加载工具组件，注入冻结的 ToolViewProps，统一创建 ToolActions。
import { computed, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { categories, getTool } from '@/tools/registry'
import { loadToolComponent } from '@/tools/loader'
import { copyText } from '@/utils/clipboard'
import { downloadResult } from '@/utils/download'
import ToolPageShell from '@/components/ToolPageShell.vue'
import OptionBar from '@/components/OptionBar.vue'
import ToolActionBar from '@/components/ToolActionBar.vue'
import ComingSoonView from './ComingSoonView.vue'
import type {
  ToolActions,
  ToolResult,
  ToolStatus,
  ToolViewProps
} from '@/tools/contracts'
import type { ToolCategoryId } from '@/tools/contracts'

const route = useRoute()
const router = useRouter()

const toolId = computed<string>(() => String(route.params.id ?? ''))
const definition = computed(() => getTool(toolId.value))
const toolComponent = computed(() => {
  const def = definition.value
  return def ? loadToolComponent(def) : null
})

/** 工具组件内部状态需要强制重置时，通过改变 key 触发重新挂载。 */
const instanceKey = ref(0)
const input = ref('')
const output = ref<ToolResult>({ kind: 'text', text: '' })
const status = ref<ToolStatus>({ state: 'idle' })
const navOpen = ref(false)

function initialOptions(): Record<string, string | number | boolean> {
  const defaults: Record<string, string | number | boolean> = {}
  definition.value?.options.forEach(option => {
    defaults[option.key] = option.defaultValue
  })
  return defaults
}

const options = ref<Record<string, string | number | boolean>>(initialOptions())

const hasOutput = computed<boolean>(() => {
  const result = output.value
  return result.kind === 'blob' ? Boolean(result.blob) : Boolean(result.text)
})

const statusText = computed<string>(() => {
  const current = status.value
  switch (current.state) {
    case 'idle': return '等待输入'
    case 'processing': return '正在处理…'
    case 'success': return current.message ?? '处理完成'
    case 'error': return current.message
  }
})

// 切换工具时清空上一工具的状态，避免输出串台。
watch(toolId, () => {
  input.value = ''
  output.value = { kind: 'text', text: '' }
  status.value = { state: 'idle' }
  options.value = initialOptions()
  instanceKey.value += 1
}, { immediate: true })

// 供 T03–T07 的自绘工具选择性接入（不修改冻结契约）：
// inject('devtoys:toolOptions') 取选项，inject('devtoys:toolBus').onSwap(cb) 响应交换。
provide('devtoys:toolOptions', options)

/** 统一登记订阅，页面卸载时兜底清理，避免重挂载后监听累积。 */
const swapUnsubscribers = new Set<() => void>()

provide('devtoys:toolBus', {
  onSwap(callback: (text: string) => void): () => void {
    const handler = (event: Event): void => {
      const detail = (event as CustomEvent<{ text: string }>).detail
      callback(detail?.text ?? '')
    }
    window.addEventListener('devtoys:swap', handler)

    const unsubscribe = (): void => {
      window.removeEventListener('devtoys:swap', handler)
      swapUnsubscribers.delete(unsubscribe)
    }
    swapUnsubscribers.add(unsubscribe)
    return unsubscribe
  }
})

onUnmounted(() => {
  swapUnsubscribers.forEach(unsubscribe => unsubscribe())
  swapUnsubscribers.clear()
})

/** 冻结契约要求的统一操作回调；复制/下载走独立本地工具函数。 */
const actions: ToolActions = {
  async copy(text: string, label?: string): Promise<boolean> {
    const ok = await copyText(text, label)
    if (!ok) {
      ElMessage.error('复制失败，请手动选择文本')
    }
    return ok
  },
  download(result: ToolResult, filename?: string): void {
    downloadResult(result, filename ?? `${toolId.value}.txt`)
  },
  clear(): void {
    input.value = ''
    output.value = { kind: 'text', text: '' }
    status.value = { state: 'idle' }
    instanceKey.value += 1
    ElMessage.success('已清空输入与输出')
  },
  swap(): void {
    if (!hasOutput.value) {
      ElMessage.warning('暂无可交换的输出')
      return
    }
    const text = output.value.kind === 'text' ? (output.value.text ?? '') : ''
    input.value = text
    window.dispatchEvent(new CustomEvent('devtoys:swap', {
      detail: { toolId: toolId.value, text }
    }))
    ElMessage.info('已请求交换输入与输出')
  }
}

function onOutputChange(result: ToolResult): void {
  output.value = result
}

function onStatusChange(next: ToolStatus): void {
  status.value = next
}

function onNavigate(_category: ToolCategoryId): void {
  // 分类导航只回到首页；不把用户输入或工具 id 写入 URL。
  void router.push({ name: 'home' })
}

// 编译期校验：注入工具组件的 props 严格符合冻结的 ToolViewProps；
// emits 由模板上的 @output-change / @status-change 按 ToolViewEmits 传入。
const toolProps: ToolViewProps = { toolId: toolId.value, actions }
void toolProps
</script>

<template>
  <ToolPageShell
    v-if="definition && toolComponent"
    :definition="definition"
    :categories="categories"
    v-model:nav-open="navOpen"
    @navigate="onNavigate">
    <template #options>
      <OptionBar v-model="options" :options="definition.options" />
    </template>

    <component
      :is="toolComponent"
      :key="instanceKey"
      :tool-id="definition.id"
      :actions="actions"
      @output-change="onOutputChange"
      @status-change="onStatusChange" />

    <template #actions>
      <div class="dt-tool-status" :class="`is-${status.state}`" role="status">
        {{ statusText }}
      </div>
      <ToolActionBar
        :actions="actions"
        :text="output.kind === 'text' ? (output.text ?? '') : ''"
        :result="output"
        :has-output="hasOutput" />
    </template>
  </ToolPageShell>

  <ComingSoonView v-else :tool-id="toolId" />
</template>

<style scoped>
.dt-tool-status {
  margin-top: var(--dt-space-3);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-tool-status.is-error {
  color: var(--dt-danger);
}
.dt-tool-status.is-success {
  color: var(--dt-success);
}
</style>
