<template>
  <el-tab-pane name="order">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa-solid:receipt" />
        <span>订单</span>
      </div>
    </template>

    <template #default>
      <div>
        <div class="order-title flex justify-end">
          <div class="order-create mb-10px">
            <el-button type="primary" plain @click="openForm('create')" size="small"
              v-hasPermi="['crm:order:package:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </div>
        </div>

        <!-- 列表 -->
        <el-table v-loading="loading" :data="list" :row-key="(row) => row.orderNum" stripe border
          class="order-tab-table" height="calc(100vh - 280px)">
          <el-table-column type="expand" fixed>
            <template #default="expandProps">
              <div class="sub-table ml-12">
                <el-scrollbar class="w-78vw">
                  <el-table :data="expandProps.row.payments" :header-cell-style="{ backgroundColor: '#f0eeff' }"
                    :row-style="{ backgroundColor: '#f8f8ff' }">
                    <el-table-column label="支付单号" align="center" min-width="220" fixed>
                      <template #default="paymentNumScope">
                        <el-tooltip effect="light" content="点击复制" placement="top">
                          <el-button link type="primary" @click="handleCopy">
                            {{ paymentNumScope.row.paymentOrderNum }}
                          </el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column label="支付方式" align="center" min-width="115">
                      <template #default="methodScope">
                        <arco-tag :type="DICT_TYPE.CRM_PAYMENT_LIST" :value="methodScope.row.paymentMerchantType" />
                      </template>
                    </el-table-column>
                    <el-table-column label="支付状态" prop="paymentStatus" align="center" min-width="95">
                      <template #default="statusProps">
                        <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="statusProps.row.paymentStatus" />
                      </template>
                    </el-table-column>
                    <el-table-column label="实收货币" prop="paymentCurrencyType" align="center" min-width="95">
                      <template #default="currencyProps">
                        <arco-tag :type="DICT_TYPE.ORDER_PAYMENT_CURRENCY"
                          :value="currencyProps.row.paymentCurrencyType" />
                      </template>
                    </el-table-column>
                    <el-table-column label="实收人民币" prop="amount" align="center" min-width="120"
                      :formatter="roundToTwoDecimals" />

                    <el-table-column label="实收货币金额" prop="actualAmount" align="center" min-width="120"
                      :formatter="roundToTwoDecimals" />
                    <el-table-column label="实收货币商户" prop="paymentMerchantName" align="center" min-width="140" />

                    <el-table-column label="Responsible" align="center" prop="responsibleName" min-width="180">
                      <template #default="scope">
                        <div class="flex justify-center items-center gap-1"
                          v-if="checkPermi(['crm:order:paymentRecord:update'])">
                          <span>{{ scope.row.responsibleName }}</span>
                          <el-button type="primary" link :icon="Edit"
                            @click="switchResponsible(expandProps.row.customerId, scope.row)" />
                        </div>
                        <div v-else>
                          <span>{{ scope.row.responsibleName }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="支付时间" prop="paymentTime" align="center" min-width="110"
                      :formatter="dateFormatterYMDHm" />
                    <el-table-column label="创建人" prop="creatorName" align="center" min-width="110" />
                    <el-table-column label="操作" align="center" fixed="right"
                      v-hasPermi="['crm:order:package:update_order_status', 'crm:order:paymentRecord:update']"
                      min-width="150">
                      <template #default="scope">
                        <!-- 审核方式：系统审核，订单支付状态：等待支付，显示该按钮 -->
                        <el-button
                          v-if="scope.row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.WAIT_PAY && scope.row.orderAuditType === 1"
                          type="primary" size="small" @click="openForm('view', scope.row.id)">
                          支付详情
                        </el-button>
                        <!-- 审核方式：财务审核，订单支付状态： pending，显示审核按钮 -->
                        <el-button
                          v-else-if="scope.row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING && scope.row.orderAuditType === 0"
                          type="danger" size="small" @click="openAuditOrderForm(scope.row.id, 'create')"
                          v-hasPermi="['crm:order:package:update_order_status']">
                          审核
                        </el-button>
                        <el-button
                          v-else-if="scope.row.paymentStatus !== CRM_ORDER_PAYMENT_STATUS.PENDING && scope.row.orderAuditType === 0"
                          type="primary" size="small" @click="openAuditOrderForm(scope.row.id, 'info')"
                          v-hasPermi="['crm:order:package:update_order_status']">
                          审核详情
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-scrollbar>
              </div>
            </template>
          </el-table-column>

          <!-- 订单信息 -->
          <el-table-column label="学员信息" align="center" prop="customerName" min-width="180" fixed />
          <el-table-column label="订单号" align="center" width="200">
            <template #default="scope">
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="primary" @click="handleCopy">
                  {{ scope.row.orderNum }}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="支付状态" align="center" prop="paymentStatus" width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="scope.row.paymentStatus" :size="'small'" />
            </template>
          </el-table-column>
          <el-table-column label="支付类型" align="center" prop="paymentType" min-width="120">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_TYPE" :value="scope.row.paymentType" :size="'small'" />
            </template>
          </el-table-column>
          <el-table-column label="套餐大类" align="center" prop="packagesSimpleType" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.PACKAGES_SIMPLE_TYPE" :value="scope.row.packagesSimpleType" :size="'small'" />
            </template>
          </el-table-column>
          <el-table-column label="套餐名称" header-align="center" align="left" prop="packageName" min-width="240"
            show-overflow-tooltip>
            <template #default="{ row }">
              <arco-tag v-show="row.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="row.hedgingTag"
                size="small" />
              <span class="ml-1">{{ row.packageName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单原价" align="center" prop="totalAmount" min-width="100"
            :formatter="roundToTwoDecimals" />
          <el-table-column label="优惠金额" align="center" prop="discountAmount" min-width="100">
            <template #default="scope">
              <el-button link type="warning" @click="toCouponList(scope.row.customerId, scope.row.orderNum)">
                {{ scope.row.discountAmount !== 0 ? scope.row.discountAmount.toFixed(2) : scope.row.discountAmount }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="应付金额" align="center" prop="payableAmount" min-width="100"
            :formatter="roundToTwoDecimals" />
          <el-table-column label="实付金额" align="center" prop="actualAmount" min-width="100"
            :formatter="roundToTwoDecimals" />
          <el-table-column label="退款金额" align="center" prop="actualRefundAmount" min-width="100"
            :formatter="roundToTwoDecimals" />
          <el-table-column label="订单类型" align="center" prop="orderType" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_ORDER_BILLING_TYPE" :value="scope.row.orderType" :size="'small'" />
            </template>
          </el-table-column>
          <el-table-column label="订单频次" align="center" min-width="110">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.ORDER_FREQUENCY_TYPE" :value="scope.row.orderFrequencyType" :size="'small'" />
            </template>
          </el-table-column>
          <el-table-column label="退款类型" align="center" prop="orderRefundStatus" min-width="100">
            <template #default="scope">
              <el-button link
                :type="scope.row.orderRefundStatus === 1 ? 'success' : scope.row.orderRefundStatus === 2 ? 'warning' : 'danger'"
                @click="toRefundList(scope.row.orderNum)">
                {{ getLabelByValue(scope.row.orderRefundStatus, getIntDictOptions(DICT_TYPE.ORDER_REFUND_STATUS)) }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" min-width="110"
            :formatter="dateFormatterYMDHm" />

          <!-- 赠品信息 -->
          <el-table-column label="课时点" align="center" prop="awardQqePointsNum" min-width="70" />
          <el-table-column label="积分" align="center" prop="awardPointsNum" min-width="70" />
          <el-table-column label="次卡" align="center" prop="awardTicketNum" min-width="70" />
          <el-table-column label="书籍类型" align="center" prop="awardBookType" min-width="95">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE" :value="scope.row.awardBookType" :size="'small'" />
            </template>
          </el-table-column>

          <!-- 学员信息 -->
          <el-table-column label="渠道大类" align="center" prop="pageType" min-width="110">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_CHANNEL_TYPE" :value="scope.row.pageType" />
            </template>
          </el-table-column>
          <el-table-column label="渠道细分" align="center" prop="channelName" min-width="200" />
          <el-table-column label="Mentor" align="center" prop="mentorName" min-width="100" />
          <el-table-column label="操作" align="center" min-width="200" fixed="right">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button link type="primary" size="small" @click="goToQQE(null, scope.row.customerId)"
                  v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
                  QQE
                </el-button>
                <el-button v-if="showPayBalanceBtn(scope.row)" link type="danger" size="large" class="final-payment"
                  @click="openForm('payBalance', scope.row.id, scope.row.customerName)"
                  v-hasPermi="['crm:order:package:create_pay_order_again']">
                  支付尾款
                </el-button>
                <el-dropdown @command="(command) => handleCommand(command, scope.row)"
                  v-if="hadPaidPartOrAll(scope.row) || showSwitchPackageBtn(scope.row)"
                  v-hasPermi="['crm:order:package:update', 'crm:refund-record:create', 'crm:E-contract:create']">
                  <el-button type="primary" link size="small">更多
                    <Icon icon="ep:d-arrow-right" />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="hadPaidPartOrAll(scope.row) && checkPermi(['crm:order:package:update'])"
                        command="handleGift">
                        <Icon icon="la:gifts" /> 赠品
                      </el-dropdown-item>
                      <el-dropdown-item v-if="showRefundBtn(scope.row) && checkPermi(['crm:refund-record:create'])"
                        command="handleRefound">
                        <Icon icon="mingcute:refund-cny-line" /> 退费
                      </el-dropdown-item>
                      <el-dropdown-item v-if="hadPaidAll(scope.row) && checkPermi(['crm:E-contract:create'])"
                        command="handleContract">
                        <Icon icon="ep:chat-dot-round" /> 合同
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="showSwitchPackageBtn(scope.row) && checkPermi(['crm:order:package:update:package:type'])"
                        command="handleChangePackage">
                        <Icon icon="icon-park-outline:change" /> 更换套餐
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button link type="warning" size="small" class="!ml-1" @click="handleChangeOrderType(scope.row)"
                  v-hasPermi="['crm:order:package:update:order:type']">
                  <Icon icon="icon-park-outline:change" />
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 订单 表单 -->
        <PackageOrderForm ref="formRef" :hasCustomerId="true" :current-customer-id="props.customerId" @success="getList"
          @to-pay-balance="toPayBalance" />
        <!-- 赠品 表单 -->
        <PresentForm ref="presentFormRef" @success="getList" />
        <!-- 退款 表单 -->
        <RefundLogDialog ref="refundLogDialogRef" />
        <!-- 合同 表单 -->
        <ContractForm ref="contractFormRef" @success="getList" />
        <!-- 审核 payment 表单 -->
        <AuditOrderForm ref="auditOrderFormRef" @success="getList" />
        <!-- 更换套餐 表单 -->
        <ChangePackageForm ref="changePackageFormRef" @success="getList" />
        <!-- 更换订单类型 表单 -->
        <ChangeOrderTypeForm ref="changeOrderTypeFormRef" @success="getList" />
        <!-- 更换 Responsible 表单 -->
        <SwitchResponsibleForm ref="switchResponsibleFormRef" @success="getList" />
      </div>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import router from '@/router'
import { Edit } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getLabelByValue } from '@/utils/dict'
import { roundToTwoDecimals } from '@/utils/formatter'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { CRM_ORDER_PAYMENT_STATUS, CRM_ORDER_PAYMENT_TYPE, ORDER_REFUND_STATUS } from '@/utils/constants'
import { useUserStore } from '@/store/modules/user'
import { isEmpty } from '@/utils/is'
import { goToQQE } from '@/utils/navigation'
import { checkPermi, checkRole } from '@/utils/permission'
import { CustomerApi } from '@/api/crm/customer/base'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'
import PackageOrderForm from '@/views/crm/order/packageOrder/PackageOrderForm.vue'
import PresentForm from '@/views/crm/order/packageOrder/PresentForm.vue'
import RefundLogDialog from '@/views/crm/order/packageOrder/RefundLogDialog.vue'
import ContractForm from '@/views/crm/order/packageOrder/ContractForm.vue'
import AuditOrderForm from '@/views/crm/order/packageOrder/AuditOrderForm.vue'
import ChangePackageForm from '@/views/crm/order/packageOrder/ChangePackageForm.vue'
import ChangeOrderTypeForm from '@/views/crm/order/packageOrder/ChangeOrderTypeForm.vue'
import SwitchResponsibleForm from '@/views/crm/order/packageOrder/SwitchResponsibleForm.vue'

/** 订单 Tab */
defineOptions({ name: 'OrderTab' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<PackageOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const userStore = useUserStore()
const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PackageOrderApi.getPackageOrderPage(queryParams)
    if (!isEmpty(data.pageData)) {
      list.value = data.list
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

/* 跳转到尾款支付页面 */
const toPayBalance = async (customerId: number, orderId: number) => {
  const customerInfo = await CustomerApi.getCustomer(customerId)
  openForm('payBalance', orderId, customerInfo.name, customerId)
}

/* 跳转学员优惠券列表 */
const toCouponList = (customerId: number, orderNum: string) => {
  router.push({
    name: 'CustomerCoupon',
    query: {
      customerId,
      orderNum,
    }
  })
}

/* 跳转退款列表 */
const toRefundList = (orderNum: string) => {
  router.push({
    name: 'OrderRefund',
    query: {
      orderNum,
    }
  })
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  name = props.customerName
  const customerId = props.customerId
  formRef.value.open(type, id, name, customerId)
}

/* 合同表单 */
const contractFormRef = ref()
const handleContract = (row: object) => {
  contractFormRef.value.open(row)
}

/** 操作分发 */
const handleCommand = (command: string, row: PackageOrderVO) => {
  switch (command) {
    case 'handleRefound':
      handleRefound(row)
      break
    case 'handleGift':
      handleGift(row)
      break
    case 'handleContract':
      handleContract(row)
      break
    case 'handleChangePackage':
      handleChangePackage(row)
      break
    default:
      break
  }
}

/* 赠品表单 */
const presentFormRef = ref()
const handleGift = (rowData) => {
  const {
    id,
    customerId,
    awardPointsNum,
    awardTicketNum,
    awardQqePointsNum,
    awardBookType,
    orderType
    // packageId,
    // paymentType,
  } = rowData
  const presentFormData = {
    orderId: id,
    customerId,
    awardPointsNum,
    awardTicketNum,
    awardQqePointsNum,
    awardBookType,
    orderType
    // packageId,
    // paymentType,
  }
  presentFormRef.value.open(presentFormData)
}

/* 退款表单 */
const refundLogDialogRef = ref()
const handleRefound = (row: object) => {
  refundLogDialogRef.value.open(row)
}

/* 变更套餐 */
const changePackageFormRef = ref()
const handleChangePackage = (row: object) => {
  changePackageFormRef.value.open(row)
}

/* 变更订单类型 */
const changeOrderTypeFormRef = ref()
const handleChangeOrderType = (row: object) => {
  changeOrderTypeFormRef.value.open(row)
}

/* 列表操作按钮显示计算属性 */
// 支付尾款
const showPayBalanceBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  const { paymentStatus, paymentType, orderRefundStatus } = row
  return (paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING || paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART) &&
    (paymentType === CRM_ORDER_PAYMENT_TYPE.INSTALLMENTS &&
      orderRefundStatus !== ORDER_REFUND_STATUS.ALL_REFUND)
})

// 更换 Responsible
const isSaleManagerOrSuperAdmin = computed(() => checkRole(['销售经理', 'super_admin'])) // 当前登录用户是否为销售经理或者super-admin （销售经理、super-admin 角色可更换非自己名下的responsible
const showSwitchResponsibleBtn = computed(() => (orderRow, paymentRow) => {
  // order订单类型是否为 New
  const isNewOrder = orderRow.orderType === 1 // 1: New
  // payment支付状态是否为已付全款
  const isPaymentPaidAll = paymentRow.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
  // payment的 Responsible 是否不为空
  const isPaymentResponsibleNotEmpty = !isEmpty(paymentRow.responsible)
  // 登录人是否为 responsible
  const isLoginUserResponsible = paymentRow.responsibleId === userStore.user.id

  return (isNewOrder || isSaleManagerOrSuperAdmin.value) && isPaymentPaidAll && isPaymentResponsibleNotEmpty && (isLoginUserResponsible || isSaleManagerOrSuperAdmin.value)
})

// 已支付：已付全款或者已付部分
const hadPaidPartOrAll = computed(() => (row) => {
  if (isEmpty(row)) return false
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
})

// 已付全款
const hadPaidAll = computed(() => (row) => {
  if (isEmpty(row)) return false
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
})

// 展示更换套餐按钮
const showSwitchPackageBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  // 订单状态为pending，但是 order.payments 中存在 已付全款 状态的 payment 订单，也需要显示
  let hadPaymentPaidAll = false

  if (!isEmpty(row.payments) && row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING) {
    if (row.payments.find((item) => item.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL)) {
      hadPaymentPaidAll = true
    }
  }
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || hadPaymentPaidAll
})

// 退费按钮
const showRefundBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  return (row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL) && row.orderRefundStatus !== ORDER_REFUND_STATUS.ALL_REFUND
})

/* 审核操作 */
const auditOrderFormRef = ref()
const openAuditOrderForm = (type: string, id: number) => {
  auditOrderFormRef.value.open(type, id)
}

/* 更换 Responsible */
const switchResponsibleFormRef = ref()
const switchResponsibleBtnLoading = ref({})
const switchResponsible = async (customerId, paymentRow) => {
  const paymentId = paymentRow.id
  try {
    // 对应按钮loading状态
    switchResponsibleBtnLoading.value[paymentId] = true
    // 判断当前登录用户是否为销售经理，销售经理角色可更换非自己名下的responsible
    if (!isSaleManagerOrSuperAdmin.value) {
      // 查询是否存在非 New 订单
      const canSwitchResponsible = await PackageOrderApi.getIsCanChangeResponsibleByCustomerId(customerId)
      if (!canSwitchResponsible) {
        await message.confirm('该学员存在非 New 订单，无法更换 Responsible')
        return
      }
    }
    // 打开更换 responsible 表单
    switchResponsibleFormRef.value.open(paymentRow, customerId)
  } finally {
    // 对应按钮loading状态
    switchResponsibleBtnLoading.value[paymentId] = false
  }
}

onMounted(() => {
  queryParams.customerId = toRef(props, 'customerId')
})
</script>

<style lang="scss" scoped>
/* tabs pane label 图标与文字上下排列*/
/* TODO:抽取至父组件 */
:deep(.el-tabs__item) {
  padding: 4px 20px;
}

.custom-tabs-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.order-tab-table {
  .final-payment {
    margin-left: 4px;
    font-weight: 700;
  }

  :deep(.el-table__inner-wrapper) {

    /* 隐藏折叠图标 清除动效 */
    .el-table__expand-icon {
      transition: none;

      .el-icon svn {
        display: none;
      }
    }

    /* 隐藏展开图标 清除动效*/
    .el-table__expand-icon--expanded {
      transform: rotate(0);
    }

    /* 折叠图标 */
    .el-table__expand-icon :after {
      display: inline-block;
      content: url('@/assets/svgs/PlusBoxOutline.svg');
    }

    /* 展开图标 */
    .el-table__expand-icon--expanded :after {
      display: inline-block;
      content: url('@/assets/svgs/MinusBoxOutline.svg');
    }

    /* 最后一行 解决内外滚动条重合 */
    .el-table__body tr:last-child td {
      padding-bottom: 8px;
    }
  }
}
</style>
