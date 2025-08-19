interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid'
}
export const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

// tree from list
export const listToTree = <T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] => {
  const conf = getConfig(config) as TreeHelperConfig
  const nodeMap = new Map()
  const result: T[] = []
  const { id, children, pid } = conf

  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid])
    ;(parent ? parent.children : result).push(node)
  }
  return result
}

export const treeToList = <T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T => {
  config = getConfig(config)
  const { children } = config
  const result: any = [...tree]
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue
    result.splice(i + 1, 0, ...result[i][children!])
  }
  return result
}

export const findNode = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | null => {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  for (const node of list) {
    if (func(node)) return node
    node[children!] && list.push(...node[children!])
  }
  return null
}

export const findNodeAll = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  config = getConfig(config)
  const { children } = config
  const list = [...tree]
  const result: T[] = []
  for (const node of list) {
    func(node) && result.push(node)
    node[children!] && list.push(...node[children!])
  }
  return result
}

export const findPath = <T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | T[] | null => {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

export const findPathAll = (tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) => {
  config = getConfig(config)
  const path: any[] = []
  const list = [...tree]
  const result: any[] = []
  const visitedSet = new Set(),
    { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      func(node) && result.push([...path])
    }
  }
  return result
}

/**
 * 查找节点并返回符合条件的父节点
 * @param tree 树形数据
 * @param targetId 要查找的节点ID
 * @param parentIds 符合条件的父ID数组
 * @returns 符合条件的父节点或null
 */
export const findParentWithCondition = <T = any>(
  tree: any[],
  targetId: any,
  parentIds: any[],
  config: Partial<TreeHelperConfig> = {}
): T | null => {
  // 使用findPath获取从根节点到目标节点的路径
  const path = findPath(tree, (node) => node.id === targetId, config) as any[]
  
  if (!path || path.length === 0) return null

  // 从近到远检查父节点（不跳过目标节点本身）
  for (let i = path.length - 1; i >= 0; i--) {
    if (new Set(parentIds).has(path[i].id)) {
      return path[i]
    }
  }
  
  return null
}

export const filter = <T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] => {
  config = getConfig(config)
  const children = config.children as string

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children])
        return func(node) || (node[children] && node[children].length)
      })
  }

  return listFilter(tree)
}

export const forEach = <T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {}
): void => {
  config = getConfig(config)
  const list: any[] = [...tree]
  const { children } = config
  for (let i = 0; i < list.length; i++) {
    // func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
  }
}

/**
 * @description: Extract tree specified structure
 */
export const treeMap = <T = any>(
  treeData: T[],
  opt: { children?: string; conversion: Fn }
): T[] => {
  return treeData.map((item) => treeMapEach(item, opt))
}

/**
 * @description: Extract tree specified structure
 */
export const treeMapEach = (
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn }
) => {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0
  const conversionData = conversion(data) || {}
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion
        })
      )
    }
  } else {
    return {
      ...conversionData
    }
  }
}

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export const eachTree = (treeDatas: any[], callBack: Fn, parentNode = {}) => {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element
    if (element.children) {
      eachTree(element.children, callBack, newNode)
    }
  })
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export const handleTree = (data: any[], id?: string, parentId?: string, children?: string) => {
  if (!Array.isArray(data)) {
    console.warn('data must be an array')
    return []
  }
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  const childrenListMap = {}
  const nodeIds = {}
  const tree: any[] = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }

  return tree
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
// @ts-ignore
export const handleTree2 = (data, id, parentId, children, rootId) => {
  id = id || 'id'
  parentId = parentId || 'parentId'
  // children = children || 'children'
  rootId =
    rootId ||
    Math.min(
      ...data.map((item) => {
        return item[parentId]
      })
    ) ||
    0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father.children = branchArr) : ''
    // 返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * 校验选中的节点，是否为指定 level
 *
 * @param tree 要操作的树结构数据
 * @param nodeId 需要判断在什么层级的数据
 * @param level 检查的级别, 默认检查到二级
 * @return true 是；false 否
 */
