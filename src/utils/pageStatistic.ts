
let lastParams = ''

/**
 * 判断是否需要重新获取统计数据的核心逻辑函数
 * 
 * @param queryParams - 包含查询条件的参数对象，需包含分页参数和其他过滤条件
 * *                pageNo: 当前页码参数（会被忽略）
 * *                pageSize: 分页大小参数（会被忽略）
 * *                rest: 其他需要参与缓存判断的查询参数
 * @returns {boolean} 返回查询条件是否发生变化的布尔值：
 * *                true - 非分页参数发生变化需要重新获取数据
 * *                false - 查询条件未发生变化可使用缓存
 */
export function shouldFetchStatistics(queryParams: Record<string, any>): boolean {
  // 解构分页参数并保留其他查询条件（核心过滤条件分离逻辑）
  const { pageNo, pageSize, ...rest } = queryParams
  
  // 序列化非分页参数用于状态比较（缓存标识生成逻辑）
  const current = JSON.stringify(rest)
  
  // 通过字符串比对判断查询条件是否变化（缓存状态对比逻辑）
  const changed = current !== lastParams
  
  // 更新持久化缓存标识（状态同步机制）
  if (changed) {
    lastParams = current
  }
  
  // 返回最终变化判断结果
  return changed
}