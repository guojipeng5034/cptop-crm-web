import request from '@/config/axios'

// 学员 VO
export interface CustomerVO {
  id: number // 自增主键
  customerId: number // 学号
  uid: string // 唯一标识
  name: string // 姓名
  age: number // 年龄
  phone: string // 电话
  countryCode: number // 国家/地区码
  mail: string // 邮箱
  referrerNum: number // 推荐人学号
  agencyId: number // 代理id
  adid: number // 渠道adid
  sourceUrl: string // 来源url
  deptId: number // 所属部门
  callStatus: number // 跟进状态
  oldStudentNumber: number, // 旧站点学号
  oldSiteId: number, // 所属旧站点
}

export interface TransferLogVO {
  id: number // 主键
  customerIds: number[] // 学员ID数组
  targetResponsibleId: number // 变更后顾问
  reason: number // 转让原因
  remarks: string // 备注
}

// 学员 API
export const CustomerApi = {
  // 查询学员分页
  getCustomerPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/page`, params })
  },

  // 查询学员详情
  getCustomer: async (id: number) => {
    return await request.get({ url: `/crm/customer/get?id=` + id })
  },

  // 获取学员信息列表
  getSimpleCustomerList: async () => {
    return request.get({ url: '/crm/customer/simple-list' })
  },
    
  // 新增学员
  createCustomer: async (data: CustomerVO) => {
    return await request.post({ url: `/crm/customer/create`, data })
  },

  // 修改学员
  updateCustomer: async (data) => {
    return await request.put({ url: `/crm/customer/update`, data })
  },

  // 删除学员
  deleteCustomer: async (id: number) => {
    return await request.delete({ url: `/crm/customer/delete?id=` + id })
  },

  // 导出学员 Excel
  exportCustomer: async (params) => {
    return await request.download({ url: `/crm/customer/export-excel`, params })
  },

  // 远程获取学员信息列表
  getCustomerSearchList: async (searchValue: string, type?: number) => {
    if (!type) return request.get({ url: `/crm/customer/search-list?searchValue=${searchValue}` })
    return request.get({ url: `/crm/customer/search-list?type=${type}&&searchValue=${searchValue}` })
  },

  // 远程获取有 QQE 账号学员信息列表
  getExistAccoutCustomerSearchList: async (searchValue: string) => {
     return request.get({ url: `/crm/customer/search-list-exist-account?searchValue=${searchValue}` })
  },

  // 获得某个 mentor 名下所有学员列表
  getMentorCustomerList: async (mentorId: number) => {
    return request.get({ url: '/crm/customer/mentor-customer-list?mentorId=' + mentorId })
  },

  // mentor全量划分
  transferAll: async (data) => {
    return request.post({ url: '/crm/customer/transfer-all', data })
  },

  // mentor批量划分
  transferBatch: async (data) => {
    return request.post({ url: '/crm/customer/transfer-batch', data })
  },

  // mentor单个划分
  transferSingle: async (data) => {
    return request.post({ url: '/crm/customer/transfer-single', data })
  },

  // 查询学员固定课信息
  getCustomerFixingLessons: async (id: number) => {
    return await request.get({ url: `/crm/customer/get-fixing-lessons?id=` + id })
  },

  // 线索划分
  updateListOwner: async (data) => {
    return await request.put({ url: `/crm/customer/updateListOwner`, data })
  },

  // 新 mentor批量划分
  transferMentorAll: async (data) => {
    return request.post({ url: '/crm/customer/transfer-mentor-all', data })
  },

  // 获得批量导入课时点模板
  getCustomerTransferMentorTemplate: async () => {
    return await request.download({ url: `/crm/customer/get-import-template` })
  },

  // 获得学员流转记录
  getRetentionInfo: async (id: number) => {
    return await request.get({ url: `/crm/customer-retention-information/query/by/customer/id?customerId=` + id })
  },

  // 获得客户联系状态记录分页
  getContactStatus: async (params: any) => {
    return await request.get({ url: `/crm/customer-contact-status-log/page`, params })
  },

  // 学员交接
  handleValidCustomerConnect: async (customerId: number) => {
    return await request.get({ url: `/crm/customer/valid-customer-connect?customerId=` + customerId  })
  },
  
  // 批量学员交接
  handleValidCustomerConnectBatch: async (data) => {
    return await request.post({ url: `/crm/customer/valid-customer-connect-batch`, data })
  },
}
