<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-160px id">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更前顾问" prop="oldId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.oldId" clearable filterable remote :loading="queryOptions.oldId.loading"
              :remote-method="queryOptions.oldId.handleSearch" placeholder="请检索后选择变更前顾问" class="!w-240px">
              <el-option v-for="option in queryOptions.oldId.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更后顾问" prop="newId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.newId" clearable filterable remote :loading="queryOptions.newId.loading"
              :remote-method="queryOptions.newId.handleSearch" placeholder="请检索后选择变更后顾问" class="!w-240px">
              <el-option v-for="option in queryOptions.newId.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="原因" prop="reason" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.reason" placeholder="请选择原因" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_REASON)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="流转来源" prop="source" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.source" placeholder="请选择流转来源" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_SOURCE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="方式" prop="type" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.type" placeholder="请选择方式" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="queryOptions.creator.loading"
              :remote-method="queryOptions.creator.handleSearch" placeholder="请检索后选择操作人" class="!w-240px">
              <el-option v-for="item in queryOptions.creator.options" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="备注" prop="remarks" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.remarks" placeholder="请输入备注" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更前部门" prop="oldDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.oldDeptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择或检索变更前部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.oldDeptId)"
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
          <el-form-item label="变更后部门" prop="newDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.newDeptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择或检索变更后部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.newDeptId)"
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
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:customer-transfer-log:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:customer-transfer-log:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180">
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
              v-truncate="10">
              {{ scope.row.customerName }}
            </el-button>
            <arco-tag class="ml-5px" :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.studyStatus" />
          </div>
          <div class="student-info font-size-3 c-#777">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3">
                  {{ scope.row.customerId }}
                </el-button>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="变更前顾问" align="center" prop="oldName" min-width="120" />
      <el-table-column label="变更后顾问" align="center" prop="newName" min-width="120" />
      <el-table-column label="原因" align="center" prop="reason" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.TRANSFER_REASON" :value="scope.row.reason" />
        </template>
      </el-table-column>
      <el-table-column label="流转来源" align="center" prop="source" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.TRANSFER_SOURCE" :value="scope.row.source" />
        </template>
      </el-table-column>
      <el-table-column label="方式" align="center" prop="type" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.TRANSFER_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="110" />
      <el-table-column label="操作人" align="center" prop="createUserName" min-width="110" />
      <el-table-column label="变更前部门" align="center" prop="oldDeptName" min-width="200" />
      <el-table-column label="变更后部门" align="center" prop="newDeptName" min-width="200" />
      <el-table-column label="备注" align="center" prop="remarks" show-overflow-tooltip min-width="200" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import * as DeptApi from '@/api/system/dept'
import { TransferLogApi, TransferLogVO } from '@/api/crm/customer/transferLog'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 学员Mentor流转记录 列表 */
defineOptions({ name: 'CustomerTransferLog' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<TransferLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  oldId: undefined, // 变更前顾问
  newId: undefined, // 变更后顾问
  reason: undefined, // 转让原因
  source: undefined, // 流转来源
  type: undefined, // 流转方式
  creator: undefined, // 操作人
  remarks: undefined, // 备注
  createTime: [], // 时间
  oldDeptId: [], // 变更前部门
  newDeptId: [], // 变更后部门
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  oldId: useRemoteSearch(handleRemoteUserOptions),
  newId: useRemoteSearch(handleRemoteUserOptions),
  creator: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TransferLogApi.getCustomerTransferLogPage(queryParams)
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

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>

<style scoped lang="scss">
.search-form {

  /* 控制 search form label 分散对齐 */
  :deep(.el-form-item label:after) {
    content: '';
    width: 100%;
  }

  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
    word-break: break-all;
  }

  .customer {
    :deep(.el-form-item__content) {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    .type {
      :deep(.el-select__wrapper) {
        font-size: 12px;
        font-weight: 700;
        background-color: #f5f7fa;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .id {
      :deep(.el-select__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
