import request from '@/config/axios'

// 优惠券互斥组记录 VO
export interface CouponMutexGroupVO {
  id: number // 主键
  groupName: string // 组名
  groupType: number // 组类型
  couponIds: object // 优惠券列表
}

// 优惠券互斥组记录 API
export const CouponMutexGroupApi = {
  // 查询优惠券互斥组记录分页
  getCouponMutexGroupPage: async (params: any) => {
    return await request.get({ url: `/crm/coupon-mutex-group/page`, params })
  },

  // 查询优惠券互斥组记录详情
  getCouponMutexGroup: async (id: number) => {
    return await request.get({ url: `/crm/coupon-mutex-group/get?id=` + id })
  },

  // 查询优惠券互斥组列表
  getSimpleCouponMutexGroupList: async () => {
    return await request.get({ url: `/crm/coupon-mutex-group/simple-all-list` })
  },

  // 根据优惠券组 id 列表获得优惠券基本信息
  getSimpleCouponMutexGroupListByGroupIds: async (ids) => {
    return await request.get({ url: `/crm/coupon-mutex-group/get-by-list?ids=${ids}` })
  },

  // 新增优惠券互斥组记录
  createCouponMutexGroup: async (data: CouponMutexGroupVO) => {
    return await request.post({ url: `/crm/coupon-mutex-group/create`, data })
  },

  // 修改优惠券互斥组记录
  updateCouponMutexGroup: async (data: CouponMutexGroupVO) => {
    return await request.put({ url: `/crm/coupon-mutex-group/update`, data })
  },

  // 删除优惠券互斥组记录
  deleteCouponMutexGroup: async (id: number) => {
    return await request.delete({ url: `/crm/coupon-mutex-group/delete?id=` + id })
  },

  // 导出优惠券互斥组记录 Excel
  exportCouponMutexGroup: async (params) => {
    return await request.download({ url: `/crm/coupon-mutex-group/export-excel`, params })
  },
}
