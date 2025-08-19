<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="佣金规则" prop="ruleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.ruleId" placeholder="请选择或检索佣金规则" clearable filterable class="!w-240px">
              <el-option v-for="option in queryOptions.rule.list" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="上级佣金规则" prop="parentRulesId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.parentRulesId" placeholder="请选择或检索佣金规则" clearable filterable
              class="!w-240px">
              <el-option v-for="option in queryOptions.rule.list" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="升级所需点数" prop="upgradePoints" @keyup.enter="handleQuery">
            <el-input-number v-limit-input v-model="queryParams.upgradePoints" placeholder="请输入升级所需点数" :min="0"
              :max="999999999" :step="1" step-strictly class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否可升级" prop="isUpgradeFlag" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isUpgradeFlag" placeholder="请选择是否可升级" clearable filterable class="!w-240px">
              <el-option v-for="option in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="option in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:agency-commission-rules:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:agency-commission-rules:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:agency-commission-rules:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="佣金规则" align="center" prop="ruleName" />
      <el-table-column label="是否可升级" align="center" prop="isUpgradeFlag" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isUpgradeFlag" />
        </template>
      </el-table-column>
      <el-table-column label="升级所需点数" align="center" prop="upgradePoints" min-width="110" />
      <el-table-column label="上级佣金规则" align="center" prop="parentRulesName" min-width="110" />
      <el-table-column label="状态" align="center" prop="status" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="description" show-overflow-tooltip min-width="200" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        min-width="110" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <RulesForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, getBoolDictOptions, getAgencyCommissionRulesOptions } from '@/utils/dict'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import download from '@/utils/download'
import { AgencyCommissionRulesApi, AgencyCommissionRulesVO } from '@/api/crm/agency/commission/rules'
import RulesForm from './RulesForm.vue'

/** 代理佣金规则 列表 */
defineOptions({ name: 'AgencyCommissionRules' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<AgencyCommissionRulesVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ruleId: undefined,
  ruleType: undefined,
  isUpgradeFlag: undefined,
  upgradePoints: undefined,
  parentRulesId: undefined,
  description: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/* 选项列表 */
const queryOptions = reactive({
  rule: {
    list: [],
    get: async () => {
      queryOptions.rule.list = await getAgencyCommissionRulesOptions()
    }
  },
  async init() {
    await this.rule.get()
  }
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgencyCommissionRulesApi.getAgencyCommissionRulesPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AgencyCommissionRulesApi.exportAgencyCommissionRules(queryParams)
    download.excel(data, '代理佣金规则.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.search-form) {
  .el-form-item {
    margin-right: 20px;
  }

  /* 控制 search form label 分散对齐 */
  .el-form-item__label {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}

.font-size-3 :deep(.el-form-item__label) {
  font-size: 0.75rem;
}
</style>
