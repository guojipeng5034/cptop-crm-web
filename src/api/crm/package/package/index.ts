import request from '@/config/axios'

// 套餐 VO
export interface PackageVO {
  id: number // 自增主键
  name: string // 套餐名字
  price: number // 价格
  packagesSimpleType: number // 套餐大类
  packagesType: number // 套餐类型
  isSign: boolean // 是否签约
  packagesId: number // QQE套餐ID/次卡ID
  points: number // 课时点数
  expireMonth: number // 有效月数
  explain: string // 描述
  packagesStatus: number // 套餐状态
  effectiveTime: Date // 生效时间
  noneffctiveTime: Date // 失效时间
  monthDeductTimes: number // 一月需要刷新次数
}

// 套餐 API
export const PackageApi = {
  // 查询套餐分页
  getPackagesPage: async (params: any) => {
    return await request.get({ url: `/crm/base/packages/page`, params })
  },

  // 查询套餐详情
  getPackages: async (id: number) => {
    return await request.get({ url: `/crm/base/packages/get?id=` + id })
  },

  // 获取套餐可用支付方式
  getPackagesPayType: async (customerId: number, packageId: number, orderId?: number) => {
    if (orderId !== undefined) {
      return await request.get({ url: `/crm/base/packages/pay-type?&packageId=${packageId}&customerId=${customerId}&orderId=${orderId}`})
    } else {
      return await request.get({ url: `/crm/base/packages/pay-type?&packageId=${packageId}&customerId=${customerId}`})
    }
  },

  // 获取套餐信息列表
  getSimplePackagesList: async (customerId?: number) => {
    if(customerId !== undefined) {
      return request.get({ url: `/crm/base/packages/simple-list?customerId=${customerId}`})
    } else {
      return request.get({ url: '/crm/base/packages/simple-list'})
    }    
  },

  // 获取全部套餐信息列表
  getAllPackagesSimpleList: async () => {
    return request.get({ url: `/crm/base/packages/simple-all-list`})
  },

  // 获取签约制套餐信息列表
  getSignSimplePackagesList: async (isSign: boolean, customerId?: number) => {
    return request.get({ url: `/crm/base/packages/simple-list?only_sign=${isSign}&customerId=${customerId}`})
  },

  // 获取切换套餐信息列表
  getSwitchSimplePackagesList: async (customerId: number) => {
    return request.get({ url: `/crm/base/packages/switch-simple-list?customerId=${customerId}`})
  },
  
  // 新增套餐
  createPackages: async (data: PackageVO) => {
    return await request.post({ url: `/crm/base/packages/create`, data })
  },

  // 修改套餐
  updatePackages: async (data: PackageVO) => {
    return await request.put({ url: `/crm/base/packages/update`, data })
  },

  // 修改套餐状态
  updatePackagesStatus: async (id: number, status: number) => {
    return await request.put({ url: `/crm/base/packages/update-status?id=${id}&packages_status=${status}` })
  },

  // 删除套餐
  deletePackages: async (id: number) => {
    return await request.delete({ url: `/crm/base/packages/delete?id=` + id })
  },

  // 导出套餐 Excel
  exportPackages: async (params) => {
    return await request.download({ url: `/crm/base/packages/export-excel`, params })
  },
}
