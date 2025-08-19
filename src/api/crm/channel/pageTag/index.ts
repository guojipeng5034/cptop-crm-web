import request from '@/config/axios'

// 渠道页面标签 VO
export interface ChannelPageTagVO {
  id: number // 自增主键
  tagName: string // 标签名称
  tagExplain: string // 标签说明
  tagUserId: number // 标签创建者
  status: number // 状态
  remark: string // 备注
}

// 渠道页面标签 API
export const ChannelPageTagApi = {
  // 查询渠道页面标签分页
  getChannelPageTagPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/pagetag/page`, params })
  },

  // 查询渠道页面标签详情
  getChannelPageTag: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/pagetag/get?id=` + id })
  },

  // 新增渠道页面标签
  createChannelPageTag: async (data: ChannelPageTagVO) => {
    return await request.post({ url: `/crm/base/channel/pagetag/create`, data })
  },

  // 获取页面标签信息列表
  getSimplePageTagList: async () => {
    return request.get({ url: '/crm/base/channel/pagetag/simple-list' })
  },

  // 远程获取页面标签信息列表
  getPageTagSearchList: async (searchValue:string) => {
    return request.get({ url: '/crm/base/channel/pagetag/search-list?searchValue=' + searchValue })
  },

  // 修改渠道页面标签
  updateChannelPageTag: async (data: ChannelPageTagVO) => {
    return await request.put({ url: `/crm/base/channel/pagetag/update`, data })
  },

  // 删除渠道页面标签
  deleteChannelPageTag: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/pagetag/delete?id=` + id })
  },

  // 导出渠道页面标签 Excel
  exportChannelPageTag: async (params) => {
    return await request.download({ url: `/crm/base/channel/pagetag/export-excel`, params })
  },
}
