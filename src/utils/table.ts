import { ColumnSortType } from '@/types/table'
import { TABLE_SORT } from '@/utils/constants'

type CustomOrderType = 'asc' | 'desc' | null

/**
 * 根据给定的排序顺序，返回对应的排序方式代码, 因为后端定义的排序字符串为 asc 和 desc
 * 
 * @param order 排序顺序，可以是'ascending'（升序）或'descending'（降序）
 * @returns 返回排序方式代码，'asc'表示升序，'desc'表示降序，如果顺序参数不符合预期，则返回null
 */
const translateOrderString = (order: string | null):CustomOrderType => {
  // 当el-table排序顺序为ascending时，返回'desc' 
  // 为什么排序顺序是相反的，产品经理 Vincy 要求的
  if (order === 'ascending') {
    return 'desc'
  // 当el-table排序顺序为descending时，返回'asc'
  // 为什么排序顺序是相反的，产品经理 Vincy 要求的
  } else if (order === 'descending') {
    return 'asc'
  // 如果排序顺序既不是升序也不是降序，则返回null
  } else {
    return null
  }
}

/**
 * 处理排序字段
 * 将列排序信息转换为自定义排序字段列表
 * 主要用于将用户界面的排序选择转换为后端可以理解的排序指令
 * 
 * @param sortaleColumn 列排序类型对象，包含列的属性名和排序顺序
 * @returns 返回一个字符串数组，每个元素是一个排序字段和排序顺序的组合
 */
export function handleSortfields (sortaleColumn: ColumnSortType) {
  // 获取当前列的属性名
  const prop = sortaleColumn.prop
  // 将排序字符串转换为自定义排序字符串
  const order: CustomOrderType = translateOrderString(sortaleColumn.order)

  // 构建排序字段列表，每个元素格式为"属性名,排序顺序"
  const orderByList: string[] = order? [`${prop},${order}`] : []

  // 返回排序字段列表
  return orderByList
}

/** 计算列表序号
* @param index 索引
* @param pageSize 每页显示条数
* @param pageNum 当前页码
* @returns 返回当前页码的列表序号 
*/
export function calculateTableOrderNum(index: number, pageSize: number, pageNum: number) {
  return (pageNum - 1) * pageSize + index + 1
}

/**
 * 格式化表格列数据，空值显示为 '-'
 * @param {Object} row 当前行数据
 * @param {Object} column 当前列数据
 * @param {*} cellValue 当前单元格值
 * @param {Number} index 行索引
 * @returns 格式化后的显示值
 */
export function formatEmptyValue(row, column, cellValue, index) {
  return cellValue === null || cellValue === undefined || cellValue === '' ? '-' : cellValue
}


export function formatFinanceAmount(row, column, cellValue, index) {
  if(!cellValue) return '-'

  const numValue = Number(cellValue)
  
  return h('span', {
    style: {
      color: numValue < 0 ? 'red' : 'black'
    }
  }, numValue.toFixed(2))
}