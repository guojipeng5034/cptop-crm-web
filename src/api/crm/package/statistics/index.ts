import request from '@/config/axios'

// 套餐统计 VO
export interface PackagesStatisticsVO {
  mentorId: number // MentorId
  mentorName: string // MentorName
  pendingNumber: number // Pending数
  openNumber:	string // 已开课数	
  stopNumber:	string // 已停课数	
  pendingPercentage: string // Pending占比	
  stopPercentage:	string // 已停课占比	
}

// 套餐统计 API
export const PackagesStatisticsApi = {
  // 查询套餐统计分页
  getPackagesStatisticsPage: async (params: any) => {
    return await request.get({ url: `/crm/packages/statistics/page`, params })
  },

  // 查询套餐统计总计
  getPackagesStatisticsTotal: async (params: any) => {
    return await request.get({ url: `/crm/packages/statistics/page/total`, params })
  },


  // 导出套餐统计 Excel
  exportStopLog: async (params) => {
    return await request.download({ url: `/crm/packages/statistics/export-excel`, params })
  },
}
