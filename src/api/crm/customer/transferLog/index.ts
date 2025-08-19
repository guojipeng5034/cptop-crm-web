import request from '@/config/axios'

// 学员Mentor流转记录 VO
export interface TransferLogVO {
  id: number // 主键
  customerId: number // 学员ID
  oldId: number // 变更前顾问
  newId: number // 变更后顾问
  reason: number // 转让原因
  source: number // 流转来源
  oldDeptId: number // 变更前老师部门记录
  newDeptId: number // 变更老师部门记录
}

// 学员Mentor流转记录 API
export const TransferLogApi = {
  // 查询学员流转记录分页
  getCustomerTransferLogPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/transfer/log/page`, params })
  },

  // 查询学员流转记录详情
  getCustomerTransferLog: async (id: number) => {
    return await request.get({ url: `/crm/customer/transfer/log/get?id=` + id })
  },

  // 新增学员流转记录
  createCustomerTransferLog: async (data: TransferLogVO) => {
    return await request.post({ url: `/crm/customer/transfer/log/create`, data })
  },

  // 修改学员流转记录
  updateCustomerTransferLog: async (data: TransferLogVO) => {
    return await request.put({ url: `/crm/customer/transfer/log/update`, data })
  },

  // 删除学员流转记录
  deleteCustomerTransferLog: async (id: number) => {
    return await request.delete({ url: `/crm/customer/transfer/log/delete?id=` + id })
  },

  // 导出学员流转记录 Excel
  exportCustomerTransferLog: async (params) => {
    return await request.download({ url: `/crm/customer/transfer/log/export-excel`, params })
  }
}