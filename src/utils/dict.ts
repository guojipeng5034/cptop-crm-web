/**
 * 数据字典工具类
*/
import { isEmpty } from './is'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElementPlusInfoType } from '@/types/elementPlus'
import * as UserApi from '@/api/system/user'
import { ChannelActivityApi } from '@/api/crm/channel/activity'
import { ChannelPageTagApi } from '@/api/crm/channel/pageTag'
import { ChannelAgencyApi } from '@/api/crm/agency/agencymag'
import { RegisterLinkApi } from '@/api/crm/sales/poster/registerlink'
import { PackageApi } from '@/api/crm/package/package'
import { PackageOrderApi } from '@/api/crm/order/package'
import { CustomerPackageApi } from '@/api/crm/package/customerPackage'
import { CustomerApi } from '@/api/crm/customer/base'
import { CouponApi } from '@/api/crm/sales/coupon/coupon'
import { CustomerTicketApi } from '@/api/crm/sales/ticket/customerTicket'
import { SuspendApi } from '@/api/crm/sales/suspend/suspend'
import { ChannelPageApi } from '@/api/crm/channel/page'
import { AgencyCommissionRulesApi } from '@/api/crm/agency/commission/rules'
import { MerchantApi } from '@/api/crm/finance/merchant'
import { PosterApi } from '@/api/crm/sales/poster/poster'
import { ActivityManageApi } from '@/api/crm/activity/activityManage'
import { CccSkillGropApi } from '@/api/crm/ccc/skillgroup'
import { CccUserApi } from '@/api/crm/ccc/user'
import { ChannelApi } from '@/api/crm/channel'
import { SubscriptionApi } from '@/api/crm/qqe/subscription'
import { ListOwnerAssignPloyApi } from '@/api/crm/customer/assign/ploy'
import { WechatMessageApi } from '@/api/crm/wechat/message'
import { CouponMutexGroupApi } from '@/api/crm/sales/coupon/couponMutexGroup'

const dictStore = useDictStoreWithOut()

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型 vvAQ
 * @returns {*|Array} 数据字典数组
 */
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export interface NumberDictDataType extends DictDataType {
  value: number
}

export const getDictOptions = (dictType: string) => {
  return dictStore.getDictByType(dictType) || []
}

export const getIntDictOptions = (dictType: string): NumberDictDataType[] => {
  // 获得通用的 DictDataType 列表
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // 转换成 number 类型的 NumberDictDataType 类型
  // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
  const dictOption: NumberDictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: parseInt(dict.value + '')
    })
  })
  return dictOption
}

export const getStrDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + ''
    })
  })
  return dictOption
}

export const getBoolDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + '' === 'true'
    })
  })
  return dictOption
}

/**
 * 获取指定字典类型的指定值对应的字典对象
 * @param dictType 字典类型
 * @param value 字典值
 * @return DictDataType 字典对象
 */
export const getDictObj = (dictType: string, value: any): DictDataType | undefined => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  for (const dict of dictOptions) {
    if (dict.value === value + '') {
      return dict
    }
  }
}

/**
 * 获得字典数据的文本展示
 *
 * @param dictType 字典类型
 * @param value 字典数据的值
 * @return 字典名称
 */
export const getDictLabel = (dictType: string, value: any): string => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictLabel = ref('')
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value + '') {
      dictLabel.value = dict.label
    }
  })
  return dictLabel.value
}

export const getLabelByValue = (value, data) => {
  const targetData = data.find(item => item.value === value)
  return targetData ? targetData.label : ''
}

export const getLabelByLink = (link, data) => {
  const targetData = data.find(item => item.link === link)
  return targetData ? targetData.label : ''
}

export const getNameByCode = (code, data) => {
  const targetData = data.find(item => item.code === code)
  return targetData ? targetData.name : ''
}

export const getValueByLabel = (label, data) => {
  const targetData = data.find(item => item.label === label)
  return targetData ? targetData.value : ''
}

export const getCssClassByValue = (value, data) => {
  const targetData = data.find(item => item.value === value)
  return targetData ? targetData.cssClass : ''
}

export enum DICT_TYPE {
  USER_TYPE = 'user_type',
  COMMON_STATUS = 'common_status',
  TERMINAL = 'terminal', // 终端
  DATE_INTERVAL = 'date_interval', // 数据间隔
  VALID_STATUS = 'valid_status',
  COMMON_INVALIDE_STATUS = 'common_invalid_status',

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_ERROR_CODE_TYPE = 'system_error_code_type',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE = 'system_social_type',
  SYSTEM_OPERATE_TYPE = 'system_operate_type',
  SYSTEM_API_SIGNATURE_EXPIRES_TYPE = 'system_api_signature_expires_type', // 过期类型
  SYSTEM_USER_TYPE = 'system_user_type', // 用户类型分类
  SYSTEM_CAMPUS = 'system_campus', // 校区

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_BOOLEAN_INTEGER = 'infra_boolean_integer',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',
  INFRA_OPERATE_TYPE = 'infra_operate_type',
  INFRA_REDIS_TIMEOUT_TYPE = 'infra_redis_timeout_type',

  /* ==========  CRM  ========== */
  // ========== 通用 ==========
  DEPT_SEARCH_ROLE_TYPE = 'dept_search_role_type', // 部门搜索-角色类型
  ENV = 'env', // 业务环境

