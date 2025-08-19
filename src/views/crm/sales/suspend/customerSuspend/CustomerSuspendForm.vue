<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions"
          :disabled="hasCustomerId || formType === 'update'">
          <el-option v-for="option in customerOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="停课券" prop="couponId">
        <el-select v-model="formData.couponId" placeholder="请选择或检索停课券" filterable clearable @clear="handleCouponClear">
          <el-option v-for="option in suspendOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加渠道" prop="channel">
        <el-select v-model="formData.channel" placeholder="请选择或检索添加渠道">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COUPON_ADD_CHANNEL)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  getIntDictOptions,
  getSuspendOptions,
  handleRemoteCustomerOptions,
  DICT_TYPE
} from '@/utils/dict'

// import { CouponApi, CouponVO } from '@/api/crm/sales/suspend/customerSuspend/index'
import { SuspendApi, SuspendVO } from '@/api/crm/sales/suspend/suspend/index'
import { CustomerSuspendApi, CustomerSuspendVO } from '@/api/crm/sales/suspend/customerSuspend'

/** 学员优惠券 表单 */
defineOptions({ name: 'CustomerSuspendForm' })

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

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* 表单数据 */
const formData = ref({
  id: undefined,
  couponId: undefined,
  customerId: undefined,
  // couponAmount: undefined,
  channel: undefined,
  remark: undefined
})

/* 表单验证规则 */
const formRules = reactive({
  couponId: [{ required: true, message: '优惠券为必选项', trigger: 'change' }],
  customerId: [
    { required: true, message: '学员为必选项', trigger: 'blur' },
    { pattern: /^[0-9]*$/, message: '只允许填写数字', trigger: 'blur' }
  ],
  channel: [{ required: true, message: '添加渠道为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  suspendOptions.value = await getSuspendOptions()
  console.log(suspendOptions.value)
  fetchRemoteCustomerOptions(customerId)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.customerId = props.customerId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CustomerSuspendApi.getCustomerSuspend(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CustomerSuspendVO
    if (formType.value === 'create') {
      await CustomerSuspendApi.createCustomerSuspend(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomerSuspendApi.updateCustomerSuspend(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
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
    couponId: undefined,
    customerId: undefined,
    // couponAmount: undefined,
    channel: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}

/** options */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 2.suspend */
const suspendOptions = ref([])

// /* 优惠券 selected */
// const handleCouponSelected = async (couponId) => {
//   if (!couponId) return
//   try {
//     const res = await CouponApi.getCoupon(couponId)
//     formData.value.couponAmount = res.discount
//   } catch (e) {
//     console.log('handleCouponSelected', e)
//   }
// }

/* 优惠券 clear */
const handleCouponClear = () => {
  formData.value.couponAmount = undefined
}
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>