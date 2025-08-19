import request from '@/config/axios'

// 学员套餐续费日志 VO
export interface RenewLogVO {
  id: number //   自增id
  packageRenewId: number // 套餐续费id
  refuseRenewType: number // 拒绝续费的类型
  refuseReason: string // 拒绝续费的原因
  effectiveChatFlag: boolean // 是否有效沟通
  effectiveContent: string // 有效沟通的内容
}

// 学员套餐续费日志 API
export const RenewLogApi = {
  // 查询学员套餐续费日志分页
  getCustomerPackageRenewLogPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/customerpackagerenewlog/page`, params })
  },

  // 查询学员套餐续费日志详情
  getCustomerPackageRenewLog: async (id: number) => {
    return await request.get({ url: `/crm/packages/customerpackagerenewlog/get?id=` + id })
  },

  // 新增学员套餐续费日志
  createCustomerPackageRenewLog: async (data: RenewLogVO) => {
    return await request.post({ url: `/crm/packages/customerpackagerenewlog/create`, data })
  },

  // 修改学员套餐续费日志
  updateCustomerPackageRenewLog: async (data: RenewLogVO) => {
    return await request.put({ url: `/crm/packages/customerpackagerenewlog/update`, data })
  },

  // 删除学员套餐续费日志
  deleteCustomerPackageRenewLog: async (id: number) => {
    return await request.delete({ url: `/crm/packages/customerpackagerenewlog/delete?id=` + id })
  },

  // 导出学员套餐续费日志 Excel
  exportCustomerPackageRenewLog: async (params) => {
    return await request.download({ url: `/crm/packages/customerpackagerenewlog/export-excel`, params })
  },
}
