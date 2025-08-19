import request from '@/config/axios'

// 代理佣金规则 VO
export interface AgencyCommissionRulesVO {
  id: number // 自增id
  ruleName: string // 佣金规则名称
  isUpgradeFlag: number // 是否可升级
  upgradePoints: number // 升级所需点数
  parentRulesId: string // 上级佣金规则父id
  description: string // 备注
  status: number // 状态
}

// 代理佣金规则 API
export const AgencyCommissionRulesApi = {
  // 查询代理佣金规则分页
  getAgencyCommissionRulesPage: async (params: any) => {
    return await request.get({ url: `/crm/base/commission/agencycommissionrules/page`, params })
  },

  // 查询代理佣金规则详情
  getAgencyCommissionRules: async (id: number) => {
    return await request.get({ url: `/crm/base/commission/agencycommissionrules/get?id=` + id })
  },

  // 获得代理佣金规则精简信息列表
  getSimpleAgencyCommissionRulesList: async () => {
    return await request.get({ url: `/crm/base/commission/agencycommissionrules/simple-list` })
  },

  // 获得代理佣金规则有效的精简信息列表
  getSimpleAgencyValidCommissionRulesList: async () => {
    return await request.get({ url: `/crm/base/commission/agencycommissionrules/valid-simple-list` })
  },

  // 新增代理佣金规则
  createAgencyCommissionRules: async (data: AgencyCommissionRulesVO) => {
    return await request.post({ url: `/crm/base/commission/agencycommissionrules/create`, data })
  },

  // 修改代理佣金规则
  updateAgencyCommissionRules: async (data: AgencyCommissionRulesVO) => {
    return await request.put({ url: `/crm/base/commission/agencycommissionrules/update`, data })
  },

  // 删除代理佣金规则
  deleteAgencyCommissionRules: async (id: number) => {
    return await request.delete({ url: `/crm/base/commission/agencycommissionrules/delete?id=` + id })
  },

  // 导出代理佣金规则 Excel
  exportAgencyCommissionRules: async (params) => {
    return await request.download({ url: `/crm/base/commission/agencycommissionrules/export-excel`, params })
  },
}
