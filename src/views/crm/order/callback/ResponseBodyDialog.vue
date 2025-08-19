<template>
  <Dialog v-model="visible" title="响应内容">
    <el-button type="primary" plain @click="handleCopy(responseBody)">复制原响应内容</el-button>
    <el-button type="success" plain @click="handleCopy(formatResponseBody)">复制格式化响应内容</el-button>
    <el-scrollbar max-height="60vh" class="mt-3">
      <pre class="body">{{ formatResponseBody }}</pre>
    </el-scrollbar>
  </Dialog>
</template>
<script lang="ts" setup>
import { handleCopy } from '@/utils/common'

defineOptions({ name: 'ResponseBodyDialog' })

/* 配置项 */
const responseBody = ref('') // 响应内容
const formatResponseBody = ref('') // 格式化响应内容
const visible = ref(false) // 弹窗是否显示

/* 打开弹窗 */
const open = (content: string) => {
  responseBody.value = content
  // 将对象格式化为带缩进的字符串
  formatResponseBody.value = JSON.stringify(JSON.parse(content), null, 2)
  visible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
<style lang="scss" scoped>
.body {
  background-color: #f7f7f7;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
