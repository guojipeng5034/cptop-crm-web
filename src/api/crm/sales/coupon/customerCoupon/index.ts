import request from '@/config/axios'

// 学员优惠券 VO
export interface CustomerCouponVO {
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
export const CustomerCouponApi = {
  // 查询学员优惠券分页
  getCustomerCouponPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/customerCoupon/page`, params })
  },

  // 查询学员优惠券详情
  getCustomerCoupon: async (id: number) => {
    return await request.get({ url: `/crm/sales/customerCoupon/get?id=` + id })
  },

  // 获得批量优惠券模板
  getCustomerCouponTemplate: async () => {
    return await request.download({ url: `/crm/sales/customerCoupon/get-import-template`})
  },
  
  // 新增学员优惠券
  createCustomerCoupon: async (data: CustomerCouponVO) => {
    return await request.post({ url: `/crm/sales/customerCoupon/create`, data })
  },

  // 新增时验证学员是否存在相同优惠券
  validCustomerCoupon: async (data: CustomerCouponVO) => {
    return await request.post({ url: `/crm/sales/customerCoupon/valid`, data })
  },

  // 修改学员优惠券
  updateCustomerCoupon: async (data: CustomerCouponVO) => {
    return await request.put({ url: `/crm/sales/customerCoupon/update`, data })
  },

  // 删除学员优惠券
  deleteCustomerCoupon: async (id: number) => {
    return await request.delete({ url: `/crm/sales/customerCoupon/delete?id=` + id })
  },

  // 导出学员优惠券 Excel
  exportCustomerCoupon: async (params) => {
    return await request.download({ url: `/crm/sales/customerCoupon/export-excel`, params })
  },
}
