<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
    <el-row>
      <el-col :span="8">
        <el-form-item label="新媒体业务" prop="newMediaBusiness">
          <el-select v-model="formData.newMediaBusiness" clearable placeholder="请选择新媒体业务">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="新媒体平台" prop="newMediaPlatform">
          <el-select v-model="formData.newMediaPlatform" clearable placeholder="请选择新媒体平台">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="formData.accountName" placeholder="请输入账号名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="账号定位" prop="accountPosition">
          <el-select v-model="formData.accountPosition" clearable placeholder="请选择账号定位">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_POSITION)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="账号类型" prop="accountType">
          <el-select v-model="formData.accountType" clearable placeholder="请选择账号类型">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="企业认证主体" prop="accountSubject">
          <el-input v-model="formData.accountSubject" placeholder="请输入企业认证主体" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="绑定手机号" prop="accountPhone">
          <el-input v-model="formData.accountPhone" placeholder="请输入绑定手机号" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="账号状态" prop="accountStatus">
          <el-select v-model="formData.accountStatus" clearable placeholder="请选择账号状态">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_STATUS)" :key="dict.value" :label="dict.label"
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
            :remote-method="fetchRemoteSalesOptions" placeholder="请选择销售负责人">
            <el-option v-for="dict in salesOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { ChannelNewMediaApi, ChannelNewMediaVO } from '@/api/crm/channel/newmedia'

/** 新媒体渠道 表单 */
defineOptions({ name: 'NewMediaForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  lineType: 102,
  siteId: 1,
  newMediaBusiness: undefined,
  newMediaPlatform: undefined,
  accountName: undefined,
  accountPosition: undefined,
  accountType: undefined,
  accountSubject: undefined,
  accountPhone: undefined,
  accountStatus: 0,
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
  newMediaBusiness: [{ required: true, message: '新媒体业务不能为空', trigger: 'change' }],
  newMediaPlatform: [{ required: true, message: '新媒体平台不能为空', trigger: 'change' }],
  accountName: [{ required: true, message: '账号名不能为空', trigger: 'blur' }],
  accountPosition: [{ required: true, message: '账号定位不能为空', trigger: 'change' }],
  accountType: [{ required: true, message: '账号类型不能为空', trigger: 'change' }],
  accountPhone: [{ required: true, message: '绑定手机号不能为空', trigger: 'blur' }],
  accountStatus: [{ required: true, message: '账号状态不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/* 远程搜索 */
/* promotion */
const promotionOptions = ref()
const promotionOptionsLoading = ref(false)
const fetchRemotePromotionOptions = async (query) => {
  const setUserOptions = (newValue) => (promotionOptions.value = newValue)
  const setUserLoading = (newValue) => (promotionOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
/* sales */
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
    const data = formData.value as unknown as ChannelNewMediaVO
    if (props.variProps.formType === 'createChannel') {
      if (!formData.value.id) {
        try {
          formData.value.id = await ChannelNewMediaApi.createChannelNewMedia(data)
          message.success(t('common.createSuccess'))
          props.funcProps.next()
        } catch {
          message.error('新增失败')
        }
      } else {
        try {
          await ChannelNewMediaApi.updateChannelNewMedia(data)
          message.success(t('common.updateSuccess'))
          props.funcProps.next()
        } catch (e) {
          message.error('修改失败')
        }
      }
    } else {
      try {
        await ChannelNewMediaApi.updateChannelNewMedia(data)
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
        formData.value = await ChannelNewMediaApi.getChannelNewMedia(formData.value.id)
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