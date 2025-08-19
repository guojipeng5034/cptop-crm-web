<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="代理" prop="agencyId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
              :loading="queryOptions.agency.loading" :remote-method="queryOptions.agency.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.agency.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="佣金规则" prop="ruleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.ruleId" placeholder="请选择或检索佣金规则" clearable filterable class="!w-240px">
              <el-option v-for="option in queryOptions.rule.list" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否为主账号" prop="isPrimaryAccount" @keyup.enter="handleQuery">
            <el-radio-group v-model="queryParams.isPrimaryAccount" class="!w-240px">
              <template v-for="dict in getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value">
                <el-radio :label="dict.label" :value="dict.value" border />
              </template>
            </el-radio-group>
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
        <el-button @click="handleQuery" v-hasPermi="['crm:agency-commission-binding:query']">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:agency-commission-binding:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')"
          v-hasPermi="['crm:agency-commission-binding:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:agency-commission-binding:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="代理" align="center" prop="agencyName" min-width="160" fixed>
        <template #default="scope">
          <el-tooltip effect="light" content="点击查看代理信息" placement="top">
            <el-button link type="primary" @click="toAgencyList(scope.row.agencyId, scope.row.agencyName)">
              {{ scope.row.agencyName }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="持有点数" align="center" prop="holdingPoints" min-width="100" />
      <el-table-column label="佣金规则" align="center" prop="ruleName" min-width="110" />
      <el-table-column label="是否为主规则" align="center" prop="isPrimaryAccount" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isPrimaryAccount" />
        </template>
      </el-table-column>
      <el-table-column label="升级时间" align="center" prop="upgradeTime" :formatter="timeWithoutSecondFormat"
        min-width="150" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        min-width="150" />
      <el-table-column label="操作" align="center" min-width="130" fixed="right"
        v-hasPermi="['crm:agency-commission-binding:delete']">
        <template #default="scope">
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:agency-commission-binding:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <BindingForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getStrDictOptions, handleRemoteAgencyOptions, getAgencyCommissionRulesOptions } from '@/utils/dict'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { AgencyCommissionBindingApi, AgencyCommissionBindingVO } from '@/api/crm/agency/commission/binding'
import router from '@/router'
import BindingForm from './BindingForm.vue'

/** 代理佣金绑定 列表 */
defineOptions({ name: 'AgencyCommissionBinding' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<AgencyCommissionBindingVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agencyId: undefined,
  ruleId: undefined,
  isPrimaryAccount: undefined,
  createTime: []
})

/* 选项列表 */
const queryOptions = reactive({
  agency: useRemoteSearch(handleRemoteAgencyOptions),
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
    const data = await AgencyCommissionBindingApi.getAgencyCommissionBindingPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, agencyName?: string) => {
  formRef.value.open(type, id, agencyName)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AgencyCommissionBindingApi.deleteAgencyCommissionBinding(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AgencyCommissionBindingApi.exportAgencyCommissionBinding(queryParams)
    download.excel(data, '代理佣金绑定.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 代理名字点击 */
const toAgencyList = (id: number, name: string) => {
  router.push({
    name: 'Agency',
    query: {
      agencyId: id,
      agencyName: name
    }
  })
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
