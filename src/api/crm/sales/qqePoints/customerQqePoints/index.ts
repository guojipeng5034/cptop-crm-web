import request from '@/config/axios'

// 学员课时点 VO
export interface CustomerQqePointsVO {
  id: number // 自增Id
  customerId: number // 学员Id
  returnPointsNum: number // 返还课时点点数
  returnType: number // 返回类型
  remark: string // 备注
}

// 学员课时点 API
export const CustomerQqePointsApi = {
  // 查询学员课时点分页
  getCustomerQqePointsPage: async (params: any) => {
    return await request.get({ url: `/crm/sales/returnLog/qqePoints/page`, params })
  },

  // 查询学员课时点详情
  getCustomerQqePoints: async (id: number) => {
    return await request.get({ url: `/crm/sales/returnLog/qqePoints/get?id=` + id })
  },

  // 获得批量导入课时点模板
  getCustomerQqePointsTemplate: async () => {
    return await request.download({ url: `/crm/sales/returnLog/qqePoints/get-import-template` })
  },
  
  // 批量添加导入学员课时点
  importCustomerQqePoints: async (data: CustomerQqePointsVO) => {
    return await request.post({ url: `/crm/sales/returnLog/qqePoints/import`, data })
  },

  // 新增学员课时点
  createCustomerQqePoints: async (data: CustomerQqePointsVO) => {
    return await request.post({ url: `/crm/sales/returnLog/qqePoints/create`, data })
  },

  // 获取学员返还限制
  getCustomerQqePointsLimit: async (data: CustomerQqePointsVO) => {
    return await request.post({ url: `/crm/sales/returnLog/qqePoints/returnPointsLimit`, data })
  },

  // 扣除学员课时点
  removeCustomerQqePoints: async (data: CustomerQqePointsVO) => {
    return await request.post({ url: `/crm/sales/returnLog/qqePoints/remove`, data })
  },

  // 修改学员课时点
  updateCustomerQqePoints: async (data: CustomerQqePointsVO) => {
    return await request.put({ url: `/crm/sales/returnLog/qqePoints/update`, data })
  },

  // 删除学员课时点
  deleteCustomerQqePoints: async (id: number) => {
    return await request.delete({ url: `/crm/sales/returnLog/qqePoints/delete?id=` + id })
  },

  // 导出学员课时点 Excel
  exportCustomerQqePoints: async (params) => {
    return await request.download({ url: `/crm/sales/returnLog/qqePoints/export-excel`, params })
  },
}
