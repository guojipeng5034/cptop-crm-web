import request from '@/config/axios'

// 打卡记录 VO
export interface ActivityClockVO {
  id: number // 自增id
  customerId: number // 学员Id
  packageId: number // 套餐Id
  lessonStartTime: Date // 首次开课时间
  clockStatus: number //  打卡状态：字典
  clockNum: number // 打卡次数：字典 
  clockMonth: string // 打卡归属月份:2024-06
}

// 打卡记录 API
export const  ActivityClockApi = {
  // 查询打卡记录分页
  getCustomerClockPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/clock/page`, params })
  },

  // 查询打卡记录详情
  getCustomerClock: async (id: number) => {
    return await request.get({ url: `/crm/activity/clock/get?id=` + id })
  },

  // 新增打卡记录
  createCustomerClock: async (data: ActivityClockVO) => {
    return await request.post({ url: `/crm/activity/clock/create`, data })
  },

  // 修改打卡记录
  updateCustomerClock: async (data: ActivityClockVO) => {
    return await request.put({ url: `/crm/activity/clock/update`, data })
  },

  // 生效活动下的海报列表
  getEffectiveCampaignPoster: async (customerId: number) => {
    return await request.get({ url: `/crm/activity/clock/getEffectiveCampaignPoster?customerId=` + customerId })
  },

  // 删除打卡记录
  deleteCustomerClock: async (id: number) => {
    return await request.delete({ url: `/crm/activity/clock/delete?id=` + id })
  },

  // 导出打卡记录 Excel
  exportCustomerClock: async (params) => {
    return await request.download({ url: `/crm/activity/clock/export-excel`, params })
  },
}
