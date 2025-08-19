/**
 * @file initProject.ts
 * @description 项目初始化配置文件
 * @author Trae
 * @createDate 2024-03-21
 *
 * 该文件负责项目的初始化配置，实现以下功能：
 * 1. 初始化axios配置，设置基础URL和API地址
 * 2. 配置应用标题和环境变量
 * 3. 初始化国际化语言设置
 * 4. 管理租户和OAuth2认证相关配置
 */

import initLocale from '@/hooks/web/useLocale'
import { initAxiosConfig, initEnvConfig } from '@/config/axios/envConfig'
import { useAppStore } from '@/store/modules/app'

// 初始化方法，供 main.ts 调用
const init = () => {
  // 初始化 axios 配置
  initAxiosConfig()
  // 设置 HTML 标签的 name 属性为项目标题（用于显示/特效等）
  //const htmlEl = document.documentElement
  const appTitle = import.meta.env.VITE_APP_TITLE;
  const NODE_ENV = import.meta.env.VITE_USER_NODE_ENV;

  // if (appTitle) {
  //   htmlEl.setAttribute('name', appTitle)
  // }
  const appStore = useAppStore()
  appStore.setTitle(appTitle)
  appStore.setNodeEnv(NODE_ENV)
  // 初始化语言配置
  initLocale()
}

export default init
