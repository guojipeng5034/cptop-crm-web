<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请检索并选择学员" clearable filterable remote
          :remote-method="remoteCustomerOptions" :loading="customerOptionsLoading" :disabled="hasCustomerId">
          <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
            :label="option.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="星币数" prop="starCount">
        <el-input-number v-limit-input v-model="formData.starCount" placeholder="请输入星币数" class="!w-100%" :min="0"
          :step="1" step-strictly />
      </el-form-item>
      <el-form-item label="星币来源" prop="starSource">
        <el-select v-model="formData.starSource" clearable filterable placeholder="请选择星币来源">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STAR_SOURCE)" :key="dict.value" :label="dict.label"
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
import { getIntDictOptions, DICT_TYPE, getRemoteCustomersOptions } from '@/utils/dict'
import { CustomerStarApi, CustomerStarVO } from '@/api/crm/sales/star/customerStar'

/** 学员星币管理 表单 */
defineOptions({ name: 'CustomerStarForm' })

const props = defineProps({
  hasCustomerId: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: Number,
    default: undefined
  }
})

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
  customerId: undefined,
  starCount: undefined,
  starSource: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'blur' }],
  starCount: [{ required: true, message: '星币数为必填项', trigger: 'blur' }],
  starSource: [{ required: true, message: '星币来源为必选项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  remoteCustomerOptions(name)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formLoading.value = false
  formData.value.customerId = customerId
  // 修改时，设置数据
  if (id && type === 'update') {
    formLoading.value = true
    try {
      formData.value = await CustomerStarApi.getCustomerStar(id)
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as unknown as CustomerStarVO
    if (formType.value === 'create') {
      await CustomerStarApi.createCustomerStar(data)
      message.success(t('common.createSuccess'))
    } else {
      await CustomerStarApi.updateCustomerStar(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    // formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    customerId: undefined,
    starCount: undefined,
    starSource: undefined
  }
  formRef.value?.resetFields()
}

/* options */
const customerOptions = ref([])
const customerOptionsLoading = ref(false)
const remoteCustomerOptions = async (query: string) => {
  if (query) {
    customerOptionsLoading.value = true
    customerOptions.value = await getRemoteCustomersOptions(query)
    customerOptionsLoading.value = false
  } else {
    customerOptions.value = []
  }
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