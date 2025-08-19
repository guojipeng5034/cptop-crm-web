<template>
  <el-tab-pane name="account">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa-solid:chalkboard-teacher" />
        <span>学员账号</span>
      </div>
    </template>
    <template #default>
      <el-card>
        <el-table v-loading="loading" :data="list" stripe border
          :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
          <el-table-column label="学员" align="center" prop="customerName" min-width="130" />
          <el-table-column label="QQE Uid" align="center" prop="studentUid" width="400">
            <template #default="scope">
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="primary" @click="handleCopy">
                  {{ scope.row.studentUid }}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="站点" align="center" prop="siteId" min-width="100">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="scope.row.siteId" />
            </template>
          </el-table-column>
          <el-table-column label="是否为主账号" align="center" prop="primaryAccountFlag" min-width="110">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.primaryAccountFlag" />
            </template>
          </el-table-column>
          <el-table-column label="账号是否无效" align="center" prop="student.primaryAccountFlag" min-width="110">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.student?.invalidFlag" />
            </template>
          </el-table-column>
          <el-table-column label="账号创建人" align="center" prop="creatorName" min-width="120" />

          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
            min-width="140" />
          <el-table-column label="操作" align="center" min-width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="goToQQE(scope.row.studentUid)"
                v-hasPermi="['crm:customer:get:qqe:button']">
                QQE
              </el-button>
              <el-button link type="danger" @click="setPrimaryAccount(scope.row)" v-if="!scope.row.primaryAccountFlag"
                v-hasPermi="['crm:customer-account:update']" class="!ml-1">
                设为主账号
              </el-button>
              <el-button link type="danger" @click="setAccountInvalid(scope.row)"
                v-if="!scope.row.student?.invalidFlag && !scope.row.primaryAccountFlag"
                v-hasPermi="['crm:customer-account:update']" class="!ml-1">
                设为无效账号
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
          small
        /> -->
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { goToQQE } from '@/utils/navigation'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { CustomerAccountApi, CustomerAccountVO } from '@/api/crm/customer/account'

/** 学员账号 Tab */
defineOptions({ name: 'CustomerAccountTab' })

const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

const currentCustomerId = ref()

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<CustomerAccountVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  studentUid: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerAccountApi.getCustomerAccountPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['refreshUid']) // 定义 success 事件，用于操作成功后的回调
/* 设置主账号 */
const setPrimaryAccount = async (rowData) => {
  try {
    const data = {
      id: rowData.id,
      customerId: rowData.customerId,
      siteId: rowData.siteId,
      primaryAccountFlag: true
    }
    await CustomerAccountApi.updateCustomerAccount(data)
    message.success('已将该账号设置为主账号。')
    getList()
    emit('refreshUid')
  } catch (e) {
    console.log('setPrimaryAccount', e)
  }
}

/* 设置账号为无效账号 */
const setAccountInvalid = async (rowData) => {
  try {
    const data = {
      id: rowData.id,
      customerId: rowData.customerId,
      siteId: rowData.siteId,
      student: {
        invalidFlag: true
      }
    }
    await CustomerAccountApi.updateCustomerAccount(data)
    message.success('已将该账号设置为无效账号。')
    getList()
  } catch (e) {
    console.log('setAccountInvalid', e)
  }
}

defineExpose({ getList })

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
</style>
