// 下载工具：把 ToolResult 转为本地 Blob 并触发浏览器下载，全程无网络请求。
import type { ToolResult } from '@/tools/contracts'

/**
 * 触发文件下载。
 * @param result 冻结契约定义的结果对象
 * @param filename 默认文件名（ToolView 传入 `${tool.id}.txt`）
 */
export function downloadResult(result: ToolResult, filename?: string): void {
  const mimeType = result.mimeType ?? (result.kind === 'blob'
    ? 'application/octet-stream'
    : 'text/plain;charset=utf-8')
  const blob = result.blob ?? new Blob([result.text ?? ''], { type: mimeType })
  const name = filename ?? result.filename ?? 'devtoys-result.txt'

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // 延迟释放，避免部分浏览器在下载启动前就失效。
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
