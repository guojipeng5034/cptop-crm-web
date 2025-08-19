<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="130" v-loading="formLoading">
      <div class="create-from" v-if="formType === 'create'">
        <el-form-item label="学员" prop="customerId">
          <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
            :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" :disabled="hasCustomerId"
            @change="handleCustomerSelected" @clear="handleCustomerClear">
            <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
              :label="option.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单" prop="orderId">
          <el-select v-model="formData.orderId" placeholder="请选择或检索订单" clearable filterable
            @change="handleOrderSelected" @clear="handleOrderClear" v-show="hasOrderId">
            <el-option v-for="option in orderOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <el-text v-show="!hasOrderId" type="warning">该学员没有可使用的订单</el-text>
        </el-form-item>
        <el-form-item label="套餐" prop="packageName">
          <el-input v-model="formData.packageName" placeholder="选择订单后自动获取套餐" disabled />
        </el-form-item>
        <el-form-item label="刷新次数" prop="refreshTimes">
          <el-input-number v-limit-input v-model="formData.refreshTimes" placeholder="请输入刷新次数" :step="1" step-strictly
            :min="0" class="!w-100%" :disabled="formData.isSign" />
        </el-form-item>
      </div>

      <div class="upate-form" v-if="formType === 'update'">
        <el-form-item label="当前套餐" prop="packageId">
          <el-select v-model="formData.packageId" placeholder="请选择或检索套餐" clearable filterable disabled>
            <el-option v-for="option in packageOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐状态" prop="lessonStatus">
          <el-select v-model="formData.lessonStatus" placeholder="请选择套餐状态" disabled>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.LESSON_STATUS)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <!-- task-1007: https://zentao.52cebu.com/zentao/task-view-1007.html -->
        <!-- <el-form-item label="剩余刷新次数" prop="refreshTimes">
          <template #label>
            <span>剩余刷新次数</span>
            <el-popover placement="bottom-start" title="说明" width="auto"
              content="请先查看套餐订单记录，操作对应的套餐订单总刷新次数后，再到此处调整总剩余刷新次数。" trigger="click">
              <template #reference>
                <Icon icon="fa:question-circle-o"
                  class="!font-size-2.5 ml-0.5 self-center color-#999 cursor-pointer hover:color-#409eff" />
              </template>
</el-popover>
</template>
<template #default>
            <el-input-number v-limit-input v-model="formData.refreshTimes" placeholder="请输入刷新次数" :step="1" step-strictly
              :min="0" class="!w-100%" />
          </template>
</el-form-item> -->
        <el-form-item v-if="formData.expiresTime" label="套餐到期时间" prop="expiresTime">
          <el-date-picker v-model="formData.expiresTime" type="datetime" value-format="x" format="YYYY-MM-DD HH:mm:ss"
            disabled class="!w-100%" />
        </el-form-item>
        <el-form-item v-if="formData.lessonStatus !== 3 && formData.lessonStatus !== 4" label="是否切换套餐"
          prop="changePackageStatus">
          <!-- <el-radio-group v-model="formData.changePackageStatus">
            <template
              v-for="dict in getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
              :key="dict.value"
            >
              <el-radio
                :value="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </template>
            </el-radio-group> -->
          <el-radio-group v-model="formData.changePackageStatus">
            <el-radio :value="true" label="是" />
            <el-radio :value="false" label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="切换的套餐" prop="changePackageId" v-if="formData.changePackageStatus">
          <el-select v-model="formData.changePackageId" placeholder="请选择或检索套餐" clearable filterable
            v-show="canChangePackageOptions.length">
            <el-option v-for="option in canChangePackageOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
          <el-text v-show="!canChangePackageOptions.length" type="warning">该学员没有可切换的套餐</el-text>
        </el-form-item>
      </div>

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
import {
  getIntDictOptions,
  DICT_TYPE,
  getPackageOptions,
  handleRemoteCustomerOptions,
  getCanChangePackagesOptions
} from '@/utils/dict'
import { CustomerPackageApi, CustomerPackageVO } from '@/api/crm/package/customerPackage'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'

