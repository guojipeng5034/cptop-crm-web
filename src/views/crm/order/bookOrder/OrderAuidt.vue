<template>
  <Dialog title="发货" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="85" v-loading="formLoading">
      <el-form-item label="快递单号" prop="courierNumber">
        <el-input v-model="formData.courierNumber" placeholder="请输入快递单号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BookOrderApi, BookOrderVO } from '@/api/crm/order/bookOrder'

/** 书籍订单信息 表单 */
defineOptions({ name: 'BookOrderForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  orderId: undefined,
  courierNumber: '',
})

/* 表单校验规则 */
const formRules = reactive({
  courierNumber: [
    { required: true, message: '快递单号不能为空', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('快递单号不能为空'))
        }
      }, trigger: 'blur'
    }
  ],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (orderId) => {
  dialogVisible.value = true
  resetForm()
  formLoading.value = true
  try {
    formData.value.orderId = orderId
  } finally {
    formLoading.value = false
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    formData.value.courierNumber = formData.value.courierNumber.trim()
    const data = formData.value as unknown as BookOrderVO
    await BookOrderApi.auidtBookOrder(data)
    message.success('发货成功')
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
    orderId: undefined,
    courierNumber: '',
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>