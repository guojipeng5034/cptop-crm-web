<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="customerType" placeholder="类型" class="!w-80px type">
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
          <el-form-item label="停课操作人" prop="stopLessonUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.stopLessonUserId" placeholder="请检索后选择停课操作人" clearable filterable remote
              :loading="queryOptions.stopLessonUser.loading" :remote-method="queryOptions.stopLessonUser.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.stopLessonUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课时间" prop="stopLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.stopLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="恢复操作人" prop="openLessonUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.openLessonUserId" placeholder="请检索后选择恢复操作人" clearable filterable remote
              :loading="queryOptions.openLessonUser.loading" :remote-method="queryOptions.openLessonUser.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.openLessonUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐恢复时间" prop="openLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.openLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课月数" prop="stopMonthCount" @keyup.enter="handleQuery">
            <el-input-number v-limit-input v-model="queryParams.stopMonthCount" placeholder="请输入停课月数" class="!w-240px"
              :min="1" :max="6" :step="1" step-strictly />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课类型" prop="stopLessonType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.stopLessonType" placeholder="请选择或检索停课类型" filterable clearable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STOP_LESSON_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="计划开课日期" prop="planOpenLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.planOpenLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" placeholder="请检索后选择Mentor" clearable filterable remote
              :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:package-stop-log:query']">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:package-stop-log:query']">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:package-stop-log:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="140">
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
      <el-table-column label="停课操作人" align="center" prop="stopLessonUserName" />
      <el-table-column label="停课时间" align="center" prop="stopLessonTime" :formatter="timeWithoutSecondFormat" />
      <el-table-column label="停课类型" align="center" prop="stopLessonType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.STOP_LESSON_TYPE" :value="scope.row.stopLessonType" />
        </template>
      </el-table-column>
      <el-table-column label="停课月数" align="center" prop="stopMonthCount" />
      <el-table-column label="计划开课日期" align="center" prop="planOpenLessonTime" :formatter="timeWithoutSecondFormat"
        width="110" />
      <el-table-column label="恢复操作人" align="center" prop="openLessonUserName" />
      <el-table-column label="套餐恢复时间" align="center" prop="openLessonTime" :formatter="timeWithoutSecondFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import { StopLogApi, StopLogVO } from '@/api/crm/package/stopLog'

/** 学员套餐停课记录 列表 */
defineOptions({ name: 'StopLog' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()
const router = useRouter() // 路由
const loading = ref(true) // 列表的加载中
const list = ref<StopLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  stopLessonUserId: undefined, // 停课操作人
  stopLessonTime: [], // 停课时间
  openLessonUserId: undefined, // 恢复操作人
  openLessonTime: [], // 套餐恢复时间
  stopMonthCount: undefined, // 停课月数
  stopLessonType: undefined, // 停课类型
  planOpenLessonTime: [], // 计划开课日期
  createTime: [], // 创建时间
  mentorId: undefined, // Mentor
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  stopLessonUser: useRemoteSearch(handleRemoteUserOptions),
  openLessonUser: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StopLogApi.getStopLogPage(queryParams)
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
  clearRouterQuery()
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await StopLogApi.exportStopLog(queryParams)
    download.excel(data, '学员套餐停课记录.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 清除 router query */
const clearRouterQuery = async () => {
  if (route.query.customerId) {
    await nextTick() // 等待当前任务队列完成
    await router.replace({
      path: route.path,
      query: {} // 清空 query
    })
  }
}

/** 初始化 **/
onMounted(async () => {
  if (route.query.customerId && route.query.customerName) {
    queryParams.customerId = Number(route.query.customerId)
    queryOptions.customer.handleSearch(route.query.customerName)
  }
  getList()
})
onBeforeUnmount(async () => {
  // 如果是在订单套餐绑定页面通过课时点套餐跳转过来，则清空路由参数，避免下次进入页面时，仍然有路由参数导致查询条件有误
  await clearRouterQuery()
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

.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      .cell {
        padding: 0;
      }
    }
  }
}
</style>
