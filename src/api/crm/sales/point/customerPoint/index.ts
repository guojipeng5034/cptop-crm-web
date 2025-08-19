import request from '@/config/axios'

// 学员积分记录VO
export interface CustomerPointVO {
  id: number // 自增主键
  customerId: number // 学员ID
  pointsNum: number // 积分数量
  channel: string // 添加渠道
  orderId: number // 订单Id
  paymentCustomerId: number // 推荐的付费学员Id
  remark: string // 备注
}

// 学员积分记录VO API
export const CustomerPointApi = {
  // 查询积分记录分页
  getCustomerPointPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/returnLog/points/page`, params })
  },

  // 查询学员积分记录VO详情
  getCustomerPoint: async (id: number) => {
    return await request.get({ url: `/crm/sales/returnLog/points/get?id=` + id })
  },

  // 获得批量导入积分模板
  getCustomerPointTemplate: async () => {
    return await request.download({ url: `/crm/sales/returnLog/points/get-import-template`})
  },

  // 新增学员积分记录VO
  createCustomerPoint: async (data: CustomerPointVO) => {
    return await request.post({ url: `/crm/sales/returnLog/points/create`, data })
  },

  // 修改学员积分记录VO
  updateCustomerPoint: async (data: CustomerPointVO) => {
    return await request.put({ url: `/crm/sales/returnLog/points/update`, data })
  },

  // 删除学员积分记录VO
  deleteCustomerPoint: async (id: number) => {
    return await request.delete({ url: `/crm/sales/returnLog/points/delete?id=` + id })
  },

  // 导出学员积分记录VO Excel
  exportCustomerPoint: async (params) => {
    return await request.download({ url: `/crm/sales/returnLog/points/export-excel`, params })
  },

  // 查询学员积分记录总数和已使用数
  getCustomerPointCount: async (customerId: number) => {
    return await request.get({ url: `/crm/sales/returnLog/points/get-count?customerId=` + customerId })
  },
}
