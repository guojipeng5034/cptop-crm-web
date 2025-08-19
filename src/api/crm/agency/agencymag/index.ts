import request from '@/config/axios'

// 代理 VO
export interface ChannelAgencyVO {
  id: number // 自增主键
  lineType: number // 线上/线下
  siteId: number // CN/CPZH/CNADT
  agencyName: string // 代理名字
  agencyPhone: string // 代理电话
  agencyAddress: string // 代理地址
  agencySource: number // 代理类型
  agencyStatus: number // 代理状态
  agencyStudentId: string // 代理学号
  agencyReferenceId: number // 代理推荐人id
  // 对公
  corporatePayeeName: undefined,
  corporatePaymentAccountNumber: undefined,
  corporatePaymentTin: undefined,
  corporatePaymentBank: undefined,
  corporatePaymentOpeningBank: undefined,
  corporatePaymentOpeningBankAccount: undefined,
  // 对私
  privatePayeeName: undefined,
  privatePaymentAccountNumber: undefined,
  privatePaymentBank: undefined,
  privatePaymentOpeningBank: undefined,
  privatePaymentOpeningBankAccount: undefined,
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  status: number // 状态
  remark: string // 备注
}

// 代理 API
export const ChannelAgencyApi = {
  // 查询代理分页
  getChannelAgencyPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/manage/agency/page`, params })
  },

  // 查询代理详情
  getChannelAgency: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/manage/agency/get-detail?id=` + id })
  },

  // 获取代理信息列表
  getSimpleChannelAgencyList: async () => {
    return await request.get({ url: '/crm/base/channel/manage/agency/simple-list' })
  },

  // 获取三级渠道代理列表
  getAgencySearchList: async (searchValue: string, type?: number, agencySource?: number) => {
    let url = `/crm/base/channel/manage/agency/search-list?searchValue=${searchValue}`
    if (type) url += `&type=${type}`
    if (agencySource) url += `&agencySource=${agencySource}`
    return request.get({ url })
  },

  // 新增代理
  createChannelAgency: async (data: ChannelAgencyVO) => {
    return await request.post({ url: `/crm/base/channel/manage/agency/create`, data })
  },

  // 修改代理
  updateChannelAgency: async (data: ChannelAgencyVO) => {
    return await request.put({ url: `/crm/base/channel/manage/agency/update-detail`, data })
  },
  
  // 修改代理状态
  updateChannelAgencyStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/base/channel/manage/agency/update-status?id=${id}&agency_status=${status}` })
  },

  // 删除代理
  deleteChannelAgency: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/manage/agency/delete?id=` + id })
  },

  // 导出代理 Excel
  exportChannelAgency: async (params) => {
    return await request.download({ url: `/crm/base/channel/manage/agency/export-excel`, params })
  },

  // 验证外部合作手机号是否重复
  channelAgencyCheckPhone: async (phone) => {
    return await request.get({ url: `/crm/base/channel/manage/agency/check-phone?phone=${phone}` })
  },
  
  // 负责人全量划分
  transferAllChannelAgency: async (data) => {
    return await request.post({ url: `/crm/base/channel/manage/agency/transfer-all`, data })
  },

   // 负责人批量划分
   transferBatchChannelAgency: async (data) => {
     return await request.post({url: `/crm/base/channel/manage/agency/transfer-batch`, data })
  },
  
  // 获得某个负责人名下代理列表
  getResponsibleAgencyPage: async (type, responsibleId) => {
    return await request.get({url: `/crm/base/channel/manage/agency/responsible-agency-page?type=${type}&responsibleId=${responsibleId}`})
 },
}
