import request from '@/config/axios'

// 微信推送内容 VO
export interface WechatMessageVO {
  id: number // ID，自增主键
  title: string // 标题
  content: string // 文本内容
  pic: string[] // 	图片
  video: string[] // 视频
  posterPic: number // 活动
  audio: string // 音频
  customerIdList: number[] // 学员列表
  isPush: number // 是否推送
}

// 微信推送内容 API
export const WechatMessageApi = {
  // 查询微信推送内容分页
  getWechatMessagePage: async (params: any) => {
    return await request.get({ url: `/crm/wechat-message/page`, params })
  },

  // 查询微信推送内容详情
  getWechatMessage: async (id: number) => {
    return await request.get({ url: `/crm/wechat-message/get?id=` + id })
  },

  // 获取微信推送内容列表
  getWechatMessageSearchList: async (searchValue: string) => { 
    return await request.get({ url: `/crm/wechat-message/search-list?searchValue=` + searchValue })
  },

  // 新增微信推送内容
  createWechatMessage: async (data: WechatMessageVO) => {
    return await request.post({ url: `/crm/wechat-message/create`, data })
  },

  // 修改微信推送内容
  updateWechatMessage: async (data: WechatMessageVO) => {
    return await request.put({ url: `/crm/wechat-message/update`, data })
  },

  // 删除微信推送内容
  deleteWechatMessage: async (id: number) => {
    return await request.delete({ url: `/crm/wechat-message/delete?id=` + id })
  },
  
  // 导出微信推送内容 Excel
  exportWechatMessage: async (params) => {
    return await request.download({ url: `/crm/wechat-message/export-excel`, params })
  },

  // 微信推送
  pushWechatMessage: async (id: number) => {
    return await request.get({ url: `/crm/wechat-message/push?id=` + id })
  },

  // 重新推送
  reusePushWechatMessage: async (id: number) => {
    return await request.get({ url: `/crm/wechat-message/reusePush?id=` + id })
  },

  // 停止推送
  stopPushWechatMessage: async (id: number) => {
    return await request.get({ url: `/crm/wechat-message/stopPush?id=` + id })
  },
}