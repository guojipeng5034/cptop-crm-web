import request from '@/config/axios'

// 学员线索分配人员 VO
export interface ListOwnerAssignVO {
  id: number // 主键
  assignTime: Date // 分配日期
  mentorId: number // 顾问ID
  mentorDeptId: number // 顾问所属部门ID
  postIds: object // 顾问岗位ID
  flushTimes: number // 刷新次数
}

// 学员线索分配人员 API
export const ListOwnerAssignApi = {
  // 查询学员线索分配人员分页
  getListOwnerAssignPage: async (params: any) => {
    return await request.get({ url: `/crm/list-owner-assign/page`, params })
  },

  // 查询学员线索分配人员详情
  getListOwnerAssign: async (id: number) => {
    return await request.get({ url: `/crm/list-owner-assign/get?id=` + id })
  },

  // 新增学员线索分配人员
  createListOwnerAssign: async (data: ListOwnerAssignVO) => {
    return await request.post({ url: `/crm/list-owner-assign/create`, data })
  },

  // 修改学员线索分配人员
  updateListOwnerAssign: async (data: ListOwnerAssignVO) => {
    return await request.put({ url: `/crm/list-owner-assign/update`, data })
  },

  // 删除学员线索分配人员
  deleteListOwnerAssign: async (id: number) => {
    return await request.delete({ url: `/crm/list-owner-assign/delete?id=` + id })
  },
  
  // 批量删除学员线索分配人员
  deleteBatchListOwnerAssign: async (ids: number[]) => {
    return await request.delete({ url: `/crm/list-owner-assign/deleteBatch?ids=` + ids })
  },

  // 导出学员线索分配人员 Excel
  exportListOwnerAssign: async (params) => {
    return await request.download({ url: `/crm/list-owner-assign/export-excel`, params })
  },

  // 获得学员线索分配人员模板
  exportListOwnerAssignTemplate: async () => {
    return await request.download({ url: `/crm/list-owner-assign/export-template` })
  },

  // 导入线索分配人员管理 持久化 Excel
  persistenceImport: async (dataKey, year, month) => {
    return await request.post({ url: `/crm/list-owner-assign/persistenceImport?dataKey=${dataKey}&year=${year}&month=${month}`})
  }
}
