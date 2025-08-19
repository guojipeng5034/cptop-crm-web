<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900" @closed="resetForm">
    <el-steps v-show="formType !== 'view'" align-center :active="activeStep" finish-status="success" class="mb-10px">
      <el-step :title="formType === 'create' ? '创建订单' : '创建支付尾款订单'">
        <template #icon>
          <Icon icon="icon-park-outline:creation-date-sort" :size="30" />
        </template>
      </el-step>
      <!-- 订单审核类型为财务审核 || 本次支付金额 <= 0 无需展示付款二维码-->
      <el-step title="生成支付详情" v-if="needQrCodeStep">
        <template #icon>
          <Icon icon="ri:money-cny-box-line" :size="30" />
        </template>
      </el-step>
    </el-steps>

    <div v-if="activeStep === 1" class="creat-form">
      <el-card class="mb-3 !bg-#f9f9f9" shadow="never" v-loading="formLoading">
        <div class="statistics text-center flex justify-around">
          <el-statistic title="订单原价" :value="formData.totalAmount" />
          <el-statistic title="优惠金额" :value="outputDiscountAmount" />
          <el-statistic v-if="formType === 'create'" title="应付总金额" :value="outputPayableAmount" />
          <el-statistic v-if="formType === 'payBalance'" title="已付金额" :value="outputActualAmount" />
          <el-statistic v-if="formType === 'payBalance'" title="已退金额" :value="outputActualRefundAmount" />
          <el-statistic v-if="formType === 'payBalance'" title="剩余尾款金额" :value="outputBalanceAmount" />
        </div>
      </el-card>

      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="110"
        v-loading="formLoading" :validate-on-rule-change="false">
        <el-row :gutter="10">
          <el-col :span="12">
            <!-- 在学员详情订单Tab中和支付尾款时禁用，不允许变更 -->
            <el-form-item label="学员" prop="customerId">
              <el-select v-model="formData.customerId" filterable clearable remote :loading="customerOptionsLoading"
                :remote-method="fetchRemoteCustomerOptions" placeholder="请选择学员"
                :disabled="props.hasCustomerId || formType === 'payBalance'" @change="handleCustomerSelected"
                @clear="handleCustomerClear">
                <el-option v-for="dict in customerOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 支付尾款时禁用，不允许切换套餐 -->
            <el-form-item label="套餐" prop="packageId">
              <el-select v-if="formType !== 'payBalance'" v-model="formData.packageId" filterable clearable
                placeholder="请选择套餐" :loading="packageOptionsLoading">
                <el-option v-for="dict in packageOption" :key="dict.value" :label="dict.label" :value="dict.value">
                  <template #default>
                    <div class="flex justify-between items-center">
                      <arco-tag v-show="dict.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG"
                        :value="dict.hedgingTag" size="small" />
                      <span class="ml-2 mr-auto">{{ dict.label }}</span>
                      <span class="pl-4">￥{{ dict.price }}</span>
                    </div>
                  </template>
                </el-option>
              </el-select>
              <div v-else>
                <arco-tag v-show="formData.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG"
                  :value="formData.hedgingTag" size="small" />
                <span class="ml-2 mr-auto font-bold">{{ formData.packageName }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 优惠券通过学员和套餐联动查询 -->
        <el-form-item label="优惠券" prop="couponIds" v-show="showCoupon" v-loading="couponLoading" class="coupons">
          <template #default>
            <!-- 1. 无优惠券提示 -->
            <div v-show="isNoneCoupon" class="coupon">
              <span class="color-#a8abb2">暂无可用优惠券</span>
            </div>
            <!-- 2. 尾款支付提示 -->
            <div v-show="!isAll && !isNoneCoupon" class="coupon">
              <span class="color-#a8abb2">您的优惠券可在支付尾款时使用</span>
            </div>
            <!-- 3. 优惠券列表 -->
            <div v-show="isAll && !isNoneCoupon" class="w-100%">
              <!-- 基础优惠券 -->
              <div v-if="basicCouponList.length" class="coupon basic-coupon bg-#f3f9ff">
                <el-checkbox-group v-model="basicCoupon" :min="0" :max="1" @change="handleCouponChange"
                  class="flex items-center flex-wrap">
                  <el-tag type="primary" size="small" class="mr-2">基础优惠券</el-tag>
                  <template v-for="item in basicCouponList" :key="item.couponId">
                    <el-checkbox :value="item.id" :label="item.couponName" :disabled="item.disabled" class="!mr-2" />
                  </template>
                </el-checkbox-group>
              </div>
              <!-- 专属优惠券 -->
              <div v-if="exclusiveCouponList.length" class="coupon exclusive-coupon bg-#fff5f5"
                :class="{ 'mt-2': basicCouponList.length }">
                <el-checkbox-group v-model="exclusiveCoupon" :min="0" :max="1" @change="handleCouponChange"
                  class="flex items-center flex-wrap">
                  <el-tag type="danger" size="small" class="mr-2">专属优惠券</el-tag>
                  <template v-for="item in exclusiveCouponList" :key="item.couponId">
                    <el-checkbox :value="item.id" :label="item.couponName" :disabled="item.disabled" class="!mr-2" />
                  </template>
                </el-checkbox-group>
              </div>
              <!-- 通用优惠券 -->
              <div v-if="commonCouponList.length" class="coupon common-coupon bg-#fffaf1"
                :class="{ 'mt-2': basicCouponList.length || exclusiveCouponList.length }">
                <el-checkbox-group v-model="commonCoupons" @change="handleCouponChange"
                  class="flex items-center flex-wrap">
                  <el-tag type="success" size="small" class="mr-2">通用优惠券</el-tag>
                  <template v-for="item in commonCouponList" :key="item.couponId">
                    <el-checkbox :value="item.id" :label="item.couponName" :disabled="item.disabled" class="!mr-2" />
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="支付类型" prop="paymentType">
              <el-radio-group v-model="formData.paymentType" @change="handlePayTypeChange"
                :disabled="disabledPaymentType">
                <template v-for="item in getIntDictOptions(DICT_TYPE.CRM_ORDER_PAYMENT_TYPE)" :key="item.value">
                  <el-radio :label="item.label" :value="item.value" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="formType === 'create'" label="本次支付金额" prop="currentAmount" label-width="130">
              <el-input-number v-limit-input v-model="formData.currentAmount" placeholder="仅在支付类型为分次时可操作"
                :disabled="!isInstallment" :step="100" :min="minCurrentAmount" :max="maxCurrentAmount"
                class="!w-300px" />
            </el-form-item>
            <el-form-item v-if="formType === 'payBalance'" label="本次支付金额" prop="payAmount" label-width="110">
              <!-- 剩余尾款金额 <100时，禁用修改 -->
              <el-input-number v-limit-input v-model="formData.payAmount" placeholder="仅在支付类型为分次时可操作" :step="100"
                :disabled="outputBalanceAmount < MIN_PAY_AMOUNT" :min="minCurrentAmount" :max="maxCurrentAmount"
                class="!w-100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="支付方式" prop="paymentMethod">
          <el-radio-group v-model="formData.paymentMethod">
            <el-radio v-for="item in paymentPlatformOptions" :key="item.value" :value="item.value" :label="item.label"
              :disabled="item.disabled" />
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="paymentMerchatOptions.length" label="支付商户" prop="paymentMerchantId">
          <el-radio-group v-model="formData.paymentMerchantId">
            <el-radio v-for="item in paymentMerchatOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="审核类型" prop="orderAuditType">
              <el-radio-group v-model="formData.orderAuditType" :disabled="disabledOrderAuditType">
                <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_AUDIT_TYPE)" :key="dict.value"
                  :value="dict.value" :label="dict.label" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实付时间" prop="orderPaymentTime" v-if="formData.orderAuditType === 0">
              <el-date-picker v-model="formData.orderPaymentTime" type="datetime" value-format="x" clearable
                placeholder="请选择实付时间" />
            </el-form-item>
            <el-form-item label="Univapay 支付方式" prop="univapayPaymentMethod" label-width="160"
              v-if="formData.paymentMethod === 23">
              <el-radio-group v-model="formData.univapayPaymentMethod">
                <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.CRM_UNIVAPAY_PAY_TYPE)" :key="dict.value"
                  :value="dict.value" :label="dict.label" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="支付截图" prop="transferImage" label-width="100" v-if="formData.orderAuditType === 0">
              <form-create v-model="transferImage" :rule="transferImageRule" :option="transferImageOption" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="formData.remarks" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeStep === 2" class="create-detail">
      <OrderDetail :payment-info="paymentDetail" />
    </div>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="activeStep === 1 && !needQrCodeStep">
        确 定
      </el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading"
        v-if="activeStep === 1 && needQrCodeStep">下一步</el-button>
      <el-button @click="dialogVisible = false" v-if="activeStep === 1">取 消</el-button>
      <el-button @click="finishForm" type="primary" v-if="activeStep === 2 && formType !== 'view'">完成</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, getPackageOptions, getPackagesOptions, handleRemoteCustomerOptions } from '@/utils/dict'
