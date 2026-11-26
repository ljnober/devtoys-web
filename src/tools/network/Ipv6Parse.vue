<script lang="ts">
// 文本型工具：由冻结工厂包装，props/emits/布局由 defineTextTool 统一提供。
import { defineTextTool } from '@/tools/factory'
import { ipv6Parse } from '@/utils/transforms-network'

export default defineTextTool('ipv6-parse', ipv6Parse)
</script>
