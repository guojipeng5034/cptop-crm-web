import request from '@/config/axios'

// 广告 VO
export interface ChannelAdvertisementVO {
  id: number // 自增主键
  adChannel: number // 广告投放渠道
  adPlatform: number // 广告投放平台
  adMode: number // 广告方式
  adStartTime: Date // 广告投放时间
  adEndTime: Date // 广告失效时间
  adStatus: number // 广告状态
  lineType: number // 线上/线下
  siteId: number // CN/CPZH/CNADT
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  status: number // 状态
  remark: string // 备注
}

// 广告 API
export const ChannelAdvertisementApi = {
  // 查询广告分页
  getChannelAdvertisementPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/manage/advertisement/page`, params })
  },

  // 查询广告详情
  getChannelAdvertisement: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/manage/advertisement/get?id=` + id })
  },

  // 新增广告
  createChannelAdvertisement: async (data: ChannelAdvertisementVO) => {
    return await request.post({ url: `/crm/base/channel/manage/advertisement/create`, data })
  },

  // 修改广告
  updateChannelAdvertisement: async (data: ChannelAdvertisementVO) => {
    return await request.put({ url: `/crm/base/channel/manage/advertisement/update`, data })
  },

  // 删除广告
  deleteChannelAdvertisement: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/manage/advertisement/delete?id=` + id })
  },

  // 导出广告 Excel
  exportChannelAdvertisement: async (params) => {
    return await request.download({ url: `/crm/base/channel/manage/advertisement/export-excel`, params })
  },
}
