<script lang="ts">
// JSON ↔ XML 互转：纯 DOMParser + 序列化，无新增依赖。
import { defineTextTool } from '../factory'
import { jsonXml } from '../../utils/transformers'

export default defineTextTool('json-xml', jsonXml)
</script>
