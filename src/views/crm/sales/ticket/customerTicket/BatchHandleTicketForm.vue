<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="450">
    <el-upload ref="uploadRef" v-model:file-list="fileList" :action="importUrl" :auto-upload="false"
      :disabled="formLoading" :headers="uploadHeaders" :limit="1" :on-error="submitFormError" :on-exceed="handleExceed"
      :on-success="submitFormSuccess" accept=".xlsx, .xls" drag :data="formData">
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入 xls、xlsx 格式文件。</span>
          <el-link :underline="false" style="font-size: 12px; vertical-align: baseline" type="primary"
            @click="downloadTemplate">
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="适用站点" prop="siteId">
        <el-radio-group v-model="formData.siteId">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="次卡" prop="ticketCode">
        <el-text v-if="!formData.siteId" type="warning">请先选择适用站点</el-text>
        <el-select v-else v-model="formData.ticketCode" placeholder="请输入次卡Code或次卡名称" remote
          :loading="queryOptions.ticket.loading" :remote-method="queryOptions.ticket.handleSearch" clearable filterable>
          <el-option v-for="dict in queryOptions.ticket.options" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="formType === 'add'" label="返还类型" prop="returnType">
        <el-select v-model="formData.returnType" placeholder="请选择返还类型" clearable filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_TICKET_ADD_CHANNEL)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="formType === 'add'" label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteQqeTicketOptions } from '@/utils/dict'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download, { exportExcel } from '@/utils/download'
import { CustomerTicketApi } from '@/api/crm/sales/ticket/customerTicket/index'

/** 批量添加次卡 表单 */
defineOptions({ name: 'BatchHandleTicketForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = computed(() => formType.value === 'add' ? '批量添加次卡' : '批量移除次卡')
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const importUrl = computed(() => import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/crm/sales/returnLog/ticket/' + (formType.value === 'add' ? 'import' : 'remove-batch')) // 上传地址
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表
const formType = ref()
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  siteId: undefined,
  ticketCode: undefined,
  tickerName: undefined,
  returnType: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  siteId: [{ required: true, message: '适用站点不能为空', trigger: 'change' }],
  ticketCode: [{ required: true, message: '次卡不能为空', trigger: 'change' }],
  returnType: computed(() => formType.value === 'add' ? [{ required: true, message: '返还类型不能为空', trigger: 'change' }] : []),
})

// 监听表单的siteId选择，动态加载次卡
// watch(
//   [() => formData.value.siteId, () => formData.value.ticketCode],
//   async ([currentSiteId, currentTicketCode]) => {
//     if (currentSiteId, currentTicketCode) {
//       ticketOptionsLoading.value = true
//       ticketCodeOptions.value = await getTicketOptions(currentSiteId, currentTicketCode)
//       ticketOptionsLoading.value = false
//       formData.value.ticketCode = undefined
//       formData.value.tickerName = undefined
//     } else {
//       ticketCodeOptions.value = []
//       formData.value.ticketCode = undefined
//       formData.value.tickerName = undefined
//     }
//   }
// )
// 监听次卡选择，赋值ticketName
watch(
  () => formData.value.ticketCode,
  (currentValue) => {
    if (currentValue) {
      const ticket = queryOptions.ticket.options.find((item) => item.value === currentValue)
      formData.value.tickerName = ticket?.label
    } else {
      formData.value.tickerName = undefined
    }
  }
)

/* 选项列表 */
const queryOptions = reactive({
  ticket: {
    options: [],
    loading: false,
    async handleSearch(query) {
      const params = {
        keyword: query.trim(),
        siteId: formData.value.siteId
      }
      const options = (value) => (queryOptions.ticket.options = value)
      const loading = (value) => (queryOptions.ticket.loading = value)
      handleRemoteQqeTicketOptions(params, options, loading)
    }
  },
})

/** 打开弹窗 */
const open = async (type: string) => {
  dialogVisible.value = true
  formType.value = type
  resetForm()
  resetUploadForm()
  fileList.value = []
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const uploadRef = ref()
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  // 表单验证
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  // 获取上传 Header 头
  uploadHeaders.value = {
    Authorization: 'Bearer ' + getAccessToken(),
    'tenant-id': getTenantId()
  }
  uploadRef.value!.submit()
}

/** 文件上传成功 */
const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    message.error(response.msg)
    formLoading.value = false
    return
  }
  // 拼接提示语
  const data = response.data
  let text = `上传成功数量：${data.successCount}<br />上传失败数量：${data.failureCount}<br />上传失败原因：${data.failureMsg}`
  ElMessageBox.confirm(text, '导入结果', {
    confirmButtonText: 'OK',
    showConfirmButton: data.failureCount === 0,
    showCancelButton: data.failureCount > 0,
    cancelButtonText: '批量添加次卡失败学员文件链接',
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true
  })
    .catch((e) => {
      exportExcel(['学员'], response.data.failureResult, '批量添加次卡失败学员ID.xlsx')
      message.success('下载成功，请查收文件！')
    })
  formLoading.value = false
  dialogVisible.value = false
  // 发送操作成功的事件
  emits('success')
}

/** 下载模板操作 */
const downloadTemplate = async () => {
  const res = await CustomerTicketApi.getCustomerTicketTemplate()
  download.excel(res, '次卡批量处理模版.xlsx')
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 重置表单 */
const resetUploadForm = async (): Promise<void> => {
  // 重置上传状态和文件
  formLoading.value = false
  await nextTick()
  uploadRef.value?.clearFiles()
}
const resetForm = () => {
  formData.value = {
    siteId: undefined,
    ticketCode: undefined,
    tickerName: undefined,
    returnType: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
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
