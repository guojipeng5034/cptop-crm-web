import request from '@/config/axios'

// 学员账号 VO
export interface CustomerAccountVO {
  id: number // id
  customerId: number // 学员
  siteId: number // 站点
}

// 学员账号 API
export const CustomerAccountApi = {
  // 查询学员账号分页
  getCustomerAccountPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/account/page`, params })
  },

  // 查询学员账号详情
  getCustomerAccount: async (id: number) => {
    return await request.get({ url: `/crm/customer/account/get?id=` + id })
  },

  // 查询学员账号详情
  getCustomerAccountStudentList: async (customerId: number) => {
    return await request.get({ url: `/crm/customer/account/student-list?customerId=` + customerId })
  },

  // 查询学员账号详情
  getCustomerMainAccount: async (customerId: number) => {
    return await request.get({ url: `/crm/customer/account/main-student?customerId=` + customerId })
  },

  // 查询学员详情 by studentUid
  getCustomerByStudentUid: async (studentUid: string) => {
    return await request.get({ url: `/crm/customer/account/getCustomerByStudentUid?studentUid=` + studentUid })
  },

  // 新增学员账号
  createCustomerAccount: async (data: CustomerAccountVO) => {
    return await request.post({ url: `/crm/customer/account/create`, data })
  },

  // 修改学员账号
  updateCustomerAccount: async (data: CustomerAccountVO) => {
    return await request.put({ url: `/crm/customer/account/update`, data })
  },

  // 删除学员账号
  deleteCustomerAccount: async (id: number) => {
    return await request.delete({ url: `/crm/customer/account/delete?id=` + id })
  },

  // 导出学员账号 Excel
  exportCustomerAccount: async (params) => {
    return await request.download({ url: `/crm/customer/account/export-excel`, params })
  },
}
