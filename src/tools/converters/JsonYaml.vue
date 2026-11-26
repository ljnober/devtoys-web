<script lang="ts">
// 基于 HeHang0/devtoys:src/views/json2yaml.vue 移植（MIT）：算法见 utils/transforms-converters.ts。
import { defineTextTool } from '../factory'
import { jsonYaml } from '../../utils/transformers'

export default defineTextTool('json-yaml', jsonYaml)
</script>
