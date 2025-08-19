import request from '@/config/axios'

// 新媒体渠道 VO
export interface ChannelNewMediaVO {
  id: number // 自增主键
  newMediaPlatform: number // 新媒体平台
  accountName: string // 账号名
  accountPosition: number // 账号定位
  accountType: number // 账号类型
  accountSubject: string // 企业认证主体
  accountPhone: string // 绑定手机号
  accountStatus: number // 账号状态
  lineType: number // 线上/线下
  siteId: number // CN/CPZH/CNADT
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  status: number // 状态
  remark: string // 备注
}

// 新媒体渠道 API
export const ChannelNewMediaApi = {
  // 查询新媒体渠道分页
  getChannelNewMediaPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/manage/newmedia/page`, params })
  },

  // 查询新媒体渠道详情
  getChannelNewMedia: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/manage/newmedia/get?id=` + id })
  },

  // 新增新媒体渠道
  createChannelNewMedia: async (data: ChannelNewMediaVO) => {
    return await request.post({ url: `/crm/base/channel/manage/newmedia/create`, data })
  },

  // 修改新媒体渠道
  updateChannelNewMedia: async (data: ChannelNewMediaVO) => {
    return await request.put({ url: `/crm/base/channel/manage/newmedia/update`, data })
  },

  // 删除新媒体渠道
  deleteChannelNewMedia: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/manage/newmedia/delete?id=` + id })
  },

  // 导出新媒体渠道 Excel
  exportChannelNewMedia: async (params) => {
    return await request.download({ url: `/crm/base/channel/manage/newmedia/export-excel`, params })
  },
}