/** 学员套餐管理 表单 */
defineOptions({ name: 'CustomerPackageForm' })

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
  orderId: undefined,
  packageId: undefined,
  packageName: undefined,
  isSign: false,
  refreshTimes: 3,
  changePackageStatus: false,
  changePackageId: undefined,
  startLessonTime: undefined,
  flushedTime: undefined,
  nextFlushTime: undefined,
  expiresTime: undefined,
  lessonStatus: undefined,
  stopRenewFlag: undefined,
  stopLessonTime: undefined,
  openLessonUserId: undefined,
  stopLessonUserId: undefined,
  revokeLessonTime: undefined,
  revokeLessonUserId: undefined,
  invalid: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'blur' }],
  orderId: [{ required: true, message: '订单为必选项', trigger: 'blur' }],
  changePackageId: [
    { required: true, message: '如果切换套餐，则切换的套餐为必选项', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  dialogVisible.value = true
  formLoading.value = true
  await fetchRemoteCustomerOptions(customerId)
  packageOptions.value = await getPackageOptions()
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.customerId = props.customerId
  await handleCustomerSelected(formData.value.customerId)
  formLoading.value = false
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CustomerPackageApi.getCustomerPackage(id)
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
    const data = formData.value as unknown as CustomerPackageVO
    if (formType.value === 'create') {
      const { customerId, orderId, packageId, refreshTimes, remark } = data
      const params = { customerId, orderId, packageId, refreshTimes, remark }
      await CustomerPackageApi.createCustomerPackage(params)
      message.success(t('common.createSuccess'))
    } else {
      const { id, customerId, refreshTimes, changePackageStatus, changePackageId, remark } = data
      const params = { id, customerId, refreshTimes, changePackageStatus, changePackageId, remark }
      await CustomerPackageApi.updateCustomerPackage(params)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {

    console.log(e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    customerId: undefined,
    orderId: undefined,
    packageId: undefined,
    packageName: undefined,
    isSign: false,
    refreshTimes: 3,
    changePackageStatus: false,
    changePackageId: undefined,
    startLessonTime: undefined,
    flushedTime: undefined,
    nextFlushTime: undefined,
    expiresTime: undefined,
    lessonStatus: undefined,
    stopRenewFlag: undefined,
    stopLessonTime: undefined,
    openLessonUserId: undefined,
    stopLessonUserId: undefined,
    revokeLessonTime: undefined,
    revokeLessonUserId: undefined,
    invalid: undefined,
    remark: undefined
  }

  orderOptions.value = []
  hasOrderId.value = true
}
/* options */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

// 2.unuse order
const orderOptions = ref([])

// 3.package
const packageOptions = ref([])

/* 学员 selected */
let unuseOrderList
const hasOrderId = ref(true)
const handleCustomerSelected = async (customerId) => {
  if (!customerId) return
  try {
    hasOrderId.value = true
    const data = await PackageOrderApi.getPackageOrderUnused(customerId)
    if (data.length === 0) {
      hasOrderId.value = false
      return
    }
    unuseOrderList = await data.filter((item) => item.packagesSimpleType === 1)
    orderOptions.value = await handleOrderOptions(unuseOrderList)
  } catch (e) {
    console.log('handleCustomerSelected', e)
  }
}

/* 学员 clear */
const handleCustomerClear = () => {
  hasOrderId.value = true
  formData.value.orderId = undefined
  formData.value.packageId = undefined
  formData.value.packageName = undefined
  formData.value.refreshTimes = 3
  orderOptions.value = []
}

/* 订单 selected */
const handleOrderSelected = (orderId) => {
  let targetIndex = -1
  if (unuseOrderList.length) {
    targetIndex = unuseOrderList.findIndex((item) => {
      return item.id === orderId
    })
  }
  if (targetIndex >= 0) {
    formData.value.packageName = unuseOrderList[targetIndex].packageName
    formData.value.packageId = unuseOrderList[targetIndex].packageId
    formData.value.isSign = unuseOrderList[targetIndex].isSign
    formData.value.refreshTimes = unuseOrderList[targetIndex].expireMonth
  }
}

/* 订单 clear */
const handleOrderClear = () => {
  formData.value.packageName = undefined
  formData.value.packageId = undefined
}

/* 处理订单 options */
const handleOrderOptions = (list) => {
  let orderOptions = []
  if (Array.isArray(list)) {
    orderOptions = list.map((item) => ({
      value: item.id,
      label: `${item.orderTypeName} - ${item.packageName}`
    }))
  }
  return orderOptions
}

/* 是否切换套餐 change */
const canChangePackageOptions = ref([])
watch(() => formData.value.changePackageStatus, async (newValue) => {
  if (newValue) {
    canChangePackageOptions.value = await getCanChangePackagesOptions(
      formData.value.id,
      formData.value.customerId
    )
  } else {
    formData.value.changePackageId = undefined
  }
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