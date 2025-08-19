<template>
  <el-tab-pane name="coin">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa-solid:star" />
        <span>星币</span>
      </div>
    </template>
    <template #default>
      <el-card>
        <div class="ticket-title flex justify-end">
          <div class="ticket-create mb-10px">
            <el-button type="primary" plain @click="openForm('create')" size="small"
              v-hasPermi="['crm:customer-star:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </div>
        </div>

        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border
            :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
            <el-table-column label="学员" align="center" prop="customerName" min-width="140" />
            <el-table-column label="星币数" align="center" prop="starCount" min-width="100" />
            <el-table-column label="星币来源" align="center" prop="starSource" min-width="120">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.STAR_SOURCE" :value="scope.row.starSource" />
              </template>
            </el-table-column>
            <el-table-column label="星币操作人" align="center" prop="creatorName" />
            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
              min-width="180" />
            <el-table-column label="操作" align="center" min-width="120"
              v-hasPermi="['crm:customer-star:update', 'crm:customer-star:delete']">
              <template #default="scope">
                <el-button link type="primary" @click="openForm('update', scope.row.id, scope.row.customerName)"
                  v-hasPermi="['crm:customer-star:update']">
                  编辑
                </el-button>
                <el-button link type="danger" @click="handleDelete(scope.row.id)"
                  v-hasPermi="['crm:customer-star:delete']">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 学员星币 表单 -->
        <CustomerStarForm ref="formRef" @success="getList" :hasCustomerId="true"
          :current-customer-id="props.customerId" />
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { CustomerStarApi, CustomerStarVO } from '@/api/crm/sales/star/customerStar'
import CustomerStarForm from '@/views/crm/sales/star/customerStar/CustomerStarForm.vue'

/** 学员星币 Tab */
defineOptions({ name: 'CustomerStarTab' })

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
const list = ref<CustomerStarVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  starCount: undefined,
  starSource: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerStarApi.getCustomerStarPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

defineExpose({ getList })

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  name = props.customerName
  const customerId = props.customerId
  formRef.value.open(type, id, name, customerId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerStarApi.deleteCustomerStar(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
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
</style>
