import request from '@/config/axios'

// 线索分配规则 VO
export interface ListOwnerAssignThresholdVO {
  mentorId: number // 顾问ID
  assignThreshold: number // 分配阈值
}

// 线索分配规则 API
export const ListOwnerAssignThresholdApi = {
  // 查询线索分配规则分页
  getListOwnerAssignThresholdPage: async (params: any) => {
    return await request.get({ url: `/crm/list-owner-assign-threshold/page`, params })
  },

  // 查询线索分配规则详情
  getListOwnerAssignThreshold: async (id: number) => {
    return await request.get({ url: `/crm/list-owner-assign-threshold/get?id=` + id })
  },

  // 新增线索分配规则
  createListOwnerAssignThreshold: async (data: ListOwnerAssignThresholdVO) => {
    return await request.post({ url: `/crm/list-owner-assign-threshold/create`, data })
  },

  // 修改线索分配规则
  updateListOwnerAssignThreshold: async (data: ListOwnerAssignThresholdVO) => {
    return await request.put({ url: `/crm/list-owner-assign-threshold/update`, data })
  },

  // 删除线索分配规则
  deleteListOwnerAssignThreshold: async (id: number) => {
    return await request.delete({ url: `/crm/list-owner-assign-threshold/delete?id=` + id })
  },

  // 导出线索分配规则Excel
  exportListOwnerAssignThreshold: async (params) => {
    return await request.download({ url: `/crm/list-owner-assign-threshold/export-excel`, params })
  },

  // 获取默认分配阈值
  getDefaultAssignThreshold: async () => {
    return await request.get({ url: `/crm/list-owner-assign-threshold/getDefaultAssignThreshold` })
  },

  // 设置默认分配阈值
  setDefaultAssignThreshold: async (data: ListOwnerAssignThresholdVO) => {
    return await request.post({ url: `/crm/list-owner-assign-threshold/setDefaultAssignThreshold`, data })
  },
}