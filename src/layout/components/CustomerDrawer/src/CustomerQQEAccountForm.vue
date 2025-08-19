<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="60" v-loading="formLoading">
      <el-form-item label="站点" prop="siteId">
        <el-radio-group v-model="formData.siteId">
          <template v-for="item in siteOptions" :key="item.value">
            <el-radio-button :label="item.label" :value="item.value" :disabled="item.disabled" />
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CustomerAccountApi, CustomerAccountVO } from '@/api/crm/customer/account'
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'

/** 学员账号 表单 */
defineOptions({ name: 'CustomerAccountForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('创建QQE账号') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  customerId: undefined,
  siteId: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  siteId: [{ required: true, message: '站点为必选项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

// 临时
/* options */
// site
let siteOptions = getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE).map((item) => ({
  ...item,
  disabled: false
}))

/** 打开弹窗 */
const open = async (customerId: number) => {
  dialogVisible.value = true
  // 临时
  formLoading.value = true
  try {
    const accountList = await CustomerAccountApi.getCustomerAccountStudentList(customerId)
    const siteIds = new Set(accountList.map(account => account.siteId))
    siteOptions = siteOptions.map(item => ({
      ...item,
      disabled: siteIds.has(item.value)
    }))
  } finally {
    formLoading.value = false
  }
  resetForm(customerId)
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
    const data = formData.value as unknown as CustomerAccountVO
    const customerInfo = await CustomerApi.getCustomer(data.customerId)
    // 校验学员信息
    if (data.siteId === 102 || data.siteId === 113) {
      if (!customerInfo.mail) {
        ElNotification({
          title: '提示',
          message: '该学员还未设置邮箱，请先完善邮箱信息。',
          type: 'warning',
        })
        return
      }
    } else if (data.siteId === 600) {
      if (!customerInfo.phone) {
        ElNotification({
          title: '提示',
          message: '该学员还未设置电话号码，请先完善电话号码信息。',
          type: 'warning',
        })
        return
      }
    }
    await CustomerAccountApi.createCustomerAccount(data)
    message.success('QQE账户创建成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (customerId) => {
  formData.value = {
    customerId,
    siteId: undefined
  }
  formRef.value?.resetFields()
}
</script>