  // ========== 活动管理 ==========
  // 活动设置
  CUSTOMER_LIMIT = 'customer_limit', // 学员限制
  AUTO_AUDIT_STATUS = 'auto_audit_status', // 审核方式
  REWARD_STATUS = 'reward_status', // 奖励发放方式
  REWARD_TYPE = 'reward_type', // 奖励类型
  RELATION_ACTIVITY_STATUS = 'relation_activity_status', // 关联活动
  // 新生打卡
  CLOCK_STATUS = 'clock_status', // 打卡状态
  CLOCK_NUM = 'clock_num', // 打卡次数
  // 学员分类
  STUDENT_TYPE = 'student_type', // 学员类型
  // 海报生成
  POSTER_TYPE = 'poster_type', // 海报类型
  WECHAT_CONTENT_TYPE = 'wechat_content_type', // 公众号推送的内容类型
  // 学生活动设置
  ACTIVITY_AUDIT_STATUS = 'activity_audit_status', // 活动审核状态
  SOCIAL_PLATFORM = 'social_platform', // 社交平台
  ADD_REWARD_STATUS = 'add_reward_status', // 奖励状态'
  PARTIALLY_VISIBLE_STATUS = 'partially_visible_status', // 存疑判断
  // 活动AI审核
  CRM_AI_AUDIT_STATUS = 'crm_ai_audit_status', // 审核状态
  CRM_AI_AUDIT_DOUBTFUL_REASON = 'crm_ai_audit_doubtful_reason', // 审核存疑原因
  CRM_AI_AUDIT_METHOD = 'crm_ai_audit_method', // 审核方式
  CRM_AI_AUDIT_VISIBLES = 'crm_ai_audit_visibles', // 分享权限
  CRM_AI_AUDIT_PIC_NUM = 'crm_ai_audit_pic_num', // 图片数量
  CRM_AI_AUDIT_DOUBTFUL_TYPE = 'crm_ai_audit_doubtful_type',   

  // ========== 代理商 ==========
  CRM_EXTERNAL_COOPERATION_TYPE = 'crm_external_cooperation_type', // 合作模式
  CRM_AGENCY_FROM = 'crm_agency_from', // 来源
  CRM_BANK_LIST = 'crm_bank_list', // 所属银行
  AGENCY_RESPONSIBLE_TYPE = 'agency_responsible_type',

  // ========== 渠道管理 ==========
  CRM_REGISTER_CHANNEL = 'crm_register_channel',
  CRM_SITE_TYPE = 'crm_site_type', // 站点类型
  CRM_CHANNEL_TYPE = 'crm_channel_type', // 渠道类型
  CRM_PROMOTE_BUSINESS_LINES = 'crm_promote_business_lines',
  // 活动
  CRM_ACTIVITY_TYPE = 'crm_activity_type', // 活动类型
  // 广告
  ADVERTISEMENT_CHANNELS = 'advertisement_channels', // 广告投放渠道
  ADVERTISEMENT_PLATFORM = 'advertisement_platform', // 广告投放平台
  ADVERTISEMENT_STATUS = 'advertisement_status', // 广告状态
  ADVERTISEMENT_MODE = 'advertisement_mode', // 广告方式
  // 自然流量
  NATURAL_FLOW_SOURCE = 'natural_flow_source', // 流量来源
  NATURAL_FLOW_REGISTER_TYPE = 'natural_flow_register_type', // 注册方式
  CRM_SNS_TYPE = 'crm_sns_type',
  // 新媒体
  ACCOUNT_TYPE = 'account_type',
  ACCOUNT_POSITION = 'account_position',
  ACCOUNT_STATUS = 'account_status',
  CRM_NEW_MEDIA_BUSINESS = 'crm_new_media_business',
  // 渠道变更日志
  CRM_CHANNEL_OPERATE_TYPE = 'crm_channel_operate_type', // 渠道日志操作类型

  // ========== 客服管理 ==========
  // 阿里云外呼
  CCC_USAGE = 'ccc_usage', // 号码用途
  CCC_MEDIA_TYPE = 'ccc_media_type', // 媒体类型
  CCC_WORK_MODE = 'ccc_work_mode', // 工作模式
  CCC_ROLE_NAME = 'ccc_role_name', // 角色名称
  ALIYUN_CCC_ROLE = 'aliyun_ccc_role', // 阿里云外呼角色
  // 微管家
  WECHAT_BOOLEAN_INTEGER = 'wechat_boolean_integer', // 微管家专属 boolean
  WECHAT_FRIEND_STATUS = 'wechat_friend_status',  // 好友状态
  WECHAT_CUSTOMER_BIND_STATUS = 'wechat_customer_bind_status', // 绑定状态
  WECHAT_MESSAGE_STATUS = 'wechat_message_status',  // 推送状态
  WECHAT_CUSTOMER_STATUS = 'wechat_customer_status', // 客服状态
  WECHAT_EVALUATION_SCHEDULING = 'wechat_evaluation_scheduling', // 客服排班
  WECHAT_EVALUATION_STATUS = 'wechat_evaluation_status', // 顾问评价状态

