import request from '@/config/axios'

// 学员星币管理 VO
export interface CustomerStarVO {
  id: number // 自增ID
  customerId: number // 学员id
  starCount: number // 星币数
  starSource: number // 星币来源
}

// 学员星币管理 API
export const CustomerStarApi = {
  // 查询学员星币管理分页
  getCustomerStarPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/customerstar/page`, params })
  },

  // 查询学员星币管理详情
  getCustomerStar: async (id: number) => {
    return await request.get({ url: `/crm/sales/customerstar/get?id=` + id })
  },

  // 新增学员星币管理
  createCustomerStar: async (data: CustomerStarVO) => {
    return await request.post({ url: `/crm/sales/customerstar/create`, data })
  },

  // 修改学员星币管理
  updateCustomerStar: async (data: CustomerStarVO) => {
    return await request.put({ url: `/crm/sales/customerstar/update`, data })
  },

  // 删除学员星币管理
  deleteCustomerStar: async (id: number) => {
    return await request.delete({ url: `/crm/sales/customerstar/delete?id=` + id })
  },

  // 导出学员星币管理 Excel
  exportCustomerStar: async (params) => {
    return await request.download({ url: `/crm/sales/customerstar/export-excel`, params })
  },
}