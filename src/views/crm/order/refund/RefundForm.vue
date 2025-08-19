<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-steps v-if="formType === 'update'" :active="activeStep" align-center class="mb-3" finish-status="wait"
      process-status="finish">
      <el-step title="退款记录">
        <template #icon>
          <Icon icon="icon-park-outline:creation-date-sort" :size="30" />
        </template>
      </el-step>

      <el-step title="联系状态">
        <template #icon>
          <Icon icon="mingcute:service-line" :size="30" />
        </template>
      </el-step>

      <el-step title="审核状态">
        <template #icon>
          <Icon icon="ant-design:audit-outlined" :size="30" />
        </template>
      </el-step>

      <el-step title="退款审核">
        <template #icon>
          <Icon icon="icon-park-outline:paper-money" :size="30" />
        </template>
      </el-step>
    </el-steps>

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <div class="step0" v-if="activeStep === 0">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="学员" prop="customerId">
              <el-select v-model="formData.customerId" filterable disabled remote :loading="customerOptionsLoading"
                :remote-method="fetchRemoteCustomerOptions" placeholder="请选择学员">
                <el-option v-for="dict in customerOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="退款订单号" prop="orderNumber">
              <el-input v-model="formData.orderNumber" disabled placeholder="请输入要退款的订单号" />
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
              <el-date-picker v-model="formData.refundDate" type="datetime" value-format="x" format="YYYY-MM-DD HH:mm"
                time-format="HH:mm" :disabled-date="disabledAfterDate" placeholder="选择提出退费的时间"
                :disabled="disabledRefund" class="!w-100%" />
            </el-form-item>

            <el-form-item label="学习月数" prop="studyMonth" label-width="95">
              <el-input-number v-model="formData.studyMonth" :min="0" :step="1" step-strictly v-limit-input
                placeholder="学习月数" :disabled="disabledRefund" class="!w-full" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="当时开具发票情况" prop="makeOutAnInvoiceStatus" label-width="140">
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

      <div class="step1" v-if="activeStep === 1">
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
              <el-date-picker v-model="formData.connectDate" type="datetime" value-format="x" format="YYYY-MM-DD HH:mm"
                time-format="HH:mm" :disabled-date="disabledAfterDate" placeholder="选择联系时间" :disabled="disabledConnect"
                class="!w-100%" />
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

      <div class="step2" v-if="activeStep === 2">
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="formData.status" :disabled="disabledApprove">
            <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_APPROVE_STATUS)" :key="dict.value">
              <el-radio :label="dict.label" :value="dict.value" />
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否解约学员当前套餐/次卡" prop="revokePackage" label-width="auto">
          <el-radio-group v-model="formData.revokePackage" :disabled="disabledApprove" class="ml-2">
            <template v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value">
              <el-radio :label="dict.label" :value="dict.value" />
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否变更学员状态为无效" prop="studyStatusToInvalid" label-width="auto">
          <el-radio-group v-model="formData.studyStatusToInvalid" :disabled="disabledApprove" class="ml-2">
            <template v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value">
              <el-radio :label="dict.label" :value="dict.value" />
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理纪要" prop="approveRemark">
          <el-input v-model.trim="formData.approveRemark" type="textarea" placeholder="请输入处理纪要"
            :disabled="disabledApprove" />
        </el-form-item>
      </div>

      <div class="step3" v-if="activeStep === 3">
        <el-form-item label="退款状态" prop="fapStatus">
          <el-radio-group v-model="formData.fapStatus" :disabled="disabledFinance">
            <template v-for="dict in refundStatusOptions" :key="dict.value">
              <el-radio :label="dict.label" :value="dict.value" />
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="处理纪要" prop="fapRemark">
          <el-input v-model.trim="formData.fapRemark" type="textarea" placeholder="请输入处理纪要"
            :disabled="disabledFinance" />
        </el-form-item>
      </div>

      <ColculateDialog ref="colculateDialogRef" @success="handleColculateSuccess" />
      <!-- 操作退款弹窗 -->
      <OrderPaymentDialog ref="orderPaymentRef" @allot-success="handleAllotSuccess" />
    </el-form>

    <div class="step-btn text-center" v-if="formType === 'update'">
      <el-button @click="toLastStep" type="primary" size="small" plain
        :disabled="formLoading || (activeStep < 1 && formType === 'update')">查看上一步</el-button>
      <el-button @click="toNextStep" type="primary" size="small" plain
        :disabled="formLoading || (activeStep > 2 && formType === 'update')">查看下一步</el-button>
    </div>

    <template #footer>
      <el-button v-if="activeStep !== 3 || formData.fapStatus !== REFUND_STATUS.AGREE" @click="submitForm"
        type="primary" :disabled="disabledSubmitBtn">提 交</el-button>
      <el-button v-else-if="activeStep === 3" @click="allotRefundAmount" type="primary">分配退款金额</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  getIntDictOptions,
  getStrDictOptions,
  getBoolDictOptions,
  DICT_TYPE,
  handleRemoteCustomerOptions
} from '@/utils/dict'
import { getCurrentTime, disabledAfterDate } from '@/utils/formatTime'
import ColculateDialog from './ColculateDialog.vue'
import OrderPaymentDialog from './OrderPaymentDialog.vue'
import { RefundApi, RefundVO } from '@/api/crm/order/refund'

