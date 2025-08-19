<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="450">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading">
      <el-form-item label="顾问" prop="targetResponsibleId">
        <el-select v-model="formData.targetResponsibleId" clearable filterable remote
          :loading="formOptions.targetResponsible.loading" :remote-method="formOptions.targetResponsible.handleSearch"
          placeholder="请检索后选择顾问">
          <el-option v-for="option in formOptions.targetResponsible.options" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="转让原因" prop="reason">
        <el-select v-model="formData.reason" placeholder="请选择或检索所属转让原因" clearable filterable>
          <el-option v-for="option in formOptions.reason.option" :key="option.value" :label="option.label"
            :value="option.value" />
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
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerApi, TransferLogVO, CustomerVO } from '@/api/crm/customer/base'

/** 流转记录 表单 */
defineOptions({ name: 'TransferLogForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('选择转让人') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  id: undefined,
  targetResponsibleId: undefined,
  customerIds: [],
  reason: undefined,
  remarks: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  targetResponsibleId: [{ required: true, message: '变更后顾问不能为空', trigger: 'change' }],
  reason: [{ required: true, message: '转让原因不能为空', trigger: 'change' }]
})

/* 选项列表 */
const formOptions = reactive({
  targetResponsible: useRemoteSearch(handleRemoteUserOptions),
  reason: {
    option: getIntDictOptions(DICT_TYPE.TRANSFER_REASON).filter(item => [1, 2, 3, 4].includes(item.value))
  }
})

/** 打开弹窗 */
const open = async (type: string, ids: number[]) => {
  dialogVisible.value = true
  formType.value = type
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
    const data = formData.value as unknown as TransferLogVO
    if (formType.value === 'create') {
      await CustomerApi.transferMentorAll(data)
      message.success('转让成功')
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    // 发送取消选择事件
    emit('cancelSelection')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (ids) => {
  formData.value = {
    id: undefined,
    targetResponsibleId: undefined,
    customerIds: ids,
    reason: undefined,
    remarks: undefined
  }
  formRef.value?.resetFields()
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