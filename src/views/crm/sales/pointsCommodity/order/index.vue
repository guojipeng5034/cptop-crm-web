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
          <el-form-item label="处理状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DISPOSE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="积分商品" prop="pointsCommodityName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.pointsCommodityName" placeholder="请输入积分商品" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="邮寄地址" prop="sendAddress" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.sendAddress" placeholder="请输入邮寄地址" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="兑换人电话" prop="receiverMobile" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.receiverMobile" placeholder="请输入兑换人电话" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="兑换人姓名" prop="receiverName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.receiverName" placeholder="请输入兑换人姓名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付状态" prop="paymentStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentStatus" placeholder="请选择支付状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_PAYMENT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付时间" prop="paymentDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.paymentDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付方式" prop="paymentMethod" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentMethod" placeholder="请选择支付方式" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_PURCHASE_METHOD)" :key="dict.value"
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
          <el-form-item label="商品类型" prop="commodityType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.commodityType" placeholder="请选择商品类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_COMMODITY_TYPE)" :key="dict.value"
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
          <el-form-item label="支付单号" prop="paymentOrderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.paymentOrderNum" placeholder="请输入支付单号" clearable class="!w-240px" />
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
          v-hasPermi="['crm:points-commodity-order:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button @click="batchHandle" type="primary" plain>
          <Icon icon="humbleicons:arrow-join" class="mr-5px" /> 批量处理
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe max-height="70vh" class="data-table" ref="tableRef"
      :row-key="(row) => row.id" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection width="70" />
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
      <el-table-column label="处理状态" align="center" prop="status" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.DISPOSE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="实付金额" align="center" prop="afterAmount" min-width="100" />
      <el-table-column label="实付积分" align="center" prop="afterPoints" min-width="100" />
      <el-table-column label="积分商品" align="center" prop="pointsCommodityName" min-width="300" show-overflow-tooltip>
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="right">
            <el-text link type="primary" @click="handleCopy" class="hover:cursor-pointer">
              {{ scope.row.pointsCommodityName }}
            </el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="ip地址" align="center" prop="ipAddress" min-width="140" />
      <el-table-column label="支付状态" align="center" prop="paymentStatus" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="scope.row.paymentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="paymentDate" :formatter="dateFormatterYMDHms" width="180" />
      <el-table-column label="支付方式" align="center" prop="paymentMethod">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POINTS_PURCHASE_METHOD" :value="scope.row.paymentMethod" />
        </template>
      </el-table-column>
      <el-table-column label="支付单号" align="center" prop="paymentOrderNum" min-width="200">
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="right">
            <el-text link type="primary" @click="handleCopy" class="hover:cursor-pointer">
              {{ scope.row.paymentOrderNum }}
            </el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" align="center" prop="courierNumber" min-width="200" />
      <el-table-column label="处理人" align="center" prop="disponseUserName" min-width="120" />
      <el-table-column label="处理时间" align="center" prop="disponseTime" :formatter="dateFormatterYMDHms" width="180" />
      <el-table-column label="详细信息" align="center" width="280" :show-overflow-tooltip="false">
        <template #default="scope">
          <el-tooltip :content="getTooltipContent(scope.row)" placement="top" :show-after="500">
            <div class="details-cell"
              v-if="scope.row.sendAddress && scope.row.receiverName && scope.row.receiverMobile">
              <div class="details-content">
                <div class="flex justify-between m-b-1">
                  <el-tag type="primary" class="w-40%">邮寄地址</el-tag>
                  <span class="w-60%">{{ scope.row.sendAddress }}</span>
                </div>
                <div class="flex justify-between m-b-1">
                  <el-tag type="success" class="w-40%">兑换人姓名</el-tag>
                  <span class="w-60%">{{ scope.row.receiverName }}</span>
                </div>
                <div class="flex justify-between" :class="scope.row.receiveEmail ? 'm-b-1' : ''">
                  <el-tag type="warning" class="w-40%">兑换人电话</el-tag>
                  <span class="w-60%">{{ scope.row.receiverMobile }}</span>
                </div>
              </div>
              <div class="copy-overlay">
                <el-button type="primary" size="small" @click.stop="handleCopyDetails(scope.row)">
                  查看电话并复制
                </el-button>
              </div>
            </div>
            <div class="details-cell" v-else-if="scope.row.receiveEmail">
              <div class="details-content">
                <div class="flex justify-between">
                  <el-tag type="primary" class="w-40%">邮箱地址</el-tag>
                  <span class="w-60%">{{ scope.row.receiveEmail }}</span>
                </div>
              </div>
              <div class="copy-overlay">
                <el-button type="primary" size="small" @click.stop="handleCopyDetails(scope.row)">
                  查看邮箱并复制
                </el-button>
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button v-if="scope.row.status === 1" link type="warning"
            @click="handlePointOrder(scope.row.id, scope.row.sendAddress)">
            处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 处理订单 表单 -->
  <HandleOrderForm ref="handleFormRef" @success="getList" @cancel-selection="cancelSelection" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 查看完整无掩码信息 -->
  <MasklessInfoDialog ref="masklessInfoDialogRef" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { handleCopy } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
