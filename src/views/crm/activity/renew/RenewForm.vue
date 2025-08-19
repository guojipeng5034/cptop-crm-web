<template>
  <Dialog title="学员续费记录" v-model="dialogVisible" width="600" class="z-100">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120" v-loading="formLoading"
      label-position="top">
      <el-row>
        <el-col :span="11">
          <el-form-item label="拒绝续费类型" prop="refuseRenewType">
            <el-select v-model="formData.refuseRenewType" placeholder="请选择拒绝续费类型" clearable
              popper-class="higher-zindex-select">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="是否有效沟通" prop="effectiveChatFlag">
            <el-switch v-model="formData.effectiveChatFlag" active-text="有效沟通" inactive-text="未有效沟通" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="拒绝续费原因" prop="refuseReason" v-show="formData.refuseRenewType">
            <el-input v-model="formData.refuseReason" type="textarea" placeholder="请详细填写拒绝续费原因" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="有效沟通内容" prop="effectiveContent"
            v-show="formData.effectiveChatFlag || formType === 'update'">
            <el-input v-model="formData.effectiveContent" type="textarea" placeholder="请详细填写有效沟通内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { RenewLogApi, RenewLogVO } from '@/api/crm/activity/renewLog'

/** 续费日志 表单 */
defineOptions({ name: 'RenewLogForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref()

/* 表单数据 */
const formData = ref({
  id: undefined,
  packageRenewId: undefined,
  refuseRenewType: undefined,
  effectiveChatFlag: false,
  refuseReason: '',
  effectiveContent: ''
})

/** 表单校验规则 */
const formRules = reactive({
  // refuseRenewType: [{ required: true, message: '拒绝续费的类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

watch(
  () => ({
    refuseRenewType: formData.value.refuseRenewType,
    effectiveChatFlag: formData.value.effectiveChatFlag
  }),
  ({ refuseRenewType, effectiveChatFlag }) => {
    if (!refuseRenewType && formType === 'create') formData.value.refuseReason = ''
    if (!effectiveChatFlag && formType === 'create') formData.value.effectiveContent = ''
  }
)

/** 打开弹窗 */
const open = async (type: string, id: number) => {
  dialogVisible.value = true
  resetForm()
  formType.value = type
  if (type === 'create') {
    formData.value.packageRenewId = id
  } else if (type === 'update') {
    // 获取续费日志详情
    formData.value = await RenewLogApi.getCustomerPackageRenewLog(id)
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
    const data = formData.value as unknown as RenewLogVO
    if (formType.value === 'create') {
      await RenewLogApi.createCustomerPackageRenewLog(data)
      message.success(t('common.createSuccess'))
    } else {
      await RenewLogApi.updateCustomerPackageRenewLog(data)
      message.success(t('common.updateSuccess'))
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
    id: undefined,
    packageRenewId: undefined,
    refuseRenewType: undefined,
    refuseReason: '',
    effectiveChatFlag: false,
    effectiveContent: ''
  }
  formRef.value?.resetFields()
}
</script>

<style>
.higher-zindex-select {
  z-index: 9999 !important;
}
</style>