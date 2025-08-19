import request from '@/config/axios'

// 学员联系记录 VO
export interface ContactHistoryVO {
  id: number // 自增ID
  customerId: number // 学员Id
  contactType: number // 联系类型：字典
  responsibleId: number // 学员联系人
  contactDate: Date // 联系日期
  contactResultType: number // 联系结果:字典
  contactContent: string // 联系纪要
  contactReason: string // 联系原因
  nextContactDate: Date // 下次联系日期
  nextResponsibleId: number // 下次联系负责人
  nextReservedDate: Date // 下次预约日期
  handleResult: string // 处理结果
  refundPoints: number // 返回课时点数
  refundReason: number // 返还课时点原因：字典
}

// 学员联系记录 API
export const ContactHistoryApi = {
  // 查询学员联系记录分页
  getContactHistoryPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/contacthistory/page`, params })
  },

  // 查询学员联系记录详情
  getContactHistory: async (id: number) => {
    return await request.get({ url: `/crm/customer/contacthistory/get?id=` + id })
  },

  // 新增学员联系记录
  createContactHistory: async (data: ContactHistoryVO) => {
    return await request.post({ url: `/crm/customer/contacthistory/create`, data })
  },

  // 修改学员联系记录
  updateContactHistory: async (data: ContactHistoryVO) => {
    return await request.put({ url: `/crm/customer/contacthistory/update`, data })
  },

  // 删除学员联系记录
  deleteContactHistory: async (id: number) => {
    return await request.delete({ url: `/crm/customer/contacthistory/delete?id=` + id })
  },

  // 导出学员联系记录 Excel
  exportContactHistory: async (params) => {
    return await request.download({ url: `/crm/customer/contacthistory/export-excel`, params })
  },
}