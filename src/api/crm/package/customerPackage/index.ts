import request from '@/config/axios'

// 学员套餐管理 VO
export interface CustomerPackageVO {
  id: number // 自增ID
  customerId: number // 学员ID
  customerName: string // 学员名字
  packageId: number // 套餐ID
  packageName: string // 套餐名字
  isSign: boolean // 是否签约
  startLessonTime: Date // 开课时间
  flushedTime: Date // 套餐上次刷新时间
  nextFlushTime: Date // 套餐下次刷新时间
  expiresTime: Date // 套餐到期时间
  lessonStatus: number // 套餐状态
  changePackageStatus: number // 是否切换套餐
  changePackageId: number // 切换的套餐ID
  refreshTimes: number // 刷新次数
  stopRenewFlag: number // 是否停止套餐刷新
  stopLessonTime: Date // 上一次停课时间
  openLessonUserId: number // 开课人
  stopLessonUserId: number // 停课人
  revokeLessonTime: Date // 解约时间
  revokeLessonUserId: number // 解约人
  invalid: number // 套餐是否有效
  remark: string // 备注
  oldStudentNumber: number, // 旧站点学号
  oldSiteId: number, // 所属旧站点
}

// 学员套餐管理 API
export const CustomerPackageApi = {
  // 查询学员套餐管理分页
  getCustomerPackagePage: async (params: any) => {
    return await request.get({ url: `/crm/packages/customerpackage/page`, params })
  },

  // 查询学员套餐管理详情
  getCustomerPackage: async (id: number) => {
    return await request.get({ url: `/crm/packages/customerpackage/get?id=` + id })
  },
  
  // 新增学员套餐管理
  createCustomerPackage: async (data: CustomerPackageVO) => {
    return await request.post({ url: `/crm/packages/customerpackage/create`, data })
  },

  // 修改学员套餐管理
  updateCustomerPackage: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/update`, data })
  },

  // 开课
  openLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/openLesson`, data })
  },

  // 预约开课
  scheduleOpenLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/scheduleOpenLesson`, data })
  },

  // 停课
  stopLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/stopLesson`, data })
  },

  // 预约停课
  scheduleStopLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/scheduleStopLesson`, data })
  },  

  // 延期停课
  delayLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/delayLesson`, data })
  },  

  // 恢复
  restartLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/restartLesson`, data })
  },  

  // 取消预约开课
  cancelOpenSchedule: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/cancelOpenSchedule`, data })
  },  

  // 取消预约停课
  cancelStopSchedule: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/cancelStopSchedule`, data })
  },  

  // 解约
  revokeLesson: async (data: CustomerPackageVO) => {
    return await request.put({ url: `/crm/packages/customerpackage/revokeLesson`, data })
  },  

  // 获取当前学员可设置切换的套餐列表
  getCanChangePackages: async (id: number, customerId: number) => {
    return await request.get({ url: `/crm/packages/customerpackage/getCanChangePackages?id=${id}&customerId=${customerId}`})
  },

  // 删除学员套餐管理
  deleteCustomerPackage: async (id: number) => {
    return await request.delete({ url: `/crm/packages/customerpackage/delete?id=` + id })
  },

  // 导出学员套餐管理 Excel
  exportCustomerPackage: async (params) => {
    return await request.download({ url: `/crm/packages/customerpackage/export-excel`, params })
  },
}
