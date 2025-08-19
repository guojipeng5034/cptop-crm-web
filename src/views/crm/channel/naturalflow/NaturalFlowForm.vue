<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" v-loading="formLoading">
    <el-row>
      <el-col :span="8">
        <el-form-item label="流量来源" prop="naturalFlowSource">
          <el-select v-model="formData.naturalFlowSource" clearable placeholder="请选择流量来源">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NATURAL_FLOW_SOURCE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="注册方式" prop="naturalFlowRegisterType">
          <el-select v-model="formData.naturalFlowRegisterType" clearable placeholder="请选择注册方式">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="流量状态" prop="status">
          <el-select v-model="formData.status" clearable placeholder="请选择流量状态">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="推广负责人" prop="promotionResponsibleId">
          <el-select v-model="formData.promotionResponsibleId" clearable filterable remote
            :loading="promotionOptionsLoading" :remote-method="fetchRemotePromotionOptions" placeholder="请选择推广负责人">
            <el-option v-for="dict in promotionOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销售负责人" prop="salesResponsibleId">
          <el-select v-model="formData.salesResponsibleId" clearable filterable remote :loading="salesOptionsLoading"
            :remote-method="fetchRemoteSalesOptions" placeholder="请输入销售负责人">
            <el-option v-for="dict in salesOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { ChannelNaturalFlowApi, ChannelNaturalFlowVO } from '@/api/crm/channel/naturalflow'

/** 自然流量渠道 表单 */
defineOptions({ name: 'ChannelNaturalFlowForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  lineType: 102,
  siteId: 1,
  naturalFlowSource: undefined,
  naturalFlowRegisterType: undefined,
  promotionResponsibleId: '',
  salesResponsibleId: '',
  status: 0,
  remark: undefined,
})

/* 传递数据 */
const props = defineProps({
  variProps: {
    type: Object,
    required: true
  },
  funcProps: {
    type: Object,
    required: true
  }
})

/* 表单校验规则 */
const formRules = reactive({
  naturalFlowSource: [{ required: true, message: '流量来源不能为空', trigger: 'change' }],
  naturalFlowRegisterType: [{ required: true, message: '注册方式不能为空', trigger: 'change' }],
  status: [{ required: true, message: '流量状态不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/* 远程搜索 */
// promotion
const promotionOptions = ref()
const promotionOptionsLoading = ref(false)
const fetchRemotePromotionOptions = async (query) => {
  const setUserOptions = (newValue) => (promotionOptions.value = newValue)
  const setUserLoading = (newValue) => (promotionOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
// sales
const salesOptions = ref()
const salesOptionsLoading = ref(false)
const fetchRemoteSalesOptions = async (query) => {
  const setUserOptions = (newValue) => (salesOptions.value = newValue)
  const setUserLoading = (newValue) => (salesOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ChannelNaturalFlowVO
    if (props.variProps.formType === 'createChannel') {
      if (!formData.value.id) {
        try {
          formData.value.id = await ChannelNaturalFlowApi.createChannelNaturalFlow(data)
          message.success(t('common.createSuccess'))
          props.funcProps.next()
        } catch {
          message.error('新增失败')
        }
      } else {
        try {
          await ChannelNaturalFlowApi.updateChannelNaturalFlow(data)
          message.success(t('common.updateSuccess'))
          props.funcProps.next()
        } catch (e) {
          message.error('修改失败')
        }
      }
    } else {
      try {
        await ChannelNaturalFlowApi.updateChannelNaturalFlow(data)
        message.success(t('common.updateSuccess'))
        props.funcProps.close()
      } catch {
        message.error('修改失败')
      }
    }
  } finally {
    formLoading.value = false
  }
}

onBeforeMount(async () => {
  if (props.variProps.formType === 'updateChannel') {
    if (props.variProps.fData.id) {
      formData.value.id = props.variProps.fData.id
      formLoading.value = true
      try {
        formData.value = await ChannelNaturalFlowApi.getChannelNaturalFlow(formData.value.id)
        await fetchRemotePromotionOptions(formData.value.promotionResponsibleName)
        await fetchRemoteSalesOptions(formData.value.salesResponsibleName)
      } finally {
        formLoading.value = false
      }
    }
  }
})
defineExpose({ submitForm, formData })
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>