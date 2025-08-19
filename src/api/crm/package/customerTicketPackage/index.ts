import request from '@/config/axios'

// 学员次卡套餐管理 VO
export interface CustomerTicketPackageVO {
  id: number // 自增ID
  customerId: number // 学员ID
  packageId: number // 套餐ID
  startLessonTime: Date // 开课时间
  expiresTime: Date // 到期时间
  openLessonUserId: number // 开课人
  revokeLessonTime: Date // 解约时间
  revokeLessonUserId: number // 解约人
  remark: string // 备注
  qqeTicketLogUid: string // qqe返回的ID,用于次卡解约
  lessonStatus: number // 套餐课程状态：字典
  oldStudentNumber: number, // 旧站点学号
  oldSiteId: number, // 所属旧站点
}

// 学员次卡套餐管理 API
export const CustomerTicketPackageApi = {
  // 查询学员次卡套餐管理分页
  getCustomerTicketPackagePage: async (params: any) => {
    return await request.get({ url: `/crm/packages/customerticketpackage/page`, params })
  },

  // 查询学员次卡套餐管理详情
  getCustomerTicketPackage: async (id: number) => {
    return await request.get({ url: `/crm/packages/customerticketpackage/get?id=` + id })
  },

  // 新增学员次卡套餐管理
  createCustomerTicketPackage: async (data: CustomerTicketPackageVO) => {
    return await request.post({ url: `/crm/packages/customerticketpackage/create`, data })
  },

  // 修改学员次卡套餐管理
  updateCustomerTicketPackage: async (data: CustomerTicketPackageVO) => {
    return await request.put({ url: `/crm/packages/customerticketpackage/update`, data })
  },

  // 开课
  openTicketPackage: async (data: CustomerTicketPackageVO) => {
    return await request.put({ url: `/crm/packages/customerticketpackage/openTicketPackage`, data })
  },

  // 解约
  revokeTicketPackage: async (data: CustomerTicketPackageVO) => {
    return await request.put({ url: `/crm/packages/customerticketpackage/revokeTicketPackage`, data })
  },

  // 删除学员次卡套餐管理
  deleteCustomerTicketPackage: async (id: number) => {
    return await request.delete({ url: `/crm/packages/customerticketpackage/delete?id=` + id })
  },

  // 导出学员次卡套餐管理 Excel
  exportCustomerTicketPackage: async (params) => {
    return await request.download({ url: `/crm/packages/customerticketpackage/export-excel`, params })
  },
}
