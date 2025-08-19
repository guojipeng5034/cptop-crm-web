<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-160px id">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员类型" prop="typeId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.typeId" placeholder="请选择学员类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STUDENT_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="参与活动次数" prop="activityCount" @keyup.enter="handleQuery">
            <el-input v-only-numbers v-model="queryParams.activityCount" placeholder="请输入参与活动次数" clearable
              class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="注册次数" prop="registerCount" @keyup.enter="handleQuery">
            <el-input v-only-numbers v-model="queryParams.registerCount" placeholder="请输入注册次数" clearable
              class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="付费人数" prop="paymentCount" @keyup.enter="handleQuery">
            <el-input v-only-numbers v-model="queryParams.paymentCount" placeholder="请输入付费人数" clearable
              class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属月份" prop="belongMonth" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.belongMonth" type="month" placeholder="请选择归属月份" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动限制" prop="activityId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityId" placeholder="请选择可参与的有效活动" clearable class="!w-240px">
              <el-option v-for="option in queryOptions.activity.list" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动参与状态" prop="activityJoinStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityJoinStatus" placeholder="请选择活动参与状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.deptId)"
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
          <el-form-item label="学员站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择学员站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:customer-level:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:customer-level:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:customer-level:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="primary" plain @click="pushMessage" v-hasPermi="['crm:wechat-message:push']">
          <Icon icon="fa-brands:pushed" class="mr-5px" /> 批量推送
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      @selection-change="handleSelectionChange" :row-key="row => row.id">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="130">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
            v-truncate="10">
            {{ scope.row.customerName }}
          </el-button>
          <span v-if="scope.row.customerId" class="flex justify-center items-center">
            <span>学号:</span>
            <el-tooltip effect="light" content="点击复制" placement="right">
              <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                {{ scope.row.customerId }}
              </el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="typeId" min-width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.STUDENT_TYPE" :value="scope.row.typeId" />
        </template>
      </el-table-column>
      <el-table-column label="参与活动次数" align="center" prop="activityCount" min-width="90" />
      <el-table-column label="注册次数" align="center" prop="registerCount" min-width="90" />
      <el-table-column label="付费人数" align="center" prop="paymentCount" min-width="90" />
      <el-table-column label="归属月份" align="center" prop="belongMonth" :formatter="dateFormatterYM" min-width="90" />
      <el-table-column label="操作" align="center" fixed="right" min-width="90">
        <template #default="scope">
          <el-button link type="primary" @click="getPoster(scope.row)" v-hasPermi="['crm:poster-setting:query']">
            海报
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 海报 表单 -->
  <GetPosterForm ref="getPosteRef" @success="getList" />
</template>

<script setup lang="ts">
import router from '@/router'
import {
  getIntDictOptions, DICT_TYPE, customerTypeOption, getActivityManageOptions,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { formatDate, dateFormatterYM } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { ActivityLevelApi, ActivityLevelVO } from '@/api/crm/activity/level'
import * as DeptApi from '@/api/system/dept'
import { useMessageStore } from '@/store/modules/message'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import GetPosterForm from '@/views/crm/customer/components/GetPosterForm.vue'

/** 学员分类 列表 */
defineOptions({ name: 'CustomerLevel' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ActivityLevelVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const messageStore = useMessageStore()
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  activityCount: undefined,
  registerCount: undefined,
  paymentCount: undefined,
  typeId: undefined,
  belongMonth: formatDate(new Date(), 'YYYY-MM'),
  activityId: undefined,
  activityJoinStatus: undefined,
  mentorId: undefined,
  deptId: [],
  siteId: [], // 学员站点
  fromArea: undefined, // 来源地区
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  activity: {
    list: ref([]),
    async get() {
      this.list = getActivityManageOptions(undefined, 10, formatDate(queryParams.belongMonth, 'YYYY-MM-DD'))
    }
  },
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.activity.get()
    await this.dept.load()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })
watch(() => queryParams.belongMonth, async (val) => {
  queryParams.activityId = undefined
  queryOptions.activity.list = await getActivityManageOptions(undefined, 10, formatDate(val, 'YYYY-MM-DD'))
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  if (queryParams.belongMonth) {
    queryParams.belongMonth = formatDate(queryParams.belongMonth, 'YYYY-MM-DD')
  }
  try {
    const data = await ActivityLevelApi.getCustomerLevelPage(queryParams)
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
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ActivityLevelApi.exportCustomerLevel(queryParams)
    download.excel(data, '学员分类.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 列表选中状态变化 */
const multipleSelection = ref([])
const multiplePageData = ref({ list: [], total: 0 })
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map(item => item.customerId)
  multiplePageData.value = { list: val.map(item => ({ customerId: item.customerId, customerName: item.customerName })), total: val.length }
}

/* 批量推送 */
const pushMessage = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行推送')
    return
  }
  messageStore.setType('create')
  messageStore.setLimit(-2)
  messageStore.setIds(multipleSelection.value)
  messageStore.setPageData(multiplePageData.value)
  router.push({
    name: 'MessageForm',
  })
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/* 海报 */
const getPosteRef = ref()
const getPoster = (row) => {
  getPosteRef.value.open(row.customerId, row.uid, row.agencyFlag, 'level', row.customerName)
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>
<style scoped lang="scss">
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .customer {
    :deep(.el-form-item__content) {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    .type {
      :deep(.el-select__wrapper) {
        font-size: 12px;
        font-weight: 700;
        background-color: #f5f7fa;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .id {
      :deep(.el-select__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>