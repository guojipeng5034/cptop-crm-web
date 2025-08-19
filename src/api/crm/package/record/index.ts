import request from '@/config/axios'

// 学员套餐&订单绑定 VO
export interface RecordVO {
  id: number // 自增ID
  customerId: number // 学员ID
  orderId: number // 订单ID
  executeStatus: number // 执行状态：字典
  refreshTotalCount: number // 总刷新次数
  refreshedCount: number // 已刷新次数
  opearteRecord: string // 操作备注
  startTime: Date // 套餐开课时间
}

// 学员套餐&订单绑定 API
export const RecordApi = {
  // 查询学员套餐&订单绑定分页
  getRecordPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/customerpackagerecord/page`, params })
  },

  // 查询学员套餐&订单绑定详情
  getRecord: async (id: number) => {
    return await request.get({ url: `/crm/packages/customerpackagerecord/get?id=` + id })
  },

  // 新增学员套餐&订单绑定
  createRecord: async (data: RecordVO) => {
    return await request.post({ url: `/crm/packages/customerpackagerecord/create`, data })
  },

  // 修改学员套餐&订单绑定
  updateRecord: async (data: RecordVO) => {
    return await request.put({ url: `/crm/packages/customerpackagerecord/update`, data })
  },

  // 删除学员套餐&订单绑定
  deleteRecord: async (id: number) => {
    return await request.delete({ url: `/crm/packages/customerpackagerecord/delete?id=` + id })
  },

  // 导出学员套餐&订单绑定 Excel
  exportRecord: async (params) => {
    return await request.download({ url: `/crm/packages/customerpackagerecord/export-excel`, params })
  },

  // 查询学员套餐&订单绑定 执行状态
  getExecuteStatusByCustomer: async (customerId: number) => {
    return await request.get({ url: `/crm/packages/customerpackagerecord/get-ExecuteStatus-by-customer?customerId=` + customerId })
  },
}
