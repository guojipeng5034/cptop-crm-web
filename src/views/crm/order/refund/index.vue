<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <div class="search-form-items pos-relative">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="退款状态" prop="invalid" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.invalid" placeholder="请选择退款状态" clearable filterable class="!w-240px">
                <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.COMMON_INVALIDE_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="联系状态" prop="connectStatus" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.connectStatus" placeholder="请选择联系状态" clearable filterable
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CONNECT_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="审核状态" prop="status" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_APPROVE_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="退款状态" prop="refundStatus" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.refundStatus" placeholder="请选择退款状态" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_STATUS)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="套餐类型" prop="packageType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.packageType" placeholder="请选择套餐类型" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_PACKAGES_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="订单类型" prop="orderType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_ORDER_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="订单频次" prop="orderFrequencyType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.orderFrequencyType" placeholder="请选择订单频次" clearable filterable
                class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_FREQUENCY_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员" prop="customerId" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持学号/名字/手机号/邮箱检索" placement="top-start">
                  学员
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
                :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-240px">
                <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="退款原因" prop="refundType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.refundType" placeholder="请选择退款原因" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="connectUserId" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  联系人
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.connectUserId" clearable filterable remote
                :loading="connectUserOptionsLoading" :remote-method="fetchRemoteConnectUserOptions"
                placeholder="请检索后选择联系人" class="!w-240px">
                <el-option v-for="item in connectUserOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="applyUserId" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  提交人
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.applyUserId" clearable filterable remote
                :loading="applyUserOptionsLoading" :remote-method="fetchRemoteApplyUserOptions" placeholder="请检索后选择提交人"
                class="!w-240px">
                <el-option v-for="item in applyUserOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="approverId" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  处理人
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.approverId" clearable filterable remote :loading="approverOptionsLoading"
                :remote-method="fetchRemoteApproverOptions" placeholder="请检索后选择处理人" class="!w-240px">
                <el-option v-for="item in approverOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
              <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="deptList"
                :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox
                default-expand-all placeholder="请选择所属部门" node-key="id"
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
            <el-form-item prop="responsibleIds" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  Responsible
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.responsibleIds" placeholder="请检索后选择Responsible" clearable filterable
                multiple collapse-tags :multiple-limit="1" remote :loading="responsibleOptionsLoading"
                :remote-method="fetchRemoteResponsibleOptions" class="!w-240px">
                <el-option v-for="dict in responsibleOptions" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="所属部门" prop="responsibleDeptIds" @keyup.enter="handleQuery">
              <el-tree-select v-model="queryParams.responsibleDeptIds" multiple filterable clearable :data="deptList"
                :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox
                default-expand-all placeholder="请选择Responsible所属部门" node-key="id"
                @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.responsibleDeptIds)"
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
            <el-form-item label="代理" prop="agencyId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
                :loading="agencyOptionsLoading" :remote-method="fetchRemoteAgencyOptions" class="!w-240px">
                <el-option v-for="dict in agencyOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="代理类型" prop="agencySource" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.agencySource" placeholder="请选择代理类型" clearable filterable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="商户名" prop="merchantIds" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.merchantIds" placeholder="支持商户名称" clearable filterable remote multiple
                :loading="merchantOptionsLoading" :remote-method="fetchRemoteMerchantOptions" class="!w-240px">
                <el-option v-for="dict in merchantOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="商户类型" prop="merchantType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.merchantType" placeholder="请选择商户类型" multiple clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PAYMENT_LIST)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
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
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="退款时年龄" prop="refundAge" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.refundAge" placeholder="请选择退款时年龄" clearable filterable
                      class="!w-240px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="客户名" prop="customerName" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.customerName" placeholder="请输入客户名" clearable class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="银行名" prop="bankName" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.bankName" placeholder="请输入银行名" clearable class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="提出退费时间" prop="refundDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.refundDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                      start-placeholder="开始日期" end-placeholder="结束日期" :disabled-date="disabledAfterDate"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="联系时间" prop="connectDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.connectDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="处理时间" prop="approverDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.approverDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="退款成功时间" prop="refundSuccessDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.refundSuccessDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="订单号" prop="orderNum" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.orderNum" placeholder="请输入要退款的订单号" clearable class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="旧站点学号" prop="oldStudentNumber" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.oldStudentNumber" clearable placeholder="请输入旧站点学号"
                      class="!w-240px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="所属旧站点" prop="oldSiteId" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.oldSiteId" placeholder="请选择或检索所属旧站点" clearable filterable
                      class="!w-240px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="一级渠道" prop="channelType" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.channelType" placeholder="一级渠道" clearable filterable
                      class="!w-240px" @change="changeChannelType">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="二级渠道" prop="channelLevelTwo" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.channelLevelTwo" placeholder="二级渠道"
                      :disabled="!queryParams.channelType" clearable filterable class="!w-240px">
                      <el-option v-for="dict in channelLevelTwoOption" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="三级渠道" prop="channelLevelThree" @keyup.enter="handleQuery">
                    <el-select v-model="queryParams.channelLevelThree" placeholder="三级渠道"
                      :disabled="queryParams.channelType === undefined" clearable :remote="needRemote"
                      :loading="channelLevelThreeOptionLoading" :remote-method="fetchRemoteChannelLevelThreeOptions"
                      filterable class="!w-240px">
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
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-form-item>
        <el-button @click="handleQuery" class="!w-80px" v-hasPermi="['crm:refund-record:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" class="!w-80px" v-hasPermi="['crm:refund-record:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading" class="!w-80px"
          v-hasPermi="['crm:refund-record:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
      <Statistic :data="extendData" :loading="loading" />
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      @sort-change="handleSortChange" :row-key="row => row.id">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div class="ml-5 mt-5 flex">
            <el-timeline>
              <!-- 提出退费 -->
              <el-timeline-item :timestamp="formatDate(props.row.refundDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot v-if="props.row.id">
                  <Icon icon="weui:done2-outlined" :size="24" color="#67C23A" class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4">
                    <el-text>提出退费</el-text>
                  </div>

                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="success">退费原因</el-tag>
                    <div class="w-250px color-#606266">{{
                      props.row.refundReason ? props.row.refundReason : '--'
                    }}</div>
                  </div>

                  <div class="present mt-2 flex">
                    <el-tag size="small" class="mr-2" type="success">赠品信息</el-tag>
                    <el-descriptions direction="vertical" :column="3" size="small" border>
                      <el-descriptions-item label-align="center" label="积分" align="center">
                        {{ props.row.presentPoint ? props.row.presentPoint : '--' }}
                      </el-descriptions-item>
                      <el-descriptions-item label-align="center" label="次卡" align="center">
                        {{ props.row.presentTicket ? props.row.presentTicket : '--' }}
                      </el-descriptions-item>
                      <el-descriptions-item label-align="center" label="书籍" align="center">
                        <arco-tag v-if="props.row.presentBookName" :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE"
                          :value="props.row.presentBookName" :size="'small'" />
                        <el-text v-else>--</el-text>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>

                  <div class="apply-user mt-2 flex items-center">
                    <el-tag size="small" class="mr-2" type="success">提交人</el-tag>
                    <div class="w-250px">{{
                      props.row.applyUserName ? props.row.applyUserName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 沟通联系 -->
              <!-- 显示：有效 || （无效 && 联系状态为‘沟通完成’） -->
              <el-timeline-item v-if="showConnectInfo(props.row)"
                :timestamp="formatDate(props.row.connectDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot>
                  <Icon v-if="props.row.connectStatus === CONNECT_STATUS.WAITING" icon="line-md:loading-twotone-loop"
                    :size="24" color="#409EFF" class="top--12px" />
                  <Icon v-if="props.row.connectStatus === CONNECT_STATUS.COMPLETE" icon="weui:done2-outlined" :size="24"
                    color="#67C23A" class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">沟通联系</el-text>
                    <arco-tag :size="'small'" :type="DICT_TYPE.CONNECT_STATUS" :value="props.row.connectStatus" />
                  </div>
                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="danger">联系纪要</el-tag>
                    <div class="w-250px color-#606266">
                      {{ props.row.connectRemark ? props.row.connectRemark : '--' }}
                    </div>
                  </div>
                  <div class="apply-user mt-2 flex items-center">
                    <el-tag size="small" class="mr-2" type="danger">联系人</el-tag>
                    <div class="w-250px">{{
                      props.row.connectUserName ? props.row.connectUserName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 审核处理 -->
              <!-- 显示：有效 || （无效 && 审核状态 !== 等待审核） -->
              <el-timeline-item v-if="showApproveInfo(props.row)"
                :timestamp="formatDate(props.row.approverDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot>
                  <Icon v-if="props.row.status === REFUND_APPROVE_STATUS.WAITING" icon="line-md:loading-twotone-loop"
                    :size="24" color="#409EFF" class="top--12px" />
                  <Icon v-if="props.row.status === REFUND_APPROVE_STATUS.APPROVED" icon="weui:done2-outlined" :size="24"
                    color="#67C23A" class="top--12px" />
                  <Icon v-if="props.row.status === REFUND_APPROVE_STATUS.REJECTED" icon="weui:close2-outlined"
                    :size="24" color="#f00" class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">审核处理</el-text>
                    <arco-tag size="small" :type="DICT_TYPE.REFUND_APPROVE_STATUS" :value="props.row.status" />
                  </div>
                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="warning">处理纪要</el-tag>
                    <div class="w-250px color-#606266">
                      {{ props.row.approveRemark ? props.row.approveRemark : '--' }}
                    </div>
                  </div>
                  <div class="apply-user mt-2 flex items-center">
                    <el-tag size="small" class="mr-2" type="warning">处理人</el-tag>
                    <div class="w-250px">{{
                      props.row.approverName ? props.row.approverName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 退款状态 -->
              <!-- 显示：有效 -->
              <el-timeline-item v-if="!props.row.invalid"
                :timestamp="formatDate(props.row.refundSuccessDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot v-if="props.row.refundStatus !== REFUND_STATUS.UNREFUNDED">
                  <Icon v-if="props.row.refundStatus === REFUND_STATUS.REJECTED" icon="weui:close2-outlined" :size="24"
                    color="#f00" class="top--12px" />
                  <Icon v-if="props.row.refundStatus === REFUND_STATUS.REFUNDED" icon="weui:done2-outlined" :size="24"
                    color="#67C23A" class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">退款状态</el-text>
                    <arco-tag size="small" :type="DICT_TYPE.REFUND_STATUS" :value="props.row.refundStatus" />
                  </div>
                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="warning">处理纪要</el-tag>
                    <div class="w-250px color-#606266">
                      {{ props.row.refundRemark ? props.row.refundRemark : '--' }}
                    </div>
                  </div>
                  <div class="apply-user mt-2 flex items-center">
                    <el-tag size="small" class="mr-2" type="warning">处理人</el-tag>
                    <div class="w-250px">{{
                      props.row.refundSuccessName ? props.row.refundSuccessName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 已取消 -->
              <el-timeline-item v-if="props.row.invalid"
                :timestamp="formatDate(props.row.invalidTime, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot>
                  <Icon icon="weui:close2-outlined" size="24" color="#f00" class="top--12px" />
                </template>

                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">申请状态</el-text>
                    <arco-tag size="small" :type="DICT_TYPE.COMMON_INVALIDE_STATUS" :value="props.row.invalid" />
                  </div>
                  <div class="apply-user mt-2 flex">
                    <el-tag size="small" class="mr-2" type="danger">取消人</el-tag>
                    <div class="w-250px">{{
                      props.row.applyUserName ? props.row.applyUserName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.studentName)"
            v-truncate="10">
            {{ scope.row.studentName }}
          </el-button>
          <span v-if="scope.row.customerId" class="flex justify-center items-center">
            <span>学号:</span>
            <el-tooltip effect="light" content="点击复制" placement="right">
              <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                {{ scope.row.customerId }}
              </el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="提出退费时间" align="center" prop="refundDate" min-width="140"
        :formatter="timeWithoutSecondFormat" sortable="custom" />
      <el-table-column label="状态概览" align="center">
        <el-table-column label="退款记录状态" align="center" prop="invalid" min-width="100">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.COMMON_INVALIDE_STATUS" :value="scope.row.invalid" />
          </template>
        </el-table-column>
        <el-table-column label="联系状态" align="center" prop="connectStatus" min-width="100">
          <template #default="scope">
            <arco-tag v-if="showConnectInfo(scope.row)" :type="DICT_TYPE.CONNECT_STATUS"
              :value="scope.row.connectStatus" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="status" min-width="100">
          <template #default="scope">
            <arco-tag v-if="showApproveInfo(scope.row)" :type="DICT_TYPE.REFUND_APPROVE_STATUS"
              :value="scope.row.status" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" align="center" prop="refundStatus" min-width="90">
          <template #default="scope">
            <arco-tag v-if="!scope.row.invalid" :type="DICT_TYPE.REFUND_STATUS" :value="scope.row.refundStatus" />
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="退费信息" align="center">
        <el-table-column label="订单号" align="center" min-width="220">
          <template #default="scope">
            <el-button link type="primary" @click="toOrderList(scope.row.orderNum)">
              {{ scope.row.orderNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="退款原因" align="center" prop="refundType" min-width="130">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_TYPE" :value="scope.row.refundType" />
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center" prop="orderType" min-width="80">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_ORDER_TYPE" :value="scope.row.orderType" />
          </template>
        </el-table-column>
        <el-table-column label="订单频次" align="center" min-width="110">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.ORDER_FREQUENCY_TYPE" :value="scope.row.orderFrequencyType" :size="'small'" />
          </template>
        </el-table-column>
        <el-table-column label="套餐类型" align="center" prop="packageType" min-width="70">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_PACKAGES_TYPE" :value="scope.row.packageType" />
          </template>
        </el-table-column>
        <el-table-column label="退款金额" align="center" prop="refundAmount" min-width="70" />
        <el-table-column label="固定课及固定订单" align="center" prop="cancelFixLessonOrderStatus" min-width="80">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CANCEL_FIX_LESSON_ORDER_STATUS" :value="scope.row.cancelFixLessonOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="当时开具发票情况" align="center" prop="makeOutAnInvoiceStatus" min-width="80">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.MAKE_OUT_AN_INVOICE_STATUS" :value="scope.row.makeOutAnInvoiceStatus" />
          </template>
        </el-table-column>
        <el-table-column label="订单所属部门" align="center" prop="deptName" min-width="130" />
      </el-table-column>
      <el-table-column label="金额记录信息" align="center">
        <el-table-column label="学习月数" align="center" prop="studyMonth" min-width="50" />
        <el-table-column label="当时支付金额" align="center" prop="paymentAmount" min-width="80" />
        <el-table-column label="当月套餐价格" align="center" prop="thisMonthPrice" min-width="80" />
        <el-table-column label="退款月数" align="center" prop="refundMonth" min-width="50" />
        <el-table-column label="赠品折算价格" align="center" prop="presentAmount" min-width="70" />
        <!-- <el-table-column label="剩余金额" align="center" prop="surplusAmount" width="70" /> -->
      </el-table-column>
      <el-table-column label="客户信息" align="center" min-width="150">
        <el-table-column label="客户名" align="center" prop="customerName" />
        <el-table-column label="退款时年龄" align="center" prop="refundAge" min-width="135">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CRM_AGE" :value="scope.row.refundAge" />
          </template>
        </el-table-column>
        <el-table-column label="银行名" align="center" prop="bankName" min-width="250" />
        <el-table-column label="客户银行卡号" align="center" prop="customerBankCard" min-width="165">
          <template #default="scope">
            <el-tooltip v-if="scope.row.customerBankCard" effect="light" content="点击复制" placement="top">
              <el-button link type="primary" @click="handleCopy">
                {{ scope.row.customerBankCard }}
              </el-button>
            </el-tooltip>
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
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="240" fixed="right"
        v-hasPermi="['crm:refund-record:update-status', 'crm:refund-record:update-connect']">
        <template #default="scope">
          <!-- 取消退款，生成退款订单前（审核状态!= ‘沟通完成’(3)）&& 登录用户为提交人 允许取消 -->
          <el-button v-if="showCancelRefundBtn(scope.row)" link type="danger" @click="cancelRefundRecord(scope.row.id)"
            v-hasPermi="['crm:refund-record:update-invalid']">
            取消退款
          </el-button>
          <!-- 联系状态!=‘沟通完成’(3) && 退款申请状态 !== ‘无效’， 显示‘更新联系状态’按钮 -->
          <el-button v-if="showConnectBtn(scope.row)" link type="primary" @click="openForm('update', scope.row)"
            v-hasPermi="['crm:refund-record:update-connect']">
            更新联系状态
          </el-button>
          <!-- 联系状态!=‘沟通完成’(3) &&（审核状态为 ‘等待审核’(0) || 空值） && 退款申请状态 !== ‘无效’， 显示‘更新审核状态’按钮 -->
          <el-button v-if="showApproveBtn(scope.row)" link type="success" @click="openForm('update', scope.row)"
            v-hasPermi="['crm:refund-record:update-status']">
            更新审核状态
          </el-button>
          <!-- 审核状态为 ‘审核通过’(2） && 退款申请状态 !== ‘无效’， 显示‘操作退款’按钮 -->
          <el-button v-if="showOperateRefundBtn(scope.row)" link type="danger" @click="openForm('update', scope.row)"
            v-hasPermi="['crm:refund-record:update-status']">
            操作退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 退款 表单 -->
  <RefundForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, getBoolDictOptions, getDictLabel,
  handleRemoteCustomerOptions, handleRemoteUserOptions, handleRemoteAgencyOptions,
  handleRemoteChannelActivityOptions, handleRemoteMechantOptions, handleRemotePageOptions
} from '@/utils/dict'
import { formatDate, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import { getRadio } from '@/utils/index'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { CONNECT_STATUS, REFUND_APPROVE_STATUS, REFUND_STATUS, REFUND_STATISTICS_LABEL } from '@/utils/constants'
import { isEmpty } from '@/utils/is'
import { handleSortfields } from '@/utils/table'
import * as DeptApi from '@/api/system/dept'
import { RefundApi, RefundVO } from '@/api/crm/order/refund'
import RefundForm from './RefundForm.vue'
import { useUserStore } from '@/store/modules/user'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 退款记录管理 列表 */
defineOptions({ name: 'OrderRefund' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 当前路由
const router = useRouter() // 路由
const userStore = useUserStore()
const loading = ref(true) // 列表的加载中
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const list = ref<RefundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const extendData = ref()

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  refundDate: [],
  refundAmount: undefined,
  orderId: undefined,
  orderNum: undefined,
  customerBankCard: undefined,
  customerName: undefined,
  bankName: undefined,
  refundType: undefined,
  refundReason: undefined,
  cancelFixLessonOrderStatus: undefined,
  makeOutAnInvoiceStatus: undefined,
  applyUserId: undefined,
  approverId: undefined,
  approverDate: [],
  deptId: [],
  mentorId: undefined,
  responsibleIds: [],
  responsibleDeptIds: [],
  agencyId: undefined,
  agencySource: undefined,
  merchantIds: [],
  merchantType: undefined,
  status: undefined,
  refundAge: undefined,
  refundStatus: undefined,
  orderType: undefined,
  orderFrequencyType: undefined,
  packageType: undefined,
  connectUserId: undefined,
  connectRemark: undefined,
  connectStatus: undefined,
  connectDate: [],
  approveRemark: undefined,
  studyMonth: undefined,
  paymentAmount: undefined,
  thisMonthPrice: undefined,
  refundMonth: undefined,
  surplusAmount: undefined,
  presentAmount: undefined,
  refundOrderId: undefined,
  refundSuccessDate: [],
  invalid: false,
  oldStudentNumber: undefined, // 旧站点学号
  oldSiteId: undefined, // 所属旧站点
  channelType: undefined, // 一级渠道
  channelLevelTwo: undefined, // 二级渠道
  channelLevelThree: undefined, // 三级渠道
  adid: undefined, // 四级渠道
  orderBy: ['']
})

/* options */
// 1.customer
const customerOptions = ref()
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setOptions = (newValue) => (customerOptions.value = newValue)
  const setLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setOptions, setLoading)
}

// 2.connectUser
const connectUserOptions = ref([])
const connectUserOptionsLoading = ref(false)
const fetchRemoteConnectUserOptions = async (query) => {
  const setUserOptions = (newValue) => (connectUserOptions.value = newValue)
  const setUserLoading = (newValue) => (connectUserOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 3.applyUser
const applyUserOptions = ref([])
const applyUserOptionsLoading = ref(false)
const fetchRemoteApplyUserOptions = async (query) => {
  const setUserOptions = (newValue) => (connectUserOptions.value = newValue)
  const setUserLoading = (newValue) => (connectUserOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 4.approver
const approverOptions = ref([])
const approverOptionsLoading = ref(false)
const fetchRemoteApproverOptions = async (query) => {
  const setUserOptions = (newValue) => (approverOptions.value = newValue)
  const setUserLoading = (newValue) => (approverOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 5.mentor
const mentorOptions = ref([])
const mentorOptionsLoading = ref(false)
const fetchRemoteMentorOptions = async (query) => {
  const setUserOptions = (newValue) => (mentorOptions.value = newValue)
  const setUserLoading = (newValue) => (mentorOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 6.responsible
const responsibleOptions = ref([])
const responsibleOptionsLoading = ref(false)
const fetchRemoteResponsibleOptions = async (query) => {
  const setUserOptions = (newValue) => (responsibleOptions.value = newValue)
  const setUserLoading = (newValue) => (responsibleOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

// 7.agency
const agencyOptions = ref([])
const agencyOptionsLoading = ref(false)
const fetchRemoteAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (agencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (agencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query.trim(), setAgencyOptions, setAgencyLoading)
}

// 8.dept
const deptList = ref<Tree[]>([]) // 树形结构

// 9.merchant
const merchantOptions = ref([])
const merchantOptionsLoading = ref(false)
const fetchRemoteMerchantOptions = async (query) => {
  const setMerchantOptions = (newValue) => (merchantOptions.value = newValue)
  const setMerchantLoading = (newValue) => (merchantOptionsLoading.value = newValue)
  await handleRemoteMechantOptions(query.trim(), setMerchantOptions, setMerchantLoading)
}

// 10.channelActivity
const channelActivityOptions = ref([])
const channelActivityOptionsLoading = ref(false)
const fetchRemoteChannelActivityOptions = async (query) => {
  const setActivityOptions = (newValue) => (channelActivityOptions.value = newValue)
  const setActivityLoading = (newValue) => (channelActivityOptionsLoading.value = newValue)
  await handleRemoteChannelActivityOptions(query.trim(), setActivityOptions, setActivityLoading, queryParams.channelLevelTwo)
}

// 11.channelAgency
const channelAgencyOptions = ref([])
const channelAgencyOptionsLoading = ref(false)
const fetchRemoteChannelAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (channelAgencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (channelAgencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query.trim(), setAgencyOptions, setAgencyLoading, 2, queryParams.channelLevelTwo)
}

// 12.page
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

// 13.channelLevelTwo
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

// 14.channelLevelThree
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

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RefundApi.getRefundRecordPage(queryParams)
    if (!isEmpty(data.pageData)) {
      list.value = data.pageData.list
      total.value = data.pageData.total
    } else {
      list.value = []
      total.value = 0
    }
    extendData.value = Object.entries(data.extendData).map(([key, value], index) => {
      const item = {
        title: REFUND_STATISTICS_LABEL[key] || key,
        value
      }
      if (index >= 4) {
        item.percentage = total.value > 0 ? getRadio(value / total.value, 2) : getRadio(value / 1, 2)
      }
      return item
    })
  } finally {
    loading.value = false
  }
}

/* seachForm 搜索项更多按钮操作 */
const showMoreItems = ref('')
const showMoreFormItems = () => {
  if (!showMoreItems.value) {
    showMoreItems.value = 'more'
  } else {
    showMoreItems.value = ''
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = async () => {
  queryFormRef.value.resetFields()
  clearRouterQuery()
  handleQuery()
}

/* 查看订单列表 */
const toOrderList = (orderNum: number) => {
  router.push({
    name: 'PackageOrder',
    query: {
      orderNum: orderNum,
    }
  })
}

/** 控制显示  */
/* 取消退款按钮显示 */
const showCancelRefundBtn = (rowData) => {
  // 审核状态 ===‘等待审核’(0) && 登录用户 != 提交人(applyUserId)则不显示 && 退款记录状态 != 无效
  return (
    rowData.status === REFUND_APPROVE_STATUS.WAITING &&
    userStore.user.id === rowData.applyUserId &&
    rowData.invalid !== true
  )
}
/* 联系相关显示 */
// 更新联系状态按钮：联系状态!=‘沟通完成’(3) && 退款申请状态 !== ‘无效’， 显示‘更新联系状态’按钮
const showConnectBtn = (row) => {
  return row.connectStatus !== CONNECT_STATUS.COMPLETE && !row.invalid
}
// 联系状态信息：申请记录状态‘无效’ ||（申请记录状态‘有效’ && 联系状态 === ‘沟通完成’）显示‘联系状态’信息
const showConnectInfo = (row) => {
  return !row.invalid || (row.invalid && row.connectStatus === CONNECT_STATUS.COMPLETE)
}
/* 审批相关显示 */
// 更新审核状态按钮： 联系状态!=‘沟通完成’(3) &&（审核状态为 ‘等待审核’(0) || 空值） && 退款申请状态 !== ‘无效’， 显示‘更新审核状态’按钮
const showApproveBtn = (row) => {
  return (
    row.connectStatus === CONNECT_STATUS.COMPLETE &&
    (row.status === REFUND_APPROVE_STATUS.WAITING || !row.status) &&
    !row.invalid
  )
}
// 审批状态信息: 申请记录状态‘无效’ ||（申请记录状态‘有效’ && 审核状态 ！== ‘等待审核’）显示‘审核状态’信息
const showApproveInfo = (row) => {
  return !row.invalid || (row.invalid && row.status !== REFUND_APPROVE_STATUS.WAITING)
}

/* 操作退款 */
const showOperateRefundBtn = (row) => {
  return (
    (row.status === REFUND_APPROVE_STATUS.APPROVED &&
      !row.invalid &&
      row.refundStatus === REFUND_STATUS.UNREFUNDED) ||
    row.refundStatus === REFUND_STATUS.REFUNDING
    || row.refundStatus === REFUND_STATUS.FAILEDREFUND
  )
}

/** 清除 router query */
const clearRouterQuery = async () => {
  if (route.query.orderId) {
    await nextTick() // 等待当前任务队列完成
    await router.replace({
      path: route.path,
      query: {} // 清空 query
    })
  }
}

/** 取消退款按钮操作 */
const cancelRefundRecord = async (id) => {
  try {
    // 取消退款二次确认
    await message.confirm('确认要取消该退款申请吗？')
    // 发起取消退款
    await RefundApi.cancelRefund(id)
    message.success(t('common.operateSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log('cancelRefundRecord', e)
  }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await RefundApi.exportRefundRecord(queryParams)
    download.excel(data, '退款记录管理.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  if (route.query.orderNum) {
    queryParams.orderNum = route.query.orderNum
  }
  if (route.query.orderId) {
    queryParams.orderId = route.query.orderId
    handleQuery()
    clearRouterQuery()
  } else {
    getList()
  }
})

onBeforeUnmount(async () => {
  // 如果是在订单管理页面通过创建退款记录跳转过来，则清空路由参数，避免下次进入页面时，仍然有路由参数导致查询条件有误
  clearRouterQuery()
})
</script>
<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 10px 15px;
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
        padding: 10px 0 0 0;
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

.data-table {
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

    th.el-table__cell .cell {
      padding: 0 5px;
    }

    td.el-table__cell .cell {
      padding: 0;
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

    /* timeline 横向 */
    .el-timeline {
      display: flex;

      .el-timeline-item:last-child {
        .el-timeline-item__tail {
          display: none;
        }
      }

      .el-timeline-item {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .el-timeline-item__wrapper {
          padding-left: 0;
          margin-right: 40px;
          padding-top: 20px;
        }

        .el-timeline-item__tail {
          left: 23px;
          border-left: none;
          width: calc(100% - 21px);
          border-top: 2px solid var(--el-timeline-node-color);
        }

        .el-timeline-item__node {
          width: 24px;
          height: 24px;
          left: 0;
          top: -11px;
        }
      }
    }
  }
}

:deep(.el-tag) {
  padding: 0 4px;
}
</style>
