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
          <el-form-item label="套餐" prop="packageName" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packageId" placeholder="请选择套餐" clearable class="!w-240px">
              <el-option v-for="dict in signPackageOption" :key="dict.value" :label="dict.label" :value="dict.value" />
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
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="签约订单类型" prop="orderType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.orderType" placeholder="请选择签约订单类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SIGN_ORDER_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="协议当前状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择协议当前状态" clearable class="!w-240px">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SIGNED_ORDER_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="解约类型" prop="revokedType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.revokedType" placeholder="请选择解约类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REVOKED_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="签约时间" prop="signTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.signTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="协议生效时间" prop="validTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.validTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="协议失效时间" prop="invalidTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.invalidTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="执行时间" prop="executeTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.executeTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="下次执行时间" prop="nextExecuteTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.nextExecuteTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="解约时间" prop="revokedTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.revokedTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
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
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:signed-order:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:signed-order:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:signed-order:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading" class="!w-80px"
          v-hasPermi="['crm:signed-order:export']">
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
      <el-table-column label="套餐" align="center" prop="packageName" min-width="180" />
      <el-table-column label="协议当前状态" align="center" prop="status" width="120" class-name="padding-side-0">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.SIGNED_ORDER_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="amount" />

      <el-table-column label="签约详情" align="center" prop="agreementUrl" width="100">
        <template #default="scope">
          <el-button text type="primary" @click="openForm('view', scope.row.id)"
            :disabled="scope.row.status !== getValueByLabel('未签约', getStrDictOptions(DICT_TYPE.SIGNED_ORDER_STATUS))">查看</el-button>
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

      <el-table-column label="协议时间" align="center" width="180">
        <template #default="scope">
          <div class="flex justify-start">
            <el-tag type="success" class="mr-1">生效时间</el-tag>
            <el-text type="success">{{
              formatDate(scope.row.validTime, 'YYYY-MM-DD HH:mm')
            }}</el-text>
          </div>
          <div class="mt-1 flex justify-start">
            <el-tag type="info" class="mr-1">失效时间</el-tag>
            <el-text type="info">{{
              formatDate(scope.row.invalidTime, 'YYYY-MM-DD HH:mm')
            }}</el-text>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="支付宝" align="center" width="220">
        <template #default="scope">
          <div class="flex justify-start">
            <el-tag type="success" class="mr-1">用户号</el-tag>
            <span>{{ scope.row.alipayUserId }}</span>
          </div>
          <div class="mt-1 flex justify-start">
            <el-tag type="primary" class="mr-1">账号</el-tag>
            <span>{{ scope.row.externalLogonId }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="签约订单类型" align="center" prop="orderType" width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.SIGN_ORDER_TYPE" :value="scope.row.orderType" />
        </template>
      </el-table-column>

      <el-table-column label="签约时间" align="center" prop="signTime" :formatter="timeWithoutSecondFormat" width="110" />

      <el-table-column label="执行时间" align="center" prop="executeTime" :formatter="dateWithoutTimeFormat" width="110" />
      <el-table-column label="下次执行时间" align="center" prop="nextExecuteTime" :formatter="dateWithoutTimeFormat"
        width="110" />

      <el-table-column label="解约时间" align="center" prop="revokedTime" :formatter="timeWithoutSecondFormat"
        width="110" />
      <el-table-column label="解约类型" align="center" prop="revokedType" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.REVOKED_TYPE" :value="scope.row.revokedType" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" min-width="110">
        <template #default="scope">
          <el-button link type="success" @click="toDeductList(scope.row.id)">扣费记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 签约制订单 表单 -->
  <SignedOrderForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />

</template>

<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE,
  getIntDictOptions,
  getStrDictOptions,
  getLabelByValue,
  getValueByLabel,
  customerTypeOption,
  handleRemoteCustomerOptions,
  handleRemoteUserOptions,
  getPackagesOptions
} from '@/utils/dict'
import { formatDate, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, dateWithoutTimeFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { SignedOrderApi, SignedOrderVO } from '@/api/crm/order/signed'
import SignedOrderForm from './SignedOrderForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 签约制订单管理 列表 */
defineOptions({ name: 'SignedOrder' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const list = ref<SignedOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  packageId: undefined,
  externalAgreementNo: undefined,
  amount: undefined,
  validTime: [],
  agreementNo: undefined,
  invalidTime: [],
  signTime: [],
  alipayUserId: undefined,
  status: undefined,
  externalLogonId: undefined,
  agreementUrl: undefined,
  executeTime: [],
  nextExecuteTime: [],
  orderType: undefined,
  revokedTime: [],
  revokedType: undefined,
  mentorId: undefined,
})

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

// 3.sign package
const signPackageOption = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SignedOrderApi.getSignedOrderPage(queryParams)
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

/* 打开学员详情抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}


/* 查看扣费记录列表 */
const toDeductList = async (signedOrderId) => {
  try {
    await router.push({
      name: 'OrderSignedDeduct',
      query: { signedOrderId }
    })
  } catch (error) {
    console.error('Error in toDeductList:', error)
    // 刷新页面
    await location.reload()
  } finally {
    // 再次尝试路由跳转，确保逻辑完整
    router.push({
      name: 'OrderSignedDeduct',
      query: { signedOrderId }
    })
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SignedOrderApi.exportSignedOrder(queryParams)
    download.excel(data, '签约制订单管理.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  signPackageOption.value = await getPackagesOptions('sign')
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
