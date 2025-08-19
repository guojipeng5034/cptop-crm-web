import request from '@/config/axios'

// 好友列 VO
export interface WechatFriendVO {
  id: number // ID
  customerId: string // 学员系统账号
  friendRecordId: number // 好友记录id
  wechatId: string // 微信id
  wechatRecordId: string // 微信记录id
  wechatAlias: string // 微信号
  remark: string // 备注
  nickname: string // 昵称
  pyinitial: string // 群名
  source: number // 来源
  avatar: string // 头像
  phone: string // 电话号码
  isDeleted: number // 是否删除
  accountId: number // 客服id
  ispassed: number // 是否通过好友
  applyTime: Date // 申请时间
  passTime: Date // 通过好友时间
  deleteTime: Date // 删除时间
  addTime: Date // 添加时间
  friendStatus: number // 好友状态
  customerName: string // 学员姓名
}

// 好友列 API
export const WechatFriendApi = {
  // 查询好友列分页
  getWechatFriendPage: async (params: any) => {
    return await request.get({ url: `/crm/wechat/friend/page`, params })
  },

  // 查询好友列详情
  getWechatFriend: async (id: number) => {
    return await request.get({ url: `/crm/wechat/friend/get?id=` + id })
  },

  // 从微管家增量拉取好友列表
  updateIncrement: async () => {
    return await request.put({ url: `/crm/wechat/friend/updateIncrement` })
  },

  // 导出好友列 Excel
  exportWechatFriend: async (params) => {
    return await request.download({ url: `/crm/wechat/friend/export-excel`, params })
  },

  // 自动绑定学员号
  autoBindFriend: async () => {
    return await request.get({ url: `/crm/wechat/friend/autoBindFriend` })
  },

  // 手动绑定学员号
  updateUserBind: async (data: WechatFriendVO) => {
    return await request.put({ url: `/crm/wechat/friend/updateUserBind`, data })
  },

  // 学员详情-绑定微信号
  getWechatCustomer: async (customerId: number) => {
    return await request.get({ url: `/crm/wechat/friend/getWechatCustomer?customerId=` + customerId })
  }
}
