import request from '@/config/axios'

// 阿里云外呼坐席管理 VO
export interface CccUserVO {
  id: number // id
  loginName: string // 坐席登录名
  email: string // 邮箱
  skillLevel: number // 技能等级
  skillGroupName: string // 技能组名称
  skillGroupId: string // 技能组 ID
  ramId: number // 坐席关联的 RAM 账号的 UID
  mobile: string // 坐席的个人电话号码
  roleId: string // 角色 ID
  extension: string // 座机分机号
  roleName: string // 角色名称
  userId: string // 坐席 ID
  primary: boolean // 坐席映射的 RAM 账户是否为 RAM 主账号
  displayName: string // 坐席展示名
  workMode: string // 工作模式
}

// 阿里云外呼坐席管理 API
export const CccUserApi = {
  // 查询阿里云外呼坐席管理分页
  getCccUserPage: async (params: any) => {
    return await request.get({ url: `/crm/ccc/user/page`, params })
  },

  // 新增阿里云外呼坐席管理
  createCccUser: async (data) => {
    return await request.post({ url: `/crm/ccc/user/createUser`, data })
  },

  // 获取外呼坐席信息
  getAliyunCCCUser: async (systemUserId) => {
    return await request.get({ url: '/crm/ccc/user/getAliyunCCCUser?systemUserId=' + systemUserId })
  },

  // 删除系统用户 RAM 账号
  deleteRam: async (systemUserId) => {
    return await request.delete({ url: '/crm/ccc/user/deleteRam?systemUserId=' + systemUserId })
  },

  // 重置外呼RAM账号密码
  updateRamUserPassword: async(systemUserId) => {
    return await request.get({ url: '/crm/ccc/user/updateRamUserPassword?systemUserId=' + systemUserId })
  },

  // 绑定客服与阿里云外呼坐席
  bindCccUser: async(data) => {
    return await request.put({ url: '/crm/ccc/user/bindCccUser', data })
  },

  // 远程获取阿里云坐席（邮箱、坐席名称）
  getCccUserSearchList: async (searchValue: string) => {
    return request.get({ url: '/crm/ccc/user/search-list?searchValue=' + searchValue })
  },

  updateRamUserKey: async(id: number) => {
    return await request.get({ url: '/crm/ccc/user/updateRamUserKey?id=' + id })
  },
}
