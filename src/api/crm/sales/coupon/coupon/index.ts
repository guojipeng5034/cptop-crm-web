import request from '@/config/axios'

// 优惠券 VO
export interface CouponVO {
  id: number // 自增主键
  name: string // 优惠券名字
  discount: number // 优惠金额
  validityType: number // 有效期类型
  expireDays: number // 有效天数
  effectiveTime: Date // 生效时间
  noneffctiveTime: Date // 失效时间
  inventory: number // 库存
  explain: string // 优惠券说明
  couponType: number // 优惠券分类
  packageType: number // 可用套餐分类
  enableStatus: number // 启用状态
  getatableStatus: number // 上架状态
}

// 优惠券 API
export const CouponApi = {
  // 查询优惠券分页
  getCouponPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/coupon/page`, params })
  },

  // 查询优惠券详情
  getCoupon: async (id: number) => {
    return await request.get({ url: `/crm/sales/coupon/get?id=` + id })
  },

  // 获取优惠券信息列表
  getSimpleCouponList: async () => {
    return request.get({ url: '/crm/sales/coupon/simple-list' })
  },

  // 获取全部优惠券信息列表（包含已过期）
  getAllCouponSimpleList: async () => {
    return request.get({ url: 'crm/sales/coupon/simple-valid-list'})
  },

  // 查询有效优惠券分页
  getSimpleSelectPage: async (params: any) => {
    return await request.get({ url: '/crm/sales/coupon/simple-select-page', params })
  },

  // 新增优惠券
  createCoupon: async (data: CouponVO) => {
    return await request.post({ url: `/crm/sales/coupon/create`, data })
  },

  // 修改优惠券
  updateCoupon: async (data: CouponVO) => {
    return await request.put({ url: `/crm/sales/coupon/update`, data })
  },

  // 修改优惠券启用状态
  updateCouponEnableStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/sales/coupon/update-enableStatus?id=${id}&enable_status=${status}` })
  },

  // 修改优惠券上架状态
  updateCouponGetatableStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/sales/coupon/update-getatableStatus?id=${id}&getatable_status=${status}` })
  },

  // 根据优惠券 id 列表获得优惠券基本信息
  getByList: async (ids) => {
    return await request.get({url: `/crm/sales/coupon/get-by-list?ids=${ids}`})
  },

  // 根据优惠券 id 列表获得优惠券基本信息
  getCouponSearchList: async (fuzzyQuery: string) => {
    return await request.get({url: `/crm/sales/coupon/get-by-fuzzy?fuzzyQuery=${fuzzyQuery}`})
  },

  // 删除优惠券
  deleteCoupon: async (id: number) => {
    return await request.delete({ url: `/crm/sales/coupon/delete?id=` + id })
  },

  // 导出优惠券 Excel
  exportCoupon: async (params) => {
    return await request.download({ url: `/crm/sales/coupon/export-excel`, params })
  },
}