  // ========== 财务管理 ==========
  // 商户
  CRM_PAYMENT_LIST = 'crm_payment_list', // 商户类型
  ORDER_PAYMENT_CURRENCY = 'order_payment_currency', // 实际支付货币
  
  // ========== 营销工具管理  ==========
  // 优惠券
  COUPON_TYPE = 'coupon_type', // 优惠券分类
  VALIDITY_TYPE = 'validity_type', // 优惠券有效期类型
  ENABLE_STATUS = 'enable_status', // 优惠券启用状态
  GETATABLE_STATUS = 'getatable_status', // 优惠券在架状态
  CRM_COUPON_USED_STATUS = 'crm_coupon_used_status',  // 优惠券使用状态
  CRM_COUPON_ADD_CHANNEL = 'crm_coupon_add_channel',  // 优惠券添加渠道
  CRM_PACKAGES_BIND_TYPE  = 'crm_packages_bind_type', // 优惠券绑定类型
  // 优惠券互斥组管理记录
  CRM_COUPON_GROUP_TYPE = 'crm_coupon_group_type', // 优惠券互斥组类型

  // 星币
  STAR_SOURCE = 'star_source',
  // 返还记录
  CRM_POINTS_ADD_CHANNEL = 'crm_points_add_channel', // 积分添加渠道
  CRM_TICKET_ADD_CHANNEL = 'crm_ticket_add_channel', // 次卡添加渠道
  TICKET_REMOVE_STATUS = 'ticket_remove_status', // 次卡移除状态
  CRM_QQE_POINTS_ADD_CHANNEL = 'crm_qqe_points_add_channel', // 课时点添加类型
  // 积分商品管理
  POINTS_AUTO_ADD_STATUS = 'points_auto_add_status', // 自动添加商品
  POINTS_PURCHASE_METHOD =  'points_purchase_method', // 兑换方式
  POINTS_SEND_EMAIL = 'points_send_email', // 是否需要发送邮件
  POINTS_LIMIT_CONDITION = 'points_limit_condition', // 限制条件
  POINTS_COMMODITY_GROUP = 'points_commodity_group', // 分类
  STUDENT_LIMIT_TYPE = 'student_limit_type', // 学员限制类型
  POINTS_COMMODITY_TYPE = 'points_commodity_type', // 商品类型
  POINTS_COUPON_TYPE = 'points_coupon_type', // 积分商品券库类型
  PROMOTION_COUPON_STATUS = 'promotion_coupon_status', // 积分商品券库状态

  // 注册链接
  CRM_REGISTER_LINK_FONT_TYPE = 'crm_register_link_font_type', // 注册链接字体类型

  // ========== 订单管理  ==========
  // 套餐订单记录
  PAYMENT_TYPE = 'payment_type',
  CRM_ORDER_BILLING_TYPE = 'crm_order_billing_type', // 订单类型
  CRM_ORDER_PAYMENT_TYPE = 'crm_order_payment_type', // 支付类型
  CRM_ORDER_PAYMENT_STATUS = 'crm_order_payment_status', //支付状态
  CRM_ORDER_GIVE_BOOK_TYPE = 'crm_order_give_book_type', // 书籍类型
  CRM_ORDER_GIVE_BOOK_REASON = 'crm_order_give_book_reason', // 赠送原因
  CRM_ORDER_PAYMENT_METHOD = 'crm_order_payment_method', // 子支付方式
  CRM_MERCHANT_LIST = 'crm_merchant_list', // 实际支付货币商户
  ORDER_AUDIT_TYPE = 'order_audit_type', // 订单审核类型
  CRM_UNIVAPAY_PAY_TYPE = 'crm_univapay_pay_type', // Univapay平台支付方式
  CN_TICKET_CODE = 'cn_ticket_code',  // CN 次卡
  CPZH_TICKET_CODE = 'cpzh_ticket_code',  // CPZH 次卡
  CNADT_TICKET_CODE = 'cnadt_ticket_code',  // CNADT 次卡
  ORDER_FREQUENCY_TYPE = 'order_frequency_type', // 订单频次
  // 签约制订单记录
  SIGNED_ORDER_STATUS = 'signed_order_status', // 签约订单状态
  REVOKED_TYPE = 'revoked_type', // 解约类型
  SIGN_ORDER_TYPE = 'sign_order_type', // 订单类型
  // 退款订单记录
  CANCEL_FIX_LESSON_ORDER_STATUS = 'cancel_fix_lesson_order_status',
  MAKE_OUT_AN_INVOICE_STATUS = 'make_out_an_invoice_status', // 发票状态
  REFUND_STATUS = 'refund_status', // 退款状态
  REFUND_TYPE = 'refund_type', // 退款原因
  CONNECT_STATUS = 'connect_status', // 联系状态
  REFUND_PACKAGES_TYPE = 'refund_packages_type', // 套餐类型
  REFUND_ORDER_TYPE = 'refund_order_type', // 订单类型
  REFUND_APPROVE_STATUS = 'refund_approve_status', // 审核状态
  ORDER_REFUND_STATUS = 'order_refund_status', // 套餐订单退款状态
  // 签约制订单扣费记录
  SIGNED_DEDUCT_STATUS = 'signed_deduct_status', // 扣费状态
  // 电子合同记录
  AUDIT_STATUS = 'audit_status', // 审核状态

