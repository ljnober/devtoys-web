<script lang="ts">
// 基于 HeHang0/devtoys:src/views/url.vue 移植（MIT）：百分号编解码 + 可选加号表示空格。
import { defineTextTool } from '../factory'
import { urlEncode } from '../../utils/transformers'

export default defineTextTool('url-encode', urlEncode)
</script>
