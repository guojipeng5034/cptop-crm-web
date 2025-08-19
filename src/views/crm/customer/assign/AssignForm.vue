<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item label="分配日期" prop="assignTime">
        <el-date-picker v-model="formData.assignTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          placeholder="选择分配日期" :disabled-date="disabledBeforeDate" class="!w-100%" />
      </el-form-item>
      <el-form-item label="线索分配人员" prop="mentorId">
        <el-select v-model="formData.mentorId" clearable filterable remote :loading="mentorOptionsLoading"
          :remote-method="fetchRemoteMentorOptions" placeholder="请选择线索分配人员">
          <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
import { disabledBeforeDate } from '@/utils/formatTime'
import { ListOwnerAssignApi, ListOwnerAssignVO } from '@/api/crm/customer/assign'

/** 学员线索分配 表单 */
defineOptions({ name: 'AssignForm' })

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
  assignTime: undefined,
  mentorId: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  assignTime: [{ required: true, message: '分配日期不能为空', trigger: 'change' }],
  mentorId: [{ required: true, message: '线索分配人员不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/* options */
// 1.mentor
const mentorOptions = ref([])
const mentorOptionsLoading = ref(false)
const fetchRemoteMentorOptions = async (query) => {
  const setMentorOptions = (newValue) => (mentorOptions.value = newValue)
  const setMentorLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setMentorOptions, setMentorLoading)
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '分配人员'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ListOwnerAssignApi.getListOwnerAssign(id)
      await fetchRemoteMentorOptions(formData.value.mentorName)
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
    const data = formData.value as unknown as ListOwnerAssignVO
    if (formType.value === 'create') {
      await ListOwnerAssignApi.createListOwnerAssign(data)
      message.success(t('common.createSuccess'))
    } else {
      await ListOwnerAssignApi.updateListOwnerAssign(data)
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
  mentorOptions.value = []
  formData.value = {
    id: undefined,
    assignTime: undefined,
    mentorId: undefined,
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