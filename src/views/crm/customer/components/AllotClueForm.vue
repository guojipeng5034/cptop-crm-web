<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="分配顾问" prop="listOwnerId">
        <el-select v-model="formData.listOwnerId" clearable filterable remote :loading="userOptionsLoading"
          :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择分配顾问">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="分配原因" prop="reason">
        <el-select v-model="formData.reason" placeholder="请选择分配原因" clearable filterable>
          <el-option v-for="dict in reasonOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="formData.remarks" placeholder="请输入备注" />
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
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'

/** 线索分配 表单 */
defineOptions({ name: 'AllotClueForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('线索分配') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  customerIds: [],
  listOwnerId: undefined, // 分配顾问
  reason: undefined, // 分配原因
  remarks: undefined, // 备注
})

const formRules = reactive({
  listOwnerId: [{ required: true, message: '分配顾问不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '分配原因不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/* options */
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
  .filter(item => [4, 9, 10, 11].includes(item.value))

/** 打开弹窗 */
const open = async (ids: number[]) => {
  dialogVisible.value = true
  resetForm(ids)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success', 'cancelSelection']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    await message.confirm('确定要将所选线索分配给该顾问吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await CustomerApi.updateListOwner(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    // 发送取消选择
    emit('cancelSelection')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (ids) => {
  formRef.value?.resetFields()
  formData.value = {
    customerIds: ids,
    listOwnerId: undefined,
    reason: undefined, // 分配原因
    remarks: undefined, // 备注
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