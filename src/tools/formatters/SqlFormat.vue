<script lang="ts">
// 基于 HeHang0/devtoys:src/views/sql.vue 移植（MIT）
import { defineTextTool } from '../factory'
import { sqlFormat } from '../../utils/transformers'
export default defineTextTool('sql-format', sqlFormat)
</script>
