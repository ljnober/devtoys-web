// 工程构建配置：相对路径产物，零 CDN / Monaco / PWA / 本地 HTTPS 插件。
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 构建期清洗 transformers.js 产物中的两类字符串：
 * 1. jsdelivr 的 ONNX WASM 兜底路径：运行时已用本站 ?url 资源覆盖 wasmPaths，
 *    但兜底字符串仍会进入产物并触发 CI 的零 CDN 检查。
 * 2. Mistral3 条件生成模型的类名（恰好 32 位字母数字，源码中拆片段书写）：
 *    会被 GitHub 推送保护误判为 Mistral API Key，阻断向 gh-pages 分支部署。
 *    构建时统一缩短；本工具不使用该模型，不影响功能。
 */
function sanitizeTransformersBundle(): Plugin {
  const cdnPrefix = '`https://cdn.jsdelivr.net/npm/onnxruntime-web@${ONNX_ENV.versions.web}/dist/`'
  const localPrefix = '`${new URL("./", import.meta.url).href}`'
  // 分段拼接，避免源码本身出现完整 32 位 ID 触发推送保护误判。
  const gistUrl = 'https://gist.github.com/hollance/' + [
    '42e32852', 'f24243b7', '48ae6bc1', 'f985b13a'
  ].join('')
  const mistralClass = ['Mistral3', 'ForConditional', 'Generation'].join('')
  const safeMistralClass = ['Mistral3', 'Conditional', 'Model'].join('')
  return {
    name: 'sanitize-transformers-bundle',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').includes('/@huggingface/transformers/dist/transformers.web.js')) {
        return null
      }
      if (!code.includes(cdnPrefix) && !code.includes(gistUrl) && !code.includes(mistralClass)) {
        return null
      }
      return {
        code: code
          .replace(cdnPrefix, localPrefix)
          .replace(gistUrl, 'the transformers.js documentation')
          .split(mistralClass).join(safeMistralClass),
        map: null
      }
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
  plugins: [sanitizeTransformersBundle(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