import { PAYMENT_TYPE, PAMENT_METHOD_ONLY_FINANCE } from '@/utils/constants'
import { isEmpty } from '@/utils/is'
import { debounce } from 'lodash-es'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'
import { PackageApi, PackageVO } from '@/api/crm/package/package'
import { PackageRecordApi, PackageRecordVO } from '@/api/crm/order/paymentRecord'
import OrderDetail from '@/views/crm/order/components/OrderDetail/OrderDetail.vue'

/** 套餐订单 表单 */
defineOptions({ name: 'PackageOrderForm' })

// 传入参数
const props = defineProps({
  hasCustomerId: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: Number,
    default: undefined
  }
})
const emit = defineEmits(['success', 'toPayBalance', 'query'])

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const activeStep = ref(1) // 当前步骤
let paymentDetail = reactive({}) // 支付详情
let baseDiscountAmount = 0 // 之前的优惠金额

/* 常量定义 */
const MIN_PAY_AMOUNT = 100 // 最小支付金额
const PAMENT_METHOD_UNIVAPAY = 23 // Univapay

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  packageId: undefined,
  packagesType: undefined,
  totalAmount: undefined,
  couponIds: [],
  discountAmount: undefined,
  actualAmount: undefined,
  payableAmount: undefined,
  orderAuditType: 1,
  paymentType: undefined,
  currentAmount: undefined,
  paymentMethod: undefined,
  transferImage: undefined,
  remarks: undefined,
  payAmount: undefined,
  orderPaymentTime: undefined,
  univapayPaymentMethod: undefined,
  paymentMerchantId: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  packageId: [{ required: true, message: '套餐为必选项', trigger: 'change' }],
  paymentType: [{ required: true, message: '支付类型为必选项', trigger: 'change' }],
  transferImage: [
    {
      required: true, validator: (_, __, callback) => {
        if (transferImage.value.transferImage && transferImage.value.transferImage.length === 0) {
          callback('请上传至少一张支付截图')
        }
        callback()
      }, trigger: 'change'
    },
  ],
  currentAmount: [{ required: true, message: '本次支付金额为必填项', trigger: 'change' }],
  payAmount: [{ required: true, message: '本次支付金额为必填项', trigger: 'blur' }],
  paymentMethod: [{ required: true, message: '支付方式为必选项', trigger: 'change' }],
  paymentMerchantId: [{ required: true, message: '支付商户为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/* 海报图 */
const transferImage = ref([])
const transferImageRule = ref([
  {
    "type": "UploadImgs",
    "field": "transferImage",
    "props": {
      "fileSize": 1,
      "limit": 3,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "80px",
      "height": "80px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "compress": true,
      "path": 'order/'
    },
    "hidden": false,
    "display": true
  }]
)
const transferImageOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
    "labelWidth": "125px",
    "hideRequiredAsterisk": false,
    "showMessage": true,
    "inlineMessage": false
  },
  "submitBtn": {
    "show": false,
    "innerText": "提交"
  },
  "resetBtn": {
    "show": false,
    "innerText": "重置"
  }
})

