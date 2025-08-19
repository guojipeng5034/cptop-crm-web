<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer">
            <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-160px id" @keyup.enter="handleQuery">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="积分变动原因" prop="channel">
            <el-select v-model="queryParams.channel" placeholder="请选择积分变动原因" filterable clearable multiple collapse-tags
              :max-collapse-tags="2" show-checkbox class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_POINTS_ADD_CHANNEL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推荐付费学员" prop="paymentCustomerId">
            <el-select v-model="queryParams.paymentCustomerId" placeholder="请检索后选择推荐付费学员" clearable filterable remote
              :loading="queryOptions.paymentCustomer.loading" :remote-method="queryOptions.paymentCustomer.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.paymentCustomer.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" :disabled-date="disabledAfterDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="queryParams.remark" placeholder="请输入备注" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="积分操作人" prop="creator">
            <el-select v-model="queryParams.creator" placeholder="请检索后选择积分操作人" clearable filterable remote
              :loading="queryOptions.creator.loading" :remote-method="queryOptions.creator.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.creator.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索后选择Mentor" @keyup.enter="handleQuery"
              class="!w-240px">
              <el-option v-for="item in queryOptions.mentor.options" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="mentorDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.mentorDeptId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择Mentor所属部门" node-key="id"
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
          <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:returnLog:points:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:returnLog:points:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('add')" v-hasPermi="['crm:sales:returnLog:points:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 添加积分
        </el-button>
        <el-button type="warning" plain @click="openForm('remove')" v-hasPermi="['crm:sales:returnLog:points:create']">
          <Icon icon="ep:minus" class="mr-5px" /> 扣除积分
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['crm:sales:returnLog:points:import']">
          <Icon icon="fluent:multiselect-16-filled" class="mr-5px" /> 批量添加
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:returnLog:points:export']">
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
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="160">
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
      <el-table-column label="积分变动数量" align="center" prop="pointsNum" min-width="160">
        <template #default="scope">
          <div :class="scope.row.pointsNum < 0 ? 'color-red font-700' : 'color-green font-700'">
            {{ scope.row.pointsNum }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="积分变动原因" align="center" prop="channel" min-width="160">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_POINTS_ADD_CHANNEL" :value="scope.row.channel" />
        </template>
      </el-table-column>
      <el-table-column label="推荐付费学员" align="center" prop="paymentCustomerName" min-width="140" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="300" />
      <el-table-column label="积分操作人" align="center" prop="creatorName" min-width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="200" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 积分 表单 -->
  <PointsLogForm ref="formRef" @success="getList" />
  <!-- 批量导入学员积分记录 表单 -->
  <BatchImportPointForm ref="batchImportPointFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteUserOptions, handleRemoteCustomerOptions
} from '@/utils/dict'
import { dateFormatterYMDHm, disabledAfterDate } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { isEmpty } from '@/utils/is'
import { CUSTOMERPOINT_STATISTICS_LABEL } from '@/utils/constants'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { CustomerPointApi, CustomerPointVO } from '@/api/crm/sales/point/customerPoint'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import * as DeptApi from '@/api/system/dept'
import PointsLogForm from './PointsLogForm.vue'
import BatchImportPointForm from './BatchImportPointForm.vue'

/** 积分记录 列表 */
defineOptions({ name: 'CustomerPoint' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<CustomerPointVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const extendData = ref()
const exportLoading = ref(false) // 导出的加载中
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  channel: undefined, // 积分变动原因
  paymentCustomerId: undefined, // 推荐付费学员
  createTime: [], // 创建时间
  remark: undefined,
  creator: undefined,
  mentorId: undefined,
  mentorDeptId: undefined,
  siteId: [], // 站点
  fromArea: undefined // 来源地区
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  paymentCustomer: useRemoteSearch(handleRemoteCustomerOptions),
  creator: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerPointApi.getCustomerPointPage(queryParams)
    if (!isEmpty(data.pageData)) {
      list.value = data.pageData.list
      total.value = data.pageData.total
    } else {
      list.value = []
      total.value = 0
    }
    extendData.value = Object.entries(data.extendData).map(([key, value]) => ({
      title: CUSTOMERPOINT_STATISTICS_LABEL[key] || key,
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
const openForm = (type: string) => {
  formRef.value.open(type)
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
    const data = await CustomerPointApi.exportCustomerPoint(exportParams)
    download.excel(data, '学员积分.xlsx')
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
const batchImportPointFormRef = ref()
const handleImport = () => {
  batchImportPointFormRef.value.open()
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
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
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.15rem;
    margin-right: 1.5rem;
  }
}
</style>
