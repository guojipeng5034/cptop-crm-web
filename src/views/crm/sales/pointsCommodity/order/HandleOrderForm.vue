<template>
  <Dialog title="处理订单" v-model="dialogVisible" width="20%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading">
      <el-form-item label="快递单号" prop="courierNumber" v-if="needAddress === true">
        <el-input v-model="formData.courierNumber" placeholder="请输入快递单号" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请填写备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PointsCommodityOrderApi, pointsCommodityOrderHandleVO } from '@/api/crm/sales/pointsCommodity/order'

/** 积分商品订单处理 表单 */
defineOptions({ name: 'HandleOrderForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const needAddress = ref(false)

/* 表单数据 */
const formData = ref({
  id: undefined,
  ids: [],
  courierNumber: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id: number, address: string, selectedIds: number[]) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = id
  if (selectedIds !== undefined) {
    formData.value.ids = selectedIds
  }
  if (address !== null) {
    needAddress.value = true
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
    const data = formData.value as unknown as pointsCommodityOrderHandleVO
    if(formData.value.id) {
      delete data.ids
      await PointsCommodityOrderApi.handlePointsOrder(data)
    } else {
      delete data.id
      delete data.courierNumber
      await PointsCommodityOrderApi.handlePointsOrderBatch(data)
      emit('cancelSelection')
    }
    message.success('处理成功')
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
    ids: [],
    courierNumber: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
  needAddress.value = false
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