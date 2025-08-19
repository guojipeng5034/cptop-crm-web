import Store  from 'remote-sys-base/Store';
import { flatMultiLevelRoutes, generateRoute } from '@/utils/routerHelper'

const  permission = Store.remote_permission;
// 注入自定义方法
permission.routerHelper.flatMultiLevelRoutes = flatMultiLevelRoutes;
permission.routerHelper.generateRoute = generateRoute;

export const {
  PermissionState,
  usePermissionStore,
  usePermissionStoreWithOut
} = permission;
