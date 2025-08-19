import request from '@/config/axios'
import { getTicketOptions } from '@/utils/dict'

// 套餐 VO
export interface SubscriptionVO {
  siteId: number
}

// 套餐 API
export const SubscriptionApi = {
  // 获取QQE可用套餐
  getSimpleQqePointsList: async (siteId?: number) => {
    if(siteId !== undefined) {
      return request.get({ url: `/crm/qqe/subscription/simple-list?siteId=${siteId}`})
    } else {
      return request.get({ url: '/crm/qqe/subscription/simple-list'})
    }    
  },
  
  // 获取次卡代码
  getSimpleTicketList: async (siteId?: number) => {
    return request.get({ url: `/crm/qqe/subscription/ticket-simple-list?siteId=${siteId}`})
  },

  // 远程搜索获取次卡代码
  getTicketSearchList: async (data) => {
    return await request.post({ url: `/crm/qqe/subscription/ticket-simple-search-list`, data})
  }
}
