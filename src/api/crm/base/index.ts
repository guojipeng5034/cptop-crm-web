import request from '@/config/axios'

// 基础 API
export const BaseApi = {
  // 短链接
  shortUrl: async (url: string) => {
    return await request.get({ url: `/crm/base/short-url/get?longUrl=` + encodeURIComponent(url) })
  },
  
  // 获取系统时间（年月日）
  getSystemDate: async () => {
    return await request.get({ url: `/crm/common/getSystemDate` })
  },
  
  // 获取敏感信息
  getDesensitizeInfo: async (data) => {
    return await request.post({ url: `/crm/desensitize/get`, data })
  }
}