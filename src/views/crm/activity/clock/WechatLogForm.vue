<template>
  <Dialog title="联系纪要" v-model="dialogVisible" width="600">
    <el-form ref="formRef" :model="formData" v-loading="formLoading">
      <el-form-item label="文字记录">
        <el-input v-model="formData.effectiveChatContent" type="textarea" :rows="3" placeholder="请输入文字记录" />
      </el-form-item>
      <el-form-item label="图片记录">
        <form-create v-model="chatPage" :rule="chatPageRule" :option="chatPageOption" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WechatLogApi, WechatLogVO } from '@/api/crm/activity/wechatlog'

/** 打卡记录 表单 */
defineOptions({ name: 'WechatLogForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('create')

/* 表单数据 */
const formData = ref({
  clockId: undefined,
  effectiveChatContent: undefined,
  effectiveChatPage: [],
})
const formRef = ref() // 表单 Ref

// 图片记录
const chatPage = ref([])
const chatPageRule = ref([
  {
    "type": "UploadImgs",
    "field": "chatPage",
    "props": {
      "fileSize": 5,
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
const chatPageOption = ref({
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
const open = async (id: number, status: number) => {
  resetForm(id)
  formType.value = status ? 'update' : 'create'
  if (status) {
    try {
      formData.value = await WechatLogApi.getClockWechatLog(id)
      chatPage.value = { chatPage: formData.value.effectiveChatPage }
    } catch (e) {
      console.log(e)
    }
  }
  dialogVisible.value = true
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    formData.value.effectiveChatPage = chatPage.value.chatPage
    const data = formData.value as unknown as WechatLogVO
    if (data.effectiveChatContent || data.effectiveChatPage) {
      if (formType.value === 'create') {
        await WechatLogApi.createClockWechatLog(data)
      } else {
        await WechatLogApi.updateClockWechatLog(data)
      }
      message.success('提交成功')
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } else {
      message.error('提交失败，请至少填写一项记录')
    }
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (id: number) => {
  chatPage.value = { chatPage: [] }
  formData.value = {
    clockId: id,
    effectiveChatContent: undefined,
    effectiveChatPage: [],
  }
  formRef.value?.resetFields()
}
defineExpose({ open })
</script>
