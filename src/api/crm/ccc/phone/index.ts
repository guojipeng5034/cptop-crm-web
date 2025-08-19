import request from '@/config/axios'

// 阿里云外呼电话 VO
export interface CccPhoneNumberVO {
  id: number // id
  active: boolean // 号码是否可用
  usage: string // 号码用途
  number: number // 号码
  instanceId: string // 实例 ID
  skillGroups: string // 技能组
  city: string // 城市
  province: string // 省份
  provider: string // 号码供应商名称
  createTime: Date // 号码创建时间
}

// 阿里云外呼电话 API
export const CccPhoneNumberApi = {
  // 查询阿里云外呼电话分页
  getCccPhoneNumberPage: async (params: any) => {
    return await request.get({ url: `/crm/ccc/phone/page`, params })
  },

  // 查询阿里云外呼电话详情
  getCccPhoneNumber: async (id: number) => {
    return await request.get({ url: `/crm/ccc/phone/get?id=` + id })
  },

  // 新增阿里云外呼电话
  createCccPhoneNumber: async (data: CccPhoneNumberVO) => {
    return await request.post({ url: `/crm/ccc/phone/create`, data })
  },

  // 修改阿里云外呼电话
  updateCccPhoneNumber: async (data: CccPhoneNumberVO) => {
    return await request.put({ url: `/crm/ccc/phone/update`, data })
  },

  // 删除阿里云外呼电话
  deleteCccPhoneNumber: async (id: number) => {
    return await request.delete({ url: `/crm/ccc/phone/delete?id=` + id })
  },

  // 导出阿里云外呼电话 Excel
  exportCccPhoneNumber: async (params) => {
    return await request.download({ url: `/crm/ccc/phone/export-excel`, params })
  },
}
