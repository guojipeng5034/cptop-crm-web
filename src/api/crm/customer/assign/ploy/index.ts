import request from '@/config/axios'

// 线索分配规则 VO
export interface ListOwnerAssignPloyVO {
  ployName: string // 分配规则名称
  ployEnable: number // 规则启用状态
  ployOrder: number // 优先级
  ployRemark: string // 备注
  ployType: number // 规则的类型
  promotionBusinessLineId: number // 渠道分配规则
  channelFirst: number // 一级渠道
  channelSecond: number // 二级渠道
  channelThird: number // 三级渠道
  channelFourth: number // 四级渠道 
  isAgency: number // 是否是代理
  mentorDeptIds: object // mentor部门
  referrerMentorDeptIds: object // 荐人归属顾问的部门
  assignStrategy: number // 分配的策略
  assignTarget: number // 分配目标
  chooseMethod: number // 选择方式
  chooseByDeptIds: object // 按部门选择
  chooseByPostIds: object // 按岗位选择
  chooseByMentorIds: object // 按顾问选择
  publicPoolDeptIds: string // 按部门选择
}

// 线索分配规则 API
export const ListOwnerAssignPloyApi = {
  // 查询线索分配规则分页
  getListOwnerAssignPloyPage: async (params: any) => {
    return await request.get({ url: `/crm/list-owner-assign-ploy/page`, params })
  },

  // 查询线索分配规则列表
  getListOwnerAssignPloyList: async (params: any) => {
    return await request.get({ url: `/crm/list-owner-assign-ploy/list`, params })
  },

  // 查询线索分配规则详情
  getListOwnerAssignPloy: async (id: number) => {
    return await request.get({ url: `/crm/list-owner-assign-ploy/get?id=` + id })
  },

  // 获取线索分配规则信息列表
  getSimpleListOwnerAssignList: async () => {
    return await request.get({ url: `/crm/list-owner-assign-ploy/simple-list` })
  },

  // 新增线索分配规则
  createListOwnerAssignPloy: async (data: ListOwnerAssignPloyVO) => {
    return await request.post({ url: `/crm/list-owner-assign-ploy/create`, data })
  },

  // 修改线索分配规则
  updateListOwnerAssignPloy: async (data: ListOwnerAssignPloyVO) => {
    return await request.put({ url: `/crm/list-owner-assign-ploy/update`, data })
  },

  updateBatchListOwnerAssignPloy: async (data) => {
    return await request.put({ url: `/crm/list-owner-assign-ploy/updateBatch`, data })
  },

  // 删除线索分配规则
  deleteListOwnerAssignPloy: async (id: number) => {
    return await request.delete({ url: `/crm/list-owner-assign-ploy/delete?id=` + id })
  },

  // 导出线索分配规则 Excel
  exportListOwnerAssignPloy: async (params) => {
    return await request.download({ url: `/crm/list-owner-assign-ploy/export-excel`, params })
  }
}