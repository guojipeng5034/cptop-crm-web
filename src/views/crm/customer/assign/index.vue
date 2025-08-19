<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="分配日期" prop="assignTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.assignTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="可分配顾问" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="mentorOptionsLoading"
              :remote-method="fetchRemoteMentorOptions" placeholder="请选择线索分配人员" class="!w-240px">
              <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="mentorDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.mentorDeptId" multiple filterable clearable :data="deptList"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择或检索所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.mentorDeptId)"
              class="!w-240px">
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
          <el-form-item label="岗位" prop="postIds" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.postIds" placeholder="请选择岗位" class="!w-240px">
              <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="creatorOptionsLoading"
              :remote-method="fetchRemoteCreatorOptions" placeholder="请选择创建人" class="!w-240px">
              <el-option v-for="item in creatorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
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
        <el-button type="primary" plain @click="handleAssign('create')" v-hasPermi="['crm:list-owner-assign:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="warning" plain @click="importAssign" v-hasPermi="['crm:list-owner-assign:import']">
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <!-- 暂时不做 -->
        <!-- <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:list-owner-assign:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->
        <el-button type="danger" plain @click="batchDelete" v-hasPermi="['crm:list-owner-assign:delete']">
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border ref="tableRef" max-height="70vh"
      @selection-change="handleSelectionChange" :row-key="row => row.id" @sort-change="handleSortChange">
      <el-table-column type="selection" align="center" reserve-selection :selectable="selectable" />
      <el-table-column label="分配日期" align="center" prop="assignTime" :formatter="dateFormatterYMD" min-width="80"
        sortable="custom" />
      <el-table-column label="可分配顾问" align="center" prop="mentorName" min-width="80" />
      <el-table-column label="所属部门" align="center" prop="mentorDeptName" min-width="140" />
      <el-table-column label="岗位" align="center" prop="postNames" min-width="80" />
      <el-table-column label="创建人" align="center" prop="creatorName" min-width="80" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="100"
        :show-overflow-tooltip="false" sortable="custom" />
      <el-table-column label="操作" align="center" min-width="80">
        <template #default="scope">
          <el-button v-if="disabledBeforeStartDate(new Date(), getNextDay(scope.row.assignTime))" link type="primary"
            @click="handleAssign('update', scope.row.id)" v-hasPermi="['crm:list-owner-assign:update']">
            编辑
          </el-button>
          <el-button v-if="disabledBeforeStartDate(new Date(), getNextDay(scope.row.assignTime))" link type="danger"
            @click="handleDelete(scope.row.id)" v-hasPermi="['crm:list-owner-assign:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 新增分配人员 表单 -->
  <AssignForm ref="assignFormRef" @success="getList" />
  <!-- 导入分配人员 表单 -->
  <AssignImportForm ref="assignImportFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMD, dateFormatterYMDHms, getNextDay, disabledBeforeStartDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { handleSortfields } from '@/utils/table'
import * as PostApi from '@/api/system/post'
import * as DeptApi from '@/api/system/dept'
import { ListOwnerAssignApi, ListOwnerAssignVO } from '@/api/crm/customer/assign'
import AssignForm from './AssignForm.vue'
import AssignImportForm from './AssignImportForm.vue'

/** 学员线索分配 列表 */
defineOptions({ name: 'ListOwnerAssign' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ListOwnerAssignVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const tableRef = ref()
const selectable = (row) => disabledBeforeStartDate(new Date(), getNextDay(row.assignTime))
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  assignTime: [],
  mentorId: undefined,
  mentorDeptId: [],
  postIds: undefined,
  flushTimes: undefined,
  creator: undefined,
  createTime: [],
  // 排序
  orderBy: ['']
})

/* options */
// 1.mentor
const mentorOptionsLoading = ref(false)
const mentorOptions = ref([])
const fetchRemoteMentorOptions = async (query) => {
  const setMentorOptions = (newValue) => (mentorOptions.value = newValue)
  const setMentorLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setMentorOptions, setMentorLoading)
}

// 2.creator
const creatorOptionsLoading = ref(false)
const creatorOptions = ref([])
const fetchRemoteCreatorOptions = async (query) => {
  const setCreatorOptions = (newValue) => (creatorOptions.value = newValue)
  const setCreatorLoading = (newValue) => (creatorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setCreatorOptions, setCreatorLoading)
}

// 3.dept
const deptList = ref<Tree[]>([]) // 树形结构

// 4.post
const postList = ref([] as PostApi.PostVO[]) // 岗位列表

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ListOwnerAssignApi.getListOwnerAssignPage(queryParams)
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

/** 新增分配人员操作 */
const assignFormRef = ref()
const handleAssign = (type: string, id?: number) => {
  assignFormRef.value.open(type, id)
}

/** 导入分配人员操作 */
const assignImportFormRef = ref()
const importAssign = () => {
  assignImportFormRef.value.open()
}

// 取消多选
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ListOwnerAssignApi.deleteListOwnerAssign(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } finally {
    multipleSelection.value = []
    cancelSelection()
  }
}

/* 批量删除操作 */
const batchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行批量删除')
  } else {
    try {
      // 批量删除的二次确认
      await message.confirm(`确认要删除这 ${multipleSelection.value.length} 条线索吗?`)
      // 发起批量删除
      await ListOwnerAssignApi.deleteBatchListOwnerAssign(multipleSelection.value)
      message.success('批量删除成功')
      // 刷新列表
      await getList()
    } finally {
      multipleSelection.value = []
      cancelSelection()
    }
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ListOwnerAssignApi.exportListOwnerAssign(queryParams)
    download.excel(data, '学员线索分配人员.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/* 列表选中状态变化 */
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map(item => item.id)
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList()) // 部门树形结构
  postList.value = await PostApi.getSimplePostList() // 岗位列表
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