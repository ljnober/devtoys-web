// 工程构建配置：相对路径产物，零 CDN / Monaco / PWA / 本地 HTTPS 插件。
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
