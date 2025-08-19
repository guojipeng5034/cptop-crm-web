import request from '@/config/axios'

// 办公地 VO
export interface OfficePlaceVO {
  id: number // ID
  remark: string // 备注
  invalidFlag: boolean // 是否无效
  name: string // 名称
  sortOrder: number // 排序顺序
  offlineFlag: boolean // 是否适用线下（游学）校区
  typeId: number // 类型（1：校区，2：非校区）
}

// 办公地 API
export const OfficePlaceApi = {
  // 查询办公地分页
  getOfficePlacePage: async (params: any) => {
    return await request.get({ url: `/system/office-place/page`, params })
  },
  // 办公地列表
  getOfficePlaceList: async () => {
    return await request.get({ url: `/system/office-place/list` })
  },
  // 查询办公地详情
  getOfficePlace: async (id: number) => {
    return await request.get({ url: `/system/office-place/get?id=` + id })
  },

  // 新增办公地
  createOfficePlace: async (data: OfficePlaceVO) => {
    return await request.post({ url: `/system/office-place/create`, data })
  },

  // 修改办公地
  updateOfficePlace: async (data: OfficePlaceVO) => {
    return await request.put({ url: `/system/office-place/update`, data })
  },

  // 删除办公地
  deleteOfficePlace: async (id: number) => {
    return await request.delete({ url: `/system/office-place/delete?id=` + id })
  },

  // 导出办公地 Excel
  exportOfficePlace: async (params) => {
    return await request.download({ url: `/system/office-place/export-excel`, params })
  }
}