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
          <el-form-item label="签约订单ID" prop="signedOrderId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.signedOrderId" placeholder="请输入签约订单ID" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="扣费订单号" prop="deductOrderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.deductOrderNum" placeholder="请输入扣费订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="交易号" prop="tradeNo" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.tradeNo" placeholder="请输入交易号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="交易金额" prop="totalAmount" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.totalAmount" placeholder="请输入交易金额" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实收金额" prop="receiptAmount" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.receiptAmount" placeholder="请输入实收金额" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="扣款状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择扣款状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SIGNED_DEDUCT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="理论扣费时间" prop="settingDeductDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.settingDeductDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实际扣费时间" prop="gmtPayment" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.gmtPayment" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
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
          <el-form-item label="支付宝签约号" prop="externalAgreementNo" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.externalAgreementNo" placeholder="请输入支付宝签约号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>

        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="签约记录编号" prop="agreementNo" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.agreementNo" placeholder="请输入签约记录编号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:signed-deduct-record:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:signed-deduct-record:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:signed-deduct-record:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180" fixed>
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
      <el-table-column label="签约" align="center" width="300">
        <template #default="scope">
          <div class="flex justify-start">
            <el-tag type="primary" class="mr-1">支付宝签约号</el-tag>
            <span>{{ scope.row.externalAgreementNo }}</span>
          </div>
          <div class="mt-1 flex justify-start">
            <el-tag type="success" class="mr-1">签约记录编号</el-tag>
            <span>{{ scope.row.agreementNo }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Mentor" align="center" prop="mentorName" min-width="200" class-name="padding-side-0" />
      <el-table-column label="签约订单ID" align="center" prop="signedOrderId" width="100" />
      <el-table-column label="扣费订单号" align="center" prop="deductOrderNum" width="220" class-name="padding-side-0" />
      <el-table-column label="交易号" align="center" prop="tradeNo" min-width="260" />
      <el-table-column label="交易金额" align="center" prop="totalAmount" min-width="90" />
      <el-table-column label="实收金额" align="center" prop="receiptAmount" min-width="90" />
      <el-table-column label="扣款状态" align="center" prop="status" min-width="90" class-name="padding-side-0">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.SIGNED_DEDUCT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="理论扣费时间" align="center" prop="settingDeductDate" :formatter="dateWithoutTimeFormat"
        min-width="110" />
      <el-table-column label="实际扣费时间" align="center" prop="gmtPayment" :formatter="timeWithoutSecondFormat"
        min-width="110" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions, handleRemoteCustomerOptions, customerTypeOption } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import { timeWithoutSecondFormat, dateWithoutTimeFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import * as DeptApi from '@/api/system/dept'
import { SignedDeductRecordApi, SignedDeductRecordVO } from '@/api/crm/order/signedDeduct'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 签约制订单扣费记录 列表 */
defineOptions({ name: 'OrderSignedDeduct' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 当前路由
const router = useRouter() // 路由
const loading = ref(true) // 列表的加载中
const list = ref<SignedDeductRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deductOrderNum: undefined,
  signedOrderId: undefined,
  tradeNo: undefined,
  totalAmount: undefined,
  receiptAmount: undefined,
  settingDeductDate: [],
  gmtPayment: [],
  status: undefined,
  mentorId: undefined,
  externalAgreementNo: undefined,
  agreementNo: undefined,
  // deptIds: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SignedDeductRecordApi.getSignedDeductRecordPage(queryParams)
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
  clearRouterQuery()
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SignedDeductRecordApi.exportSignedDeductRecord(queryParams)
    download.excel(data, '签约制订单扣费记录.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })

const customerOptions = ref()
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}


// 2.user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.dept
const deptList = ref<Tree[]>([]) // 树形结构

/* 打开学员详情抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 清除 router query */
const clearRouterQuery = async () => {
  if (route.query.signedOrderId) {
    await nextTick() // 等待当前任务队列完成
    await router.replace({
      path: route.path,
      query: {} // 清空 query
    })
  }
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  if (route.query.signedOrderId) {
    queryParams.signedOrderId = route.query.signedOrderId
    handleQuery()
  } else {
    getList()
  }
})

onBeforeUnmount(async () => {
  // 如果是在签约订单管理页面通过查看扣款记录跳转过来，则清空路由参数，避免下次进入页面时，仍然有路由参数导致查询条件有误
  clearRouterQuery()
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

.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      .cell {
        padding: 0;
      }
    }
  }
}
</style>
