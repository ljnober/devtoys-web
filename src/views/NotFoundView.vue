<script setup lang="ts">
// 404 兜底页。
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="dt-not-found dt-container">
    <div class="dt-not-found__card dt-card">
      <p class="dt-not-found__code">404</p>
      <h1>页面不存在</h1>
      <p>你访问的地址可能已经失效，请返回首页重新选择工具。</p>
      <RouterLink class="dt-button dt-button--primary" :to="{ name: 'home' }">返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dt-not-found {
  padding: var(--dt-space-7) var(--dt-space-5);
}
.dt-not-found__card {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--dt-space-6);
  text-align: center;
}
.dt-not-found__code {
  margin: 0;
  color: var(--dt-primary);
  font-size: 64px;
  font-weight: 700;
}
.dt-not-found h1 {
  margin: var(--dt-space-2) 0;
}
.dt-not-found p {
  color: var(--dt-muted);
}
.dt-not-found a {
  display: inline-flex;
  align-items: center;
  margin-top: var(--dt-space-4);
}
</style>
