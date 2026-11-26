<script setup lang="ts">
// 全站顶部栏：本地 Logo + 中文搜索 + 主题切换 + 中文标识 + 移动端菜单入口。
import { RouterLink } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import ThemeToggle from './ThemeToggle.vue'

const emit = defineEmits<{ (e: 'open-nav'): void }>()
const searchStore = useSearchStore()
</script>

<template>
  <header class="dt-header">
    <div class="dt-container dt-header__inner">
      <button
        class="dt-header__menu"
        type="button"
        aria-label="打开分类导航"
        @click="emit('open-nav')">
        ☰
      </button>

      <RouterLink class="dt-header__brand" :to="{ name: 'home' }" aria-label="DevToys Web 首页">
        <!-- 内联本地 SVG，无外链资源 -->
        <svg viewBox="0 0 64 64" role="img" aria-hidden="true" class="dt-header__logo">
          <rect x="2" y="2" width="60" height="60" rx="14" fill="var(--dt-primary)" />
          <path d="M20 20h24v7H27v6h15v7H27v9h-7z" fill="var(--dt-primary-contrast)" />
          <circle cx="47" cy="46" r="5" fill="var(--dt-warning)" />
        </svg>
        <span>DevToys Web</span>
      </RouterLink>

      <div class="dt-header__search">
        <span class="dt-header__search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="searchStore.keyword"
          type="search"
          aria-label="搜索工具"
          placeholder="搜索工具（支持中文 / 英文）" />
        <button
          v-if="searchStore.keyword"
          class="dt-header__clear"
          type="button"
          aria-label="清空搜索"
          @click="searchStore.clear()">
          ✕
        </button>
      </div>

      <span class="dt-header__lang" title="当前界面：中文">中</span>
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped>
.dt-header {
  position: sticky;
  top: 0;
  z-index: 60;
  border-bottom: 1px solid var(--dt-border);
  background: var(--dt-card-bg);
}
.dt-header__inner {
  display: flex;
  align-items: center;
  gap: var(--dt-space-3);
  min-height: var(--dt-header-height);
}
.dt-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-2);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-lg);
  font-weight: 700;
  white-space: nowrap;
}
.dt-header__logo {
  width: 36px;
  height: 36px;
}
.dt-header__search {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}
.dt-header__search input {
  width: 100%;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4) var(--dt-space-2) var(--dt-space-7);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
}
.dt-header__search input:focus {
  outline: 2px solid var(--dt-primary);
  outline-offset: 1px;
}
.dt-header__search-icon {
  position: absolute;
  left: var(--dt-space-3);
  pointer-events: none;
}
.dt-header__clear {
  position: absolute;
  right: var(--dt-space-2);
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--dt-radius-pill);
  background: transparent;
  color: var(--dt-muted);
}
.dt-header__lang {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  color: var(--dt-muted);
}
.dt-header__menu {
  display: none;
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-card-bg);
  font-size: var(--dt-font-size-lg);
}
@media (max-width: 768px) {
  .dt-header__menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .dt-header__brand span {
    display: none;
  }
  .dt-header__inner {
    gap: var(--dt-space-2);
  }
}
</style>
