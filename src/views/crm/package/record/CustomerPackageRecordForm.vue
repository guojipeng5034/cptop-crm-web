<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="430">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item v-if="!isUpdate" label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions">
          <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
            :label="option.label" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isUpdate" label="订单" prop="orderId">
        <el-select v-show="!showNoneOrderTip" v-model="formData.orderId" placeholder="请选择或检索订单" clearable filterable
          :disabled="isUpdate">
          <el-option v-for="option in orderOptions" :key="option.value" :value="option.value" :label="option.label"
            class="!h-12 my-3">
            <template #default>
              <div class="ws-normal line-height-6">
                <div>{{ option.label }}</div>
                <div class="font-size-3 color-#b2b2b2">{{ option.orderTypeName }} - {{ option.packageName }}</div>
              </div>
            </template>
          </el-option>
        </el-select>
        <el-text v-show="showNoneOrderTip" type="warning">该学员没有可使用的订单</el-text>
      </el-form-item>
      <el-form-item label="总刷新次数" prop="refreshTotalCount">
        <el-input-number v-limit-input v-model="formData.refreshTotalCount" placeholder="请输入刷新次数" :step="1"
          step-strictly :min="minRefreshCount" class="!w-100%" />
      </el-form-item>

      <el-form-item v-if="!isUpdate" label="已刷新次数" prop="refreshedCount">
        <el-input-number v-limit-input v-model="formData.refreshedCount" placeholder="请输入已刷新次数" :step="1" step-strictly
          :min="minRefreshCount" class="!w-100%" />
      </el-form-item>

      <el-form-item v-if="isUpdate" label="本次操作备注" prop="currentRemark">
        <el-input v-model="formData.currentRemark" type="textarea" placeholder="请输入操作备注" />
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
  DICT_TYPE,
  handleRemoteCustomerOptions,
  getOrderPackageRecordOptions
} from '@/utils/dict'
import { RecordApi, RecordVO } from '@/api/crm/package/record'

/** 学员套餐&订单绑定 表单 */
defineOptions({ name: 'CustomerPackageRecordForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const isUpdate = computed(() => formType.value === 'update') // 禁止更新

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  orderId: undefined,
  refreshTotalCount: undefined,
  refreshedCount: undefined,
  opearteRecord: '',
  currentRemark: ''
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  orderId: [{ required: true, message: '订单为必选项', trigger: 'change' }],
  refreshTotalCount: [{ required: true, message: '总刷新次数为必填项', trigger: 'blur' }],
  refreshedCount: [{ required: true, message: '已刷新次数为必填项', trigger: 'blur' }],
  currentRemark: [{ required: true, message: '本次操作备注为必填项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/* options */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

// 通过 customerId 获取订单列表
const showNoneOrderTip = ref(false)
watch(
  () => formData.value.customerId,
  async (newCustomerId) => {
    if (!newCustomerId) {
      orderOptions.value = []
      showNoneOrderTip.value = false
      formData.value.orderId = undefined
    } else {
      orderOptions.value = await getOrderPackageRecordOptions(newCustomerId)
      showNoneOrderTip.value = orderOptions.value.length === 0
    }
  }
)

/* 2. order */
const orderOptions = ref([])

/* 刷新次数最小值 */
const minRefreshCount = ref(0)

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  // 获取学员列表
  await fetchRemoteCustomerOptions(customerId)

  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RecordApi.getRecord(id)
      minRefreshCount.value = formData.value.refreshedCount // 防止设置总刷新次数小于已刷新次数，造成剩余刷新次数小于0
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
    const data = formData.value as unknown as RecordVO
    if (formType.value === 'create') {
      delete data.currentRemark
      delete data.opearteRecord
      await RecordApi.createRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      const { id, refreshTotalCount } = data
      const params = {
        id,
        refreshTotalCount,
        opearteRecord: mergeRemark(formData.value.opearteRecord)
      }
      await RecordApi.updateRecord(params)
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
    customerId: undefined,
    orderId: undefined,
    refreshTotalCount: undefined,
    refreshedCount: undefined,
    opearteRecord: '',
    currentRemark: ''
  }
  formRef.value?.resetFields()
}

/* 本次操作备注合并历史操作记录 */
const mergeRemark = (historyRemark: string) => {
  if (historyRemark) {
    return historyRemark + '<br>' + formData.value.currentRemark
  } else {
    return formData.value.currentRemark
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
