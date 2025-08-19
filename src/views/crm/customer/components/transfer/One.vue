<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" inline>
    <el-form-item prop="sourceResponsibleId">
      <el-select v-model="formData.sourceResponsibleId" clearable filterable remote :loading="sourceOptionsLoading"
        :remote-method="fetchRemoteSourceOptions" placeholder="原 mentor" class="!w-200px">
        <el-option v-for="dict in sourceOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <Icon icon="material-symbols:line-end-arrow-notch-rounded" :size="20" />
    </el-form-item>
    <el-form-item prop="targetResponsibleId">
      <el-select v-model="formData.targetResponsibleId" clearable filterable remote :loading="targetOptionsLoading"
        :remote-method="fetchRemoteTargetOptions" placeholder="现 mentor" class="!w-200px">
        <el-option v-for="dict in targetOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { CustomerApi } from '@/api/crm/customer/base'

/* 配置项 */
const message = useMessage() // 消息弹窗
const formRef = ref() // 表单 Ref
const emit = defineEmits(['close'])

/* 表单数据 */
const formData = ref({
  type: undefined,
  sourceResponsibleId: undefined,
  targetResponsibleId: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  sourceResponsibleId: [{ required: true, message: '', trigger: 'blur' }],
  targetResponsibleId: [{ required: true, message: '', trigger: 'blur' }],
})

/* options */
const sourceOptions = ref()
const sourceOptionsLoading = ref(false)
const targetOptions = ref()
const targetOptionsLoading = ref(false)

/* source */
const fetchRemoteSourceOptions = async (query) => {
  const setUserOptions = (newValue) => (sourceOptions.value = newValue)
  const setUserLoading = (newValue) => (sourceOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
/* target */
const fetchRemoteTargetOptions = async (query) => {
  const setUserOptions = (newValue) => (targetOptions.value = newValue)
  const setUserLoading = (newValue) => (targetOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

const submit = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    await CustomerApi.transferAll(formData.value)
    message.success('全量划分成功')
    emit('close')
  } catch (e) {
    message.success('全量划分失败')
  }
}

defineExpose({ submit })
</script>