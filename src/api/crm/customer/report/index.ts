import request from '@/config/axios'

// 月度报告 VO
export interface MonthReportVO {
  id: number // 自增ID
  customerId: number // 学员ID
  reportType: number // 报告类型
  startTime: Date // 开始时间
  endTime: Date // 截止时间
  readTime: Date // 最后一次查看时间
  readTotalCount: number // 查看次数
  ipAddress: string // 查看人Ip
  ipArea: string // 查看人IP归属地
  readStatus: number // 查看状态
}

// 月度报告 API
export const MonthReportApi = {
  // 查询月度报告分页
  getMonthReportPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/monthlyreport/page`, params })
  },

  // 查询月度报告详情
  getMonthReport: async (id: number) => {
    return await request.get({ url: `/crm/customer/monthlyreport/get?id=` + id })
  },

  // 新增月度报告
  createMonthReport: async (data: MonthReportVO) => {
    return await request.post({ url: `/crm/customer/monthlyreport/create`, data })
  },

  // 修改月度报告
  updateMonthReport: async (data: MonthReportVO) => {
    return await request.put({ url: `/crm/customer/monthlyreport/update`, data })
  },

  // 删除月度报告
  deleteMonthReport: async (id: number) => {
    return await request.delete({ url: `/crm/customer/monthlyreport/delete?id=` + id })
  },

  // 导出月度报告 Excel
  exportMonthReport: async (params) => {
    return await request.download({ url: `/crm/customer/monthlyreport/export-excel`, params })
  },
}
