import request from '@/config/axios'

// 学员学习状态变更 VO
export interface StudyStatusVO {
  id: number // 自增ID
  customerId: number // 学员ID
  lastStudyStatus: number // 上次的状态：字典
  studyStatus: number // 当前的状态：字典
}

// 学员学习状态变更 API
export const StudyStatusApi = {
  // 查询学员学习状态变更分页
  getStudyStatusPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/studystatus/page`, params })
  },

  // 查询学员学习状态变更详情
  getStudyStatus: async (id: number) => {
    return await request.get({ url: `/crm/customer/studystatus/get?id=` + id })
  },

  // 新增学员学习状态变更
  createStudyStatus: async (data: StudyStatusVO) => {
    return await request.post({ url: `/crm/customer/studystatus/create`, data })
  },

  // 修改学员学习状态变更
  updateStudyStatus: async (data: StudyStatusVO) => {
    return await request.put({ url: `/crm/customer/studystatus/update`, data })
  },

  // 删除学员学习状态变更
  deleteStudyStatus: async (id: number) => {
    return await request.delete({ url: `/crm/customer/studystatus/delete?id=` + id })
  },

  // 导出学员学习状态变更 Excel
  exportStudyStatus: async (params) => {
    return await request.download({ url: `/crm/customer/studystatus/export-excel`, params })
  },
}