  // ========== 学员管理 ==========
  CRM_AGE = 'crm_age',
  CALL_STATUS = 'call_status', // 跟进状态
  CRM_TYPE_OF_PROFESSION = 'crm_type_of_profession',
  CRM_INSTANT_MESSENGER = 'crm_instant_messenger',
  CRM_SOCIAL_SOFTWARE = 'crm_social_software',
  CRM_AGENCY_STATUS = 'crm_agency_status', // 外部合作状态
  CRM_RELATIONSHIP_WITH_RECOMMENDERS = 'crm_relationship_with_recommenders',
  CERM_PAST_LEARNING_TYPE = 'crm_past_learning_type',
  CRM_TUTORIAL_TYPE = 'crm_tutorial_ype',
  CRM_LEARN_ENGLISH_PERIOD = 'crm_learn_english_period',
  CRM_STUDY_EFFECTION = 'crm_study_effection',
  CRM_ENGLISH_ABILITY = 'crm_english_ability',
  CRM_INT_ENGLISH_ABLITY = 'crm_int_english_ablity',
  CRM_ENGLISH_LEVEL = 'crm_english_level',
  CRM_STUDY_EQUIPMENT = 'crm_study_equipment',
  CRM_LESSON_TIME = 'crm_lesson_time',
  CRM_CHANNEL = 'crm_channel',
  CRM_PARENT_TYPE = 'crm_parent_type',
  CUSTOMER_SEA = 'customer_sea',
  CUSTOMER_SEA_REASON = 'customer_sea_reason',
  CUSTOMER_SEA_FREQUENCY = 'customer_sea_frequency',
  COUNTRY_CODE = 'country_code',
  CRM_STUDENT_TYPE = 'crm_student_type',
  CRM_PURPOSE_OF_STUDY = 'crm_purpose_of_study',
  TELEPHONE_CODE_TYPE = 'telephone_code_type',
  CRM_CUSTOMER_FTL_NUM = 'crm_customer_ftl_num', //学员完成FTL次数
  CRM_CUSTOMER_FTL_STATUS = 'crm_customer_ftl_status', // 学员完成FTL状态
  CUSTOMER_LESSON_MANNER = 'customer_lesson_manner', // 上课方式
  // 学员预警
  MESSAGE_TYPE = 'message_type', // 预警类型
  READ_STATUS = 'read_status', // 已读状态
  DISPOSE_STATUS = 'dispose_status', // 处理状态
  IS_READ = 'is_read',
  // 月度报告
  REPORT_TYPE = 'report_type',
  // 学员状态
  STUDY_STATUS = 'study_status',
  // 联系记录
  CONTACT_TYPE = 'contact_type',
  CONTACT_RESULT_TYPE = 'contact_result_type',
  RETURN_TYPE = 'return_type',
  CONTACT_CATEGORY = 'contact_category',
  CONTACT_RETURN_QQEPOINT_REASON = 'contact_return_qqepoint_reason',
  // 学员详情
  ATTITUDE_TYPE = 'attitude_type', // 老师评价 => 专注度
  DIFFICULTY_MATCHING_TYPE = 'difficulty_matching_type', // 老师评价 => 难易度
  // 线索分配
  PLOY_ENABLE = 'ploy_enable', // 状态
  PLOY_TYPE = 'ploy_type', // 分配类型
  ASSIGN_STRATEGY = 'assign_strategy', // 分配策略 
  ASSIGN_TARGET = 'assign_target', // 分配目标
  CHOOSE_METHOD = 'choose_method', // 选择方式
  THRESHOLD_TYPE = 'threshold_type', // 是否设置上限
  // 流转记录
  TRANSFER_REASON = 'transfer_reason', // 转让原因
  TRANSFER_SOURCE = 'transfer_source', // 流转来源
  TRANSFER_TYPE = 'transfer_type', // 流转方式

  // ========== 套餐管理 ==========
  // 套餐
  PACKAGES_TYPE = 'packages_type',
  PACKAGES_STATUS = 'packages_status',
  PACKAGES_SIMPLE_TYPE = 'packages_simple_type',
  CRM_PACKAGES_HEDGING_TAG = 'crm_packages_hedging_tag',
  // 学员套餐管理  
  STOP_LESSON_TYPE = 'stop_lesson_type',
  // 学员次卡套餐管理
  LESSON_STATUS = 'lesson_status',
  // 学员套餐订单绑定
  EXECUTE_STATUS = 'execute_status',
  // 学员开课 &停课记录
  LESSON_TYPE = 'lesson_type',
  OPERATION_STATUS = 'operation_status',

  // ========== 脱敏信息 ==========
  CRM_DESENSITIZE_SOURCE = 'crm_desensitize_source', // 脱敏源
  CRM_DESENSITIZE_TYPE = 'crm_desensitize_type',   // 脱敏类型
  SYS_PRESET_DEPT = 'sys_preset_dept', // 部门分类
  SYS_USER_STATUS = 'sys_user_status', // 用户状态
  SYS_USER_PURPOSE = 'sys_user_purpose', // 用途

  // ========== 报表管理 ==========
}

/* 学员筛选类型 */
export const customerTypeOption = ref([
  { label: '学号/姓名', value: 1 },
  { label: '电话', value: 2 },
  { label: '邮箱', value: 3 },
])

