<script setup lang="ts">
// 全局壳：顶部 AppHeader + 左侧常驻 AppSidebar + 右侧 RouterView + 移动端抽屉 + 隐私标签。
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import PrivacyBadge from '@/components/PrivacyBadge.vue'
import MobileNavDrawer from '@/components/MobileNavDrawer.vue'
import { categories } from '@/tools/registry'

const router = useRouter()
const navOpen = ref(false)

function navigateHome(): void {
  navOpen.value = false
  void router.push({ name: 'home' })
}
</script>

<template>
  <div class="dt-app">
    <AppHeader @open-nav="navOpen = true" />

    <div class="dt-app__body">
      <AppSidebar class="dt-app__sidebar" />
      <main class="dt-app__main">
        <RouterView />
      </main>
    </div>

    <MobileNavDrawer
      :categories="categories"
      :open="navOpen"
      @update:open="navOpen = $event"
      @select="navigateHome" />
    <PrivacyBadge />
  </div>
</template>

<style scoped>
.dt-app {
  min-height: 100vh;
  background: var(--dt-main-bg);
  color: var(--dt-fg);
}
.dt-app__body {
  display: flex;
  align-items: stretch;
  min-height: calc(100vh - var(--dt-header-height));
}
.dt-app__main {
  flex: 1;
  min-width: 0;
  background: var(--dt-main-bg);
}
@media (max-width: 768px) {
  .dt-app__sidebar {
    display: none;
  }
}
</style>
