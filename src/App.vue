<script setup lang="ts">
// 全局壳：AppHeader + 分类抽屉 + RouterView + 常驻隐私标签。
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
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
    <MobileNavDrawer
      :categories="categories"
      :open="navOpen"
      @update:open="navOpen = $event"
      @select="navigateHome" />
    <RouterView />
    <PrivacyBadge />
  </div>
</template>

<style scoped>
.dt-app {
  min-height: 100vh;
  background: var(--dt-bg);
  color: var(--dt-fg);
}
</style>