import * as DeptApi from '@/api/system/dept'
import { PointsCommodityOrderApi, PointsCommodityOrderVO } from '@/api/crm/sales/pointsCommodity/order'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import HandleOrderForm from './HandleOrderForm.vue'
import MasklessInfoDialog from '@/views/crm/components/MasklessInfoDialog/MasklessInfoDialog.vue'
import { BaseApi } from '@/api/crm/base/index'

/** 积分商品订单 列表 */
defineOptions({ name: 'PointsCommodityOrder' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<PointsCommodityOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  status: undefined,
  afterAmount: undefined,
  afterPoints: undefined,
  pointsCommodityName: undefined,
  sendAddress: undefined,
  receiverMobile: undefined,
  receiverName: undefined,
  ipAddress: undefined,
  remark: undefined,
  paymentStatus: undefined,
  paymentDate: [],
  paymentMethod: undefined,
  courierNumber: undefined,
  mentorId: undefined,
  deptId: [],
  commodityType: undefined,
  paymentOrderNum: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

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
const userOptions = ref()
const userOptionsLoading = ref(false)
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

/* 处理订单 */
const handleFormRef = ref()
const handlePointOrder = (id: number, address: string) => {
  handleFormRef.value.open(id, address)
}

/* 批量处理 */
const batchHandle = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请选择需要处理的订单')
  }
  handleFormRef.value.open(null, null, multipleSelection.value)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PointsCommodityOrderApi.getPointsCommodityOrderPage(queryParams)
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
    const data = await PointsCommodityOrderApi.exportPointsCommodityOrder(queryParams)
    download.excel(data, '积分商品订单.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 复制详细信息 */
const handleCopyDetails = async (row: any) => {
  let checkFullInfoParams = {
    type: CRM_DESENSITIZE_TYPE.PHONE,
    id: row.id,
    source: CRM_DESENSITIZE_SOURCE.POINTS
  }
  let copyText = ''
  if (row.sendAddress && row.receiverName && row.receiverMobile) {
    const phone = await BaseApi.getDesensitizeInfo(checkFullInfoParams)
    copyText = `${row.sendAddress}\n${row.receiverName}\n${phone}`
  } else if (row.receiveEmail) {
    checkFullInfoParams.type = CRM_DESENSITIZE_TYPE.MAIL
    const email = await BaseApi.getDesensitizeInfo(checkFullInfoParams)
    copyText = `${email}`
  }
  handleCopy(copyText)

  message.success('复制成功')
}

/** 获取 tooltip 内容 */
const getTooltipContent = (row: any) => {
  if (row.sendAddress && row.receiverName && row.receiverMobile) {
    return [
      `邮寄地址 ${row.sendAddress}`,
      `兑换人姓名 ${row.receiverName}`,
      `兑换人电话 ${row.receiverMobile}`
    ].join('')
  } else if (row.receiveEmail) {
    return `邮箱地址 ${row.receiveEmail}`
  }
  return
}

/* 查看未脱敏数据 */
const masklessInfoDialogRef = ref()
const checkFullInfo = (type: number, id: number) => {
  masklessInfoDialogRef.value.open(type, id, CRM_DESENSITIZE_SOURCE.POINTS)
}

/* 列表选中状态变化 */
const multipleSelection = ref([])

/* 多选 */
const tableRef = ref()
// 选中变化
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}
// 取消多选
const cancelSelection = () => {
  tableRef?.value.clearSelection()
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

/* 详情 mask */
.data-table {
  :deep(.el-table__cell) {
    padding: 0;
  }

  :deep(.cell) {
    padding: 8px;
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