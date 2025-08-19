<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item label="代理" prop="agencyId">
        <el-select v-model="formData.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
          :loading="agencyOptionsLoading" :remote-method="fetchRemoteAgencyOptions" :disabled="formType === 'update'">
          <el-option v-for="dict in agencyOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="佣金规则" prop="ruleId">
        <el-select v-model="formData.ruleId" placeholder="请选择或检索佣金规则" clearable filterable
          :disabled="formType === 'update'">
          <el-option v-for="dict in ruleOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="主规则" prop="isPrimaryAccount">
        <el-radio-group v-model="formData.isPrimaryAccount">
          <el-radio label="是" :value="true" border />
          <el-radio label="否" :value="false" border />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { handleRemoteAgencyOptions, getAgencyCommissionPrimaryRulesOptions } from '@/utils/dict'
import { AgencyCommissionBindingApi, AgencyCommissionBindingVO } from '@/api/crm/agency/commission/binding'

/** 代理佣金绑定 表单 */
defineOptions({ name: 'AgencyCommissionBindingForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agencyId: undefined,
  ruleId: undefined,
  isPrimaryAccount: true
})
const formRules = reactive({
  agencyId: [{ required: true, message: '代理为必选项', trigger: 'blur' }],
  ruleId: [{ required: true, message: '佣金规则为必选项', trigger: 'blur' }],
  isPrimaryAccount: [{ required: true, message: '是否为主账号为必选项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, agencyName?: string) => {
  await fetchRemoteAgencyOptions(agencyName)
  ruleOptions.value = await getAgencyCommissionPrimaryRulesOptions()
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  dialogVisible.value = true
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AgencyCommissionBindingApi.getAgencyCommissionBinding(id)
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
    const data = formData.value as unknown as AgencyCommissionBindingVO
    if (formType.value === 'create') {
      await AgencyCommissionBindingApi.createAgencyCommissionBinding(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgencyCommissionBindingApi.updateAgencyCommissionBinding(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {
    message.error(t('sys.api.operationFailed'))
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    agencyId: undefined,
    ruleId: undefined,
    isPrimaryAccount: true
  }
  formRef.value?.resetFields()
}

/* options */
/* agency */
const agencyOptions = ref([])
const agencyOptionsLoading = ref(false)
const fetchRemoteAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (agencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (agencyOptionsLoading.value = newValue)
  handleRemoteAgencyOptions(query, setAgencyOptions, setAgencyLoading)
}

/* rule */
const ruleOptions = ref([])
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>