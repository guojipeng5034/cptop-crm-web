<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请检索并选择学员" clearable filterable remote
          :remote-method="fetchRemoteCustomerOptions" :loading="customerOptionsLoading"
          :disabled="hasCustomerId || updateDisabled" @change="handleCustomerSelected" @clear="handleCustomerClear">
          <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
            :label="option.label" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formType === 'create'" label="可用订单" prop="orderId">
        <el-text v-if="isShowNoOrderTip" type="warning">该学员没有可用订单</el-text>
        <el-select v-else v-model="formData.orderId" placeholder="请选择或检索可用套餐订单" clearable filterable
          @change="handleOrderSelected">
          <el-option v-for="option in orderOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>

      <el-form-item v-else label="订单" prop="orderNum">
        <el-input v-model="formData.orderNum" :disabled="updateDisabled" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getOrderOptions, handleRemoteCustomerOptions } from '@/utils/dict'
import { CustomerTicketPackageApi, CustomerTicketPackageVO } from '@/api/crm/package/customerTicketPackage'

/** 学员次卡套餐管理 表单 */
defineOptions({ name: 'CustomerTicketPackageForm' })

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
const updateDisabled = ref(false) // 修改表单禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  orderId: undefined,
  orderNum: undefined,
  packageId: undefined,
  startLessonTime: undefined,
  expiresTime: undefined,
  openLessonUserId: undefined,
  revokeLessonTime: undefined,
  revokeLessonUserId: undefined,
  remark: undefined,
  qqeTicketLogUid: undefined,
  lessonStatus: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  orderId: [{ required: true, message: '可用订单为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  fetchRemoteCustomerOptions(customerId)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.customerId = props.customerId
  await handleCustomerSelected(formData.value.customerId)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    updateDisabled.value = true
    try {
      formData.value = await CustomerTicketPackageApi.getCustomerTicketPackage(id)
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
    const data = formData.value as unknown as CustomerTicketPackageVO
    if (formType.value === 'create') {
      await CustomerTicketPackageApi.createCustomerTicketPackage(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomerTicketPackageApi.updateCustomerTicketPackage(data)
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
  updateDisabled.value = false
  customerOptions.value = []
  orderOptions.value = []
  isShowNoOrderTip.value = false
  formData.value = {
    id: undefined,
    customerId: undefined,
    orderId: undefined,
    orderNum: undefined,
    packageId: undefined,
    startLessonTime: undefined,
    expiresTime: undefined,
    openLessonUserId: undefined,
    revokeLessonTime: undefined,
    revokeLessonUserId: undefined,
    remark: undefined,
    qqeTicketLogUid: undefined,
    lessonStatus: undefined
  }
  formRef.value?.resetFields()
}

/* options */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])

const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 学员 selected */
const handleCustomerSelected = async (customerId) => {
  if (!customerId) return
  try {
    orderOptions.value = await getOrderOptions(customerId)
    orderOptions.value.length === 0 ? isShowNoOrderTip.value = true : isShowNoOrderTip.value = false
  } catch (e) {
    console.log('handleCustomerSelected', e)
  }
}

/* 学员 clear */
const handleCustomerClear = () => {
  formData.value.orderId = undefined
  formData.value.packageId = undefined
  orderOptions.value = []
  isShowNoOrderTip.value = false
}

// 2.order
const orderOptions = ref([])
const isShowNoOrderTip = ref(false)
/* selected */
const handleOrderSelected = (orderId) => {
  let targetIndex = -1
  if (orderOptions.value.length) {
    targetIndex = orderOptions.value.findIndex((item) => {
      return item.value === orderId
    })
  }
  if (targetIndex >= 0) {
    formData.value.packageId = orderOptions.value[targetIndex].packageId
  }
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