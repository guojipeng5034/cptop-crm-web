<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <div class="search-form-items pos-relative">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="合作模式" prop="agencyType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyType" clearable placeholder="请选择合作模式" class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_EXTERNAL_COOPERATION_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="代理" prop="agencyId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyId" clearable filterable remote
                :loading="queryOptions.agency.loading" :remote-method="queryOptions.agency.handleSearch"
                placeholder="请检索代理" class="!w-240px">
                <el-option v-for="option in queryOptions.agency.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="性别" prop="gender" @keyup.enter="handleQuery">
              <el-radio-group v-model="queryParams.gender">
                <el-radio-button v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="地址" prop="agencyAddress" @keyup.enter="handleQuery">
              <el-input v-model.trim="queryParams.agencyAddress" clearable placeholder="请输入地址" class="!w-240px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员" prop="agencyStudentId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyStudentId" placeholder="请检索学员" clearable filterable remote
                :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="国家区号" prop="countryCode" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.countryCode" placeholder="请选择国家区号" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TELEPHONE_CODE_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="电话" prop="agencyPhone" @keyup.enter="handleQuery">
              <el-input v-model.trim="queryParams.agencyPhone" clearable placeholder="请输入电话" class="!w-240px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="代理类型" prop="agencySource" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencySource" placeholder="请选择代理类型" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="来源渠道" prop="sourceChannel" @keyup.enter="handleQuery">
              <el-input v-model.trim="queryParams.sourceChannel" clearable placeholder="请输入来源渠道" class="!w-240px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="合作状态" prop="agencyStatus" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyStatus" placeholder="请选择合作状态" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="代理推荐人" prop="agencyReferenceId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyReferenceId" clearable filterable remote
                :loading="queryOptions.agencyReference.loading"
                :remote-method="queryOptions.agencyReference.handleSearch" placeholder="请检索代理推荐人" class="!w-240px">
                <el-option v-for="option in queryOptions.agencyReference.options" :key="option.value"
                  :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="推广负责人" prop="promotionResponsibleId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.promotionResponsibleId" clearable filterable remote
                :loading="queryOptions.promotion.loading" :remote-method="queryOptions.promotion.handleSearch"
                placeholder="请检索推广负责人" class="!w-240px">
                <el-option v-for="option in queryOptions.promotion.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="销售负责人" prop="salesResponsibleId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.salesResponsibleId" clearable filterable remote
                :loading="queryOptions.sales.loading" :remote-method="queryOptions.sales.handleSearch"
                placeholder="请检索销售负责人" class="!w-240px">
                <el-option v-for="option in queryOptions.sales.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="备注关键词" prop="remark" @keyup.enter="handleQuery">
              <el-input v-model="queryParams.remark" placeholder="请输入备注关键词" clearable class="!w-240px" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 折叠展开按钮 -->
        <el-divider class="!mt-5px !mb-5px">
          <el-button type="primary" link @click="showMoreFormItems">
            更多
            <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="showMoreItems ? 'arrow-down' : 'arrow-up'" />
          </el-button>
        </el-divider>

        <el-collapse v-model="showMoreItems" accordion>
          <el-collapse-item name="more">
            <template #title>
              <div class="title"></div>
            </template>
            <template #default>
              <el-row>
                <el-col :span="11">
                  <div class="flex justify-start mb-2.5 ">
                    <span class="text-5 text-#626aef" style="border-bottom: 1px solid #626aef">对公</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="收款人姓名" prop="corporatePayeeName" @keyup.enter="handleQuery">
                        <el-input v-model="queryParams.corporatePayeeName" clearable placeholder="请输入收款人姓名"
                          class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="收款账户" prop="corporatePaymentAccountNumber" @keyup.enter="handleQuery">
                        <el-input v-only-numbers v-model.trim="queryParams.corporatePaymentAccountNumber" clearable
                          placeholder="请输入收款账户" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="纳税人识别号" prop="corporatePaymentTin" @keyup.enter="handleQuery">
                        <el-input v-only-numbers-and-upword v-model.trim="queryParams.corporatePaymentTin" clearable
                          placeholder="请输入纳税人识别号" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="所属银行" prop="corporatePaymentBank" @keyup.enter="handleQuery">
                        <el-select v-model="queryParams.corporatePaymentBank" clearable placeholder="请选择所属银行"
                          class="!w-190px">
                          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_BANK_LIST)" :key="dict.value"
                            :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="开户行" prop="corporatePaymentOpeningBank" @keyup.enter="handleQuery">
                        <el-input v-model.trim="queryParams.corporatePaymentOpeningBank" clearable placeholder="请输入开户行"
                          class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="开户行联行号" prop="corporatePaymentOpeningBankAccount" @keyup.enter="handleQuery">
                        <el-input v-only-numbers v-model.trim="queryParams.corporatePaymentOpeningBankAccount" clearable
                          placeholder="请输入开户行联行号" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2">
                  <div class="flex justify-start mb-2.5">
                    <span class="text-5 text-#626aef" style="border-bottom: 1px solid #626aef">对私</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="收款人姓名" prop="privatePayeeName" @keyup.enter="handleQuery">
                        <el-input v-model="queryParams.privatePayeeName" clearable placeholder="请输入收款人姓名"
                          class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="收款账户" prop="privatePaymentAccountNumber" @keyup.enter="handleQuery">
                        <el-input v-only-numbers v-model.trim="queryParams.privatePaymentAccountNumber" clearable
                          placeholder="请输入收款账户" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="报税编号" prop="declareTaxesNumber" @keyup.enter="handleQuery">
                        <el-input v-only-numbers v-model.trim="queryParams.declareTaxesNumber" clearable
                          placeholder="请输入报税编号" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="所属银行" prop="privatePaymentBank" @keyup.enter="handleQuery">
                        <el-select v-model="queryParams.privatePaymentBank" clearable placeholder="请选择所属银行"
                          class="!w-190px">
                          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_BANK_LIST)" :key="dict.value"
                            :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="开户行" prop="privatePaymentOpeningBank" @keyup.enter="handleQuery">
                        <el-input v-model.trim="queryParams.privatePaymentOpeningBank" clearable placeholder="请输入开户行"
                          class="!w-190px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="开户行联行号" prop="privatePaymentOpeningBankAccount" @keyup.enter="handleQuery">
                        <el-input v-only-numbers v-model.trim="queryParams.privatePaymentOpeningBankAccount" clearable
                          placeholder="请输入开户行联行号" class="!w-190px" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-form-item class="mt-2">
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-agency:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-agency:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('createChannel', 2)"
          v-hasPermi="['crm:channel-agency:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-agency:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="warning" plain @click="handleOpenTransfer" v-hasPermi="['crm:channel-agency:transfer']">
          <Icon icon="mingcute:transfer-line" class="mr-5px" /> 批量转移
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="代理名称" align="center" prop="agencyName" min-width="300" />
      <el-table-column label="电话" align="center" prop="agencyPhone" min-width="230">
        <template #default="scope">
          <div class="flex justify-center items-center">
            {{ scope.row.agencyPhone }}
            <el-button size="small" class="ml-2 !px-1 !h-5"
              @click="checkFullInfo(CRM_DESENSITIZE_TYPE.PHONE, scope.row.id)" v-hasPermi="['crm:sensitize:query']">
              查看完整信息
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="agencyAddress" min-width="300" />
      <el-table-column label="代理类型" align="center" prop="agencySource" width="160">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_AGENCY_FROM" :value="scope.row.agencySource" />
        </template>
      </el-table-column>
      <el-table-column label="学员" align="center" min-width="200">
        <template #default="scope">
          <div v-if="scope.row.agencyStudentId && scope.row.agencyStudentName">
            <div class="flex justify-center items-center">
              <el-button link type="primary"
                @click="handleOpenDrawer(scope.row.agencyStudentId, scope.row.agencyStudentName)">
                {{ scope.row.agencyStudentName }}
              </el-button>
            </div>
            <div class="font-size-2.5 c-#777">
              <span class="student-number flex justify-center items-center">
                <span>学号:</span>
                <el-tooltip effect="light" content="点击复制" placement="right">
                  <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                    {{ scope.row.agencyStudentId }}
                  </el-button>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="代理推荐人" align="center" prop="agencyReferenceName" min-width="200" />
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" width="220">
        <template #default="scope">
          <div v-for="obj in scope.row.responsibleList" :key="obj.siteId" class="flex items-center">
            <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="obj.siteId" class="m-r-1 flex justify-center w-40%" />
            <span class="w-60% text-center">{{ obj.promotionResponsibleName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售负责人" align="center" prop="salesResponsibleName" width="200">
        <template #default="scope">
          <div v-for="obj in scope.row.responsibleList" :key="obj.siteId" class="flex items-center">
            <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="obj.siteId" class="m-r-1 flex justify-center w-40%" />
            <span class="w-60% text-center">{{ obj.salesResponsibleName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合作状态" align="center" prop="agencyStatus" min-width="200">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_AGENCY_STATUS" :value="scope.row.agencyStatus"
            v-hasNotPermi="['crm:channel-agency:update']" />
          <el-switch v-model="scope.row.agencyStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="活跃" inactive-text="失效" @change="handleStatusChange(scope.row)"
            v-hasPermi="['crm:channel-agency:updateStatus']" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="260">
        <template #default="scope">
          <el-button link type="success" @click="openForm('createPage', 2,
            {
              id: scope.row.id,
              promotionResponsibleId: scope.row.promotionResponsibleId,
              promotionResponsibleName: scope.row.promotionResponsibleName,
              salesResponsibleId: scope.row.salesResponsibleId,
              salesResponsibleName: scope.row.salesResponsibleName,
              agencyName: scope.row.agencyName,
            }
          )" v-hasPermi="['crm:channel-page:create']">
            新建页面
          </el-button>
          <el-button link type="info" @click="toPageList(scope.row)"
            v-hasPermi="['crm:channel-page:query']">查看页面</el-button>
          <el-button link type="primary" @click="openForm('updateChannel', 2, { id: scope.row.id })"
            v-if="scope.row.id !== 1">
            {{ checkPermi(['crm:channel-agency:update']) ? '编辑' : '查看' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 外部合作 表单 -->
  <ChannelForm ref="channelFormRef" @success="getList" />
  <!-- 批量转移 -->
  <Transfer ref="transferRef" @success="getList" />
  <!-- 学员详情 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 查看完整无掩码信息 -->
  <MasklessInfoDialog ref="masklessInfoDialogRef" />
</template>

<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getAgencyCommissionRulesOptions,
  handleRemoteAgencyOptions, handleRemoteUserOptions, handleRemoteCustomerOptions,
} from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { checkPermi } from '@/utils/permission'
import { CommonStatusEnum1, CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ChannelAgencyApi, ChannelAgencyVO } from '@/api/crm/agency/agencymag/index'
import ChannelForm from '@/views/crm/channel/ChannelForm.vue'
import Transfer from './Transfer/index.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import MasklessInfoDialog from '@/views/crm/components/MasklessInfoDialog/MasklessInfoDialog.vue'

/** 代理 列表 */
defineOptions({ name: 'Agency' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const route = useRoute()
const loading = ref(true) // 列表的加载中
const list = ref<ChannelAgencyVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agencyType: undefined,
  agencyId: undefined,
  gender: undefined,
  agencyStudentId: undefined,
  countryCode: undefined,
  agencyAddress: undefined,
  ruleId: undefined,
  agencyPhone: undefined,
  agencySource: undefined,
  sourceChannel: undefined,
  agencyReferenceId: undefined,
  agencyStatus: undefined,
  promotionResponsibleId: undefined,
  salesResponsibleId: undefined,
  siteId: undefined,
  status: undefined,
  remark: undefined,
})

/* 选项列表 */
const queryOptions = reactive({
  agency: useRemoteSearch(handleRemoteAgencyOptions),
  agencyReference: useRemoteSearch(handleRemoteUserOptions),
  promotion: useRemoteSearch(handleRemoteUserOptions),
  sales: useRemoteSearch(handleRemoteUserOptions),
  customer: useRemoteSearch(handleRemoteCustomerOptions),
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.agencyStatus === CommonStatusEnum1.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.agencyName}”该外部合作吗?`)
    switch (row.agencyStatus) {
      case CommonStatusEnum1.ENABLE:
        await ChannelAgencyApi.updateChannelAgencyStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await ChannelAgencyApi.updateChannelAgencyStatus(row.id, CommonStatusEnum1.DISABLE)
        break
    }
  } catch {
    // 取消后，进行恢复按钮
    row.agencyStatus =
      row.agencyStatus === CommonStatusEnum1.ENABLE
        ? CommonStatusEnum1.DISABLE
        : CommonStatusEnum1.ENABLE
  }
}

/* 学员抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}


/* 更多筛选 */
const showMoreItems = ref('')
const showMoreFormItems = () => {
  if (!showMoreItems.value) {
    showMoreItems.value = 'more'
  } else {
    showMoreItems.value = ''
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ChannelAgencyApi.getChannelAgencyPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

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

/* 查看页面列表 */
const toPageList = (row) => {
  router.push({
    name: 'Page',
    query: {
      channelId: row.id,
      pageType: 2
    }
  })
}

/** 表单操作 */
const channelFormRef = ref()
const openForm = (type: string, channel: number, data?: object) => {
  channelFormRef.value.open(type, channel, data)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ChannelAgencyApi.exportChannelAgency(queryParams)
    download.excel(data, '代理.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 转移操作 */
const transferRef = ref()
const handleOpenTransfer = () => {
  transferRef.value.openTransfer()
}

/* 查看未脱敏数据 */
const masklessInfoDialogRef = ref()
const checkFullInfo = (type: number, agencyId: number) => {
  masklessInfoDialogRef.value.open(type, agencyId, CRM_DESENSITIZE_SOURCE.AGENCY)
}

// 初始化
onMounted(async () => {
  if (route.query.agencyId) queryParams.agencyId = Number(route.query.agencyId)
  if (route.query.agencyName) queryOptions.agency.handleSearch(route.query.agencyName)
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}

:deep(.el-card__body) {
  padding: 10px 15px;
}

:deep(.el-radio-button__inner) {
  padding-inline: 28px;
}

/* Search Form 部分样式 */
.search-form {
  .search-form-items {

    /* 减少表单元素下外边距 */
    .el-form-item {
      margin-bottom: 10px;
    }

    /* 控制 search form label 分散对齐 */
    :deep(.el-form-item label:after) {
      content: '';
      width: 100%;
    }

    :deep(.el-form-item__label) {
      display: inline-block;
      text-align: justify;
      text-align-last: justify;
      word-break: break-all;
    }

    .font-size-3 :deep(.el-form-item__label) {
      font-size: 12px;
    }

    /* 折叠 title 样式 */
    :deep(.el-form-item) {
      margin-right: 20px;
    }

    :deep(.el-collapse) {
      --el-collapse-border-color: translate;
      border: 0px;

      .el-collapse-item__header {
        height: 1px;

        .el-collapse-item__arrow {
          width: 0;
          /* margin: 0 8px; 居中显示关键 */
        }
      }

      .el-collapse-item__content {
        padding: 0;
      }

      .el-collapse-item__wrap {
        border: 0px;
      }
    }
  }

  /* 更多点击时箭头方向的的改变 */
  .arrow-up {
    transform: rotate(-180deg);
    transition: all 0.3s;
  }

  .arrow-down {
    transform: rotate(0);
    transition: all 0.3s;
  }
}

:deep(.el-tag) {
  padding: 0 4px;
}
</style>