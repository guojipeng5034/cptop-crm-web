<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="120">
      <el-row>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付ID" prop="paymentId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.paymentId" placeholder="请输入支付ID" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="UnivapayCharge" prop="univapayChargeId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.univapayChargeId" placeholder="请输入univapaycharge ID" clearable
              class="!w-320px" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="Univapay商店" prop="univapayStoreId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.univapayStoreId" placeholder="请输入univapay的商店ID" clearable class="!w-320px" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="StripePayment" prop="stripePaymentId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.stripePaymentId" placeholder="请输入stripe的payment ID" clearable
              class="!w-320px" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="空中云汇Source" prop="airwallexSourceId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.airwallexSourceId" placeholder="请输入空中云汇的sourceID" clearable
              class="!w-320px" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <el-form-item label="响应码" prop="responseCode" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.responseCode" placeholder="请输入响应码" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button v-hasPermi="['crm:order:callback:query']" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button v-hasPermi="['crm:order:callback:query']" @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:order:callback:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="支付ID" align="center" prop="paymentId" min-width="100" />
      <el-table-column label="IDs" prop="airwallexSourceId" min-width="200">
        <template #default="scope">
          <div class="mb-2" v-show="scope.row.univapayChargeId">
            <el-tag type="primary" class="w-30 m-r-3">Univapay Charge</el-tag>
            <el-button link type="primary" @click="handleCopy">{{ scope.row.univapayChargeId }}</el-button>
          </div>
          <div class="mb-2" v-show="scope.row.univapayStoreId">
            <el-tag type="success" class="w-30 m-r-3">Univapay 商店</el-tag>
            <el-button link type="success" @click="handleCopy">{{ scope.row.univapayStoreId }}</el-button>
          </div>
          <div class="mb-2" v-show="scope.row.stripePaymentId">
            <el-tag type="warning" class="w-30 m-r-3">Stripe Payment</el-tag>
            <el-button link type="warning" @click="handleCopy">{{ scope.row.stripePaymentId }}</el-button>
          </div>
          <div class="mb-2" v-show="scope.row.airwallexSourceId">
            <el-tag type="danger" class="w-30 m-r-3">空中云汇 Source</el-tag>
            <el-button link type="danger" @click="handleCopy">{{ scope.row.airwallexSourceId }}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="isRefund" min-width="100">
        <template #default="{ row }">
          {{ row.isRefund ? '退款' : '回调' }}
        </template>
      </el-table-column>
      <el-table-column label="退款单号" align="center" prop="refundNumber" min-width="100" />
      <el-table-column label="响应码" align="center" prop="responseCode" min-width="100" />
      <el-table-column label="响应内容" align="center" min-width="100">
        <template #default="scope">
          <el-button link plain type="primary" :disabled="!scope.row.responseBody"
            @click="checkResponseBody(scope.row.responseBody)">
            查看
          </el-button>
          <el-button link plain type="success" :disabled="!scope.row.responseBody"
            @click="handleCopy(scope.row.responseBody)">
            复制
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="120" />
      <el-table-column label="操作" align="center" min-width="100">
        <template #default="{ row }">
          <el-button link plain type="primary" v-if="row.showPayMenuFlag" @click="recall(row)">
            回调
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 响应内容 弹窗 -->
  <ResponseBodyDialog ref="responseBodyDialogRef" />
</template>

<script setup lang="ts">
import { dateFormatterYMDHm } from '@/utils/formatTime'
import download from '@/utils/download'
import { handleCopy } from '@/utils/common'
import { PaymentCallbackLogApi, PaymentCallbackLogVO } from '@/api/crm/order/callback'
import ResponseBodyDialog from './ResponseBodyDialog.vue'

/** 回调日志 列表 */
defineOptions({ name: 'Callback' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<PaymentCallbackLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  paymentId: undefined,
  univapayChargeId: undefined,
  univapayStoreId: undefined,
  stripePaymentId: undefined,
  airwallexSourceId: undefined,
  responseCode: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 响应内容弹窗 */
const responseBodyDialogRef = ref()
const checkResponseBody = (responseBody: string) => {
  responseBodyDialogRef.value.open(responseBody)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PaymentCallbackLogApi.getPaymentCallbackLogPage(queryParams)
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PaymentCallbackLogApi.exportPaymentCallbackLog(queryParams)
    download.excel(data, '回调日志.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 二次回调 */
const recall = async (row) => {
  loading.value = true
  try {
    const { paymentId, isRefund, refundNumber } = row
    if (isRefund) {
      await PaymentCallbackLogApi.paymentRecallRefund(paymentId, isRefund, refundNumber)
    } else {
      await PaymentCallbackLogApi.paymentRecall(paymentId)
    }
    message.success('回调成功')
  } catch {
    message.error('回调失败')
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.search-form) {
  .el-form-item {
    margin-right: 20px;
  }

  /* 控制 search form label 分散对齐 */
  .el-form-item__label {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}

:deep(.el-table__header-wrapper) {
  .cell {
    text-align: center;
  }
}
</style>