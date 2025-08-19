import request from '@/config/axios'

// 电子合同 VO
export interface EContractVO {
  id: number // 自增主键
  customerId: number // 学员id
  orderId: number // 订单id
  studentName: string // 学员名
  mentorId: number // 顾问
  idCard: string // 学员身份证号
  parentName: string // 家长名
  parentIdCard: string // 家长身份证号
  auditorId: number // 审核人
  status: number // 状态
  address: string // 地址
}

// 电子合同 API
export const EContractApi = {
  // 查询电子合同分页
  getEContractPage: async (params: any) => {
    return await request.get({ url: `/crm/order/econtract/page`, params })
  },

  // 查询电子合同
  getEContract: async (id: number) => {
    return await request.get({ url: `/crm/order/econtract/get?id=` + id })
  },

  // 查询电子合同详情（orderId）
  getEContractDetail: async (orderId: number) => {
    return await request.get({ url: `/crm/order/econtract/get/detail?orderId=` + orderId })
  },

  // 获得部门信息
  getSite: async (customerId: number) => {
    return await request.get({ url: `/crm/order/econtract/get/site?customerId=` + customerId })
  },

  // 新增电子合同
  createEContract: async (data: EContractVO) => {
    return await request.post({ url: `/crm/order/econtract/create`, data })
  },

  // 审核电子合同
  auidtEContract: async (data) => {
    return await request.put({ url: `/crm/order/econtract/auidt`, data })
  },

  // 修改电子合同
  updateEContract: async (data: EContractVO) => {
    return await request.put({ url: `/crm/order/econtract/update`, data })
  },

  // 删除电子合同
  deleteEContract: async (id: number) => {
    return await request.delete({ url: `/crm/order/econtract/delete?id=` + id })
  },

  // 导出电子合同 Excel
  exportEContract: async (params) => {
    return await request.download({ url: `/crm/order/econtract/export-excel`, params })
  },
}
