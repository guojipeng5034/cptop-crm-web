<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1360">
    <div class="refund-amount">
      <el-card class="!bg-#f9f9f9" shadow="never">
        <div class="statistics text-center flex justify-around">
          <el-statistic title="订单原价" :value="outputTotalAmount" />
          <el-statistic title="优惠金额" :value="outputDiscountAmount" />
          <el-statistic title="应付总金额" :value="outputPayableAmount" />
          <el-statistic title="已支付金额" :value="outputActualAmount" />
          <el-statistic title="已退金额" :value="outputRefundAmount" />
        </div>
      </el-card>
    </div>
    <div class="refund-log-list">
      <div class="text-center position-relative">
        <h3 class="color-#606266">当前订单退款记录</h3>
        <el-button v-if="showRefundBtn(currentRow)" type="primary" plain class="position-absolute top--1.5 right-0"
          :disabled="tableLoading" @click="openRefundForm">申请退款</el-button>
      </div>
      <el-table v-loading="tableLoading" :data="list" stripe border class="data-table">
        <el-table-column label="学员信息" align="center" fixed min-width="140">
          <template #default="scope">
            <div> {{ scope.row.studentName }} </div>
            <div>
              <span v-if="scope.row.customerId" class="!font-size-3">学号: </span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                  {{ scope.row.customerId }}
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态概览" align="center">
          <el-table-column label="记录状态" align="center" prop="invalid" min-width="100">
            <template #default="scope">
              <arco-tag size="small" :type="DICT_TYPE.COMMON_INVALIDE_STATUS" :value="scope.row.invalid" />
            </template>
          </el-table-column>
          <el-table-column label="联系状态" align="center" prop="connectStatus" min-width="100">
            <template #default="scope">
              <arco-tag v-if="showConnectInfo(scope.row)" :type="DICT_TYPE.CONNECT_STATUS"
                :value="scope.row.connectStatus" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" prop="status" min-width="100">
            <template #default="scope">
              <arco-tag v-if="showApproveInfo(scope.row)" :type="DICT_TYPE.REFUND_APPROVE_STATUS"
                :value="scope.row.status" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="退款状态" align="center" prop="refundStatus" min-width="100">
            <template #default="scope">
              <arco-tag v-if="!scope.row.invalid" :type="DICT_TYPE.REFUND_STATUS" :value="scope.row.refundStatus" />
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="退费信息" align="center">
          <!-- <el-table-column label="退费订单号" align="center" width="200">
            <template #default="scope">
              <div class="orderId">
                <el-tooltip
                  v-if="scope.row.orderId"
                  effect="light"
                  content="点击复制"
                  placement="top"
                >
                  <el-button link type="primary" @click="handleCopy">
                    {{ scope.row.orderNum }}
                  </el-button>
                </el-tooltip>
                <el-text type="info" v-else>--</el-text>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="退款原因" align="center" prop="refundType" min-width="130">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.REFUND_TYPE" :value="scope.row.refundType" />
            </template>
          </el-table-column>
          <el-table-column label="订单类型" align="center" prop="orderType" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.REFUND_ORDER_TYPE" :value="scope.row.orderType" />
            </template>
          </el-table-column>
          <el-table-column label="套餐类型" align="center" prop="packageType" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.REFUND_PACKAGES_TYPE" :value="scope.row.packageType" />
            </template>
          </el-table-column>
          <el-table-column label="退款金额" align="center" prop="refundAmount" min-width="100" />
          <el-table-column label="固定课及固定订单" align="center" prop="cancelFixLessonOrderStatus" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CANCEL_FIX_LESSON_ORDER_STATUS"
                :value="scope.row.cancelFixLessonOrderStatus" />
            </template>
          </el-table-column>
          <el-table-column label="当时开具发票情况" align="center" prop="makeOutAnInvoiceStatus" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.MAKE_OUT_AN_INVOICE_STATUS" :value="scope.row.makeOutAnInvoiceStatus" />
            </template>
          </el-table-column>
          <el-table-column label="订单所属部门" align="center" prop="deptName" min-width="120" />
        </el-table-column>

        <el-table-column label="金额记录信息" align="center">
          <el-table-column label="学习月数" align="center" prop="studyMonth" min-width="110" />
          <el-table-column label="当时支付金额" align="center" prop="paymentAmount" min-width="110" />
          <el-table-column label="当月套餐价格" align="center" prop="thisMonthPrice" min-width="110" />
          <el-table-column label="退款月数" align="center" prop="refundMonth" min-width="110" />
          <el-table-column label="赠品折算价格" align="center" prop="presentAmount" min-width="110" />
          <!-- <el-table-column
            label="剩余金额"
            align="center"
            prop="surplusAmount"
            width="70"
          /> -->
        </el-table-column>
      </el-table>
    </div>
    <RefundForm ref="refoundFormRef" @success="getList" @close-refund-log="dialogVisible = false" />

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CONNECT_STATUS, REFUND_APPROVE_STATUS, REFUND_STATUS } from '@/utils/constants'
import { handleCopy } from '@/utils/common'
import { isEmpty } from '@/utils/is'
import { RefundApi, RefundVO } from '@/api/crm/order/refund'
import { RecordApi } from '@/api/crm/package/record'
import { useTransition } from '@vueuse/core'
import RefundForm from '@/views/crm/order/refund/RefundForm.vue'
import { ORDER_REFUND_STATUS } from '@/utils/constants'

