import request from '@/config/axios'

// 签约制订单管理 VO
export interface SignedOrderVO {
  id: number // 自增ID
  customerId: number // 学员ID
  packageId: number // 套餐ID
  externalAgreementNo: number // 支付宝签约号
  amount: number // 金额
  validTime: Date // 用户代扣协议的实际生效时间
  agreementNo: string // 支付宝:唯一标识用户签约记录的编号
  invalidTime: Date // 用户代扣协议的失效时间
  signTime: Date // 签约时间
  alipayUserId: string // 用户签约的支付宝账号对应的支付宝唯一用户号
  status: string // 协议的当前状态。字典 1. TEMP：暂存，协议未生效过； 2. NORMAL：正常； 3. STOP：暂停。 4. REVOKE:已解约
  externalLogonId: string // 用户在商户网站的登录账号
  agreementUrl: string // 签约URL
  executeTime: Date // 执行时间
  nextExecuteTime: Date // 下次执行时间
  orderType: number // 签约订单类型，字典 1表示支付宝
  revokedTime: Date // 解约时间
  revokedType: number // 解约类型：字典：系统解约、用户自主解约
}

// 签约制订单管理 API
export const SignedOrderApi = {
  // 查询签约制订单管理分页
  getSignedOrderPage: async (params: any) => {
    return await request.get({ url: `/crm/order/signed/page`, params })
  },

  // 查询签约制订单管理详情
  getSignedOrder: async (id: number) => {
    return await request.get({ url: `/crm/order/signed/get?id=` + id })
  },

  // 查询签约制订单管理详情
  getSignedOrderWithPackage: async (singedOrderId: number) => {
    return await request.get({ url: `/crm/order/signed/getSignedOrderWithPackage?singedOrderId=` + singedOrderId })
  },

  // 新增签约制订单管理
  createSignedOrder: async (data: SignedOrderVO) => {
    return await request.post({ url: `/crm/order/signed/create`, data })
  },

  // 修改签约制订单管理
  updateSignedOrder: async (data: SignedOrderVO) => {
    return await request.put({ url: `/crm/order/signed/update`, data })
  },

  // 删除签约制订单管理
  deleteSignedOrder: async (id: number) => {
    return await request.delete({ url: `/crm/order/signed/delete?id=` + id })
  },

  // 导出签约制订单管理 Excel
  exportSignedOrder: async (params) => {
    return await request.download({ url: `/crm/order/signed/export-excel`, params })
  },
}
