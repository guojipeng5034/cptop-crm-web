<template>
  <Dialog title="修改工作微信" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-form-item label="归属员工" prop="owner">
        <el-select v-model="formData.owner" clearable filterable remote :loading="userOptionsLoading"
          :remote-method="fetchRemoteUserOptions" placeholder="请检索归属员工">
          <el-option v-for="dict in userOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="号码归属地" prop="phoneHomePlace">
        <el-input v-model="formData.phoneHomePlace" placeholder="请输入号码归属地" />
      </el-form-item>
      <el-form-item label="实名认证" prop="realName">
        <el-select v-model="formData.realName" placeholder="请选择是否实名认证">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_BOOLEAN_INTEGER)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定银行卡" prop="bindBank">
        <el-select v-model="formData.bindBank" placeholder="请选择是否绑定银行卡">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_BOOLEAN_INTEGER)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付密码" prop="payPassword">
        <el-input v-model="formData.payPassword" v-only-numbers type="password" show-password
          placeholder="请输入6位数字支付密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { WechatRecordApi, WechatRecordVO } from '@/api/crm/wechat/record'

/** 工作微信 编辑表单 */
defineOptions({ name: 'EditForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  owner: undefined,
  ownerName: '',
  phoneHomePlace: undefined,
  realName: undefined,
  bindBank: undefined,
  payPassword: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  payPassword: [
    { min: 6, max: 6, message: '支付密码格式必须为六位数字', trigger: 'blur' },
  ],
})
const formRef = ref() // 表单 Ref

/* options */
// user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    formData.value = await WechatRecordApi.getWechatRecord(id)
    fetchRemoteUserOptions(formData.value.ownerName)
  } finally {
    formLoading.value = false
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
    const data = formData.value as unknown as WechatRecordVO
    await WechatRecordApi.updateWechatRecord(data)
    message.success(t('common.updateSuccess'))
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
    owner: undefined,
    ownerName: '',
    phoneHomePlace: undefined,
    realName: undefined,
    bindBank: undefined,
    payPassword: undefined,
  }
  formRef.value?.resetFields()
  userOptionsLoading.value = false
  // userOptions.value = {}
}
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>