/* 上方计算属性 */
// 优惠金额
const outputDiscountAmount = computed(() => {
  let totalDiscount = 0
  const findCouponById = (couponId, couponList) => couponList.value.find((item) => couponId === item.id)
  if (basicCoupon.value.length) {
    const coupon = findCouponById(basicCoupon.value[0], basicCouponList)
    if (coupon !== 0) {
      totalDiscount += coupon.couponAmount
    }
  }
  if (exclusiveCoupon.value.length) {
    const coupon = findCouponById(exclusiveCoupon.value[0], exclusiveCouponList)
    if (coupon !== 0) {
      totalDiscount += coupon.couponAmount
    }
  }
  if (commonCoupons.value.length) {
    commonCoupons.value.forEach((item) => {
      const coupon = findCouponById(item, commonCouponList)
      if (coupon !== 0) {
        totalDiscount += coupon.couponAmount
      }
    })
  }
  if (baseDiscountAmount) totalDiscount += baseDiscountAmount
  return totalDiscount || 0
})
// 应付金额
const outputPayableAmount = computed(() => {
  const num = formData.value.totalAmount - outputDiscountAmount.value
  if (num > 0) {
    return num || 0
  } else {
    return 0
  }
})
// 已付金额
const outputActualAmount = computed(() => {
  // 创建订单, 直接使用已付金额
  if (formType.value === "create") {
    return formData.value.actualAmount || 0
  } else {
    // 已付金额=已付金额-退款金额
    return (formData.value.actualAmount - formData.value.actualRefundAmount) || 0
  }
})
// 已退金额
const outputActualRefundAmount = computed(() => {
  if (formType.value === "payBalance") return formData.value.actualRefundAmount || 0
})
// 剩余尾款金额
const outputBalanceAmount = computed(() => {
  // 剩余尾款金额只有在支付尾款里才有，剩余尾款金额=订单原价-已付金额（包含退费）-优惠金额
  if (formType.value === "payBalance") {
    const num = (formData.value.totalAmount - outputActualAmount.value - outputDiscountAmount.value)
    if (num > 0) {
      return num || 0
    } else {
      return 0
    }
  }
})

/* options */
// 1.package
const packageOption = ref([])

// 2.coupon
const basicCouponList = ref([])
const exclusiveCouponList = ref([])
const commonCouponList = ref([])

// 3.paymentPlatform
const paymentPlatformOptions = ref([])
const resetPaymentPlatformOptions = async () => {
  const data = getIntDictOptions(DICT_TYPE.CRM_PAYMENT_LIST)
  data.forEach((item) => item.disabled = true)
  paymentPlatformOptions.value = data
}

// 4.customer
const customerOptions = ref([])
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

// 5.paymentMerchats
const paymentMerchatOptions = ref([])

/* 本次支付金额下限 */
const minCurrentAmount = computed(() => {
  if (formData.value.payableAmount === MIN_PAY_AMOUNT) {
    formData.value.paymentType = PAYMENT_TYPE.ONE_TIME
  }
  if (formType.value === 'create') {
    if (outputPayableAmount.value > MIN_PAY_AMOUNT) {
      return MIN_PAY_AMOUNT
    } else {
      return 0.01
    }
  }
  if (formType.value === 'payBalance') {
    if (outputBalanceAmount.value < MIN_PAY_AMOUNT) {
      return outputBalanceAmount.value
    } else {
      return MIN_PAY_AMOUNT
    }
  }
})

