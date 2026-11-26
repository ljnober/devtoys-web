// 正式路由：首页 / 工具页 / 404 兜底。
// hash 模式（/#/tool/xxx）使本地 preview 与 GitHub Pages 深链刷新均不会 404。
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ToolView from '@/views/ToolView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView, meta: { title: '工具目录' } },
  { path: '/tool/:id', name: 'tool', component: ToolView, meta: { title: '工具' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: '页面不存在' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
