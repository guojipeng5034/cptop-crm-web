<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-steps v-if="formType === 'update'" :active="activeStep" align-center class="mb-3">
      <el-step title="退款记录">
        <template #icon>
          <Icon icon="icon-park-outline:creation-date-sort" :size="30" />
        </template>
      </el-step>
      <el-step title="审核状态">
        <template #icon>
          <Icon icon="ant-design:audit-outlined" :size="30" />
        </template>
      </el-step>
      <el-step title="联系状态">
        <template #icon>
          <Icon icon="mingcute:service-line" :size="30" />
        </template>
      </el-step>
    </el-steps>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <div class="step0" v-show="activeStep === 0">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="学员" prop="customerId">
              <el-select v-model="formData.customerId" filterable disabled remote :loading="customerOptionsLoading"
                :remote-method="fetchRemoteCustomerOptions" placeholder="请选择学员">
                <el-option v-for="dict in customerOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="退款订单号" prop="refundOrderNumber">
              <el-input v-model="formData.refundOrderNumber" disabled placeholder="请输入要退款的订单号" />
            </el-form-item>

            <el-form-item label="退款原因" prop="refundType">
              <el-select v-model="formData.refundType" placeholder="请选择/检索退款原因" clearable filterable
                :disabled="disabledRefund">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="退款金额" prop="refundAmount">
              <template #default>
                <el-input v-model="formData.refundAmount" placeholder="请计算退款金额" disabled class="flex-1" />
                <el-button type="warning" plain @click="openColculateDialog" class="ml-1" :disabled="disabledRefund">
                  计算
                </el-button>
              </template>
            </el-form-item>

            <el-form-item label="提出退费时间" prop="refundDate" label-width="110">
              <el-date-picker v-model="formData.refundDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm" time-format="HH:mm" :disabled-date="disabledAfterDate" placeholder="选择提出退费的时间"
                :disabled="disabledRefund" class="!w-100%" />
            </el-form-item>

            <el-form-item label="学习总月数" prop="studyMonth" label-width="95">
              <el-input-number v-model="formData.studyMonth" :min="0" :step="1" step-strictly v-limit-input
                placeholder="学习总月数" :disabled="disabledRefund" class="!w-full" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="发票情况" prop="makeOutAnInvoiceStatus">
              <el-radio-group v-model="formData.makeOutAnInvoiceStatus" :disabled="disabledRefund">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.MAKE_OUT_AN_INVOICE_STATUS)" :key="dict.value">
                  <el-radio :label="dict.label" :value="dict.value" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="固定课情况" prop="cancelFixLessonOrderStatus" label-width="95">
              <el-radio-group v-model="formData.cancelFixLessonOrderStatus" :disabled="disabledRefund">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.CANCEL_FIX_LESSON_ORDER_STATUS)" :key="dict.value">
                  <el-radio :label="dict.label" :value="dict.value" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-form-item label="开户行" prop="bankName" label-width="95">
              <el-input v-model.trim="formData.bankName" placeholder="请输入银行卡开户行" clearable :disabled="disabledRefund" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="持卡人姓名" prop="customerName" label-width="95">
              <el-input v-model.trim="formData.customerName" placeholder="请输入持卡人姓名" clearable
                :disabled="disabledRefund" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="银行卡号" prop="customerBankCard" label-width="95">
              <el-input v-only-numbers v-model.trim="formData.customerBankCard" placeholder="请输入银行卡号" clearable
                :disabled="disabledRefund" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="退款原因" prop="refundReason">
              <el-input v-model="formData.refundReason" type="textarea" placeholder="请输入退款原因"
                :disabled="disabledRefund" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="step2" v-show="activeStep === 1">
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="formData.status" :disabled="disabledApprove">
            <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_APPROVE_STATUS)" :key="dict.value">
              <el-radio :label="dict.label" :value="dict.value" />
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="处理纪要" prop="approveRemark">
          <el-input v-model.trim="formData.approveRemark" type="textarea" placeholder="请输入处理纪要"
            :disabled="disabledApprove" />
        </el-form-item>
      </div>

      <div class="step1" v-show="activeStep === 2">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联系状态" prop="connectStatus">
              <el-select v-model="formData.connectStatus" placeholder="请选择联系状态" :disabled="disabledConnect">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONNECT_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系时间" prop="connectDate">
              <el-date-picker v-model="formData.connectDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm" time-format="HH:mm" :disabled-date="disabledAfterDate" placeholder="选择联系时间"
                :disabled="disabledConnect" class="!w-100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="联系纪要" prop="connectRemark">
              <el-input v-model="formData.connectRemark" type="textarea" placeholder="请输入联系纪要"
                :disabled="disabledConnect" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <ColculateDialog ref="colculateDialogRef" @success="handleColculateSuccess" />
    </el-form>

    <div class="step-btn text-center" v-if="formType === 'update'">
      <el-button @click="toLastStep" type="primary" size="small" plain
        :disabled="formLoading || (activeStep < 1 && formType === 'update')">查看上一步</el-button>
      <el-button @click="toNextStep" type="primary" size="small" plain
        :disabled="formLoading || (activeStep > 2 && formType === 'update')">查看下一步</el-button>
    </div>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteCustomerOptions } from '@/utils/dict'
