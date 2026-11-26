// 网络类纯函数：IPv6 解析/展开由 defineTextTool 直接调用，零网络请求。
import type { ToolResult, ToolTransform } from '../tools/contracts'
import { compressIpv6, expandIpv6 } from './ip'

/**
 * IPv6 地址展开为 8 段完整形式，并给出压缩形式。
 * 空输入返回空结果；非法输入抛出中文错误，由工厂统一转成 ToolStatus。
 */
export const ipv6Parse: ToolTransform = (input: string, _options): ToolResult => {
  const value = input.trim()
  if (!value) {
    return { kind: 'text', text: '' }
  }
  try {
    const expanded = expandIpv6(value)
    const compressed = compressIpv6(expanded)
    return {
      kind: 'text',
      text: `展开：${expanded}\n压缩：${compressed}`
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'IPv6 地址格式无效')
  }
}
