import request from '@/config/axios'

// 线索分配规则人员范围 VO
export interface ListOwnerAssignPloyMentorCrossVO {
  id: number // 主键
  ployId: number // 分配规则
  userId: number // 用户
  deptId: number // 用户部门
  assignTime: Date // 分配日期
}

// 线索分配规则人员范围 API
export const ListOwnerAssignPloyMentorCrossApi = {
  // 查询线索分配规则人员范围分页
  getListOwnerAssignPloyMentorCrossPage: async (params: any) => {
    return await request.get({ url: `/crm/list-owner-assign-ploy-mentor-cross/page`, params })
  },

  // 查询线索分配规则人员范围详情
  getListOwnerAssignPloyMentorCross: async (id: number) => {
    return await request.get({ url: `/crm/list-owner-assign-ploy-mentor-cross/get?id=` + id })
  },

  // 新增线索分配规则人员范围
  createListOwnerAssignPloyMentorCross: async (data: ListOwnerAssignPloyMentorCrossVO) => {
    return await request.post({ url: `/crm/list-owner-assign-ploy-mentor-cross/create`, data })
  },

  // 修改线索分配规则人员范围
  updateListOwnerAssignPloyMentorCross: async (data: ListOwnerAssignPloyMentorCrossVO) => {
    return await request.put({ url: `/crm/list-owner-assign-ploy-mentor-cross/update`, data })
  },

  // 删除线索分配规则人员范围
  deleteListOwnerAssignPloyMentorCross: async (id: number) => {
    return await request.delete({ url: `/crm/list-owner-assign-ploy-mentor-cross/delete?id=` + id })
  },

  // 导出线索分配规则人员范围 Excel
  exportListOwnerAssignPloyMentorCross: async (params) => {
    return await request.download({ url: `/crm/list-owner-assign-ploy-mentor-cross/export-excel`, params })
  }
}

