<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="120">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-160px id">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="代理类型" prop="agencySource" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.agencySource" placeholder="请选择代理类型" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="订单类型" prop="orderType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable filterable multiple collapse-tags
              collapse-tags-tooltip :max-collapse-tags="1" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_BILLING_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="续费" prop="renewFlag" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.renewFlag" placeholder="请选择是否续费" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="参与活动" prop="activityJoinFlag" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityJoinFlag" placeholder="请选择是否参与活动" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="分次支付订单" prop="exitSplitOrderFlag" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.exitSplitOrderFlag" placeholder="请选择是否存在分次支付订单" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实际到期日" prop="originalExpiresDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.originalExpiresDate" value-format="YYYY-MM-DD" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" placeholder="请选择实际到期日" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属月份" prop="packageMonth" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.packageMonth" type="month" placeholder="请选择归属月份" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" :remote-method="queryOptions.mentor.handleSearch"
              :loading="queryOptions.mentor.loading" filterable remote clearable class="!w-240px"
              placeholder="请检索后选择Mentor">
              <el-option v-for="item in queryOptions.mentor.options" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.deptId)"
              class="!w-240px">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="拒绝续费类型" prop="refuseRenewType">
            <el-select v-model="queryParams.refuseRenewType" placeholder="请选择拒绝续费类型" clearable multiple collapse-tags
              collapse-tags-tooltip :max-collapse-tags="1" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否有效沟通" prop="isHaveEffectiveFlag">
            <el-select v-model="queryParams.isHaveEffectiveFlag" placeholder="请选择是否有效沟通" class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否拒绝" prop="isRefuse" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isRefuse" placeholder="请选择是否拒绝" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择学员站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广负责人" prop="promotionResponsibleId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.promotionResponsibleId"
              :remote-method="queryOptions.promotionResponsible.handleSearch"
              :loading="queryOptions.promotionResponsible.loading" filterable remote clearable class="!w-240px"
              placeholder="请检索后选择推广负责人">
              <el-option v-for="item in queryOptions.promotionResponsible.options" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广部门" prop="promotionResponsibleDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.promotionResponsibleDeptId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择推广部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.promotionResponsibleDeptId)"
              class="!w-240px">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广业务线" prop="promotionBusinessLineId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.promotionBusinessLineId" clearable placeholder="请选择推广业务线" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="一级渠道" prop="channelType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelType" placeholder="一级渠道" clearable filterable class="!w-240px"
              @change="queryOptions.channelType.change">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="二级渠道" prop="channelLevelTwo" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelTwo" placeholder="二级渠道" :disabled="!queryParams.channelType"
              clearable filterable class="!w-240px">
              <el-option v-for="option in queryOptions.channelLevelTwo.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="三级渠道" prop="channelLevelThree" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelThree" placeholder="三级渠道" clearable filterable
              :disabled="!queryParams.channelType" :remote="queryOptions.channelLevelThree.needRemote"
              :loading="queryOptions.channelLevelThree.loading"
              :remote-method="queryOptions.channelLevelThree.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.channelLevelThree.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="四级渠道" prop="adid" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adid" placeholder="四级渠道" clearable filterable remote
              :loading="queryOptions.page.loading" :remote-method="queryOptions.page.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.page.options" :key="option.adid" :label="option.label"
                :value="option.adid">
                <div class="flex justify-between gap-4">
                  <span>{{ option.label }}</span>
                  <span style="color: var(--el-text-color-secondary); font-size: 13px;">
                    {{ getDictLabel(DICT_TYPE.CRM_CHANNEL_TYPE, option.pageType) }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:customer-package-renew:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:customer-package-renew:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:customer-package-renew:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="primary" plain @click="pushMessage" v-hasPermi="['crm:wechat-message:push']">
          <Icon icon="fa-brands:pushed" class="mr-5px" /> 批量推送
        </el-button>
      </el-form-item>
      <Statistic :data="extendData" :loading="loading" />
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe max-height="70vh" @selection-change="handleSelectionChange"
      :row-key="row => row.id" @sort-change="handleSortChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员信息" align="center" min-width="140" fixed>
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)">
              {{ scope.row.customerName }}
            </el-button>
          </div>
          <div class="student-info font-size-2.5 c-#777">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                  {{ scope.row.customerId }}
                </el-button>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上课方式" align="center" prop="customerLessonManner" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CUSTOMER_LESSON_MANNER" :value="scope.row.customerLessonManner" />
        </template>
      </el-table-column>
      <el-table-column label="代理类型" align="center" prop="agencySource" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_AGENCY_FROM" :value="scope.row.agencySource" />
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="orderType" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_BILLING_TYPE" :value="scope.row.orderType" />
        </template>
      </el-table-column>
      <el-table-column label="实际到期日" align="center" prop="originalExpiresDate" :formatter="dateFormatterYMD"
        sortable="custom" min-width="120" />
      <el-table-column label="续费" align="center" prop="renewFlag" min-width="120">
        <template #default="scope">
          <Icon :icon="dealIcon(scope.row.renewFlag)[0]" :size="16" color="#fff"
            :style="`background-color: ${dealIcon(scope.row.renewFlag)[1]}`"
            style="padding: 4px; border-radius: 20px;" />
        </template>
      </el-table-column>
      <el-table-column label="参与活动" align="center" prop="activityJoinFlag" min-width="120">
        <template #default="scope">
          <Icon :icon="dealIcon(scope.row.activityJoinFlag)[0]" :size="16" color="#fff"
            :style="`background-color: ${dealIcon(scope.row.activityJoinFlag)[1]}`"
            style="padding: 4px; border-radius: 20px;" />
        </template>
      </el-table-column>
      <el-table-column label="分次支付订单" align="center" prop="exitSplitOrderFlag" min-width="120">
        <template #default="scope">
          <Icon :icon="dealIcon(scope.row.exitSplitOrderFlag)[0]" :size="16" color="#fff"
            :style="`background-color: ${dealIcon(scope.row.exitSplitOrderFlag)[1]}`"
            style="padding: 4px; border-radius: 20px;" />
        </template>
      </el-table-column>
      <el-table-column label="归属月份" align="center" prop="packageMonth" :formatter="dateFormatterYM" min-width="110" />
      <el-table-column label="mentor" align="center" prop="mentorName" min-width="140" />
      <el-table-column label="续费日志" align="center" min-width="140">
        <template #default="scope">
          <el-button :type="scope.row.isHaveEffectiveFlag ? 'success' : 'info'" plain
            :disabled="!scope.row.isHaveEffectiveFlag" @click="openRenewLog(scope.row.id)">
            续费日志
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="有效沟通内容" align="center" prop="effectiveContent" min-width="600">
        <template #default="{ row }">
          <div v-fold="{ text: row.effectiveContent, maxLength: 60 }" class="foldable-text"></div>
        </template>
      </el-table-column>
      <el-table-column label="拒绝续费类型" align="center" prop="refuseRenewType" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.REFUND_TYPE" :value="scope.row.refuseRenewType" />
        </template>
      </el-table-column>
      <el-table-column label="拒绝续费原因" align="center" prop="refuseReason" min-width="600">
        <template #default="{ row }">
          <div v-fold="{ text: row.refuseReason, maxLength: 60 }" class="foldable-text"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="openRenewForm(scope.row.id)">
            续费记录
          </el-button>
          <el-button link type="primary" @click="getPoster(scope.row)" v-hasPermi="['crm:poster-setting:query']"
            v-if="scope.row.orderType !== 1">
            海报
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:customer-package-renew:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员续费 表单 -->
  <RenewForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 海报 表单 -->
  <GetPosterForm ref="getPosteRef" @success="getList" />
  <!-- 续费日志 表单 -->
  <RenewLogDialog ref="renewLogDialogRef" />
