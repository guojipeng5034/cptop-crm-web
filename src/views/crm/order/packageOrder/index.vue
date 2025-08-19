<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <!-- 订单信息 -->
      <p class="filter-label">订单信息</p>
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="订单号" prop="orderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.orderNum" placeholder="请输入订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付状态" prop="paymentStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentStatus" placeholder="请选择订单/支付单状态" clearable filterable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_PAYMENT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付类型" prop="paymentType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentType" placeholder="请选择支付类型" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_PAYMENT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('packagesSimpleType')">
          <el-form-item label="套餐大类" prop="packagesSimpleType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packagesSimpleType" placeholder="请选择套餐大类" clearable filterable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_SIMPLE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('packageId')">
          <el-form-item label="套餐" prop="packageId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packageId" placeholder="请选择套餐" clearable filterable class="!w-240px">
              <el-option v-for="dict in packageOption" :key="dict.value" :label="dict.label" :value="dict.value">
                <template #default>
                  <arco-tag v-show="dict.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="dict.hedgingTag"
                    size="small" />
                  <span class="ml-2">{{ dict.label }}</span>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('orderType')">
          <el-form-item label="订单类型" prop="orderType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_BILLING_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('orderFrequencyType')">
          <el-form-item label="订单频次" prop="orderFrequencyType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.orderFrequencyType" placeholder="请选择订单频次" clearable filterable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_FREQUENCY_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('createTime')">
          <el-form-item label="订单创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="x" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              :disabled-date="disabledAfterDate" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('fullPaymentTime')">
          <el-form-item label="全款支付时间" prop="fullPaymentTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.fullPaymentTime" value-format="x" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('remarks')">
          <el-form-item label="订单备注" prop="remarks" @keyup.enter="handleQuery">
            <el-input v-model.trim="queryParams.remarks" clearable placeholder="请输入订单备注" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" :class="getColumnClass('refundStatus')">
          <el-form-item label="退款类型" prop="refundStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.refundStatus" placeholder="请选择退款类型" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_REFUND_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 支付单信息 -->
      <p class="filter-label" :class="getColumnClass('b1')">支付单信息</p>
      <el-row :class="getColumnClass('b2')">
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付单号" prop="paymentOrderNum" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.paymentOrderNum" placeholder="请输入支付单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付方式" prop="paymentMethod" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentMethod" placeholder="请选择支付方式" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PAYMENT_LIST)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付时间" prop="paymentTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.paymentTime" type="daterange" start-placeholder="开始时间"
              end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="YYYY-MM-DD"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" value-format="x"
              :disabled-date="disabledAfterDate" :value-on-clear="() => undefined" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实收货币商户" prop="paymentMerchantId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.paymentMerchantId" placeholder="请选择实收货币商户" clearable filterable remote
              multiple :loading="merchantOptionsLoading" :remote-method="fetchRemoteMerchantOptions" class="!w-240px">
              <el-option v-for="dict in merchantOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Responsible" prop="responsibleId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                Responsible
              </el-tooltip>
            </template>
            <el-select placeholder="请检索后选择Responsible" v-model="queryParams.responsibleId" clearable filterable remote
              :loading="responsibleOptionsLoading" :remote-method="fetchRemoteResponsibleOptions" class="!w-240px">
              <el-option v-for="dict in responsibleOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属部门" prop="responsibleDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.responsibleDeptId" multiple filterable clearable :data="deptList"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择Responsible归属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.responsibleDeptId)"
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
          <el-form-item label="审核方式" prop="orderAuditType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.orderAuditType" placeholder="请选择审核方式" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_AUDIT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="支付单备注" prop="paymentRemarks" @keyup.enter="handleQuery">
            <el-input v-model.trim="queryParams.paymentRemarks" clearable placeholder="请输入支付单备注" class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 学员信息 -->
      <p class="filter-label" :class="getColumnClass('c1')">学员信息</p>
      <el-row :class="getColumnClass('c2')">
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
            <el-select v-model="customerType" placeholder="类型" class="!w-80px type">
              <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
            <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-160px id">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="mentorId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                Mentor
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="mentorOptionsLoading"
              :remote-method="fetchRemoteMentorOptions" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="item in mentorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="deptList"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="2" show-checkbox default-expand-all
              placeholder="请选择归属部门" node-key="id"
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
          <el-form-item label="转介绍Mentor" prop="referrerMentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.referrerMentorId" clearable filterable remote
              :loading="referrerMentorOptionsLoading" :remote-method="fetchRemoteReferrerMentorOptions"
              placeholder="请检索后选择转介绍Mentor" class="!w-240px">
              <el-option v-for="item in referrerMentorOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="注册时间" prop="customerCreateTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.customerCreateTime" type="daterange" start-placeholder="开始时间"
              end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="YYYY-MM-DD"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" value-format="x"
              :disabled-date="disabledAfterDate" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="promotionResponsibleId" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                推广负责人
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.promotionResponsibleId" clearable filterable remote
              :loading="promotionResponsibleOptionsLoading" :remote-method="fetchRemotePromotionResponsibleOptions"
              placeholder="请检索后选择推广负责人" class="!w-240px">
              <el-option v-for="item in promotionResponsibleOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推广部门" prop="promotionResponsibleDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.promotionResponsibleDeptId" multiple filterable clearable
              :data="deptList" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox
              default-expand-all placeholder="请选择推广部门" node-key="id"
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
          <el-form-item label="渠道标签" prop="pageTags" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.pageTags" placeholder="请选择渠道标签" clearable filterable remote
              :loading="pageTagOptionsLoading" :remote-method="fetchRemotePageTagOptions" class="!w-240px">
              <el-option v-for="dict in pageTagOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="一级渠道" prop="channelType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelType" placeholder="一级渠道" clearable filterable class="!w-240px"
              @change="changeChannelType">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="二级渠道" prop="channelLevelTwo" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelTwo" placeholder="二级渠道" :disabled="!queryParams.channelType"
              clearable filterable class="!w-240px">
              <el-option v-for="dict in channelLevelTwoOption" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="三级渠道" prop="channelLevelThree" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.channelLevelThree" placeholder="三级渠道"
              :disabled="queryParams.channelType === undefined" clearable :remote="needRemote"
              :loading="channelLevelThreeOptionLoading" :remote-method="fetchRemoteChannelLevelThreeOptions" filterable
              class="!w-240px">
              <el-option v-for="dict in channelLevelThreeOption" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="四级渠道" prop="adid" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.adid" placeholder="四级渠道" clearable filterable remote
              :loading="pageOptionsLoading" :remote-method="fetchRemotePageOptions" class="!w-240px">
              <el-option v-for="item in pageOptions" :key="item.adid" :label="item.label" :value="item.adid">
                <div class="flex justify-between gap-4">
                  <span>{{ item.label }}</span>
                  <span style="
                        color: var(--el-text-color-secondary);
                        font-size: 13px;
                      ">
                    {{ getDictLabel(DICT_TYPE.CRM_CHANNEL_TYPE, item.pageType) }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 代理信息 -->
      <p class="filter-label" :class="getColumnClass('d1')">代理信息</p>
      <el-row :class="getColumnClass('d2')">
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="代理" prop="agencyId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
              :loading="agencyOptionsLoading" :remote-method="fetchRemoteAgencyOptions" class="!w-240px">
              <el-option v-for="dict in agencyOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
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
          <el-form-item label="合作模式" prop="agencyType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.agencyType" clearable placeholder="请选择合作模式" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_EXTERNAL_COOPERATION_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:order:package:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:order:package:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button @click="handleQueryParams" link type="primary">
          {{ isExpanded ? '收起' : '展开' }}
          <Icon :icon="isExpanded ? 'ep:arrow-up' : 'ep:arrow-down'" class="ml-2px" />
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 统计工作栏 -->
  <ContentWrap>
    <Statistic :data="extendData" :loading="loading" class="m-b-0!" />
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="m-b-5">
      <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:order:package:create']">
        <Icon icon="ep:plus" class="mr-5px" /> 新增
      </el-button>
      <el-button type="success" plain @click="handleExport" :loading="exportLoading"
        v-hasPermi="['crm:order:package:export']">
        <Icon icon="ep:download" class="mr-5px" /> 导出
      </el-button>
      <el-button type="warning" plain @click="expandAllRows">全部展开</el-button>
      <el-button type="warning" plain @click="collapseAllRows">全部收起</el-button>
    </div>
    <el-table ref="tableRef" v-loading="loading" :data="list" stripe border max-height="70vh"
      :row-key="(row) => row.orderNum" class="data-table">
      <el-table-column type="expand" fixed>
        <template #default="expandProps">
          <div class="sub-table ml-12">
            <el-scrollbar class="w-78vw">
              <el-table :data="expandProps.row.payments" :header-cell-style="{ backgroundColor: '#f0eeff' }"
                :row-style="{ backgroundColor: '#f8f8ff' }">
                <el-table-column label="支付单号" align="center" min-width="200" fixed>
                  <template #default="paymentNumScope">
                    <el-tooltip effect="light" content="点击复制" placement="top">
                      <el-button link type="primary" @click="handleCopy">
                        {{ paymentNumScope.row.paymentOrderNum }}
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="支付方式" align="center" min-width="115">
                  <template #default="scope">
                    <arco-tag :type="DICT_TYPE.CRM_PAYMENT_LIST" :value="scope.row.paymentMerchantType" />
                  </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="paymentStatus" align="center" min-width="95">
                  <template #default="scope">
                    <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="scope.row.paymentStatus" />
                  </template>
                </el-table-column>
                <el-table-column label="实收货币" prop="paymentCurrencyType" align="center" min-width="95">
                  <template #default="scope">
                    <arco-tag :type="DICT_TYPE.ORDER_PAYMENT_CURRENCY" :value="scope.row.paymentCurrencyType" />
                  </template>
                </el-table-column>
                <el-table-column label="实收货币金额" prop="actualAmount" align="center" min-width="120"
                  :formatter="roundToTwoDecimals" />
                <el-table-column label="实收人民币" prop="amount" align="center" min-width="120"
                  :formatter="roundToTwoDecimals" />
                <el-table-column label="实收货币商户" prop="paymentMerchantName" align="center" min-width="140" />
                <el-table-column label="已退金额" prop="refundActualAmount" align="center" min-width="110"
                  :formatter="roundToTwoDecimals" />
                <el-table-column label="Responsible" align="center" prop="responsibleName" min-width="180">
                  <template #default="scope">
                    <div class="flex justify-center items-center gap-1"
                      v-if="checkPermi(['crm:order:paymentRecord:update'])">
                      <span>{{ scope.row.responsibleName }}</span>
                      <el-button v-show="scope.row.responsibleName" type="primary" link :icon="Edit"
                        @click="switchResponsible(expandProps.row.customerId, scope.row)" />
                    </div>
                    <div v-else>
                      <span>{{ scope.row.responsibleName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Responsible归属部门" align="center" prop="responsibleDeptName" min-width="180" />
                <el-table-column label="创建人" align="center" prop="creatorName" min-width="180" />
                <el-table-column label="创建时间" prop="createTime" align="center" min-width="120"
                  :formatter="dateFormatterYMDHm" />
                <el-table-column label="支付时间" prop="paymentTime" align="center" min-width="120"
                  :formatter="dateFormatterYMDHm" />
                <el-table-column label="审核方式" prop="orderAuditType" align="center" min-width="110">
                  <template #default="scope">
                    <arco-tag :type="DICT_TYPE.ORDER_AUDIT_TYPE" :value="scope.row.orderAuditType" />
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="paymentRemark" align="center" min-width="200" />
                <el-table-column label="操作" align="center" fixed="right"
                  v-hasPermi="['crm:order:package:update_order_status']" min-width="200">
                  <template #default="scope">
                    <!-- 订单支付状态为 "等待支付" 的时候，显示支付详情按钮 -->
                    <el-button
                      v-if="scope.row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.WAIT_PAY && scope.row.orderAuditType === 1"
                      type="primary" size="small" @click="openForm('view', scope.row.id)">
                      支付详情
                    </el-button>
                    <!-- 订单支付状态为 pending 的时候，显示审核按钮 -->
                    <el-button
                      v-else-if="scope.row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING && scope.row.orderAuditType === 0"
                      type="danger" size="small" @click="openAuditOrderForm(scope.row.id, 'create')"
                      v-hasPermi="['crm:order:package:update_order_status']">
                      审核
                    </el-button>
                    <el-button
                      v-else-if="scope.row.paymentStatus !== CRM_ORDER_PAYMENT_STATUS.PENDING && scope.row.orderAuditType === 0"
                      type="primary" size="small" @click="openAuditOrderForm(scope.row.id, 'info')"
                      v-hasPermi="['crm:order:package:update_order_status']">
                      审核详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </template>
      </el-table-column>

      <!-- 订单信息 -->
      <el-table-column label="序号" align="center" width="60" fixed>
        <template #default="scope">
          <div>{{ calculateTableOrderNum(scope.$index, queryParams.pageSize, queryParams.pageNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="学员信息" align="center" min-width="160" fixed>
        <template #default="scope">
          <div>
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
              v-truncate="10">
              {{ scope.row.customerName }}
            </el-button>
          </div>
          <span v-if="scope.row.customerId" class="!font-size-3">学号: </span>
          <el-tooltip effect="light" content="点击复制" placement="right">
            <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
              {{ scope.row.customerId }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" min-width="200">
        <template #default="scope">
          <el-tooltip effect="light" content="点击复制" placement="top">
            <el-button link type="primary" @click="handleCopy">
              {{ scope.row.orderNum }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" prop="paymentStatus" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_STATUS" :value="scope.row.paymentStatus" :size="'small'" />
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center" prop="paymentType" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_PAYMENT_TYPE" :value="scope.row.paymentType" :size="'small'" />
        </template>
      </el-table-column>
      <el-table-column label="套餐大类" align="center" prop="packagesSimpleType" min-width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.PACKAGES_SIMPLE_TYPE" :value="scope.row.packagesSimpleType" />
        </template>
      </el-table-column>
      <el-table-column label="套餐名称" header-align="center" align="left" prop="packageName" min-width="240"
        show-overflow-tooltip>
        <template #default="{ row }">
          <arco-tag v-show="row.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="row.hedgingTag"
            size="small" />
          <span class="ml-1">{{ row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单原价" align="center" prop="totalAmount" min-width="100" :formatter="roundToTwoDecimals" />
      <el-table-column label="优惠金额" align="center" prop="discountAmount" min-width="100">
        <template #default="scope">
          <el-button link type="warning" @click="toCouponList(scope.row.customerId, scope.row.orderNum)">
            {{ scope.row.discountAmount !== 0 ? scope.row.discountAmount.toFixed(2) : scope.row.discountAmount }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="应付金额" align="center" prop="payableAmount" min-width="100"
        :formatter="roundToTwoDecimals" />
      <el-table-column label="实付金额" align="center" prop="actualAmount" min-width="100"
        :formatter="roundToTwoDecimals" />
      <el-table-column label="退款金额" align="center" prop="actualRefundAmount" min-width="100"
        :formatter="roundToTwoDecimals" />
      <el-table-column label="订单类型" align="center" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_BILLING_TYPE" :value="scope.row.orderType" :size="'small'" />
        </template>
      </el-table-column>
      <el-table-column label="订单频次" align="center" prop="orderFrequencyType" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ORDER_FREQUENCY_TYPE" :value="scope.row.orderFrequencyType" :size="'small'" />
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm"
        min-width="110" />
      <el-table-column label="创建人" align="center" prop="creatorName" min-width="110" :formatter="formatEmptyValue" />
      <el-table-column label="创建人部门" align="center" prop="deptName" min-width="110" :formatter="formatEmptyValue" />
      <el-table-column label="全款支付时间" align="center" prop="fullPaymentTime" :formatter="dateFormatterYMDHm"
        min-width="110" />
      <el-table-column label="订单备注" align="center" prop="remarks" min-width="200">
        <template #default="scope">
          <span v-for="item in scope.row.payments" :key="item.id">
            <span v-if="item.paymentRemark">{{ item.paymentRemark }};</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="退款类型" align="center" prop="orderRefundStatus" min-width="110">
        <template #default="scope">
          <el-button link
            :type="scope.row.orderRefundStatus === 1 ? 'success' : scope.row.orderRefundStatus === 2 ? 'warning' : 'danger'"
            @click="toRefundList(scope.row.orderNum)">
            {{ getLabelByValue(scope.row.orderRefundStatus, getIntDictOptions(DICT_TYPE.ORDER_REFUND_STATUS)) }}
          </el-button>
        </template>
      </el-table-column>

      <!-- 赠品信息 -->
      <el-table-column label="课时点" align="center" prop="awardQqePointsNum" min-width="70" />
      <el-table-column label="积分" align="center" prop="awardPointsNum" min-width="70" />
      <el-table-column label="次卡" align="center" prop="awardTicketNum" min-width="70" />
      <el-table-column label="书籍类型" align="center" prop="awardBookType" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE" :value="scope.row.awardBookType" :size="'small'" />
        </template>
      </el-table-column>

      <!-- 学员信息 -->
      <el-table-column label="Mentor" align="center" prop="mentorName" :formatter="formatEmptyValue" min-width="110" />
      <el-table-column label="Mentor归属部门" align="center" prop="mentorDeptName" :formatter="formatEmptyValue"
        min-width="150" />
      <el-table-column label="注册时间" align="center" prop="customerCreateTime" :formatter="dateFormatterYMDHm"
        min-width="110" />
      <el-table-column label="FTL次数" align="center" prop="ftlCompleteCount" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_CUSTOMER_FTL_NUM" :value="scope.row.ftlCompleteCount" :size="'small'" />
        </template>
      </el-table-column>
      <el-table-column label="推广负责人" align="center" prop="promotionResponsibleName" :formatter="formatEmptyValue"
        min-width="150" />
      <el-table-column label="推广部门" align="center" prop="promotionResponsibleDeptName" :formatter="formatEmptyValue"
        min-width="150" />
      <el-table-column label="推广业务线" align="center" prop="promotionBusinessLineId" min-width="150">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES" :value="scope.row.promotionBusinessLineId" />
        </template>
      </el-table-column>
      <el-table-column label="渠道标签" align="center" prop="pageTagNames" min-width="150">
        <template #default="scope">
          <el-tag v-for="item in scope.row.pageTagNames" :key="item" type="primary">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="一级渠道" align="center" prop="pageType" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_CHANNEL_TYPE" :value="scope.row.pageType" />
        </template>
      </el-table-column>
      <el-table-column label="二级渠道" align="center" prop="channelLevelTwo" min-width="180" />
      <el-table-column label="三级渠道" align="center" prop="channelLevelThree" min-width="180" />
      <el-table-column label="四级渠道" align="center" prop="adid" min-width="180" />

      <!-- 代理信息 -->
      <el-table-column label="代理商姓名" align="center" prop="agencyName" min-width="180" :formatter="formatEmptyValue" />
      <el-table-column label="代理类型" align="center" prop="agencySource" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_AGENCY_FROM" :value="scope.row.agencySource" />
        </template>
      </el-table-column>
      <el-table-column label="合作模式" align="center" prop="agencyType" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_EXTERNAL_COOPERATION_TYPE" :value="scope.row.agencyType" />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button link type="primary" size="small" @click="goToQQE(null, scope.row.customerId)"
              v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
              QQE
            </el-button>
            <el-button v-if="showPayBalanceBtn(scope.row)" link type="danger" size="large" class="final-payment"
              @click="openForm('payBalance', scope.row.id, scope.row.customerName, scope.row.customerId)"
              v-hasPermi="['crm:order:package:create_pay_order_again']">
              支付尾款
            </el-button>
            <el-dropdown @command="(command) => handleCommand(command, scope.row)"
              v-if="hadPaidPartOrAll(scope.row) || showSwitchPackageBtn(scope.row)"
              v-hasPermi="['crm:order:package:update', 'crm:refund-record:create', 'crm:E-contract:create']">
              <el-button type="primary" link size="small">
                更多
                <Icon icon="ep:d-arrow-right" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="hadPaidPartOrAll(scope.row) && checkPermi(['crm:order:package:update'])"
                    command="handleGift">
                    <Icon icon="la:gifts" /> 赠品
                  </el-dropdown-item>
                  <el-dropdown-item v-if="showRefundBtn(scope.row) && checkPermi(['crm:refund-record:create'])"
                    command="handleRefound">
                    <Icon icon="mingcute:refund-cny-line" /> 退费
                  </el-dropdown-item>
                  <el-dropdown-item v-if="hadPaidAll(scope.row) && checkPermi(['crm:E-contract:create'])"
                    command="handleContract">
                    <Icon icon="ep:chat-dot-round" /> 合同
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="showSwitchPackageBtn(scope.row) && checkPermi(['crm:order:package:update:package:type'])"
                    command="handleChangePackage">
                    <Icon icon="icon-park-outline:change" /> 更换套餐
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button link type="warning" size="small" class="!ml-1" @click="handleChangeOrderType(scope.row)"
              v-hasPermi="['crm:order:package:update:package:type', 'crm:order:package:get:order:type']">
              <Icon icon="icon-park-outline:change" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 套餐订单 表单 -->
  <PackageOrderForm ref="formRef" @success="getList" @query="handleQueryOrder" @to-pay-balance="toPayBalance" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 赠品 表单 -->
  <PresentForm ref="presentFormRef" @success="getList" />
  <!-- 退款 表单 -->
  <RefundLogDialog ref="refundLogDialogRef" />
  <!-- 电子合同 表单 -->
  <ContractForm ref="contractFormRef" @success="getList" />
  <!-- 审核 payment 表单 -->
  <AuditOrderForm ref="auditOrderFormRef" @success="getList" />
  <!-- 更换套餐 表单 -->
  <ChangePackageForm ref="changePackageFormRef" @success="getList" />
  <!-- 更换套餐 表单 -->
  <ChangeOrderTypeForm ref="changeOrderTypeFormRef" @success="getList" />
  <!-- 更换 Responsible 表单 -->
  <SwitchResponsibleForm ref="switchResponsibleFormRef" @success="getList" />
</template>

<script setup lang="ts">
/* utils */
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getPackagesOptions,
  getChannelNameOptions, customerTypeOption, getDictLabel, getLabelByValue,
  handleRemoteUserOptions, handleRemoteCustomerOptions, handleRemotePageOptions, handleRemotePageTagOptions,
  handleRemoteChannelActivityOptions, handleRemoteAgencyOptions, handleRemoteMechantOptions
} from '@/utils/dict'
import { Edit } from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css'
import { useBreakpoints } from '@vueuse/core'
import { dateFormatterYMDHm, disabledAfterDate } from '@/utils/formatTime'
import { roundToTwoDecimals } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { isEmpty } from '@/utils/is'
import { goToQQE } from '@/utils/navigation'
import { ORDER_STATISTICS_LABEL } from '@/utils/constants'
import { checkPermi, checkRole } from '@/utils/permission'
import { calculateTableOrderNum, formatEmptyValue } from '@/utils/table'
import { useUserStore } from '@/store/modules/user'
import { CRM_ORDER_PAYMENT_STATUS, CRM_ORDER_PAYMENT_TYPE, ORDER_REFUND_STATUS } from '@/utils/constants'
// import { shouldFetchStatistics } from '@/utils/pageStatistic'
/* api */
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'
import { CustomerApi } from '@/api/crm/customer/base'
import * as DeptApi from '@/api/system/dept'
/* view */
import PackageOrderForm from './PackageOrderForm.vue'
import PresentForm from '@/views/crm/order/packageOrder/PresentForm.vue'
import RefundLogDialog from '@/views/crm/order/packageOrder/RefundLogDialog.vue'
import ContractForm from '@/views/crm/order/packageOrder/ContractForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import AuditOrderForm from './AuditOrderForm.vue'
import ChangePackageForm from './ChangePackageForm.vue'
import ChangeOrderTypeForm from './ChangeOrderTypeForm.vue'
import SwitchResponsibleForm from './SwitchResponsibleForm.vue'

/** 套餐订单 列表 */
defineOptions({ name: 'PackageOrder' })

/* 配置项 */
const route = useRoute() // 当前路由
const message = useMessage() // 消息弹窗
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const loading = ref(true) // 列表的加载中
const list = ref<PackageOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const extendData = ref()
const userStore = useUserStore()

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  // 订单信息
  orderNum: undefined, // 订单号
  paymentStatus: undefined, // 支付状态
  paymentType: undefined, // 支付类型
  packagesSimpleType: undefined, // 套餐大类
  packageId: undefined, // 套餐
  orderType: undefined, // 订单类型
  orderFrequencyType: undefined, // 订单频次
  createTime: undefined, // 订单创建时间
  fullPaymentTime: undefined, // 全款支付时间
  remarks: undefined, // 订单备注
  refundStatus: undefined, // 退款类型

  // 支付单信息
  paymentOrderNum: undefined, // 支付单号
  paymentMethod: undefined, // 支付方式
  paymentTime: undefined, // 支付时间
  paymentMerchantId: undefined, // 实收货币商户
  responsibleId: undefined, // Responsible
  responsibleDeptId: undefined, // Responsible归属部门
  orderAuditType: undefined, // 审核方式
  paymentRemarks: undefined, // 支付单备注

  // 学员信息
  customerId: undefined, // 学员
  mentorId: undefined, // Mentor
  deptId: undefined, // Mentor部门
  referrerMentorId: undefined, // 转介绍人Mentor
  customerCreateTime: undefined, // 注册时间
  promotionResponsibleId: undefined, // 推广负责人
  promotionResponsibleDeptId: undefined, // 推广部门
  promotionBusinessLineId: undefined, // 推广业务线
  pageTags: undefined, // 渠道标签
  channelType: undefined, // 一级渠道
  channelLevelTwo: undefined, // 二级渠道
  channelLevelThree: undefined, // 三级渠道
  adid: undefined, // 四级渠道

  // 代理信息
  agencyId: undefined, // 代理
  agencySource: undefined, // 代理来源
  agencyType: undefined, // 代理类型
})

/** options */
// 1.customer
const customerType = ref(1)
watch(customerType, () => { queryParams.customerId = undefined })

const customerOptions = ref([])
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading, customerType.value)
}

// 2.mentor
const mentorOptions = ref([])
const mentorOptionsLoading = ref(false)
const fetchRemoteMentorOptions = async (query) => {
  const setUserOptions = (newValue) => (mentorOptions.value = newValue)
  const setUserLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 2.referrerMentor
const referrerMentorOptions = ref([])
const referrerMentorOptionsLoading = ref(false)
const fetchRemoteReferrerMentorOptions = async (query) => {
  const setUserOptions = (newValue) => (referrerMentorOptions.value = newValue)
  const setUserLoading = (newValue) => (referrerMentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.responsible
const responsibleOptions = ref([])
const responsibleOptionsLoading = ref(false)
const fetchRemoteResponsibleOptions = async (query) => {
  const setUserOptions = (newValue) => (responsibleOptions.value = newValue)
  const setUserLoading = (newValue) => (responsibleOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 4.merchant
const merchantOptions = ref()
const merchantOptionsLoading = ref(false)
const fetchRemoteMerchantOptions = async (query) => {
  const setMerchantOptions = (newValue) => (merchantOptions.value = newValue)
  const setMerchantLoading = (newValue) => (merchantOptionsLoading.value = newValue)
  await handleRemoteMechantOptions(query.trim(), setMerchantOptions, setMerchantLoading)
}

// 5.promotionResponsible
const promotionResponsibleOptions = ref([])
const promotionResponsibleOptionsLoading = ref(false)
const fetchRemotePromotionResponsibleOptions = async (query) => {
  const setUserOptions = (newValue) => (promotionResponsibleOptions.value = newValue)
  const setUserLoading = (newValue) => (promotionResponsibleOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 6.package
const packageOption = ref()

// 7.channelName
const channelNameOptions = ref()

// 9.deptId
const deptList = ref()

// 10.agency
const agencyOptions = ref([])
const agencyOptionsLoading = ref(false)
const fetchRemoteAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (agencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (agencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query.trim(), setAgencyOptions, setAgencyLoading)
}

// 11.channelActivity
const channelActivityOptions = ref([])
const channelActivityOptionsLoading = ref(false)
const fetchRemoteChannelActivityOptions = async (query) => {
  const setActivityOptions = (newValue) => (channelActivityOptions.value = newValue)
  const setActivityLoading = (newValue) => (channelActivityOptionsLoading.value = newValue)
  await handleRemoteChannelActivityOptions(query.trim(), setActivityOptions, setActivityLoading, queryParams.channelLevelTwo)
}

// 12.channelAgency
const channelAgencyOptions = ref([])
const channelAgencyOptionsLoading = ref(false)
const fetchRemoteChannelAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (channelAgencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (channelAgencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query.trim(), setAgencyOptions, setAgencyLoading, 2, queryParams.channelLevelTwo)
}

// 13.page
const pageOptionsLoading = ref(false)
const pageOptions = ref([])
const fetchRemotePageOptions = async (query) => {
  const setPageOptions = (newValue) => (pageOptions.value = newValue)
  const setPageLoading = (newValue) => (pageOptionsLoading.value = newValue)
  await handleRemotePageOptions(query.trim(), setPageOptions, setPageLoading, queryParams.channelType, queryParams.channelLevelTwo, queryParams.channelLevelThree)
}

// 更改一级渠道
const changeChannelType = () => {
  queryParams.channelLevelTwo = undefined
  queryParams.channelLevelThree = undefined
}

// 14.channelLevelTwo
const channelLevelTwoOption = computed(() => {
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
})

// 15.channelLevelThree
const needRemote = computed(() => queryParams.channelType === 1 || queryParams.channelType === 2)
const channelLevelThreeOption = computed(() => {
  switch (queryParams.channelType) {
    case 1:
      return channelActivityOptions.value
    case 2:
      return channelAgencyOptions.value
    case 3:
      return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)
    case 4:
      return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)
    case 5:
      return getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)
  }
})
const channelLevelThreeOptionLoading = computed(() => {
  switch (queryParams.channelType) {
    case 1:
      return channelActivityOptionsLoading.value
    case 2:
      return channelAgencyOptionsLoading.value
  }
})
const fetchRemoteChannelLevelThreeOptions = computed(() => {
  switch (queryParams.channelType) {
    case 1:
      return fetchRemoteChannelActivityOptions
    case 2:
      return fetchRemoteChannelAgencyOptions
  }
})

// 16.pageTags
const pageTagOptions = ref()
const pageTagOptionsLoading = ref(false)
const fetchRemotePageTagOptions = async (query) => {
  const setPageTagOptions = (newValue) => (pageTagOptions.value = newValue)
  const setPageTagLoading = (newValue) => (pageTagOptionsLoading.value = newValue)
  await handleRemotePageTagOptions(query.trim(), setPageTagOptions, setPageTagLoading)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 判断是否需要获取统计数据    
    const statistics = await PackageOrderApi.getPageStatistics(queryParams)
    extendData.value = Object.entries(statistics).map(([key, value]) => ({
      title: ORDER_STATISTICS_LABEL[key] || key,
      value,
    }))

    const data = await PackageOrderApi.getPackageOrderPage(queryParams)
    if (!isEmpty(data)) {
      list.value = data.list
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/* 搜索学员的已付部分订单 */
const handleQueryOrder = async (customerId: number) => {
  Object.assign(queryParams, {
    customerId: customerId,
    paymentStatus: 4,
    pageNo: 1
  })
  await Promise.all([
    fetchRemoteCustomerOptions(String(customerId)),
    getList()
  ])
}

/* 跳转到尾款支付页面 */
const toPayBalance = async (customerId: number, orderId: number) => {
  const customerInfo = await CustomerApi.getCustomer(customerId)
  openForm('payBalance', orderId, customerInfo.name, customerId)
}

/* 跳转代理列表 */
const toAgencyList = (id: number, name: string) => {
  router.push({
    name: 'Agency',
    query: {
      agencyId: id,
      agencyName: name,
    }
  })
}

/* 跳转学员优惠券列表 */
const toCouponList = (customerId: number, orderNum: string) => {
  router.push({
    name: 'CustomerCoupon',
    query: {
      customerId,
      orderNum,
    }
  })
}

/* 跳转退款列表 */
const toRefundList = (orderNum: string) => {
  router.push({
    name: 'OrderRefund',
    query: {
      orderNum,
    }
  })
}

/** 重置按钮操作 */
const resetQuery = async () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, name?: string, customerId?: number) => {
  formRef.value.open(type, id, name, customerId)
}

/* 全部展开 / 收起 */
const tableRef = ref()
const expandAllRows = () => {
  list.value.forEach((row) => {
    tableRef.value.toggleRowExpansion(row, true)
  })
}
const collapseAllRows = () => {
  list.value.forEach((row) => {
    tableRef.value.toggleRowExpansion(row, false)
  })
}

/* 搜索条件展开/隐藏 */
const breakpoints = useBreakpoints({
  xs: 0,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
})
const currentScreenSize = computed(() => {
  if (breakpoints.greaterOrEqual('xl').value) return 'xl'
  if (breakpoints.greaterOrEqual('lg').value) return 'lg'
  if (breakpoints.greaterOrEqual('md').value) return 'md'
  if (breakpoints.greaterOrEqual('sm').value) return 'sm'
  return 'xs'
})

const hideConfig = {
  'xl': ['fullPaymentTime', 'remarks', 'refundStatus', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'],
  'lg': ['orderFrequencyType', 'createTime', 'fullPaymentTime', 'remarks', 'refundStatus', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'],
  'md': ['packagesSimpleType', 'packageId', 'orderFrequencyType', 'createTime', 'fullPaymentTime', 'remarks', 'refundStatus', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2']
}

const isExpanded = ref(false)
const handleQueryParams = () => {
  isExpanded.value = !isExpanded.value
}

// 获取指定列的class
const getColumnClass = (columnName) => {
  if (isExpanded.value) return ''
  // 查找当前尺寸下需要隐藏的列
  const hiddenColumns = hideConfig[currentScreenSize.value] || []
  // 如果当前列在当前尺寸下需要隐藏
  if (hiddenColumns.includes(columnName)) {
    return `hidden-${currentScreenSize.value}-only`
  }
  return ''
}

/* 列表操作按钮显示计算属性 */
// 支付尾款
const showPayBalanceBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  const { paymentStatus, paymentType, orderRefundStatus } = row
  return (paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING || paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART) &&
    (paymentType === CRM_ORDER_PAYMENT_TYPE.INSTALLMENTS &&
      orderRefundStatus !== ORDER_REFUND_STATUS.ALL_REFUND)
})

// 更换 Responsible
const isSaleManagerOrSuperAdmin = computed(() => checkRole(['销售经理', 'super_admin'])) // 当前登录用户是否为销售经理或者super-admin （销售经理、super-admin 角色可更换非自己名下的responsible
const showSwitchResponsibleBtn = computed(() => (orderRow, paymentRow) => {
  // order订单类型是否为 New
  const isNewOrder = orderRow.orderType === 1 // 1: New
  // payment支付状态是否为已付全款
  const isPaymentPaidAll = paymentRow.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
  // payment的 Responsible 是否不为空
  const isPaymentResponsibleNotEmpty = !isEmpty(paymentRow.responsible)
  // 登录人是否为 responsible
  const isLoginUserResponsible = paymentRow.responsibleId === userStore.user.id

  return (isNewOrder || isSaleManagerOrSuperAdmin.value) && isPaymentPaidAll && isPaymentResponsibleNotEmpty && (isLoginUserResponsible || isSaleManagerOrSuperAdmin.value)
})

// 已支付：已付全款或者已付部分
const hadPaidPartOrAll = computed(() => (row) => {
  if (isEmpty(row)) return false
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
})

// 已付全款
const hadPaidAll = computed(() => (row) => {
  if (isEmpty(row)) return false
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
})

// 展示更换套餐按钮
const showSwitchPackageBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  // 订单状态为pending，但是 order.payments 中存在 已付全款 状态的 payment 订单，也需要显示
  let hadPaymentPaidAll = false

  if (!isEmpty(row.payments) && row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PENDING) {
    if (row.payments.find((item) => item.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL)) {
      hadPaymentPaidAll = true
    }
  }
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || hadPaymentPaidAll
})

// 退费按钮
const showRefundBtn = computed(() => (row) => {
  if (isEmpty(row)) return false
  return row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_PART || row.paymentStatus === CRM_ORDER_PAYMENT_STATUS.PAY_ALL
})

/* 审核操作 */
const auditOrderFormRef = ref()
const openAuditOrderForm = (id: number, type?: string) => {
  auditOrderFormRef.value.open(id, type)
}

/* 更换 Responsible */
const switchResponsibleFormRef = ref(null)
const switchResponsibleBtnLoading = ref({})
const switchResponsible = async (customerId, paymentRow) => {
  const paymentId = paymentRow.id
  try {
    // 对应按钮loading状态
    switchResponsibleBtnLoading.value[paymentId] = true
    // 判断当前登录用户是否为销售经理，销售经理角色可更换非自己名下的responsible
    if (!isSaleManagerOrSuperAdmin.value) {
      // 查询是否存在非 New 订单
      const canSwitchResponsible = await PackageOrderApi.getIsCanChangeResponsibleByCustomerId(customerId)
      if (!canSwitchResponsible) {
        await message.confirm('该学员存在非 New 订单，无法更换 Responsible')
        return
      }
    }
    // 打开更换 responsible 表单
    switchResponsibleFormRef.value.open(paymentRow, customerId)
  } catch (error) {
    console.error('更换Responsible', error)
  } finally {
    // 对应按钮loading状态
    switchResponsibleBtnLoading.value[paymentId] = false
  }
}

/** 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/* 赠品表单 */
const presentFormRef = ref()
const handleGift = (row) => {
  const { id, customerId, awardPointsNum, awardTicketNum, awardQqePointsNum, awardBookType, orderType } = row
  const presentFormData = { orderId: id, customerId, awardPointsNum, awardTicketNum, awardQqePointsNum, awardBookType, orderType }
  presentFormRef.value.open(presentFormData)

}

/* 退款表单 */
const refundLogDialogRef = ref()
const handleRefound = (row: object) => {
  refundLogDialogRef.value.open(row)
}

/* 变更套餐 */
const changePackageFormRef = ref()
const handleChangePackage = (row: object) => {
  changePackageFormRef.value.open(row)
}

/* 变更订单类型 */
const changeOrderTypeFormRef = ref()
const handleChangeOrderType = (row: object) => {
  changeOrderTypeFormRef.value.open(row)
}

/* 合同表单 */
const contractFormRef = ref()
const handleContract = (row: object) => {
  contractFormRef.value.open(row)
}

/** 操作分发 */
const handleCommand = (command: string, row: PackageOrderVO) => {
  switch (command) {
    case 'handleRefound':
      handleRefound(row)
      break
    case 'handleGift':
      handleGift(row)
      break
    case 'handleContract':
      handleContract(row)
      break
    case 'handleChangePackage':
      handleChangePackage(row)
      break
    default:
      break
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PackageOrderApi.exportPackageOrder(queryParams)
    download.excel(data, '套餐订单.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  if (route.query.orderNum) queryParams.orderNum = route.query.orderNum
  packageOption.value = await getPackagesOptions()
  channelNameOptions.value = await getChannelNameOptions({
    channelType: queryParams.channelType
  })
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  getList()
})
</script>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .filter-label {
    margin: 0 0 15px;
    line-height: 20px;

    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 12px;
      background: #366cff;
      line-height: 12px;
      margin-right: 8px;
    }
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

  .statistics {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1.5rem;
  }
}

.data-table {
  .final-payment {
    margin-left: 4px;
    font-weight: 700;
  }

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
        // line-height: 20px;
      }
    }

    /* 隐藏折叠图标 清除动效 */
    .el-table__expand-icon {
      transition: none;

      .el-icon svn {
        display: none;
      }
    }

    /* 隐藏展开图标 清除动效*/
    .el-table__expand-icon--expanded {
      transform: rotate(0);
    }

    /* 折叠图标 */
    .el-table__expand-icon :after {
      display: inline-block;
      content: url('@/assets/svgs/PlusBoxOutline.svg');
    }

    /* 展开图标 */
    .el-table__expand-icon--expanded :after {
      display: inline-block;
      content: url('@/assets/svgs/MinusBoxOutline.svg');
    }

    .el-table__cell.el-table__expanded-cell {
      padding: 0;
    }

    /* 最后一行 解决内外滚动条重合 */
    .el-table__body tr:last-child td {
      padding-bottom: 8px;
    }
  }
}
</style>