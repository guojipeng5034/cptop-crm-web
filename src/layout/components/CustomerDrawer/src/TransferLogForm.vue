<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item :label="formType" :prop="formType === 'Tester' ? 'testerId' : 'callerId'">
        <el-select v-if="formType === 'Tester'" v-model="formData.testerId" clearable filterable remote
          :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择变更后 Tester">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-else v-model="formData.callerId" clearable filterable remote :loading="userOptionsLoading"
          :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择变更后 Caller">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="transferReasonType">
        <el-select v-model="formData.transferReasonType" placeholder="请选择原因" clearable filterable>
          <el-option v-for="dict in reasonOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="transferRemarks">
        <el-input type="textarea" v-model="formData.transferRemarks" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { CustomerApi } from '@/api/crm/customer/base'

/** 学员Mentor流转记录 表单 */
defineOptions({ name: 'TransferLogForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型

/* 表单数据 */
const formData = ref({
  id: undefined,
  testerId: undefined,
  callerId: undefined,
  transferSource: undefined,
  transferReasonType: 3,
  transferRemarks: undefined
})
const formRef = ref() // 表单 Ref

/* 表单校验规则 */
const formRules = reactive({
  testerId: [{ required: true, message: 'Tester 不能为空', trigger: 'change' }],
  callerId: [{ required: true, message: 'Caller 不能为空', trigger: 'change' }],
  transferReasonType: [{ required: true, message: '原因不能为空', trigger: 'change' }]
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

// 2.reason
const reasonOptions = getIntDictOptions(DICT_TYPE.TRANSFER_REASON)
  .filter(item => item.value === 3)

/** 打开弹窗 */
const open = async (type: string, id: number) => {
  dialogVisible.value = true
  dialogTitle.value = '变更 ' + type
  formType.value = type
  resetForm(id)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const { callerId, testerId, ...rest } = formData.value
    const data = {
      ...rest,
      transferSource: formType.value === 'Tester' ? 3 : 2,
      testerId: formType.value === 'Tester' ? testerId : undefined,
      callerId: formType.value === 'Caller' ? callerId : undefined
    }
    await CustomerApi.updateCustomer(data)
    message.success('变更成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {
    message.error('变更失败')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (id) => {
  formData.value = {
    id,
    testerId: undefined,
    callerId: undefined,
    transferSource: undefined,
    transferReasonType: 3,
    transferRemarks: undefined
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
