import request from '@/config/axios'

// 活动AI审核 VO
export interface AuditAiVO {
  id: number // ID
  customerId: string // 学员 ID 
}

// 活动AI审核 API
export const AuditAiApi = {
  // 查询活动AI审核分页
  getAuditaiPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/auditai/page`, params })
  },

  // 活动AI全部审核通过
  auditaiAllPass: async () => {
    return await request.post({ url: `/crm/activity/auditai/audit-all-pass` })
  },

  // 活动AI批量审核
  auditaiBatch: async (data: any) => {
    return await request.post({ url: `/crm/activity/auditai/audit-batch`, data })
  },
}