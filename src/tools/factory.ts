// 文本类工具工厂：生成符合 ToolViewProps / ToolViewEmits 的通用输入输出组件。
// T02b：合并 ToolView 注入的响应式选项并订阅交换事件；冻结契约字段保持不变。
import {
  computed,
  defineComponent,
  h,
  inject,
  isRef,
  onUnmounted,
  ref,
  watch,
  type Component,
  type PropType,
  type Ref
} from 'vue'
import { getTool } from './registry'
import type {
  ToolActions,
  ToolResult,
  ToolStatus,
  ToolTransform,
  ToolViewProps
} from './contracts'

type ToolOptions = Record<string, string | number | boolean>

/** ToolView 通过 provide 暴露的交换总线；onSwap 返回取消订阅函数。 */
interface SwapBus {
  onSwap(callback: (text: string) => void): () => void
}

/**
 * 把一个纯变换函数包装成标准工具组件。
 * @param id 注册表工具 id（仅用于取默认选项，组件不硬编码自己的 id）
 * @param transform 输入 → 结果的本地纯函数
 * @returns 实现冻结契约的 Vue 组件
 */
export function defineTextTool(id: string, transform: ToolTransform): Component {
  return defineComponent({
    name: `Tool-${id}`,
    props: {
      toolId: { type: String, required: true },
      actions: { type: Object as PropType<ToolActions>, required: true }
    },
    emits: ['output-change', 'status-change'],
    setup(props, { emit }) {
      // 编译期校验：运行时 props 与冻结的 ToolViewProps 完全一致。
      const typedProps: ToolViewProps = props
      const input = ref('')
      const output = ref<ToolResult>({ kind: 'text', text: '' })

      // 注册表默认值作为底座。
      const defaults = computed<ToolOptions>(() => {
        const result: ToolOptions = {}
        getTool(typedProps.toolId)?.options.forEach(option => {
          result[option.key] = option.defaultValue
        })
        return result
      })

      // ToolView 的 OptionBar 选项优先于注册表默认值；ref / 普通对象均可。
      const injectedOptions = inject<Ref<ToolOptions> | ToolOptions | null>('devtoys:toolOptions', null)
      const mergedOptions = computed<ToolOptions>(() => {
        const provided = injectedOptions
          ? (isRef(injectedOptions) ? injectedOptions.value : injectedOptions)
          : null
        return { ...defaults.value, ...(provided ?? {}) }
      })

      async function run(): Promise<void> {
        // 空输入按 §7.2 约定回到 idle，避免上一轮结果残留。
        if (!input.value) {
          output.value = { kind: 'text', text: '' }
          emit('output-change', output.value)
          emit('status-change', { state: 'idle' } as ToolStatus)
          return
        }
        emit('status-change', { state: 'processing' } as ToolStatus)
        try {
          const result = await transform(input.value, mergedOptions.value)
          output.value = result
          emit('output-change', result)
          emit('status-change', { state: 'success' } as ToolStatus)
        } catch {
          output.value = { kind: 'text', text: '' }
          emit('status-change', { state: 'error', message: '输入内容无法处理，请检查后重试' } as ToolStatus)
        }
      }

      // 输入变化与选项变化都重算；选项由 computed 追踪，OptionBar 改动即时生效。
      watch(input, () => { void run() }, { immediate: true })
      watch(mergedOptions, () => { void run() })

      // 订阅 ToolView 的交换事件；收到文本写回输入并触发重算，空串则清空。
      const swapBus = inject<SwapBus | null>('devtoys:toolBus', null)
      function handleSwap(text: string): void {
        input.value = text
        if (!text) {
          output.value = { kind: 'text', text: '' }
          emit('output-change', output.value)
          emit('status-change', { state: 'idle' } as ToolStatus)
        }
      }
      const stopSwap = swapBus?.onSwap(handleSwap) ?? null
      onUnmounted(() => { stopSwap?.() })

      return () => h('div', { class: 'dt-text-tool' }, [
        h('label', { class: 'dt-tool-label' }, '输入'),
        h('textarea', {
          class: 'dt-tool-input',
          value: input.value,
          rows: 10,
          placeholder: '请在此输入内容，所有处理均在本地完成',
          onInput: (event: Event) => {
            input.value = (event.target as HTMLTextAreaElement).value
          }
        }),
        h('label', { class: 'dt-tool-label' }, '输出'),
        h('textarea', {
          class: 'dt-tool-output',
          value: output.value.kind === 'text' ? (output.value.text ?? '') : '',
          rows: 10,
          readonly: true,
          placeholder: '处理结果将显示在这里'
        })
      ])
    }
  })
}
