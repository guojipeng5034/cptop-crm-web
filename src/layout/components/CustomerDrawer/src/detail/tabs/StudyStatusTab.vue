<template>
  <el-tab-pane name="status">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa:toggle-on" />
        <span>状态记录</span>
      </div>
    </template>

    <template #default>
      <el-card>
        <div class="ticket-title flex justify-end">
          <div class="ticket-create mb-10px">
            <!-- <el-button type="primary" plain @click="openForm('create')" size="small">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button> -->
          </div>
        </div>

        <!-- 列表 -->
        <el-scrollbar max-height="calc(100vh - 270px)">
          <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border
            :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
            <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
            <el-table-column label="上次状态" align="center" prop="lastStudyStatus">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.lastStudyStatus" />
              </template>
            </el-table-column>
            <el-table-column label="当前状态" align="center" prop="studyStatus">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.studyStatus" />
              </template>
            </el-table-column>
            <el-table-column label="状态变更人" align="center" prop="creatorName" />
            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat" />
            <el-table-column label="操作" align="center" width="80">
              <template #default="scope">
                <el-button link type="danger" @click="handleDelete(scope.row.id)"
                  v-hasPermi="['crm:customer-study-status:delete']">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" size="small" />

        <!-- 学习状态 表单 -->
        <!-- <CustomerStudyStatusForm
          ref="formRef"
          @success="getList"
          :hasCustomerId="true"
          :current-customer-id="props.customerId"
        /> -->
      </el-card>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getCustomersMultOptions } from '@/utils/dict'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { StudyStatusApi, StudyStatusVO } from '@/api/crm/customer/studyStatus'
// import CustomerStudyStatusForm from './CustomerStudyStatusForm.vue'

/** 学员星币 Tab */
defineOptions({ name: 'StudyStatusTab' })

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
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<StudyStatusVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  lastStudyStatus: undefined,
  studyStatus: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StudyStatusApi.getStudyStatusPage(queryParams)
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
    await StudyStatusApi.deleteStudyStatus(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
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
</style>
