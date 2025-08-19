<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1300">
    <div class="refund-amount">
      <el-card class="!bg-#f9f9f9" shadow="never">
        <div class="statistics text-center flex justify-around">
          <el-tooltip effect="light" content="点击复制" placement="right">
            <el-statistic title="应退总金额" :precision="2" :value="outputTotalRefund" class="hover:cursor-pointer"
              @click="handleTotalRefundCopy" />
          </el-tooltip>

          <el-statistic title="拟退总金额" :precision="2" :value="outputPlanRefund" />

          <el-statistic title="已退总金额" :precision="2" :value="outputRefundedAmount" />
        </div>
      </el-card>
    </div>
    <div class="payment-list">
      <h3 class="text-center color-#606266">当前订单支付记录</h3>
      <el-table v-loading="tableLoading" :data="list" stripe border class="data-table">
        <el-table-column label="支付单号" align="center" width="180" class-name="padding-side-0">
          <template #default="scope">
            <el-tooltip effect="light" content="点击复制" placement="top">
              <el-button link type="primary" @click="handleCopy">
                {{ scope.row.paymentOrderNum }}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" align="center" width="125" class-name="padding-side-0">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CRM_PAYMENT_LIST" :value="scope.row.paymentMethod" />
          </template>
        </el-table-column>
        <el-table-column label="支付状态" prop="paymentStatus" align="center" width="75" class-name="padding-side-0">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="scope.row.paymentStatus" />
          </template>
        </el-table-column>
        <el-table-column label="实收货币" prop="paymentCurrencyType" align="center" width="70" class-name="padding-side-0">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.ORDER_PAYMENT_CURRENCY" :value="scope.row.paymentCurrencyType" />
          </template>
        </el-table-column>
        <el-table-column label="实收人民币" prop="amount" align="center" width="100" :formatter="roundToTwoDecimals"
          class-name="padding-side-0">
          <template #default="scope">
            <el-tooltip effect="light" content="点击复制" placement="top">
              <el-button link type="primary" @click="handleCopy(scope.row.amount)">{{ roundToTwoDecimals(null, null,
                scope.row.amount) }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="实收货币金额" prop="actualAmount" align="center" width="110" :formatter="roundToTwoDecimals"
          class-name="padding-side-0" />
        <el-table-column label="实收货币商户" prop="paymentMerchantName" align="center" width="130"
          class-name="padding-side-0" />

        <el-table-column label="Responsible" align="center" prop="responsibleName" width="180"
          class-name="padding-side-0" />

        <el-table-column label="空中云汇Source Id" align="center" width="120">
          <template #default="{ row }">
            {{ handleAirWallExSourceId(row.paymentCallBackLog) }}
          </template>
        </el-table-column>

        <el-table-column label="支付时间" prop="paymentTime" align="center" :formatter="timeWithoutSecondFormat"
          width="110" />

        <el-table-column label="支付单ID" prop="id" align="center" width="120" />

        <el-table-column label="已退金额" prop="refundActualAmount" align="center" width="112" fixed="right"
          class-name="padding-side-0" />
        <!-- 订单支付状态为 pending 的时候，才显示审核按钮 -->
        <el-table-column v-if="allotRefunds?.length" label="分配退款金额" align="center" min-width="140" fixed="right">
          <template #default="scope">
            <el-input v-model="allotRefunds[scope.$index]" v-only-decimal :input-style="{ textAlign: 'center' }"
              :disabled="isDisabledAllotRefundsInput(scope.row)" @input="checkPlanRefund(scope)"
              @focus="showOperateStatus = false" />
          </template>
        </el-table-column>
        <!-- 退款是否操做成功，请求报错响应后显示 -->
        <el-table-column v-if="showOperateStatus" label="退款状态" align="center" width="60" fixed="right">
          <template #default="scope">
            <Icon :icon="scope.row.refundSuccess ? 'weui:done2-outlined' : 'weui:close2-outlined'"
              :color="scope.row.refundSuccess ? '#67C23A' : '#f00'" />
          </template>
        </el-table-column>
        <!-- 老系统订单手工退款按钮：老系统订单没有实收货币商户这个字段 -->
        <!-- https://zentao.52cebu.com/zentao/task-view-2106.html -->
        <el-table-column label="人工确认" align="center" width="90" fixed="right" class-name="padding-side-0">
          <template #default="scope">
            <!-- 显示： 老系统订单 || 退款失败 || 对公转账 -->
            <el-button v-if="shouldShowManualRefundButton(scope.row)" type="primary" plain size="small"
              :disabled="isDisabledManualRefundButton(scope.row)" @click="handleManualRefund(scope.row)">
              人工退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="errorMessage" class="error-tip">{{ errorMessage }}</div>
    </div>
    <template #footer>
      <el-button type="primary" :disabled="tableLoading" @click="submitForm">退 款</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getCurrentTime, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, roundToTwoDecimals } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import { isDecimal, isEmpty } from '@/utils/is'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'