/* 代理筛选类型 */
export const agencyTypeOption = ref([
  { label: '学号', value: 1 },
  { label: '代理名', value: 2 },
  { label: '电话', value: 3 },
])

/* 用户 */
export const getUserOptions = async () => {
  try {
    const data = await UserApi.getSimpleUserList()
    const userOptions = data.map((user) => ({
      value: user.id,
      label: user.nickname
    }))
    return userOptions
  } catch(e) {
    console.log('getUserOptions', e)
  }
}

export const handleRemoteUserOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await UserApi.getUserSearchList(query)
    const userOptions = data.map((user) => ({
      value: user.id,
      label: user.nickname,
      deptIds: user.deptIds
    }))
    setOptions(userOptions)
  } finally {
    setLoading(false)
  }
} 
export const handleRemoteUserOptions1 = async(query, belongId, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    belongId = JSON.parse(localStorage.getItem('belongId'))
    const params = {
      searchValue: query,
      belongIds: belongId
    }
    const data = await UserApi.getUserBelongIdSearchList(params)
    const userOptions = data.map((user) => ({
      value: user.id,
      label: user.nickname
    }))
    setOptions(userOptions)
  } finally {
    setLoading(false)
  }
}
/* 标签 */
export const getPageTagOptions = async () => {
  try {
    const data = await ChannelPageTagApi.getSimplePageTagList()
    const pageTagOptions = data.filter(tag => tag.status === 0)
                               .map(tag => ({ value: tag.id, label: tag.tagName }))
    return pageTagOptions
  } catch(e) {
    console.log('getPageTagOptions', e)
  }
}

export const handleRemotePageTagOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await ChannelPageTagApi.getPageTagSearchList(query)
    const pageTagOptions = data.map((pageTag) => ({
      value: pageTag.id,
      label: pageTag.tagName
    }))
    setOptions(pageTagOptions)
  } finally {
    setLoading(false)
  }
}

/* 代理 */
export const getAgencyOptions = async () => {
  try {
    const data = await ChannelAgencyApi.getSimpleChannelAgencyList()
    const agencyOptions = data.map((agency) => ({
      value: agency.id,
      label: agency.agencyName
    }))
    return agencyOptions
  } catch(e) {
    console.log('getAgencyOptions', e)
  }
}

export const handleRemoteAgencyOptions = async(query, setOptions, setLoading, type?: number, source?: number) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await ChannelAgencyApi.getAgencySearchList(query, type, source)
    const agencyOptions = data.map((agency) => ({
      value: agency.id,
      label: agency.agencyName
    }))  
    setOptions(agencyOptions)
  } finally {
    setLoading(false)
  }
}   

/* 注册链接 */
export const getRegisterLinkOptions = async () => {
  try {
    const data = await RegisterLinkApi.getSimpleChannelRegisterLinkList()
    const registerLinkOptions = data.filter(registerLink => registerLink.status === 0)
                                    .map(registerLink => ({ value: registerLink.id, label: registerLink.pageTitle }))
    return registerLinkOptions
  } catch(e) {
    console.log('getRegisterLinkOptions', e)
  }
}

/* 套餐 */
export const getPackageOptions = async (customerId?: number, type?: number) => {
  try {
    const data = await PackageApi.getSimplePackagesList(customerId)
    let packageOptions
    if (type) {
      packageOptions = data.map((p) => ({
        value: p.id,
        label: p.name,
        simpleType: p.packagesSimpleType,
        isSign: p.isSign,
        price: p.price,
        hedgingTag: p.hedgingTag
      })).filter(p => p.simpleType === type)
    } else {
      packageOptions = data.map((p) => ({
        value: p.id,
        label: p.name,
        simpleType: p.packagesSimpleType,
        isSign: p.isSign,
        type: p.packagesType,
        price: p.price,
        hedgingTag: p.hedgingTag
      }))
    }
    return packageOptions
  } catch(e) {
    console.log('getPackageOptions', e)
  }
}

/* 签约制套餐 */
export const getSignPackageOptions = async (customerId?: number) => {
  try {
    const data = await PackageApi.getSignSimplePackagesList(true, customerId)
    return data.map((p) => ({
      value: p.id,
      label: p.name,
      simpleType: p.packagesSimpleType,
      isSign: p.isSign
    }))
  } catch(e) {
    console.log('getSignPackageOptions', e)
  }
}

/**
 * 获取套餐选项
 * @param {'all' | 'point' | 'ticket' | 'sign' | 'nonPointAndTicket'} [mode='all'] - 套餐模式
 * @returns {Promise<Array>} 套餐选项数组
 */
export const getPackagesOptions = async (mode = 'all') => {
  try {
    const data = await PackageApi.getAllPackagesSimpleList()
    const allOptions = data.map(p => ({
      value: p.id,
      label: p.name,
      packagesSimpleType: p.packagesSimpleType,
      packagesType: p.packagesType,
      isSign: p.isSign,
      price: p.price,
      hedgingTag: p.hedgingTag
    }))

    switch (mode) {
      // 课时点
      case 'point':
        return allOptions.filter(p => p.packagesSimpleType === 1)
      // 次卡
      case 'ticket':
        return allOptions.filter(p => p.packagesSimpleType === 2)
      // 签约制
      case 'sign':
        return allOptions.filter(p => p.isSign)
      // 非课时点套餐或次卡套餐
      case 'nonPointAndTicket':
        return allOptions.filter(p => p.packagesType === 4 && !p.isSign)
      case 'all':
      default:
        return allOptions
    }
  } catch (e) {
    console.error('getPackageOptions error:', e)
    return []
  }
}

