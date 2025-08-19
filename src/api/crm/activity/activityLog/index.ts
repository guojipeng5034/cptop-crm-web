import request from '@/config/axios'

// 学生活动日志 VO
export interface ActivityLogVO {
  id: number // ID，自增主键
  customerId: number // 客户ID
  activityManageId: number // 活动管理ID
  wechatImgs: object // 微信图片
  auditStatus: number // 审核状态
  auditTime: Date // 审核时间
  auditUserId: number // 审核人用户ID
  addRewardStatus: number // 奖励状态
  socialPlatform: number // 社交平台
  partiallyVisibleStatus: number // 朋友圈状态
}

// 学生活动日志 API
export const ActivityLogApi = {
  // 查询学生活动日志分页
  getActivityLogPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/activity-log/page`, params })
  },

  // 查询学生活动日志详情
  getActivityLog: async (id: number) => {
    return await request.get({ url: `/crm/activity/activity-log/get?id=` + id })
  },

  // 新增学生活动日志
  createActivityLog: async (data: ActivityLogVO) => {
    return await request.post({ url: `/crm/activity/activity-log/create`, data })
  },

  // 修改学生活动日志
  updateActivityLog: async (data: ActivityLogVO) => {
    return await request.put({ url: `/crm/activity/activity-log/update`, data }) 
  },

  // 删除学生活动日志
  deleteActivityLog: async (id: number) => {
    return await request.delete({ url: `/crm/activity/activity-log/delete?id=` + id })
  },

  // 导出学生活动日志 Excel
  exportActivityLog: async (params) => {
    return await request.download({ url: `/crm/activity/activity-log/export-excel`, params })
  },
}