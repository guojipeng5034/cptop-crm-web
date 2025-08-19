<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
    <el-row>
      <el-col :span="8">
        <el-form-item label="广告活动名称" prop="adName">
          <el-input v-model="formData.adName" placeholder="请输入广告活动名称" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投放渠道" prop="adChannel">
          <el-select v-model="formData.adChannel" clearable placeholder="请选择投放渠道">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投放平台" prop="adPlatform">
          <el-select v-model="formData.adPlatform" clearable placeholder="请选择投放平台">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="广告方式" prop="adMode">
          <el-select v-model="formData.adMode" clearable placeholder="请选择广告方式">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_MODE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投放日期" prop="adStartTime">
          <el-date-picker v-model="formData.adStartTime" placeholder="请选择投放日期" type="date"
            :disabled-date="(time) => disabledAfterEndDate(time, formData.adEndTime)" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="结束日期" prop="adEndTime">
          <el-date-picker v-model="formData.adEndTime" placeholder="请选择结束日期" type="date"
            :disabled-date="(time) => disabledBeforeStartDate(time, formData.adStartTime)" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="广告状态" prop="adStatus">
          <el-select v-model="formData.adStatus" clearable placeholder="请选择广告状态">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_STATUS)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="推广负责人" prop="promotionResponsibleId">
          <el-select v-model="formData.promotionResponsibleId" filterable clearable remote
            :loading="promotionOptionsLoading" :remote-method="fetchRemotePromotionOptions" placeholder="请选择推广负责人">
            <el-option v-for="dict in promotionOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销售负责人" prop="salesResponsibleId">
          <el-select v-model="formData.salesResponsibleId" filterable clearable remote :loading="salesOptionsLoading"
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
import { disabledAfterEndDate, disabledBeforeStartDate, dateObjectToStr2 } from '@/utils/formatTime'
import { ChannelAdvertisementApi, ChannelAdvertisementVO } from '@/api/crm/channel/advertisement'

/** 广告 表单 */
defineOptions({ name: 'AdvertisementForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  lineType: 102,
  siteId: 1,
  adName: undefined,
  adChannel: undefined,
  adPlatform: undefined,
  adMode: undefined,
  adTime: '',
  adStartTime: '',
  adEndTime: '',
  adStatus: 0,
  promotionResponsibleId: '',
  salesResponsibleId: '',
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
  adName: [{ required: true, message: '广告活动名称不能为空', trigger: 'blur' }],
  adChannel: [{ required: true, message: '投放渠道不能为空', trigger: 'change' }],
  adPlatform: [{ required: true, message: '投放平台不能为空', trigger: 'change' }],
  adMode: [{ required: true, message: '广告方式不能为空', trigger: 'change' }],
  adStartTime: [{ required: true, message: '投放时间不能为空', trigger: 'change' }],
  adEndTime: [{ required: true, message: '失效时间不能为空', trigger: 'change' }],
  adStatus: [{ required: true, message: '广告状态不能为空', trigger: 'change' }],
})

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
    formData.value.adStartTime = dateObjectToStr2(formData.value.adStartTime)
    formData.value.adEndTime = dateObjectToStr2(formData.value.adEndTime)
    const data = formData.value as unknown as ChannelAdvertisementVO
    if (props.variProps.formType === 'createChannel') {
      if (!formData.value.id) {
        try {
          formData.value.id = await ChannelAdvertisementApi.createChannelAdvertisement(data)
          message.success(t('common.createSuccess'))
          props.funcProps.next()
        } catch (e) {
          formData.value.adStartTime = ''
          formData.value.adEndTime = ''
          message.error('新增失败')
        }
      } else {
        try {
          await ChannelAdvertisementApi.updateChannelAdvertisement(data)
          message.success(t('common.updateSuccess'))
          props.funcProps.next()
        } catch (e) {
          message.error('修改失败')
        }
      }
    } else {
      try {
        await ChannelAdvertisementApi.updateChannelAdvertisement(data)
        message.success(t('common.updateSuccess'))
        props.funcProps.close()
      } catch (e) {
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
        formData.value = await ChannelAdvertisementApi.getChannelAdvertisement(formData.value.id)
        await fetchRemotePromotionOptions(formData.value.promotionResponsibleName)
        await fetchRemoteSalesOptions(formData.value.salesResponsibleName)
        formData.value.adStartTime = new Date(formData.value.adStartTime)
        formData.value.adEndTime = new Date(formData.value.adEndTime)
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