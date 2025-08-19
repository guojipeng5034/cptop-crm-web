import request from '@/config/axios'

// 自然流量渠道 VO
export interface ChannelNaturalFlowVO {
  id: number // 自增主键
  naturalFlowSource: number // 自然流量来源
  naturalFlowRegisterType: number // 注册方式
  lineType: number // 线上/线下
  siteId: number // CN/CPZH/CNADT
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  status: number // 状态
  remark: string // 备注
}

// 自然流量渠道 API
export const ChannelNaturalFlowApi = {
  // 查询自然流量渠道分页
  getChannelNaturalFlowPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/manage/naturalflow/page`, params })
  },

  // 查询自然流量渠道详情
  getChannelNaturalFlow: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/manage/naturalflow/get?id=` + id })
  },

  // 新增自然流量渠道
  createChannelNaturalFlow: async (data: ChannelNaturalFlowVO) => {
    return await request.post({ url: `/crm/base/channel/manage/naturalflow/create`, data })
  },

  // 修改自然流量渠道
  updateChannelNaturalFlow: async (data: ChannelNaturalFlowVO) => {
    return await request.put({ url: `/crm/base/channel/manage/naturalflow/update`, data })
  },

  // 删除自然流量渠道
  deleteChannelNaturalFlow: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/manage/naturalflow/delete?id=` + id })
  },

  // 导出自然流量渠道 Excel
  exportChannelNaturalFlow: async (params) => {
    return await request.download({ url: `/crm/base/channel/manage/naturalflow/export-excel`, params })
  },
}
