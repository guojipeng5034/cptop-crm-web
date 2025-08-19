<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item v-show="formType === 'create'" label="顾问" prop="mentorId">
        <el-select v-model="formData.mentorId" placeholder="请检索后选择Mentor" clearable filterable remote
          :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch">
          <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="每日分配上限" prop="thresholdType">
        <el-radio-group v-model="formData.thresholdType">
          <el-radio-button v-for="dict in getIntDictOptions(DICT_TYPE.THRESHOLD_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="formData.thresholdType === 1" prop="assignThreshold">
        <el-input-number v-model="formData.assignThreshold" placeholder="请输入0~99的数字" clearable v-only-decimal="0"
          :min="0" :max="99" class="!w100%" />
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
  DICT_TYPE, getIntDictOptions,
  handleRemoteUserOptions
} from '@/utils/dict'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ListOwnerAssignThresholdApi, ListOwnerAssignThresholdVO } from '@/api/crm/customer/assign/threshold'

/** 阈值管理 表单 */
defineOptions({ name: 'AssignThresholdForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  mentorId: undefined, // 顾问
  thresholdType: 0, // 是否设置上限
  assignThreshold: 0 // 阈值
})

/* 表单校验规则 */
const formRules = reactive({
  // mentorId: formType.value === 'create' ? [{ required: true, message: 'mentor不能为空', trigger: 'change' }] : [],
  thresholdType: [{ required: true, message: '是否设置上限不能为空', trigger: 'change' }],
  assignThreshold: [{ required: true, message: '阈值不能为空', trigger: 'blur' }]
})

/* 选项列表 */
const queryOptions = reactive({
  mentor: useRemoteSearch(handleRemoteUserOptions),
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = formType.value === 'create' ? '添加特殊阈值' : '修改默认阈值'
  resetForm()
  formLoading.value = true
  try {
    if (formType.value === 'updateDefault') {
      formData.value = await ListOwnerAssignThresholdApi.getDefaultAssignThreshold()
    } else if (formType.value === 'updateSpecial' && id) {
      formData.value = await ListOwnerAssignThresholdApi.getListOwnerAssignThreshold(id)
    }
  } finally {
    formLoading.value = false
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
    const data = formData.value as unknown as ListOwnerAssignThresholdVO
    if (formType.value === 'create') {
      await ListOwnerAssignThresholdApi.createListOwnerAssignThreshold(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'updateDefault') {
      await ListOwnerAssignThresholdApi.setDefaultAssignThreshold(data)
      message.success('修改默认阈值成功')
    } else {
      await ListOwnerAssignThresholdApi.updateListOwnerAssignThreshold(data)
      message.success('修改分配阈值成功')
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
    mentorId: undefined,
    thresholdType: 0,
    assignThreshold: 0
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