/** 退款表单 */
defineOptions({ name: 'RefundLogDialiog' })

/** 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('该订单退款信息') // 弹窗的标题
const tableLoading = ref(true) // 列表的加载中
const list = ref<RefundVO[]>([]) // 列表的数据
let currentRow = reactive({
  id: undefined,
  customerId: undefined,
  packagesType: undefined,
  refundableAmount: 0,
  totalAmount: 0,
  discountAmount: 0,
  payableAmount: 0,
  actualAmount: 0,
})

/* statistic */
const statisticNums = ref({
  totalAmount: 0, // 订单原价
  discountAmount: 0, // 优惠金额
  payableAmount: 0, // 应付总金额
  actualAmount: 0, // 已支付金额
  refundAmount: 0 // 已退金额
})
// 订单原价
const outputTotalAmount = useTransition(() => statisticNums.value.totalAmount || 0, {
  duration: 500
})
// 优惠金额
const outputDiscountAmount = useTransition(() => statisticNums.value.discountAmount || 0, {
  duration: 500
})
// 应付金额
const outputPayableAmount = useTransition(() => statisticNums.value.payableAmount || 0, {
  duration: 500
})
// 已付金额
const outputActualAmount = useTransition(() => statisticNums.value.actualAmount || 0, {
  duration: 500
})
// 已退金额
const outputRefundAmount = useTransition(() => statisticNums.value.refundAmount || 0, {
  duration: 500
})

/* 请求参数 */
let queryParams = reactive({
  pageNo: 1,
  pageSize: 100,
  refundOrderId: undefined,
  orderId: undefined,
})

/** 查询列表 */
const getList = async () => {
  tableLoading.value = true
  try {
    const data = await RefundApi.getRefundRecordPage(queryParams)
    list.value = isEmpty(data.pageData) ? [] : data.pageData.list
  } catch (e) {
    console.log('refundlog getList error', e)
  } finally {
    tableLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm(row)
  await getList()
  calculateStatistic()
}

/** 退款弹窗表单  */
const refoundFormRef = ref()
const openRefundForm = async () => {
  // 检查是否存在进行中的退款申请
  const hasActiveRefund = list.value.some(
    item => item.refundStatus === REFUND_STATUS.UNREFUND && !item.invalid
  )

  if (hasActiveRefund) {
    message.notify({
      type: 'info',
      message: '该订单已存在正在进行中的退款申请，请在该申请结束后再操作'
    })
    return
  }
  // 设置可退款金额
  currentRow.refundableAmount = statisticNums.value.refundAmount
  if (currentRow.packagesType === 4) {
    const executeStatus = await RecordApi.getExecuteStatusByCustomer(currentRow.customerId)
    // 已添加追加课时包课时点的套餐订单执行状态为交付中
    if (executeStatus) {
      await ElMessageBox.confirm(
        '追加课时包原则上是不允许退款的，您确认要进行退款操作吗？',
        '重要提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).catch(async () => {
        dialogVisible.value = false
        return
      })
    }
  }
  // 打开退款弹窗
  refoundFormRef.value.open('create', currentRow)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 计算 statistic 值 */
const REFUND_STATUS_REFUNDED = 1 // 已退款
const calculateStatistic = () => {
  // 解构当前订单数据
  const { totalAmount, discountAmount, payableAmount, actualAmount } = currentRow
  // 过滤当前订单退款记录已退款的记录
  const refundedLog = list.value.filter((item) => item.refundStatus === REFUND_STATUS_REFUNDED)
  // 统计已退金额
  const refundAmount = refundedLog.reduce((acc, item) => acc + item.refundAmount, 0)
  // 赋值统计组件绑定数值
  statisticNums.value = {
    totalAmount,
    discountAmount,
    payableAmount,
    actualAmount,
    refundAmount
  }
}

/* 联系相关显示 */
// 联系状态信息：申请记录状态‘无效’ ||（申请记录状态‘有效’ && 联系状态 === ‘沟通完成’）显示‘联系状态’信息
const showConnectInfo = (row) => {
  return !row.invalid || (row.invalid && row.connectStatus === CONNECT_STATUS.COMPLETE)
}
/* 审批相关显示 */
// 审批状态信息: 申请记录状态‘无效’ ||（申请记录状态‘有效’ && 审核状态 ！== ‘等待审核’）显示‘审核状态’信息
const showApproveInfo = (row) => {
  return !row.invalid || (row.invalid && row.status !== REFUND_APPROVE_STATUS.WAITING)
}

// 退费按钮
const showRefundBtn = (row) => {
  if (isEmpty(row)) return false
  return row.orderRefundStatus !== ORDER_REFUND_STATUS.ALL_REFUND
}

/** 重置表单 */
const resetForm = (row) => {
  currentRow = row
  // 重置查询参数
  queryParams = {
    pageNo: 1,
    pageSize: 100,
    refundOrderId: undefined,
    orderId: row.id
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper) {
  .padding-side-0 {
    th.el-table__cell {
      padding: 0;
    }

    td.el-table__cell {
      padding: 0;
    }

    .cell {
      padding: 0;
      /* line-height: 20px; */
    }
  }
}
</style>
