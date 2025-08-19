import request from '@/config/axios'

// 学员详情 VO
export interface CustomerDetailVO {
  id: number // id
  customerId: number // 学员id
  englishName: string // 学员英文名
  firstName: string // first name
  lastName: string // last name
  gender: number // 性别
  reserveDatetime: Date // ftl预约的时间
  fromIp: string // 来源IP
  fromKeywords: string // from keywords
  fromSearchEngine: string // from search engine
  fromSearchEngineId: string // from search engine id
  fromArea: string // 来源地区
  serviceStatus: string // 服务状态
  httpReferer: string // http referer
  remarks: string // 备注
  customerType: string // 学员类型
  enrollmentType: number // 注册类型
  enrollmentRequirements: string // 注册时的需求
  purpose: string // 意图
  ftlStatus: number // ftl状态
  otoType: string // 学员channel
  address: string // 学员地址
  facebook: string // facebook 账号
  skype: string // skype账号
  nationality: string // 国籍
  grade: number // 等级
  recommenderRemarks: string // 转介绍备注
  openclassLessonCount: number // 课程数
  professionType: string // 职业类型
  birthday: Date // 生日
  wechat: string // 微信
  whatsapp: string // whatsapp账号
  lineNumber: string // line 账号
  facebookNumber: string // facebook账号
  instantMessenger: number // 即时通讯软件
  socialSoftware: number // 社交工具
  school: string // 学校地址
  relationshipsWithFriends: number // 和推荐人关系
  equipment: number // 上课设备
  pastLearnPeriod: number // 过去的学习期
  theTutorealType: number // tutoreal_type
  englishLearnPeriod: number // 英语学习周期
  effection: number // 学习效果
  englishAbility: number // 英语能力
  lessonTime: number // 学习频次
  englishReading: number // 英语阅读能力
  parentEnAbility: number // 父母英语能力
  selectionStandard: string // 选择标准
  requireByKid: string // 孩子的需求
  requireByParents: string // 服务需求
  weekpoints: string // 缺点
  strongpoints: string // 优点
  cantonese: number // 是否说粤语
  parentType: number // 监护人
  englishLevel: number // 英语能级
  sourceOfDiscovery: number // 来源
  relationWithRecommender: number // 和推荐人的关系
}

// 学员详情 API
export const CustomerDetailApi = {
  // 查询学员详情分页
  getCustomerDetailPage: async (params: any) => {
    return await request.get({ url: `/crm/customer/detail/page`, params })
  },

  // 查询学员详情详情
  getCustomerDetail: async (id: number) => {
    return await request.get({ url: `/crm/customer/detail/get?id=` + id })
  },

  // 新增学员详情
  createCustomerDetail: async (data: CustomerDetailVO) => {
    return await request.post({ url: `/crm/customer/detail/create`, data })
  },

  // 修改学员详情
  updateCustomerDetail: async (data: CustomerDetailVO) => {
    return await request.put({ url: `/crm/customer/detail/update`, data })
  },

  // 删除学员详情
  deleteCustomerDetail: async (id: number) => {
    return await request.delete({ url: `/crm/customer/detail/delete?id=` + id })
  },

  // 导出学员详情 Excel
  exportCustomerDetail: async (params) => {
    return await request.download({ url: `/crm/customer/detail/export-excel`, params })
  },
}