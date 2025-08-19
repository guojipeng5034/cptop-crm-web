<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="一级渠道" prop="pageType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.pageType" placeholder="一级渠道" clearable filterable class="!w-240px"
              @change="queryOptions.pageType.change">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="二级渠道" prop="channelLevelTwo" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelTwo" placeholder="二级渠道" :disabled="!queryParams.pageType"
              clearable filterable class="!w-240px">
              <el-option v-for="dict in queryOptions.channelLevelTwo.options" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="三级渠道" prop="channelLevelThree" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelThree" placeholder="三级渠道" clearable filterable
              :disabled="queryParams.pageType === undefined" :remote="queryOptions.channelLevelThree.needRemote"
              :loading="queryOptions.channelLevelThree.loading"
              :remote-method="queryOptions.channelLevelThree.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.channelLevelThree.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="四级渠道" prop="adid" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adid" placeholder="四级渠道" clearable filterable remote
              :loading="queryOptions.page.loading" :remote-method="queryOptions.page.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.page.options" :key="option.adid" :label="option.label"
                :value="option.adid">
                <div class="flex justify-between gap-4">
                  <span>{{ option.label }}</span>
                  <span style="color: var(--el-text-color-secondary); font-size: 13px;">
                    {{ getDictLabel(DICT_TYPE.CRM_CHANNEL_TYPE, option.pageType) }}
                  </span>
                </div>
              </el-option>
            </el-select>
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
          <el-form-item label="推广部门" prop="promotionResponsibleDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.promotionResponsibleDeptId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择推广部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.promotionResponsibleDeptId)"
              class="!w-240px">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广业务线" prop="promotionBusinessLineId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.promotionBusinessLineId" clearable placeholder="请选择推广业务线" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
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
          <el-form-item label="页面标签" prop="pageTags" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.pageTags" placeholder="请选择页面标签" clearable filterable remote
              :loading="queryOptions.pageTags.loading" :remote-method="queryOptions.pageTags.handleSearch"
              class="!w-240px">
              <el-option v-for="dict in queryOptions.pageTags.options" :key="dict.value" :label="dict.label"
                :value="dict.value" />
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
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="页面链接" prop="pageLink" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.pageLink" placeholder="请输入页面链接" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledAfterDate" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-page:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-page:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-page:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="一级渠道" align="center" prop="pageType" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_CHANNEL_TYPE" :value="scope.row.pageType" />
        </template>
      </el-table-column>
      <el-table-column label="二级渠道" align="center" prop="channelLevelTwoName" min-width="180" />
      <el-table-column label="三级渠道" align="center" prop="channelLevelThreeName" min-width="180" />
      <el-table-column label="四级渠道" align="center" prop="pageName" min-width="220" />
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" width="140" />
      <el-table-column label="推广部门" align="center" prop="promotionResponsibleDeptName" width="140" />
      <el-table-column label="推广业务线" align="center" prop="promotionBusinessLineId" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES" :value="scope.row.promotionBusinessLineId" />
        </template>
      </el-table-column>
      <el-table-column label="销售负责人" align="center" prop="salesResponsibleName" width="140" />
      <el-table-column label="页面标签" align="center" min-width="200">
        <template #default="scope">
          <el-tag v-for="item in scope.row.pageTagNames" :key="item" type="primary">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"
            v-hasNotPermi="['crm:channel-page:update']" />
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" inline-prompt active-text="启用"
            inactive-text="停用" @change="handleStatusChange(scope.row)" v-hasPermi="['crm:channel-page:update']" />
        </template>
      </el-table-column>
      <el-table-column label="页面链接" align="center" prop="pageLink" min-width="550">
        <template #default="scope">
          <el-button link type="primary" @click="handleCopy(scope.row.pageLink)">
            {{ scope.row.pageLink }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="150" />
      <el-table-column label="操作" align="center" fixed="right" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="
            openForm(
              'updatePage', scope.row.pageType,
              {
                id: scope.row.id,
                promotionResponsibleId: scope.row.promotionResponsibleId,
                promotionResponsibleName: scope.row.promotionResponsibleName,
                salesResponsibleId: scope.row.salesResponsibleId,
                salesResponsibleName: scope.row.salesResponsibleName,
                pageName: scope.row.pageName,
                channelId: scope.row.channelId
              }
            )">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 页面 表单 -->
  <ChannelForm ref="channelFormRef" @success="getList" />
</template>

<script setup lang="ts">
import {
  getIntDictOptions, DICT_TYPE, getDictLabel,
  handleRemoteUserOptions, handleRemotePageTagOptions, handleRemoteChannelActivityOptions,
  handleRemoteAgencyOptions, handleRemotePageOptions
} from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { dateFormatterYMDHms, disabledAfterDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { ChannelPageApi, ChannelPageVO } from '@/api/crm/channel/page'
import ChannelForm from '@/views/crm/channel/ChannelForm.vue'

/** 渠道页面 列表 */
defineOptions({ name: 'Page' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const route = useRoute()
const loading = ref(true) // 列表的加载中
const list = ref<ChannelPageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  pageType: undefined, // 一级渠道
  channelLevelTwo: undefined, // 二级渠道
  channelLevelThree: undefined, // 三级渠道
  adid: undefined, // 四级渠道
  channelId: undefined,
  promotionResponsibleId: undefined, // 推广负责人
  promotionResponsibleDeptId: [], // 推广负责人部门
  promotionBusinessLineId: undefined, // 推广业务线
  salesResponsibleId: undefined, // 销售负责人
  pageTags: undefined, // 页面标签
  status: undefined, // 状态
  pageLink: undefined, // 页面链接
  createTime: [] // 创建时间
})

/* 选项列表 */
const queryOptions = reactive({
  promotion: useRemoteSearch(handleRemoteUserOptions),
  sales: useRemoteSearch(handleRemoteUserOptions),
  pageTags: useRemoteSearch(handleRemotePageTagOptions),
  pageType: {
    change: () => {
      queryParams.channelLevelTwo = undefined
      queryParams.channelLevelThree = undefined
    },
  },
  channelActivity: useRemoteSearch(handleRemoteChannelActivityOptions, {
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelAgency: useRemoteSearch(handleRemoteAgencyOptions, {
    type: 2,
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelLevelTwo: {
    options: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return getIntDictOptions(DICT_TYPE.CRM_ACTIVITY_TYPE)
        case 2:
          return getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM).filter(item => item.value !== 0)
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_SOURCE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)
      }
    }),
  },
  channelLevelThree: {
    options: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.options
        case 2:
          return queryOptions.channelAgency.options
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)
      }
    }),
    loading: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.loading
        case 2:
          return queryOptions.channelActivity.loading
      }
    }),
    handleSearch: computed(() => {
      switch (queryParams.pageType) {
        case 1:
          return queryOptions.channelActivity.handleSearch
        case 2:
          return queryOptions.channelAgency.handleSearch
      }
    }),
    needRemote: computed(() => queryParams.pageType === 1 || queryParams.pageType === 2)
  },
  page: useRemoteSearch(handleRemotePageOptions, {
    pageType: toRef(queryParams, 'pageType'),
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
    channelLevelThree: toRef(queryParams, 'channelLevelThree'),
  }),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
  }
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.pageName}”该页面吗?`)
    // 发起修改状态
    await ChannelPageApi.updateChannelPage(row)
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelPageApi.getChannelPagePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.channelId = undefined
  /* 清除 url 的请求参数 */
  const cleanUrl = new URL(window.location.origin + window.location.pathname)
  window.history.replaceState({}, '', cleanUrl)
  handleQuery()
}

/** 修改操作 */
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
    const data = await ChannelPageApi.exportChannelPage(queryParams)
    download.excel(data, '渠道页面.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  if (route.query.id && route.query.pageType) {
    queryParams.id = route.query.id
    queryParams.pageType = Number(route.query.pageType)
  }
  if (route.query.channelId && route.query.pageType) {
    queryParams.channelId = route.query.channelId
    queryParams.pageType = Number(route.query.pageType)
  }
  if (route.query.pageLink) {
    queryParams.pageLink = route.query.pageLink
  }
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