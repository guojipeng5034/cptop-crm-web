import request from '@/config/axios'

// 停课券 VO
export interface SuspendVO {
  id: number // 自增主键
  name: string // 停课券名字
  discount: number, // 优惠金额
  validityType: number // 有效期类型
  expireDays: number // 有效天数
  effectiveTime: Date // 生效时间
  noneffctiveTime: Date // 失效时间
  couponTotal: number // 优惠券总数
  couponSent: number // 已发放
  inventory: number // 库存
  explain: string // 停课券说明
  couponType: number // 优惠券分类
  packageType: number // 可用套餐分类
  enableStatus: number // 启用状态
  getatableStatus: number // 上架状态
}

// 停课券 API
export const SuspendApi = {
  // 查询停课券分页
  getSuspendPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/suspend/page`, params })
  },

  // 查询停课券详情
  getSuspend: async (id: number) => {
    return await request.get({ url: `/crm/sales/suspend/get?id=` + id })
  },

  // 获取停课券信息列表
  getSimpleSuspendList: async () => {
    return request.get({ url: '/crm/sales/suspend/simple-list' })
  },

  // 新增停课券
  createSuspend: async (data: SuspendVO) => {
    return await request.post({ url: `/crm/sales/suspend/create`, data })
  },

  // 修改停课券
  updateSuspend: async (data: SuspendVO) => {
    return await request.put({ url: `/crm/sales/suspend/update`, data })
  },

  // 修改停课券启用状态
  updateSuspendEnableStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/sales/suspend/update-enableStatus?id=${id}&enable_status=${status}` })
  },

  // 修改停课券上架状态
  updateSuspendGetatableStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/sales/suspend/update-getatableStatus?id=${id}&getatable_status=${status}` })
  },

  // 删除停课券
  deleteSuspend: async (id: number) => {
    return await request.delete({ url: `/crm/sales/suspend/delete?id=` + id })
  },

  // 导出停课券 Excel
  exportSuspend: async (params) => {
    return await request.download({ url: `/crm/sales/suspend/export-excel`, params })
  },
}
