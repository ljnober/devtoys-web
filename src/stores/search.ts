// 搜索 store：复用冻结注册表的 searchTools，支持中文名称与英文别名模糊匹配。
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { comingSoonTools, searchTools } from '@/tools/registry'
import type { ToolDefinition } from '@/tools/contracts'

function matches(keyword: string, tool: ToolDefinition): boolean {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) {
    return true
  }
  return [tool.id, tool.name, tool.description, tool.category, ...tool.keywords]
    .some(field => field.toLowerCase().includes(normalized))
}

export const useSearchStore = defineStore('search', () => {
  /** 中文/英文搜索词，由 AppHeader 的输入框双向绑定。 */
  const keyword = ref('')

  /** 40 个 P0 工具的搜索结果。 */
  const results = computed<ToolDefinition[]>(() => searchTools(keyword.value))

  /** 即将推出占位卡的搜索结果（不计入 P0 数量）。 */
  const comingSoonResults = computed<ToolDefinition[]>(() =>
    comingSoonTools.filter(tool => matches(keyword.value, tool))
  )

  function clear(): void {
    keyword.value = ''
  }

  return { keyword, results, comingSoonResults, clear }
})