/* 订单 */
export const getOrderOptions = async (customerId:number) => {
  try {
    const data = await PackageOrderApi.getPackageOrderUnused(customerId)
    const orderOptions = data.filter(o => o.packagesSimpleType === 2).map(o => ({
      value: o.id,
      label: o.orderNum,
      packageId: o.packageId
    }))
    return orderOptions
  } catch(e) {
    console.log('getOrderOptions', e)
  }
} 

export const getOrderUnusedOptions = async (customerId:number, type?:number) => {
  try {
    const data = await PackageOrderApi.getPackageOrderUnused(customerId)
    let orderOptions
    if (type) {
      orderOptions = data.map((o) => ({
        value: o.id,
        label: o.packageName,
        simpleType: o.packagesSimpleType,
      })).filter(o => o.simpleType === type)
    } else {
      orderOptions = data.map((o) => ({
        value: o.id,
        label: o.packageName,
        simpleType: o.packagesSimpleType,
        // isSign: o.isSign
      }))
    }
    return orderOptions
  } catch(e) {
    console.log('getOrderUnusedOptions', e)
  }
}

export const getOrderPackageRecordOptions = async (customerId:number) => {
  try {
    const data = await PackageOrderApi.getPackageOrderUnused(customerId)
    let orderOptions: Array<{ value: number; label: string; orderNum: string; simpleType: number; orderTypeName: string; isSign: boolean }> = [];
    orderOptions = data.map((o) => ({
      value: o.id,
      label: o.orderNum,
      packageName: o.packageName,
      simpleType: o.packagesSimpleType,
      orderTypeName: o.orderTypeName,
      isSign: o.isSign
    })).filter(o => o.simpleType === 1 && o.isSign === false) // 筛选出套餐大类为课时点且非签约制的套餐

    return orderOptions
  } catch(e) {
    console.log('getOrderPackageRecordOptions', e)
  }
}

// 获取当前学员可设置切换的套餐列表
export const getCanChangePackagesOptions = async (id: number, customerId: number) => {
  try {
    const data = await CustomerPackageApi.getCanChangePackages(id, customerId)
    const customerPackageOptions = data.map((p) => ({
      value: p.id,
      label: p.packageName
    }))
    return customerPackageOptions
  } catch(e) {
    console.log('getCanChangePackagesOptions', e)
  }
}

/* 学员 */
export const getCustomerOptions = async () => {
  try{
    const data = await CustomerApi.getSimpleCustomerList()
    const customerOptions = data.map((customer) => ({
      value: customer.id,
      label: [customer.name, customer.id],
    }))
    return customerOptions
  } catch(e) {
    console.log('getCustomerOptions', e)
  }
}

export const getCustomersMultOptions = async () => {
  try {
    const data = await CustomerApi.getSimpleCustomerList()
    const customerMultOptions = data.map((customer) => ({
      value: customer.id,
      label: `${customer.id} ${customer.name}`
    }))  
    return customerMultOptions
  } catch(e) {
    console.log('getCustomersMultOptions', e)
  }
}

export const getRemoteCustomersOptions = async (searchValue) => {
  try {
    const data = await CustomerApi.getCustomerSearchList(searchValue)
    const customerOptions = data.map((customer) => ({
      value: customer.id,
      label: `${customer.id} ${customer.name}`
    }))  
    return customerOptions
  } catch(e) {
    console.log('getRemoteCustomersOptions', e)
  }
}

export const handleRemoteCustomerOptions = async(query, setOptions, setLoading, type?: number) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await CustomerApi.getCustomerSearchList(query, type)
    const customerOptions = data.map((customer) => ({
      value: customer.id,
      label: `${customer.id} - ${customer.name}`
    }))  
    setOptions(customerOptions)
  } finally {
    setLoading(false)
  }
}

export const handleRemoteExistAccoutCustomerOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await CustomerApi.getExistAccoutCustomerSearchList(query)
    const customerExistAccoutOptions = data.map((customer) => ({
      value: customer.id,
      label: `${customer.id} - ${customer.name}`
    }))  
    setOptions(customerExistAccoutOptions)
  } finally {
    setLoading(false)
  }
}
  
/* 优惠券 */
// 获取有效优惠券
export const getCouponOptions = async () => {
  try {
    const data = await CouponApi.getSimpleCouponList()
    const couponOptions = data.map((coupon) => ({
      value: coupon.id,
      label: coupon.name, 
      discount: coupon.discount,
    }))
    return couponOptions
  } catch(e) {
    console.log('getCouponOptions', e)
  }
}
// 获取全部优惠券（含过期）
export const getAllCouponOptions = async () => {
  try {
    const data = await CouponApi.getAllCouponSimpleList()
    const couponOptions = data.map((coupon) => ({
      value: coupon.id,
      label: coupon.name, 
      discount: coupon.discount,
    }))
    return couponOptions
  } catch(e) {
    console.log('getAllCouponOptions', e)
  }
}

