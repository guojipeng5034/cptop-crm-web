<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
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
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索Mentor" class="!w-240px">
              <el-option v-for="item in queryOptions.mentor.options" :key="item.value" :label="item.label"
                :value="item.value" />
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
          <el-form-item label="打卡状态" prop="clockStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.clockStatus" placeholder="请选择打卡状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CLOCK_STATUS)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="打卡次数" prop="clockNum" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.clockNum" placeholder="请选择打卡次数" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CLOCK_NUM)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="首次开课时间" prop="lessonStartTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.lessonStartTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属月份" prop="clockMonth" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.clockMonth" type="month" placeholder="请选择归属月份" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="联系纪要状态" prop="isEffectiveStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isEffectiveStatus" placeholder="请选择联系纪要状态" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="联系纪要" prop="effectiveChatContent" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.effectiveChatContent" placeholder="请输入联系纪要" clearable class="!w-240px" />
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
        <el-button @click="handleQuery" v-hasPermi="['crm:customer-clock:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:customer-clock:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:customer-clock:export']">
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
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh"
      :default-sort="{ prop: 'clockTime', order: 'descending' }" @selection-change="handleSelectionChange"
      :row-key="row => row.id" @sort-change="handleSortChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="150">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
            v-truncate="10">
            {{ scope.row.customerName }}
          </el-button>
          <span v-if="scope.row.customerId" class="flex justify-center items-center">
            <span>学号:</span>
            <el-tooltip effect="light" content="点击复制" placement="right">
              <el-button link type="primary" @click="handleCopy" class="!text-3 !p-0">
                {{ scope.row.customerId }}
              </el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="首次开课时间" align="center" prop="lessonStartTime" :formatter="dateFormatterYMD"
        sortable="custom" min-width="110" />
      <el-table-column label="打卡归属月份" align="center" prop="clockMonth" :formatter="dateFormatterYM" width="110" />
      <el-table-column label="实际打卡日期" align="center" prop="clockTime" :formatter="dateFormatterYMD" sortable="custom"
        min-width="110" />
      <el-table-column label="实际打卡次数" align="center" prop="clockCount" />
      <el-table-column label="应打卡周期" align="center">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CLOCK_NUM" :value="scope.row.clockNum" />
        </template>
      </el-table-column>
      <el-table-column label="打卡状态" align="center">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CLOCK_STATUS" :value="scope.row.clockStatus" />
        </template>
      </el-table-column>
      <el-table-column label="Mentor" align="center" prop="mentorName" min-width="140" />
      <el-table-column label="打卡日志" width="140" align="center" :show-overflow-tooltip="false">
        <template #default="scope">
          <el-popover placement="bottom" width="1000" trigger="click" @before-enter="showPopover(scope.row)"
            @before-leave="hidePopover(scope.row)">
            <template #reference>
              <el-check-tag :checked="scope.row.checked || scope.row.isEffectiveStatus"
                :type="scope.row.isEffectiveStatus ? 'success' : 'primary'">联系内容</el-check-tag>
            </template>
            <el-form>
              <el-table :data="scope.row.wechatLogList">
                <el-table-column width="130" align="center" prop="clockTime" label="打卡日期">
                  <template #default="innerScope">
                    {{ formatDate(innerScope.row.clockTime, 'YYYY-MM-DD') }}
                  </template>
                </el-table-column>
                <el-table-column width="500" align="center" prop="effectiveChatContent" label="文字记录" />
                <el-table-column align="center" label="图片记录">
                  <template #default="innerScope">
                    <span v-for="(url, index) in innerScope.row.effectiveChatPage" :key="index">
                      <el-image style="width: 60px; height: 60px" :src="url"
                        :preview-src-list="innerScope.row.effectiveChatPage" preview-teleported :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2" :initial-index="index" fit="scale-down" />
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button v-if="formatDate(scope.row.clockMonth, 'YYYY-MM') === formatDate(new Date(), 'YYYY-MM')" link
            type="success" @click="openWechatLogForm(scope.row.id, scope.row.isEffectiveStatus)">
            {{ scope.row.isEffectiveStatus ? '修改' : '添加' }}纪要
          </el-button>
          <el-button link type="primary" @click="getPoster(scope.row)" v-hasPermi="['crm:poster-setting:query']">
            海报
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:customer-clock:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
  
  <!-- 联系纪要 表单 -->
  <WechatLogForm ref="wechatLogFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="customerDrawerRef" @refresh-customer-list="getList" />
  <!-- 海报 表单 -->
  <GetPosterForm ref="getPosteRef" @success="getList" />
