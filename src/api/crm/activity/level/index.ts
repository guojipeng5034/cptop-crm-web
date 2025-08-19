import request from '@/config/axios'

// 学员分类 VO
export interface ActivityLevelVO {
  id: number // 自增Id
  customerId: number // 学员id
  activityCount: number // 参与活动次数
  registerCount: number // 注册次数
  paymentCount: number // 付费次数
  typeId: number // 类型：字典
  belongMonth: string // 归属月份：2024-06
}

// 学员分类 API
export const ActivityLevelApi = {
  // 查询学员分类分页
  getCustomerLevelPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/level/page`, params })
  },

  // 查询学员分类详情
  getCustomerLevel: async (id: number) => {
    return await request.get({ url: `/crm/activity/level/get?id=` + id })
  },

  // 新增学员分类
  createCustomerLevel: async (data: ActivityLevelVO) => {
    return await request.post({ url: `/crm/activity/level/create`, data })
  },

  // 修改学员分类
  updateCustomerLevel: async (data: ActivityLevelVO) => {
    return await request.put({ url: `/crm/activity/level/update`, data })
  },

  // 生效活动下的海报列表
  getEffectiveCampaignPoster: async (customerId: number) => {
    return await request.get({ url: `/crm/activity/level/getEffectiveCampaignPoster?customerId=` + customerId })
  },

  // 删除学员分类
  deleteCustomerLevel: async (id: number) => {
    return await request.delete({ url: `/crm/activity/level/delete?id=` + id })
  },

  // 导出学员分类 Excel
  exportCustomerLevel: async (params) => {
    return await request.download({ url: `/crm/activity/level/export-excel`, params })
  },
}
