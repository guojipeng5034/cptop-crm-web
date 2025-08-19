import request from '@/config/axios'

// 代理佣金总额 VO
export interface AgencyCommissionCountVO {
  id: number // 自增id
  agencyId: number // 代理id
  newOrderCount: number // new订单总数
  newOrderActuallyPaidCount: number // new订单实付总额
  newOrderCommissionCount: number // new订单佣金总额
  renewOrderCount: number // renew订单总数
  renewOrderActuallyPaidCount: number // renew订单实付总额
  renewOrderCommissionCount: number // renew订单佣金总额
  totalCommissionCount: number // 总佣金
  secondaryAgencyCount: number // 二级代理订单总数
  secondaryAgencyActuallyPaidCount: number // 二级代理实付总额
  secondaryAgencyCommissionCount: number // 二级代理佣金总额
  customerRecommendationCount: number // 学员推荐订单总数
  customerRecommendationPaidCount: number // 学员推荐订单付费总数
  customerRecommendationActuallyPaidCount: number // 学员推荐实付总额
  customerRecommendationCommissionCount: number // 学员推荐佣金总额
  renewalTime: Date // 修改时间
}

// 代理佣金总额 API
export const AgencyCommissionCountApi = {
  // 查询代理佣金总额分页
  getAgencyCommissionCountPage: async (params: any) => {
    return await request.get({ url: `/crm/base/commission/agencycommissioncount/page`, params })
  },

  // 查询代理佣金总额详情
  getAgencyCommissionCount: async (id: number) => {
    return await request.get({ url: `/crm/base/commission/agencycommissioncount/get?id=` + id })
  },

  // 新增代理佣金总额
  createAgencyCommissionCount: async (data: AgencyCommissionCountVO) => {
    return await request.post({ url: `/crm/base/commission/agencycommissioncount/create`, data })
  },

  // 修改代理佣金总额
  updateAgencyCommissionCount: async (data: AgencyCommissionCountVO) => {
    return await request.put({ url: `/crm/base/commission/agencycommissioncount/update`, data })
  },

  // 删除代理佣金总额
  deleteAgencyCommissionCount: async (id: number) => {
    return await request.delete({ url: `/crm/base/commission/agencycommissioncount/delete?id=` + id })
  },

  // 导出代理佣金总额 Excel
  exportAgencyCommissionCount: async (params) => {
    return await request.download({ url: `/crm/base/commission/agencycommissioncount/export-excel`, params })
  },
}