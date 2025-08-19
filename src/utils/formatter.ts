import { floatToFixed2 } from '@/utils'
import { formatDate, dateFormatterYMD } from '@/utils/formatTime'

// 格式化金额【分转元】
// @ts-ignore
export const fenToYuanFormat = (_, __, cellValue: any, ___) => {
  return `￥${floatToFixed2(cellValue)}`
}

/**
 *  element table 格式化百分比
 */ 
export const jointPercentFormat = (_, __, cellValue) => {
  if (cellValue === undefined || cellValue === null || cellValue == 0) return "0%"
  return `${cellValue}%`
}
/**
 *  element table 格式化不带秒钟时间
 */ 
export const timeWithoutSecondFormat = (_, __, cellValue) => {
  return formatDate(cellValue, 'YYYY-MM-DD HH:mm')
}
/**
 *  element table 格式化日期不带时分秒
 */ 
export const dateWithoutTimeFormat = (_, __, cellValue) => {
  return formatDate(cellValue, 'YYYY-MM-DD')
}
/**
 *  element table 格式化金额保留两位小数
 */ 
export const roundToTwoDecimals = (_, __, cellValue) => {
  if(cellValue && cellValue !== 0) return cellValue.toFixed(2)
  else return 0
}
/**
 *  element table 年龄格式化
 */ 
export const ageToString = (cellValue) => {
  if(cellValue === null) return ''
  if(cellValue >= 99){
    return '成人'
  } else {
    return cellValue + '岁'
  }
}

/**
 *  table 空值格式化
 */ 
export const formatNullValue = (_, __, cellValue) => {
  return cellValue || '-'
}

/**
 *  wechat table 空值格式化
 */ 
export const formatWechatTime = (_, __, cellValue) => {
  if (cellValue.toString().length !== 13) return '-'
  return formatDate(cellValue, 'YYYY-MM-DD')
}

/**
 *  table 百分比格式化
 */ 
export const formatPercent = (_, __, cellValue) => {
  if (cellValue === undefined || cellValue === null) return '-'
  return cellValue + '%'
}

/**
 *  小数转换格式化，默认保留两位
 *
 */ 
/**
 * 将给定的数字格式化为指定小数位数的字符串
 * 若数字为空或无效，则返回 '--'
 * 
 * @param number {number} - 待格式化的数字
 * @param decimal {number} - 保留的小数位数，默认为2
 * @returns {string} - 格式化后的数字字符串
 */
export const formatDecimal = (number: number, decimal = 2) => {
  // 检查输入的数字是否为无效值
  if (number === undefined || number === null) return '--'
  
  // 格式化数字并返回
  return Number(number).toFixed(decimal)
}