<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="广告名称" prop="adName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.adName" placeholder="请输入广告名称" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="投放平台" prop="adPlatform" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adPlatform" placeholder="请选择投放平台" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="投放渠道" prop="adChannel" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adChannel" placeholder="请选择投放渠道" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="投放方式" prop="adMode" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adMode" placeholder="请选择投放方式" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_MODE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="投放日期" prop="adTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.adTime" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" value-format="YYYY-MM-DD HH:mm:ss"
              class="!w-220px" />
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
          <el-form-item label="广告状态" prop="adStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adStatus" placeholder="请选择广告状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADVERTISEMENT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-advertisement:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-advertisement:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('createChannel', 3)"
          v-hasPermi="['crm:channel-advertisement:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-advertisement:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="广告名称" align="center" prop="adName" min-width="140" />
      <el-table-column label="投放渠道" align="center" prop="adChannel" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ADVERTISEMENT_CHANNELS" :value="scope.row.adChannel" />
        </template>
      </el-table-column>
      <el-table-column label="投放平台" align="center" prop="adPlatform" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ADVERTISEMENT_PLATFORM" :value="scope.row.adPlatform" />
        </template>
      </el-table-column>
      <el-table-column label="投放方式" align="center" prop="adMode" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ADVERTISEMENT_MODE" :value="scope.row.adMode" />
        </template>
      </el-table-column>
      <el-table-column label="投放日期" align="center" prop="adStartTime" :formatter="dateFormatterYMD" min-width="110" />
      <el-table-column label="失效日期" align="center" prop="adEndTime" :formatter="dateFormatterYMD" min-width="110" />
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" min-width="110" />
      <el-table-column label="销售负责人" align="center" prop="salesResponsibleName" min-width="110" />
      <el-table-column label="广告状态" align="center" prop="adStatus" width="170" :show-overflow-tooltip="false">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ADVERTISEMENT_STATUS" :value="scope.row.adStatus"
            v-hasNotPermi="['crm:channel-advertisement:update']" />
          <div v-hasPermi="['crm:channel-advertisement:update']">
            <el-slider v-model="scope.row.adStatus" :marks="marks" :step="1" :min="0" :max="2" :show-tooltip="false"
              class="px-4 pb-1" @change="handleStatusChange(scope.row)" />
            <p></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="openForm('createPage', 3,
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
          <el-button link type="primary" @click="openForm('updateChannel', 3, { id: scope.row.id })"
            v-hasPermi="['crm:channel-advertisement:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 广告 表单 -->
  <ChannelForm ref="channelFormRef" @success="getList" />
</template>

<script setup lang="ts">
import router from '@/router'
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMD } from '@/utils/formatTime'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ChannelAdvertisementApi, ChannelAdvertisementVO } from '@/api/crm/channel/advertisement'
import ChannelForm from '@/views/crm/channel/ChannelForm.vue'

/** 广告 列表 */
defineOptions({ name: 'Advertisement' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ChannelAdvertisementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 搜索参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  adName: undefined, // 广告名称
  adChannel: undefined, // 投放渠道
  adPlatform: undefined,  // 投放平台
  adMode: undefined, // 投放方式
  adTime: [], // 投放日期
  promotionResponsibleId: undefined,
  salesResponsibleId: undefined,
  adStatus: undefined,
})

/* 选项列表 */
const queryOptions = reactive({
  promotion: useRemoteSearch(handleRemoteUserOptions),
  sales: useRemoteSearch(handleRemoteUserOptions),
})

/* 广告状态分界点 */
const marks = {
  0: { label: '活跃', style: { color: '#409EFF' } },
  1: { label: '暂停投放', style: { color: '#67C23A' } },
  2: { label: '终止', style: { color: '#F56C6C' } },
}

/* 滑块值变化修改广告状态 */
const handleStatusChange = async (row) => {
  loading.value = true
  try {
    await ChannelAdvertisementApi.updateChannelAdvertisement(row)
  } finally {
    loading.value = false
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelAdvertisementApi.getChannelAdvertisementPage(queryParams)
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

/* 查看页面列表 */
const toPageList = (row) => {
  router.push({
    name: 'Page',
    query: {
      channelId: row.id,
      pageType: 3
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
    const data = await ChannelAdvertisementApi.exportChannelAdvertisement(queryParams)
    download.excel(data, '广告.xlsx')
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

.el-slider__button-wrapper::after {
  display: none !important;
}
</style>