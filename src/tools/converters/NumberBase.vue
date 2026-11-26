<script lang="ts">
// 基于 HeHang0/devtoys:src/views/number.vue 移植（MIT）：改用 BigInt 避免大整数精度丢失。
import { defineTextTool } from '../factory'
import { numberBase } from '../../utils/transformers'

export default defineTextTool('number-base', numberBase)
</script>
