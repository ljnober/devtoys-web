<script lang="ts">
// CSS 格式化为新建工具：纯前端状态机缩进，未引用基座实现，无外部资源。
import { defineTextTool } from '../factory'
import { cssFormat } from '../../utils/transformers'
export default defineTextTool('css-format', cssFormat)
</script>
