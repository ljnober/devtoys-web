<script setup lang="ts">
// 左侧导航：搜索 + 所有工具 + 3 个快捷工具 + 11 个可折叠分类。
// 桌面端由 App.vue 常驻，移动端由 MobileNavDrawer 复用，二者共享搜索 store。
import { computed, reactive, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { categories, comingSoonTools, getTool, getToolsByCategory } from '@/tools/registry'
import { useSearchStore } from '@/stores/search'
import type { ToolCategoryId, ToolDefinition } from '@/tools/contracts'

const props = withDefaults(defineProps<{ drawer?: boolean }>(), { drawer: false })
const emit = defineEmits<{ (e: 'navigate'): void }>()

const route = useRoute()
const searchStore = useSearchStore()

/** 分类展开状态：组件内维护，切换工具页时自动展开所属分类。 */
const expanded = reactive<Set<ToolCategoryId>>(new Set<ToolCategoryId>())

const currentToolId = computed<string>(() => String(route.params.id ?? ''))
const isHome = computed<boolean>(() => route.name === 'home')

interface QuickLink {
  id: string
  label: string
  icon: string
}

/** 与参考站一致的三个快捷入口，id 直接对应冻结注册表中的工具 id。 */
const quickLinks: QuickLink[] = [
  { id: 'password-generator', label: '密码生成器', icon: getTool('password-generator')?.icon ?? '🔒' },
  { id: 'json-format', label: 'JSON 格式化工具', icon: getTool('json-format')?.icon ?? '🧱' },
  { id: 'json-yaml', label: 'JSON <> YAML 转换器', icon: getTool('json-yaml')?.icon ?? '🧩' }
]

function readyTools(categoryId: ToolCategoryId): ToolDefinition[] {
  return getToolsByCategory(categoryId)
}

function soonTools(categoryId: ToolCategoryId): ToolDefinition[] {
  return comingSoonTools.filter(tool => tool.category === categoryId)
}

function toggle(categoryId: ToolCategoryId): void {
  if (expanded.has(categoryId)) {
    expanded.delete(categoryId)
  } else {
    expanded.add(categoryId)
  }
}

function isCurrentTool(id: string): boolean {
  return currentToolId.value === id
}

/** 抽屉内点击任意链接后由父组件关闭抽屉；桌面常驻时父组件不监听，无副作用。 */
function onNavigate(): void {
  emit('navigate')
}

watch(currentToolId, (id: string) => {
  const definition = id ? getTool(id) : undefined
  if (definition) {
    expanded.add(definition.category)
  }
}, { immediate: true })
</script>

<template>
  <nav class="dt-side" :class="{ 'dt-side--drawer': props.drawer }" aria-label="工具导航">
    <div class="dt-side__search">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5 21 21" />
      </svg>
      <input
        v-model="searchStore.keyword"
        type="search"
        aria-label="搜索工具"
        placeholder="输入以搜索工具..." />
      <button
        v-if="searchStore.keyword"
        class="dt-side__clear"
        type="button"
        aria-label="清空搜索"
        @click="searchStore.clear()">✕</button>
    </div>

    <RouterLink
      class="dt-side__all"
      :class="{ 'is-current': isHome }"
      :to="{ name: 'home' }"
      @click="onNavigate">
      <span class="dt-side__item-icon" aria-hidden="true">▦</span>
      <span>所有工具</span>
    </RouterLink>

    <div class="dt-side__group">
      <RouterLink
        v-for="link in quickLinks"
        :key="link.id"
        class="dt-side__row"
        :class="{ 'is-current': isCurrentTool(link.id) }"
        :to="{ name: 'tool', params: { id: link.id } }"
        @click="onNavigate">
        <span class="dt-side__item-icon" aria-hidden="true">{{ link.icon }}</span>
        <span>{{ link.label }}</span>
      </RouterLink>
    </div>

    <div class="dt-side__divider" role="presentation"></div>

    <div class="dt-side__group">
      <div v-for="category in categories" :key="category.id" class="dt-side__category">
        <button
          class="dt-side__row dt-side__category-toggle"
          type="button"
          :aria-expanded="expanded.has(category.id)"
          @click="toggle(category.id)">
          <span class="dt-side__item-icon" aria-hidden="true">{{ category.icon }}</span>
          <span class="dt-side__category-name">{{ category.name }}</span>
          <svg
            class="dt-side__chevron"
            :class="{ 'is-open': expanded.has(category.id) }"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <ul v-if="expanded.has(category.id)" class="dt-side__tools">
          <li v-for="tool in readyTools(category.id)" :key="tool.id">
            <RouterLink
              class="dt-side__tool"
              :class="{ 'is-current': isCurrentTool(tool.id) }"
              :aria-current="isCurrentTool(tool.id) ? 'page' : undefined"
              :to="{ name: 'tool', params: { id: tool.id } }"
              @click="onNavigate">
              {{ tool.name }}
            </RouterLink>
          </li>
          <li v-for="tool in soonTools(category.id)" :key="tool.id">
            <span class="dt-side__tool is-soon" aria-disabled="true">{{ tool.name }}（即将推出）</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.dt-side {
  width: 280px;
  flex: 0 0 280px;
  align-self: flex-start;
  position: sticky;
  top: var(--dt-header-height);
  height: calc(100vh - var(--dt-header-height));
  overflow-y: auto;
  padding: var(--dt-space-3) var(--dt-space-3) var(--dt-space-6);
  border-right: 1px solid var(--dt-border);
  background: var(--dt-sidebar-bg);
  color: var(--dt-fg);
}
.dt-side--drawer {
  position: static;
  width: 100%;
  height: 100%;
  flex: initial;
  padding: 0;
  border-right: 0;
  background: transparent;
}
.dt-side__search {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: var(--dt-space-3);
}
.dt-side__search > svg {
  position: absolute;
  left: var(--dt-space-3);
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--dt-muted);
  stroke-width: 2;
  stroke-linecap: round;
  pointer-events: none;
}
.dt-side__search input {
  width: 100%;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-7);
  border: 1px solid var(--dt-border);
  border-radius: var(--dt-radius-sm);
  background: var(--dt-input-bg);
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
}
.dt-side__search input:focus {
  outline: 2px solid var(--dt-primary);
  outline-offset: 1px;
}
.dt-side__clear {
  position: absolute;
  right: var(--dt-space-1);
  width: var(--dt-touch-target);
  height: var(--dt-touch-target);
  border: 0;
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-muted);
}
.dt-side__all,
.dt-side__row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-2);
  width: 100%;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-2) var(--dt-space-3);
  border: 1px solid transparent;
  border-radius: var(--dt-radius-sm);
  background: transparent;
  color: var(--dt-fg);
  font-size: var(--dt-font-size-sm);
  text-align: left;
}
.dt-side__all {
  color: var(--dt-fg);
  font-weight: 600;
}
.dt-side__all:hover,
.dt-side__row:hover {
  background: var(--dt-hover-bg);
}
.dt-side__all.is-current,
.dt-side__row.is-current {
  border-color: var(--dt-border);
  background: var(--dt-active-bg);
  color: var(--dt-primary);
  font-weight: 600;
}
.dt-side__group {
  display: grid;
  gap: 2px;
}
.dt-side__item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 20px;
  font-size: var(--dt-font-size-sm);
  filter: grayscale(1);
}
.dt-side__divider {
  height: 1px;
  margin: var(--dt-space-2) 0;
  background: var(--dt-border);
}
.dt-side__category-name {
  flex: 1;
  min-width: 0;
}
.dt-side__chevron {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  fill: none;
  stroke: var(--dt-muted);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.15s ease;
}
.dt-side__chevron.is-open {
  transform: rotate(90deg);
}
.dt-side__tools {
  list-style: none;
  margin: 0 0 var(--dt-space-1);
  padding: 0 0 0 var(--dt-space-4);
  border-left: 1px solid var(--dt-border);
}
.dt-side__tool {
  display: flex;
  align-items: center;
  min-height: var(--dt-touch-target);
  padding: var(--dt-space-1) var(--dt-space-2);
  border-radius: var(--dt-radius-sm);
  color: var(--dt-muted);
  font-size: var(--dt-font-size-sm);
}
.dt-side__tool:hover {
  background: var(--dt-hover-bg);
}
.dt-side__tool.is-current {
  background: var(--dt-active-bg);
  color: var(--dt-primary);
  font-weight: 600;
}
.dt-side__tool.is-soon {
  opacity: 0.6;
  cursor: default;
}
</style>
