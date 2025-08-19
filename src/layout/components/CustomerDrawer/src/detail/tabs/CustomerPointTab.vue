<template>
  <el-tab-pane name="point">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa-solid:trophy" />
        <span>积分</span>
      </div>
    </template>

    <template #default>
      <el-card>
        <div class="point-title">
          <div class="point-info">
            <span class="point-usable font-700">可用积分: {{ pointCount.pointsSum - pointCount.pointsUsedSum }}</span>
            <span class="point-total font-700">累计获取: {{ pointCount.pointsSum }}</span>
            <span class="point-rest font-700">累计使用: {{ pointCount.pointsUsedSum }}</span>
          </div>
          <div class="point-create">
            <el-button type="primary" plain @click="openForm('add')" size="small"
              v-hasPermi="['crm:sales:returnLog:points:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 添加积分
            </el-button>
            <el-button type="warning" plain @click="openForm('remove')" size="small"
              v-hasPermi="['crm:sales:returnLog:points:create']">
              <Icon icon="ep:minus" class="mr-5px" /> 扣除积分
            </el-button>
          </div>
        </div>
        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe border
            :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
            <el-table-column label="学员" align="center" prop="customerName" min-width="120" />
            <el-table-column label="积分变动数量" align="center" prop="pointsNum" min-width="90">
              <template #default="scope">
                <div :class="scope.row.pointsNum < 0 ? 'color-red font-700' : ''">
                  {{ scope.row.pointsNum }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="可用积分" align="center" prop="validPointsNum" min-width="90" />
            <el-table-column label="积分变动原因" align="center" prop="channel" min-width="100">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.CRM_POINTS_ADD_CHANNEL" :value="scope.row.channel" />
              </template>
            </el-table-column>
            <el-table-column label="推荐付费学员" align="center" prop="paymentCustomerName" width="140" />
            <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="320" />
            <el-table-column label="积分操作人" align="center" prop="creatorName" width="120" />
            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
              min-width="120" />
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 积分变动 表单 -->
        <PointsLogForm ref="formRef" @success="getList" :current-customer-id="props.customerId" :hasCustomerId="true" />
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { isEmpty } from '@/utils/is'
import { CustomerPointApi, CustomerPointVO } from '@/api/crm/sales/point/customerPoint'
import PointsLogForm from '@/views/crm/sales/point/customerPoint/PointsLogForm.vue'

/** 积分 Tab */
defineOptions({ name: 'CustomerPointTab' })

const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

const currentCustomerId = ref()
const loading = ref(true) // 列表的加载中
const list = ref<CustomerPointVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  channel: undefined,
  paymentCustomerId: undefined,
  createTime: [],
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    getPointCount()
    const data = await CustomerPointApi.getCustomerPointPage(queryParams)
    if (!isEmpty(data.pageData)) {
      list.value = data.pageData.list
      total.value = data.pageData.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

/** 2.4.2 新增/编辑积分弹窗 */
const formRef = ref()
const openForm = (type: string) => {
  const customerId = props.customerId
  formRef.value.open(type, props.customerName, customerId, pointCount.value.pointsSum - pointCount.value.pointsUsedSum)
}

/* 2.6.4 获取积分统计数据 */
const pointCount = ref({})
const getPointCount = async () => {
  try {
    const data = await CustomerPointApi.getCustomerPointCount(props.customerId)
    pointCount.value = data
  } catch (e) {
    console.log('getPointCount', e)
  }
}

onMounted(() => {
  queryParams.customerId = toRef(props, 'customerId')
  currentCustomerId.value = toRef(props, 'customerId')
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

/* tab: 积分 */
.point-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;

  .point-info {

    .point-usable,
    .point-total {
      margin-right: 20px;
    }
  }
}
</style>
