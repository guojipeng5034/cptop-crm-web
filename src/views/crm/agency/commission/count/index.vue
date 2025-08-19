<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="月份" prop="searchMonth" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.searchMonth" format="YYYY-MM" value-format="YYYY-MM" type="month"
              placeholder="请选择查看报表的月份" :disabled-date="disabledAfterMonth" :clearable="false" @change="getList"
              class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="代理" prop="agencyId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
              :loading="queryOptions.agency.loading" :remote-method="queryOptions.agency.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.agency.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:agency-commission-count:query']">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:agency-commission-count:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:agency-commission-count:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe max-height="80vh" class="data-table" :row-key="(row) => row.id"
      :header-cell-style="headerCellStyle" :cell-style="columnBackgroundColor" @sort-change="handleSortChange">
      <el-table-column label="代理" align="center" prop="agencyName" min-width="200" fixed>
        <template #default="scope">
          <el-tooltip effect="light" content="点击查看代理信息" placement="top">
            <el-button link type="primary" @click="toAgencyList(scope.row.agencyId, scope.row.agencyName)">
              {{ scope.row.agencyName }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="推荐学员数" align="center" prop="recommendationCount" sortable="custom" min-width="120" />

      <el-table-column label="总佣金" align="center" prop="totalCommissionCount" sortable="custom"
        :formatter="formatFinanceAmount" min-width="100" />

      <el-table-column label="新学员首单佣金" align="center">
        <el-table-column label="订单总数" align="center" prop="newOrderCount" min-width="100" />
        <el-table-column label="实付总额" align="center" prop="newOrderActuallyPaidCount" min-width="100" />
        <el-table-column label="佣金总额" align="center" prop="newOrderCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="学员续费佣金" align="center">
        <el-table-column label="订单总数" align="center" prop="renewOrderCount" min-width="100" />
        <el-table-column label="实付总额" align="center" prop="renewOrderActuallyPaidCount" min-width="100" />
        <el-table-column label="佣金总额" align="center" prop="renewOrderCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="下级代理推荐佣金" align="center">
        <el-table-column label="订单总数" align="center" prop="secondaryAgencyCount" min-width="100" />
        <el-table-column label="实付总额" align="center" prop="secondaryAgencyActuallyPaidCount" min-width="100" />
        <el-table-column label="佣金总额" align="center" prop="secondaryAgencyCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="学员转介绍佣金" align="center">
        <el-table-column label="付费总数" align="center" prop="customerRecommendationPaidCount" min-width="100" />
        <el-table-column label="实付总额" align="center" prop="customerRecommendationActuallyPaidCount" min-width="100" />
        <el-table-column label="佣金总额" align="center" prop="customerRecommendationCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="新学员首单佣金退费" align="center">
        <el-table-column label="订单总数" align="center" prop="refundNewOrderCount" min-width="100" />
        <el-table-column label="实退总额" align="center" prop="refundNewOrderActuallyPaidCount" min-width="100" />
        <el-table-column label="应扣佣金" align="center" prop="refundNewOrderCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="学员续费佣金退费" align="center">
        <el-table-column label="订单总数" align="center" prop="refundRenewOrderCount" min-width="100" />
        <el-table-column label="实退总额" align="center" prop="refundRenewOrderActuallyPaidCount" min-width="100" />
        <el-table-column label="应扣佣金" align="center" prop="refundRenewOrderCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="下级代理推荐佣金退费" align="center">
        <el-table-column label="订单总数" align="center" prop="refundSecondaryAgencyCount" min-width="100" />
        <el-table-column label="实退总额" align="center" prop="refundSecondaryAgencyActuallyPaidCount" min-width="100" />
        <el-table-column label="应扣佣金" align="center" prop="refundSecondaryAgencyCommissionCount" min-width="100" />
      </el-table-column>

      <el-table-column label="学员转介绍佣金退费" align="center">
        <el-table-column label="订单总数" align="center" prop="refundCustomerRecommendationPaidCount" min-width="100" />
        <el-table-column label="实退总额" align="center" prop="refundCustomerRecommendationActuallyPaidCount"
          min-width="100" />
        <el-table-column label="应扣佣金" align="center" prop="refundCustomerRecommendationCommissionCount"
          min-width="100" />
      </el-table-column>

      <el-table-column label="往期欠款（已抵扣）" align="right" prop="pastDebtsCount" sortable="custom"
        :formatter="formatFinanceAmount" min-width="110" />
      <el-table-column label="往期欠款总额" align="right" prop="pastDebtsOriginalCount" sortable="custom"
        :formatter="formatFinanceAmount" min-width="140" />
      <el-table-column label="更新时间" align="center" prop="renewalTime" :formatter="dateFormatterYMD" min-width="120" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteAgencyOptions } from '@/utils/dict'
