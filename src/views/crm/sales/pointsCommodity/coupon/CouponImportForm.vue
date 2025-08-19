<template>
  <Dialog title="优惠券导入" v-model="dialogVisible" width="400">
    <el-upload ref="uploadRef" v-model:file-list="fileList" :action="importUrl + '?type=' + type" :auto-upload="false"
      :disabled="formLoading" :headers="uploadHeaders" :limit="1" :on-error="submitFormError" :on-exceed="handleExceed"
      :on-success="submitFormSuccess" accept=".xlsx, .xls" drag>
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip flex justify-center items-center">
            <span class="m-r-2 m-block-2">优惠券类型：</span>
            <el-radio-group v-model="type" size="small">
              <el-radio-button v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_COUPON_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-radio-group>
          </div>
          <span>仅允许导入 xls、xlsx 格式文件。</span>
          <el-link :underline="false" style="font-size: 12px; vertical-align: baseline;" type="primary"
            @click="exportTemplate">
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { PointsCouponApi } from '@/api/crm/sales/pointsCommodity/coupon'
import { getAccessToken, getTenantId } from '@/utils/auth'
import download, { exportExcel } from '@/utils/download'

/** 积分商品券库 表单 */
defineOptions({ name: 'CouponImportForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/crm/points-coupon/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表
const type = ref(1) // 优惠券类型

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
const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    message.error('上传失败，请先下载模板，并重新上传！')
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
    cancelButtonText: '失败券码链接',
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true,
  }).then(() => { })
    .catch((e) => {
      exportExcel(['券码链接'], response.data.failureResult, '失败券码链接.xlsx')
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
  const res = await PointsCouponApi.exportCouponTemplate()
  download.excel(res, '优惠券导入模版.xlsx')
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