<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="search-form -mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="90">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="分配规则" prop="ployId">
            <el-select v-model="queryParams.ployId" placeholder="请选择分配规则" clearable filterable class="!w-240px">
              <el-option v-for="option in queryOptions.ploy.list" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="用户" prop="userId">
            <el-select v-model="queryParams.userId" placeholder="请检索后选择用户" clearable filterable remote
              :loading="queryOptions.user.loading" :remote-method="queryOptions.user.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.user.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="用户部门" prop="deptId">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="5" show-checkbox default-expand-all
              placeholder="请选择用户部门" node-key="id" class="!w-240px"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.deptId)">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="分配日期" prop="assignTime">
            <el-date-picker v-model="queryParams.assignTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
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
        <el-button type="primary" plain @click="openForm('create')"
          v-hasPermi="['crm:list-owner-assign-ploy-mentor-cross:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip>
      <el-table-column label="分配规则" align="center" prop="ployName" min-width="180" />
      <el-table-column label="顾问" align="center" prop="userName" min-width="180" />
      <el-table-column label="部门" align="center" prop="deptName" min-width="180" />
      <el-table-column label="分配日期" align="center" prop="assignTime" :formatter="dateFormatterYMD" min-width="180" />
      <el-table-column label="轮询分配次数" align="center" prop="autoTimes" min-width="110" />
      <el-table-column label="定向分配次数" align="center" prop="directTimes" min-width="110" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="180" />
      <el-table-column label="操作" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:list-owner-assign-ploy-mentor-cross:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:list-owner-assign-ploy-mentor-cross:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 人员范围管理 表单 -->
  <CrossForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getListOwnerAssignPloyOptions, handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMD, dateFormatterYMDHms } from '@/utils/formatTime'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ListOwnerAssignPloyMentorCrossApi, ListOwnerAssignPloyMentorCrossVO } from '@/api/crm/customer/assign/cross'
import * as DeptApi from '@/api/system/dept'
import CrossForm from './CrossForm.vue'

/** 人员范围 列表 */
defineOptions({ name: 'AssignCross' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ListOwnerAssignPloyMentorCrossVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ployId: undefined,
  userId: undefined,
  deptId: [],
  assignTime: [],
  createTime: []
})

/* 选项列表 */
const queryOptions = reactive({
  user: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  ploy: {
    list: ref([]),
    async load() {
      this.list = await getListOwnerAssignPloyOptions()
    }
  },
  async init() {
    await this.dept.load()
    await this.ploy.load()
  }
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ListOwnerAssignPloyMentorCrossApi.getListOwnerAssignPloyMentorCrossPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ListOwnerAssignPloyMentorCrossApi.deleteListOwnerAssignPloyMentorCross(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}
</style>