</template>

<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getBoolDictOptions, customerTypeOption, getDictLabel,
  handleRemoteCustomerOptions, handleRemoteUserOptions, handleRemoteChannelActivityOptions,
  handleRemoteAgencyOptions, handleRemotePageOptions,
} from '@/utils/dict'
import { formatDate, dateFormatterYMD, dateFormatterYM } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { getRadio } from '@/utils/index'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { dealIcon, RENEW_STATISTICS_LABEL } from '@/utils/constants'
import { handleSortfields } from '@/utils/table'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { useMessageStore } from '@/store/modules/message'
import * as DeptApi from '@/api/system/dept'
import { RenewApi, RenewVO } from '@/api/crm/activity/renew'
import RenewForm from './RenewForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import GetPosterForm from '@/views/crm/customer/components/GetPosterForm.vue'
import RenewLogDialog from './RenewLogDialog.vue'

/** 学员套餐续费 列表 */
defineOptions({ name: 'Renew' })

/* 配置项 */
const { t } = useI18n()
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<RenewVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const messageStore = useMessageStore()
const extendData = ref()
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  agencySource: undefined, // 代理类型
  orderType: [], // 订单类型
  renewFlag: undefined, // 续费
  activityJoinFlag: undefined, // 参与活动
  exitSplitOrderFlag: undefined, // 分次支付订单
  originalExpiresDate: undefined, // 实际到期日
  packageMonth: formatDate(new Date(), 'YYYY-MM'), // 归属月份
  mentorId: undefined, // Mentor
  deptId: [], // deptId
  refuseRenewType: undefined, // 拒绝续费的类型
  isHaveEffectiveFlag: undefined, // 是否有效沟通
  isRefuse: undefined, // 是否拒绝
  fromArea: undefined, // 来源地区
  siteId: [], // 学员站点
  promotionResponsibleId: undefined, // 推广负责人
  promotionResponsibleDeptId: [], // 推广部门
  promotionBusinessLineId: undefined, // 推广业务线
  pageTags: undefined, // 渠道标签
  channelType: undefined, // 一级渠道
  channelLevelTwo: undefined, // 二级渠道
  channelLevelThree: undefined, // 三级渠道
  adid: undefined, // 四级渠道
  orderBy: ['']
})
const queryFormRef = ref() // 搜索的表单

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  promotionResponsible: useRemoteSearch(handleRemoteUserOptions),
  channelType: {
    change: () => {
      queryParams.channelLevelTwo = undefined
      queryParams.channelLevelThree = undefined
    },
  },
  channelActivity: useRemoteSearch(handleRemoteChannelActivityOptions, {
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelAgency: useRemoteSearch(handleRemoteAgencyOptions, {
    type: 2,
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
  }),
  channelLevelTwo: {
    options: computed(() => {
      switch (queryParams.channelType) {
        case 1:
          return getIntDictOptions(DICT_TYPE.CRM_ACTIVITY_TYPE)
        case 2:
          return getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM).filter(item => item.value !== 0)
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_SOURCE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)
      }
    }),
  },
  channelLevelThree: {
    options: computed(() => {
      switch (queryParams.channelType) {
        case 1:
          return queryOptions.channelActivity.options
        case 2:
          return queryOptions.channelAgency.options
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)
      }
    }),
    loading: computed(() => {
      switch (queryParams.channelType) {
        case 1:
          return queryOptions.channelActivity.loading
        case 2:
          return queryOptions.channelActivity.loading
      }
    }),
    handleSearch: computed(() => {
      switch (queryParams.channelType) {
        case 1:
          return queryOptions.channelActivity.handleSearch
        case 2:
          return queryOptions.channelAgency.handleSearch
      }
    }),
    needRemote: computed(() => queryParams.channelType === 1 || queryParams.channelType === 2)
  },
  page: useRemoteSearch(handleRemotePageOptions, {
    channelType: toRef(queryParams, 'channelType'),
    channelLevelTwo: toRef(queryParams, 'channelLevelTwo'),
    channelLevelThree: toRef(queryParams, 'channelLevelThree'),
  }),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/* 学员弹出框 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  if (queryParams.packageMonth) {
    queryParams.packageMonth = formatDate(queryParams.packageMonth, 'YYYY-MM-DD')
  }
  try {
    const data = await RenewApi.getCustomerPackageRenewPage(queryParams)
    list.value = data.pageData.list
    total.value = data.pageData.total
    extendData.value = Object.entries(data.extendData).map(([key, value], index) => {
      const item = {
        title: RENEW_STATISTICS_LABEL[key] || key,
        value
      }
      if (index >= 1) {
        item.percentage = total.value > 0 ? getRadio(value / total.value, 2) : getRadio(value / 1, 2)
      }
      return item
    })
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
const openRenewForm = (id: number) => {
  formRef.value.open('create', id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RenewApi.deleteCustomerPackageRenew(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
    message.error('删除失败')
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await RenewApi.exportCustomerPackageRenew(queryParams)
    download.excel(data, '学员套餐续费.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 列表选中状态变化 */
