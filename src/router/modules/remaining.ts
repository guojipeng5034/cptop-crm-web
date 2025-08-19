import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()

import {loadRemoteRoutes}  from './hostRoutes';


/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [

  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('remote-system-page/system/notify/my'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/package',
    component: Layout,
    name: 'Package',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/package-record',
        component: () => import('@/views/crm/package/record/index.vue'),
        name: 'Record',
        meta: {
          title: '学员套餐与订单绑定情况',
          noCache: true,
          hidden: true,
          canTo: true,
          breadcrumb: true
        },
      },
      {
        path: '/package-stoplog',
        component: () => import('@/views/crm/package/stopLog/index.vue'),
        name: 'StopLog',
        meta: {
          title: '学员套餐与停课情况',
          noCache: true,
          hidden: true,
          canTo: true,
          breadcrumb: true
        },
      },
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: 'Customer',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/check-assign-form',
        component: () => import('@/views/crm/customer/assign/CheckAssignForm.vue'),
        name: 'CheckAssignForm',
        meta: {
          title: '线索分配人员导入核对',
          noCache: true,
          hidden: true,
          canTo: true,
          breadcrumb: true
        },
      },
    ]
  },
  {
    path: '/wechat',
    component: Layout,
    name: 'wechat',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/message-form',
        component: () => import('@/views/crm/wechat/message/MessageForm.vue'),
        name: 'MessageForm',
        meta: {
          title: '批量推送微信',
          noCache: true,
          hidden: true,
          canTo: true,
          breadcrumb: true
        },
      },
    ]
  },
 
  // {
  //   path: '/channel',
  //   component: Layout,
  //   name: 'channel',
  //   meta: {
  //     hidden: true
  //   },
  //   children: [
  //     {
  //       path: 'channel-page/:channel/:pageType',
  //       component: () => import('@/views/crm/base/channel/page/index.vue'),
  //       name: 'CrmPage',
  //       meta: {
  //         title: 'CRM页面信息',
  //         noCache: true,
  //         hidden: true,
  //         canTo: true,
  //         icon: '',
  //         activeMenu: '/crm/base'
  //       }
  //     }
  //   ]
  // },

  {
    path: '/login',
    component: () => import('remote-system-page/LoginCRM'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
]

const combinedRoutes: AppRouteRecordRaw[] = [...loadRemoteRoutes(), ...remainingRouter]
export default combinedRoutes
