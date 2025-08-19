<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="550">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="页面标题" prop="pageTitle">
        <el-input v-model="formData.pageTitle" placeholder="请输入页面标题" />
      </el-form-item>
      <el-form-item label="页面链接" prop="pageUrl">
        <el-input v-model="formData.pageUrl" placeholder="请输入页面链接" :disabled="urlDisabled" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="fontType">
        <el-select v-model="formData.fontType" placeholder="请选择类型">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_REGISTER_LINK_FONT_TYPE)" :key="dict.value" :label="dict.label" 
            :value="dict.value" />
        </el-select>
      </el-form-item>
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { RegisterLinkApi, RegisterLinkVO } from '@/api/crm/sales/poster/registerlink'

/** 注册链接 表单 */
defineOptions({ name: 'RegisterLinkForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const urlDisabled = ref(false) // 页面链接禁用状态

/* 表单数据 */
const formData = ref({
  id: undefined,
  pageTitle: undefined,
  pageUrl: undefined,
  status: 0,
  fontType: 1, // 默认简体
  remark: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  pageTitle: [{ required: true, message: '页面标题不能为空', trigger: 'blur' }],
  pageUrl: [{ required: true, message: '页面链接不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  fontType: [{ required: true, message: '类型不能为空', trigger: 'change' }],
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
    urlDisabled.value = true
    try {
      formData.value = await RegisterLinkApi.getChannelRegisterLink(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as RegisterLinkVO
    if (formType.value === 'create') {
      await RegisterLinkApi.createChannelRegisterLink(data)
      message.success(t('common.createSuccess'))
    } else {
      await RegisterLinkApi.updateChannelRegisterLink(data)
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
  urlDisabled.value = false
  formData.value = {
    id: undefined,
    pageTitle: undefined,
    pageUrl: undefined,
    status: 0,
    fontType: 1, // 默认简体
    remark: undefined,
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>