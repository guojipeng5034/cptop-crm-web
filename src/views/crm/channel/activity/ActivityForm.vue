<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
    <el-row>
      <el-col :span="16">
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activityName">
              <el-input placeholder="请输入活动名称" v-model="formData.activityName" ref="inputRef" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动状态" prop="status">
              <el-select v-model="formData.status" clearable placeholder="请选择活动状态">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推广负责人" prop="promotionResponsibleId">
              <el-select v-model="formData.promotionResponsibleId" filterable clearable remote
                :loading="promotionOptionsLoading" :remote-method="fetchRemotePromotionOptions" placeholder="请选择推广负责人">
                <el-option v-for="dict in promotionOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售负责人" prop="salesResponsibleId">
              <el-select v-model="formData.salesResponsibleId" filterable clearable remote
                :loading="salesOptionsLoading" :remote-method="fetchRemoteSalesOptions" placeholder="请选择销售负责人">
                <el-option v-for="dict in salesOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { ChannelActivityApi, ChannelActivityVO } from '@/api/crm/channel/activity'

/** 活动 表单 */
defineOptions({ name: 'ActivityForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  lineType: 102,
  siteId: 1,
  activityName: '',
  promotionResponsibleId: '',
  salesResponsibleId: '',
  status: 0,
  remark: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  activityDate: [{ required: true, message: '活动日期不能为空', trigger: 'change' }],
  activityType: [{ required: true, message: '活动类型不能为空', trigger: 'change' }],
  activityName: [{ required: true, message: '活动名称不能为空', trigger: 'change' }],
  status: [{ required: true, message: '活动状态不能为空', trigger: 'change' }],
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
const formRef = ref()

/* options */
// 1.promotion
const promotionOptions = ref()
const promotionOptionsLoading = ref(false)
const fetchRemotePromotionOptions = async (query) => {
  const setUserOptions = (newValue) => (promotionOptions.value = newValue)
  const setUserLoading = (newValue) => (promotionOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
// 2.sales
const salesOptions = ref()
const salesOptionsLoading = ref(false)
const fetchRemoteSalesOptions = async (query) => {
  const setUserOptions = (newValue) => (salesOptions.value = newValue)
  const setUserLoading = (newValue) => (salesOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
// 3.activityType
const activityTypeOption = ref()

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ChannelActivityVO
    if (props.variProps.formType === 'createChannel') {
      if (!formData.value.id) {
        try {
          formData.value.id = await ChannelActivityApi.createChannelActivity(data)
          message.success(t('common.createSuccess'))
          // 正常请求成功, 执行next方法跳转到下一页表单
          props.funcProps.next()
        } catch (e) {
          // 网络请求错误, 不执行到next(), 不跳转到下一页表单
          message.error('新增失败')
        }
      } else {
        try {
          await ChannelActivityApi.updateChannelActivity(data)
          message.success(t('common.updateSuccess'))
          props.funcProps.next()
        } catch (e) {
          message.error('修改失败')
        }
      }
    } else {
      await ChannelActivityApi.updateChannelActivity(data)
      message.success(t('common.updateSuccess'))
      props.funcProps.close()
    }
  } finally {
    formLoading.value = false
  }
}
onBeforeMount(async () => {
  activityTypeOption.value = getIntDictOptions(DICT_TYPE.CRM_ACTIVITY_TYPE)
  if (props.variProps.formType === 'updateChannel') {
    if (props.variProps.fData.id) {
      formData.value.id = props.variProps.fData.id
      formLoading.value = true
      try {
        formData.value = await ChannelActivityApi.getChannelActivity(formData.value.id)
        await fetchRemotePromotionOptions(formData.value.promotionResponsibleName)
        await fetchRemoteSalesOptions(formData.value.salesResponsibleName)
      } finally {
        formLoading.value = false
      }
    }
  }
})
defineExpose({ formData, submitForm })
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>