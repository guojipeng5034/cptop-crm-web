<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="券组类型" prop="groupType">
            <el-select v-model="formData.groupType" placeholder="请选择券组类型">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COUPON_GROUP_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠券组名称" prop="groupName">
            <el-input v-model.trim="formData.groupName" placeholder="请输入优惠券组名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="优惠券范围" prop="couponIds">
        <MultiSelect v-model="formData.couponIds" :type="'coupon'" :api-fn="CouponApi.getSimpleSelectPage"
          label-field="name" value-field="id" placeholder="请选择优惠券" search-placeholder="请输入优惠券（联想输入）"
          :show-current-option="(formType === 'update' || formType === 'batch') && formData.couponIds?.length > 0"
          :current-fn="CouponApi.getByList" />
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
import { CRM_COUPON_GROUP_TYPE } from '@/utils/constants'
import { getCurrentTime } from '@/utils/formatTime'
import { CouponMutexGroupApi, CouponMutexGroupVO } from '@/api/crm/sales/coupon/couponMutexGroup'
import { CouponApi, CouponVO } from '@/api/crm/sales/coupon/coupon'
import { isEmpty } from '@/utils/is'

/** 优惠券互斥组记录 表单 */
defineOptions({ name: 'CouponMutexGroupForm' })

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
  groupName: undefined,
  groupType: undefined,
  couponIds: []
})
/* 表单校验 */
// 优惠券列表校验
const validateCouponIds = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择优惠券'))
  } else if (value.length < 2) {
    return callback(new Error('请至少选择2个优惠券'))
  }
  callback()
}
const formRules = reactive({
  groupType: [{ required: true, message: '请选择券组类型', trigger: 'change' }],
  groupName: [{ required: true, message: '请输入优惠券组名称', trigger: 'change' }],
  couponIds: [{ required: true, validator: validateCouponIds, trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** group name */
// 自动生成组名方法
const generateAutoName = (type: number) => {
  const datePart = getCurrentTime('YY/MM/DD HHmmss')
  return type === CRM_COUPON_GROUP_TYPE.MUTEX_INVALID
    ? `互斥失效组${datePart}`
    : `互斥组${datePart}`
}

// 侦听 groupType
watch(
  () => formData.value.groupType,
  (newVal) => {
    // 仅在创建模式且未手动修改名称时自动生成
    if ((formType.value === 'create' || formType.value === 'batch') && newVal !== undefined) {
      formData.value.groupName = generateAutoName(newVal)
    }
  }
)

/** 打开弹窗 */
const open = async (type: string, id?: number, selectedCouponIds?: number[], selectedCouponPage?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (!isEmpty(selectedCouponIds) && type === "batch") {
    formData.value.couponIds = selectedCouponIds
  }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await CouponMutexGroupApi.getCouponMutexGroup(id)
      const { groupName, groupType } = data
      formData.value = {
        id,
        groupName,
        groupType,
        // 重组优惠券
        couponIds: data.coupons.map((item) => item.id)
      }
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
    const data = formData.value as unknown as CouponMutexGroupVO
    if (formType.value === 'create' || formType.value === 'batch') {
      await CouponMutexGroupApi.createCouponMutexGroup(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await CouponMutexGroupApi.updateCouponMutexGroup(data)
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
    groupName: undefined,
    groupType: undefined,
    couponIds: []
  }
  formRef.value?.resetFields()
}
</script>
