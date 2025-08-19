// src/plugins/remoteComponents.js
import { defineAsyncComponent } from 'vue';
import { getRemoteComponentsNames, getRemoteComponentsPaths } from '@/../build/vite/federation-import';

/**
 * 预加载所有远程组件，并全局注册到 Vue 应用
 * @param {Object} app - Vue 应用实例
 */
export function registerRemoteComponents(app) {
  const components = getRemoteComponentsNames();
  const componentPaths = getRemoteComponentsPaths();
  
  // 将远程组件路径和名称映射为对象
  const componentMap = {};
  components.forEach((name, index) => {
    componentMap[name] = componentPaths[index];
  });
  
  // 注册所有远程组件
  for (const [name, path] of Object.entries(componentMap)) {
    app.component(
      name,
      defineAsyncComponent(() => import(/* @vite-ignore */ path))
    );
  }
  
  console.log(`[Remote Components] Registered ${Object.keys(componentMap).length} components`);
}

export default {
  install(app) {
    registerRemoteComponents(app);
  }
};
