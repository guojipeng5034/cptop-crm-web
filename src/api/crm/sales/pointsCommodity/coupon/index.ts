import request from '@/config/axios'

// 积分商品券库 VO
export interface PointsCouponVO {
  id: number // 主键
  couponLink: string // 券码链接
  type: number // 类型:1百佳超市券 2:奇华饼券
  status: number // 使用状态: 1.未使用  2:已使用 字典参考:promotion_coupon_status
  orderId: number // 订单号
  employTime: Date // 使用时间
}

// 积分商品券库 API
export const PointsCouponApi = {
  // 查询积分商品券库分页
  getPointsCouponPage: async (params: any) => {
    return await request.get({ url: `/crm/points-coupon/page`, params })
  },

  // 查询积分商品券库详情
  getPointsCoupon: async (id: number) => {
    return await request.get({ url: `/crm/points-coupon/get?id=` + id })
  },

  // 新增积分商品券库
  createPointsCoupon: async (data: PointsCouponVO) => {
    return await request.post({ url: `/crm/points-coupon/create`, data })
  },

  // 修改积分商品券库
  updatePointsCoupon: async (data: PointsCouponVO) => {
    return await request.put({ url: `/crm/points-coupon/update`, data })
  },

  // 删除积分商品券库
  deletePointsCoupon: async (id: number) => {
    return await request.delete({ url: `/crm/points-coupon/delete?id=` + id })
  },

  // 导出积分商品券库 Excel
  exportPointsCoupon: async (params) => {
    return await request.download({ url: `/crm/points-coupon/export-excel`, params })
  },

  // 获得导入优惠券模板
  exportCouponTemplate: async () => {
    return await request.download({ url: `/crm/points-coupon/get-import-template` })
  },
}