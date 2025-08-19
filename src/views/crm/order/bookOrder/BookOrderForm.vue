<template>
  <Dialog title="修改信息" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="85" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学员" prop="studentName">
            <el-input v-model="formData.studentName" disabled placeholder="请输入学员" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书名" prop="bookName">
            <el-select v-model="formData.bookName" disabled placeholder="请选择书名">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货人" prop="receiveName">
            <el-input v-model="formData.receiveName" :disabled="status === 2" placeholder="请输入收货人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货电话" prop="receivePhone">
            <el-input v-model="formData.receivePhone" :disabled="status === 2" placeholder="请输入收货电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货地址" prop="receiveAddress">
            <el-input v-model="formData.receiveAddress" :disabled="status === 2" placeholder="请输入收货地址" />
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <div class="pt-2 text-sky text-3.8 font-600">「书籍订单发货后无法修改信息」</div>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { BookOrderApi, BookOrderVO } from '@/api/crm/order/bookOrder'

/** 书籍订单信息 表单 */
defineOptions({ name: 'BookOrderForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  studentName: undefined,
  bookName: undefined,
  receiveAddress: undefined,
  receiveName: undefined,
  receivePhone: undefined,
  remark: undefined,
})
const status = ref() // 书籍订单状态

const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    formData.value = await BookOrderApi.getBookOrder(row.id)
    formData.value.studentName = row.customerName
    status.value = row.status
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
    const data = formData.value as unknown as BookOrderVO
    await BookOrderApi.updateBookOrder(data)
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
    studentName: undefined,
    bookName: undefined,
    receiveAddress: undefined,
    receiveName: undefined,
    receivePhone: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>