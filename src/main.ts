// 引入unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'
// 引入状态管理
import { setupStore } from '@/store'
import { startVersionChecker } from '@/utils/versionChecker.js'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入 form-create
import { setupFormCreate } from '@/plugins/formCreate'

// 引入 sentry
// import initSentry  from '@/plugins/sentry'

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

// 路由
import router, { setupRouter } from '@/router'

// 权限
import { setupAuth } from '@/directives'

import { createApp } from 'vue'

//import posthogPlugin from "./plugins/posthog"; //import the plugin.

import App from './App.vue'

import './permission'

import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患
import RemoteComponentsPlugin from './plugins/remoteComponents';

import initProject  from '@/utils/initProject'
initProject();

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  startVersionChecker()

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  setupAuth(app)

  await router.isReady()

  app.use(VueDOMPurifyHTML)
  // 注册所有远程组件
  app.use(RemoteComponentsPlugin)

  app.mount('#app')
}

setupAll()
Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
