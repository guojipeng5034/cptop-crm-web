<template>
  <Dialog title="绑定账号" v-model="dialogVisible" width="500">
    <el-form ref="formRef" label-width="100" :model="formData" :rules="formRules">
      <el-form-item label="阿里云账号" prop="id">
        <el-select v-model="formData.id" placeholder="请输入邮箱或坐席名称查询账号信息" clearable filterable remote
          :loading="cccUserOptionsLoading" :remote-method="fetchRemoteCccUserOptions">
          <el-option v-for="option in cccUserOptions" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
      </el-form-item>
      <el-descriptions v-if="cccUserInfo" border column="2">
        <el-descriptions-item label="登录名">{{ cccUserInfo.loginName }}</el-descriptions-item>
        <el-descriptions-item label="展示名">{{ cccUserInfo.displayName }}</el-descriptions-item>
        <el-descriptions-item label="邮箱地址">{{ cccUserInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="角色名称">{{ cccUserInfo.roleName }}</el-descriptions-item>
      </el-descriptions>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { handleRemoteCccUserOptions } from '@/utils/dict'
import { CccUserApi, CccUserVO } from '@/api/crm/ccc/user'

defineOptions({ name: 'BindCccUser' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const cccUserInfo = ref()

/* 表单数据 */
const formData = ref({
  id: undefined,
  systemUserId: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  id: [
    { required: true, message: '阿里云账号不能为空', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        if (cccUserInfo.value.systemUserName !== null) {
          callback(new Error(`该坐席已被${cccUserInfo.value.systemUserName}绑定，请先解绑后再重新绑定`))
        } else {
          callback()
        }
      }, trigger: 'change'
    }
  ],
})
const formRef = ref()

/* options */
// cccUser
const cccUserOptionsLoading = ref(false)
const cccUserOptions = ref([])
const fetchRemoteCccUserOptions = async (query) => {
  const setCccUserOptions = (newValue) => (cccUserOptions.value = newValue)
  const setCccUserLoading = (newValue) => (cccUserOptionsLoading.value = newValue)
  handleRemoteCccUserOptions(query, setCccUserOptions, setCccUserLoading)
}

watch(() => formData.value.id, (newValue) => {
  if (newValue) {
    cccUserInfo.value = cccUserOptions.value.find((item) => item.info.id === newValue).info
  }
})

/** 打开弹窗 */
const open = async (id) => {
  dialogVisible.value = true
  resetForm(id)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CccUserVO
    await CccUserApi.bindCccUser(data)
    message.success('绑定成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (id) => {
  cccUserOptions.value = []
  cccUserInfo.value = undefined
  formData.value = {
    id: undefined,
    systemUserId: id,
  }
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>