<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="45%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="125" v-loading="formLoading"
      :disabled="formType === 'update'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学员" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions"
              :disabled="props.hasCustomerId">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>

          <el-form-item label="联系类型" prop="contactType">
            <el-select v-model="formData.contactType" placeholder="请选择联系类型" clearable filterable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="学员联系人" prop="responsibleId">
            <el-select v-model="formData.responsibleId" placeholder="请选择或检索学员联系人" clearable filterable remote
              :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions" disabled>
              <el-option v-for="option in userOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="联系日期" prop="contactDate">
            <el-date-picker v-model="formData.contactDate" type="datetime" placeholder="选择联系日期" value-format="x"
              format="YYYY-MM-DD HH:mm" time-format="HH:mm" disabled class="!w-100%" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- TODO：联系结果为未解决才显示下次联系相关表单 -->
          <el-form-item label="联系结果" prop="contactResultType">
            <el-select v-model="formData.contactResultType" clearable filterable placeholder="请选择联系结果">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_RESULT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="下次联系日期" prop="nextContactDate">
            <el-date-picker v-model="formData.nextContactDate" type="datetime" value-format="x"
              format="YYYY-MM-DD HH:mm" time-format="HH:mm" :default-time="new Date(2000, 1, 1, 9, 0, 0)"
              :disabled-date="disabledBeforeDate" placeholder="选择下次联系日期" clearable class="!w-100%" />
          </el-form-item>

          <el-form-item prop="nextResponsibleId">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                下次联系负责人
              </el-tooltip>
            </template>
            <el-select v-model="formData.nextResponsibleId" placeholder="请选择或检索下次联系负责人" clearable filterable remote
              :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions">
              <el-option v-for="option in userOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTabName" type="border-card" stretch class="mb-15px" @tab-change="handleTabChange">
        <el-tab-pane :name="1" :disabled="formType === 'update' && formData.contactCategory === 2">
          <template #label>
            <span class="custom-tabs-label">
              <Icon icon="fa-solid:home" />
              <span>日常联系</span>
            </span>
          </template>

          <el-form-item prop="contactContent">
            <template #label>
              <div class="label">
                <div class="title">联系纪要</div>
                <div class="tips color-red line-height-14px fw-600">(内部可见)</div>
              </div>
            </template>
            <Editor v-model="formData.contactContent" height="300px" />
          </el-form-item>

          <el-form-item label="联系原因" prop="contactReason">
            <el-input type="textarea" v-model="formData.contactReason" placeholder="请输入联系原因" />
          </el-form-item>

          <!-- <el-form-item label="下次预约日期" prop="nextReservedDate">
            <el-date-picker
              v-model="formData.nextReservedDate"
              type="datetime"
              value-format="x"
              format="YYYY-MM-DD HH:mm"
              time-format="HH:mm"
              placeholder="选择下次预约日期"
              :disabled-date="disabledBeforeDate"
              :default-time="new Date(2000, 1, 1, 9, 0, 0)"
              class="!w-100%"
            />
          </el-form-item> -->
        </el-tab-pane>

        <el-tab-pane :name="2" :disabled="formType === 'update' && formData.contactCategory === 1">
          <template #label>
            <span class="custom-tabs-label">
              <Icon icon="ep:avatar" />
              <span>值班联系</span>
            </span>
          </template>
          <el-form-item label="返回课时点数" prop="refundPoints">
            <el-input-number v-limit-input v-model="formData.refundPoints" placeholder="请输入返回课时点数" :step="1" :min="0"
              step-strictly class="!w-100%" />
          </el-form-item>
          <el-form-item label="返还课时点原因" prop="refundReason">
            <el-select v-model="formData.refundReason" placeholder="请选择返还课时点原因" clearable fiterable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_RETURN_QQEPOINT_REASON)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item prop="handleResult">
        <template #label>
          <div class="label">
            <div class="title">处理结果</div>
            <div class="tips text-red line-height-14px fw-600">(学员可见)</div>
          </div>
        </template>
        <el-input type="textarea" v-model="formData.handleResult" placeholder="请输入处理结果" />
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
  DICT_TYPE, getIntDictOptions,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { disabledBeforeDate } from '@/utils/formatTime'
