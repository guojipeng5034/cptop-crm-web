import request from '@/config/axios'

// 工作微信 VO
export interface WechatRecordVO {
  id: number // ID，自增主键
  owner: string // 归属员工
  phoneHomePlace: string // 号码归属地
  realName: number // 实名认证
  bindBank: number // 绑定银行卡
  payPassword: string // 支付密码
}

// 工作微信 API
export const WechatRecordApi = {
  // 查询工作微信分页
  getWechatRecordPage: async (params: any) => {
    return await request.get({ url: `/crm/wechat/record/page`, params })
  },

  // 查询工作微信详情
  getWechatRecord: async (id: number) => {
    return await request.get({ url: `/crm/wechat/record/get?id=` + id })
  },

  // 修改工作微信
  updateWechatRecord: async (data: WechatRecordVO) => {
    return await request.put({ url: `/crm/wechat/record/update`, data })
  },

  // 导出工作微信 Excel
  exportWechatRecord: async (params) => {
    return await request.download({ url: `/crm/wechat/record/export-excel`, params })
  },

  // 手动同步工作微信
  syncWechatRecord: async () => {
    return await request.get({ url: `/crm/wechat/record/pullWorkWechat` })
  },

  // 获得工作微信历史记录
  getWechatRecordHistory: async (params: any) => {
    return await request.get({ url: `/crm/wechat/record/history`, params })
  }
}
