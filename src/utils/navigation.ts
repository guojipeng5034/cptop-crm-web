import { getAccessToken } from '@/utils/auth'
import { CustomerAccountApi } from '@/api/crm/customer/account'

/**
 * 集中处理跳转函数
 */
const message = useMessage() // 消息弹窗

/* 学员页面 */
export const goToStudentPage = (uid) => {
  if (uid === null) {
    message.notify('当前学员还没有QQE账号，请创建QQE账号')
    return
  }
  window.open(import.meta.env.VITE_QQE_MANAGE_URL +'/student/uid/' + uid + '/login_student_site', '_blank')
}

/* QQE */
export const goToQQE = async (uid: string | null, customerId?: number) => {
  if (customerId) {
    const { studentUid } = await CustomerAccountApi.getCustomerMainAccount(customerId)
    uid = studentUid
  }
  if (!uid) {
    message.notify("当前学员还没有QQE账号，请进入'详情'中创建")
    return
  }
  const { VITE_SOURCE, VITE_DEV, VITE_BASE_URL, VITE_QQE_MANAGE_URL } = import.meta.env
  // const token = getAccessToken()
  // const queryParams = `source=${VITE_SOURCE}&token=${token}`
  // const isProduction = VITE_DEV === 'false' && VITE_BASE_URL === 'https://cptopapi.campustop.net'
  // const qqeUrl = isProduction
  //   ? `${VITE_QQE_MANAGE_URL}/login/with_token?${queryParams}`
  //   : `${VITE_QQE_MANAGE_URL}/student/uid/${uid}/login/with_token?${queryParams}`
  const qqeUrl = `${VITE_QQE_MANAGE_URL}/student/uid/${uid}`
  window.open(qqeUrl, '_blank')
}

/* 月度报告 */
export const goToMonthReport = (uid) => {
  if (uid === null) {
    message.notify('当前学员还没有QQE账号，请创建QQE账号')
    return
  }
  window.open(import.meta.env.VITE_MONTH_REPORT_URL + '?studentUID=' + uid, '_blank')
}

/* 积分商城 */
export const goToPointMall = (uid) => {
  if (uid === null) {
    message.notify('当前学员还没有QQE账号，请创建QQE账号')
    return
  }
  window.open(import.meta.env.VITE_POINT_MALL_URL + '?uid=' + uid, '_blank')
}
