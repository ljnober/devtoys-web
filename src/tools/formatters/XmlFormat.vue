<script lang="ts">
// 基于 HeHang0/devtoys:src/views/xml.vue 移植（MIT）
import { defineTextTool } from '../factory'
import { xmlFormat } from '../../utils/transformers'
export default defineTextTool('xml-format', xmlFormat)
</script>
