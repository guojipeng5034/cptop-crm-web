import request from '@/config/axios'

// 预警 VO
export interface WarningVO {
  warningType: number // 预警类型：字典
  warningContent: string // 预警内容
  customerId: number // 学员Id
  wechatMsg: string // 微信推送话术
  readStatus: number // 已读状态：字典
  handleStatus: number // 处理状态：字典
  readTime: Date // 已读时间
  handleTime: Date // 处理时间
  readUserId: number // 阅读人
  handleUserId: number // 处理人
  agreeImage: string[] // 图片
}

// 预警 API
export const WarningApi = {
  // 查询预警分页
  getWarningPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/warning/page`, params })
  },

  // 查询预警详情
  getWarning: async (id: number) => {
    return await request.get({ url: `/crm/customer/warning/get?id=` + id })
  },

  // 更新预警处理状态
  updateHandleStatus: async (id: number) => {
    return await request.get({ url: `/crm/customer/warning/updateHandleStatus?id=` + id })
  },

  // 新增预警
  createWarning: async (data: WarningVO) => {
    return await request.post({ url: `/crm/customer/warning/create`, data })
  },

  // 修改预警
  updateWarning: async (data: WarningVO) => {
    return await request.put({ url: `/crm/customer/warning/update`, data })
  },

  // 删除预警
  deleteWarning: async (id: number) => {
    return await request.delete({ url: `/crm/customer/warning/delete?id=` + id })
  },

  // 导出预警 Excel
  exportWarning: async (params) => {
    return await request.download({ url: `/crm/customer/warning/export-excel`, params })
  },
}
