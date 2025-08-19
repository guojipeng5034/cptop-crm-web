<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-form-item label="当前订单类型" prop="oldPackageId">
        <arco-tag :type="DICT_TYPE.CRM_ORDER_BILLING_TYPE" :value="orderType" />
      </el-form-item>
      <el-form-item label="新订单类型" prop="orderType">
        <el-select v-model="formData.orderType" filterable clearable placeholder="请选择想要更换的订单类型">
          <el-option v-for="dict in orderTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { PackageOrderApi } from '@/api/crm/order/package'

/** 学员账号 表单 */
defineOptions({ name: 'ChangeOrderTypeFrom' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('更换订单类型') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const orderType = ref()

/* 表单数据 */
const formData = ref({
  orderId: undefined,
  orderType: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  orderType: [{ required: true, message: '新订单类型不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** options  */
const orderTypeOption = ref()

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  orderType.value = row.orderType
  formData.value.orderId = row.id
  formLoading.value = true
  try {
    const res = await PackageOrderApi.getOrderType(row.customerId)
    orderTypeOption.value = getIntDictOptions(DICT_TYPE.CRM_ORDER_BILLING_TYPE).filter(item => res.includes(item.value))
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
    await PackageOrderApi.updateOrderType(formData.value.orderId, formData.value.orderType)
    message.success('成功更改订单类型')
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
    orderType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
