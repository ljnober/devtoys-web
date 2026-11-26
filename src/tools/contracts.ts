// 冻结契约 v1.0：全项目类型定义的唯一真源，禁止在别处重复声明或改字段/命名。
import type { Component } from 'vue'

// —— 3.1 分类常量 ——
export type ToolCategoryId =
  | 'converters' | 'encoders' | 'formatters' | 'generators' | 'text'
  | 'network' | 'testers' | 'colors' | 'images' | 'references' | 'calculators'

export interface CategoryDefinition {
  id: ToolCategoryId
  name: string        // 中文，如 '转换器'
  nameEn: string      // 英文标签，如 'Converters'
  icon: string        // Element Plus 图标名或 emoji
  order: number       // 首页展示顺序，1..11
  description: string // 中文一句话
}

export type ToolKind = 'text' | 'custom'
export type ToolSource = 'base' | 'new'
export type ToolState = 'ready' | 'coming-soon'

// —— 3.2 ToolDefinition（核心，冻结） ——
export interface ToolDefinition {
  /** 全局唯一，kebab-case，等于 URL 段：/tool/{id} */
  id: string
  /** 所属分类，必须是 ToolCategoryId 联合类型之一 */
  category: ToolCategoryId
  /** 中文显示名（首版中文优先） */
  name: string
  /** 中文一句话说明，首页卡片与工具页副标题复用 */
  description: string
  /** 图标：Element Plus 图标组件名 或 单个 emoji 字符 */
  icon: string
  /** 搜索关键词，必须含中文；建议同时含英文别名 */
  keywords: string[]
  /** 组件相对 src/tools/ 的无扩展名路径，如 'formatters/JsonFormat' */
  componentPath: string
  /** 'text'=通用输入/输出管线；'custom'=自绘 UI */
  kind: ToolKind
  /** kind==='text' 时必填；指向 src/utils/transformers.ts 导出的函数名 */
  transformPath?: string
  /** 选项模式，由 OptionBar 渲染；无选项传 [] */
  options: ToolOption[]
  /** 实现来源，用于署名与统计 */
  source: ToolSource
  /** source==='base' 时必填，基座原文件路径，如 'src/views/json2yaml.vue' */
  baseSourcePath?: string
  /** 默认 'ready'；仅 comingSoonTools 用 'coming-soon' */
  state: ToolState
}

export interface ToolOption {
  /** 唯一键，作为 transform(options) 的键名 */
  key: string
  /** 中文标签 */
  label: string
  type: 'select' | 'switch' | 'text' | 'number'
  defaultValue: string | number | boolean
  /** type==='select' 时必填 */
  values?: Array<{ label: string; value: string | number }>
}

// 注册表对外 API（签名冻结，实现位于 registry.ts / loader.ts / factory.ts）
export declare const categories: CategoryDefinition[]          // 长度 11
export declare const tools: ToolDefinition[]                    // 长度 41，state 全为 ready
export declare const comingSoonTools: ToolDefinition[]          // 长度 2
export declare function getTool(id: string): ToolDefinition | undefined
export declare function getToolsByCategory(id: ToolCategoryId): ToolDefinition[]
export declare function searchTools(keyword: string): ToolDefinition[]
export declare function loadToolComponent(def: ToolDefinition): Component  // src/tools/loader.ts

// —— 3.3 结果、状态与操作回调（冻结） ——
export interface ToolResult {
  /** 'text'=文本结果；'blob'=二进制/文件结果 */
  kind: 'text' | 'blob'
  text?: string          // kind==='text' 时必填
  blob?: Blob            // kind==='blob' 时必填
  filename?: string      // 下载默认文件名，缺省用 `${tool.id}.txt`
  mimeType?: string      // 缺省 'text/plain;charset=utf-8'
}

export type ToolStatus =
  | { state: 'idle' }
  | { state: 'processing' }
  | { state: 'success'; message?: string }
  | { state: 'error'; message: string }   // message 必须是中文，禁止抛裸异常给用户

/** 由 ToolView 创建、注入给所有工具组件的统一操作回调 */
export interface ToolActions {
  copy(text: string, label?: string): Promise<boolean>
  download(result: ToolResult, filename?: string): void
  clear(): void
  swap(): void
}

// —— 3.4 工具组件 Props / Emits 契约（冻结） ——
/** 每个 componentPath 指向的 .vue 组件都必须 defineProps<ToolViewProps>() */
export interface ToolViewProps {
  /** 当前工具 id，组件内不得硬编码自己的 id */
  toolId: string
  /** 由 ToolView 创建并传入；复制/下载/清空/交换只能通过此对象调用 */
  actions: ToolActions
}

/** 每个工具组件都必须 defineEmits<ToolViewEmits>() */
export interface ToolViewEmits {
  /** 输出变化时上报，ToolView 据此更新全局状态与操作栏可用态 */
  (e: 'output-change', result: ToolResult): void
  /** 运行状态变化时上报 */
  (e: 'status-change', status: ToolStatus): void
}

/** 文本工具变换函数签名（冻结） */
export type ToolTransform = (
  input: string,
  options: Readonly<Record<string, string | number | boolean>>
) => ToolResult | Promise<ToolResult>

// src/tools/factory.ts
export declare function defineTextTool(
  id: string,
  transform: ToolTransform
): Component  // 返回的组件已实现 ToolViewProps/ToolViewEmits，内部用 IoPanel
