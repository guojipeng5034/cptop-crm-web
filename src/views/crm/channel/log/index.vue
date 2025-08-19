<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" filterable clearable remote :loading="queryOptions.creator.loading"
              :remote-method="queryOptions.creator.handleSearch" placeholder="请选择操作人" class="!w-240px">
              <el-option v-for="option in queryOptions.creator.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作渠道" prop="channelPageId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelPageId" filterable clearable remote
              :loading="queryOptions.channelPage.loading" :remote-method="queryOptions.channelPage.handleSearch"
              placeholder="请选择操作渠道" class="!w-240px">
              <el-option v-for="option in queryOptions.channelPage.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作类型" prop="type" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.type" placeholder="请选择操作类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_OPERATE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更前" prop="before" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.before" filterable clearable remote :loading="queryOptions.before.loading"
              :remote-method="queryOptions.before.handleSearch" placeholder="请选择变更前" class="!w-240px">
              <el-option v-for="option in queryOptions.before.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更后" prop="after" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.after" filterable clearable remote :loading="queryOptions.after.loading"
              :remote-method="queryOptions.after.handleSearch" placeholder="请选择变更后" class="!w-240px">
              <el-option v-for="option in queryOptions.after.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" value-format="YYYY-MM-DD HH:mm:ss"
              class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-change-log:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-change-log:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-change-log:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="操作人" align="center" prop="creatorName" />
      <el-table-column label="操作渠道" align="center" prop="channelPageName" />
      <el-table-column label="操作类型" align="center" prop="type">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_CHANNEL_OPERATE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="变更前" align="center" prop="beforeName" />
      <el-table-column label="变更后" align="center" prop="afterName" />
      <el-table-column label="操作时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions,
  handleRemoteUserOptions, handleRemotePageOptions
} from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ChannelPageLogApi } from '@/api/crm/channel/log'

/** 自然流量渠道 列表 */
defineOptions({ name: 'ChannelChangeLog' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中列表的总页数

/* 请求数据 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  creator: undefined,
  channelPageId: undefined,
  type: undefined, // 操作类型
  before: undefined, // 变更前
  after: undefined, // 变更后
  createTime: [], // 操作时间
})

/* 选项列表 */
const queryOptions = reactive({
  before: useRemoteSearch(handleRemoteUserOptions),
  after: useRemoteSearch(handleRemoteUserOptions),
  creator: useRemoteSearch(handleRemoteUserOptions),
  channelPage: useRemoteSearch(handleRemotePageOptions),
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelPageLogApi.getChannelPageLogPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ChannelPageLogApi.exportChannelPageLog(queryParams)
    download.excel(data, '渠道页面变更日志.xlsx')
  } finally {
    exportLoading.value = false
  }
}

onMounted(async () => {
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}
</style>