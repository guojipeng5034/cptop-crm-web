import request from '@/config/axios'

// 书籍订单信息 VO
export interface BookOrderVO {
  id: number // id
  studentName: string // 学员名
  studentNo: number // 学员编号
  mentor: number // 教员
  orderId: number // 订单id
  bookName: number // 书名
  type: number // 类型
  code: number // 书码
  courierNumber: string // 快递单号
  receiveAddress: string // 收货地址
  receiveName: string // 收货人
  receivePhone: string // 收货电话
  remark: string // 备注
  disponseTime: Date // 发货时间
  disponseUserId: bigint // 发货人id
  disponseUser: string // 发货人
  creator: bigint, // 记录创建者 id (操作人 id)
  creatorName: string // 记录创建者名称
  createdTime: Date // 记录创建的时间
  status: number // 处理状态
}

// 书籍订单信息 API
export const BookOrderApi = {
  // 查询书籍订单信息分页
  getBookOrderPage: async (params: any) => {
    return await request.get({ url: `/crm/order/bookorder/page`, params })
  },

  // 查询书籍订单信息详情
  getBookOrder: async (id: number) => {
    return await request.get({ url: `/crm/order/bookorder/get?id=` + id })
  },

  // 查询书籍订单信息详情
  getBookOrderByOrderId: async (orderId: number) => {
    return await request.get({ url: `/crm/order/bookorder/getByOrderId?orderId=` + orderId })
  },

  // 新增书籍订单信息
  createBookOrder: async (data: BookOrderVO) => {
    return await request.post({ url: `/crm/order/bookorder/create`, data })
  },

  // 修改书籍订单信息
  updateBookOrder: async (data: BookOrderVO) => {
    return await request.put({ url: `/crm/order/bookorder/update`, data })
  },

  // 删除书籍订单信息
  deleteBookOrder: async (id: number) => {
    return await request.delete({ url: `/crm/order/bookorder/delete?id=` + id })
  },

  // 导出书籍订单信息 Excel
  exportBookOrder: async (params) => {
    return await request.download({ url: `/crm/order/bookorder/export-excel`, params })
  },

  // 审核发货状态
  auidtBookOrder: async (data) => {
    return await request.put({ url: `/crm/order/bookorder/update/audit`, data })
  },
}
