/**
 * 枚举类
 */

// ========== COMMON 模块 ==========
// 全局通用状态枚举
export const CommonStatusEnum = {
  ENABLE: 0, // 开启
  DISABLE: 1 // 禁用
}

export const CommonStatusEnum1 = {
  ENABLE: 1, // 开启
  DISABLE: 2 // 禁用
}

// ========== CRM ==========
/* 站点 */
export const SITE_MAPPING = {
  "102": "CN",
  "600": "CPZH",
  "113": "CNADT"
}

/* 课程状态 */
export const LESSON_STATUS = {
  PENDING: 0, // pending
  OPEN: 1, // 已开课
  STOP: 2, // 已停课
  REVOKE: 3, // 已解约
  EXPIRE: 4, // 已过期
  OVERDUE: 5, // 已欠费
  RESERVE_OPEN: 6, // 预约开课
  RESERVE_STOP: 7, // 预约停课
  REFUND: 8 // 未开已退
}

/* 套餐大类 */
export const PACKAGES_SIMPLE_TYPE = {
  POINT: 1,
  TICKET: 2,
}

/* 套餐类型 */
export const PACKAGE_TYPE = {
  THIRTY_LESSONS: 1,
  FIFTEEN_LESSONS: 2,
  SIX_LESSONS: 3,
  QQE_POINT_PACKET: 4,
  TICKET: 5,
  OTHER: 99
}

/* 订单类型 */
export const ORDER_TYPE = {
  NEW: 1  // new订单
}

/* 赠品类型 */
export const PRESENT_TYPE = {
  point: 1, // 积分
  ticket: 2, // 次卡
  qqePoint: 3, //  qqe 课时点
  book: 4 // 书籍
}

/* 赠品数量限制 */
export const PRESENT_LIMIT = {
  NEW_ORDER_POINT: 300,
  RENEW_ORDER_POINT: 150,
  TICKET: 7,
  QQE_POINT: 300
}

/* 排序 */
export const TABLE_SORT = {
  ASC: '递增',
  DESC: '递减'
}

/* 订单支付状态 */
export const CRM_ORDER_PAYMENT_STATUS = {
  PENDING: 0,
  WAIT_PAY: 1,
  PAY_ALL: 2,
  PAY_CANCEL: 3,
  PAY_PART: 4,
  PAY_RECORD: 5,
  PAY_OVERTIME: 6,
  PAID: 7
}

/* 订单支付类型 */
export const CRM_ORDER_PAYMENT_TYPE = {
  ONE_OFF: 1,
  INSTALLMENTS: 2
}

/* 套餐订单退款状态 */
export const ORDER_REFUND_STATUS = {
  NO_REFUND: 1,
  PART_REFUND: 2,
  ALL_REFUND: 3,
}

/* 联系状态 */
export const CONNECT_STATUS = {
  WAITING: 1, // 等待沟通
  COMPLETE: 3 // 沟通完成
}

/* 审核状态 */
export const REFUND_APPROVE_STATUS = {
  WAITING: 0, // 等待审核
  APPROVED: 1, // 审核通过
  REJECTED: 2 // 审核拒绝
}

/* 退款状态 */
export const REFUND_STATUS = {
  REFUNDED: 1, // 已退款
  UNREFUNDED: 2, // 未退款
  REJECTED: 3, // 拒绝退款
  REFUNDING: 4, // 退款中
  FAILEDREFUND: 5, // 退款失败
}

/* 退费-统计-标签 */
export const REFUND_STATISTICS_LABEL = {
  "total_amount": "总金额",
  "refund_amount": "已退款金额",
  "not_refund_amount": "未退款金额",
  "total_count": "总人数",
  "chose_other_institute": "选择其他机构",
  "no_time": "没有时间",
  "rules_issue": "规则问题",
  "scheduling_difficulties": "排课困难",
  "no_interest": "没有兴趣",
  "course_too_difficult_to_understand": "课程太难理解",
  "vision_problems": "视力问题",
  "dissatisfied_with_teacher": "对老师不满意",
  "teacher_complaint_or_quality_issue": "投诉老师或质量问题",
  "no_significant_effect": "没有明显效果",
  "upgrade_to_full_time_or_other_language_class": "升级为全日制或其他语言班",
  "other": "其他",
  "service_issues": "服务问题",
  "enhance_test_taking_ability": "提升考试能力",
  "national_policy_issues": "国家政策问题"
}

