<script setup lang="ts">
// 常驻隐私标签：提醒用户所有计算均在浏览器本地完成。
</script>

<template>
  <div class="dt-privacy-badge" role="note">
    <span aria-hidden="true">🔒</span>
    <span>本地处理 · 不上传</span>
  </div>
</template>

<style scoped>
.dt-privacy-badge {
  position: fixed;
  right: var(--dt-space-4);
  bottom: var(--dt-space-4);
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-2);
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-4);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-pill);
  background: var(--dt-card-bg);
  color: var(--dt-muted);
  box-shadow: var(--dt-shadow);
  font-size: var(--dt-font-size-sm);
}
</style>
