<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <ContentWrap>
      <a-timeline mode="left" v-if="historyList.length !== 0" labelPosition="relative">
        <a-timeline-item v-for="history in historyList" :key="history.id" :label="history.createTime">
          <a-row :style="{ display: 'inline-flex', flexDirection: 'column' }">
            <div>{{ history.creator }}</div>
            <div>
              <div :style="{ fontSize: '14px', color: '#4E5969' }">
                <span>{{ history.workName }}：</span>
                <span>{{ history.workDetail }}</span>
              </div>
            </div>
          </a-row>
        </a-timeline-item>
      </a-timeline>
      <el-empty v-else description="当前无历史记录" />
      <!-- 分页 -->
      <el-pagination layout="prev, pager, next" v-model:current-page="queryParams.page" :total="total"
        :default-page-size="queryParams.pageSize" hide-on-single-page class="flex justify-center mt--5"
        @current-change="getHistoryList" />
    </ContentWrap>

    <template #footer>
      <el-button @click="dialogVisible = false">完 成</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { dateObjectToStr3 } from '@/utils/formatTime'
import { WechatRecordApi } from '@/api/crm/wechat/record'

/** 工作微信 历史记录弹窗 */
defineOptions({ name: 'HistoryForm' })

/* 配置项 */
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('历史记录') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const total = ref()

/* 历史记录数据 */
const historyList = ref<{
  id: number
  workName: string
  workDetail: string
  createTime: string
  creator: string
}[]>([])

/* 请求参数 */
const queryParams = ref({
  page: 1,
  pageSize: 5,
  wechatRecordId: undefined,
})

/* 获取历史记录 */
const getHistoryList = async () => {
  loading.value = true
  try {
    const data = await WechatRecordApi.getWechatRecordHistory(queryParams.value)
    historyList.value = data.list
    total.value = data.total
    historyList.value.forEach(item => {
      item.createTime = dateObjectToStr3(item.createTime)
    })
  } finally {
    loading.value = false
  }
}

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  loading.value = true
  queryParams.value.wechatRecordId = id
  await getHistoryList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>
