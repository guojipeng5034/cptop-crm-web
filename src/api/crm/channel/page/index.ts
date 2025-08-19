import request from '@/config/axios'

// 渠道页面 VO
export interface ChannelPageVO {
  id: number // 自增主键
  agencyId: number // 代理id
  pageName: string // 渠道细分
  pageType: number // 渠道大类
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  pageTags: object // 页面标签
  pageLinkId: string // 页面链接
  pageBanner: string // 页面banner
  pagePoster: string // 海报
  facebookPicture: string // facebook分享图片
  facebookTitle: string // facebook标题
  status: number // 状态
  remark: string // 备注
}

// 渠道页面 API
export const ChannelPageApi = {
  // 查询渠道页面分页
  getChannelPagePage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/page/page`, params })
  },

  // 查询渠道页面详情
  getChannelPage: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/page/get?id=` + id })
  },

  // 新增渠道页面
  createChannelPage: async (data: ChannelPageVO) => {
    return await request.post({ url: `/crm/base/channel/page/create`, data })
  },

  // 获取渠道页面精简信息列表
  getSimpleChannelPageList: async () => {
    return request.get({ url: '/crm/base/channel/page/simple-list'})
  },

  // 远程获取页面信息列表
  getPageSearchList: async (searchValue: string, oneLevel?: number, twoLevel?: number, threeLevel?: number) => {
    let url = `/crm/base/channel/page/search-list?searchValue=${searchValue}`
    if (oneLevel) url += `&oneLevel=${oneLevel}`
    if (twoLevel) url += `&twoLevel=${twoLevel}`
    if (threeLevel) url += `&threeLevel=${threeLevel}`
    return request.get({ url })
  },

  // 修改渠道页面
  updateChannelPage: async (data: ChannelPageVO) => {
    return await request.put({ url: `/crm/base/channel/page/update`, data })
  },

  // 删除渠道页面
  deleteChannelPage: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/page/delete?id=` + id })
  },

  // 导出渠道页面 Excel
  exportChannelPage: async (params) => {
    return await request.download({ url: `/crm/base/channel/page/export-excel`, params })
  },
}