/** 退款记录管理 表单 */
defineOptions({ name: 'RefundForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const router = useRouter()

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* 常量订单 */
// 联系状态
const CONNECT_STATUS = {
  WAITING: 1, // 等待沟通
  COMPLETE: 3 // 沟通完成
}
// 审核状态
const REFUND_APPROVE_STATUS = {
  WAITING: 0, // 等待审核
  APPROVED: 1, // 审核通过
  REJECTED: 2 // 审核拒绝
}
// 退款状态
const REFUND_STATUS = {
  AGREE: 1, // 同意退款
  REJECTED: 3 // 拒绝退款
}

/* 表单数据 */
const formData = ref({
  customerId: undefined,
  refundDate: undefined,
  refundAmount: undefined,
  orderId: undefined,
  refundType: undefined,
  studyMonth: undefined,
  refundReason: undefined,
  cancelFixLessonOrderStatus: undefined,
  makeOutAnInvoiceStatus: undefined,
  orderNumber: undefined, // 仅作展示
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
  presentAmount: undefined,

  // 经理审核
  studyStatusToInvalid: undefined,
  // 财务审核
  fapStatus: undefined
})
const refundReasonValidator = (rule, value, callback) => {
  if (!value || !value.trim()) {
    return callback(new Error('退款原因为必填项'))
  }
  callback()
}

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  refundAmount: [{ required: true, message: '请对退款金额进行计算', trigger: 'change' }],
  refundType: [{ required: true, message: '退款原因为必选项', trigger: 'change' }],
  studyMonth: [{ required: true, message: '学习总月数为必填项', trigger: 'blur' }],
  refundDate: [{ required: true, message: '提出退费时间为必选项', trigger: 'change' }],
  makeOutAnInvoiceStatus: [{ required: true, message: '发票情况为必选项', trigger: 'change' }],
  revokePackage: [
    { required: true, message: '是否解约学员当前套餐/次卡为必选项', trigger: 'change' }
  ],
  studyStatusToInvalid: [
    { required: true, message: '是否变更学员状态为无效为必选项', trigger: 'change' }
  ],
  cancelFixLessonOrderStatus: [
    { required: true, message: '固定课情况为必选项', trigger: 'change' }
  ],
  refundReason: [
    { required: true, message: '退款原因为必填项', trigger: ['blur', 'change'] },
    { validator: refundReasonValidator, trigger: ['blur', 'change'] }
  ]
})
const formRef = ref() // 表单 Ref

/* 下拉框 options */
/* 1.customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 退款状态 radio */
const refundStatusOptions = [
  { label: '同意退款', value: 1 },
  { label: '拒绝退款', value: 3 }
]

