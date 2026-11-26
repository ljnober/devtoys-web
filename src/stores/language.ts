// 语言兼容层：首版仅中文，t(key) 对未知键原样返回，不做英文翻译。
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type LanguageCode = 'zh-CN'

export const useLanguageStore = defineStore('language', () => {
  const current = ref<LanguageCode>('zh-CN')

  /** 兼容基座旧代码的键名调用；首版文案直接写中文，故原样返回。 */
  function t(key: string): string {
    return key
  }

  return { current, t }
})
