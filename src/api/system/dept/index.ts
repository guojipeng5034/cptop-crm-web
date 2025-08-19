import request from '@/config/axios'

export interface DeptVO {
  id?: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId: number
  phone: string
  email: string
  campusId: number
  createTime: Date
  withParents: boolean
}

// 查询部门（精简)列表
export const getSimpleDeptList = async (): Promise<DeptVO[]> => {
  return await request.get({ url: '/system/dept/simple-list' })
}

// 查询快酷中国区部门（精简)列表
export const getSimpleKuaiKuDeptList = async (): Promise<DeptVO[]> => {
  return await request.get({ url: '/system/dept/list-kuaiku' })
}

// 查询部门列表
export const getDeptPage = async (params: PageParam) => {
  return await request.get({ url: '/system/dept/list', params })
}

// 查询部门详情
export const getDept = async (id: number) => {
  return await request.get({ url: '/system/dept/get?id=' + id })
}

// 获得顶级部门信息
export const getTopDept = async (id: number) => {
  return await request.get({ url: '/system/dept/get-top-level?id=' + id })
}

// 新增部门
export const createDept = async (data: DeptVO) => {
  return await request.post({ url: '/system/dept/create', data: data })
}

// 修改部门
export const updateDept = async (params: DeptVO) => {
  return await request.put({ url: '/system/dept/update', data: params })
}

// 删除部门
export const deleteDept = async (id: number) => {
  return await request.delete({ url: '/system/dept/delete?id=' + id })
}

// 检验是否存在子部门
export const isChildDept = async (id: number) => {
  return await request.get({ url: '/system/dept/is-child-dept-exists?id=' + id })
}

// 检验是否存在子部门
export const isUserDept = async (id: number) => {
  return await request.get({ url: '/system/dept/is-user-exists-in-dept?id=' + id })
}