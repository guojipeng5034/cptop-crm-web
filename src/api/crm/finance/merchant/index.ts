import request from '@/config/axios'

// 商户基础配置 VO
export interface MerchantVO {
  id: number // 自增Id
  merchantName: string // 商户名
  merchantType: number // 商户类型
  merchantParameter: string // 商户参数
}

// 商户基础配置 API
export const MerchantApi = {
  // 查询商户基础配置分页
  getMerchantPage: async (params: any) => {
    return await request.get({ url: `/crm/base/merchantset/page`, params })
  },

  // 查询商户基础配置详情
  getMerchant: async (id: number) => {
    return await request.get({ url: `/crm/base/merchantset/get?id=` + id })
  },

  // 获取商户基础配置列表
  getSimpleMerchantList: async () => {
    return request.get({ url: `/crm/base/merchantset/simple-list` })
  },

  // 远程搜索获取商户基础配置列表
  getRemoteMerchantSimpleList: async (searchValue: string) => {
    return request.get({ url: `/crm/base/merchantset/like/simple-list?searchValue=` + searchValue })
  },

  // 获取收款方式列表
  getSimpleMerchantListMap: async (id?: number) => {
    if (id) {
      return request.get({ url: `/crm/base/merchantset/merchant-map?packageId=` + id })
    } else {
      return request.get({ url: `/crm/base/merchantset/merchant-map` })
    }
  },

  // 新增商户基础配置
  createMerchant: async (data: MerchantVO) => {
    return await request.post({ url: `/crm/base/merchantset/create`, data })
  },

  // 修改商户基础配置
  updateMerchant: async (data: MerchantVO) => {
    return await request.put({ url: `/crm/base/merchantset/update`, data })
  },

  // 删除商户基础配置
  deleteMerchant: async (id: number) => {
    return await request.delete({ url: `/crm/base/merchantset/delete?id=` + id })
  },

  // 导出商户基础配置 Excel
  exportMerchant: async (params) => {
    return await request.download({ url: `/crm/base/merchantset/export-excel`, params })
  },
}
