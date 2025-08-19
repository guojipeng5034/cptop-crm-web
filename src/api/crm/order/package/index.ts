import request from '@/config/axios'

// 套餐订单 VO
export interface PackageOrderVO {
  id: number // 自增编号
  customerId: number // 学员Id
  packageId: number // 套餐Id
  totalAmount: number //  订单的原价
  discountAmount: number // 优惠金额
  payableAmount: number // 应支付金额
  actualAmount: number // 实际支付金额
  paymentStatus: number // 支付状态
  orderType: number // 订单类型
  paymentType: number // 支付类型
  awardPointsNum: number // 赠送积分数量
  awardQqePointsNum: number // 赠送课时点数量
  awardTicketNum: number // 赠送次卡数量
  awardBookType: number // 赠送书籍类型
  orderNum: string // 订单号
  oldStudentNumber: number, // 旧站点学号
  oldSiteId: number, // 所属旧站点
}

// 订单审核 VO
export interface AuditOrderVO {
  paymentId: number
  auditStatus: number
  paymentTime: string
  transferImage: string[]
  paymentRemark: string
}

// 套餐订单 API
export const PackageOrderApi = {
  // 查询套餐订单分页
  getPackageOrderPage: async (data: any) => {
    return await request.post({ url: `/crm/order/package/page`, data })
  },
  
  // 获得套餐订单分页统计
  getPageStatistics: async (data: any) => {
    return await request.post({ url: `/crm/order/package/pageStatistics`, data })
  },

  // 查询套餐订单详情
  getPackageOrder: async (id: number) => {
    return await request.get({ url: `/crm/order/package/get?id=` + id })
  },

  // 查询未使用订单详情
  getPackageOrderUnused: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/get-unused-list?customerId=` + customerId })
  },

  // 查询未使用课时包订单详情
  getLessonBagPackageOrderUnused: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/get-unused-lessons-package-list?customerId=` + customerId })
  },

  // 新增套餐订单
  createPackageOrder: async (data: PackageOrderVO) => {
    return await request.post({ url: `/crm/order/package/create`, data })
  },

  // 修改套餐订单
  updatePackageOrder: async (data: PackageOrderVO) => {
    return await request.put({ url: `/crm/order/package/update`, data })
  },

  // 修改购买的套餐
  switchOrderPackage: async (orderId: bigint, packageId:number) => {
    return await request.get({ url: `/crm/order/package/update/order/package?orderId=${orderId}&packageId=${packageId}` })
  },

  // 查询审核套餐订单信息
  getPaymentRecord : async (id: number) => {
    return await request.get({ url: `/crm/order/paymentRecord/get?id=` + id })
  },

  // 财务审核 pending订单
  auditPendingOrder: async (data: AuditOrderVO) => {
    return await request.put({ url: `/crm/order/package/update_order_status`, data })
  },

  // 分次支付
  createPackageOrderPayAgain: async (data: PackageOrderVO) => {
    return await request.post({ url: `/crm/order/package/create-pay-order-again`, data })
  },

  // 发放赠品
  distributePackageOrderPresent: async (data: PackageOrderVO) => {
    return await request.put({ url: `/crm/order/package/get/Award`, data })
  },

  // 删除套餐订单
  deletePackageOrder: async (id: number) => {
    return await request.delete({ url: `/crm/order/package/delete?id=` + id })
  },

  // 导出套餐订单 Excel
  exportPackageOrder: async (data) => {
    return await request.download({ url: `/crm/order/package/export-excel`, data }, 'POST')
  },

  // 检查学员是否存在分次支付订单
  getExistSplitOrderPackages: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/get/existSplitOrderPackages?customerId=` + customerId  })
  },

  // 检查学员是否续费
  getCustomerIsRenewPackage: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/get/customerIsRenewPackage?customerId=` + customerId  })
  },

  // 获取该订单可不可以更改Responsible
  getIsCanChangeResponsibleByCustomerId: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/getIsCanChangeResponsibleByCustomerId?customerId=` + customerId  })
  },

  // 获取当前学员能修改的订单类型
  getOrderType: async (customerId: number) => {
    return await request.get({ url: `/crm/order/package/get/orderType?customerId=` + customerId  })
  },

  // 修改订单类型
  updateOrderType: async (orderId, orderType) => {
    return await request.get({ url: `/crm/order/package/update/orderType?orderId=${orderId}&orderType=${orderType}` })
  },
}