/* 本次支付金额上限 */
const maxCurrentAmount = computed(() => {
  if (formType.value === 'create') {
    // 待优化
    if (formData.value.paymentType === PAYMENT_TYPE.ONE_TIME) {
      return formData.value.totalAmount
    }
    if (formData.value.payableAmount >= MIN_PAY_AMOUNT) {
      return formData.value.payableAmount
    } else if (formData.value.payableAmount < MIN_PAY_AMOUNT && formData.value.payableAmount > 0) {
      return formData.value.payableAmount
    } else if (formData.value.payableAmount <= 0) {
      return 0
    }
  }
  if (formType.value === 'payBalance') {
    if (outputBalanceAmount.value > 0) {
      return outputBalanceAmount.value
    }
  }
})

/* 禁用支付类型 */
const disabledPaymentType = computed(() => {
  if (formData.value.payableAmount === 0) {
    if (formType.value === 'create') {
      formData.value.paymentType = 1
    }
    formData.value.currentAmount = formData.value.payableAmount
  }
  return !formData.value.payableAmount || // 未选学生或套餐
    formData.value.packagesType === 4 || // 套餐类型为课时包
    formData.value.payableAmount <= MIN_PAY_AMOUNT || // 应付总金额 <= 最低支付价格
    formType.value === 'payBalance' // 支付尾款
})