export const checkSelectedNode = (tree: any[], nodeId: any, level = 2): boolean => {
  if (typeof tree === 'undefined' || !Array.isArray(tree) || tree.length === 0) {
    console.warn('tree must be an array')
    return false
  }

  // 校验是否是一级节点
  if (tree.some((item) => item.id === nodeId)) {
    return false
  }

  // 递归计数
  let count = 1

  // 深层次校验
  function performAThoroughValidation(arr: any[]): boolean {
    count += 1
    for (const item of arr) {
      if (item.id === nodeId) {
        return true
      } else if (typeof item.children !== 'undefined' && item.children.length !== 0) {
        if (performAThoroughValidation(item.children)) {
          return true
        }
      }
    }
    return false
  }

  for (const item of tree) {
    count = 1
    if (performAThoroughValidation(item.children)) {
      // 找到后对比是否是期望的层级
      if (count >= level) {
        return true
      }
    }
  }

  return false
}

/**
 * 获取节点的完整结构
 * @param tree 树数据
 * @param nodeId 节点 id
 */
export const treeToString = (tree: any[], nodeId) => {
  if (typeof tree === 'undefined' || !Array.isArray(tree) || tree.length === 0) {
    console.warn('tree must be an array')
    return ''
  }
  // 校验是否是一级节点
  const node = tree.find((item) => item.id === nodeId)
  if (typeof node !== 'undefined') {
    return node.name
  }
  let str = ''

  function performAThoroughValidation(arr) {
    for (const item of arr) {
      if (item.id === nodeId) {
        str += ` / ${item.name}`
        return true
      } else if (typeof item.children !== 'undefined' && item.children.length !== 0) {
        str += ` / ${item.name}`
        if (performAThoroughValidation(item.children)) {
          return true
        }
      }
    }
    return false
  }

  for (const item of tree) {
    str = `${item.name}`
    if (performAThoroughValidation(item.children)) {
      break
    }
  }
  return str
}

/**
 * 递归查找指定 id 节点，并获取其自身及所有子孙节点的 id 数组
 * 
 * @param {Array} data - 组织结构树形数据
 * @param {number|string} targetId - 需要查找的目标 id
 * @returns {Array<number|string>} - 包含目标 id 及其所有子孙节点 id 的数组
 * 
 * @example
 * const data = [ 
 *   { id: 10000, children: [ 
 *     { id: 10005, children: [ { id: 10023 }, { id: 10024 } ] }, 
 *     { id: 10006 } 
 *   ] }
 * ];
 * 
 * getAllChildIds(data, 10000); 
 * // 返回: [10000, 10005, 10023, 10024, 10006]
 */
export function getAllChildIds(data, targetId) {
  const result = [];

  /**
   * 遍历整个数据树，找到目标 id 对应的节点
   * 
   * @param {Array} nodes - 当前遍历的节点数组
   */
  function traverse(nodes) {
    for (const node of nodes) {
      if (node.id == targetId) {
        collectIds(node);
        return;
      } else if (node.children) {
        traverse(node.children);
      }
    }
  }

  /**
   * 递归收集指定节点及其所有子节点的 id
   * 
   * @param {Object} node - 当前节点对象
   */
  function collectIds(node) {
    result.push(node.id)
    if (node.children) {
      for (const child of node.children) {
        collectIds(child)
      }
    }
  }

  traverse(data);
  return result;
}


/* 部门树的特殊绑定 */
export const handleTreeCheckChange = (node, checked, targetArray, key = 'id', loading?: boolean) => {
  if (loading) {
    // 数据加载时的处理
    const idx = targetArray.indexOf(node[key])
    if (checked && idx === -1) {
      targetArray.push(node[key])
    } else if (!checked && idx !== -1) {
      targetArray.splice(idx, 1)
    }
    return
  }
  // 用户交互时的处理
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const idx = targetArray.indexOf(child[key])
      if (checked && idx === -1) {
        targetArray.push(child[key])
      } else if (!checked && idx !== -1) {
        targetArray.splice(idx, 1)
      }
      // 递归处理子节点的子节点
      if (child.children && child.children.length > 0) {
        handleTreeCheckChange(child, checked, targetArray, key)
      }
    })
  }
}