<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="85" v-loading="formLoading">
      <el-form-item label="班次" prop="scheduling">
        <el-select v-model="formData.scheduling" placeholder="请选择班次" clearable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_EVALUATION_SCHEDULING)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="协助日期" prop="assistDate">
        <el-date-picker v-model="formData.assistDate" type="date" placeholder="请选择协助日期" format="YYYY-MM-DD"
          value-format="x" />
      </el-form-item>
      <el-form-item v-if="formType === 'create'" label="顾问" prop="mentorIds">
        <el-select v-model="formData.mentorIds" placeholder="请检索顾问" clearable filterable remote multiple
          :loading="mentorOptionsLoading" :remote-method="fetchRemoteMentorOptions">
          <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-else label="顾问" prop="mentorId">
        <el-select v-model="formData.mentorId" placeholder="请检索顾问" clearable filterable remote
          :loading="mentorOptionsLoading" :remote-method="fetchRemoteMentorOptions">
          <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定账号" prop="bindingAccount">
        <el-input v-model="formData.bindingAccount" placeholder="请输入绑定账号" />
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
import { WechatEvaluationVO, WechatEvaluationApi } from '@/api/crm/wechat/evaluation'

/** 创建记录 表单 */
defineOptions({ name: 'WechatCreateLogForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref() // 表单的类型：create - 新增；update - 修改

/* 表单数据 */
const formData = ref({
  scheduling: undefined,
  assistDate: undefined,
  mentorId: undefined,
  mentorIds: undefined,
  bindingAccount: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  scheduling: { required: true, message: '班次不能为空', trigger: 'blur' },
  assistDate: { required: true, message: '协助日期不能为空', trigger: 'blur' },
  mentorIds: [{}],
  mentorId: [{}],
  bindingAccount: { required: true, message: '绑定账号不能为空', trigger: 'blur' },
})
const formRef = ref() // 评价表单 Ref

/* options */
// mentor
const mentorOptions = ref()
const mentorOptionsLoading = ref(false)
const fetchRemoteMentorOptions = async (query) => {
  const setOptions = (newValue) => (mentorOptions.value = newValue)
  const setLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setOptions, setLoading)
}

/** 打开弹窗 */
const open = async (type: string, id?: number, mentorName?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WechatEvaluationApi.getWechatEvaluation(id)
      fetchRemoteMentorOptions(mentorName)
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as WechatEvaluationVO
    if (formType.value === 'create') {
      await WechatEvaluationApi.createWechatEvaluation(data)
      message.success('新增成功')
    } else {
      await WechatEvaluationApi.updateWechatEvaluation(data)
      message.success('修改成功')
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
  mentorOptions.value = undefined
  formData.value = {
    scheduling: undefined,
    assistDate: undefined,
    mentorId: undefined,
    mentorIds: undefined,
    bindingAccount: undefined,
  }
  formRef.value?.resetFields()
}
defineExpose({ open })

onMounted(() => {
  watch(formType, (newValue) => {
    formRules.mentorIds = newValue === 'create' ? [{ required: true, message: '顾问不能为空', trigger: 'change' }] : []
    formRules.mentorId = newValue === 'update' ? [{ required: true, message: '顾问不能为空', trigger: 'change' }] : []
  })
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
