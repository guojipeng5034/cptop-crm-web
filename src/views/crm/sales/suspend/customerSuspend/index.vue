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
          <el-form-item label="停课券" prop="couponId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.couponId" placeholder="请选择或检索停课券" clearable filterable class="!w-240px">
              <el-option v-for="option in suspendOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COUPON_USED_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="添加渠道" prop="channel" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channel" placeholder="请选择添加渠道" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COUPON_ADD_CHANNEL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="使用时间" prop="employTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.employTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="mentorId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                Mentor
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:customerSuspend:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:customerSuspend:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:sales:customerSuspend:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['crm:sales:customerSuspend:import']">
          <Icon icon="fluent:multiselect-16-filled" class="mr-5px" /> 批量添加
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:customerSuspend:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
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
      <el-table-column label="优惠券" align="center" prop="couponName" min-width="180" />
      <el-table-column label="状态" align="center" prop="status" min-width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_COUPON_USED_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="添加渠道" align="center" prop="channel" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_COUPON_ADD_CHANNEL" :value="scope.row.channel" />
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <el-table-column label="开始" align="center" prop="expiredFrom" :formatter="timeWithoutSecondFormat"
          width="110" />
        <el-table-column label="结束" align="center" prop="expiredTo" :formatter="timeWithoutSecondFormat"
          min-width="110" />
      </el-table-column>
      <el-table-column label="使用时间" align="center" prop="employTime" :formatter="timeWithoutSecondFormat"
        min-width="110" />
      <el-table-column label="被推荐人" align="center" prop="referrerCustomerName" min-width="100" />
      <el-table-column label="添加人" align="center" prop="creatorName" min-width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        min-width="110" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="200" />
      <el-table-column label="操作" align="center" min-width="130" fixed="right"
        v-hasPermi="['crm:sales:customerSuspend:update', 'crm:sales:customerSuspend:delete']">
        <template #default="scope">
          <el-button link type="primary"
            @click="openForm('update', scope.row.id, scope.row.customerName, scope.row.customerId)"
            v-hasPermi="['crm:sales:customerSuspend:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:sales:customerSuspend:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员停课券 表单 -->
  <CustomerSuspendForm ref="formRef" @success="getList" />
  <!-- 批量导入学员优惠券 表单 -->
  <BatchImportSuspendForm ref="batchImportSuspendFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  getSuspendOptions, handleRemoteCustomerOptions, handleRemoteUserOptions,
} from '@/utils/dict'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { CustomerSuspendApi, CustomerSuspendVO } from '@/api/crm/sales/suspend/customerSuspend'
import CustomerSuspendForm from './CustomerSuspendForm.vue'
import BatchImportSuspendForm from './BatchImportSuspendForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 学员优惠券 列表 */
defineOptions({ name: 'CustomerSuspend' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CustomerSuspendVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponId: undefined,
  customerId: undefined,
  couponName: undefined,
  status: undefined,
  channel: undefined,
  employTime: [],
  orderId: undefined,
  mentorId: undefined, // mentor
  siteId: [], // 站点
  createTime: [], // 创建时间
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

// 2.user
const userOptions = ref()
const userOptionsLoading = ref(false)
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.suspend
const suspendOptions = ref({})

/* 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerSuspendApi.getCustomerSuspendPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/* 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string, customerId?: number) => {
  formRef.value.open(type, id, name, customerId)
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerSuspendApi.deleteCustomerSuspend(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
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
    const data = await CustomerSuspendApi.exportCustomerSuspend(exportParams)
    download.excel(data, '学员停课券.xlsx')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/** 批量导入按钮操作 */
const batchImportSuspendFormRef = ref()
const handleImport = () => {
  batchImportSuspendFormRef.value.open()
}

/* 初始化 */
onMounted(async () => {
  suspendOptions.value = await getSuspendOptions()
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
}
</style>
