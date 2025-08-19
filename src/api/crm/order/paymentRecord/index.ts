import request from '@/config/axios'
import { PackageVO } from '@/api/crm/package/package'

// 套餐订单 VO
export interface PackageRecordVO {
  id: number // 自增编号
  orderId: number // 订单Id
  paymentMethod: number // 支付方式
  customerId: number // 学员Id
  customerName: string // 学员名称
  paymentTime: string // 支付时间
  amount: number // 支付金额
  paymentStatus: number // 支付状态
  paymentCurrencyType: number // 实际支付货币币种
  actualAmount: number // 实际支付金额
  responsibleId: number // 订单负责人ID
  responsibleName: string // 订单负责人
  paymentRemark: string  //	支付订单备注
  paymentOrderNum: string //	支付订单号
  paymentMerchantId: number //	支付商户的ID
  createTime: string //	记录创建的时间
  payUrl: string //	返回支付URl
  refundActualAmount:	number //	实际退款金额
  orderAuditType:	number //	订购审核类型
  paymentMerchantName: string //	支付商户名字
  discountSum: number // 总优惠金额

  packages: PackageVO, // 套餐
}

// 套餐支付记录 API
export const PackageRecordApi = {
  // 获得套餐支付记录包含支付单信息、套餐信息、优惠券信息
  getPaymentWithPackageAndCouponByPaymentId: async (paymentId: any) => {
    return await request.get({ url: `/crm/order/paymentRecord/getPaymentWithPackageAndCouponByPaymentId?paymentId=${paymentId}` })
  },
  // 更新套餐支付记录
  updatePaymentRecord: async (data: PackageRecordVO) => {
    return await request.put({ url: `/crm/order/paymentRecord/updateResponsible`, data })
  },
}
