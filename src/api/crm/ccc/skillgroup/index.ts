import request from '@/config/axios'

// 阿里云外呼技能组 VO
export interface CccSkillGropVO {
  id: number // id
  skillGroupName: string // 技能组名称
  phoneNumberCount: number // 技能组关联的号码数量
  instanceId: string // 实例 ID
  userCount: number // 技能组关联的坐席数量
  displayName: string // 技能组展示名
  mediaType: string // 媒体类型
  skillGroupId: string // 技能组 ID
}

// 阿里云外呼技能组 API
export const CccSkillGropApi = {
  // 查询阿里云外呼技能组分页
  getCccSkillGropPage: async (params: any) => {
    return await request.get({ url: `/crm/ccc/skillgroup/page`, params })
  },

  // 查询阿里云外呼技能组详情
  getCccSkillGrop: async (id: number) => {
    return await request.get({ url: `/crm/ccc/skillgroup/get?id=` + id })
  },

  // 获取阿里云外呼所有的技能组
  getAliyunCCCSkillGroupList: async () => {
    return await request.get({ url: '/crm/ccc/skillgroup/getAliyunCCCSkillGroupList' })
  },

  // 新增阿里云外呼技能组
  createCccSkillGrop: async (data: CccSkillGropVO) => {
    return await request.post({ url: `/crm/ccc/skillgroup/create`, data })
  },

  // 修改阿里云外呼技能组
  updateCccSkillGrop: async (data: CccSkillGropVO) => {
    return await request.put({ url: `/crm/ccc/skillgroup/update`, data })
  },

  // 删除阿里云外呼技能组
  deleteCccSkillGrop: async (id: number) => {
    return await request.delete({ url: `/crm/ccc/skillgroup/delete?id=` + id })
  },

  // 导出阿里云外呼技能组 Excel
  exportCccSkillGrop: async (params) => {
    return await request.download({ url: `/crm/ccc/skillgroup/export-excel`, params })
  },
}
