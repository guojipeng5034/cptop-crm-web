import request from '@/config/axios'

// 退款记录管理 VO
export interface RefundVO {
  id: number // 自增ID
  customerId: number // 学员id
  refundDate: Date // 提出退费的时间
  refundAmount: number // 退款金额
  refundOrderId: number // 要退款的订单ID
  orderId: number // 本次生成的退费订单ID
  customerBankCard: string // 客户银行卡号
  customerName: string // 客户名
  bankName: string // 银行名
  refundType: number // 退款原因：字典
  refundReason: string // 退款原因
  cancelFixLessonOrderStatus: number // 是否取消固定课订单
  makeOutAnInvoiceStatus: number // 是否当时开具发票
  applyUserId: number // 提交人
  approverId: number // 处理人
  approverDate: Date // 处理时间
  status: number // 审核状态
  refundAge: number // 退款时年龄
  refundStatus: number // 退款状态
  orderType: number // 订单类型：字典:新生 续费
  packageType: number // 套餐类型：字典： 长期 短期 次卡
  connectUserId: number // 联系人
  connectRemark: string // 联系纪要
  connectStatus: number // 联系状态
  connectDate: Date // 联系时间
  approveRemark: string // 处理纪要
  studyMonth: number // 学习月数
  paymentAmount: number // 当时支付的金额
  thisMonthPrice: number // 当月套餐价格
  refundMonth: number // 退款月数
  surplusAmount: number // 剩余金额
  presentAmount: number // 赠品折算价格
  presentBookName: string // 赠送书籍名称
  presentPoint: number // 赠送的积分数量
  presentTicket: number // 赠送的次卡数量
  handlingFee: number // 手续费比例
  refundSuccessDate: Date // 退款成功时间
}

// 退款记录管理 API
export const RefundApi = {
  // 查询退款记录管理分页
  getRefundRecordPage: async (params: any) => {
    return await request.get({ url: `/crm/order/refundrecord/page`, params })
  },

  // 查询退款记录管理详情
  getRefundRecord: async (id: number) => {
    return await request.get({ url: `/crm/order/refundrecord/get?id=` + id })
  },

  // 新增退款记录管理
  createRefundRecord: async (data: RefundVO) => {
    return await request.post({ url: `/crm/order/refundrecord/create`, data })
  },

  // 修改退款记录管理
  updateRefundRecord: async (data: RefundVO) => {
    return await request.put({ url: `/crm/order/refundrecord/update`, data })
  },

  // 更新记录审核状态（经理）
  updateRefundRecordApproveStatus: async (data: RefundVO) => {
    return await request.put({ url: `/crm/order/refundrecord/update-status`, data })
  },

  // 更新记录联系状态
  updateRefundRecordConnectStatus: async (data: RefundVO) => {
    return await request.put({ url: `/crm/order/refundrecord/update-connect`, data })
  },

  // 删除退款记录管理
  deleteRefundRecord: async (id: number) => {
    return await request.delete({ url: `/crm/order/refundrecord/delete?id=` + id })
  },

  // 导出退款记录管理 Excel
  exportRefundRecord: async (params) => {
    return await request.download({ url: `/crm/order/refundrecord/export-excel`, params })
  },
}