/* 优惠券远程搜索 */
export const handleRemoteCouponOptions = async (query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await CouponApi.getCouponSearchList(query)
    const couponList = data.map((coupon) => ({
      value: coupon.id,
      label: coupon.name,
      discount: coupon.discount,
    }))
    setOptions(couponList)
  } finally {
    setLoading(false)
  }
}

/* 停课券 */
export const getSuspendOptions = async () => {
  try {
    const data = await SuspendApi.getSimpleSuspendList()
    const suspendOptions = data.map((suspend) => ({
      value: suspend.id,
      label: suspend.name, 
    }))
    return suspendOptions
  } catch(e) {
    console.log('getSuspendOptions', e)
  }
}

// 一级渠道: 活动
export const handleRemoteChannelActivityOptions = async(query, setOptions, setLoading, pageType?: number) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await ChannelActivityApi.getChannelActivitySearchList(query, pageType)
    const channelActivityOptions = data.map((channelActivity) => ({
      value: channelActivity.id,
      label: channelActivity.name,
    }))
    setOptions(channelActivityOptions)
  } finally {
    setLoading(false)
  }
}

/* 渠道页面 */
export const getChannelPageOptions = async () => {
  try {
    const data = await ChannelPageApi.getSimpleChannelPageList()
    const channelPageOptions = data.map((page) => ({
      value: page.adid,
      label: page.pageName,
      link: page.pageLink
    }))
    return channelPageOptions
  } catch(e) {
    console.log('getChannelPageOptions', e)
  }
}

/* 四级渠道 */
export const getChannelNameOptions = async (param: any) => {
  try {
    const data = await ChannelApi.getChannelNameSimpleList(param)
    let channelNameOptions = []
    if(param.channelType === 4) {
      channelNameOptions = data.map((item) => ({
        value: item.id,
        label: getDictLabel(DICT_TYPE.NATURAL_FLOW_SOURCE, Number(item.name))
      }))
    }
    return channelNameOptions
  } catch(e) {
    console.log('getChannelNameOptions', e)
  }
}

export const handleRemotePageOptions = async(query, setOptions, setLoading, oneLevel?: number, twoLevel?: number, threeLevel?: number) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await ChannelPageApi.getPageSearchList(query, oneLevel, twoLevel, threeLevel)
    const pageOptions = data.map((page) => ({
      value: page.id,
      label: page.pageName,
      adid:page.adid,
      pageType: page.pageType
    }))
    setOptions(pageOptions)
  } finally {
    setLoading(false)
  }
} 

/* 商户 */
export const getMerchantOptions = async (id?: number) => {
  try {
    const data = await MerchantApi.getSimpleMerchantListMap(id)
    return data
  } catch(e) {
    console.log('getMerchantOptions', e)
  }
}

export const handleRemoteMechantOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await MerchantApi.getRemoteMerchantSimpleList(query)
    const merchantOptions = data.map((merchant) => ({
      value: merchant.id,
      label: merchant.merchantName,
      type: merchant.merchantType
    }))
    setOptions(merchantOptions)
  } finally {
    setLoading(false)
  }
} 

/* 代理佣金规则 */
export const getAgencyCommissionRulesOptions = async () => {
  try {
    const data = await AgencyCommissionRulesApi.getSimpleAgencyCommissionRulesList()
    const agencyCommissionRulesOptions = data.map((rule) => ({
      value: rule.id,
      label: rule.ruleName,
      disabled: rule.status
    }))
    return agencyCommissionRulesOptions
  } catch(e) {
    console.log('getAgencyCommissionRulesOptions', e)
  }
}

/* 有效代理佣金规则 */
export const getAgencyValidCommissionRulesOptions = async () => {
  try {
    const data = await AgencyCommissionRulesApi.getSimpleAgencyValidCommissionRulesList()
    const agencyCommissionRulesOptions = data.map((rule) => ({
      value: rule.id,
      label: rule.ruleName,
    }))
    return agencyCommissionRulesOptions
  } catch(e) {
    console.log('getAgencyValidCommissionRulesOptions', e)
  }
}

/* 代理佣金主规则 */
export const getAgencyCommissionPrimaryRulesOptions = async () => {
  try {
    const data = await AgencyCommissionRulesApi.getSimpleAgencyCommissionRulesList()
    const primaryRuleList = data.filter(rule => {
      return !rule.parentRulesId
    })
    const agencyCommissionRulesOptions = primaryRuleList.map((rule) => ({
      value: rule.id,
      label: rule.ruleName,
      disabled: rule.status
    }))
    return agencyCommissionRulesOptions
  } catch(e) {
    console.log('getAgencyCommissionPrimaryRulesOptions', e)
  }
}

/* 海报设置的本地字体 */
export const getFontsOptions = async () => {
  try {
    const data = await PosterApi.getFonts()
    const fontsOptions = data.map((font) => ({
      value: font,
    }))
    return fontsOptions
  } catch(e) {
    console.log('getFontsOptions', e)
  }
}

