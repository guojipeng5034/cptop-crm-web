<template>
  <Dialog title="批量添加积分" v-model="dialogVisible" width="450">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="importUrl"
      :auto-upload="false"
      :disabled="formLoading"
      :headers="uploadHeaders"
      :limit="1"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      accept=".xlsx, .xls"
      drag
      :data="formData"
    >
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入 xls、xlsx 格式文件。</span>
          <el-link
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            type="primary"
            @click="downloadTemplate"
          >
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100"
      v-loading="formLoading"
    >
      <el-form-item label="变动原因" prop="channel">
        <el-select v-model="formData.channel" placeholder="请选择变动原因" clearable filterable>
          <el-option
            v-for="item in pointChangeReasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变动积分" prop="pointsNum">
        <el-input-number
          v-limit-input
          v-model="formData.pointsNum"
          placeholder="请输入变动积分"
          :step="1"
          :min="0"
          step-strictly
          class="!w-100%"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          placeholder="PS: 如果不备注, 会自动根据变更原因自动生成备注!"
          type="textarea"
          clearable
          show-word-limit
          maxlength="500"
          :rows="3"
        />
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
import { CustomerPointApi } from '@/api/crm/sales/point/customerPoint/index.ts'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download, { exportExcel } from '@/utils/download'

/** 批量添加积分 表单 */
defineOptions({ name: 'BatchImportPointForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
// 上传地址
let importUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_URL +
  '/crm/sales/returnLog/points/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

/* 表单数据 */
const formData = ref({
  pointsNum: undefined,
  channel: undefined,
  remark: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  channel: [{ required: true, message: '变动原因为必选项', trigger: 'change' }],
  pointsNum: [{ required: true, message: '变动积分为必填项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/* 积分变动原因 */
const addtionPointChangeReasonDictValues = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11] // 添加积分变动原因字典值
const pointChangeReasonOptions = ref([]) // 下拉框 options
const getPointChangeReasonOptions = async () => {
  const allReasons = await getIntDictOptions(DICT_TYPE.CRM_POINTS_ADD_CHANNEL)
  pointChangeReasonOptions.value = allReasons.filter((item) =>
    addtionPointChangeReasonDictValues.includes(item.value)
  )
}

/** 打开弹窗 */
const open = () => {
  resetForm()
  resetUploadForm()
  dialogVisible.value = true
  fileList.value = []
  getPointChangeReasonOptions()
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
    cancelButtonText: '批量添加积分失败学员文件链接',
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true
  })
    .then(() => {})
    .catch((e) => {
      exportExcel(['学员'], response.data.failureResult, '批量添加积分失败学员ID.xlsx')
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
    pointsNum: undefined,
    channel: undefined,
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
  const res = await CustomerPointApi.getCustomerPointTemplate()
  download.excel(res, '积分批量添加模版.xlsx')
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