import { getCurrentTime, disabledAfterDate } from '@/utils/formatTime'
import ColculateDialog from './ColculateDialog.vue'
import { RefundApi, RefundVO } from '@/api/crm/finance/refund'

/** 退款记录管理 表单 */
defineOptions({ name: 'RefundForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const router = useRouter()

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  /* step 0 */
  customerId: undefined,
  refundDate: undefined,
  refundAmount: undefined,
  refundOrderId: undefined,
  refundType: undefined,
  studyMonth: undefined,
  refundReason: undefined,
  cancelFixLessonOrderStatus: undefined,
  makeOutAnInvoiceStatus: undefined,
  refundOrderNumber: undefined, // 仅作展示
  bankName: undefined,
  customerBankCard: undefined,
  customerName: undefined,

  // 计算
  packageType: undefined,
  paymentAmount: undefined,
  handlingFee: undefined,
  thisMonthPrice: undefined,
  refundMonth: undefined,
  presentBookName: undefined,
  presentPoint: undefined,
  presentTicket: undefined,
  presentAmount: undefined
})
const refundReasonValidator = (rule, value, callback) => {
  if (!value || !value.trim()) {
    return callback(new Error('退款原因为必填项'))
  }
  callback()
}
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  refundAmount: [{ required: true, message: '请对退款金额进行计算', trigger: 'blur' }],
  refundType: [{ required: true, message: '退款原因为必选项', trigger: 'change' }],
  studyMonth: [{ required: true, message: '学习总月数为必填项', trigger: 'blur' }],
  refundDate: [{ required: true, message: '提出退费时间为必选项', trigger: 'change' }],
  makeOutAnInvoiceStatus: [{ required: true, message: '发票情况为必选项', trigger: 'change' }],
  cancelFixLessonOrderStatus: [
    { required: true, message: '固定课情况为必选项', trigger: 'change' }
  ],
  refundReason: [
    { required: true, message: '退款原因为必填项', trigger: 'blur' },
    { validator: refundReasonValidator, trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/* options */
/* 1.customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* step */
const activeStep = ref(0)
const toLastStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}
const toNextStep = () => {
  if (activeStep.value < 2) {
    activeStep.value++
  }
}

/** 表单弹窗 */
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const open = async (type: string, rowData) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '退款记录'
  formType.value = type
  resetForm()
  formLoading.value = true
  await fetchRemoteCustomerOptions(rowData.customerId)
  await handleRowData(rowData)
  formLoading.value = false
  // 修改时，设置数据
  if (rowData.id && type === 'update') {
    if (rowData.status === 1 || !rowData.status) {
      activeStep.value = 1
    } else if (rowData.connectStatus !== 3 && rowData.status === 2) {
      activeStep.value = 2
    }
    formLoading.value = true
    try {
      formData.value = await RefundApi.getRefundRecord(rowData.id)
      formData.value.approverDate = getCurrentTime()

      // 处理禁用状态
      if (formData.value.status === 2) {
        disabledApprove.value = true
        disabledConnect.value = false
        formData.value.connectDate = getCurrentTime()
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 处理订单行数据：获取订单中相关信息
const handleRowData = (rowData) => {
  formData.value.customerId = rowData.customerId
  formData.value.refundOrderId = rowData.id
  formData.value.refundOrderNumber = rowData.orderNum
  formData.value.refundDate = getCurrentTime()
  formData.value.paymentAmount = rowData.actualAmount
  formData.value.handlingFee = 0
  formData.value.presentBookName = rowData.awardBookType
  formData.value.presentPoint = rowData.awardPointsNum
  formData.value.presentTicket = rowData.awardTicketNum

  // 重置 colculateDialog 数据
  formData.value.packageType = undefined
  formData.value.thisMonthPrice = undefined
  formData.value.refundMonth = undefined
  formData.value.refundAmount = undefined
}

/* 计算弹窗 */
const colculateDialogRef = ref()
const colculateData = ref({})
const openColculateDialog = () => {
  colculateData.value = {
    packageType: formData.value.packageType,
    paymentAmount: formData.value.paymentAmount,
    handlingFee: formData.value.handlingFee,
    thisMonthPrice: formData.value.thisMonthPrice,
    refundMonth: formData.value.refundMonth,
    presentBookName: formData.value.presentBookName,
    presentPoint: formData.value.presentPoint,
    presentTicket: formData.value.presentTicket,
    presentAmount: formData.value.presentAmount
  }
  colculateDialogRef.value.open(colculateData.value)
}
const handleColculateSuccess = (resultData) => {
  for (const key in resultData) {
    if (formData.value.hasOwnProperty(key)) {
      formData.value[key] = resultData[key]
    }
  }
}

/* 禁用状态 */
// 退款记录禁用
const disabledRefund = computed(() => {
  return formType.value === 'update'
})
// 审核状态禁用
const disabledApprove = ref(false)
// 联系状态禁用
const disabledConnect = ref(true)

/* watcher */
watch(
  () => activeStep.value,
  (currentStep, lastStep) => {
    if (currentStep === 2 && !disabledConnect.value) {
      formData.value.connectDate = getCurrentTime()
    }
  },
  { immediate: true }
)

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    let data = formData.value as unknown as RefundVO
    if (formType.value === 'create') {
      await RefundApi.createRefundRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      if (activeStep.value === 1) {
        const { id, approveRemark, status } = data
        const approveData = { id, approveRemark, status }
        await RefundApi.updateRefundRecordApproveStatus(approveData)
        message.success(t('common.updateSuccess'))
      } else if (activeStep.value === 2) {
        const { id, connectStatus, connectRemark, connectDate } = data
        const connectData = { id, connectStatus, connectRemark, connectDate }
        await RefundApi.updateRefundRecordConnectStatus(connectData)
        message.success(t('common.updateSuccess'))
      }
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')

    // 跳转至退款记录
    if (formType.value === 'create') {
      const res = await message.confirm('需要查看刚刚创建的退款记录吗？')
      await router.push({
        name: 'RefundRecord',
        query: { refundOrderId: formData.value.refundOrderId }
      })
    }
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  disabledConnect.value = true
  disabledApprove.value = false
}
</script>

<style lang="scss" scoped>
:deep(.present-label) {
  font-weight: normal;
}

:deep(.keep) {
  word-break: keep-all;
}
</style>
