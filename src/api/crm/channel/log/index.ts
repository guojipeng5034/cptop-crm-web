import request from '@/config/axios'

// 渠道页面变更日志 API
export const ChannelPageLogApi = {
  // 查询渠道变更日志分页
  getChannelPageLogPage: async (params: any) => {
    return await request.get({ url: `/crm/channel-change-log/page`, params })
  },

  // 导出渠道变更日志 Excel
  exportChannelPageLog: async (params: any) => {
    return await request.download({ url: `/crm/channel-change-log/export-excel`, params })
  },
}
