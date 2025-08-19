<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="学员" prop="customerId">
        <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
          :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" :disabled="hasCustomerId">
          <el-option v-for="option in customerOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="变动原因" prop="channel">
        <el-select v-model="formData.channel" placeholder="请选择变动原因" clearable filterable>
          <el-option v-for="item in pointChangeReasonOptions" :key="item.value" :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="变动积分" prop="pointsNum">
        <el-input-number v-limit-input v-model="formData.pointsNum" placeholder="请输入变动积分" :step="1" :min="0"
          :max="formType === 'add' ? 999999999 : removeMax" step-strictly class="!w-100%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="PS: 如果不备注, 会自动根据变更原因自动生成备注!" type="textarea" clearable
          show-word-limit maxlength="500" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  getIntDictOptions,
  handleRemoteCustomerOptions,
  DICT_TYPE
} from '@/utils/dict'

import { CustomerPointApi, CustomerPointVO } from '@/api/crm/sales/point/customerPoint'

/** 学员积分记录 表单 */
defineOptions({ name: 'PointsLogForm' })

const props = defineProps({
  hasCustomerId: {
    type: Boolean,
    default: false
  }
})

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：add - 添加；remove - 扣除

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  pointsNum: undefined,
  channel: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'change' }],
  channel: [{ required: true, message: '变动原因为必选项', trigger: 'change' }],
  pointsNum: [{ required: true, message: '变动积分为必填项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/* options */
/* customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])

const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 积分变动原因 */
const addtionPointChangeReasonDictValues = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11] // 添加积分变动原因字典值
const deductionPointChangeReasonDictValues = [8, 101, 102, 103, 104, 105, 106] // 扣除积分变动原因字典值
const pointChangeReasonOptions = ref([]) // 下拉框 options
const getPointChangeReasonOptions = async () => {
  const allReasons = await getIntDictOptions(DICT_TYPE.CRM_POINTS_ADD_CHANNEL)
  if (formType.value === 'add') {
    pointChangeReasonOptions.value = allReasons.filter((item) => addtionPointChangeReasonDictValues.includes(item.value))
  } else if (formType.value === 'remove') {
    pointChangeReasonOptions.value = allReasons.filter((item) => deductionPointChangeReasonDictValues.includes(item.value))
  }
}

const removeMax = ref(0)

/** 打开弹窗 */
const open = async (type: string, name?: string, customerId?: number, max?: number) => {
  fetchRemoteCustomerOptions(customerId)
  getPointChangeReasonOptions()
  formType.value = type
  dialogTitle.value = t('action.' + type) + '积分'
  dialogVisible.value = true
  resetForm()
  removeMax.value = max
  formData.value.customerId = customerId
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
    const data = Object.assign({}, formData.value as unknown as CustomerPointVO)
    if (formType.value === 'remove') data.pointsNum = 0 - data.pointsNum // 扣除积分需要取反
    ElMessageBox.confirm(
      '请确认是否对学员积分进行修改？',
      '积分变动确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        await CustomerPointApi.createCustomerPoint(data)
        ElMessage({
          type: 'success',
          message: '学员积分变动成功！',
        })
        dialogVisible.value = false
        emit('success')
      })
      .catch(() => {
        formLoading.value = false
      })
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    customerId: undefined,
    pointsNum: undefined,
    channel: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
  customerOptions.value = []
  customerOptionsLoading.value = false
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