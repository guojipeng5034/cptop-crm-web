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
          <el-form-item label="联系分类" prop="contactCategory" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.contactCategory" placeholder="请选择或检索联系分类" clearable filterable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_CATEGORY)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="联系类型" prop="contactType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.contactType" placeholder="请选择或检索联系类型" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员联系人" prop="responsibleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.responsibleId" placeholder="请检索后选择学员联系人" clearable filterable remote
              :loading="queryOptions.responsible.loading" :remote-method="queryOptions.responsible.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.responsible.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="联系日期" prop="contactDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.contactDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="联系结果" prop="contactResultType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.contactResultType" placeholder="请选择或检索联系结果" filterable clearable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_RESULT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="下次联系日期" prop="nextContactDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.nextContactDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="下次联系负责人" prop="nextResponsibleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.nextResponsibleId" placeholder="请检索后选择下次联系负责人" clearable filterable remote
              :loading="queryOptions.nextResponsible.loading" :remote-method="queryOptions.nextResponsible.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.nextResponsible.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="返还课时点原因" prop="refundReason" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.refundReason" placeholder="请选择返还课时点原因" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONTACT_RETURN_QQEPOINT_REASON)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
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
        <el-button @click="handleQuery" v-hasPermi="['crm:contact-history:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:contact-history:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:contact-history:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:contact-history:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" fixed="left" min-width="180">
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
      <el-table-column label="联系纪要" align="center" min-width="450">
        <template #default="scope">
          <span v-html="scope.row.contactContent"></span>
        </template>
      </el-table-column>
      <el-table-column label="联系记录相关信息" align="center">
        <el-table-column label="分类" align="center" prop="contactCategory" min-width="120">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CONTACT_CATEGORY" :value="scope.row.contactCategory" />
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="contactType" min-width="120">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CONTACT_TYPE" :value="scope.row.contactType" />
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="responsibleName" min-width="150" />
        <el-table-column label="日期" align="center" prop="contactDate" :formatter="timeWithoutSecondFormat"
          width="110" />
        <el-table-column label="结果" align="center" prop="contactResultType" min-width="160">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CONTACT_RESULT_TYPE" :value="scope.row.contactResultType" />
          </template>
        </el-table-column>
        <el-table-column label="原因" align="center" prop="contactReason" width="160" show-overflow-tooltip />
      </el-table-column>
      <el-table-column label="下次联系相关信息" align="center">
        <el-table-column label="联系日期" align="center" prop="nextContactDate" :formatter="timeWithoutSecondFormat"
          width="110" />
        <el-table-column label="负责人" align="center" prop="nextResponsibleName" min-width="150" />
      </el-table-column>
      <el-table-column label="返回课时点相关信息" align="center">
        <el-table-column label="数量" align="center" prop="refundPoints" width="80" />
        <el-table-column label="原因" align="center" prop="refundReason" width="160">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CONTACT_RETURN_QQEPOINT_REASON" :value="scope.row.refundReason" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="handleResult" width="90" show-overflow-tooltip />
      <el-table-column label="创建人" align="center" prop="creatorName" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat" width="110" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 联系记录 表单 -->
  <ContactHistoryForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  getIntDictOptions, DICT_TYPE,
  customerTypeOption, handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, dateWithoutTimeFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { ContactHistoryApi, ContactHistoryVO } from '@/api/crm/customer/contact'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import ContactHistoryForm from './ContactHistoryForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 学员联系记录 列表 */
defineOptions({ name: 'ContactHistory' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ContactHistoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  contactCategory: undefined,
  contactType: undefined,
  responsibleId: undefined,
  contactDate: [],
  contactResultType: undefined,
  contactContent: undefined,
  nextContactDate: [],
  nextResponsibleId: undefined,
  nextReservedDate: [],
  refundReason: undefined,
  createTime: [],
  mentorId: undefined
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  responsible: useRemoteSearch(handleRemoteUserOptions),
  nextResponsible: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContactHistoryApi.getContactHistoryPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  formRef.value.open(type, id, name)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ContactHistoryApi.exportContactHistory(queryParams)
    download.excel(data, '学员联系记录.xlsx')
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
onMounted(async () => {
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

.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      th.el-table__cell {
        padding: 0;
      }

      td.el-table__cell {
        padding: 0;
      }

      .cell {
        padding: 0;
      }
    }
  }
}
</style>
