import dayjs from 'dayjs'
import type { TableColumnCtx } from 'element-plus'

/**
 * 日期快捷选项适用于 el-date-picker
 */
export const defaultShortcuts = [
  {
    text: '今天',
    value: () => {
      return new Date()
    }
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return [date, date]
    }
  },
  {
    text: '最近七天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return [date, new Date()]
    }
  },
  {
    text: '最近 30 天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return [date, new Date()]
    }
  },
  {
    text: '本月',
    value: () => {
      const date = new Date()
      date.setDate(1) // 设置为当前月的第一天
      return [date, new Date()]
    }
  },
  {
    text: '今年',
    value: () => {
      const date = new Date()
      return [new Date(`${date.getFullYear()}-01-01`), date]
    }
  }
]

/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns 返回拼接后的时间字符串
 */
export function formatDate(date, format?: string): string {
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }
  // 日期存在，则进行格式化
  return date ? dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss') : ''
}

/**
 * 获取当前的日期+时间
 */
export function getNowDateTime() {
  return dayjs()
}

/**
 * 获取当前日期是第几周
 * @param dateTime 当前传入的日期值
 * @returns 返回第几周数字值
 */
export function getWeek(dateTime: Date): number {
  const temptTime = new Date(dateTime.getTime())
  // 周几
  const weekday = temptTime.getDay() || 7
  // 周1+5天=周六
  temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
  let firstDay = new Date(temptTime.getFullYear(), 0, 1)
  const dayOfWeek = firstDay.getDay()
  let spendDay = 1
  if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1
  firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
  const d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
  return Math.ceil(d / 7)
}

/**
 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
 * @param param 当前时间，new Date() 格式或者字符串时间格式
 * @param format 需要转换的时间格式字符串
 * @description param 10秒：  10 * 1000
 * @description param 1分：   60 * 1000
 * @description param 1小时： 60 * 60 * 1000
 * @description param 24小时：60 * 60 * 24 * 1000
 * @description param 3天：   60 * 60* 24 * 1000 * 3
 * @returns 返回拼接后的时间字符串
 */
export function formatPast(param: string | Date, format = 'YYYY-mm-dd HH:MM:SS'): string {
  // 传入格式处理、存储转换值
  let t: any, s: number
  // 获取js 时间戳
  let time: number = new Date().getTime()
  // 是否是对象
  typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param)
  // 当前时间戳 - 传入时间戳
  time = Number.parseInt(`${time - t}`)
  if (time < 10000) {
    // 10秒内
    return '刚刚'
  } else if (time < 60000 && time >= 10000) {
    // 超过10秒少于1分钟内
    s = Math.floor(time / 1000)
    return `${s}秒前`
  } else if (time < 3600000 && time >= 60000) {
    // 超过1分钟少于1小时
    s = Math.floor(time / 60000)
    return `${s}分钟前`
  } else if (time < 86400000 && time >= 3600000) {
    // 超过1小时少于24小时
    s = Math.floor(time / 3600000)
    return `${s}小时前`
  } else if (time < 259200000 && time >= 86400000) {
    // 超过1天少于3天内
    s = Math.floor(time / 86400000)
    return `${s}天前`
  } else {
    // 超过3天
    const date = typeof param === 'string' || 'object' ? new Date(param) : param
    return formatDate(date, format)
  }
}

/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
export function formatAxis(param: Date): string {
  const hour: number = new Date(param).getHours()
  if (hour < 6) return '凌晨好'
  else if (hour < 9) return '早上好'
  else if (hour < 12) return '上午好'
  else if (hour < 14) return '中午好'
  else if (hour < 17) return '下午好'
  else if (hour < 19) return '傍晚好'
  else if (hour < 22) return '晚上好'
  else return '夜里好'
}

/**
 * 将毫秒，转换成时间字符串。例如说，xx 分钟
 *
 * @param ms 毫秒
 * @returns {string} 字符串
 */
