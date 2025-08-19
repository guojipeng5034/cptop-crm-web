import request from '@/config/axios'
// 顾问评价客服 VO
export interface WechatEvaluationVO {
  id: number // ID
  mentorId: number // 顾问
  mentorIds: number[] // 顾问
  assistDate: Date // 协助日期
  scheduling: number // 班次
  serviceId: number // 客服
  satisfaction: string // 满意度
  evaluation: string // 质量建议或槽点
  imgs: string[] // 截图附件
}

// 顾问评价客服 API
export const WechatEvaluationApi = {
  // 查询顾问评价客服分页
  getWechatEvaluationPage: async (params: any) => {
    return await request.get({ url: `/crm//wechat/evaluation/page`, params })
  },
  
  // 查询顾问评价客服详情
  getWechatEvaluation: async (id: number) => {
    return await request.get({ url: `/crm/wechat/evaluation/get?id=` + id })
  },

  // 新增顾问评价客服
  createWechatEvaluation: async (data: WechatEvaluationVO) => {
    return await request.post({ url: `/crm/wechat/evaluation/create`, data })
  },

  // 修改顾问评价客服
  updateWechatEvaluation: async (data: WechatEvaluationVO) => {
    return await request.put({ url: `/crm/wechat/evaluation/update`, data })
  },

  // 删除顾问评价客服
  deleteWechatEvaluation: async (id: number) => {
    return await request.delete({ url: `/crm/wechat/evaluation/delete?id=` + id })
  },
  
  // 导出顾问评价客服 Excel
  exportWechatEvaluation: async (params) => {
    return await request.download({ url: `/crm/wechat/evaluation/export-excel`, params })
  },

  // 顾问评价
  evaluationWechatEvaluation: async (data) => {
    return await request.put({ url: `/crm/wechat/evaluation/evaluation`, data })
  },
}
