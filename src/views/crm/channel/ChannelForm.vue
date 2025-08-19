<template>
  <!-- 渠道新增表单 -->
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <div v-if="formType === 'createChannel'">
      <el-steps :active="active" finish-status="success" align-center class="mx-20 mb-4">
        <el-step title="添加渠道" />
        <el-step title="新建页面" />
      </el-steps>
    </div>
    <div v-show="active === 1">
      <ActivityForm v-if="channelInForm === 1" ref="activity" :variProps="variProps" :funcProps="funcProps" />
      <AgencyForm v-else-if="channelInForm === 2" ref="agency" :variProps="variProps" :funcProps="funcProps" />
      <AdvertisementForm v-else-if="channelInForm === 3" ref="advertisement" :variProps="variProps"
        :funcProps="funcProps" />
      <NaturalflowForm v-else-if="channelInForm === 4" ref="naturalflow" :variProps="variProps"
        :funcProps="funcProps" />
      <NewmediaForm v-else-if="channelInForm === 5" ref="newmedia" :variProps="variProps" :funcProps="funcProps" />
    </div>
    <div v-show="active === 2">
      <PageForm v-if="formType === 'createPage' || formType === 'createChannel' || formType === 'updatePage'" ref="page"
        :variProps="variProps" :funcProps="funcProps" />
    </div>

    <template #footer>
      <!-- 新增页 1 -->
      <div v-if="active === 1 && formType === 'createChannel'">
        <el-button @click="submitChannelForm">下一步</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
      <!-- 新增页 2 -->
      <div v-else-if="active === 2 && formType === 'createChannel'">
        <el-button @click="close" style="background-color: #ffa086; color: #fff;">暂不创建</el-button>
        <el-button @click="previous">上一步</el-button>
        <el-button type="success" @click="submitPageForm(), close()" :disabled="page.finishDisabled">
          完 成
        </el-button>
      </div>
      <!-- 渠道修改页 -->
      <div v-else-if="formType === 'updateChannel'">
        <el-button v-if="channelInForm !== 2 || checkPermi(['crm:channel-agency:update'])" @click="submitChannelForm">
          完 成
        </el-button>
        <el-button @click="close">取 消</el-button>
      </div>
      <!-- 页面新增/修改页 -->
      <div v-else-if="formType === 'createPage' || formType === 'updatePage'">
        <el-button @click="submitPageForm">完 成</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { checkPermi } from '@/utils/permission'
import ActivityForm from './activity/ActivityForm.vue'
import AgencyForm from '@/views/crm/agency/agencymag/AgencyForm.vue'
import AdvertisementForm from './advertisement/AdvertisementForm.vue'
import NaturalflowForm from './naturalflow/NaturalFlowForm.vue'
import NewmediaForm from './newmedia/NewMediaForm.vue'
import PageForm from '@/views/crm/channel/page/PageForm.vue'

/** 渠道页面 表单 */
defineOptions({ name: 'ChannelForm' })

/* 配置项 */
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
// const pageName = ref()
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const channelInForm = ref()
const fData = ref()
const active = ref() // 当前页数

/* 子组件 */
const activity = ref()
const agency = ref()
const advertisement = ref()
const naturalflow = ref()
const newmedia = ref()
const page = ref()

/** 打开弹窗 */
const open = async (type: string, channel: number, data?: object) => {
  dialogVisible.value = true
  formType.value = type
  switch (type) {
    case 'createChannel':
      dialogTitle.value = '创建渠道'
      active.value = 1
      break
    case 'updateChannel':
      dialogTitle.value = '修改渠道'
      active.value = 1
      break
    case 'createPage':
      dialogTitle.value = '创建页面'
      active.value = 2
      break
    case 'updatePage':
      dialogTitle.value = '修改页面'
      active.value = 2
      break
  }
  channelInForm.value = channel
  if (data) fData.value = data
}

/* 上一步 */
const previous = () => {
  active.value--
  dialogTitle.value = '创建渠道'
}

/* 下一步 */
const next = () => {
  page.value.getDataFromChannel(channelInForm.value)
  active.value++
  dialogTitle.value = '创建页面'
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/* 关闭弹窗 */
const close = () => {
  dialogVisible.value = false
  emit('success')
}

/* 传递数据 */
const variProps = ref({ channelInForm, fData, formType }) // 变量传递
const funcProps = ref({ next, close }) // 函数传递
defineExpose({ dialogVisible, open })

/* 渠道表单提交 */
const submitChannelForm = () => {
  switch (channelInForm.value) {
    case 1:
      fData.value = activity.value.formData
      activity.value.submitForm()
      break
    case 2:
      fData.value = agency.value.formData
      agency.value.submitForm()
      break
    case 3:
      fData.value = advertisement.value.formData
      advertisement.value.submitForm()
      break
    case 4:
      fData.value = naturalflow.value.formData
      naturalflow.value.submitForm()
      break
    case 5:
      fData.value = newmedia.value.formData
      newmedia.value.submitForm()
      break
  }
}

/* 页面表单提交 */
const submitPageForm = () => {
  page.value.submitForm()
}
</script>