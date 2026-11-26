// 剪贴板工具：优先使用 Clipboard API，失败时回退到 textarea + execCommand。
// 任何情况下都不抛异常给 UI，由调用方决定如何展示中文提示。

/**
 * 复制文本到系统剪贴板。
 * @param text 待复制文本
 * @param _label 可选标签（保留给 ToolActions 签名，当前实现不使用）
 * @returns 是否复制成功
 */
export async function copyText(text: string, _label?: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 权限被拒绝时继续走回退方案。
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-1000px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
