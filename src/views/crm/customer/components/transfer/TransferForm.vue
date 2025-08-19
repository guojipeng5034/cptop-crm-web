<template>
  <Dialog title="批量划分" v-model="transferVisible" width="800">
    <el-segmented v-model="transferValue" :options="transferOptions" block size="large" class="mb-6" />
    <div class="flex justify-center">
      <One v-show="transferValue === '全量'" ref="one" @close="closeTransfer" />
      <More v-show="transferValue === '批量'" ref="more" @close="closeTransfer" />
    </div>
    <template #footer>
      <el-button @click="submitForm" type="primary">批量转移</el-button>
      <el-button @click="closeTransfer">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import One from './One.vue'
import More from './More.vue'

const transferVisible = ref(false)
const emit = defineEmits(['success'])
const one = ref()
const more = ref()
const transferValue = ref('全量')
const transferOptions = ['全量', '批量']

const open = async () => {
  transferVisible.value = true
}

const closeTransfer = async () => {
  transferVisible.value = false
  emit('success')
}

const submitForm = async () => {
  switch (transferValue.value) {
    case '全量':
      one.value.submit()
      break
    case '批量':
      more.value.submit()
      break
  }
}

defineExpose({ open })
</script>
