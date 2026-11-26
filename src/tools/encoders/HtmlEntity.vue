<script lang="ts">
// 基于 HeHang0/devtoys:src/views/html.vue 移植（MIT）：命名实体与数字实体互转。
import { defineTextTool } from '../factory'
import { htmlEntity } from '../../utils/transformers'

export default defineTextTool('html-entity', htmlEntity)
</script>
