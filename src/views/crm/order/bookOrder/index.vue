<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="85">
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
          <el-form-item label="书名" prop="bookName" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.bookName" placeholder="请选择书名" clearable multiple collapse-tags
              :max-collapse-tags="2" show-checkbox class="!w-240px">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="赠送原因" prop="type" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.type" placeholder="请选择赠送原因" clearable multiple collapse-tags
              :max-collapse-tags="3" show-checkbox class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_REASON)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="快递单号" prop="courierNumber" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.courierNumber" placeholder="请输入快递单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理时间" prop="disponseTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.disponseTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理人" prop="disponseUser" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.disponseUser" placeholder="请输入处理人" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DISPOSE_STATUS)" :key="dict.value"
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
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:book-order:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:book-order:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:book-order:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh" class="data-table"
      :row-key="(row) => row.id" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180">
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
      <el-table-column label="Mentor" align="center" prop="mentorName" width="120" />
      <el-table-column label="订单id" align="center" prop="orderId" width="120" />
      <el-table-column label="书名" align="center" prop="bookName" width="120">
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="right">
            <arco-tag :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE" :value="scope.row.bookName" @click="handleCopy"
              class="hover:cursor-pointer" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="赠送原因" align="center" prop="type" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_REASON" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="收货信息" align="center" width="280" class-name="mask-cell">
        <template #default="{ row }">
          <div class="details-cell mx-2 my-1">
            <div class="details-content">
              <div class="flex items-center">
                <el-tag type="primary" size="large" class="w-25%">收货地址</el-tag>
                <span class="w-3%"></span>
                <span class="w-72% text-center">{{ row.receiveAddress }}</span>
              </div>
              <div class="flex items-center m-t-1">
                <el-tag type="success" size="large" class="w-25%">收货人</el-tag>
                <span class="w-3%"></span>
                <span class="w-72% text-center">{{ row.receiveName }}</span>
              </div>
              <div class="flex items-center m-t-1">
                <el-tag type="warning" size="large" class="w-25%">收货电话</el-tag>
                <span class="w-2%"></span>
                <span class="w-72% text-center">{{ row.receivePhone }}</span>
              </div>
            </div>
            <div class="copy-overlay">
              <!-- https://zentao.52cebu.com/zentao/bug-view-2249.html -->
              <el-button type="primary" size="small" @click.stop="handleCopyDetails(row)">
                查看电话并复制
              </el-button>
              <!-- <el-button type="primary" size="small" @click="checkFullInfo(CRM_DESENSITIZE_TYPE.PHONE, row.id)" v-hasPermi="['crm:sensitize:query']">
                查看完整电话号码
              </el-button> -->
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center" prop="courierNumber" min-width="150" />
      <el-table-column label="创建人" align="center" prop="creatorName" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" width="110"
        :show-overflow-tooltip="false" />
      <el-table-column label="发货人" align="center" prop="disponseUser" width="120" />
      <el-table-column label="发货时间" align="center" prop="disponseTime" :formatter="dateFormatterYMDHms" width="110"
        :show-overflow-tooltip="false" />
      <el-table-column label="处理状态" align="center" prop="status" width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.DISPOSE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="130">
        <template #default="scope">
          <el-button link type="warning" v-if="scope.row.status === 1" @click="handleAuidt(scope.row.orderId)"
            v-hasPermi="['crm:book-order:audit']">
            发货
          </el-button>
          <el-button link type="primary" v-if="scope.row.status === 1" @click="openBookOrderForm(scope.row)"
            v-hasPermi="['crm:book-order:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 书籍订单 表单 -->
  <BookOrderForm ref="bookOrderFormRef" @success="getList" />
  <!-- 审核发货 表单 -->
  <OrderAuidtForm ref="orderAuidtFormRef" @success="getList" />
  <!-- 学员详情 Drawer -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, getStrDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import download from '@/utils/download'
import { CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
import * as DeptApi from '@/api/system/dept'
import { BookOrderApi, BookOrderVO } from '@/api/crm/order/bookOrder'
import BookOrderForm from './BookOrderForm.vue'
import OrderAuidtForm from './OrderAuidt.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import { BaseApi } from '@/api/crm/base/index'

/** 书籍订单信息 列表 */
defineOptions({ name: 'BookOrder' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(false) // 列表的加载中
const list = ref<BookOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined, // 学员
  bookName: undefined, // 书名
  type: undefined, // 赠送原因
  courierNumber: undefined, // 快递单号
  disponseTime: [], // 处理时间
  disponseUser: undefined, // 处理人
  status: undefined, // 处理状态
  mentorId: undefined, // mentor
  deptId: [], // 所属部门
  siteId: [], // 站点
  createTime: [], // 创建时间
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}

// 2.user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.dept
const deptList = ref<Tree[]>([]) // 树形结构

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BookOrderApi.getBookOrderPage(queryParams)
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

/** 修改操作 */
const bookOrderFormRef = ref()
const openBookOrderForm = (row) => {
  bookOrderFormRef.value.open(row)
}

/** 审核按钮操作 */
const orderAuidtFormRef = ref()
const handleAuidt = (orderId: number) => {
  orderAuidtFormRef.value.open(orderId)
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
    const data = await BookOrderApi.exportBookOrder(exportParams)
    download.excel(data, '书籍订单.xlsx')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/** 复制详细信息 */
const handleCopyDetails = async (row: any) => {
  let checkFullInfoParams = {
    type: CRM_DESENSITIZE_TYPE.PHONE,
    id: row.id,
    source: CRM_DESENSITIZE_SOURCE.BOOK
  }
  let copyText = ''
  if (row.receiveAddress && row.receiveName && row.receivePhone) {
    const phone = await BaseApi.getDesensitizeInfo(checkFullInfoParams)
    copyText = `${row.receiveAddress}\n${row.receiveName}\n${phone}`
  } else if (row.receiveEmail) {
    checkFullInfoParams.type = CRM_DESENSITIZE_TYPE.MAIL
    const email = await BaseApi.getDesensitizeInfo(checkFullInfoParams)
    copyText = `${email}`
  }
  handleCopy(copyText)
  message.success('复制成功')
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
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

.data-table {
  :deep(.mask-cell) {
    padding: 0;

    .el-table__cell {
      padding: 0;
    }

    .cell {
      padding: 0px;
    }
  }
}

.details-cell {
  position: relative;
  cursor: pointer;

  .details-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &:hover {
    .copy-overlay {
      opacity: 1;
    }
  }

  .copy-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    margin: -8px;
  }
}
</style>