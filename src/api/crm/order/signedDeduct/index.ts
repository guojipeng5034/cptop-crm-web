import request from '@/config/axios'

// 签约制订单扣费记录 VO
export interface SignedDeductRecordVO {
  id: number // 自增ID
  deductOrderId: string // 扣费订单ID
  signedOrderId: number // 签约订单ID
  tradeNo: string // 交易号
  totalAmount: number // 交易金额
  receiptAmount: number // 实收金额
  settingDeductDate: Date // 理论上的扣费时间
  gmtPayment: Date // 实际扣费时间
  status: number // 扣款状态，字典：0pending1扣费成功2扣费失败
}

// 签约制订单扣费记录 API
export const SignedDeductRecordApi = {
  // 查询签约制订单扣费记录分页
  getSignedDeductRecordPage: async (params: any) => {
    return await request.get({ url: `/crm/order/signeddeductrecord/page`, params })
  },

  // 查询签约制订单扣费记录详情
  getSignedDeductRecord: async (id: number) => {
    return await request.get({ url: `/crm/order/signeddeductrecord/get?id=` + id })
  },

  // 新增签约制订单扣费记录
  createSignedDeductRecord: async (data: SignedDeductRecordVO) => {
    return await request.post({ url: `/crm/order/signeddeductrecord/create`, data })
  },

  // 修改签约制订单扣费记录
  updateSignedDeductRecord: async (data: SignedDeductRecordVO) => {
    return await request.put({ url: `/crm/order/signeddeductrecord/update`, data })
  },

  // 删除签约制订单扣费记录
  deleteSignedDeductRecord: async (id: number) => {
    return await request.delete({ url: `/crm/order/signeddeductrecord/delete?id=` + id })
  },

  // 导出签约制订单扣费记录 Excel
  exportSignedDeductRecord: async (params) => {
    return await request.download({ url: `/crm/order/signeddeductrecord/export-excel`, params })
  },
}