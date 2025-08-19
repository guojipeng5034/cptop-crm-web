<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true" label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-160px id">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="次卡名称" prop="tickerName" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.tickerName" placeholder="请检索后选择次卡" clearable filterable remote multiple
              collapse-tags :max-collapse-tags="2" show-checkbox :loading="ticketOptionsLoading"
              :remote-method="fetchRemoteTicketOptions" class="!w-240px">
              <el-option v-for="option in ticketOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="返还类型" prop="returnType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.returnType" placeholder="请选择或检索返还类型" clearable filterable multiple
              collapse-tags :max-collapse-tags="2" show-checkbox class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_TICKET_ADD_CHANNEL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TICKET_REMOVE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="mentorId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                Mentor
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.mentorId" placeholder="请选择或检索Mentor" clearable filterable remote
              :loading="mentorOptionsLoading" :remote-method="fetchRemoteMentorOptions" class="!w-240px">
              <el-option v-for="option in mentorOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="deptList"
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
          <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="添加时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="移除时间" prop="removeTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.removeTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="creator" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                添加人
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="creatorOptionsLoading"
              :remote-method="fetchRemoteCreatorOptions" placeholder="请检索后选择添加人" class="!w-240px">
              <el-option v-for="item in creatorOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:returnLog:ticket:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:returnLog:ticket:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:sales:returnLog:ticket:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="warning" plain @click="handleBatchImport('add')"
          v-hasPermi="['crm:sales:returnLog:ticket:import']">
          <Icon icon="fluent:multiselect-16-filled" class="mr-5px" /> 批量添加
        </el-button>
        <el-button type="warning" plain @click="handleBatchImport('remove')"
          v-hasPermi="['crm:sales:returnLog:ticket:import']">
          <Icon icon="fluent:multiselect-16-filled" class="mr-5px" /> 批量移除
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:returnLog:ticket:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" min-width="160" fixed="left">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)">
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
      <el-table-column label="次卡名称" align="center" prop="tickerName" min-width="200" :formatter="formatEmptyValue" />
      <el-table-column label="返还类型" align="center" prop="returnType" min-width="150">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_TICKET_ADD_CHANNEL" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" min-width="80">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.TICKET_REMOVE_STATUS" :value="scope.row.status" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="次卡使用次数" align="center" min-width="120">
        <template #default="scope">
          {{ scope.row.usedTotal }} / {{ scope.row.useLimit }}
        </template>
      </el-table-column>
      <el-table-column label="次卡操作人" align="center" prop="creatorName" min-width="150" :formatter="formatEmptyValue" />
      <el-table-column label="添加时间" align="center" prop="createTime" min-width="160" :formatter="dateFormatterYMDHm" />
      <el-table-column label="移除时间" align="center" prop="removeTime" min-width="160" :formatter="dateFormatterYMDHm" />
      <el-table-column label="移除人" align="center" prop="removeName" min-width="160" :formatter="formatEmptyValue" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="300"
        :formatter="formatEmptyValue" />
      <el-table-column label="操作" align="center" min-width="180" fixed="right"
        v-hasPermi="['crm:sales:returnLog:ticket:remove', 'crm:customer-account:get-main-student']">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goToQQE(null, scope.row.customerId)"
            v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
            QQE
          </el-button>
          <el-button link type="danger" v-if="scope.row.status === 0" @click="handleRemove(scope.row.id)"
            v-hasPermi="['crm:sales:returnLog:ticket:remove']">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员次卡 表单 -->
  <ReturnTicketLogForm ref="formRef" @success="getList" />
  <!-- 批量导入次卡 表单 -->
  <BatchHandleTicketForm ref="batchHandleTicketFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions, handleRemoteTicketOptions
} from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { goToQQE } from '@/utils/navigation'
import { formatEmptyValue } from '@/utils/table'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { CustomerTicketApi, CustomerTicketVO } from '@/api/crm/sales/ticket/customerTicket'
import * as DeptApi from '@/api/system/dept'
import ReturnTicketLogForm from './ReturnTicketLogForm.vue'
import BatchHandleTicketForm from './BatchHandleTicketForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 次卡记录 列表 */
defineOptions({ name: 'CustomerTicket' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<CustomerTicketVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined, // 学员
  tickerName: undefined, // 次卡
  returnType: undefined, // 返还类型
  status: undefined, // 状态
  mentorId: undefined, // mentor
  deptId: [], // 部门
  siteId: [], // 站点
  createTime: [], // 添加时间
  removeTime: [], // 移除时间
  creator: undefined, // 添加人
  fromArea: undefined, // 来源地区
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })

const customerOptions = ref()
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}

// 2.mentor
const mentorOptionsLoading = ref(false)
const mentorOptions = ref([])
const fetchRemoteMentorOptions = async (query) => {
  const setUserOptions = (newValue) => (mentorOptions.value = newValue)
  const setUserLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.creator
const creatorOptionsLoading = ref(false)
const creatorOptions = ref([])
const fetchRemoteCreatorOptions = async (query) => {
  const setUserOptions = (newValue) => (creatorOptions.value = newValue)
  const setUserLoading = (newValue) => (creatorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 4.ticket
const ticketOptionsLoading = ref(false)
const ticketOptions = ref([])
const fetchRemoteTicketOptions = async (query) => {
  const setTicketOptions = (newValue) => (ticketOptions.value = newValue)
  const setTicketLoading = (newValue) => (ticketOptionsLoading.value = newValue)
  await handleRemoteTicketOptions(query.trim(), setTicketOptions, setTicketLoading)
}

// 4.dept
const deptList = ref<Tree[]>([]) // 树形结构

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerTicketApi.getCustomerTicketPage(queryParams)
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
const openForm = (type: string, id?: number, name?: string, customerId?: string) => {
  formRef.value.open(type, id, name, customerId)
}

/** 移除按钮操作 */
const handleRemove = async (id: number) => {
  try {
    // 移除的二次确认
    await message.confirm('确认移除当前次卡吗？')
    // 发起移除
    await CustomerTicketApi.removeCustomerTicket({ id })
    message.success('移除成功！')
    // 刷新列表
    await getList()
  } catch { }
}

/* 多选 */
const tableRef = ref()
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

/* 取消多选 */
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 导出参数
    const exportParams = {
      ...queryParams,
      ...(multipleSelection.value.length > 0 ? { ids: multipleSelection.value } : {}),
    }
    // 发起导出
    exportLoading.value = true
    const data = await CustomerTicketApi.exportCustomerTicket(exportParams)
    download.excel(data, '学员次卡.xlsx')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 批量操作按钮操作 */
const batchHandleTicketFormRef = ref()
const handleBatchImport = (type: string) => {
  batchHandleTicketFormRef.value.open(type)
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
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
