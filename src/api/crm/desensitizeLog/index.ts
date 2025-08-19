import request from '@/config/axios'

// 查看敏感信息日志 VO
export interface DesensitizeLogVO {
  id: number // 主键
  queryUserId: number // 操作人
  queryBizId: number // 操作业务ID需要和脱敏源desensitize_source对应
  desensitizeSource: number // 脱敏源 字典：crm_desensitize_source
  desensitizeType: number // 脱敏类型 字典：crm_desensitize_type
  result: number // 操作结果 字典：infra_boolean_integer
  errorLog: string // 失败原因
}

// 查看敏感信息日志 API
export const DesensitizeLogApi = {
  // 查询查看敏感信息日志分页
  getDesensitizeLogPage: async (params: any) => {
    return await request.get({ url: `/crm/desensitize-log/page`, params })
  },

  // 查询查看敏感信息日志详情
  getDesensitizeLog: async (id: number) => {
    return await request.get({ url: `/crm/desensitize-log/get?id=` + id })
  },

  // 新增查看敏感信息日志
  createDesensitizeLog: async (data: DesensitizeLogVO) => {
    return await request.post({ url: `/crm/desensitize-log/create`, data })
  },

  // 修改查看敏感信息日志
  updateDesensitizeLog: async (data: DesensitizeLogVO) => {
    return await request.put({ url: `/crm/desensitize-log/update`, data })
  },

  // 删除查看敏感信息日志
  deleteDesensitizeLog: async (id: number) => {
    return await request.delete({ url: `/crm/desensitize-log/delete?id=` + id })
  },

  // 导出查看敏感信息日志 Excel
  exportDesensitizeLog: async (params) => {
    return await request.download({ url: `/crm/desensitize-log/export-excel`, params })
  },
}