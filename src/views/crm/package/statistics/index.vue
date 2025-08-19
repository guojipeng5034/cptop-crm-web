<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" placeholder="请检索后选择Mentor" clearable filterable remote
              :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择或检索所属部门" node-key="id"
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
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:package-statistics:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:package-statistics:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="statistics flex items-center">
      <div class="statistics-data flex-1 flex items-center">
        <div class="statistics-data-item">
          <span class="item-label">待交付月数(1500点)：</span><span class="item-num">{{ pendingMonths1500 }}</span>
        </div>
        <div class="statistics-data-item">
          <span class="item-label">待交付月数(750点)：</span><span class="item-num">{{ pendingMonths750 }}</span>
        </div>
      </div>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border show-summary max-height="70vh" :row-key="(row) => row.id"
      class="data-table custom-summary" @sort-change="handleSortChange" @selection-change="handleSelectionChange"
      :summary-method="handleSummaries">
      <el-table-column type="selection" align="center" width="60" class-name="selection-col" />
      <el-table-column label="Mentor" align="center" prop="mentorName" :min-width="140" />
      <el-table-column label="Pending数" align="center" prop="pendingNumber" />
      <el-table-column label="已开课数" align="center" prop="openNumber" />
      <el-table-column label="已停课数" align="center" prop="stopNumber" />
      <el-table-column label="Pending占比" align="center" prop="pendingPercentage" :formatter="jointPercentFormat" />
      <el-table-column label="已停课占比" align="center" prop="stopPercentage" :formatter="jointPercentFormat" />
    </el-table>

    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getStatistics" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { jointPercentFormat } from '@/utils/formatter'
import { handleSortfields } from '@/utils/table'
import { isEmpty } from '@/utils/is'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { PackagesStatisticsApi, PackagesStatisticsVO } from '@/api/crm/package/statistics'

/** 代理佣金总额 列表 */
defineOptions({ name: 'PackageStatistics' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<PackagesStatisticsVO[]>([]) // 列表的数据
const queryFormRef = ref() // 搜索的表单

const total = ref(0) // 列表的总页数
const statistics = ref<PackagesStatisticsVO | null>({
  mentorName: '',
  pendingNumber: 0,
  openNumber: 0,
  stopNumber: 0,
  pendingPercentage: 0,
  stopPercentage: 0,
  pendingMonths1500: 0,
  pendingMonths750: 0
})
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mentorId: undefined,
  deptId: [],
  orderBy: ['']
})

/* 选项列表 */
const queryOptions = reactive({
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

/** 查询列表和总计 */
const getStatistics = async () => {
  loading.value = true
  try {
    const pageData = await PackagesStatisticsApi.getPackagesStatisticsPage(queryParams)
    const totalData = await PackagesStatisticsApi.getPackagesStatisticsTotal(queryParams)
    list.value = pageData.list
    total.value = pageData.total
    statistics.value = totalData
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getStatistics()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 计算属性  */
/* 1500 pending月数 */
const pendingMonths1500 = computed(() => {
  if (isEmpty(statistics.value)) return 0
  else if (!statistics.value.pendingMonths1500) return 0
  return statistics.value.pendingMonths1500
})
/* 750 pending月数 */
const pendingMonths750 = computed(() => {
  if (isEmpty(statistics.value)) return 0
  else if (!statistics.value.pendingMonths750) return 0
  return statistics.value.pendingMonths750
})

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/** 后端合计  */
interface SummaryMethodProps<T = PackagesStatisticsVO> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
const handleSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (!isEmpty(statistics.value) && column.property) {
      sums[index] = column.property.includes("Percentage") ? statistics.value[column.property] + "%" : statistics.value[column.property]
    }
  })
  return sums
}

/** 列表选择：暂时未用  */
const handleSelectionChange = (val) => { }

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getStatistics()
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

.statistics {

  .statistics-data {
    font-size: 16px;
    font-weight: bold;
  }

  .statistics-data-item {
    margin-right: 20px;
    line-height: 16px;

    .item-num {
      border-radius: 5px;
      padding: 3px 8px;
      background-color: #e7e7e7;
    }
  }

  .statistics-data-item:last-child {
    margin-right: 0;
  }
}

:deep(.data-table) {

  /* 合计行 */
  .el-table__footer {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
