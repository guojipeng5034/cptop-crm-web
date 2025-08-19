<template>
  <Dialog :title="title" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90" v-loading="formLoading">
      <el-form-item label="满意度" prop="satisfaction">
        <el-rate v-model="formData.satisfaction" :max="3" clearable show-text :texts="['不满意', '基本满意', '非常满意']" />
      </el-form-item>
      <el-form-item label="质量建议" prop="evaluation">
        <el-input v-model="formData.evaluation" type="textarea" :rows="3" placeholder="请输入质量建议" />
      </el-form-item>
      <el-form-item label="截图" prop="imgs" class="!m-b-0">
        <form-create v-model="formData.imgs" :rule="imgsRule" :option="imgsOption" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WechatEvaluationVO, WechatEvaluationApi } from '@/api/crm/wechat/evaluation'

/** 评价 表单 */
defineOptions({ name: 'WechatEvaluationForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单类型：create 添加、update 修改
const title = ref('')

/* 表单数据 */
const formData = ref({
  id: undefined,
  satisfaction: undefined,
  evaluation: undefined,
  imgs: { imgs: [] },
})

/* 表单校验规则 */
const formRules = reactive({
  satisfaction: [
    { required: true, message: '满意度不能为空', trigger: 'change' },
    {
      validator: async (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请选择满意度'))
        } else {
          callback()
        }
      }, trigger: 'change'
    }
  ],
  evaluation: { required: true, message: '质量建议不能为空', trigger: 'blur' },
})
const formRef = ref() // 评价表单 Ref

// 截图
const imgsRule = ref([
  {
    "type": "UploadImgs",
    "field": "imgs",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "120px",
      "height": "120px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'wechat/imgs'
    },
    "hidden": false,
    "display": true,
  }]
)
const imgsOption = ref({
  "form": {
    "labelWidth": "125px",
    "hideRequiredAsterisk": false,
    "showMessage": true,
    "inlineMessage": false
  },
  "submitBtn": {
    "show": false,
    "innerText": "提交"
  },
  "resetBtn": {
    "show": false,
    "innerText": "重置"
  }
})

/* 赋值图片 */
const assignImage = () => {
  formData.value.imgs = formData.value.imgs.imgs? formData.value.imgs.imgs : []
}

/** 打开弹窗 */
const open = async (id: number, type: string) => {
  dialogVisible.value = true
  title.value = t('action.' + type) + '评价'
  formType.value = type
  resetForm()
  if (id) formData.value.id = id
   // 修改时，设置数据
  if (formType.value === 'update') {
    formLoading.value = true
    try {
      const data = await WechatEvaluationApi.getWechatEvaluation(id)
      const { satisfaction, evaluation, imgs } = data
      // 图片
      formData.value = { 
        id,
        satisfaction,
        evaluation,
        imgs: {
          imgs
        }
      }
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
  // 赋值图片
  assignImage()
  try {
    const data = formData.value as unknown as WechatEvaluationVO
    await WechatEvaluationApi.evaluationWechatEvaluation(data)
    if(formType.value === 'create') {
      message.success(t('common.createSuccess'))
    } else {
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
  formData.value = {
    id: undefined,
    satisfaction: undefined,
    evaluation: undefined,
    imgs: { imgs: [] },
  }
  formRef.value?.resetFields()
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