export function formatPast2(ms: number): string {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24)
  const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60)
  const second = Math.floor(ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)
  if (day > 0) {
    return day + ' 天' + hour + ' 小时 ' + minute + ' 分钟'
  }
  if (hour > 0) {
    return hour + ' 小时 ' + minute + ' 分钟'
  }
  if (minute > 0) {
    return minute + ' 分钟'
  }
  if (second > 0) {
    return second + ' 秒'
  } else {
    return 0 + ' 秒'
  }
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm:ss 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatterYMDHms(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue) : '-'
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatterYMD(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM-DD') : '-'
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM-DD HH:mm 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatterYMDHm(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm') : '-'
}

/**
 * element plus 的时间 Formatter 实现，使用 YYYY-MM 格式
 *
 * @param row 行数据
 * @param column 字段
 * @param cellValue 字段值
 */
export function dateFormatterYM(_row: any, _column: TableColumnCtx<any>, cellValue: any): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM') : '-'
}

/**
 * 设置起始日期，时间为00:00:00
 * @param param 传入日期
 * @returns 带时间00:00:00的日期
 */
export function beginOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 0, 0, 0)
}

/**
 * 设置结束日期，时间为23:59:59
 * @param param 传入日期
 * @returns 带时间23:59:59的日期
 */
export function endOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 23, 59, 59)
}

/**
 * 计算两个日期间隔天数
 * @param param1 日期1
 * @param param2 日期2
 */
export function betweenDay(param1: Date, param2: Date): number {
  param1 = convertDate(param1)
  param2 = convertDate(param2)
  // 计算差值
  return Math.floor((param2.getTime() - param1.getTime()) / (24 * 3600 * 1000))
}

/**
 * 日期计算
 * @param param1 日期
 * @param param2 添加的时间
 */
export function addTime(param1: Date, param2: number): Date {
  param1 = convertDate(param1)
  return new Date(param1.getTime() + param2)
}

/**
 * 日期转换
 * @param param 日期
 */
export function convertDate(param: Date | string): Date {
  if (typeof param === 'string') {
    return new Date(param)
  }
  return param
}

/**
 * 指定的两个日期, 是否为同一天
 * @param a 日期 A
 * @param b 日期 B
 */
export function isSameDay(a: dayjs.ConfigType, b: dayjs.ConfigType): boolean {
  if (!a || !b) return false

  const aa = dayjs(a)
  const bb = dayjs(b)
  return aa.year() == bb.year() && aa.month() == bb.month() && aa.day() == bb.day()
}

/**
 * 获取一天的开始时间、截止时间
 * @param date 日期
 * @param days 天数
 */
export function getDayRange(
  date: dayjs.ConfigType,
  days: number
): [dayjs.ConfigType, dayjs.ConfigType] {
  const day = dayjs(date).add(days, 'd')
  return getDateRange(day, day)
}

/**
 * 获取最近7天的开始时间、截止时间
 */
export function getLast7Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastWeekDay = dayjs().subtract(7, 'd')
  const today = dayjs().subtract(0, 'd')
  return getDateRange(lastWeekDay, today)
}

/**
 * 获取最近30天的开始时间、截止时间
 */
export function getLast30Days(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastMonthDay = dayjs().subtract(30, 'd')
  const today = dayjs().subtract(0, 'd')
  return getDateRange(lastMonthDay, today)
}

/**
 * 获取最近1年的开始时间、截止时间
 */
export function getLast1Year(): [dayjs.ConfigType, dayjs.ConfigType] {
  const lastYearDay = dayjs().subtract(1, 'y')
  const today = dayjs().subtract(0, 'd')
  return getDateRange(lastYearDay, today)
}

/**
 * 获取指定日期的开始时间、截止时间
 * @param beginDate 开始日期
 * @param endDate 截止日期
 */
export function getDateRange(
  beginDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType
): [string, string] {
  return [
    dayjs(beginDate).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endDate).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  ]
}

export const dateObjectToStr2 = (timeStamp) => {
  const dateObj = new Date(timeStamp)
  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0'); 
  const dateStr = `${year}-${month}-${day}`
  return dateStr
}

export const dateObjectToStr3 = (date) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0'); 
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return dateStr
}

/**
 * 日期数组转时间戳
 * @param dateArray 日期数组[year, month, day]
 * @returns 日期数组对应 timestamp 
 */
