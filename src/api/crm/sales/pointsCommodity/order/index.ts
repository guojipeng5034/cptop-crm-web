import request from '@/config/axios'

// 积分商品订单 VO
export interface PointsCommodityOrderVO {
  id: number // 表主键
  customerId: string // 学员唯一标识
  returnPointsMonth: number // 返还课时点的月份
  status: number // 1未处理2已处理
  afterAmount: number // 实付金额
  afterPoints: number // 实付积分
  poiintsCommodityId: number // 积分商品ID
  sendAddress: string // 邮寄地址
  receiverMobile: string // 兑换人电话
  receiverName: string // 兑换人姓名
  ipAddress: string // ip地址
  remark: string // 备注
  paymentStatus: number // 支付状态：1等待支付2已付费3已取消
  paymentDate: Date // 支付时间
  paymentMethod: number // 支付方式：0积分1现金 2积分与现金
  receiveEmail: string // 兑换人邮件地址
  disponseTime: Date // 争议时间
  disponseUserId: number // 争议人ID
  courierNumber: string // 快递单号
}
export interface pointsCommodityOrderHandleVO {
  id: number // 表主键
  courierNumber: string // 快递单号
}

// 积分商品订单 API
export const PointsCommodityOrderApi = {
  // 查询积分商品订单分页
  getPointsCommodityOrderPage: async (params: any) => {
    return await request.get({ url: `/crm/points-commodity-order/page`, params })
  },

  // 查询积分商品订单详情
  getPointsCommodityOrder: async (id: number) => {
    return await request.get({ url: `/crm/points-commodity-order/get?id=` + id })
  },

  // 新增积分商品订单
  createPointsCommodityOrder: async (data: PointsCommodityOrderVO) => {
    return await request.post({ url: `/crm/points-commodity-order/create`, data })
  },

  // 修改积分商品订单
  updatePointsCommodityOrder: async (data: PointsCommodityOrderVO) => {
    return await request.put({ url: `/crm/points-commodity-order/update`, data })
  },

  // 处理积分商品订单
  handlePointsOrder: async (data: pointsCommodityOrderHandleVO) => {
    return await request.put({ url: `/crm/points-commodity-order/handlePointsOrder`, data })
  },
  // 批量处理积分商品订单
  handlePointsOrderBatch: async (data: pointsCommodityOrderHandleVO) => {
    return await request.put({ url: `/crm/points-commodity-order/handleBatchPointsOrder`, data })
  },

  // 删除积分商品订单
  deletePointsCommodityOrder: async (id: number) => {
    return await request.delete({ url: `/crm/points-commodity-order/delete?id=` + id })
  },

  // 导出积分商品订单 Excel
  exportPointsCommodityOrder: async (params) => {
    return await request.download({ url: `/crm/points-commodity-order/export-excel`, params })
  }
}