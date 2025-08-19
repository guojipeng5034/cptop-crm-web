import request from '@/config/axios'

// 回调日志 VO
export interface PaymentCallbackLogVO {
  paymentId: number // 支付Id
  univapayChargeId: string // univapay的charge id
  univapayStoreId: string // univapay的商店Id
  stripePaymentId: string // stripe的paymentId
  airwallexSourceId: string // 空中云汇的sourceId
  webhookContent: object // webhook回调整体内容
  responseCode: number // 响应码
  responseBody: string // 响应内容
}

// 回调日志 API
export const PaymentCallbackLogApi = {
  // 查询回调日志分页
  getPaymentCallbackLogPage: async (params: any) => {
    return await request.get({ url: `/crm/order/callback/page`, params })
  },

  // 查询回调日志详情
  getPaymentCallbackLog: async (id: number) => {
    return await request.get({ url: `/crm/order/callback/get?id=` + id })
  },

  // 新增回调日志
  createPaymentCallbackLog: async (data: PaymentCallbackLogVO) => {
    return await request.post({ url: `/crm/order/callback/create`, data })
  },

  // 修改回调日志
  updatePaymentCallbackLog: async (data: PaymentCallbackLogVO) => {
    return await request.put({ url: `/crm/order/callback/update`, data })
  },

  // 删除回调日志
  deletePaymentCallbackLog: async (id: number) => {
    return await request.delete({ url: `/crm/order/callback/delete?id=` + id })
  },

  // 导出回调日志 Excel
  exportPaymentCallbackLog: async (params) => {
    return await request.download({ url: `/crm/order/callback/export-excel`, params })
  },

  // 手动触发二次回调
  paymentRecall: async (paymentId: number) => {
    return await request.get({ url: `/crm/pay/re/call?paymentId=${paymentId}` })
  },

  // 手动触发二次回调
  paymentRecallRefund: async (paymentId: number, isRefund: boolean, refundNumber: string) => {
    return await request.get({
      url: `/crm/pay/re/call/refund?paymentId=${paymentId}&isRefund=${isRefund}&refundNumber=${refundNumber}`
    })
  }
}
