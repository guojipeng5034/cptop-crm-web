<template>
  <el-tab-pane name="contact">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa:phone" />
        <span>联系记录</span>
      </div>
    </template>

    <template #default>
      <el-card>
        <div class="ticket-title flex justify-end">
          <div class="ticket-create mb-10px">
            <el-button type="primary" plain @click="openForm('create')" size="small"
              v-hasPermi="['crm:contact-history:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </div>
        </div>

        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe border class="table">
            <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
            <el-table-column label="联系纪要" align="center" min-width="450">
              <template #default="scope">
                <span v-html="scope.row.contactContent"></span>
              </template>
            </el-table-column>
            <el-table-column label="联系记录相关信息" align="center">
              <el-table-column label="分类" align="center" prop="contactCategory" min-width="100">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CONTACT_CATEGORY" :value="scope.row.contactCategory" />
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" prop="contactType" width="95">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CONTACT_TYPE" :value="scope.row.contactType" />
                </template>
              </el-table-column>
              <el-table-column label="联系人" align="center" prop="responsibleName" min-width="150" />
              <el-table-column label="日期" align="center" prop="contactDate" :formatter="dateFormatterYMDHm"
                width="110" />
              <el-table-column label="结果" align="center" prop="contactResultType" width="135">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CONTACT_RESULT_TYPE" :value="scope.row.contactResultType" />
                </template>
              </el-table-column>
              <el-table-column label="原因" align="center" prop="contactReason" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="下次联系相关信息" align="center">
              <el-table-column label="联系日期" align="center" prop="nextContactDate" :formatter="dateFormatterYMDHm"
                width="110px" />
              <el-table-column label="负责人" align="center" prop="nextResponsibleName" min-width="150" />
              <!-- <el-table-column
              label="预约日期"
              align="center"
              prop="nextReservedDate"
              :formatter="dateFormatterYMDHm"
              width="110px"
            /> -->
            </el-table-column>

            <el-table-column label="返回课时点相关信息" align="center">
              <el-table-column label="数量" align="center" prop="refundPoints" width="60" />
              <el-table-column label="原因" align="center" prop="refundReason" width="155">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.CONTACT_RETURN_QQEPOINT_REASON" :value="scope.row.refundReason" />
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="处理结果" align="center" prop="handleResult" width="90" show-overflow-tooltip />

            <el-table-column label="创建人" align="center" prop="creatorName" width="120" />

            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
              width="110" />
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 联系记录 表单 -->
        <ContactHistoryForm ref="formRef" @success="getList" :hasCustomerId="true"
          :current-customer-id="props.customerId" />
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { ContactHistoryApi, ContactHistoryVO } from '@/api/crm/customer/contact'
import ContactHistoryForm from '@/views/crm/customer/contact/ContactHistoryForm.vue'

/** 学员星币 Tab */
defineOptions({ name: 'ContactHistoryTab' })

const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

/* 配置项 */
const loading = ref(true) // 列表的加载中
const list = ref<ContactHistoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const currentCustomerId = ref()

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  contactType: undefined,
  responsibleId: undefined,
  contactDate: [],
  contactResultType: undefined,
  contactContent: undefined,
  nextContactDate: [],
  nextResponsibleId: undefined,
  nextReservedDate: [],
  refundReason: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContactHistoryApi.getContactHistoryPage(queryParams)
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

.table {
  display: block;

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
</style>
