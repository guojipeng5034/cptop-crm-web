<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900">
    <el-steps v-show="formType !== 'view'" align-center :active="activeStep" finish-status="wait"
      process-status="finish" class="mb-10px">
      <el-step title="创建签约订单">
        <template #icon>
          <Icon icon="icon-park-outline:creation-date-sort" :size="30" />
        </template>
      </el-step>
      <el-step title="生成订单详情">
        <template #icon>
          <Icon icon="ri:money-cny-box-line" :size="30" />
        </template>
      </el-step>
    </el-steps>

    <div class="step-0" v-if="activeStep === 0">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学员" prop="customerId">
              <el-select v-model="formData.customerId" placeholder="请检索后选择学员" clearable filterable remote
                :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions">
                <el-option v-for="dict in customerOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐" prop="packageId">
              <el-select v-model="formData.packageId" placeholder="请选择套餐" clearable filterable>
                <el-option v-for="dict in signPackageOptions" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="签约订单类型" prop="orderType" label-width="110px">
              <el-radio-group v-model="formData.orderType">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.SIGN_ORDER_TYPE)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="step-1" v-if="activeStep === 1">
      <OrderDetail :payment-info="orderDetail" />
    </div>

    <template #footer>
      <el-button v-if="activeStep === 0" @click="submitForm" type="primary" :disabled="formLoading">下一步</el-button>
      <el-button @click="dialogVisible = false">{{ activeStep === 0 ? '取消' : '关闭' }}</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  getIntDictOptions,
  DICT_TYPE,
  handleRemoteCustomerOptions,
  getSignPackageOptions
} from '@/utils/dict'
import { SignedOrderApi, SignedOrderVO } from '@/api/crm/order/signed'
import OrderDetail from '@/views/crm/order/components/OrderDetail/OrderDetail.vue'

/** 签约制订单管理 表单 */
defineOptions({ name: 'SignedOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const activeStep = ref(0)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  customerId: undefined,
  packageId: undefined,
  orderType: 1 // 支付宝为默认签约订单类型
})
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  packageId: [{ required: true, message: '套餐为必选项', trigger: 'change' }],
  orderType: [{ required: true, message: '签约订单类型为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/* options */
const customerOptions = ref()
const customerOptionsLoading = ref(false)

/* customer Options */
const fetchRemoteCustomerOptions = async (query) => {
  const setOptions = (newValue) => (customerOptions.value = newValue)
  const setLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setOptions, setLoading)
}

/* package Options */
const signPackageOptions = ref([])
// 监听 customerId 改变，重新获取 packageOptions
watch(
  () => formData.value.customerId,
  async () => {
    if (formData.value.customerId) {
      signPackageOptions.value = await getSignPackageOptions(formData.value.customerId)
      if (signPackageOptions.value.length === 0) formData.value.packageId = undefined
    } else {
      signPackageOptions.value = []
      formData.value.packageId = undefined
    }
  }
)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 查看订单数据
  if (id) {
    formLoading.value = true
    try {
      const detailRes = await SignedOrderApi.getSignedOrderWithPackage(id)
      regroupOrderDetail(detailRes) // 支付详情
      activeStep.value = 1
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
let orderDetail = reactive({}) // 订单详情
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SignedOrderVO
    if (formType.value === 'create') {
      const currentCustomerName = customerOptions.value.find(
        (item) => item.value === data.customerId
      ).label
      await message.confirm(`请确认是否为学员【${currentCustomerName}】生成周期套餐扣费协议？`)
      const createRes = await SignedOrderApi.createSignedOrder(data)
      // 处理支付详情
      if (createRes.id) {
        const detailRes = await SignedOrderApi.getSignedOrderWithPackage(createRes.id)
        regroupOrderDetail(detailRes)
        activeStep.value = 1
        message.success(t('common.createSuccess'))
      }
    }
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    customerId: undefined,
    packageId: undefined,
    orderType: 1 // 支付宝为默认签约订单类型
  }
  formRef.value?.resetFields()
  activeStep.value = 0
}

const regroupOrderDetail = (detailRes: any) => {
  const { customerId, customerName, paymentAmount, agreementUrl, ...other } = detailRes
  orderDetail = {
    ...other,
    customer: {
      id: customerId,
      name: customerName
    },
    paymentType: null,
    remainingAmount: paymentAmount,
    amount: paymentAmount,
    payUrl: agreementUrl
  }
}
</script>
