import request from '@/config/axios'

// 学员次卡 VO
export interface CustomerTicketVO {
  id: number // 自增Id
  customerId: number // 学员Id
  ticketCode: string // 次卡代码
  tickerName: string // 次卡名称
  returnType: number // 返还类型
  remark: string // 备注
}

// 学员次卡 API
export const CustomerTicketApi = {
  // 查询学员次卡分页
  getCustomerTicketPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/returnLog/ticket/page`, params })
  },

  // 查询学员次卡详情
  getCustomerTicket: async (id: number) => {
    return await request.get({ url: `/crm/sales/returnLog/ticket/get?id=` + id })
  },

  // 查询学员次卡详情
  getCustomerTicketTemplate: async () => {
    return await request.download({ url: `/crm/sales/returnLog/ticket/get-import-template`})
  },

  // 新增学员次卡
  createCustomerTicket: async (data: CustomerTicketVO) => {
    return await request.post({ url: `/crm/sales/returnLog/ticket/create`, data })
  },

  // 移除学员次卡
  removeCustomerTicket: async (data: CustomerTicketVO) => {
    return await request.post({ url: `/crm/sales/returnLog/ticket/remove`, data })
  },

  // 修改学员次卡
  updateCustomerTicket: async (data: CustomerTicketVO) => {
    return await request.put({ url: `/crm/sales/returnLog/ticket/update`, data })
  },

  // 删除学员次卡
  deleteCustomerTicket: async (id: number) => {
    return await request.delete({ url: `/crm/sales/returnLog/ticket/delete?id=` + id })
  },

  // 导出学员次卡 Excel
  exportCustomerTicket: async (params) => {
    return await request.download({ url: `/crm/sales/returnLog/ticket/export-excel`, params })
  },

  // 获取次卡精简信息列表
  getTicketSearchList: async (searchValue: string) => {
    return await request.get({ url: `/crm/sales/returnLog/ticket/search-list?searchValue=${searchValue}` })
  },
}