/* 活动设置 */
export const getActivityManageOptions = async (status?: number, limit?: number, activityMonth?: string) => {
  try {
    const data = await ActivityManageApi.getSimpleActivityManageList(status, limit, activityMonth)
    const activityManageOptions = data.map((activity) => ({
      value: activity.id,
      label: activity.activityNameInternal,
    }))
    return activityManageOptions
  } catch(e) {
    console.log('getActivitySettingOptions', e)
  }
}
export const getValidActivityManageOptions = async (status?: number, limit?: number) => {
  try {
    const data = await ActivityManageApi.getValidSimpleActivityManageList(status, limit)
    const activityManageOptions = data.map((activity) => ({
      value: activity.id,
      label: activity.activityNameInternal,
    }))
    return activityManageOptions
  } catch(e) {
    console.log('getValidActivitySettingOptions', e)
  }
}
export const getAvailableActivityManageOptions = async (customerId: number) => {
  try {
    const data = await ActivityManageApi.getAvailableActivityManage(customerId)
    const activityManageOptions = data.map((activity) => ({
      value: activity.id,
      label: activity.activityNameInternal,
    }))
    return activityManageOptions
  } catch(e) {
    console.log('getAvailableActivityManageOptions', e)
  }
}
export const handleRemoteActivityManageOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await ActivityManageApi.getActivityManageSearchList(query)
    const activityManageOptions = data.map((activityManage) => ({
      value: activityManage.id,
      label: `${activityManage.activityNameInternal}（${activityManage.auditNum}/${activityManage.auditTotalNum}）`
    }))
    setOptions(activityManageOptions)
  } finally {
    setLoading(false)
  }
}

/* 阿里云外呼 技能组 */
export const getCccSkillGroupOptions = async () => {
  try {
    const data = await CccSkillGropApi.getAliyunCCCSkillGroupList()
    const cccSkillGroupOptions = data.map((skillGroup) => ({
      value: skillGroup.skillGroupId,
      label: skillGroup.displayName + '：' + skillGroup.skillGroupName,
    }))
    return cccSkillGroupOptions
  } catch (e) {
    console.log('getCccSkillGroupOptions', e)
  }
}

/* 阿里云外呼 坐席 */
export const handleRemoteCccUserOptions = async(query, setOptions, setLoading) => {
  if (!query) return
  setLoading(true)
  try {
    const data = await CccUserApi.getCccUserSearchList(query)
    const cccUserOptions = data.map((cccUser) => ({
      value: cccUser.id,
      label: cccUser.loginName,
      info: cccUser
    }))
    setOptions(cccUserOptions)
  } finally {
    setLoading(false)
  }
}

/* 次卡 */
export const getTicketOptions = async (siteId?:number) => {
  try {
    const data = await SubscriptionApi.getSimpleTicketList(siteId)
    const ticketOptions = data.map((ticket) => ({
      value: ticket.code,
      label: ticket.name,
    }))
    return ticketOptions
  } catch(e) {
    console.log('getTicketOptions', e)
  }
}

/* 次卡远程搜索 */
export const handleRemoteQqeTicketOptions = async(params, setOptions, setLoading) => {
  if (isEmpty(params)) return
  setLoading(true)
  try {
    const data = await SubscriptionApi.getTicketSearchList(params)
    const qqeTicketOptions = data.map((ticket) => ({
      value: ticket.code,
      label: ticket.name
    }))
    setOptions(qqeTicketOptions)
  } finally {
    setLoading(false)
  }
}

export const handleRemoteTicketOptions = async(params, setOptions, setLoading) => {
  if (isEmpty(params)) return
  setLoading(true)
  try {
    const data = await CustomerTicketApi.getTicketSearchList(params)
    const ticketOptions = data.map((ticket) => ({
      value: ticket.tickerName,
      label: ticket.tickerName
    }))
    setOptions(ticketOptions)
  } finally {
    setLoading(false)
  }
}

/* 微管家 服务评价管理 满意度 搜索条件选项 */
export const wechatSatisfactionOptions = [
  { label: '一星', value: 1 },
  { label: '二星', value: 2 },
  { label: '三星', value: 3 }
]

/* 全部优惠券组 */
export const getAllCouponMutexGroupOptions = async () => {
  try {
    const data = await CouponMutexGroupApi.getSimpleCouponMutexGroupList()
    const couponMutexGroupOptions = data.map((group) => ({
      value: group.id,
      label: group.groupName,
      type: group.groupType
    }))
    return couponMutexGroupOptions
  } catch(e) {
    console.log('getCouponMutexGroupOptions', e)
  }
}

/* 互斥/互斥失效优惠券组 */
export const getCouponMutexGroupOptionsByType = async (type: number) => {
  const options = await getAllCouponMutexGroupOptions()
  const couponMutexGroupOptions = options.filter(group => {
    return group.type === type
  })
  return couponMutexGroupOptions  
}

/* 互斥/互斥失效优惠券组 */
export const getListOwnerAssignPloyOptions = async () => {
  const data = await ListOwnerAssignPloyApi.getSimpleListOwnerAssignList()
  const ListOwnerAssignOptions = data.map(item => ({
    value: item.id,
    label: item.ployName
  }))
  return ListOwnerAssignOptions
}
/*  */
export const handleRemoteWechatMessageOptions = async (query, setOptions, setLoading) => { 
  if (!query) return
  setLoading(true)
  try {
    const data = await WechatMessageApi.getWechatMessageSearchList(query)
    const messageOptions = data.map((message) => ({
      value: message.id,
      label: message.title,
    }))
    setOptions(messageOptions)
  } finally {
    setLoading(false)
  }
}
