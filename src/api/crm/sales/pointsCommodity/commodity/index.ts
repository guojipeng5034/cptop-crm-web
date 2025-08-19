import request from '@/config/axios'

// 积分商品 VO
export interface PointsCommodityVO {
  id: number // 主键ID
  title: string // 标题
  studentLimitStatus: number // 学员限制 下拉框
  points: number // 兑换积分金额
  status: number // 状态：0.未启用 1.启用 
  autoAddStatus: number // 是否自动添加商品 ： 0非自动 1自动
  ticketCommodity: string // 次卡
  existLimit: number // 是否有限制：0不限制 1 限制  默认是0
  sendEmail: number // 是否需要发邮件 ：0：不需要 1：需要
  limitCondition: string // 限制条件：1按月 2按季度
  limitCount: number // 限制次数
  purchaseMethod: number // 兑换方式：0不需要1积分2现金3积分或现金
  validTime: Date // 商品有效时间
  invalidTime: Date // 商品失效时间
  indexFileSavePath: string // 主图地址
  detailFileSavePath: string // 详情图地址 
  activityStatus: number // 活动状态： 0:未启用 1：启动
  activityPoints: number // 活动期间兑换积分
  activityStartTime: Date // 活动开始时间
  activityEndTime: Date // 活动结束时间
  activityImg: string // 活动主图
  sort: number // 排序 ：数字越小 排序靠前
  autoAddCommodityType: number // 自动添加商品类型
  pointsCommodity: number // 课时点
  groupValue: string // 分类
  channelId: number // 渠道ID
  amount: number // 现金金额
  describe: string // 商品描述信息
  couponCommodity: string // 礼卷
}

export interface pointsCommodityBacthUpdateReqVO {
  ids: number[]
  discount: number
  studentLimitStatus: number
  activityStatus: number
  activityPoints: number
  activityStartTime: string
  activityEndTime: string
  activityIds: number[]
  remark: string
}

// 积分商品 API
export const PointsCommodityApi = {
  // 查询积分商品分页
  getPointsCommodityPage: async (params: any) => {
    return await request.get({ url: `/crm/points-commodity/page`, params })
  },

  // 查询积分商品详情
  getPointsCommodity: async (id: number) => {
    return await request.get({ url: `/crm/points-commodity/get?id=` + id })
  },

  // 新增积分商品
  createPointsCommodity: async (data: PointsCommodityVO) => {
    return await request.post({ url: `/crm/points-commodity/create`, data })
  },

  // 修改积分商品
  updatePointsCommodity: async (data: PointsCommodityVO) => {
    return await request.put({ url: `/crm/points-commodity/update`, data })
  },

  // 批量修改积分商品
  batchUpdatePointsCommodity: async (data: pointsCommodityBacthUpdateReqVO) => {
    return await request.put({ url: `/crm/points-commodity/batch-update`, data })
  },

  // 删除积分商品
  deletePointsCommodity: async (id: number) => {
    return await request.delete({ url: `/crm/points-commodity/delete?id=` + id })
  },

  // 导出积分商品 Excel
  exportPointsCommodity: async (params) => {
    return await request.download({ url: `/crm/points-commodity/export-excel`, params })
  }
}