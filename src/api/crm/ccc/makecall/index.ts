import request from '@/config/axios'

// 阿里云外呼电话 VO
export interface cccVO {
  mobile: string // 手机号
}

// 阿里云外呼电话 API
export const cccApi = {
  // 查询阿里云外呼电话分页
  makeCall: async (data) => {
    return await request.post({ url: `/crm/ccc/makecall`, data })
  },
}
