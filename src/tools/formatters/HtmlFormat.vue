<script lang="ts">
// HTML 格式化为新建工具：词法扫描 + 缩进，未引用基座实现，无外部资源。
import { defineTextTool } from '../factory'
import { htmlFormat } from '../../utils/transformers'
export default defineTextTool('html-format', htmlFormat)
</script>
