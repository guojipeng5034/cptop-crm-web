import request from '@/config/axios'

// 海报设置 VO
export interface PosterVO {
  id: number // 自增主键
  activityId: number // 活动id
  activityCode: string // 活动代码（用于公众号key的设置）
  qrCodeXCoordinate: number // 二维码X轴坐标
  qrCodeYCoordinate: number // 二维码Y轴坐标
  posterImg: object // 海报地址:允许同时上传多张
  posterType: number // 海报类型：普通海报&diy海报
  wechatContentType: number // 公众号推送的内容类型:文本、图片、声音
  qrCodeLength: number // 微信二维码的长度
  qrCodeWidth: number // 微信二维码的宽度
  textDisplayFlag: boolean // 是否合成文案
  textXCoordinate: object // 文案的X轴坐标：允许多个文案
  textYCoordinate: object // 文案的Y轴坐标：允许多个文案
  textFont: object // 文案字体：允许多个字体
  textSize: object // 文案字体大小：允许多个字体
  textColor: object // 文案字体颜色：允许多个字体
  scriptContent: string // 提取海报的话术：用于发送给学员让学员分享朋友圈
  voiceContent: object // voice的地址：允许多个voice
}

// 海报设置 API
export const PosterApi = {
  // 获得海报设置的本地字体
  getFonts: async () => {
    return await request.get({ url: `/crm/activity/postersetting/getFonts` })
  },

  // 获取海报页面精简信息列表
  getSimplePostersettingPageList: async () => {
    return request.get({ url: '/crm/activity/postersetting/channel/simple-list' })
  },

  // 查询海报设置分页
  getPosterSettingPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/postersetting/page`, params })
  },

  // 查询海报设置详情
  getPosterSetting: async (id: number) => {
    return await request.get({ url: `/crm/activity/postersetting/get?id=` + id })
  },

  // 获得海报预览
  getPreviewPoster: async (data: PosterVO) => {
    return await request.post({ url: `/crm/activity/postersetting/getPreviewPoster`, data })
  },

  // 新增海报设置
  createPosterSetting: async (data: PosterVO) => {
    return await request.post({ url: `/crm/activity/postersetting/create`, data })
  },

  // 修改海报设置
  updatePosterSetting: async (data: PosterVO) => {
    return await request.put({ url: `/crm/activity/postersetting/update`, data })
  },

  // 删除海报设置
  deletePosterSetting: async (id: number) => {
    return await request.delete({ url: `/crm/activity/postersetting/delete?id=` + id })
  },

  // 导出海报设置 Excel
  exportPosterSetting: async (params) => {
    return await request.download({ url: `/crm/activity/postersetting/export-excel`, params })
  },

  // 生效活动下的海报列表
  getEffectiveCampaignPoster: async (customerId: number) => {
    return await request.get({ url: `/crm/activity/postersetting/getEffectiveCampaignPoster?customerId=` + customerId })
  },

  // 获得合成海报
  getCompositionPoster: async (activityId: number, customerId: number, referrerId: string) => {
    return await request.get({ url: `/crm/activity/postersetting/getCompositionPoster?activityId=${activityId}&customerId=${customerId}&referrerId=${referrerId}` })
  }
}
