<script lang="ts">
// 基于 HeHang0/devtoys:src/views/formatter.vue 移植（MIT）
import { defineTextTool } from '../factory'
import { jsonFormat } from '../../utils/transformers'
export default defineTextTool('json-format', jsonFormat)
</script>
