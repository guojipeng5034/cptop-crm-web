import request from '@/config/axios'

// 打卡记录有效沟通记录 VO
export interface WechatLogVO {
  id: number // 自增ID
  clockId: number // 打卡记录Id
  effectiveChatContent: string // 打卡有效沟通记录
  effectiveChatPage: string // 打卡有效沟通记录截图
}

// 打卡记录有效沟通记录 API
export const WechatLogApi = {
  // 查询打卡记录有效沟通记录分页
  getClockWechatLogPage: async (params: any) => {
    return await request.get({ url: `/crm/activity/wechatlog/page`, params })
  },

  // 查询打卡记录有效沟通记录详情
  getClockWechatLog: async (clockId: number) => {
    return await request.get({ url: `/crm/activity/wechatlog/get-by-clock?clockId=` + clockId })
  },

  // 新增打卡记录有效沟通记录
  createClockWechatLog: async (data: WechatLogVO) => {
    return await request.post({ url: `/crm/activity/wechatlog/create`, data })
  },

  // 修改打卡记录有效沟通记录
  updateClockWechatLog: async (data: WechatLogVO) => {
    return await request.put({ url: `/crm/activity/wechatlog/update`, data })
  },

  // 删除打卡记录有效沟通记录
  deleteClockWechatLog: async (id: number) => {
    return await request.delete({ url: `/crm/activity/wechatlog/delete?id=` + id })
  },

  // 导出打卡记录有效沟通记录 Excel
  exportClockWechatLog: async (params) => {
    return await request.download({ url: `/crm/activity/wechatlog/export-excel`, params })
  },
}
