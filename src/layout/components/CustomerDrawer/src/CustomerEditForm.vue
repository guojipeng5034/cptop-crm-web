<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading"
      @submit.prevent>
      <el-form-item v-if="formType === 'name'" label="学员姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入新的学员姓名" clearable />
      </el-form-item>
      <el-form-item v-else-if="formType === 'status'" label="学员状态" prop="studyStatus">
        <el-select v-model="formData.studyStatus" placeholder="请选择新的学员状态" clearable filterable>
          <!-- Bug-3594: https://zentao.52cebu.com/zentao/bug-view-3594.html -->
          <!-- 无效+无状态在该处不展示 -->
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STUDY_STATUS)" v-show="dict.value !== 3"
            :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <div v-else-if="formType === 'phone'">
        <el-form-item label="国家码" prop="countryCode">
          <el-select v-model.trim="formData.countryCode" placeholder="请选择国家码" clearable filterable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TELEPHONE_CODE_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入新的手机号" clearable />
        </el-form-item>
      </div>
      <div v-else-if="formType === 'mail'">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="formData.mail" placeholder="请输入新的邮箱" clearable />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CustomerApi, TransferLogVO, CustomerVO } from '@/api/crm/customer/base'

/** 学员Mentor流转记录 表单 */
defineOptions({ name: 'CustomerEditForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('变更') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  id: undefined,
  name: undefined,
  studyStatus: undefined,
  countryCode: undefined,
  phone: undefined,
  mail: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  name: [{ required: true, message: '学员姓名为必填项', trigger: 'blur' }],
  studyStatus: [{ required: true, message: '学员状态为必选项', trigger: 'change' }],
  countryCode: [{ required: true, message: '国家码为必选项', trigger: 'change' }],
  phone: [{ required: true, message: '手机号为必填项', trigger: 'blur' }],
  mail: [{ required: true, message: '邮箱为必填项', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, data?) => {
  dialogVisible.value = true
  formType.value = type
  resetForm(data)
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
    let data = formData.value as unknown as TransferLogVO
    await CustomerApi.updateCustomer(data)
    message.success('变更成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {
    message.error('变更失败')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (data?) => {
  formData.value = {
    ...data,
    phone: undefined
  }
  formRef.value?.resetFields()
}
</script>
