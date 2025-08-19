import request from '@/config/axios'

// 学员套餐停课记录 VO
export interface StopLogVO {
  id: number // 自增ID
  customerId: number // 学员ID
  stopLessonUserId: number // 停课操作人
  stopLessonTime: Date // 停课时间
  openLessonUserId: number // 恢复套餐操作人
  openLessonTime: Date // 恢复套餐的时间
  stopMonthCount: number // 停课月数
  stopLessonType: number // 停课类型
  planOpenLessonTime: Date // 计划执行开课操作，还原听课日期
}

// 学员套餐停课记录 API
export const StopLogApi = {
  // 查询学员套餐停课记录分页
  getStopLogPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/stoplog/page`, params })
  },

  // 查询学员套餐停课记录详情
  getStopLog: async (id: number) => {
    return await request.get({ url: `/crm/packages/stoplog/get?id=` + id })
  },

   // 查询学员套餐停课记录详情
  getStopLogRecord: async (customerId: number) => {
    return await request.get({ url: `/crm/packages/stoplog/get-customer-stop-log?customerId=${customerId}` })
  },

  // 新增学员套餐停课记录
  createStopLog: async (data: StopLogVO) => {
    return await request.post({ url: `/crm/packages/stoplog/create`, data })
  },

  // 修改学员套餐停课记录
  updateStopLog: async (data: StopLogVO) => {
    return await request.put({ url: `/crm/packages/stoplog/update`, data })
  },

  // 删除学员套餐停课记录
  deleteStopLog: async (id: number) => {
    return await request.delete({ url: `/crm/packages/stoplog/delete?id=` + id })
  },

  // 导出学员套餐停课记录 Excel
  exportStopLog: async (params) => {
    return await request.download({ url: `/crm/packages/stoplog/export-excel`, params })
  },
}
