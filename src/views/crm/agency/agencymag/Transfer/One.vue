<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" inline>
    <el-form-item class="mr-3!" prop="type">
      <el-select v-model="formData.type" clearable placeholder="负责人类型" class="!w-150px">
        <el-option v-for="dict in getIntDictOptions(DICT_TYPE.AGENCY_RESPONSIBLE_TYPE)" :key="dict.value"
          :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item prop="sourceResponsibleId">
      <el-select v-model="formData.sourceResponsibleId" clearable filterable remote :loading="sourceOptionsLoading"
        :remote-method="fetchRemoteSourceOptions" placeholder="原负责人" class="!w-150px">
        <el-option v-for="dict in sourceOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <Icon icon="material-symbols:line-end-arrow-notch-rounded" :size="20" />
    </el-form-item>
    <el-form-item class="mr-3!" prop="type">
      <el-select v-model="formData.type" clearable placeholder="负责人类型" class="!w-150px">
        <el-option v-for="dict in getIntDictOptions(DICT_TYPE.AGENCY_RESPONSIBLE_TYPE)" :key="dict.value"
          :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item prop="targetResponsibleId">
      <el-select v-model="formData.targetResponsibleId" clearable filterable remote :loading="targetOptionsLoading"
        :remote-method="fetchRemoteTargetOptions" placeholder="现负责人" class="!w-150px">
        <el-option v-for="dict in targetOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ChannelAgencyApi } from '@/api/crm/agency/agencymag'
import { handleRemoteUserOptions } from '@/utils/dict'

/* 配置项 */
const emit = defineEmits(['close'])

/* 表单数据 */
const formData = ref({
  type: undefined,
  sourceResponsibleId: undefined,
  targetResponsibleId: undefined,
})
const formRef = ref() // 表单 Ref

/* 表单校验规则 */
const formRules = reactive({
  type: [{ required: true, message: '', trigger: 'change' }],
  sourceResponsibleId: [{ required: true, message: '', trigger: 'blur' }],
  targetResponsibleId: [{ required: true, message: '', trigger: 'blur' }],
})

/* options */
// 1.source
const sourceOptions = ref()
const sourceOptionsLoading = ref(false)
const fetchRemoteSourceOptions = async (query) => {
  const setUserOptions = (newValue) => (sourceOptions.value = newValue)
  const setUserLoading = (newValue) => (sourceOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
// 2.target
const targetOptions = ref()
const targetOptionsLoading = ref(false)
const fetchRemoteTargetOptions = async (query) => {
  const setUserOptions = (newValue) => (targetOptions.value = newValue)
  const setUserLoading = (newValue) => (targetOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

const submit = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    await ChannelAgencyApi.transferAllChannelAgency(formData.value)
    emit('close')
    inject('getList')
  } catch (e) { }
}

defineExpose({ submit })
</script>