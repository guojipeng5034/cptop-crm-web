<template>
  <Dialog title="导入分配人员" v-model="dialogVisible" width="400">
    <el-upload ref="uploadRef" v-model:file-list="fileList" :action="importUrl" :auto-upload="false"
      :disabled="formLoading" :headers="uploadHeaders" :limit="1" :on-error="submitFormError" :on-exceed="handleExceed"
      :on-success="submitFormSuccess" accept=".xlsx, .xls" drag>
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center" v-if="checkPermi(['crm:list-owner-assign:export-template'])">
          <span>仅允许导入 xls、xlsx 格式文件。</span>
          <el-link :underline="false" style="font-size: 12px; vertical-align: baseline;" type="primary"
            @click="exportTemplate">
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">检 查</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import router from '@/router';
import { ListOwnerAssignApi } from '@/api/crm/customer/assign'
import { getAccessToken, getTenantId } from '@/utils/auth'
import { checkPermi } from '@/utils/permission'
import download, { exportExcel } from '@/utils/download'
import { useAssignStore } from '@/store/modules/assign'

/** 学员线索分配导入 表单 */
defineOptions({ name: 'AssignImportForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const assignStore = useAssignStore()
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/crm/list-owner-assign/import-excel'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  fileList.value = []
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const uploadRef = ref()
/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  // 提交请求
  uploadHeaders.value = {
    Authorization: 'Bearer ' + getAccessToken(),
    'tenant-id': getTenantId()
  }
  formLoading.value = true
  uploadRef.value!.submit()
}

/** 文件上传成功 */
const submitFormSuccess = async (response: any) => {
  if (response.code !== 0) {
    message.error(response.msg)
    fileList.value = []
    formLoading.value = false
    return
  }
  const data = response.data
  await assignStore.setSuccess(data.success)
  if (!data.success) {
    await assignStore.setData(data.data)
    await assignStore.setNotExistUsers(data.notExistUsers)
  } else {
    await assignStore.setDataKey(data.dataKey)
    await assignStore.setYearMonth(data.yearMonth)
  }
  formLoading.value = false
  // dialogVisible.value = false
  router.push({ name: 'CheckAssignForm' }).then(() => {
    nextTick(() => {
      dialogVisible.value = false
    })
  })
}

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 重置表单 */
const resetForm = async (): Promise<void> => {
  // 重置上传状态和文件
  formLoading.value = false
  await nextTick()
  uploadRef.value?.clearFiles()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 下载模板操作 */
const exportTemplate = async () => {
  const res = await ListOwnerAssignApi.exportListOwnerAssignTemplate()
  download.excel(res, '学员线索分配人员导入模版.xlsx')
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