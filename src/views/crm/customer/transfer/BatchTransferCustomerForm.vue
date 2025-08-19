<template>
  <Dialog title="Excel批量转让" v-model="dialogVisible" width="450">
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

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="顾问" prop="mentor">
        <el-select v-model="formData.mentor" clearable filterable remote :loading="formOptions.mentor.loading"
          :remote-method="formOptions.mentor.handleSearch" placeholder="请检索后选择变更后顾问">
          <el-option v-for="option in formOptions.mentor.options" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="转让原因" prop="transferReason">
        <el-select v-model="formData.transferReason" placeholder="请选择或检索所属转让原因" clearable filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_REASON)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download, { exportExcel } from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerApi } from '@/api/crm/customer/base'

/** 批量添加课时点 表单 */
defineOptions({ name: 'BatchTransferCustomerForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
// 上传地址
let importUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_URL +
  '/crm/customer/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  mentor: undefined,
  transferReason: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  mentor: [{ required: true, message: '变更后顾问为必选项', trigger: 'change' }],
  transferReason: [{ required: true, message: '转让原因为必选项', trigger: 'change' }]
})

/* 选项列表 */
const formOptions = reactive({
  mentor: useRemoteSearch(handleRemoteUserOptions),
})

/** 打开弹窗 */
const open = () => {
  resetForm()
  resetUploadForm()
  dialogVisible.value = true
  fileList.value = []
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const uploadRef = ref()
/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  // 表单验证
  await formRef.value.validate()
  // 提交请求
  try {
    formLoading.value = true
    // 获取上传 Header 头
    uploadHeaders.value = {
      Authorization: 'Bearer ' + getAccessToken(),
      'tenant-id': getTenantId()
    }
    // 提交文件
    uploadRef.value!.submit()
  } catch (error) {
    console.log(error)
  }
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
    cancelButtonText: 'Excel批量转让失败学员文件链接',
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true
  })
    .catch((e) => {
      exportExcel(['学员'], response.data.failureResult, 'Excel批量转让失败学员ID.xlsx')
      message.success('下载成功，请查收文件！')
    })
  formLoading.value = false
  dialogVisible.value = false
  // 发送操作成功的事件
  emits('success')
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
    mentor: undefined,
    transferReason: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 下载模板操作 */
const downloadTemplate = async () => {
  const res = await CustomerApi.getCustomerTransferMentorTemplate()
  download.excel(res, 'Excel批量转让模版.xlsx')
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
