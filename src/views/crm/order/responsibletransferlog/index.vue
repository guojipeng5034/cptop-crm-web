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
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-160px id">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="订单号" prop="orderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.orderNum" placeholder="请输入订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付单号" prop="paymentOrderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.paymentOrderNum" placeholder="请输入支付单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更前" prop="oldId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                变更前
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.oldId" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请输入变更前Responsible" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更后" prop="newId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                变更后
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.newId" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请输入变更后Responsible" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="变更前部门" prop="oldDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.oldDeptId" filterable clearable :data="deptList" :props="defaultProps"
              check-strictly collapse-tags :max-collapse-tags="3" default-expand-all placeholder="请选择变更前Responsible部门"
              node-key="id" class="!w-240px">
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
          <el-form-item label="变更后部门" prop="newDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.newDeptId" filterable clearable :data="deptList" :props="defaultProps"
              check-strictly collapse-tags :max-collapse-tags="3" default-expand-all placeholder="请选择变更后Responsible部门"
              node-key="id" class="!w-240px">
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
          <el-form-item label="备注信息" prop="remarks" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.remarks" placeholder="请输入备注信息" clearable class="!w-240px" />
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
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:responsible-transfer-log:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="160" fixed>
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
      <el-table-column label="订单号" align="center" prop="orderNum" min-width="180">
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="top">
            <el-button link type="primary" @click="handleCopy">
              {{ scope.row.orderNum }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="支付单号" align="center" prop="paymentOrderNum" min-width="180">
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="top">
            <el-button link type="primary" @click="handleCopy">
              {{ scope.row.paymentOrderNum }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="变更前" align="center" prop="oldName" min-width="150" />
      <el-table-column label="变更后" align="center" prop="newName" min-width="150" />
      <el-table-column label="变更前部门" align="center" prop="oldDeptName" min-width="160" />
      <el-table-column label="变更后部门" align="center" prop="newDeptName" min-width="160" />
      <el-table-column label="备注信息" align="center" prop="remarks" show-overflow-tooltip min-width="150" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="110" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />

</template>

<script setup lang="ts">
import { customerTypeOption, handleRemoteCustomerOptions, handleRemoteUserOptions } from '@/utils/dict'
import * as DeptApi from '@/api/system/dept'
import { defaultProps, handleTree } from '@/utils/tree'
import { handleCopy } from '@/utils/common'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { ResponsibleTransferLogApi, ResponsibleTransferLogVO } from '@/api/crm/order/responsibletransferlog'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 订单Responsible流转记录 列表 */
defineOptions({ name: 'ResponsibleTransferLog' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ResponsibleTransferLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  orderNum: undefined,
  paymentOrderNum: undefined,
  oldId: undefined,
  oldDeptId: undefined,
  newId: undefined,
  newDeptId: undefined,
  remarks: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => {
  queryParams.customerId = undefined
})

const customerOptions = ref()
const customerOptionsLoading = ref(false)
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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ResponsibleTransferLogApi.getResponsibleTransferLogPage(queryParams)
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
    const data = await ResponsibleTransferLogApi.exportResponsibleTransferLog(queryParams)
    download.excel(data, '订单Responsible流转记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/* 打开学员详情抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
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
</style>
