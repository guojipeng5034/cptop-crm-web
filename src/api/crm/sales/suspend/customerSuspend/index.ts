import request from '@/config/axios'

// 学员优惠券 VO
export interface CustomerSuspendVO {
  id: number // 自增Id
  couponId: number // 优惠券ID
  customerId: number // 学员Id
  couponName: string // 优惠券名称
  couponAmount: number // 优惠金额
  status: number // 状态
  channel: string // 添加渠道
  expiredFrom: Date // 有效期开始
  expiredTo: Date // 有效期结束
  remark: string // 备注
  employTime: Date // 使用时间
  orderId: number // 订单Id
  referrerCustomerId: number // 被推荐人Id
}

// 学员优惠券 API
export const CustomerSuspendApi = {
  // 查询学员优惠券分页
  getCustomerSuspendPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/customerSuspend/page`, params })
  },

  // 获取停课券信息列表
  getSimpleSuspendList: async () => {
    return await request.get({ url: `/crm/sales/suspend/simple-list` })
  },

  // 查询学员优惠券详情
  getCustomerSuspend: async (id: number) => {
    return await request.get({ url: `/crm/sales/customerSuspend/get?id=` + id })
  },

  // 获得批量停课券模板
  getCustomerSuspendTemplate: async () => {
    return await request.download({ url: `/crm/sales/customerSuspend/get-import-template`})
  },

  // 新增学员优惠券
  createCustomerSuspend: async (data: CustomerSuspendVO) => {
    return await request.post({ url: `/crm/sales/customerSuspend/create`, data })
  },

  // 修改学员优惠券
  updateCustomerSuspend: async (data: CustomerSuspendVO) => {
    return await request.put({ url: `/crm/sales/customerSuspend/update`, data })
  },

  // 删除学员优惠券
  deleteCustomerSuspend: async (id: number) => {
    return await request.delete({ url: `/crm/sales/customerSuspend/delete?id=` + id })
  },

  // 导出学员优惠券 Excel
  exportCustomerSuspend: async (params) => {
    return await request.download({ url: `/crm/sales/customerSuspend/export-excel`, params })
  },
}
