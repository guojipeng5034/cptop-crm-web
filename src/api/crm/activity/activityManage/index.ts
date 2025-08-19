import request from '@/config/axios'

// 活动设置 VO
export interface ActivityManageVO {
  id: number // 活动ID，自增主键
  activityNameVisible: string // 活动名称(外部可见)
  activityNameInternal: string // 活动名称(内部可见)
  customerLimit: object // 学员限制 DEFAULT 9 数组
  relationActivityStatus: number // 是否关联activity
  activityMonth: string // 活动月份
  lessonStartTime: Date // 课程开始时间
  lessonEndTime: Date // 课程结束时间
  clockStartTime: Date // 打卡开始时间
  clockEndTime: Date // 打卡结束时间
  activityStartTime: Date // 活动开始时间
  activityEndTime: Date // 活动结束时间
  rewardNumber: number // 奖励数量
  couponId: object // 优惠券 数组
  subscriptionCardCode: object // 次卡代码 数组
  activityStatus: number // 活动状态
  wechatScript: string // 微信话术
  autoAuditStatus: number // 审核方式
  rewardStatus: number // 奖励发放方式
  rewardType: object // 奖励类型
  activityRules: string // 活动规则
  activityRemark: string // 活动备注
}

// 活动设置 API
export const ActivityManageApi = {
  // 查询活动设置分页
  getActivityManagePage: async (params: any) => {
    return await request.get({ url: `/crm/activity/activity-manage/page`, params })
  },

  // 查询活动设置详情
  getActivityManage: async (id: number) => {
    return await request.get({ url: `/crm/activity/activity-manage/get?id=` + id })
  },

  // 获取活动设置精简信息列表
  getSimpleActivityManageList: async (status?: number, limit?: number, activityMonth?: string) => {
    const params = new URLSearchParams()

    if (status !== undefined) params.append('status', String(status))
    if (limit !== undefined) params.append('limit', String(limit))
    if (activityMonth !== undefined) params.append('activityMonth', String(activityMonth))
  
    const queryString = params.toString()
    const url = queryString
      ? `/crm/activity/activity-manage/simple-list?${queryString}`
      : `/crm/activity/activity-manage/simple-list`
  
    return await request.get({ url })
  },

  // 获取有效（有海报）活动设置精简信息列表
  getValidSimpleActivityManageList: async (status?: number, limit?: number) => {
    const params = new URLSearchParams()

    if (status !== undefined) params.append('status', String(status))
    if (limit !== undefined) params.append('limit', String(limit))
  
    const queryString = params.toString()
    const url = queryString
      ? `/crm/activity/activity-manage/valid-simple-list?${queryString}`
      : `/crm/activity/activity-manage/valid-simple-list`
  
    return await request.get({ url })
  },

  // 远程获取活动设置信息列表
  getActivityManageSearchList: async (searchValue: string) => {
    return request.get({ url: `/crm/activity/activity-manage/ai-simple-list?searchValue=${searchValue}` })
  },

  // 远程获取活动设置分页信息列表
  getSimpleSelectPage: async (params: any) => {
    return request.get({ url: `/crm/activity/activity-manage/mall-simple-page`, params })
  },

  // 新增活动设置
  createActivityManage: async (data: ActivityManageVO) => {
    return await request.post({ url: `/crm/activity/activity-manage/create`, data })
  },

  // 根据活动 id 列表获得活动基本信息
  getByList: async (ids: number[]) => {
    return await request.get({url: `/crm/activity/activity-manage/mall-simple-list?ids=${ids}`})
  },

  // 修改活动设置
  updateActivityManage: async (data: ActivityManageVO) => {
    return await request.put({ url: `/crm/activity/activity-manage/update`, data })
  },

  // 删除活动设置
  deleteActivityManage: async (id: number) => {
    return await request.delete({ url: `/crm/activity/activity-manage/delete?id=` + id })
  },

  // 导出活动设置 Excel
  exportActivityManage: async (params) => {
    return await request.download({ url: `/crm/activity/activity-manage/export-excel`, params })
  },

  // 获取学员可参与的活动列表
  getAvailableActivityManage: async (customerId: number) => {
    return await request.get({ url: `/crm/activity/activity-manage/available-list?customerId=` + customerId })
  }
}