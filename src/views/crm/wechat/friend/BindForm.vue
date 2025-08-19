<template>
  <Dialog title="绑定学员" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" label-position="right"
      v-loading="formLoading" :validate-on-rule-change="false">
      <el-form-item label="微信昵称：">
        {{ formData.nickName }}
      </el-form-item>
      <el-form-item label="绑定学员：" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions">
          <el-option v-for="item in customerOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { handleRemoteCustomerOptions } from '@/utils/dict'
import { WechatFriendApi } from '@/api/crm/wechat/friend'

/** 工作微信 编辑表单 */
defineOptions({ name: 'BindForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  wechatId: 0,
  nickName: '',
  customerId: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '绑定学员不能为空', trigger: 'blur' },
  ],
})
const formRef = ref() // 表单 Ref

/* options */
// customer
const customerOptions = ref()
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setOptions = (newValue) => (customerOptions.value = newValue)
  const setLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setOptions, setLoading)
}

/** 打开弹窗 */
const open = async (wechatId: number, nickName: string) => {
  dialogVisible.value = true
  resetForm()
  formData.value.wechatId = wechatId
  formData.value.nickName = nickName
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
    const data = formData.value
    await WechatFriendApi.updateUserBind(data)
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
    wechatId: 0,
    nickName: '',
    customerId: undefined,
  }
  formRef.value?.resetFields()
  customerOptions.value = null
  customerOptionsLoading.value = false
}
</script>