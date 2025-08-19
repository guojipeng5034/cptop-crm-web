import request from '@/config/axios'

// 活动 VO
export interface ChannelActivityVO {
  id: number // 自增主键
  activityName: string // 活动名称
  lineType: number // 线上/线下
  siteId: number // CN/CPZH/CNADT
  promotionResponsibleId: number // 推广负责人
  salesResponsibleId: number // 销售负责人
  status: number // 状态
  remark: string // 备注
}

// 活动 API
export const ChannelActivityApi = {
  // 查询活动分页
  getChannelActivityPage: async (params: any) => {
    return await request.get({ url: `/crm/base/channel/manage/activity/page`, params })
  },

  // 查询活动详情
  getChannelActivity: async (id: number) => {
    return await request.get({ url: `/crm/base/channel/manage/activity/get?id=` + id })
  },

  // 获取三级渠道活动列表
  getChannelActivitySearchList: async (searchValue: string, activityType?: number) => {
    let url = `/crm/base/channel/manage/activity/channel_simple-list?searchValue=${searchValue}`
    if (activityType) url += `&activityType=${activityType}`
    return request.get({ url })
  },

  // 新增活动
  createChannelActivity: async (data: ChannelActivityVO) => {
    return await request.post({ url: `/crm/base/channel/manage/activity/create`, data })
  },

  // 修改活动
  updateChannelActivity: async (data: ChannelActivityVO) => {
    return await request.put({ url: `/crm/base/channel/manage/activity/update`, data })
  },

  // 删除活动
  deleteChannelActivity: async (id: number) => {
    return await request.delete({ url: `/crm/base/channel/manage/activity/delete?id=` + id })
  },

  // 导出活动 Excel
  exportChannelActivity: async (params) => {
    return await request.download({ url: `/crm/base/channel/manage/activity/export-excel`, params })
  },
}
