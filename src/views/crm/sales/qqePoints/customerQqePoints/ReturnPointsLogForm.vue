<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" :disabled="hasCustomerId">
          <el-option v-for="option in customerOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型" prop="returnType">
        <el-select v-model="formData.returnType" placeholder="请选择操作类型" filterable clearable>
          <el-option v-for="dict in returnTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.returnType === 11" label="课时包订单" prop="orderId">
        <el-select v-if="orderOptions.length" v-model="formData.orderId" placeholder="请选择课时包订单" filterable clearable>
          <el-option v-for="dict in orderOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
        <template v-else>
          <el-text type="danger">该学员还没有可用的课时包订单</el-text>
        </template>
      </el-form-item>
      <el-form-item label="课时点数" prop="returnPointsNum">
        <el-input-number v-limit-input v-model="formData.returnPointsNum" placeholder="请输入课时点数" :step="1" :min="1"
          :max="getMaxValue" step-strictly class="!w-100%" :disabled="disabledPointsNum" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注，内容对学生展示，请认真填写" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteCustomerOptions } from '@/utils/dict'
import { RETURN_MAX_VALUE } from '@/utils/constants'
import { getUserRoleCategory } from '@/utils/permission'
import { CustomerQqePointsApi, CustomerQqePointsVO } from '@/api/crm/sales/qqePoints/customerQqePoints'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package/index'

/** 学员课时点记录 表单 */
defineOptions({ name: 'ReturnPointsLogForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
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

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  returnPointsNum: undefined,
  returnType: undefined,
  orderId: undefined,
  orderNum: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  returnPointsNum: [{ required: true, message: '课时点数为必填项', trigger: 'change' }],
  returnType: [{ required: true, message: '操作类型为必选项', trigger: 'change' }],
  remark: [{ required: true, message: '备注为必填项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/* 常量 */
const getMaxValue = ref()
watch(
  [() => formData.value.returnType, () => formData.value.customerId],
  ([newRefundType, newCustomerId], [oldRefundType, oldCustomerId]) => {
    if (newRefundType !== oldRefundType) {
      getMaxValue.value = RETURN_MAX_VALUE[newRefundType] ?? undefined
    }
    const isLessonPackageRefund = newRefundType === 11
    const didCustomerChange = newCustomerId !== oldCustomerId
    // 获取课时包订单列表，监听 customerId 用于防止先选操作类型，后选学员
    if (isLessonPackageRefund && newCustomerId && (didCustomerChange || !orderOptions.value.length)) {
      formData.value.orderId = undefined
      disabledPointsNum.value = true
      getUnusedLessonBagOrderOptions()
    } else {
      formData.value.orderId = undefined
    }
    if (!isLessonPackageRefund || !newCustomerId) {
      formData.value.orderId = undefined
      formData.value.returnPointsNum = undefined
      disabledPointsNum.value = false
    }
  }
)

/* options */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

// 2.orderOptions 操作类型（returnType）=== 课时追加包购买（11） 需要绑定购买课时包的订单
const orderOptions = ref<Array<{
  value: number
  label: string
  orderNum: number
  awardQqePointsNum?: number  // Add this field to store the points
}>>([])
const getUnusedLessonBagOrderOptions = async () => {
  if (!formData.value.customerId) return
  try {
    const rawOrders = await PackageOrderApi.getLessonBagPackageOrderUnused(formData.value.customerId)
    orderOptions.value = rawOrders.map(item => ({
      label: `${item.orderTypeName} - ${item.packageName}`,
      value: item.id,
      orderNum: item.orderNum,
      awardQqePointsNum: item.awardQqePointsNum
    }))
  } catch (error) {
    message.error('获取课时包订单失败')
  }
}

// 当前选中的订单
const selectedOrder = computed(() => orderOptions.value.find((order) => order.value === formData.value.orderId))

/** 监听orderId 赋值并禁用课时点  */
const disabledPointsNum = ref(false)
watch(
  () => formData.value.orderId,
  (val) => {
    if (val) {
      const order = orderOptions.value.find(item => item.value === val)
      if (order) {
        formData.value.returnPointsNum = order.awardQqePointsNum
        disabledPointsNum.value = true
      }
    } else {
      disabledPointsNum.value = false
      formData.value.returnPointsNum = undefined
    }
  }
)

// 3.returnType
const additionTypeValues = [1, 4, 5, 6, 8, 9, 11, 12, 13, 14, 7, 15] // 新增值
const deductionTypeValues = [2, 3, 10, 7] // 扣除值
const advicerValues = [1, 8, 15] // 顾问值
const servicerValues = [4, 15] // 客服值
const returnTypeOptions = computed(() => {
  const oriData = getIntDictOptions(DICT_TYPE.CRM_QQE_POINTS_ADD_CHANNEL).map(option => ({
    ...option,
    point: RETURN_MAX_VALUE[option.value] || 0
  }))
  let typeOptions: Array<any> = [], roleOptions: Array<any> = []
  // 根据 formType 值筛选出对应的操作类型
  if (formType.value === 'add') {
    typeOptions = oriData.filter(item => additionTypeValues.includes(item.value))
    // 根据 权限标识 筛选出对应的操作类型
    let roleCategory = getUserRoleCategory(1) // 角色大类
    if (roleCategory === '顾问') {
      roleOptions = oriData.filter(item => advicerValues.includes(item.value))
    } else if (roleCategory === '客服') {
      roleOptions = oriData.filter(item => servicerValues.includes(item.value))
    } else {
      roleOptions = typeOptions
    }
    return roleOptions
  } else {
    typeOptions = oriData.filter(item => deductionTypeValues.includes(item.value))
    return typeOptions
  }
})

/** 打开弹窗 */
const open = async (type: string, customerId?: number) => {
  fetchRemoteCustomerOptions(customerId)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '课时点'
  formType.value = type
  resetForm(customerId)
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
    if (selectedOrder.value) formData.value.orderNum = selectedOrder.value.orderNum
    const data = formData.value as unknown as CustomerQqePointsVO
    if (formType.value === 'add') {
      await CustomerQqePointsApi.createCustomerQqePoints(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'remove') {
      await CustomerQqePointsApi.removeCustomerQqePoints(data)
      message.success(t('common.operateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (cid) => {
  formData.value = {
    id: undefined,
    customerId: cid,
    returnPointsNum: undefined,
    returnType: undefined,
    orderId: undefined,
    orderNum: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
  disabledPointsNum.value = false // 重置课时点禁用
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
