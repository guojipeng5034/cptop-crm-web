import request from '@/config/axios'

// 代理佣金绑定 VO
export interface AgencyCommissionBindingVO {
  id: number // 自增id
  agencyId: number // 代理id
  ruleId: number // 佣金规则id
  isPrimaryAccount: number // 是否为主账号
}

// 代理佣金绑定 API
export const AgencyCommissionBindingApi = {
  // 查询代理佣金绑定分页
  getAgencyCommissionBindingPage: async (params: any) => {
    return await request.get({ url: `/crm/base/commission/agencycommissionbinding/page`, params })
  },

  // 查询代理佣金绑定详情
  getAgencyCommissionBinding: async (id: number) => {
    return await request.get({ url: `/crm/base/commission/agencycommissionbinding/get?id=` + id })
  },

  // 新增代理佣金绑定
  createAgencyCommissionBinding: async (data: AgencyCommissionBindingVO) => {
    return await request.post({ url: `/crm/base/commission/agencycommissionbinding/create`, data })
  },

  // 修改代理佣金绑定
  updateAgencyCommissionBinding: async (data: AgencyCommissionBindingVO) => {
    return await request.put({ url: `/crm/base/commission/agencycommissionbinding/update`, data })
  },

  // 删除代理佣金绑定
  deleteAgencyCommissionBinding: async (id: number) => {
    return await request.delete({ url: `/crm/base/commission/agencycommissionbinding/delete?id=` + id })
  },

  // 导出代理佣金绑定 Excel
  exportAgencyCommissionBinding: async (params) => {
    return await request.download({ url: `/crm/base/commission/agencycommissionbinding/export-excel`, params })
  },
}