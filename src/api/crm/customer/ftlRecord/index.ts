import request from '@/config/axios'

// 学员FTL记录 VO
export interface CustomerFtlRecordVO {
  id: number // 自增主键
  curriculumUid: string // 课程ID
  curriculumCode: string // 课程code
  reservedTime: Date // 预约时间
  startTime: Date // 开课时间
  canceledTime: Date // 取消时间
  lessonId: number // qqe_lesson 表主键
  testerId: number // ftl测试id
  status: number // 课程状态
  customerId: number // 学员学号
}

// 学员FTL记录 API
export const CustomerFtlRecordApi = {
  // 查询学员FTL记录分页
  getCustomerFtlRecordPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/ftl/record/page`, params })
  },

  // 查询学员FTL记录详情
  getCustomerFtlRecord: async (id: number) => {
    return await request.get({ url: `/crm/customer/ftl/record/get?id=` + id })
  },

  // 新增学员FTL记录
  createCustomerFtlRecord: async (data: CustomerFtlRecordVO) => {
    return await request.post({ url: `/crm/customer/ftl/record/create`, data })
  },

  // 修改学员FTL记录
  updateCustomerFtlRecord: async (data: CustomerFtlRecordVO) => {
    return await request.put({ url: `/crm/customer/ftl/record/update`, data })
  },

  // 删除学员FTL记录
  deleteCustomerFtlRecord: async (id: number) => {
    return await request.delete({ url: `/crm/customer/ftl/record/delete?id=` + id })
  },

  // 导出学员FTL记录 Excel
  exportCustomerFtlRecord: async (params) => {
    return await request.download({ url: `/crm/customer/ftl/record/export-excel`, params })
  }
}