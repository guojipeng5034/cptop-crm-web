<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" :disabled="hasCustomerId">
          <el-option v-for="option in customerOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="次卡" prop="ticketCode">
        <el-select v-model="formData.ticketCode" placeholder="请选择次卡" clearable filterable>
          <el-option v-for="dict in ticketCodeOptions" :key="dict.code" :label="dict.name" :value="dict.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="返还类型" prop="returnType">
        <el-select v-model="formData.returnType" placeholder="请选择返还类型" clearable filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_TICKET_ADD_CHANNEL)" :key="dict.value"
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
import { getNameByCode, getIntDictOptions, handleRemoteCustomerOptions, DICT_TYPE } from '@/utils/dict'
import { CustomerTicketApi, CustomerTicketVO } from '@/api/crm/sales/ticket/customerTicket'
import { CustomerAccountApi } from '@/api/crm/customer/account'
import { SubscriptionApi } from '@/api/crm/qqe/subscription'

/** 次卡记录 表单 */
defineOptions({ name: 'ReturnTicketLogForm' })

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
  ticketCode: undefined,
  tickerName: undefined,
  returnType: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  ticketCode: [{ required: true, message: '次卡为必填项', trigger: 'blur' }],
  returnType: [{ required: true, message: '返还类型为必选项', trigger: 'blur' }]
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
const ticketCodeOptions = ref([])

/* 新增时监视 customerId 和 ticketCode */
watch(() => formData.value.customerId, async (newValue) => {
  if (formType.value === 'create' && newValue) {
    try {
      const mainAccount = await CustomerAccountApi.getCustomerMainAccount(newValue)
      ticketCodeOptions.value = await SubscriptionApi.getSimpleTicketList(mainAccount.siteId)
    } catch (e) {
      message.error('QQE次卡套餐获取失败')
    }
  }
})

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  fetchRemoteCustomerOptions(customerId)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (customerId) {
    formData.value.customerId = customerId
    try {
      const mainAccount = await CustomerAccountApi.getCustomerMainAccount(customerId)
      ticketCodeOptions.value = await SubscriptionApi.getSimpleTicketList(mainAccount.siteId)
    } catch (e) {
      message.error('QQE次卡套餐获取失败')
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
    formData.value.tickerName = getNameByCode(formData.value.ticketCode, ticketCodeOptions.value)
    const data = formData.value as unknown as CustomerTicketVO
    if (formType.value === 'create') {
      await CustomerTicketApi.createCustomerTicket(data)
      message.success(t('common.createSuccess'))
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
    ticketCode: undefined,
    tickerName: undefined,
    returnType: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
  customerOptions.value = []
  ticketCodeOptions.value = []
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