<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动名称" prop="activityName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.activityName" placeholder="请输入活动名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广负责人" prop="promotionResponsibleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.promotionResponsibleId" filterable clearable remote
              :loading="queryOptions.promotion.loading" :remote-method="queryOptions.promotion.handleSearch"
              placeholder="请选择推广负责人" class="!w-240px">
              <el-option v-for="option in queryOptions.promotion.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="销售负责人" prop="salesResponsibleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.salesResponsibleId" filterable clearable remote
              :loading="queryOptions.sales.loading" :remote-method="queryOptions.sales.handleSearch"
              placeholder="请选择销售负责人" class="!w-240px">
              <el-option v-for="option in queryOptions.sales.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-activity:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-activity:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('createChannel', 1)"
          v-hasPermi="['crm:channel-activity:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-activity:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="活动名称（转介绍）" align="center" prop="activityName" />
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" />
      <el-table-column label="销售负责人" align="center" prop="salesResponsibleName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"
            v-hasNotPermi="['crm:channel-activity:update']" />
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" inline-prompt active-text="启用"
            inactive-text="停用" @change="handleStatusChange(scope.row)" v-hasPermi="['crm:channel-activity:update']" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="openForm('createPage', 1,
            {
              id: scope.row.id,
              promotionResponsibleId: scope.row.promotionResponsibleId,
              promotionResponsibleName: scope.row.promotionResponsibleName,
              salesResponsibleId: scope.row.salesResponsibleId,
              salesResponsibleName: scope.row.salesResponsibleName,
            }
          )" v-hasPermi="['crm:channel-page:create']">
            新建页面
          </el-button>
          <el-button link type="info" @click="toPageList(scope.row)" v-hasPermi="['crm:channel-page:query']">
            查看页面
          </el-button>
          <el-button link type="primary" @click="openForm('updateChannel', 1, { id: scope.row.id })"
            v-hasPermi="['crm:channel-activity:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 活动 表单 -->
  <ChannelForm ref="channelFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import router from '@/router'
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ChannelActivityApi, ChannelActivityVO } from '@/api/crm/channel/activity'
import ChannelForm from '@/views/crm/channel/ChannelForm.vue'

/** 活动渠道 列表 */
defineOptions({ name: 'Activity' })

/* 配置项 */
const route = useRoute()
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ChannelActivityVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求数据 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  activityType: undefined,
  activityName: undefined,
  promotionResponsibleId: undefined,
  salesResponsibleId: undefined,
  status: undefined,
})

/* 选项列表 */
const queryOptions = reactive({
  promotion: useRemoteSearch(handleRemoteUserOptions),
  sales: useRemoteSearch(handleRemoteUserOptions),
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.activityName}”该活动吗?`)
    // 发起修改状态
    await ChannelActivityApi.updateChannelActivity(row)
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

// 查询列表操作
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelActivityApi.getChannelActivityPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置按钮操作
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/* 查看页面列表 */
const toPageList = (row) => {
  router.push({
    name: 'Page',
    query: {
      channelId: row.id,
      pageType: 1
    }
  })
}

/* 表单操作 */
const channelFormRef = ref()
const openForm = (type: string, channel: number, data?: object) => {
  channelFormRef.value.open(type, channel, data)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ChannelActivityApi.exportChannelActivity(queryParams)
    download.excel(data, '活动.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
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