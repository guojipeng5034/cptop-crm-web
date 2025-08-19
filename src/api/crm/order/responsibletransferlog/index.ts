import request from '@/config/axios'

// 订单Responsible流转记录 VO
export interface ResponsibleTransferLogVO {
  id: number // 主键
  customerId: number // 学员ID
  orderNum: string // 订单号
  oldId: number // 变更前Responsible
  oldDeptId: object // 变更前Responsible部门记录
  newId: number // 变更后Responsible
  newDeptId: object // 变更后Responsible部门记录
  remarks: string // 备注信息
}

// 订单Responsible流转记录 API
export const ResponsibleTransferLogApi = {
  // 查询订单Responsible流转记录分页
  getResponsibleTransferLogPage: async (params: any) => {
    return await request.get({ url: `/crm/responsible-transfer-log/page`, params })
  },

  // 查询订单Responsible流转记录详情
  getResponsibleTransferLog: async (id: number) => {
    return await request.get({ url: `/crm/responsible-transfer-log/get?id=` + id })
  },

  // 新增订单Responsible流转记录
  createResponsibleTransferLog: async (data: ResponsibleTransferLogVO) => {
    return await request.post({ url: `/crm/responsible-transfer-log/create`, data })
  },

  // 修改订单Responsible流转记录
  updateResponsibleTransferLog: async (data: ResponsibleTransferLogVO) => {
    return await request.put({ url: `/crm/responsible-transfer-log/update`, data })
  },

  // 删除订单Responsible流转记录
  deleteResponsibleTransferLog: async (id: number) => {
    return await request.delete({ url: `/crm/responsible-transfer-log/delete?id=` + id })
  },

  // 导出订单Responsible流转记录 Excel
  exportResponsibleTransferLog: async (params) => {
    return await request.download({ url: `/crm/responsible-transfer-log/export-excel`, params })
  },
}