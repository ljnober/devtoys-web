// 工程构建配置：相对路径产物，零 CDN / Monaco / PWA / 本地 HTTPS 插件。
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * transformers.js 内置了 jsdelivr 的 ONNX WASM 兜底路径。
 * 运行时（src/utils/prosody.ts）已用本站 ?url 资源覆盖 wasmPaths，
 * 但兜底字符串仍会进入产物并触发 CI 的零 CDN 检查。
 * 这里仅在构建期把它改成同源相对路径，避免任何 CDN 依赖。
 */
function stripCdnWasmFallback(): Plugin {
  const cdnPrefix = '`https://cdn.jsdelivr.net/npm/onnxruntime-web@${ONNX_ENV.versions.web}/dist/`'
  const localPrefix = '`${new URL("./", import.meta.url).href}`'
  return {
    name: 'strip-cdn-wasm-fallback',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').includes('/@huggingface/transformers/dist/transformers.web.js')) {
        return null
      }
      if (!code.includes(cdnPrefix)) return null
      return { code: code.replace(cdnPrefix, localPrefix), map: null }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // 同一份产物同时兼容项目页 /devtoys-web/ 与自定义域名根路径
  base: './',
  build: {
    outDir: 'dist',
    // 关闭 Vite 的 modulepreload polyfill：其内联实现含 fetch()，
    // 虽然只加载本地静态资源，仍会给隐私红线巡检带来噪声。
    modulePreload: { polyfill: false }
  },
  plugins: [stripCdnWasmFallback(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