import { RefundApi, RefundVO } from '@/api/crm/order/refund'
import { useTransition } from '@vueuse/core'

/** 退款表单 */
defineOptions({ name: 'RefundLogDialiog' })

/** 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('分配退款金额') // 弹窗的标题

/* statistic */
const statisticNums = ref({
  totalRefund: 0,
  planRefund: 0,
  refundedAmount: 0
})
// 应退总金额
const outputTotalRefund = useTransition(() => statisticNums.value.totalRefund || 0, {
  duration: 500
})
// 拟退总金额
const outputPlanRefund = useTransition(() => statisticNums.value.planRefund || 0, {
  duration: 500
})
// 已退总金额
const outputRefundedAmount = useTransition(() => statisticNums.value.refundedAmount || 0, {
  duration: 500
})

/** 列表 */
const tableLoading = ref(true) // 列表的加载中
const list = ref<RefundVO[]>([]) // 列表的数据
let allotRefunds = ref<string[]>([]) // 分配的退款金额数组

/** 查询列表 */
const getList = async (id: number) => {
  tableLoading.value = true
  try {
    const data = await PackageOrderApi.getPackageOrder(id)
    // 筛选出已付全款的 payment 数据
    list.value = data.payments.filter((item) => item.paymentStatus === 2)
  } catch (e) {
    console.log('order payment dialog getList error', e)
  } finally {
    tableLoading.value = false
  }
}

