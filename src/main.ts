// 应用入口：安装 Pinia / router / ElementPlus 并挂载。
// T01 移除了基座 useRegisterSW()（首版关闭 PWA），T02 会在此引入 tokens.css / base.css。
import { createApp, type Plugin } from 'vue'
import { createPinia } from 'pinia'
import {
  ElButton,
  ElConfigProvider,
  ElDrawer,
  ElEmpty,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTag,
  ElTooltip
} from 'element-plus'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import './styles/tokens.css'
import './styles/base.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 按需注册 Element Plus 组件：避免把全量 el-upload 的 XMLHttpRequest 打进产物。
// T02–T07 如需新增组件，请在此列表追加并在报告中说明。
const elementComponents: Plugin[] = [
  ElButton,
  ElConfigProvider,
  ElDrawer,
  ElEmpty,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTag,
  ElTooltip
]
elementComponents.forEach(component => app.use(component))

app.use(createPinia())
app.use(router)

app.mount('#app')
