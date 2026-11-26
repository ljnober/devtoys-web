<script lang="ts">
// 数据大小单位换算：bit / Byte / KB / MB / GB / TB。
import { defineTextTool } from '../factory'
import { dataSize } from '../../utils/transformers'

export default defineTextTool('data-size', dataSize)
</script>
