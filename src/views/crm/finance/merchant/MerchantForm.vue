<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="商户类型" prop="merchantType">
        <el-select v-model="formData.merchantType" placeholder="请选择商户类型">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PAYMENT_LIST)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商户名" prop="merchantName">
        <el-input v-model="formData.merchantName" placeholder="请输入商户名" />
      </el-form-item>
      <el-form-item label="货币类型" prop="currencyType">
        <el-select v-model="formData.currencyType" placeholder="请选择货币类型">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_PAYMENT_CURRENCY)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { MerchantApi, MerchantVO } from '@/api/crm/finance/merchant'

/** 商户基础配置 表单 */
defineOptions({ name: 'MerchantForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* 表单数据 */
const formData = ref({
  id: undefined,
  merchantType: undefined,
  merchantName: undefined,
  currencyType: 1,
  status: 0
})

/* 表单校验规则 */
const formRules = reactive({
  merchantType: [{ required: true, message: '商户类型不能为空', trigger: 'change' }],
  merchantName: [{ required: true, message: '商户名不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  formLoading.value = false
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MerchantApi.getMerchant(id)
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as unknown as MerchantVO
    if (formType.value === 'create') {
      await MerchantApi.createMerchant(data)
      message.success(t('common.createSuccess'))
    } else {
      await MerchantApi.updateMerchant(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    merchantName: undefined,
    merchantType: undefined,
    currencyType: 1,
    status: 0
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>