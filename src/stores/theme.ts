// 主题 store：localStorage 持久化 + html[data-theme] / html.dark 双属性联动。
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'devtoys-web:theme'

/** 无持久化偏好时读取系统偏好；系统也无偏好则默认浅色。 */
function readInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // 隐私模式下 localStorage 可能不可用，忽略即可。
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>(readInitialTheme())

  /** 同步 DOM 上的主题标记，Element Plus 暗色变量依赖 html.dark。 */
  function apply(): void {
    const root = document.documentElement
    root.dataset.theme = theme.value
    root.classList.toggle('dark', theme.value === 'dark')
  }

  /** 将当前偏好写入 localStorage。 */
  function persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // 写入失败不影响本次会话的主题切换。
    }
  }

  function set(value: ThemeMode): void {
    theme.value = value
  }

  function toggle(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, () => {
    apply()
    persist()
  })

  apply()

  return { theme, apply, persist, set, toggle }
})
