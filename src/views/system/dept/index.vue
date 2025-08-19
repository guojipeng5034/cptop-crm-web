<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="68">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入部门名称" class="!w-240px" @input="handleInput" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="办公地" prop="campusId">
            <!-- <el-select v-model="queryParams.campusId" placeholder="请选择办公地" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_CAMPUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select> -->
            <el-select v-model="queryParams.campusId" placeholder="请选择办公地" clearable filterable class="!w-240px">
              <el-option v-for="dict in OfficePlaceList" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="部门分类" prop="belongId">
            <el-select v-model="queryParams.belongId" placeholder="请选择部门分类" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYS_PRESET_DEPT)" :key="dict.value"
                :label="dict.label" :value="dict.value" v-show="dict.cssClass != 'noshow'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">

          <el-form-item label="负责人" prop="leaderUserId">
            <el-select v-model="queryParams.leaderUserId" placeholder="请选择负责人" filterable remote
              :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions" class="!w-240px">
              <el-option v-for="option in userOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
            <!-- <el-select
              v-model="queryParams.leaderUserId"
              placeholder="请选择负责人"
              clearable
              filterable
              class="!w-240px"
            >
              <el-option
                v-for="dict in userList"
                :key="dict.id"
                :label="dict.nickname"
                :value="dict.id"
              />
             </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="部门状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择部门状态" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['system:dept:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="danger" plain @click="toggleExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" :default-expand-all="isExpandAll" v-if="refreshTable">
      <el-table-column prop="name" label="部门名称" width="220" />
      <el-table-column prop="id" label="部门ID" show-overflow-tooltip />
      <!-- <el-table-column prop="belongId" label="部门分类" /> -->
      <el-table-column prop="belongId" label="部门分类" width="120">
        <template #default="scope">
          <dict-tag-new :type="DICT_TYPE.SYS_PRESET_DEPT" :value="scope.row.belongId" />
        </template>
      </el-table-column>
      <el-table-column prop="campusName" label="办公地" show-overflow-tooltip />
      <el-table-column prop="leaderUserName" label="负责人" show-overflow-tooltip>
        <template #default="scope">
          <!-- {{ userList.find((user) => user.id === scope.row.leaderUserId)?.nickname }} -->
          {{ scope.row.leaderUserName }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatterYMDHms" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180" :formatter="dateFormatterYMDHms" />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary"
            @click="openForm('update', scope.row.id, scope.row.leaderUserName, scope.row.leaderUserId)"
            v-hasPermi="['system:dept:update']">
            修改
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['system:dept:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DeptForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'
import DeptForm from './DeptForm.vue'
import * as UserApi from '@/api/system/user'
import * as OfficePlaceApi from '@/api/system/OfficePlace'

defineOptions({ name: 'SystemDept' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref() // 列表的数据
const isExpandAll = ref(true) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const userList = ref<UserApi.UserVO[]>([]) // 用户列表
const OfficePlaceList = ref<OfficePlaceApi.OfficePlaceVO[]>([]) // 办公地列表

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 100,
  name: undefined,
  campusId: undefined,
  status: undefined,
  belongId: undefined,
  leaderUserId: undefined,
  withParents: undefined,
})
const queryFormRef = ref() // 搜索的表单

/* option */
// user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

watch(
  () => ({
    name: queryParams.name,
    campusId: queryParams.campusId,
    status: queryParams.status,
    belongId: queryParams.belongId,
    leaderUserId: queryParams.leaderUserId
  }),
  (newVal, oldVal) => {
    // 当任一查询条件变化时，设置 withParents = true
    if (newVal.name === '' && oldVal.name !== '') {
      queryParams.withParents = undefined
    } else {
      // 其他参数变化时，设置 withParents 为 true
      queryParams.withParents = true
    }
  },
  { deep: true }
)
/** 查询部门列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = Object.fromEntries(
      Object.entries(queryParams)
        .filter(([_, v]) => v !== undefined)
    )
    const data = await DeptApi.getDeptPage(params)
    // 冻结，避免多次加载，数据冗杂
    list.value = Object.freeze(handleTree(data))
  } finally {
    loading.value = false
  }
}

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()

}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.pageNo = 1
  queryParams.withParents = undefined
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, leaderUserName?: string, leaderUserId?: any) => {
  formRef.value.open(type, id, leaderUserName, leaderUserId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 初始删除确认
    await message.delConfirm('是否删除该部门?')
    // 并行检查子部门和用户存在情况
    const [hasChildren, hasUsers] = await Promise.all([
      DeptApi.isChildDept(id),
      DeptApi.isUserDept(id)
    ])
    // 根据检查结果进行不同确认
    if (hasChildren) await message.delConfirm('该部门下存在子部门，是否连同子部门一起删除?')
    if (hasUsers) await message.delConfirm('该部门下存在用户，是否继续删除?')
    // 执行删除操作
    await DeptApi.deleteDept(id)
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('删除部门失败:', error);
  }
}

const handleInput = (val) => {
  queryParams.withParents = undefined
}

/** 初始化 **/
onMounted(async () => {
  loading.value = false
  await Promise.all([
    UserApi.getSimpleUserList().then(res => userList.value = res),
    OfficePlaceApi.OfficePlaceApi.getOfficePlaceList().then(res => OfficePlaceList.value = res)
  ])
})
</script>