export const convertDateArrayToTimestamp = (dateArray) => {  
    // 验证输入数组是否包含三个元素  
    if (!Array.isArray(dateArray) || dateArray.length !== 3) {  
      return
    }  
  
    // 获取年、月、日  
    const [year, month, day] = dateArray;  
  
    // JavaScript中的月份是从0开始的，所以需要减1  
    const jsMonth = month - 1;  
  
    // 创建一个新的Date对象  
    const date = new Date(year, jsMonth, day);  
  
    // 验证日期是否有效  
    if (isNaN(date.getTime())) {  
        throw new Error('Invalid date provided.');  
    }  
  
    // 返回时间戳（毫秒为单位）  
    return date.getTime();  
}  
  

/**
 * 用于 element data-picker 禁用日期
 * @param time 当前日期时间戳
 */
// 禁用当前日期之后的所有日期
export const disabledAfterDate = (time) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // 设置为当天开始时间
  return time.getTime() > currentDate.getTime()
}

// 禁用当前日期之前的所有日期
export const disabledBeforeDate = (time) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // 设置为当天开始时间
  return time.getTime() < currentDate.getTime()
}

// 禁用结束日期之后的所有日期
export const disabledAfterEndDate = (time, endTime) => {
  return time.getTime() > new Date(endTime).getTime()
}

// 禁用开始日期之前的所有日期
export const disabledBeforeStartDate = (time, startTime) => {
  return time.getTime() < new Date(startTime).getTime()
}

// 禁用当前日期之后的所有日期包含当日
export const disabledAfterDateAndToday = (time) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // 设置为当天开始时间
  return time.getTime() >= currentDate.getTime()
}

// 禁用当前日期之前的所有日期包含当日
export const disabledBeforeDateAndToday = (time) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // 设置为当天开始时间
  return time.getTime() <= currentDate.getTime()
}

// 禁用当前月份之后的所有月份
export const disabledAfterMonth = (time) => {  
  const currentDate = new Date();  
  // 获取当前年份和月份  
  const currentYear = currentDate.getFullYear();  
  const currentMonth = currentDate.getMonth();  
  
  // 获取待判断日期的年份和月份  
  const targetYear = time.getFullYear();  
  const targetMonth = time.getMonth();  
  
  // 如果待判断日期在当前年月之后，则返回true表示禁用  
  return targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth);  
};


/**
 * 用于 element data-picker 默认时间，获取当前月份首尾时间组成的数组
 * @returns 返回当前月份首尾时间组成的数组
 */
export const getCurrentMounthFristAndLast = () =>{
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1, 0, 0, 0)
  const lastDay = new Date(year, month+1, 0, 23, 59, 59)
  
  return [formatDate(firstDay,'YYYY-MM-DD HH:mm:ss'), formatDate(lastDay, 'YYYY-MM-DD HH:mm:ss')]
}


/**
 * 用于 element data-picker 默认时间，获取当前时间
 * @param format 日期格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @param stamp 是否返回时间戳，默认为 false
 * @returns 返回当前时间
 */
export const getCurrentTime = (format: string = 'YYYY-MM-DD HH:mm:ss', stamp: boolean = false) =>{
  const now = new Date()
  if (stamp) {
    return now.getTime()
  }
  return formatDate(now, format)
}


/**
 * 获取当前月的天数
 * @returns 返回当前月天数
 */
export const getDaysInCurrentMonth = () =>{
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  // 下个月的第一天
  const nextMonth = new Date(currentYear, currentMonth + 1, 1)
  // 下个月第一天的前一天，即当前月的最后一天
  const lastDayOfCurrentMonth = new Date(nextMonth - 1)
  return lastDayOfCurrentMonth.getDate();
}

/** 获取当前年的起始日期
 * @param format 日期格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @param stamp 是否返回时间戳，默认为 false
 * @returns 返回当前年的起始日期
 */
export const getCurrentYearStartDate = (format: string = 'YYYY-MM-DD HH:mm:ss', stamp: boolean = false) => {
  const now = new Date();
  const year = now.getFullYear();
  const startDate = new Date(year, 0, 1);
  if (stamp) {
    return startDate.getTime();
  }
  return formatDate(startDate, format);
}

/** 获取当前天的起始时间戳
 *  
*/
export const getCurrentDayStartTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const startDate = new Date(year, month, day, 0, 0, 0);
  return startDate.getTime();
}

// 增加一天
export function getNextDay(dateString: string): string {
  const date = new Date(dateString)

  // 将日期增加一天
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}