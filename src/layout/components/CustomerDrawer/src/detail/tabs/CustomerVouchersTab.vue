<template>
  <el-tab-pane name="vouchers">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="ep:ticket" />
        <span>学员券</span>
      </div>
    </template>
    <template #default>
      <el-tabs type="border-card" stretch v-model="activeTabName" @tab-change="getList" class="data-table !mr-10px">
        <el-tab-pane label="优惠券" name="coupon" class="!pt-0 !pb-0">
          <div class="customer-coupon-title flex justify-end">
            <div class="customerCoupon-create mt--5px mb-10px">
              <el-button type="primary" plain @click="openForm('create')" size="small"
                v-hasPermi="['crm:sales:customerCoupon:create']">
                <Icon icon="ep:plus" class="mr-5px" /> 新增
              </el-button>
            </div>
          </div>
          <!-- 列表 -->
          <el-scrollbar max-height="calc(100vh - 320px)">
            <el-table v-loading="loading" :data="list" stripe border
              :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
              <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
              <el-table-column label="优惠券" align="center" prop="couponName" min-width="180" />
              <el-table-column label="优惠金额" align="center" prop="couponAmount" min-width="85" />
              <el-table-column label="状态" align="center" prop="status" min-width="100" class-name="padding-side-0">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CRM_COUPON_USED_STATUS" :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column label="添加渠道" align="center" prop="channel" min-width="100" class-name="padding-side-0">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CRM_COUPON_ADD_CHANNEL" :value="scope.row.channel" />
                </template>
              </el-table-column>
              <el-table-column label="有效期开始" align="center" prop="expiredFrom" :formatter="timeWithoutSecondFormat"
                min-width="100" class-name="padding-side-0" />
              <el-table-column label="有效期结束" align="center" prop="expiredTo" :formatter="timeWithoutSecondFormat"
                min-width="100" class-name="padding-side-0" />
              <el-table-column label="使用时间" align="center" prop="employTime" :formatter="timeWithoutSecondFormat"
                min-width="100" class-name="padding-side-0" />
              <el-table-column label="被推荐人" align="center" prop="referrerCustomerName" min-width="150" />
              <el-table-column label="优惠券添加人" align="center" prop="creatorName" min-width="150" />
              <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
                width="100" class-name="padding-side-0" />
              <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="200" />
              <el-table-column label="操作" align="center" fixed="right"
                v-hasPermi="['crm:sales:customerCoupon:update', 'crm:sales:customerCoupon:delete']" min-width="110px"
                class-name="padding-side-0">
                <template #default="scope">
                  <el-button link type="primary" @click="openForm('update', scope.row.id, scope.row.customerName)"
                    v-hasPermi="['crm:sales:customerCoupon:update']">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDelete(scope.row.id)"
                    v-hasPermi="['crm:sales:customerCoupon:delete']">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="couponQueryParams.pageNo" v-model:limit="couponQueryParams.pageSize"
            @pagination="getList" size="small" class="mt-4 !mb-0" />

          <!-- 表单弹窗：添加/修改 -->
          <CustomerCouponForm ref="customerCouponFormRef" @customer-coupon-success="getList" :hasCustomerId="true" />
        </el-tab-pane>

        <el-tab-pane label="停课券" name="suspend" class="!pt-0 !pb-0">
          <div class="suspend-title flex justify-end">
            <div class="suspend-create mt--5px mb-10px">
              <el-button type="primary" plain @click="openForm('create')" size="small"
                v-hasPermi="['crm:sales:customerSuspend:create']">
                <Icon icon="ep:plus" class="mr-5px" /> 新增
              </el-button>
            </div>
          </div>
          <!-- 列表 -->
          <el-scrollbar max-height="calc(100vh - 320px)">
            <el-table v-loading="loading" :data="list" :stripe="true" border
              :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
              <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
              <el-table-column label="停课券" align="center" prop="couponName" min-width="180" />
              <el-table-column label="状态" align="center" prop="status" min-width="60" class-name="padding-side-0">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CRM_COUPON_USED_STATUS" :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column label="添加渠道" align="center" prop="channel" min-width="75" class-name="padding-side-0">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CRM_COUPON_ADD_CHANNEL" :value="scope.row.channel" />
                </template>
              </el-table-column>
              <el-table-column label="有效期" align="center">
                <el-table-column label="开始" align="center" prop="expiredFrom" :formatter="timeWithoutSecondFormat"
                  min-width="110" />
                <el-table-column label="结束" align="center" prop="expiredTo" :formatter="timeWithoutSecondFormat"
                  min-width="110" />
              </el-table-column>
              <el-table-column label="使用时间" align="center" prop="employTime" :formatter="timeWithoutSecondFormat"
                min-width="110" />
              <el-table-column label="被推荐人" align="center" prop="referrerCustomerName" min-width="150" />
              <el-table-column label="停课券添加人" align="center" prop="creatorName" min-width="150" />

              <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
                min-width="110" />
              <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="200" />
              <el-table-column label="操作" align="center" min-width="110" fixed="right" v-hasPermi="[
                'crm:sales:customerSuspend:update',
                'crm:sales:customerSuspend:delete'
              ]" class-name="padding-side-0">
                <template #default="scope">
                  <el-button link type="primary" @click="openForm('update', scope.row.id, scope.row.customerName)"
                    v-hasPermi="['crm:sales:customerSuspend:update']">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDelete(scope.row.id)"
                    v-hasPermi="['crm:sales:customerSuspend:delete']">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="suspendQueryParams.pageNo"
            v-model:limit="suspendQueryParams.pageSize" @pagination="getList" size="small" class="mt-4 !mb-0" />
          <!-- 学员停课券 表单 -->
          <CustomerSuspendForm ref="customerSuspendFormRef" @success="getList" :hasCustomerId="true"
            :customer-id="props.customerId" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