/** 打开弹窗 */
const open = async (type: string, orderId?: number, name?: string, customerId?: number) => {
  formType.value = type

  // payment 查看订单详情
  if (type === 'view') {
    dialogTitle.value = t('action.' + type) // 弹窗的标题
    activeStep.value = 2
    const paymentRecord = await PackageRecordApi.getPaymentWithPackageAndCouponByPaymentId(orderId)
    paymentDetail = paymentRecord // 支付详情
    dialogVisible.value = true
    return
  }
  await resetPaymentPlatformOptions()
  resetForm()
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? t('action.' + type) : '支付尾款'

  // 学员详情抽屉打开时，绑定操作
  if (type === 'create' && customerId) {
    checkExistSplitOrder('inside', customerId)
    formData.value.customerId = customerId
    await fetchRemoteCustomerOptions(customerId)
    packageOption.value = await getPackageOptions(formData.value.customerId)
  }

  // 付尾款
  if (type === 'payBalance') {
    formLoading.value = true
    try {
      formData.value = {
        ...await PackageOrderApi.getPackageOrder(orderId),
        remarks: undefined,
        orderAuditType: 1
      }
      // 获取优惠金额，用于优惠券重置恢复优惠金额
      baseDiscountAmount = formData.value.discountAmount
      await fetchRemoteCustomerOptions(customerId)
      // 获取套餐
      packageOption.value = await getPackageOptions(formData.value.customerId)
      await fetchCouponsAndMerchants()
      // 设置实际支付金额
      formData.value.payAmount = outputBalanceAmount.value
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const submitForm = debounce(async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  if (transferImage.value) formData.value.transferImage = transferImage.value.transferImage
  try {
    let data = formData.value as unknown as PackageOrderVO
    data.couponIds = handleFormDataCoupons()
    if (formType.value === 'create') {
      const res = await PackageOrderApi.createPackageOrder(data)
      if (res?.id) {
        const paymentRecord = await PackageRecordApi.getPaymentWithPackageAndCouponByPaymentId(res.id)
        paymentDetail = paymentRecord
      }
    } else {
      data = {
        orderId: formData.value.id,
        discountAmount: formData.value.discountAmount,
        actualAmount: formData.value.actualAmount,
        payAmount: formData.value.payAmount,
        customerCouponsId: formData.value.couponIds,
        paymentMethod: formData.value.paymentMethod,
        orderAuditType: formData.value.orderAuditType,
        orderPaymentTime: formData.value.orderPaymentTime,
        univapayPaymentMethod: formData.value.paymentMethod === PAMENT_METHOD_UNIVAPAY ? formData.value.univapayPaymentMethod : undefined,
        transferImage: transferImage.value ? transferImage.value.transferImage : undefined,
        paymentMerchantId: formData.value.paymentMerchantId,
        remarks: formData.value.remarks
      }
      const res = await PackageOrderApi.createPackageOrderPayAgain(data)
      if (res?.id) {
        const paymentRecord = await PackageRecordApi.getPaymentWithPackageAndCouponByPaymentId(res.id)
        paymentDetail = paymentRecord
      }
    }
    // 操作成功
    message.success(t('common.createSuccess'))
    if (!needQrCodeStep.value) {
      dialogVisible.value = false
      emit('success')
    } else {
      activeStep.value = 2
    }
  } catch (e) {
    message.error('创建订单失败')
  } finally {
    formLoading.value = false
  }
}, 300)

/* 完成 */
const finishForm = () => {
  dialogVisible.value = false
  emit('success')
}

/** 重置表单 */
const resetForm = () => {
  transferImage.value = { transferImage: [] }
  formData.value = {
    id: undefined,
    customerId: undefined,
    packageId: undefined,
    packagesType: undefined,
    totalAmount: undefined,
    couponIds: [],
    discountAmount: undefined,
    actualAmount: undefined,
    payableAmount: undefined,
    orderAuditType: 1,
    paymentType: undefined,
    currentAmount: undefined,
    paymentMethod: undefined,
    transferImage: undefined,
    remarks: undefined,
    payAmount: undefined,
    orderPaymentTime: undefined,
    univapayPaymentMethod: undefined,
    paymentMerchantId: undefined
  }
  formRef.value?.resetFields()
  activeStep.value = 1
  handleCustomerClear()
  showCoupon.value = false
  couponLoading.value = false
  baseDiscountAmount = 0
  paymentMerchatOptions.value.length = 0
}

/* 支付方式（paymentMethod）监听， 支付方式为'Univapay'，需要填写Univapay支付方式 */
/* 订单审核类型（orderAuditType）禁用状态 */
const disabledOrderAuditType = ref(false)
watch(
  () => formData.value.paymentMethod,
  (val) => {
    formRules.univapayPaymentMethod =
      val === PAMENT_METHOD_UNIVAPAY
        ? [{ required: true, message: '请选择 Univapay 支付方式', trigger: 'change' }]
        : []
    if (val !== PAMENT_METHOD_UNIVAPAY) formData.value.univapayPaymentMethod = undefined

    /* 支付方式（paymentMethod）监听， 对公转账(6)/抖店(7)/小红书(8) 只能选择财务审核 */
    if (Object.values(PAMENT_METHOD_ONLY_FINANCE).includes(val)) {
      formData.value.orderAuditType = 0 // 财务审核
      disabledOrderAuditType.value = true
    } else {
      formData.value.orderAuditType = 1 // 系统审核
      disabledOrderAuditType.value = false
    }
    // 组合对应商户选项
    handlePayMerchantOptions(val)
  }
)

/* 订单审核类型（orderAuditType）监听， 订单审核类型为'财务审核'，需要填写支付时间 和 备注必填 */
watch(
  () => formData.value.orderAuditType,
  (val) => {
    formRules.orderPaymentTime =
      val === 0 ? [{ required: true, message: '请选择支付时间', trigger: 'change' }] : []
    formRules.remarks =
      val === 0 ? [{ required: true, message: '请填写备注', trigger: 'change' }] : []
  }
)

/* 订单审核类型（orderAuditType）为'财务审核'|| 本次支付金额 <= 0，不需要生成支付二维码 */
const needQrCodeStep = computed(() => {
  if (formType.value === 'create') {
    return formData.value.orderAuditType === 1 && formData.value.currentAmount !== 0
  } else if (formType.value === 'payBalance') {
    return formData.value.orderAuditType === 1
  }
})

let canUseCoupons = [] // 可用优惠券, 存储请求得到的 canUesCouponsList，用于单独使用/互斥失效/互斥规则判断
let mutexMapByGroup = {} // 优惠券互斥组
let mutextMapByCoupon = {} // 优惠券互斥
let merchantsRes = [] // 可用支付方式商户

const fetchCouponsAndMerchants = async () => {
  const { customerId, packageId, id, discountAmount } = formData.value
  if (!customerId || !packageId) return
  showCoupon.value = true
  couponLoading.value = true

  try {
    const res = await PackageApi.getPackagesPayType(
      customerId,
      packageId,
      id || undefined
    )

    formData.value = {
      ...formData.value,
      packagesType: res.packagesType,
      paymentType: res.packagesType === 4 ? 1 : 2, // 套餐类型为课时包，支付类型默认选中一次性，分次不可选中
      totalAmount: res.price, // 订单原价
      payableAmount: Math.max(res.price - (discountAmount || 0), 0) // 应付总金额
    }

    // 存储可用优惠券列表
    canUseCoupons = Array.from(res.canUesCouponsList)
    // 优惠券互斥组
    mutexMapByGroup = isEmpty(res.mapByGroup) ? {} : res.mapByGroup
    // 优惠券互斥
    mutextMapByCoupon = isEmpty(res.mapByCoupon) ? {} : res.mapByCoupon
    // 赋值学员所有可用优惠券及优惠券互斥信息用于优惠券选择变更优惠券禁用状态
    merchantsRes = res.merchantSetList

    // 处理优惠券列表
    const customerCouponRes = res.canUesCouponsList
    const processCouponItem = (item) => ({
      ...item,
      couponName: `${item.couponName}（￥${item.couponAmount}）`,
      disabled: false
    })
    basicCouponList.value = customerCouponRes
      .filter((item) => item.couponType === 1)
      .map(processCouponItem)
    exclusiveCouponList.value = customerCouponRes
      .filter((item) => item.couponType === 2)
      .map(processCouponItem)
    commonCouponList.value = customerCouponRes
      .filter((item) => item.couponType === 3)
      .map(processCouponItem)

    // 处理可用支付方式
    resetPaymentPlatformOptions() // 重置支付方式禁用状态
    paymentPlatformOptions.value.forEach((paymentPlat) => {
      const hasMerchant = res.merchantSetList.some(
        merchant => merchant.merchantType === paymentPlat.value
      )
      paymentPlat.disabled = !hasMerchant
    })
  } finally {
    couponLoading.value = false
  }
}

/* 1.学员 */
// 1.1 selected
const handleCustomerSelected = async (customerId: number) => {
  packageOptionsLoading.value = true
  try {
    packageOption.value = await getPackageOptions(customerId)
  } finally {
    packageOptionsLoading.value = false
  }
  if (formType.value === 'create') checkExistSplitOrder('outside', customerId)
  fetchCouponsAndMerchants()
}
// 1.2 clear
const handleCustomerClear = () => {
  packageOption.value = []
  resetCustomerPackage()
  resetCustomerCoupon()
  resetPaymentPlatformOptions() // 重置支付方式禁用状态
}

/* 2.套餐 */
const packageOptionsLoading = ref(false)
watch(() => formData.value.packageId, async (newVal) => {
  clearCouponOptions() // 重置优惠券选项
  resetCustomerCoupon() // 重置学员优惠券

  // 重置相关表单数据
  formData.value.totalAmount = undefined
  formData.value.payableAmount = undefined
  formData.value.paymentMethod = undefined
  formData.value.currentAmount = undefined
  formData.value.paymentType = PAYMENT_TYPE.INSTALLMENTS // 默认支付方式为分次支付

  if (newVal) {
    await fetchCouponsAndMerchants()
    // 应付金额 100元以下，本次支付金额设置为应付金额
    // formData.value.currentAmount = outputPayableAmount.value < MIN_PAY_AMOUNT ? outputPayableAmount.value : MIN_PAY_AMOUNT
    if (formData.value.paymentType === PAYMENT_TYPE.ONE_TIME) {
      formData.value.currentAmount = outputPayableAmount.value
    } else {
      formData.value.currentAmount = MIN_PAY_AMOUNT
    }
  } else {
    // 重置支付方式选项状态
    resetPaymentPlatformOptions()
  }
})

/* 3.优惠券 */
const showCoupon = ref(false)
const couponLoading = ref(false)
const basicCoupon = ref([]) // 基础优惠券
const exclusiveCoupon = ref([]) // 互斥优惠券
const commonCoupons = ref([]) // 通用优惠券

/* 是否展示无优惠券提示 */
const isNoneCoupon = computed(() => {
  const noCoupons = !(
    basicCouponList.value.length ||
    exclusiveCouponList.value.length ||
    commonCouponList.value.length
  )
  return noCoupons
})

/* 是否展示优惠券支付尾款提示 */
const isAll = computed(
  // 支付类型为分次支付 剩余尾款金额=本次支付金额
  () => {
    return (formData.value.paymentType === 2
      && (formType.value === 'create' && formData.value.currentAmount === outputBalanceAmount.value
        || formType.value === 'payBalance' && formData.value.payAmount === outputBalanceAmount.value))
      || formData.value.paymentType === 1
  }
)

const handleCouponChange = (couponIds: number[]) => {
  handleDisableCoupon(couponIds)
  // 重置相关数值
  formData.value.discountAmount = baseDiscountAmount + outputDiscountAmount.value
  formData.value.payableAmount =
    formData.value.totalAmount - formData.value.discountAmount >= 0
      ? formData.value.totalAmount - formData.value.discountAmount
      : 0
  if (formData.value.paymentType === 1 && formType.value === 'create') {
    formData.value.currentAmount = formData.value.payableAmount
  }
  if (formType.value === "payBalance") {
    formData.value.payAmount = outputBalanceAmount.value
  }
}

/* 本次支付金额禁用 */
const isInstallment = computed(() => formData.value.paymentType === 2)

// 5.2 支付类型切换，影响本次支付金额（currentAmount）
/* 逻辑描述：
 * 1. 一次性支付
 *  1.1 订单原价（totalAmount）- 优惠金额（discountAmount）> 0
 *      本次支付金额（currentAmount）= 应付总金额（payableAmount）= 订单原价（totalAmount）- 优惠金额（discountAmount）
 *  1.2 订单原价（totalAmount）- 优惠金额（discountAmount）<= 0
 *      本次支付金额（currentAmount）= 应付总金额（payableAmount）= 0
 * 2. 分次支付
 *  2.1 订单原价（totalAmount）- 优惠金额（discountAmount）>= 500
 *      本次支付金额（currentAmount）= 500
 *  2.2 订单原价（totalAmount）- 优惠金额（discountAmount）< 500
 *      本次支付金额（currentAmount）= 应付总金额（payableAmount）
 */
const handlePayTypeChange = (value) => {
  if (!isAll.value) {
    // 清空所有优惠券选中状态
    basicCoupon.value = []
    exclusiveCoupon.value = []
    commonCoupons.value = []
  }
  if (value === PAYMENT_TYPE.ONE_TIME) {
    formData.value.currentAmount = outputPayableAmount.value
  } else if (value === PAYMENT_TYPE.INSTALLMENTS) {
    formData.value.currentAmount = MIN_PAY_AMOUNT
  }
}

/* 监听应付总金额 payableAmount 影响支付类型 paymentType
 * 1. formType 为 create 时 && payableAmount <= 0, 不允许分次支付
 *     paymentType = 1(ONE_TIME 一次性)
 */
watch(() => formData.value.payableAmount, (newValue) => {
  if (formType.value === 'create' && newValue < 0) {
    formData.value.paymentType = 1
  }
})

/* 监听本次支付金额（create） 
 * 本次支付金额 = 应付总金额 时，支付类型为 一次性支付 
*/
watch(() => formData.value.currentAmount, (newValue) => {
  if (newValue && newValue === formData.value.payableAmount) {
    formData.value.paymentType = 1
  }
})

watch(() => formData.value.payAmount, (newValue) => {
  if (newValue !== outputBalanceAmount.value) {
    // 清空所有优惠券选中状态
    basicCoupon.value = []
    exclusiveCoupon.value = []
    commonCoupons.value = []
  }
})

// 组合表单优惠券数据
const handleFormDataCoupons = () => {
  let couponIds = []
  if (basicCoupon.value.length) couponIds.push(basicCoupon.value[0])
  if (exclusiveCoupon.value.length) couponIds.push(exclusiveCoupon.value[0])
  if (commonCoupons.value.length) couponIds = [...couponIds, ...commonCoupons.value]
  return couponIds
}


// 清空优惠券选项
const clearCouponOptions = () => {
  basicCouponList.value = []
  exclusiveCouponList.value = []
  commonCouponList.value = []
}

/* 重置优惠券 */
const resetCustomerCoupon = () => {
  basicCoupon.value = []
  exclusiveCoupon.value = []
  commonCoupons.value = []
}

/* 重置套餐 */
const resetCustomerPackage = () => {
  formData.value.packageId = undefined
  formData.value.totalAmount = undefined
  formData.value.payableAmount = undefined
  formData.value.paymentMethod = undefined
  formData.value.paymentType = undefined
  formData.value.currentAmount = undefined
  paymentPlatformOptions.value.forEach((item) => item.status = false)
}

/* 组合支付商户选项 */
const handlePayMerchantOptions = (paymentMethod) => {
  // 清空支付商户选项
  formData.value.paymentMerchantId = undefined
  paymentMerchatOptions.value = []

  // 空值时返回
  if (!paymentMethod) return

  merchantsRes.forEach(merchant => {
    if (merchant.merchantType === paymentMethod) {
      paymentMerchatOptions.value.push(
        {
          label: merchant.merchantName,
          value: merchant.id,
        }
      )
    }
  })
  // 如果只有一个可用商户，直接赋值给 formData.paymentMerchantId
  if (paymentMerchatOptions.value.length) {
    formData.value.paymentMerchantId = paymentMerchatOptions.value[0].value
  }
}

// 扩展优惠券功能，单独使用 > 互斥失效 > 互斥，将需要禁用的优惠券禁用
const handleDisableCoupon = (couponIds) => {
  // 1. 获取当前选中的最后一张优惠券
  const getLastSelectedCoupon = () => {
    if (couponIds.length === 0) return null
    const lastCouponId = couponIds[couponIds.length - 1]
    return canUseCoupons.find(item => item.id === lastCouponId)
  }

  // 2. 处理单独使用优惠券
  const handleSingleUseCoupon = (coupon) => {
    if (!coupon?.isSingle) return false

    // 清空所有优惠券选中状态
    basicCoupon.value = []
    exclusiveCoupon.value = []
    commonCoupons.value = []

    // 根据优惠券类型设置选中状态
    if (coupon.couponType === 1) { // 基础优惠券
      basicCoupon.value = [coupon.id]
    } else if (coupon.couponType === 2) { // 专属优惠券
      exclusiveCoupon.value = [coupon.id]
    } else if (coupon.couponType === 3) { // 通用优惠券
      commonCoupons.value = [coupon.id]
    }

    // 禁用其他所有优惠券
    basicCouponList.value.forEach(item => {
      item.disabled = item.id !== coupon.id
    })
    exclusiveCouponList.value.forEach(item => {
      item.disabled = item.id !== coupon.id
    })
    commonCouponList.value.forEach(item => {
      item.disabled = item.id !== coupon.id
    })

    return true
  }

  // 3. 处理互斥优惠券
  const handleMutexCoupons = (coupon) => {
    if (!coupon) return

    // 获取当前优惠券所属的所有互斥组
    const couponGroups = mutextMapByCoupon[coupon.couponId] || []
    if (couponGroups.length === 0) return

    // 获取所有需要禁用的优惠券ID
    const disabledCouponIds = new Set()
    couponGroups.forEach(groupId => {
      const groupCoupons = mutexMapByGroup[groupId] || []
      groupCoupons.forEach(couponId => {
        if (couponId !== coupon.couponId) {
          disabledCouponIds.add(couponId)
        }
      })
    })

    // 禁用互斥组内的其他优惠券
    basicCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
        // 如果已选中，则取消选中
        if (basicCoupon.value.includes(item.id)) {
          basicCoupon.value = basicCoupon.value.filter(id => id !== item.id)
        }
      }
    })

    exclusiveCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
        // 如果已选中，则取消选中
        if (exclusiveCoupon.value.includes(item.id)) {
          exclusiveCoupon.value = exclusiveCoupon.value.filter(id => id !== item.id)
        }
      }
    })

    commonCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
        // 如果已选中，则取消选中
        if (commonCoupons.value.includes(item.id)) {
          commonCoupons.value = commonCoupons.value.filter(id => id !== item.id)
        }
      }
    })
  }

  // 4. 处理普通优惠券（非单独使用且非互斥）
  const handleNormalCoupons = () => {
    // 基础优惠券只能选一张
    if (basicCoupon.value.length > 1) {
      basicCoupon.value = [basicCoupon.value[basicCoupon.value.length - 1]]
    }

    // 专属优惠券只能选一张
    if (exclusiveCoupon.value.length > 1) {
      exclusiveCoupon.value = [exclusiveCoupon.value[exclusiveCoupon.value.length - 1]]
    }

    // 通用优惠券可以多选，不需要特殊处理
  }

  // 5. 获取所有已选中的互斥组
  const getSelectedMutexGroups = () => {
    const selectedGroups = new Set()
    couponIds.forEach(couponId => {
      const coupon = canUseCoupons.find(item => item.id === couponId)
      if (coupon) {
        const groups = mutextMapByCoupon[coupon.couponId] || []
        groups.forEach(groupId => selectedGroups.add(groupId))
      }
    })
    return selectedGroups
  }

  // 6. 应用互斥规则，但不重置之前的禁用状态
  const applyMutexRules = () => {
    // 获取所有已选中的互斥券
    const mutexCoupons = couponIds.filter(couponId => {
      const coupon = canUseCoupons.find(item => item.id === couponId)
      return coupon && (mutextMapByCoupon[coupon.couponId] || []).length > 0
    }).map(couponId => canUseCoupons.find(item => item.id === couponId))

    // 没有互斥券，不需要处理
    if (mutexCoupons.length === 0) return

    // 收集所有需要禁用的优惠券ID
    const disabledCouponIds = new Set()
    mutexCoupons.forEach(coupon => {
      const couponGroups = mutextMapByCoupon[coupon.couponId] || []
      couponGroups.forEach(groupId => {
        const groupCoupons = mutexMapByGroup[groupId] || []
        groupCoupons.forEach(couponId => {
          if (couponId !== coupon.couponId) {
            disabledCouponIds.add(couponId)
          }
        })
      })
    })

    // 禁用收集到的优惠券
    basicCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
      }
    })
    exclusiveCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
      }
    })
    commonCouponList.value.forEach(item => {
      if (disabledCouponIds.has(item.couponId)) {
        item.disabled = true
      }
    })
  }

  // 主逻辑
  const lastSelectedCoupon = getLastSelectedCoupon()

  // 如果没有选中的优惠券，重置所有禁用状态
  if (!lastSelectedCoupon) {
    basicCouponList.value.forEach(item => item.disabled = false)
    exclusiveCouponList.value.forEach(item => item.disabled = false)
    commonCouponList.value.forEach(item => item.disabled = false)
    return
  }

  // 如果是单独使用的优惠券
  if (lastSelectedCoupon.isSingle) {
    handleSingleUseCoupon(lastSelectedCoupon)
    return
  }

  // 如果是互斥优惠券，先处理互斥关系
  if ((mutextMapByCoupon[lastSelectedCoupon.couponId] || []).length > 0) {
    handleMutexCoupons(lastSelectedCoupon)
  }

  // 处理基础、专属优惠券只能选一张的规则
  handleNormalCoupons()

  // 无论选中的是什么类型的券，都需要应用已选中互斥券的互斥规则
  applyMutexRules()
}

