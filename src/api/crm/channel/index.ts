import request from '@/config/axios'

// 渠道页面 VO
export interface ChannelVO {
  id: number // 自增主键
  name: string // 页面名称
}

// 渠道页面 API
export const ChannelApi = {
  // 获取渠道页面精简信息列表
  getChannelNameSimpleList: async (params: any) => {
    return request.get({ url: '/crm/base/channel/manage/channel/simple-list', params })
  }
}
