<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600" :fullscreen="false">
    <el-form ref="formRef" :model="formData" v-loading="formLoading" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="支付截图" prop="transferImage">
            <template v-if="formData.transferImage && formData.transferImage[0]">
              <el-image :src="formData.transferImage[0]" :preview-src-list="formData.transferImage" :zoom-rate="1.2"
                :max-scale="7" :min-scale="0.2" :initial-index="0" fit="scale-down" class="image-preview">
                <template #error>
                  <div class="image-preview">
                    <el-icon :size="100">
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </template>
            <template v-else>
              <div class="image-preview">
                <el-icon :size="100">
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="p-inline-4">
          <el-form-item label="实付日期" prop="paymentTime">
            <el-date-picker v-if="formType === 'create'" v-model="formData.paymentTime" type="datetime" value-format="x"
              clearable placeholder="请选择实付日期" />
            <span v-else>{{ formatDate(formData.paymentTime) }}</span>
          </el-form-item>
          <el-form-item label="备注" prop="paymentRemark" class="m-t-8">
            <div class="w-100%">{{ formData.paymentRemark }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div v-if="formType === 'create'">
        <el-button @click="updateOrderStatus(2)" type="danger" :disabled="formLoading">驳 回</el-button>
        <el-button @click="updateOrderStatus(1)" type="primary" :disabled="formLoading">通 过</el-button>
      </div>
      <div v-else>
        <el-button @click="dialogVisible = false" type="primary" :disabled="formLoading">关闭</el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatTime'
import { PackageOrderApi, AuditOrderVO } from '@/api/crm/order/package'

/** 订单审核 表单 */
defineOptions({ name: 'AuditOrderForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
// const dialogTitle = ref('订单审核') // 弹窗的标题
const dialogTitle = computed(() => formType.value === 'create' ? '订单审核' : '审核详情') // 弹窗的标题
const formType = ref()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  paymentId: undefined,
  auditStatus: undefined,
  paymentTime: undefined,
  transferImage: [],
  paymentRemark: undefined,
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (paymentId: number, type?: string) => {
  dialogVisible.value = true
  formType.value = type
  resetForm()
  try {
    const res = await PackageOrderApi.getPaymentRecord(paymentId)
    const { id, paymentTime, transferImage, paymentRemark } = res
    formData.value = {
      paymentId: id,
      auditStatus: undefined,
      paymentTime,
      transferImage,
      paymentRemark
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const updateOrderStatus = async (status: number) => {
  formData.value.auditStatus = status
  // 提交请求
  formLoading.value = true
  const type1 = status === 1 ? '通过' : '驳回'
  await ElMessageBox.confirm(`是否确认对该订单审核${type1}？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const data = formData.value as unknown as AuditOrderVO
      await PackageOrderApi.auditPendingOrder(data)
      message.success(`审核${type1}成功！`)
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } catch (e) {
      message.error(`${type1}审核失败！`)
    } finally {
      formLoading.value = false
    }
  }).catch(() => {
    formLoading.value = false
  })
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    paymentId: undefined,
    auditStatus: undefined,
    paymentTime: undefined,
    transferImage: [],
    paymentRemark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  font-weight: 700;
}

.image-preview {
  width: 100%;
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