/* step */
const activeStep = ref(0)
const toLastStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}
const toNextStep = () => {
  if (activeStep.value < 3) {
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

  if (rowData.id && type === 'update') {
    formLoading.value = true
    try {
      formData.value = await RefundApi.getRefundRecord(rowData.id)
      // formData.value.connectDate = getCurrentTime()
      // 处理禁用状态
      if (formData.value.connectStatus === CONNECT_STATUS.COMPLETE) {
        // 联系状态 = 已完成
        disabledConnect.value = true // 禁止填写联系联系状态
        disabledApprove.value = false // 允许填写审核状态
        disabledFinance.value = true
      }
      if (formData.value.status === REFUND_APPROVE_STATUS.APPROVED) {
        // 审核状态 = 审核通过
        disabledConnect.value = true // 禁止填写联系联系状态
        disabledApprove.value = true // 禁止填写审核状态
        disabledFinance.value = false // 允许填写财务状态
      }
      // 跟新各个状态时，设置 activeStep
      if (rowData.connectStatus !== CONNECT_STATUS.COMPLETE) {
        activeStep.value = 1
      } else if (rowData.status === REFUND_APPROVE_STATUS.WAITING) {
        activeStep.value = 2
      } else if (rowData.status === REFUND_APPROVE_STATUS.APPROVED) {
        activeStep.value = 3
        formData.value.fapStatus = REFUND_STATUS.AGREE // 默认同意退款 
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
  formData.value.orderId = rowData.id
  formData.value.orderNumber = rowData.orderNum
  formData.value.refundDate = new Date().getTime()
  formData.value.paymentAmount = rowData.actualAmount
  formData.value.refundableAmount = rowData.refundableAmount
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
    refundableAmount: formData.value.refundableAmount,
    handlingFee: formData.value.handlingFee,
    thisMonthPrice: formData.value.thisMonthPrice,
    refundMonth: formData.value.refundMonth,
    presentBookName: formData.value.presentBookName,
    presentPoint: formData.value.presentPoint,
    presentTicket: formData.value.presentTicket,
    presentAmount: formData.value.presentAmount,
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
// 联系状态禁用
const disabledConnect = ref(false)
// 审核状态禁用
const disabledApprove = ref(true)
// 退款审核禁用
const disabledFinance = ref(true)
// 提交按钮禁用
const disabledSubmitBtn = computed(() => {
  if (formType.value === 'create') {
    if (formLoading.value) return true
    else return false
  } else if (formType.value === 'update') {
    if (activeStep.value === 0) {
      return true
    } else if (activeStep.value === 1) {
      return disabledConnect.value
    } else if (activeStep.value === 2) {
      return disabledApprove.value
    } else if (activeStep.value === 3) {
      return disabledFinance.value
    }
  }
})

/* watcher */
/* 监听 activeStep， 动态设置 联系时间和审核时间 为当前时间 */
watch(
  () => activeStep.value,
  (currentStep, lastStep) => {
    if (currentStep === 1 && !disabledConnect.value) {
      formData.value.connectDate = new Date().getTime()
    }
  },
  { immediate: true }
)
/* 监听审核状态，审核不通过则处理纪要必填 */
watch(
  () => formData.value.status,
  (currentStatus) => {
    if (currentStatus === REFUND_APPROVE_STATUS.REJECTED) {
      formRules.approveRemark = [
        { required: true, message: '请填写审核不通过原因', trigger: 'blur' }
      ]
    } else {
      formRules.approveRemark = []
      formRef.value?.clearValidate('approveRemark')
    }
  }
)
/* 监听退款审核，拒绝退费则处理纪要必填 */
watch(
  () => formData.value.fapStatus,
  (currentStatus) => {
    if (currentStatus === REFUND_STATUS.REJECTED) {
      formRules.fapRemark = [{ required: true, message: '请填写拒绝退费原因', trigger: 'blur' }]
    } else {
      formRules.fapRemark = []
      formRef.value?.clearValidate('fapRemark')
    }
  }
)
/* 监听退款审核禁用状态，动态设置表单验证 */
watch(
  () => disabledFinance.value,
  (currentStatus) => {
    if (!currentStatus && activeStep.value === 3) {
      // 添加退款状态表单验证规则
      formRules.fapStatus = [{ required: true, message: '退款状态为必选项', trigger: 'change' }]
    } else if (currentStatus || activeStep.value !== 3) {
      formRules.fapStatus = []
      formRef.value?.clearValidate('fapStatus')
    }
  }
)

/** 操作退款操作  */
const orderPaymentRef = ref()
const allotRefundAmount = async () => {
  await formRef.value.validate()
  orderPaymentRef.value.open(formData.value)
}

/** 提交表单 */
const emit = defineEmits(['success', 'closeRefundLog']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  const res = ref(null)
  try {
    let data = formData.value as unknown as RefundVO
    if (formType.value === 'create') {
      const {
        customerId,
        refundDate,
        refundAmount,
        orderId,
        refundType,
        studyMonth,
        refundReason,
        cancelFixLessonOrderStatus,
        makeOutAnInvoiceStatus,
        bankName,
        customerBankCard,
        customerName,
        packageType,
        paymentAmount,
        handlingFee,
        thisMonthPrice,
        refundMonth,
        presentBookName,
        presentPoint,
        presentTicket,
        presentAmount
      } = data
      const createData = {
        customerId,
        refundDate,
        refundAmount,
        orderId,
        refundType,
        studyMonth,
        refundReason,
        cancelFixLessonOrderStatus,
        makeOutAnInvoiceStatus,
        bankName,
        customerBankCard,
        customerName,
        packageType,
        paymentAmount,
        handlingFee,
        thisMonthPrice,
        refundMonth,
        presentBookName,
        presentPoint,
        presentTicket,
        presentAmount,
        revokePackage: true, // 是否解约学员当前套餐/次卡 默认值为 是
        studyStatusToInvalid: true // 是否变更学员状态为无效 默认值为 是
      }
      // 新增退款记录，获取新增的退款记录 id
      res.value = await RefundApi.createRefundRecord(createData)
      message.success(t('common.createSuccess'))
      // 关闭弹窗
      dialogVisible.value = await false
      // 发送关闭退款记录弹窗的事件
      emit('closeRefundLog')
      // 跳转至订单退款记录管理
      await message.confirm('需要查看刚刚创建的退款记录吗？')
      await router.push({
        name: 'OrderRefund',
        query: { orderId: formData.value.orderId }
      })
      if (res === null) dialogVisible.value = false
    } else {
      if (activeStep.value === 1) {
        const { id, connectStatus, connectRemark, connectDate } = data
        const connectData = { id, connectStatus, connectRemark, connectDate }
        await RefundApi.updateRefundRecordConnectStatus(connectData)
        message.success(t('common.updateSuccess'))
        // 发送操作成功的事件
        emit('success')
      } else if (activeStep.value === 2) {
        const { id, approveRemark, status, revokePackage, studyStatusToInvalid } = data
        const approveData = { id, approveRemark, status, revokePackage, studyStatusToInvalid }
        // 当审核状态为审核通过，是否解约学员当前套餐/次卡为是，是否变更学员状态为无效为是，进行二次确认
        if (status === REFUND_APPROVE_STATUS.APPROVED && (revokePackage || studyStatusToInvalid)) {
          let tipContent = ''
          if (revokePackage && !studyStatusToInvalid) {
            tipContent += "<strong class='c-#FF0000'>解约学员当前套餐/次卡解约学员当前套餐/次卡，</strong>"
          }
          if (!revokePackage && studyStatusToInvalid) {
            tipContent += "<strong class='c-#FF0000'>变更学员状态为无效，</strong>"
          }
          if (revokePackage && studyStatusToInvalid) {
            tipContent += "<strong class='c-#FF0000'>解约学员当前套餐/次卡解约学员当前套餐/次卡，并变更学员状态为无效，</strong>"
          }
          const confirmRes = await message.confirm(
            `审核通过后，将${tipContent}是否继续？`,
            null, true
          )
          if (confirmRes === 'cancel') {
            tipContent = ''
            return
          }
        }
        await RefundApi.updateRefundRecordApproveStatus(approveData)
        message.success(t('common.updateSuccess'))
        // 发送操作成功的事件
        emit('success')
      } else if (activeStep.value === 3) {
        const { id, fapStatus, fapRemark } = data
        const fapData = { id, fapStatus, fapRemark }
        await RefundApi.updateRefundRecordFapStatus(fapData)
        message.success(t('common.updateSuccess'))
        // 发送操作成功的事件
        emit('success')
      }
      dialogVisible.value = false
    }
  } catch (error) {
    console.log(error)
    // 创建退款记录不跳转，关闭弹窗
    if (formType.value === 'create' && error === 'cancel') dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 分配退款金额 成功 */
const handleAllotSuccess = () => {
  emit('success')
  dialogVisible.value = false
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    /* step 0 */
    customerId: undefined,
    refundDate: undefined,
    refundAmount: undefined,
    orderId: undefined,
    refundType: undefined,
    studyMonth: undefined,
    refundReason: undefined,
    cancelFixLessonOrderStatus: undefined,
    makeOutAnInvoiceStatus: undefined,
    orderNumber: undefined, // 仅作展示
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
    presentAmount: undefined,

    /* step2 经理审核 */
    studyStatusToInvalid: false,

    /* step3 财务审核 */
    fapStatus: 1
  }

  disabledConnect.value = false
  disabledApprove.value = true
  disabledFinance.value = true
  activeStep.value = 0 // 复位 step
}
</script>

<style lang="scss" scoped>
:deep(.present-label) {
  font-weight: normal;
}

:deep(.keep) {
  word-break: keep-all;
}

:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
