<template>
  <el-tab-pane name="ticket">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa:credit-card-alt" />
        <span>次卡</span>
      </div>
    </template>

    <template #default>
      <el-card>
        <div class="ticket-title flex justify-end">
          <div class="ticket-create mb-10px">
            <el-button type="primary" plain @click="openForm('create')" size="small"
              v-hasPermi="['crm:sales:returnLog:ticket:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </div>
        </div>
        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe border
            :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
            <el-table-column label="学员" align="center" prop="customerName" min-width="140" />
            <el-table-column label="次卡名称" align="center" prop="tickerName" min-width="120" />
            <el-table-column label="返还类型" align="center" prop="returnType" min-width="110">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.CRM_TICKET_ADD_CHANNEL" :value="scope.row.returnType" />
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status" min-width="110">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.TICKET_REMOVE_STATUS" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip min-width="110" />
            <el-table-column label="次卡操作人" align="center" prop="creatorName" min-width="110" />
            <el-table-column label="移除时间" align="center" prop="removeTime" :formatter="dateFormatterYMDHm"
              min-width="110" />
            <el-table-column label="次卡套餐到期时间" align="center" prop="expiresTime" :formatter="dateFormatterYMDHm"
              min-width="110" />
            <el-table-column label="操作" align="center" min-width="90" fixed="right"
              v-hasPermi="['crm:sales:returnLog:ticket:remove']">
              <template #default="scope">
                <el-button link type="danger" v-if="scope.row.status === 0" @click="handleRemove(scope.row.id)"
                  v-hasPermi="['crm:sales:returnLog:ticket:remove']">
                  移除次卡
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 返还次卡 表单 -->
        <ReturnTicketLogForm ref="formRef" @success="getList" :current-customer-id="props.customerId"
          :hasCustomerId="true" />
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { CustomerTicketApi, CustomerTicketVO } from '@/api/crm/sales/ticket/customerTicket'
import ReturnTicketLogForm from '@/views/crm/sales/ticket/customerTicket/ReturnTicketLogForm.vue'

/** 次卡 Tab */
defineOptions({ name: 'CustomerTicketTab' })

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
const loading = ref(true) // 列表的加载中
const list = ref<CustomerTicketVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
})

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

defineExpose({ getList })

/** 2.4.2 新增/编辑次卡弹窗 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  name = props.customerName
  const customerId = props.customerId
  formRef.value.open(type, id, name, customerId)
}

/** 2.4.3 移除次卡记录按钮操作 */
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

onMounted(async () => {
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
