<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" inline>
    <a-transfer :data="sourceValue" draggable show-search :source-input-search-props="{ placeholder: '请输入学员名' }"
      :target-input-search-props="{ placeholder: '请输入学员名' }" @change="handleTransferChange">
      <template #source-title="{
        countTotal,
        countSelected,
        checked,
        indeterminate,
        onSelectAllChange,
      }">
        <el-row class="flex items-center" type="flex" justify="space-between">
          <el-col :span="14">
            <el-form-item prop="targetResponsibleId">
              <el-select v-model="formData.sourceResponsibleId" clearable filterable remote
                :loading="sourceOptionsLoading" :remote-method="fetchRemoteSourceOptions" placeholder="原 mentor"
                class="!w-170px">
                <el-option v-for="dict in sourceOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" :offset="1">
            <el-button :icon="Search" size="small" circle class="ml-2" @click="handleSourceQuery" />
          </el-col>
          <el-col :span="2" :offset="2" class="text-3 text-#86909C mt-1">
            {{ countSelected }}-{{ countTotal }}
          </el-col>
          <el-col :span="2">
            <a-checkbox :model-value="checked" :indeterminate="indeterminate" @change="onSelectAllChange"
              class="mt-4" />
          </el-col>
        </el-row>
      </template>
      <template #target-title="{
        countTotal,
        countSelected,
        checked,
        indeterminate,
        onSelectAllChange,
      }">
        <el-row class="flex items-center" type="flex" justify="space-between">
          <el-col :span="14">
            <el-form-item prop="targetResponsibleId">
              <el-select v-model="formData.targetResponsibleId" clearable filterable remote
                :loading="targetOptionsLoading" :remote-method="fetchRemoteTargetOptions" placeholder="现 mentor"
                class="!w-170px">
                <el-option v-for="dict in targetOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" :offset="4" class="text-3 text-#86909C mt-1">
            {{ countSelected }}-{{ countTotal }}
          </el-col>
          <el-col :span="2">
            <a-checkbox :model-value="checked" :indeterminate="indeterminate" @change="onSelectAllChange"
              class="mt-4" />
          </el-col>
        </el-row>
      </template>
    </a-transfer>
  </el-form>
</template>
<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { CustomerApi } from '@/api/crm/customer/base'
import { Search } from '@element-plus/icons-vue'

/* 配置项 */
const message = useMessage() // 消息弹窗
const sourceValue = ref([]) // 列表的数据
const formLoading = ref(false) // 列表的加载中
const formRef = ref() // 表单 Ref
const emit = defineEmits(['close'])

/* 表单数据 */
const formData = ref({
  sourceResponsibleId: undefined,
  targetResponsibleId: undefined,
  customerIds: []
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
const fetchRemoteTargetOptions = async (query) => {
  const setUserOptions = (newValue) => (targetOptions.value = newValue)
  const setUserLoading = (newValue) => (targetOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

const getSourceList = async () => {
  formLoading.value = true
  try {
    const data = await CustomerApi.getMentorCustomerList(formData.value.sourceResponsibleId)
    sourceValue.value = data.map((item) => ({
      value: item.id,
      label: item.name,
    }))
  } finally {
    formLoading.value = false
  }
}

const handleTransferChange = (v) => {
  formData.value.customerIds = v
}

/** 搜索按钮操作 */
const handleSourceQuery = async () => {
  if (formData.value.sourceResponsibleId) {
    await getSourceList()
  } else {
    sourceValue.value = []
    return
  }
}

const submit = async () => {
  // 校验表单
  await formRef.value.validate()
  if (formData.value.customerIds.length === 0) {
    message.error('请至少选择一个学员进行划分')
    return
  }
  try {
    await CustomerApi.transferBatch(formData.value)
    message.success('批量划分成功')
    emit('close')
  } catch (e) {
    message.error('批量划分失败')
  }
}

defineExpose({ submit })
</script>
<style scoped lang="scss">
:deep(.arco-transfer-view-header) {
  height: 50px;
}

:deep(.arco-transfer-view) {
  width: 300px;
  height: 300px;
}

:deep(.el-form-item--small),
:deep(.el-form-item--default),
:deep(.el-form-item--large) {
  margin-bottom: 0px;
}
</style>