/* 订单-统计-标签 */
export const ORDER_STATISTICS_LABEL = {
  "total_paid_amount": "已收款金额",
  "pending_paid_amount": "待支付金额",
  "new_order_count": "新生单数",
  "old_order_count": "老生单数",
}

/* 学员积分-统计-标签 */
export const CUSTOMERPOINT_STATISTICS_LABEL = {
  "pointsAddedSum": "已添加积分数",
  "pointsSurplusSum": "剩余积分数",
  "pointsUsedSum": "已使用积分数",
}

/* 学员课时点-统计-标签 */
export const CUSTOMERQQEPOINTS_STATISTICS_LABEL = {
  "totalPoints": "总返还点数",
  "favor": "人情",
  "clearPoints": "课时点清零",
  "playTruant": "旷课",
  "onlineDuty": "在线值班",
  "customerContact": "客诉联系",
  "redeemPoints": "积分赎回",
  "other": "其他",
  "claimsBelow50": "50以下申回",
  "activityReward": "活动赠送",
  "cnTransfer": "CN扣除课时转",
  "addPackageBuy": "课时追加包购买",
  "wrongClassReturn": "上错课返还",
  "firstPayment": "首次付费",
  "refee": "续费",
}

/* 续费-统计-标签 */
export const RENEW_STATISTICS_LABEL = {
  "total_count": "总人数",
  "chose_other_institute": "选择其他机构",
  "no_time": "没有时间",
  "rules_issue": "规则问题",
  "scheduling_difficulties": "排课困难",
  "no_interest": "没有兴趣",
  "course_too_difficult_to_understand": "课程太难理解",
  "vision_problems": "视力问题",
  "dissatisfied_with_teacher": "对老师不满意",
  "teacher_complaint_or_quality_issue": "投诉老师或质量问题",
  "no_significant_effect": "没有明显效果",
  "upgrade_to_full_time_or_other_language_class": "升级为全日制或其他语言班",
  "other": "其他",
  "service_issues": "服务问题",
  "enhance_test_taking_ability": "提升考试能力",
  "national_policy_issues": "国家政策问题"
}

/* 角色大类 */
export const ROLE_CATEGORIES = {
  ADVICER: ['课程顾问', '销售顾问', '顾问-课时点添加'], // 顾问
  SERVICER: ['客服专员'], // 客服
  SLAVE: ['课程顾问', '客服专员'],
  MASTER: [ '销售经理', '销售总监', '客服经理']
}

/* 返还课时点上限 */
export const RETURN_MAX_VALUE = {
  1: 75, // 人情
  2: 3000, // 课时点清零
  3: 2000, // 旷课
  4: 2000, // 在线值班
  5: 2000, // 客诉联系
  6: 800, // 积分赎回
  7: 2000, // 其他
  8: 50, // 不足50课时申回
  9: 200, // 活动赠送
  10: 1500, // CN扣除课时转
  11: 15000, // 课时追加包购买
  12: 3000 // 上错课课时返回
}

/* 图标颜色 */
export const dealIcon = (item) => {
  return item ? ['ep:check', '#67c23a'] : ['ep:close', '#f56c6c']
}

/* 脱敏掩码数据所属模块 */
export const CRM_DESENSITIZE_SOURCE = {
  CUSTOMER : 0, // 学员
  AGENCY : 1, // 代理
  WECHAT : 2, // 微信
  BOOK : 3, // 书籍(收货信息)
  POINTS: 4, // 积分商品
}

/* 脱敏掩码数据类型 */
export const CRM_DESENSITIZE_TYPE = {
  PHONE : 0, // 手机号
  MAIL : 1, // 邮箱
}

/* 支付方式：对公转账/抖店/小红书，只能选择财务审核 */
export const PAMENT_METHOD_ONLY_FINANCE = {
  TRANSFERACCOUNT: 24, // 对公转账
  TIKTOK: 26, // 抖店
  REDNOTE: 27, // 小红书  
  WETCHAT_SHOP: 28 // 微信小店
}

/* 优惠券组类型 */
export const CRM_COUPON_GROUP_TYPE = {
  MUTEX : 0, // 互斥
  MUTEX_INVALID : 1, // 互斥失效
}

/* 优惠券类型 */
export const CRM_COUPON_TYPE = {
  BASIC : 1, // 基础优惠券
  EXCLUSIVE : 2, // 专属渠道优惠券
  COMMON : 3, // 通用优惠券
}

/* 支付方式 */
export const PAYMENT_TYPE = {
  ONE_TIME: 1, // 一次性支付
  INSTALLMENTS: 2 // 分次支付
}