/* 验证学员是否有分次支付订单 */
const checkExistSplitOrder = async (type: string, customerId: number) => {
  // type：outside 列表操作，inside 抽屉操作
  if (!customerId) return
  const existSplitPackages = await PackageOrderApi.getExistSplitOrderPackages(customerId)
  if (existSplitPackages.length !== 0) {
    ElMessageBox.confirm(
      '学员当前存在已支付部分款项的课时点套餐或次卡订单，若需完成该订单支付，可继续创建尾款订单；若无需支付尾款，仅在当前学员有正在上课套餐时可创建新的追加课程包。',
      '是否前往支付尾款？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
    )
      .then(() => {
        dialogVisible.value = false
        if (existSplitPackages.length === 1) {
          // 跳转支付尾款
          emit('toPayBalance', customerId, existSplitPackages[0].orderId)
        } else {
          // 搜索当前学员的已付部分订单
          if (type === 'outside') emit('query', customerId)
        }
      }).catch(async () => {
        // 判断学员是否有可用套餐
        if (packageOption.value.length === 0) {
          dialogVisible.value = false
        }
      })
  } else {
    checkCustomerIsRenewPackage(customerId)
  }
}

/* 检测学员是否为续费套餐 */
const checkCustomerIsRenewPackage = async (customerId: number) => {
  const existRenewPackages = await PackageOrderApi.getCustomerIsRenewPackage(customerId)
  if (existRenewPackages) {
    formData.value.packageId = existRenewPackages.id
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.coupons {
  :deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
  }

  .coupon {
    box-sizing: border-box;
    width: 100%;
    border-radius: 10px;
    padding: 4px 8px;
  }
}
</style>
