// 远程模块组件映射和加载逻辑

// 远程模块组件映射
export const remoteModules = {
  // system 服务导出的内容
  system: {
    'area': './src/views/system/area/index.vue',
    'dept': './src/views/system/dept/index.vue',
    'dict': './src/views/system/dict/index.vue',
    'dict/data': './src/views/system/dict/data/index.vue',
    'loginlog': './src/views/system/loginlog/index.vue',
    'mail/account': './src/views/system/mail/account/index.vue',
    'mail/log': './src/views/system/mail/log/index.vue',
    'mail/template': './src/views/system/mail/template/index.vue',
    'menu': './src/views/system/menu/index.vue',
    'notice': './src/views/system/notice/index.vue',
    'notify/my': './src/views/system/notify/my/index.vue',
    'notify/message': './src/views/system/notify/message/index.vue',
    'notify/template': './src/views/system/notify/template/index.vue',
    'oauth2/client': './src/views/system/oauth2/client/index.vue',
    'oauth2/token': './src/views/system/oauth2/token/index.vue',
    'officePlace': './src/views/system/officePlace/index.vue',
    'operatelog': './src/views/system/operatelog/index.vue',
    'post': './src/views/system/post/index.vue',
    'role': './src/views/system/role/index.vue',
    'signature': './src/views/system/signature/index.vue',
    'site': './src/views/system/site/index.vue',
    'sms/channel': './src/views/system/sms/channel/index.vue',
    'sms/log': './src/views/system/sms/log/index.vue',
    'sms/template': './src/views/system/sms/template/index.vue',
    'social/client': './src/views/system/social/client/index.vue',
    'social/user': './src/views/system/social/user/index.vue',
    'tenant': './src/views/system/tenant/index.vue',
    'tenantPackage': './src/views/system/tenantPackage/index.vue',
    'user': './src/views/system/user/index.vue',
  },
  // Infra 服务导出的内容
  infra: {
    'apiAccessLog': './src/views/infra/apiAccessLog/index.vue',
    'apiErrorLog': './src/views/infra/apiErrorLog/index.vue',
    'build': './src/views/infra/build/index.vue',
    'codegen': './src/views/infra/codegen/index.vue',
    'codegen/EditTable': './src/views/infra/codegen/EditTable.vue',
    'config': './src/views/infra/config/index.vue',
    'dataSourceConfig': './src/views/infra/dataSourceConfig/index.vue',
    'druid': './src/views/infra/druid/index.vue',
    'file': './src/views/infra/file/index.vue',
    'fileConfig': './src/views/infra/fileConfig/index.vue',
    'job': './src/views/infra/job/index.vue',
    'job/logger': './src/views/infra/job/logger/index.vue',
    'redis': './src/views/infra/redis/index.vue',
    'server': './src/views/infra/server/index.vue',
    'skywalking': './src/views/infra/skywalking/index.vue',
    'swagger': './src/views/infra/swagger/index.vue',
    'webSocket': './src/views/infra/webSocket/index.vue',
  },
  // Report 服务导出的内容
  report: {
    'goview': './src/views/report/goview/index.vue',
    'jmreport': './src/views/report/jmreport/index.vue',
  }
}

/**
 * 获取远程组件
 * @param componentPath 组件路径
 * @returns 远程组件或undefined
 */
export const getRemoteComponent = (componentPath: string) => {
  if (!componentPath) return undefined
  
  // 检查是否是远程模块路径（例如：system/user, infra/job 等）
  const pathParts = componentPath.split('/')
  if (pathParts.length >= 1) {
    const moduleName = pathParts[0] // 获取模块名称（system, infra, report等）
    const subPath = pathParts.slice(1).join('/') // 获取子路径

    /* @vite-ignore */
    // 检查是否存在于远程模块映射中
    if (remoteModules[moduleName] && remoteModules[moduleName][subPath]) {
      // 根据模块类型返回对应的远程组件
      if (moduleName === 'system') {
        return () => import(/* @vite-ignore */ 'remote-system-page/' + subPath)
      } else if (moduleName === 'infra') {
        return () => import(/* @vite-ignore */ 'remote-system-page/' + subPath)
      } else if (moduleName === 'report') {
        return () => import(/* @vite-ignore */ 'remote-system-page/' + subPath)
      }
    }
  }
  
  return undefined
}

/* Layout */
export const Layout = () => import('remote-sys-base/Layout')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}