/* api */
import { CustomerCouponApi, CustomerCouponVO } from '@/api/crm/sales/coupon/customerCoupon'
import { CustomerSuspendApi, CustomerSuspendVO } from '@/api/crm/sales/suspend/customerSuspend'

/* vue */
import CustomerCouponForm from '@/views/crm/sales/coupon/customerCoupon/CustomerCouponForm.vue'
import CustomerSuspendForm from '@/views/crm/sales/suspend/customerSuspend/CustomerSuspendForm.vue'

/** 套餐 Tab */
defineOptions({ name: 'CustomerVouchersTab' })

const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CustomerCouponVO[] | CustomerSuspendVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

const currentCustomerId = ref()

/* 学员优惠券/停课券 */
const activeTabName = ref('') // tabs 绑定的 tab name coupon--学员优惠券； suspend--学员停课券

/* 优惠券请求参数 */
const couponQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined
})

/* 停课券请求参数 */
const suspendQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    let data = {}
    if (activeTabName.value === 'coupon') {
      data = await CustomerCouponApi.getCustomerCouponPage(couponQueryParams)
    } else if (activeTabName.value === 'suspend') {
      data = await CustomerSuspendApi.getCustomerSuspendPage(suspendQueryParams)
    }
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const customerCouponFormRef = ref()
const customerSuspendFormRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  name = props.customerName //新增时通过 name 绑定学员 select 组件
  const customerId = props.customerId
  if (activeTabName.value === 'coupon') {
    customerCouponFormRef.value.open(type, id, name, customerId)
  } else if (activeTabName.value === 'suspend') {
    customerSuspendFormRef.value.open(type, id, name, customerId)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    if (activeTabName.value === 'coupon') {
      await CustomerCouponApi.deleteCustomerCoupon(id)
    } else if (activeTabName.value === 'suspend') {
      await CustomerSuspendApi.deleteCustomerSuspend(id)
    }
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/* 复位tab */
const resetTabActiveName = () => {
  activeTabName.value = 'coupon'
}

defineExpose({ getList, resetTabActiveName })

onMounted(() => {
  couponQueryParams.customerId = toRef(props, 'customerId')
  suspendQueryParams.customerId = toRef(props, 'customerId')
  currentCustomerId.value = toRef(props, 'customerId')
  resetTabActiveName()
})
</script>

<style lang="scss" scoped>
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
        /* line-height: 20px; */
      }
    }
  }
}

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
</style>
