<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="账号名称" prop="accountName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.accountName" placeholder="请输入账号名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="账号定位" prop="accountPosition" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.accountPosition" placeholder="请选择账号定位" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_POSITION)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="账号类型" prop="accountType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.accountType" placeholder="请选择账号类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="新媒体业务" prop="newMediaBusiness" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.newMediaBusiness" placeholder="请选择新媒体业务" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="新媒体平台" prop="newMediaPlatform" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.newMediaPlatform" placeholder="请选择新媒体平台" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
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
          <el-form-item label="账号状态" prop="accountStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.accountStatus" placeholder="请选择账号状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACCOUNT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-new-media:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-new-media:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('createChannel', 5)"
          v-hasPermi="['crm:channel-new-media:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-new-media:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="账号名称" align="center" prop="accountName" />
      <el-table-column label="账号定位" align="center" prop="accountPosition">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ACCOUNT_POSITION" :value="scope.row.accountPosition" />
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center" prop="accountType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ACCOUNT_TYPE" :value="scope.row.accountType" />
        </template>
      </el-table-column>
      <el-table-column label="新媒体业务" align="center" prop="newMediaBusiness">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_NEW_MEDIA_BUSINESS" :value="scope.row.newMediaBusiness" />
        </template>
      </el-table-column>
      <el-table-column label="新媒体平台" align="center" prop="newMediaPlatform" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_SNS_TYPE" :value="scope.row.newMediaPlatform" />
        </template>
      </el-table-column>
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" />
      <el-table-column label="销售负责人" align="center" prop="salesResponsibleName" />
      <el-table-column label="账号状态" align="center" prop="accountStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ACCOUNT_STATUS" :value="scope.row.accountStatus"
            v-hasNotPermi="['crm:channel-new-media:update']" />
          <el-switch v-model="scope.row.accountStatus" :active-value="0" :inactive-value="1" inline-prompt
            active-text="启用" inactive-text="停用" @change="handleStatusChange(scope.row)"
            v-hasPermi="['crm:channel-new-media:update']" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <el-button link type="success" @click="openForm('createPage', 5,
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
          <el-button link type="primary" @click="openForm('updateChannel', 5, { id: scope.row.id })"
            v-hasPermi="['crm:channel-new-media:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 新媒体 表单 -->
  <ChannelForm ref="channelFormRef" @success="getList" />
</template>

<script setup lang="ts">
import router from '@/router'
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ChannelNewMediaApi, ChannelNewMediaVO } from '@/api/crm/channel/newmedia'
import ChannelForm from '@/views/crm/channel/ChannelForm.vue'

/** 新媒体渠道 列表 */
defineOptions({ name: 'NewMedia' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ChannelNewMediaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  accountName: undefined,
  accountPosition: undefined,
  accountType: undefined,
  newMediaBusiness: undefined,
  newMediaPlatform: undefined,
  promotionResponsibleId: undefined,
  salesResponsibleId: undefined,
  accountStatus: undefined,
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
    const text = row.accountStatus === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.accountName}”该账号吗?`)
    // 发起修改状态
    await ChannelNewMediaApi.updateChannelNewMedia(row)
  } catch {
    // 取消后，进行恢复按钮
    row.accountStatus =
      row.accountStatus === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelNewMediaApi.getChannelNewMediaPage(queryParams)
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
      pageType: 5
    }
  })
}

/* 新增、编辑操作 */
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
    const data = await ChannelNewMediaApi.exportChannelNewMedia(queryParams)
    download.excel(data, '新媒体渠道.xlsx')
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