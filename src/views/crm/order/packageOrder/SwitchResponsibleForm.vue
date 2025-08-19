<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="变更后" prop="responsibleId">
        <el-select v-model="formData.responsibleId" clearable filterable remote :loading="userOptionsLoading"
          :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择变更后的 Responsible">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="transferRemark">
        <el-input type="textarea" v-model="formData.transferRemark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { PackageRecordApi, PackageRecordVO } from '@/api/crm/order/paymentRecord'
import { CustomerApi, TransferLogVO, CustomerVO } from '@/api/crm/customer/base'

/** 更换 Responsible 表单 */
defineOptions({ name: 'SwitchResponsibleForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('变更 Responsible') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

// 更换 Responsible表单数据
const formData = ref({
  id: undefined,
  responsibleId: undefined,
  transferRemark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  responsibleId: [{ required: true, message: '变更后 Responsible 为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

// Mentor 表单数据
const mentorFormData = ref({
  targetResponsibleId: undefined,
  customerIds: [],
  reason: 3, // 业绩考核调整
  remarks: '更换 Responsible 同步更新 Mentor'
})

/** options */
// 1.user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

/** 打开弹窗 */
const open = async (paymentRowData, customerId: number) => {
  dialogVisible.value = true
  resetForm()
  formData.value = {
    ...paymentRowData,
    responsibleId: undefined
  }
  mentorFormData.value.customerIds = [customerId]
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
    const responsibleData = formData.value as unknown as PackageRecordVO
    const mentorData = mentorFormData.value as unknown as TransferLogVO
    mentorData.targetResponsibleId = responsibleData.responsibleId
    const switchRes = await PackageRecordApi.updatePaymentRecord(responsibleData)
    message.success('变更成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    if (switchRes) {
      await message.confirm('是否同步变更Mentor？')
      await CustomerApi.transferSingle(mentorData)
      message.success('转让成功')
    }
  } catch (e) {
    message.error('变更失败')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    responsibleId: undefined,
    transferRemark: undefined
  }
  formRef.value?.resetFields()

  mentorFormData.value = {
    targetResponsibleId: undefined,
    customerIds: [],
    reason: 3,
    remarks: '更换 Responsible 同步更新 Mentor'
  }
}
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
