<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="签约订单ID" prop="signedOrderId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.signedOrderId" placeholder="请输入签约订单ID" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="扣费订单ID" prop="deductOrderId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.deductOrderId" placeholder="请输入扣费订单ID" clearable class="!w-240px" />
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
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实际扣费时间" prop="gmtPayment" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.gmtPayment" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
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
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="扣费订单ID" align="center" prop="deductOrderId" />
      <el-table-column label="签约订单ID" align="center" prop="signedOrderId" />
      <el-table-column label="交易号" align="center" prop="tradeNo" />
      <el-table-column label="交易金额" align="center" prop="totalAmount" />
      <el-table-column label="实收金额" align="center" prop="receiptAmount" />
      <el-table-column label="扣款状态" align="center" prop="status">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.SIGNED_DEDUCT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="理论扣费时间" align="center" prop="settingDeductDate" />
      <el-table-column label="实际扣费时间" align="center" prop="gmtPayment" :formatter="dateFormatterYMDHms" width="180" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { SignedDeductRecordApi, SignedDeductRecordVO } from '@/api/crm/finance/signedDeduct'

/** 签约制订单扣费记录 列表 */
defineOptions({ name: 'SignedDeduct' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<SignedDeductRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deductOrderId: undefined,
  signedOrderId: undefined,
  tradeNo: undefined,
  totalAmount: undefined,
  receiptAmount: undefined,
  settingDeductDate: [],
  gmtPayment: undefined,
  gmtPayment: [],
  status: undefined,
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

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}
</style>