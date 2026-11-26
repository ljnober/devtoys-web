<script lang="ts">
// Hex ↔ ASCII：UTF-8 字节级转换，支持多种分隔符。
import { defineTextTool } from '../factory'
import { hexAscii } from '../../utils/transformers'

export default defineTextTool('hex-ascii', hexAscii)
</script>
