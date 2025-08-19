<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="学员姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入学员姓名" clearable />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-select v-model="formData.age" placeholder="请选择或检索年龄" clearable filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="formData.mail" placeholder="请输入邮箱" clearable type="email" />
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
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'

/** 积分记录 表单 */
defineOptions({ name: 'CustomerForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  name: undefined,
  age: undefined,
  mail: undefined
})

/** 表单规则 */
const mailRule = (rule: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (value) {
    if (!regex.test(value)) {
      callback(new Error('请检查邮箱格式'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const formRules = reactive({
  name: [{ required: true, message: '学员姓名为必填项', trigger: 'blur' }],
  age: [{ required: true, message: '年龄为必选项', trigger: 'change' }],
  mail: [{ validator: mailRule, trigger: 'blur' }],
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CustomerApi.getCustomer(id)
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
    const data = formData.value as unknown as CustomerVO
    await CustomerApi.updateCustomer(data)
    message.success(t('common.updateSuccess'))
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
    name: undefined,
    age: undefined,
    mail: undefined
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