import { ContactHistoryApi, ContactHistoryVO } from '@/api/crm/customer/contact'
import { useUserStoreWithOut } from '@/store/modules/user'

/** 学员联系记录 表单 */
defineOptions({ name: 'ContactHistoryForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const userStore = useUserStoreWithOut()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
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

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  contactType: undefined,
  contactCategory: 1,
  responsibleId: userStore.user.id,
  contactDate: Date.now(),
  contactResultType: undefined,
  contactContent: undefined,
  contactReason: undefined,
  nextContactDate: undefined,
  nextResponsibleId: userStore.user.id,
  nextReservedDate: undefined,
  handleResult: undefined,
  refundPoints: 0,
  refundReason: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员为必选项', trigger: 'blur' }],
  contactType: [{ required: true, message: '联系类型为必选项', trigger: 'change' }],
  contactResultType: [{ required: true, message: '联系结果为必选项', trigger: 'change' }],
  contactContent: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value && formData.value.contactCategory === 1) {
        callback('请填写联系纪要')
      } else {
        callback()
      }
    }, trigger: 'blur'
  }],
  refundReason: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value && formData.value.contactCategory === 2) {
        callback('返还课时点原因为必选项')
      } else {
        callback()
      }
    }, trigger: 'change'
  }],
  refundPoints: [{
    validator: (rule: any, value: any, callback: any) => {
      if (!value && formData.value.contactCategory === 2) {
        callback('返回课时点数为必填项')
      } else {
        callback()
      }
    }, trigger: 'blur'
  }]
})

/** 打开弹窗 */
const open = async (type: string, id?: number, name?: string, customerId?: number) => {
  fetchRemoteCustomerOptions(customerId)
  fetchRemoteUserOptions(userStore.user.nickname)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm(customerId)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ContactHistoryApi.getContactHistory(id)
      activeTabName.value = formData.value.contactCategory
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  handleClearAnotherTab()
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ContactHistoryVO
    if (formType.value === 'create') {
      await ContactHistoryApi.createContactHistory(data)
      message.success(t('common.createSuccess'))
    } else {
      await ContactHistoryApi.updateContactHistory(data)
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
const resetForm = (customerId: number) => {
  formData.value = {
    id: undefined,
    contactCategory: 1,
    customerId,
    contactType: undefined,
    responsibleId: userStore.user.id,
    contactDate: Date.now(),
    contactResultType: undefined,
    contactContent: undefined,
    contactReason: undefined,
    nextContactDate: undefined,
    nextResponsibleId: userStore.user.id,
    nextReservedDate: undefined,
    handleResult: undefined,
    refundPoints: 0,
    refundReason: undefined
  }
  formRef.value?.resetFields()
  activeTabName.value = 1
}

/* options */
/* 1.customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])

const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 2.user */
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

/* Tabs */
const activeTabName = ref(1)
const handleTabChange = (activeName) => {
  formData.value.contactCategory = activeName
}

const handleClearAnotherTab = () => {
  if (activeTabName.value === 1) {
    formData.value.refundPoints = undefined
    formData.value.refundReason = undefined
  } else if (activeTabName.value === 2) {
    formData.value.contactContent = undefined
    formData.value.contactReason = undefined
    formData.value.nextReservedDate = undefined
  }
}
</script>

<style lang="scss" scoped>
/* Tabs */
:deep(.el-tabs) {
  .el-tabs__header {

    /* 控制 tab label 的 icon与文字水平对齐 */
    .custom-tabs-label {
      display: flex;
      align-items: center;
    }
  }
}

:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>