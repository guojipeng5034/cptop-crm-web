import request from '@/config/axios'

// 注册链接 VO
export interface RegisterLinkVO {
  id: number // 自增主键
  pageTitle: string // 页面标题
  pageUrl: string // 页面链接
  status: number // 状态
  remark: string // 备注
}

// 注册链接 API
export const RegisterLinkApi = {
  // 查询注册链接分页
  getChannelRegisterLinkPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/registerlink/page`, params })
  },

  // 查询注册链接详情
  getChannelRegisterLink: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/registerlink/get?id=` + id })
  },

  // 获取注册链接信息列表
  getSimpleChannelRegisterLinkList: async () => {
    return request.get({ url: '/crm/base/channel/registerlink/simple-list' })
  },

  // 新增注册链接
  createChannelRegisterLink: async (data: RegisterLinkVO) => {
    return await request.post({ url: `/crm/base/channel/registerlink/create`, data })
  },

  // 修改注册链接
  updateChannelRegisterLink: async (data: RegisterLinkVO) => {
    return await request.put({ url: `/crm/base/channel/registerlink/update`, data })
  },

  // 删除注册链接
  deleteChannelRegisterLink: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/registerlink/delete?id=` + id })
  },

  // 导出注册链接 Excel
  exportChannelRegisterLink: async (params) => {
    return await request.download({ url: `/crm/base/channel/registerlink/export-excel`, params })
  },
}
