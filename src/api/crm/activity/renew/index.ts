import request from '@/config/axios'

// 学员套餐续费 VO
export interface RenewVO {
  id: number // 自增ID
  customerId: number // 学员id
  customerLessonManner: number // 学员上课方式
  packageRecordId: number // 订单和套餐绑定的记录ID
  renewFlag: boolean // 是否续费：默认未续费
  customerPackageId: number // 学员当前运行中的套餐ID
  activityJoinFlag: boolean // 是否参与活动：默认未参与
  exitSplitOrderFlag: boolean // 是否存在分次支付订单：默认不存在
  originalExpiresDate: Date // 原到期日
  packageMonth: string // 归属月份
  mentorId: number // mentor
  agencySource: number // 代理类型
  activityId: number // 活动限制
  deptId: Array<number> // 部门
}

// 学员套餐续费 API
export const RenewApi = {
  // 查询学员套餐续费分页
  getCustomerPackageRenewPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/customerpackagerenew/page`, params })
  },

  // 查询学员套餐续费详情
  getCustomerPackageRenew: async (id: number) => {
    return await request.get({ url: `/crm/packages/customerpackagerenew/get?id=` + id })
  },

  // 新增学员套餐续费
  createCustomerPackageRenew: async (data: RenewVO) => {
    return await request.post({ url: `/crm/packages/customerpackagerenew/create`, data })
  },

  // 修改学员套餐续费
  updateCustomerPackageRenew: async (data: RenewVO) => {
    return await request.put({ url: `/crm/packages/customerpackagerenew/update`, data })
  },

  // 生效活动下的海报列表
  getEffectiveCampaignPoster: async (customerId: number) => {
    return await request.get({ url: `/crm/packages/customerpackagerenew/getEffectiveCampaignPoster?customerId=` + customerId })
  },

  // 删除学员套餐续费
  deleteCustomerPackageRenew: async (id: number) => {
    return await request.delete({ url: `/crm/packages/customerpackagerenew/delete?id=` + id })
  },

  // 导出学员套餐续费 Excel
  exportCustomerPackageRenew: async (params) => {
    return await request.download({ url: `/crm/packages/customerpackagerenew/export-excel`, params })
  },
}