const multipleSelection = ref([])
const multiplePageData = ref({ list: [], total: 0 })
const handleSelectionChange = (val) => {
  multiplePageData.value = { list: val.map(item => ({ customerId: item.customerId, customerName: item.customerName })), total: val.length }
  multipleSelection.value = val.map(item => item.customerId)
}

/* 批量推送 */
const pushMessage = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一名学员进行推送')
  } else {
    messageStore.setType('create')
    messageStore.setLimit(8)
    messageStore.setIds(multipleSelection.value)
    messageStore.setPageData(multiplePageData.value)
    router.push({
      name: 'MessageForm',
    })
  }
}

/* 海报 */
const getPosteRef = ref()
const getPoster = (row) => {
  getPosteRef.value.open(row.customerId, row.uid, row.agencyFlag, 'renew', row.customerName)
}

/* 续费日志 */
const renewLogDialogRef = ref()
const openRenewLog = (id) => {
  renewLogDialogRef.value.open(id)
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>
<style scoped lang="scss">
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .customer {
    :deep(.el-form-item__content) {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    .type {
      :deep(.el-select__wrapper) {
        font-size: 12px;
        font-weight: 700;
        background-color: #f5f7fa;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .id {
      :deep(.el-select__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}

.foldable-text {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.5;
  text-align: left;

  &:deep(.fold-link) {
    cursor: pointer;
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>