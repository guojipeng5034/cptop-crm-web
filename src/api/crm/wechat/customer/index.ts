import request from '@/config/axios'

// 微信推送学员 VO
export interface WechatCustomerVO {
  id: number // 主键
  customerId: number // 学员学号
  mentorId: number // 顾问ID
  pushTime: Date // 推送时间
  faliRemarks: string // 失败描述
  messageId: number // 消息表主键
  status: number // 推送状态
}

// 微信推送学员 API
export const WechatCustomerApi = {
  // 查询微信推送学员分页
  getWechatCustomerPage: async (params: any) => {
    return await request.get({ url: `/crm/wechat-customer/page`, params })
  },
  
  // 查询微信推送学员分页
  getWechatCustomerExtraPage: async (params: any) => {
    return await request.get({ url: `/crm/wechat-customer/customer_page`, params })
  },

  // 查询微信推送学员详情
  getWechatCustomer: async (id: number) => {
    return await request.get({ url: `/crm/wechat-customer/get?id=` + id })
  },

  // 新增微信推送学员
  createWechatCustomer: async (data: WechatCustomerVO) => {
    return await request.post({ url: `/crm/wechat-customer/create`, data })
  },

  // 修改微信推送学员
  updateWechatCustomer: async (data: WechatCustomerVO) => {
    return await request.put({ url: `/crm/wechat-customer/update`, data })
  },

  // 删除微信推送学员
  deleteWechatCustomer: async (id: number) => {
    return await request.delete({ url: `/crm/wechat-customer/delete?id=` + id })
  },

  // 导出微信推送学员 Excel
  exportWechatCustomer: async (params) => {
    return await request.download({ url: `/crm/wechat-customer/export-excel`, params })
  },

  // 重新推送
  reusePushWechatCustomer: async (id: number) => {
    return await request.post({ url: `/crm/wechat-customer/reuse-push?id=` + id })
  },
}