<template>
  <el-tab-pane name="qqepoint">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa-solid:sun" />
        <span>课时点</span>
      </div>
    </template>

    <template #default>
      <el-card>
        <div class="qqepoint flex justify-end">
          <div class="qqepoint-operate mb-10px">
            <el-button type="primary" plain @click="openForm('add')" size="small"
              v-hasPermi="['crm:sales:returnLog:qqePoints:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 添加课时点
            </el-button>
            <el-button type="warning" plain @click="openForm('remove')" size="small"
              v-hasPermi="['crm:sales:returnLog:qqePoints:remove']">
              <Icon icon="ep:minus" class="mr-5px" /> 扣除课时点
            </el-button>
          </div>
        </div>

        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe border
            :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
            <el-table-column label="学员" align="center" prop="customerName" min-width="140" />
            <el-table-column label="套餐订单号" align="center" prop="packagesOrderNum" min-width="160"
              :formatter="formatEmptyValue" />
            <el-table-column label="追加包订单号" align="center" prop="orderNum" min-width="160"
              :formatter="formatEmptyValue" />
            <el-table-column label="返还课时点点数" align="center" prop="returnPointsNum" min-width="140" />
            <el-table-column label="返回类型" align="center" prop="returnType" min-width="160">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.CRM_QQE_POINTS_ADD_CHANNEL" :value="scope.row.returnType" />
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="200" />
            <el-table-column label="课时点操作人" align="center" prop="creatorName" min-width="120" />
            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
              min-width="160" />
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 返还课时点 弹窗 -->
        <ReturnPointsLogForm ref="formRef" @success="getList" :hasCustomerId="true"
          :current-customer-id="props.customerId" />
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatEmptyValue } from '@/utils/table'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { isEmpty } from '@/utils/is'
import { CustomerQqePointsApi, CustomerQqePointsVO } from '@/api/crm/sales/qqePoints/customerQqePoints'
import ReturnPointsLogForm from '@/views/crm/sales/qqePoints/customerQqePoints/ReturnPointsLogForm.vue'

/** 课时点 Tab */
defineOptions({ name: 'QQEPointTab' })

/* 配置项 */
const loading = ref(true) // 列表的加载中
const list = ref<CustomerQqePointsVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const props = defineProps({
  customerId: {
    type: Number
  }
})

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  returnType: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerQqePointsApi.getCustomerQqePointsPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string) => {
  formRef.value.open(type, props.customerId)
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
</style>