/** 弹窗 */
let refundRecordData = reactive({}) // 当前行的数据
const open = async (rowData) => {
  dialogVisible.value = true
  resetForm()
  refundRecordData = rowData
  await getList(rowData.orderId)
  allotRefunds.value = Array.from({ length: list.value.length }, () => null) // 根据payment数量初始化分配退款金额数组
  calculateStatistic()

  /* bug-1234: https://zentao.52cebu.com/zentao/bug-view-1234.html
    如果只有一个 payment 需要操作退款，直接将应退金额赋值给分配退款金额
  */
  if (list.value.length === 1) {
    allotRefunds.value[0] = statisticNums.value.totalRefund
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 处理空中云汇列表值  */
const handleAirWallExSourceId = (paymentCallBackLog) => {
  if (isEmpty(paymentCallBackLog)) {
    return '--'
  } else {
    return paymentCallBackLog.airWallExSourceId
  }
}

/** 计算 statistic 值 */
/* 应退总金额 */
const calculateStatistic = () => {
  // 解构当前退款记录数据
  const { refundAmount } = refundRecordData
  if (list.value.length) {
    // 赋值统计组件的应退总金额 = 退款金额
    statisticNums.value.totalRefund = refundAmount - statisticNums.value.refundedAmount
    // 统计已退金额
    // statisticNums.value.refundedAmount = actualRefundAmount
  } else {
    statisticNums.value.refundedAmount = 0
  }
}
/* 拟退总金额 */
watch(
  allotRefunds,
  (newValue) => {
    if (newValue.some((item) => item !== '')) {
      const numberList = newValue.map((item) => Number(item))
      // 计算拟退总金额
      statisticNums.value.planRefund = numberList.reduce(
        (acc, item) => Number(acc) + Number(item),
        0
      )
    } else {
      statisticNums.value.planRefund = 0
    }
  },
  { deep: true }
)

/** 校验拟退金额  */
const errorMessage = ref('')
const checkPlanRefund = (scope) => {
  // 校验拟退金额
  nextTick(() => {
    if (
      scope &&
      Number(allotRefunds.value[scope.$index]) > scope.row.amount - scope.row.refundActualAmount
    ) {
      // 防止分配金额大于实付货币金额-已退金额
      errorMessage.value = `第${scope.$index + 1}行分配退款金额超出剩余可退金额，请调整`
    } else if (statisticNums.value.planRefund !== statisticNums.value.totalRefund) {
      // 防止总分配超出可退金额
      errorMessage.value = '拟退款金额与应退金额有偏差'
    } else {
      errorMessage.value = ''
    }
  })
}

/** 校验每个分配退款金额是否超出应退金额 */
// const checkEveryPlanRefund = () => {
//   for (let i = 0; i < list.value.length; i++) {
//     if (Number(allotRefunds.value[i]) > list.value[i].amount - list.value[i].refundActualAmount) {
//       // 防止分配金额大于实付货币金额-已退金额
//       errorMessage.value = `第${i + 1}行分配退款金额超出剩余可退金额，请调整`
//       break
//     }
//   }
// }

/** 人工确认  */
const handleManualRefund = async (rowData) => {
  try {
    await message.confirm('确认已为支付单手工退款,现在分配其退款金额？')
    // 变更对应 hadManualRefund 值，用于放开分配退款金额 input 禁用状态 并且 禁用手工退款按钮
    list.value.forEach((item) => {
      if (item.id === rowData.id) {
        item.hadManualRefund = true
      }
    })
  } catch (e) {
    if (e === 'cancel') message.info(t('common.operateCancel'))
    else message.error(t('common.operateFail'))
  }
}

/** 判断是否显示人工退款按钮 */
const shouldShowManualRefundButton = (rowData) => {
  // 判断是否有剩余退款金额（实收人民币 ！= 实际退款金额）
  const hasRemainingRefund = rowData.amount !== rowData.refundActualAmount
  // 判断是否需要人工退款（老系统订单或对公转账或者退款失败）
  const needsManualRefund = rowData.isOldSysPayment || rowData.isTransferBank || rowData.refundSuccess === false

  return needsManualRefund && hasRemainingRefund
}

/** 禁用状态  */
/* 分配退款金额 input 禁用状态 */
const isDisabledAllotRefundsInput = (rowData) => {
  // 如果已经手动退款，则不禁用
  if (rowData.hadManualRefund) {
    return false
  }

  // 如果是老系统订单或对公转账，且未手动退款，则禁用
  if (rowData.isOldSysPayment || rowData.isTransferBank) {
    return true
  }

  // 如果退款失败且未手动退款，则禁用
  return rowData.refundSuccess === false
}

/* 人工确认 button 禁用状态 */
const isDisabledManualRefundButton = (rowData) => {
  // 如果已经手动退款，则禁用按钮
  if (rowData.hadManualRefund) return true
  else return false

  // 如果退款成功，则禁用按钮
  // if (rowData.refundSuccess === true) {
  //   return true
  // }
}

/** 提交表单 */
const response = ref(null) // 提交请求的返回值
const showOperateStatus = ref(false) // 是否显示分配退款金额后的状态, 用于展示分配退款金额失败的列表列
const emit = defineEmits(['allotSuccess']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await checkPlanRefund()
  // await checkEveryPlanRefund()

  if (!errorMessage.value) {
    // 提交请求
    tableLoading.value = true
    try {
      const { id, fapStatus, fapRemark } = refundRecordData
      const refundPaymentList = list.value.flatMap((item, index) => {
        // 已退金额 === 实际退款金额，则不再进行退款
        if (item.amount !== item.refundActualAmount && allotRefunds.value[index]) {
          return [
            {
              paymentId: item.id,
              refundAmount: allotRefunds.value[index],
              isManual: item.hadManualRefund ? true : false
            }
          ]
        } else {
          return []
        }
      })
      const data = {
        id,
        fapStatus,
        fapRemark,
        refundPaymentList
      }
      response.value = await RefundApi.updateRefundRecordFapStatus(data)

      // 全部成功 部分成功的情况处理
      if (!response.value.some((item) => item.refundSuccess === false)) {
        message.success('操作退款成功')
        emit('allotSuccess')
      } else {
        message.error('操作退款失败')
        // 将失败的退款标记为失败，成功的退款标记为成功
        if (!isEmpty(response.value)) {
          // 重新获取列表数据
          await getList(refundRecordData.orderId)

          // 改变退款成功状态
          response.value.forEach((resItem) => {
            list.value.map((listItem) => {
              if (resItem.paymentId === listItem.id) {
                listItem.refundSuccess = resItem.refundSuccess
              }
            })
          })
          // 重置退款金额
          allotRefunds.value = list.value.map((item) => null)

          // 重新统计应退总金额，用于继续发起失败的退款
          // 获取成功列表
          let successList = response.value.map((resItem) => {
            if (resItem.refundSuccess) {
              return Number(data.refundPaymentList.find((item) => item.paymentId === resItem.paymentId).refundAmount)
            } else {
              return 0
            }
          })
          // 重新计算已退/应退总金额: 原应退总金额 - 成功列表退款金额累加和
          statisticNums.value.refundedAmount = statisticNums.value.refundedAmount + successList.reduce((acc, cur) => acc + cur, 0)
          // 重新计算统计值
          calculateStatistic()
        }
        showOperateStatus.value = true
      }
    } catch (error) {
    } finally {
      tableLoading.value = false
    }
  } else {
    // 校验有错误
    return
  }
}

/* 应退总金额点击 */
const handleTotalRefundCopy = () => {
  const copyText = statisticNums.value.totalRefund
  handleCopy(copyText)
}

/** 重置表单 */
const resetForm = () => {
  // 重置统计值
  statisticNums.value = {
    totalRefund: 0,
    planRefund: 0,
    refundedAmount: 0
  }
  errorMessage.value = '' // 重置错误提示
  showOperateStatus.value = false // 重置分配退款金额后的状态
}
</script>

<style lang="scss" scoped>
.data-table {
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
}

.payment-list {

  /* 校验错误样式 */
  .error-tip {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #ff4d4f;
    font-size: 12px;
    line-height: 22px;
    margin-top: 8px;
  }
}
</style>
