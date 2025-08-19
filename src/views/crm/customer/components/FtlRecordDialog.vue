<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900">
    <el-table v-loading="loading" :data="list" stripe border>
      <el-table-column label="预约时间" prop="reservedTime" align="center" min-width="130"
        :formatter="timeWithoutSecondFormat" />
      <el-table-column label="开课时间" prop="startTime" align="center" min-width="130"
        :formatter="timeWithoutSecondFormat" />
      <el-table-column label="状态" prop="status" align="center" min-width="80">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_CUSTOMER_FTL_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="未完成原因" prop="incomplateReasonName" align="center" min-width="200" />
    </el-table>

    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { CustomerFtlRecordApi, CustomerFtlRecordVO } from '@/api/crm/customer/ftlRecord'

/** 退款表单 */
defineOptions({ name: 'FtlRecordDialog' })

/** 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('FTL详情') // 弹窗的标题

/** 列表 */
const loading = ref(true) // 列表的加载中
const list = ref<CustomerFtlRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerFtlRecordApi.getCustomerFtlRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 打开弹窗 */
const open = async (customerId: number) => {
  dialogVisible.value = true
  queryParams.customerId = customerId
  getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