import { dateFormatterYMD, disabledAfterMonth, formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { handleSortfields, formatFinanceAmount } from '@/utils/table'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { AgencyCommissionCountApi, AgencyCommissionCountVO } from '@/api/crm/agency/commission/count'
import router from '@/router'

/** 代理佣金总额 列表 */
defineOptions({ name: 'AgencyCommissionCount' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<AgencyCommissionCountVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agencyId: undefined,
  searchMonth: formatDate(new Date(), 'YYYY-MM'),
  orderBy: ['']
})

/* 选项列表 */
const queryOptions = reactive({
  agency: useRemoteSearch(handleRemoteAgencyOptions),
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgencyCommissionCountApi.getAgencyCommissionCountPage(queryParams)
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
    const data = await AgencyCommissionCountApi.exportAgencyCommissionCount(queryParams)
    download.excel(data, '代理佣金总额.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 设置背景色 */
const headerCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  const blueParentHeaderColumnIndex = [3, 5, 7, 9]
  const yellowParentHeaderColumnIndex = [4, 6, 8, 10]
  const blueSubHeaderColumnIndex = [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20]
  const yellowSubHeaderColumnIndex = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23]

  if (
    (rowIndex === 0 && blueParentHeaderColumnIndex.includes(columnIndex)) ||
    (rowIndex === 1 && blueSubHeaderColumnIndex.includes(columnIndex))
  ) {
    return {
      backgroundColor: 'rgba(215, 255, 255, 1)'
      // fontSize: '14px',
      // lineHeight: '16px'
    }
  }
  if (
    (rowIndex === 0 && yellowParentHeaderColumnIndex.includes(columnIndex)) ||
    (rowIndex === 1 && yellowSubHeaderColumnIndex.includes(columnIndex))
  ) {
    return {
      backgroundColor: 'rgba(255, 255, 215, 1)'
      // fontSize: '14px',
      // lineHeight: '16px'
    }
  }
}
const columnBackgroundColor = ({ row, column, rowIndex, columnIndex }) => {
  const buleColumnIndex = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23]
  const yellowColumnIndex = [6, 7, 8, 12, 13, 14, 18, 19, 20, 24, 25, 26]
  const redTextColumnIndex = [15, 16, 17, 21, 22, 23, 18, 19, 20, 24, 25, 26]

  if (buleColumnIndex.includes(columnIndex)) {
    if (redTextColumnIndex.includes(columnIndex)) {
      return {
        backgroundColor: 'rgba(215, 255, 255, 0.3)',
        color: '#f00'
      }
    }
    return {
      backgroundColor: 'rgba(215, 255, 255, 0.3)'
    }
  }
  if (yellowColumnIndex.includes(columnIndex)) {
    if (redTextColumnIndex.includes(columnIndex)) {
      return {
        backgroundColor: 'rgba(255, 255, 215, 0.3)',
        color: '#f00'
      }
    }
    return {
      backgroundColor: 'rgba(255, 255, 215, 0.3)'
    }
  }
}

/* 表格字段排序 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/* 代理名字点击 */
const toAgencyList = (id: number, name: string) => {
  router.push({
    name: 'Agency',
    query: {
      agencyId: id,
      agencyName: name
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.search-form) {
  .el-form-item {
    margin-right: 20px;
  }

  /* 控制 search form label 分散对齐 */
  .el-form-item__label {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}

.font-size-3 :deep(.el-form-item__label) {
  font-size: 0.75rem;
  background-color: rgb(161, 255, 255);
}
</style>
