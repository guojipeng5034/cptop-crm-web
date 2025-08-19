<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="300">
    <div class="flex justify-center">
      <el-tooltip effect="light" content="点击复制" placement="right">
        <el-button link type="primary" plain @click="handleCopy">{{ fullInfo }}</el-button>
      </el-tooltip>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { handleCopy } from '@/utils/common'
import { CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
import { BaseApi } from '@/api/crm/base/index'

/** 查看完整信息弹窗 */
defineOptions({ name: 'MasklessInfoDialog' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const infoType = ref() // 信息的类型：mail - 邮箱；phone - 电话
const fullInfo = ref('') // 完整信息

const params = ref({
  type: undefined,
  id: undefined,
  source: undefined
})

/** 打开弹窗 */
const open = async (type: number, id: number, belongModule: number) => {
  dialogVisible.value = true
  dialogTitle.value = `完整${type === CRM_DESENSITIZE_TYPE.MAIL ? '邮箱' : '电话'}`
  infoType.value = type
  reset()
  params.value = {
    id,
    type,
    source: belongModule
  }
  await getFullInfo()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/* 获取完整信息 */
const getFullInfo = async () => {
  try {
    const data = params.value
    const res = await BaseApi.getDesensitizeInfo(data)
    if (res) {
      fullInfo.value = res
    } else {
      message.error('获取完整信息失败')
    }
  } catch (error) {
    message.error(error.message)
  }
}

/** 重置信息 */
const reset = () => {
  params.value = {
    type: undefined,
    id: undefined,
    source: undefined
  }
}
</script>