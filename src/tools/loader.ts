// 工具组件按 componentPath 懒加载：文件缺失或加载失败时回退到 ComingSoon 占位，避免白屏。
import { defineAsyncComponent, type Component } from 'vue'
import ComingSoon from './ComingSoon.vue'
import type { ToolDefinition } from './contracts'

// Vite 在构建时静态分析该 glob，只打包 src/tools/ 下的工具组件。
const modules = import.meta.glob('./**/*.vue') as unknown as Record<
  string,
  () => Promise<{ default?: Component }>
>

/**
 * 按注册表的 componentPath 解析工具组件。
 * @param def 冻结契约定义的工具条目
 * @returns 可直接用于 <component :is> 的组件；未实现时返回占位组件
 */
export function loadToolComponent(def: ToolDefinition): Component {
  const target = `./${def.componentPath}.vue`
  const moduleLoader = modules[target]

  if (!moduleLoader) {
    return ComingSoon
  }

  return defineAsyncComponent(async () => {
    try {
      const module = await moduleLoader()
      return (module.default ?? ComingSoon) as Component
    } catch {
      // 动态 chunk 加载失败（网络异常/文件损坏）时也不让用户看到白屏。
      return ComingSoon
    }
  })
}
