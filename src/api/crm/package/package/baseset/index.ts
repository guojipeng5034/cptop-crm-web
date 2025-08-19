import request from '@/config/axios'

// 商户套餐关系 VO
export interface PackagesBaseSetVO {
  id: number // 自增Id
  packageId: number // 套餐id
  merchantIds: Array<number> // 商户Id
  merchantNames: Array<string> // 商户名数组
  merchantNamesMap: object // 商户名map
  siteId: number // 站点id
}

// 商户套餐关系 API
export const PackagesBaseSetApi = {
  // 查询商户套餐关系分页
  getPackagesBasePage: async (params: any) => {
    return await request.get({ url: `/crm/base/packages/baseset/page`, params })
  },

  // 查询商户套餐关系详情
  getPackagesBaseSet: async (id: number) => {
    return await request.get({ url: `/crm/base/packages/baseset/get?id=` + id })
  },

//  // 获取商户基础配置列表
//   getSimplePackagesBaseSetList: async () => {
//     return request.get({ url: '/crm/base/packages/baseset/simple-list' })
//   },

  // 新增商户套餐关系
  createPackagesBaseSet: async (data: PackagesBaseSetVO) => {
    return await request.post({ url: `/crm/base/packages/baseset/create`, data })
  },

  // 修改商户套餐关系
  updatePackagesBaseSet: async (data: PackagesBaseSetVO) => {
    return await request.put({ url: `/crm/base/packages/baseset/update`, data })
  },

  // 删除商户套餐关系
  deletePackagesBaseSet: async (id: number) => {
    return await request.delete({ url: `/crm/base/packages/baseset/delete?id=` + id })
  },

  // 导出商户套餐关系 Excel
  exportPackagesBaseSet: async (params) => {
    return await request.download({ url: `/crm/base/packages/baseset/export-excel`, params })
  },
}
