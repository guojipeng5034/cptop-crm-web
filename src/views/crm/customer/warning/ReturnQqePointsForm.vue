<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="750">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading">
      <el-row>
        <el-col :span="10">
          <el-form-item label="学员" prop="customerId">
            <span v-truncate="10">{{ formData.customerName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="返还类型" prop="returnType" label-width="80">
            <a-tag v-if="formData.returnType === 2" color="purple">课时点清零</a-tag>
            <a-tag v-else color="orangered">旷课</a-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课时点数" prop="returnPointsNum" label-width="80">
            {{ formData.returnPointsNum }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请填写备注" />
      </el-form-item>
      <el-form-item label="图片" prop="agreeImage">
        <form-create v-model="agreeImage" :rule="agreeImageRule" :option="agreeImageOption" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CustomerQqePointsApi, CustomerQqePointsVO } from '@/api/crm/sales/qqePoints/customerQqePoints'
import { WarningApi, WarningVO } from '@/api/crm/customer/warning'

/** 续费日志 表单 */
defineOptions({ name: 'ReturnQqePointsForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('返还课时点') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  customerName: undefined,
  returnPointsNum: undefined,
  returnType: 0,
  remark: '',
  agreeImage: []
})

/* 表单校验规则 */
const formRules = reactive({
  agreeImage: [
    {
      required: true, validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback('请上传至少一张图片')
        }
        callback()
      }, trigger: 'change'
    },
  ],
})
const formRef = ref() // 表单 Ref

// 图片记录
const agreeImage = ref([])
const agreeImageRule = ref([
  {
    "type": "UploadImgs",
    "field": "agreeImage",
    "props": {
      "fileSize": 5,
      "limit": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "120px",
      "height": "120px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'activity/clock/chatPage'
    },
    "hidden": false,
    "display": true,
  }]
)
const agreeImageOption = ref({
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

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm(row)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  ElMessageBox.confirm(
    '请检查数据是否正确，确认无误后提交！',
    '确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      if (agreeImage.value)
        formData.value.agreeImage = agreeImage.value.agreeImage
      // 校验表单
      await formRef.value.validate()
      // 提交请求
      formLoading.value = true
      try {
        const data = formData.value as unknown as CustomerQqePointsVO
        await CustomerQqePointsApi.createCustomerQqePoints(data)
        await WarningApi.updateWarning({ id: data.id, agreeImage: agreeImage.value.agreeImage })
        message.success('提交成功')
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
      } finally {
        formLoading.value = false
      }
    })
}

/** 重置表单 */
const resetForm = (row) => {
  agreeImage.value = { agreeImage: [] }
  formData.value = {
    id: row.id,
    customerId: row.customerId,
    customerName: row.customerName,
    returnPointsNum: row.returnPoints,
    returnType: row.warningType === 7 ? 3 : 2,
    remark: '',
    agreeImage: []
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

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tip {
    font-size: 17px;
    color: var(--el-color-error);
  }
}
</style>