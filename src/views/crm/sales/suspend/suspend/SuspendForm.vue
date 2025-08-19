<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效期类型" prop="validityType">
            <el-select v-model="formData.validityType" placeholder="请选择有效期类型" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.VALIDITY_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效天数" prop="expireDays" v-if="formData.validityType === 1">
            <el-input v-only-numbers v-model="formData.expireDays" placeholder="请输入有效天数" />
          </el-form-item>
          <el-form-item label="有效日期" prop="fixedTime" v-else-if="formData.validityType === 2">
            <el-date-picker v-model="formData.fixedTime" type="daterange" value-format="x" start-placeholder="生效日期"
              end-placeholder="失效日期" clearable :disabled-date="disabledBeforeDate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select v-model="formData.enableStatus" placeholder="请选择启用状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架状态" prop="getatableStatus">
            <el-select v-model="formData.getatableStatus" placeholder="请选择上架状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.GETATABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="停课券说明" prop="explain">
        <el-input v-model="formData.explain" type="textarea" placeholder="请输入停课券说明" />
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
import { disabledBeforeDate } from '@/utils/formatTime'
import { SuspendApi, SuspendVO } from '@/api/crm/sales/suspend/suspend'

/** 优惠券 表单 */
defineOptions({ name: 'CouponForm' })

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
  name: undefined,
  discount: 0,
  validityType: 3,
  expireDays: undefined,
  fixedTime: [],
  effectiveTime: undefined,
  noneffctiveTime: undefined,
  couponTotal: null,
  couponSent: null,
  inventory: null,
  explain: undefined,
  couponType: 4,
  packageType: null,
  enableStatus: 1,
  getatableStatus: 1,
})

/* 表单校验规则 */
const formRules = ({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  validityType: [{ required: true, message: '有效期类型不能为空', trigger: 'change' }],
  expireDays: [{}],
  fixedTime: [{}],
  explain: [{ required: true, message: '停课券说明不能为空', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
  getatableStatus: [{ required: true, message: '上架状态不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SuspendApi.getSuspend(id)
      formData.value.fixedTime = [formData.value.effectiveTime, formData.value.noneffctiveTime]
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
  formData.value.effectiveTime = formData.value.fixedTime[0]
  formData.value.noneffctiveTime = formData.value.fixedTime[1]
  try {
    const data = formData.value as unknown as SuspendVO
    if (formType.value === 'create') {
      await SuspendApi.createSuspend(data)
      message.success(t('common.createSuccess'))
    } else {
      await SuspendApi.updateSuspend(data)
      message.success(t('common.updateSuccess'))
    }
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
    name: undefined,
    discount: 0,
    validityType: 3,
    expireDays: undefined,
    fixedTime: [],
    effectiveTime: undefined,
    noneffctiveTime: undefined,
    couponTotal: null,
    couponSent: null,
    inventory: null,
    explain: undefined,
    couponType: 4,
    packageType: null,
    enableStatus: 1,
    getatableStatus: 1,
  }
  formRef.value?.resetFields()
}

onBeforeMount(() => {
  watch(() => formData.value.validityType, (newValue) => {
    formRules.expireDays = newValue === 1 ? [{ required: true, message: '有效天数不能为空', trigger: 'change' }] : []
    formRules.fixedTime = newValue === 2 ? [{ required: true, message: '有效日期不能为空', trigger: 'change' }] : []
  })
})
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>