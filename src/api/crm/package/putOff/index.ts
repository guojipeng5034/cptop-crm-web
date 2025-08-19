import request from '@/config/axios'

// 学员开课&停课记录 VO
export interface PutOffVO {
  id: number // 自增ID
  customerId: number // 学员ID
  customerPackageId: number // 学员套餐ID
  putOffTime: Date // 预约时间
  stopMonth: number // 停课月数
  couponCustomerIds: object // 停课券数组
  lessonType: number // 课程操作类型(开课/停课)：字典
  operationStatus: number // 状态(成功/失败)：字典
}

// 学员开课&停课记录 API
export const PutOffApi = {
  // 查询学员开课&停课记录分页
  getPutOffPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/packageputoff/page`, params })
  },

  // 查询学员开课&停课记录详情
  getPutOff: async (id: number) => {
    return await request.get({ url: `/crm/packages/packageputoff/get?id=` + id })
  },

  // 查询学员预约记录详情
  getPutOffRecord: async (customerId: number, customerPackageId: number, lessonStatus: number) => {
    return await request.get({ url: `/crm/packages/packageputoff/get-customer-putoff-record?customerId=${customerId}&customerPackageId=${customerPackageId}&lessonStatus=${lessonStatus}` })
  },

  // 新增学员开课&停课记录
  createPutOff: async (data: PutOffVO) => {
    return await request.post({ url: `/crm/packages/packageputoff/create`, data })
  },

  // 修改学员开课&停课记录
  updatePutOff: async (data: PutOffVO) => {
    return await request.put({ url: `/crm/packages/packageputoff/update`, data })
  },

  // 删除学员开课&停课记录
  deletePutOff: async (id: number) => {
    return await request.delete({ url: `/crm/packages/packageputoff/delete?id=` + id })
  },

  // 导出学员开课&停课记录 Excel
  exportPutOff: async (params) => {
    return await request.download({ url: `/crm/packages/packageputoff/export-excel`, params })
  },
}
