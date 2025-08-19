// hostRoutes.js
import { Layout } from '@/utils/routerHelper'
const { t } = useI18n()

import {
  getRemoteRoutes,
  Redirect,
  HomeIndex,
  Profile,
  MyNotifyMessage,
  SystemDictData,
  InfraCodegenEditTable,
  InfraJobLog,
  Login,
  NoAccess,
  NoFound,
  Error,
  SystemSelection
} from 'remote-sys-base/Routes_Remaining'

// Component mapping
const componentMap = {
  Redirect: Redirect,
  HomeIndex: HomeIndex,
  Profile: Profile,
  MyNotifyMessage: MyNotifyMessage,
  SystemDictData: SystemDictData,
  InfraCodegenEditTable: InfraCodegenEditTable,
  InfraJobLog: InfraJobLog,
  Login: Login,
  NoAccess: NoAccess,
  NoFound: NoFound,
  Error: Error,
  SystemSelection: SystemSelection
}

// This function processes routes to replace string components with actual components
function processRoutes(routes) {
  return routes.map((route) => {
    const processedRoute = { ...route }
    // Handle component if it's a string reference
    if (typeof processedRoute.component === 'string' && componentMap[processedRoute.component]) {
      processedRoute.component = componentMap[processedRoute.component]
    }
    // Process children recursively
    if (processedRoute.children && processedRoute.children.length > 0) {
      processedRoute.children = processRoutes(processedRoute.children)
    }

    return processedRoute
  })
}

export function loadRemoteRoutes() {
  // Get routes with string component references
  const rawRoutes = getRemoteRoutes(t, Layout)
  // Process routes to replace string references with actual components
  return processRoutes(rawRoutes)
}
