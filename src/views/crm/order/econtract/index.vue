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
          <el-form-item label="审核人" prop="auditorId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                审核人
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.auditorId" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择审核人" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.AUDIT_STATUS)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="订单号" prop="orderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.orderNum" placeholder="请输入订单号" clearable class="!w-240px" />
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
          v-hasPermi="['crm:E-contract:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh" :row-key="(row) => row.id" class="data-table">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180" fixed>
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.studentName)"
            v-truncate="10">
            {{ scope.row.studentName }}
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
       <el-table-column label="订单号" align="center" min-width="200">
        <template #default="scope">
          <el-tooltip effect="light" content="点击跳转" placement="top">
            <el-button link type="primary" @click="goToOrderList(scope.row.orderNum)">
              {{ scope.row.orderNum }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Mentor" align="center" prop="mentorName" min-width="200" class-name="padding-side-0" />
      <el-table-column label="学员身份证号" align="center" prop="idCard" width="200" />
      <el-table-column label="家长名" align="center" prop="parentName" />
      <el-table-column label="家长身份证号" align="center" prop="parentIdCard" width="200"/>
      <el-table-column label="审核人" align="center" prop="auditorName" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="状态" align="center" prop="status" class-name="padding-side-0">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" >
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="warning" @click="handleAuidt(scope.row.orderId)">
            审核
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
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { EContractApi, EContractVO } from '@/api/crm/order/econtract'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import router from '@/router'

/** 电子合同 列表 */
defineOptions({ name: 'EContract' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<EContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  orderId: undefined,
  auditorId: undefined,
  status: undefined,
  orderNum: undefined 
})

/* options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })

const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}

// 2.user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EContractApi.getEContractPage(queryParams)
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

/** 审核按钮操作 */
const handleAuidt = async (orderId: number) => {
  try {
    // 发起审核
    await EContractApi.auidtEContract({ orderId })
    message.success('审核成功')
    // 刷新列表
    await getList()
  } catch { }
}

/* 订单号点击跳转至订单管理页面，并搜索订单号 */
const handleOrderNumClick = (orderNum: string) => {
  router.push({
    name: 'PackageOrder',
    query: { orderNum }
  })
}
const goToOrderList = async (orderNum: string) => {
  try {
    router.push({
      name: 'PackageOrder',
      query: { orderNum }
    })
  } catch (error) {
    console.error('Error in goToOrderList:', error)
    // 刷新页面
    await location.reload()
  } finally {
    // 再次尝试路由跳转，确保逻辑完整
    router.push({
      name: 'PackageOrder',
      query: { orderNum }
    })
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await EContractApi.exportEContract(queryParams)
    download.excel(data, '电子合同.xlsx')
  } finally {
    exportLoading.value = false
  }
}

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