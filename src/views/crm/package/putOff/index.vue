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
          <el-form-item label="预约时间" prop="putOffTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.putOffTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课月数" prop="stopMonth" @keyup.enter="handleQuery">
            <el-input-number v-limit-input v-model="queryParams.stopMonth" placeholder="请输入停课月数" class="!w-240px"
              :min="0" :max="6" :step="1" step-strictly />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" :disabled-date="disabledAfterDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="课程操作类型" prop="lessonType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.lessonType" placeholder="请选择课程操作类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.LESSON_TYPE)" :key="dict.value" :value="dict.value"
                :label="dict.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="课程操作状态" prop="operationStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.operationStatus" placeholder="请选择课程操作状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.OPERATION_STATUS)" :key="dict.value"
                :value="dict.value" :label="dict.label" />
            </el-select>
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
        <el-button @click="handleQuery" v-hasPermi="['crm:packages:packageputoff:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:packages:packageputoff:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:packages:packageputoff:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="150">
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
      <el-table-column label="学员套餐" align="center" prop="packageName" min-width="160" />
      <el-table-column label="预约时间" align="center" prop="putOffTime" :formatter="dateFormatterYMD" min-width="110" />
      <el-table-column label="停课月数" align="center" prop="stopMonth" min-width="85" />
      <el-table-column label="课程操作类型" align="center" prop="lessonType" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.LESSON_TYPE" :value="scope.row.lessonType" />
        </template>
      </el-table-column>
      <el-table-column label="课程操作状态" align="center" prop="operationStatus" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.OPERATION_STATUS" :value="scope.row.operationStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        min-width="110" />
      <el-table-column label="操作" align="center" fixed="right" min-width="90"
        v-hasPermi="['crm:packages:packageputoff:delete']">
        <template #default="scope">
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:packages:packageputoff:delete']">
            删除
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
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { dateFormatterYMD, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import { PutOffApi, PutOffVO } from '@/api/crm/package/putOff'

/** 学员开课&停课记录 列表 */
defineOptions({ name: 'PutOff' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<PutOffVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  putOffTime: [],
  stopMonth: undefined,
  createTime: [],
  lessonType: undefined,
  operationStatus: undefined,
  validStatus: undefined,
  mentorId: undefined
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  mentor: useRemoteSearch(handleRemoteUserOptions),
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PutOffApi.getPutOffPage(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PutOffApi.deletePutOff(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PutOffApi.exportPutOff(queryParams)
    download.excel(data, '学员开课&停课记录.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 初始化 **/
onMounted(() => {
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