</template>

<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getBoolDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { formatDate, dateFormatterYMD, dateFormatterYM } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { handleSortfields } from '@/utils/table'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { useMessageStore } from '@/store/modules/message'
import * as DeptApi from '@/api/system/dept'
import { ActivityClockApi, ActivityClockVO } from '@/api/crm/activity/clock'
import WechatLogForm from './WechatLogForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import GetPosterForm from '@/views/crm/customer/components/GetPosterForm.vue'

/** 打卡记录 列表 */
defineOptions({ name: 'Clock' })

/* 配置项 */
const { t } = useI18n()
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ActivityClockVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const messageStore = useMessageStore()
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  clockNum: undefined, // 打卡次数
  lessonStartTime: [], // 首次开课时间
  clockMonth: formatDate(new Date(), 'YYYY-MM'), // 归属月份
  mentorId: undefined, // Mentor
  deptId: [], // 所属部门
  isEffectiveStatus: undefined, // 联系纪要状态
  effectiveChatContent: undefined, // 联系纪要
  siteId: [], // 学员站点
  fromArea: undefined, // 来源地区
  clockStatus: undefined, // 打卡状态
  orderBy: [''],
})
const queryFormRef = ref() // 搜索的表单

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  mentor: useRemoteSearch(handleRemoteUserOptions),
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
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/* 查询打卡记录 */
const wechatLogList = ref([])
const getWechatLog = async (clockId) => {
  const data = await ActivityClockApi.getCustomerClock(clockId)
  Object.assign(wechatLogList.value, {
    clockTime: data.clockTime,
    effectiveChatContent: data.effectiveChatContent,
    effectiveChatPage: data.effectiveChatPage
  })
  return wechatLogList.value
}

/* 显示弹窗 */
const showPopover = async (row) => {
  row.checked = true
  row.wechatLogList = []
  const wechatLogItem = await getWechatLog(row.id)
  if (wechatLogItem.effectiveChatContent !== null) {
    row.wechatLogList[0] = wechatLogItem
  }
}
/* 隐藏弹窗 */
const hidePopover = (row) => {
  row.checked = false
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  if (queryParams.clockMonth) {
    queryParams.clockMonth = formatDate(queryParams.clockMonth, 'YYYY-MM-DD')
  }
  try {
    const data = await ActivityClockApi.getCustomerClockPage(queryParams)
    list.value = data.list
    total.value = data.total
    list.value.forEach(item => {
      item.checked = false
      // item.wechatLogList = []
    })
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

/** 添加/修改操作 */
const wechatLogFormRef = ref()
const openWechatLogForm = (id: number, status: number) => {
  wechatLogFormRef.value.open(id, status)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ActivityClockApi.deleteCustomerClock(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
    message.error('删除失败')
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ActivityClockApi.exportCustomerClock(queryParams)
    download.excel(data, '打卡记录.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 列表选中状态变化 */
const multipleSelection = ref([])
const multiplePageData = ref({ list: [], total: 0 })
const handleSelectionChange = (val) => {
  multiplePageData.value = {
    list: val.map(item => ({ customerId: item.customerId, customerName: item.customerName })),
    total: val.length
  }
  multipleSelection.value = val.map(item => item.customerId)
}

/* 批量推送 */
const pushMessage = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行推送')
  } else {
    messageStore.setType('create')
    messageStore.setLimit(7)
    messageStore.setIds(multipleSelection.value)
    messageStore.setPageData(multiplePageData.value)
    router.push({
      name: 'MessageForm',
    })
  }
}

/** 后端排序  */
/* 表格排序字段变化回调 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/* 打开学员详情 */
const customerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  customerDrawerRef.value.openDrawer(id, name)
}

/* 海报 */
const getPosteRef = ref()
const getPoster = (row) => {
  getPosteRef.value.open(row.customerId, row.uid, row.agencyFlag, 'clock', row.customerName)
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>
<style lang="scss" scoped>
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