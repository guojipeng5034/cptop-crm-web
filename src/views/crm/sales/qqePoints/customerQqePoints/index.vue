<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-160px id">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐订单号" prop="packagesOrderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.packagesOrderNum" placeholder="请输入套餐订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="追加包订单号" prop="orderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.orderNum" placeholder="请输入追加包订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="返回类型" prop="returnType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.returnType" placeholder="请选择或检索返回类型" filterable clearable multiple
              collapse-tags :max-collapse-tags="3" show-checkbox class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_QQE_POINTS_ADD_CHANNEL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="mentorOptionsLoading"
              :remote-method="fetchRemoteMentorOptions" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="deptList"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.deptId)"
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
          <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" clearable filterable remote multiple
              :loading="creatorOptionsLoading" :remote-method="fetchRemoteCreatorOptions" placeholder="请检索后选择操作人"
              class="!w-240px">
              <el-option v-for="item in creatorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="备注" prop="remark" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:returnLog:qqePoints:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:returnLog:qqePoints:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('add')" v-hasPermi="['crm:sales:returnLog:qqePoints:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 添加课时点
        </el-button>
        <el-button type="warning" plain @click="openForm('remove')"
          v-hasPermi="['crm:sales:returnLog:qqePoints:remove']">
          <Icon icon="ep:minus" class="mr-5px" /> 扣除课时点
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['crm:sales:returnLog:qqePoints:import']">
          <Icon icon="fluent:multiselect-16-filled" class="mr-5px" /> 批量添加
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:returnLog:qqePoints:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
      <Statistic :data="extendData" :loading="loading" />
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" ref="tableRef" :row-key="(row) => row.id"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="100">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
            v-truncate="10">
            {{ scope.row.customerName }}
          </el-button>
          <span v-if="scope.row.customerId" class="flex justify-center items-center">
            <span>学号:</span>
            <el-tooltip effect="light" content="点击复制" placement="right">
              <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                {{ scope.row.customerId }}
              </el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="套餐订单号" align="center" prop="packagesOrderNum" min-width="160"
        :formatter="formatEmptyValue" />
      <el-table-column label="追加包订单号" align="center" prop="orderNum" min-width="160" :formatter="formatEmptyValue" />
      <el-table-column label="返还课时点点数" align="center" prop="returnPointsNum" min-width="130" />
      <el-table-column label="返回类型" align="center" prop="returnType" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_QQE_POINTS_ADD_CHANNEL" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="200" />
      <el-table-column label="操作人" align="center" prop="creatorName" min-width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="140" />
      <el-table-column label="操作" align="center" min-width="100" fixed="right"
        v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goToQQE(null, scope.row.customerId)"
            v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
            QQE
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员课时点记录 表单 -->
  <ReturnPointsLogForm ref="formRef" @success="getList" />
  <!-- 批量导入学员课时点记录 表单 -->
  <BatchImportQqePointForm ref="batchImportQqePointFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions,
} from '@/utils/dict'
import { dateFormatterYMDHm, disabledAfterDate } from '@/utils/formatTime'
import { formatEmptyValue } from '@/utils/table'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { isEmpty } from '@/utils/is'
import { goToQQE } from '@/utils/navigation'
import { CUSTOMERQQEPOINTS_STATISTICS_LABEL } from '@/utils/constants'
import { CustomerQqePointsApi, CustomerQqePointsVO } from '@/api/crm/sales/qqePoints/customerQqePoints'
import * as DeptApi from '@/api/system/dept'
import ReturnPointsLogForm from './ReturnPointsLogForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import BatchImportQqePointForm from './BatchImportQqePointForm.vue'

/** 课时点记录 列表 */
defineOptions({ name: 'CustomerQqePoints' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<CustomerQqePointsVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const extendData = ref()
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined, // 学员
  orderNum: undefined, // 追加包订单号
  packagesOrderNum: undefined, // 套餐订单号
  returnType: undefined,
  mentorId: undefined,
  deptId: [], //
  siteId: [], // 站点
  creator: [], // 操作人
  createTime: [], // 创建时间
  remark: undefined, // 备注
  fromArea: undefined // 来源地区
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })

const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}

// 2.mentor
const mentorOptions = ref()
const mentorOptionsLoading = ref(false)
const fetchRemoteMentorOptions = async (query) => {
  const setUserOptions = (newValue) => (mentorOptions.value = newValue)
  const setUserLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.creator
const creatorOptions = ref()
const creatorOptionsLoading = ref(false)
const fetchRemoteCreatorOptions = async (query) => {
  const setUserOptions = (newValue) => (creatorOptions.value = newValue)
  const setUserLoading = (newValue) => (creatorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 4.dept
const deptList = ref<Tree[]>([]) // 树形结构

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerQqePointsApi.getCustomerQqePointsPage(queryParams)
    if (!isEmpty(data.pageData)) {
      list.value = data.pageData.list
      total.value = data.pageData.total
    } else {
      list.value = []
      total.value = 0
    }
    extendData.value = Object.entries(data.extendData).map(([key, value]) => ({
      title: CUSTOMERQQEPOINTS_STATISTICS_LABEL[key] || key,
      value,
    }))
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

/* 多选 */
const tableRef = ref()
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

/* 取消多选 */
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 导出参数
    const exportParams = {
      ...queryParams,
      ...(multipleSelection.value.length > 0 ? { ids: multipleSelection.value } : {}),
    }
    // 发起导出
    exportLoading.value = true
    const data = await CustomerQqePointsApi.exportCustomerQqePoints(exportParams)
    download.excel(data, '学员课时点.xlsx')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 批量导入按钮操作 */
const batchImportQqePointFormRef = ref()
const handleImport = () => {
  batchImportQqePointFormRef.value.open()
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  getList()
})
</script>
<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
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

  .statistics {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1.5rem;
  }
}
</style>
