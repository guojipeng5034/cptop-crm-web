<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form :disabled="formType === 'update'" class="-mb-15px search-form" :model="queryParams" ref="queryFormRef"
      inline label-width="90">
      <div class="search-form-items pos-relative">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="套餐类型" prop="packageType">
              <el-radio-group v-model="queryParams.packageType" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_PACKAGES_TYPE)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="订单类型" prop="orderType">
              <el-radio-group v-model="queryParams.orderType" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_ORDER_TYPE)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="联系状态" prop="connectStatus">
              <el-radio-group v-model="queryParams.connectStatus" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.CONNECT_STATUS)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" class="!mr-2" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="审核状态" prop="status">
              <el-radio-group v-model="queryParams.status" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_APPROVE_STATUS)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" class="!mr-2" />
                </template>
              </el-radio-group>
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
                :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-220px">
                <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="退款原因" prop="refundType" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.refundType" placeholder="请选择退款原因" clearable filterable class="!w-220px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="退款状态" prop="refundStatus">
              <el-radio-group v-model="queryParams.refundStatus" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_STATUS)" :key="dict.value">
                  <el-radio :value="dict.value" :label="dict.label" class="!mr-2.5" />
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="connectUserId" @keyup.enter="handleQuery">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  联系人
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.connectUserId" clearable filterable remote :loading="userOptionsLoading"
                :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择联系人" class="!w-220px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-select v-model="queryParams.applyUserId" clearable filterable remote :loading="userOptionsLoading"
                :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择提交人" class="!w-220px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-select v-model="queryParams.approverId" clearable filterable remote :loading="userOptionsLoading"
                :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择处理人" class="!w-220px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
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
                      class="!w-220px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="客户名" prop="customerName" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.customerName" placeholder="请输入客户名" clearable class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="银行名" prop="bankName" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.bankName" placeholder="请输入银行名" clearable class="!w-220px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="提出退费时间" prop="refundDate" label-width="100" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.refundDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                      start-placeholder="开始日期" end-placeholder="结束日期" :disabled-date="disabledAfterDate"
                      class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="联系时间" prop="connectDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.connectDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate" class="!w-200px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="处理时间" prop="approverDate" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.approverDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate" class="!w-200px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="退款成功时间" prop="refundSuccessDate" label-width="100" @keyup.enter="handleQuery">
                    <el-date-picker v-model="queryParams.refundSuccessDate" value-format="YYYY-MM-DD HH:mm:ss"
                      type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                      :disabled-date="disabledAfterDate" class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="原退费订单ID" prop="refundOrderId" label-width="110" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.refundOrderId" placeholder="请输入要退款的订单ID" clearable
                      class="!w-200px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="生成的退费订单ID" prop="orderId" label-width="140" @keyup.enter="handleQuery">
                    <el-input v-model="queryParams.orderId" placeholder="请输入生成的退费订单ID" clearable class="!w-220px" />
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
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div class="ml-5 mt-5 flex">
            <el-timeline>
              <!-- 提出退费 -->
              <el-timeline-item :timestamp="formatDate(props.row.createTime, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot v-if="props.row.id">
                  <Icon icon="weui:done2-outlined" size="24px" color="#67C23A" class="top--12px" />
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
                        <arco-tag :type="DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE" :value="props.row.presentBookName"
                          :size="'small'" />
                        <el-text v-if="!props.row.presentBookName">--</el-text>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>

                  <div class="apply-user mt-2 flex">
                    <el-tag size="small" class="mr-2" type="success">提交人</el-tag>
                    <div class="w-250px">{{
                      props.row.applyUserName ? props.row.applyUserName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 审核处理 -->
              <el-timeline-item :timestamp="formatDate(props.row.approverDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot v-if="props.row.status">
                  <Icon v-if="props.row.status === 1" icon="line-md:loading-twotone-loop" size="24px" color="#409EFF"
                    class="top--12px" />
                  <Icon v-if="props.row.status === 2" icon="weui:done2-outlined" size="24px" color="#67C23A"
                    class="top--12px" />
                  <Icon v-if="props.row.status === 3" icon="oui:cross-in-circle-empty" size="24px" color="#F56C6C"
                    class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">审核处理</el-text>
                    <arco-tag :size="'small'" :type="DICT_TYPE.REFUND_APPROVE_STATUS" :value="props.row.status" />
                  </div>
                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="warning">处理纪要</el-tag>
                    <div class="w-250px color-#606266">
                      {{ props.row.approveRemark ? props.row.approveRemark : '--' }}
                    </div>
                  </div>
                  <div class="apply-user mt-2 flex">
                    <el-tag size="small" class="mr-2" type="warning">处理人</el-tag>
                    <div class="w-250px">{{
                      props.row.approverName ? props.row.approverName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 沟通联系 -->
              <el-timeline-item :timestamp="formatDate(props.row.connectDate, 'YYYY-MM-DD HH:mm')" placement="top">
                <template #dot v-if="props.row.connectStatus !== 1">
                  <Icon v-if="props.row.connectStatus === 2" icon="line-md:loading-twotone-loop" size="24px"
                    color="#409EFF" class="top--12px" />
                  <Icon v-if="props.row.connectStatus === 3" icon="weui:done2-outlined" size="24px" color="#67C23A"
                    class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">沟通联系</el-text>
                    <arco-tag size="small" :type="DICT_TYPE.CONNECT_STATUS" :value="props.row.connectStatus" />
                  </div>
                  <div class="reason mt-2 flex">
                    <el-tag size="small" class="mr-2" type="danger">联系纪要</el-tag>
                    <div class="w-250px color-#606266">{{
                      props.row.connectRemark ? props.row.connectRemark : '--'
                    }}</div>
                  </div>
                  <div class="apply-user mt-2 flex">
                    <el-tag size="small" class="mr-2" type="danger">联系人</el-tag>
                    <div class="w-250px">{{
                      props.row.connectUserName ? props.row.connectUserName : '--'
                    }}</div>
                  </div>
                </div>
              </el-timeline-item>

              <!-- 退款状态 -->
              <el-timeline-item :timestamp="formatDate(props.row.refundSuccessDate, 'YYYY-MM-DD HH:mm')"
                placement="top">
                <template #dot v-if="props.row.refundStatus === 1">
                  <Icon icon="weui:done2-outlined" size="24px" color="#67C23A" class="top--12px" />
                </template>
                <div class="content">
                  <div class="title fw-semibold font-size-4 flex items-center">
                    <el-text class="!mr-2">退款状态</el-text>
                    <arco-tag size="small" :type="DICT_TYPE.REFUND_STATUS" :value="props.row.refundStatus" />
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="学员信息" align="center" width="140" fixed>
        <template #default="scope">
          <div> {{ scope.row.studentName }} </div>
          <div>
            <span v-if="scope.row.customerId" class="!font-size-3">学号: </span>
            <el-tooltip effect="light" content="点击复制" placement="right">
              <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                {{ scope.row.customerId }}
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态概览" align="center">

        <el-table-column label="审核状态" align="center" prop="status" width="85">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_APPROVE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>

        <el-table-column label="联系状态" align="center" prop="connectStatus" width="70">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CONNECT_STATUS" :value="scope.row.connectStatus" />
          </template>
        </el-table-column>

        <el-table-column label="退款状态" align="center" prop="refundStatus" width="70">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_STATUS" :value="scope.row.refundStatus" />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="退费信息" align="center">
        <el-table-column label="订单号" align="center" width="240">
          <template #default="scope">
            <div class="refundOrderId">
              <el-tag size="small" class="mr-1" type="info">被退订单</el-tag>
              <el-tooltip v-if="scope.row.refundOrderId" effect="light" content="点击复制" placement="top">
                <el-button link type="primary" @click="handleCopy">
                  {{ scope.row.refundOrderId }}
                </el-button>
              </el-tooltip>
              <el-text type="info" v-else>--</el-text>
            </div>

            <div class="orderId">
              <el-tag size="small" class="mr-1" type="danger">生成订单</el-tag>
              <el-tooltip v-if="scope.row.orderId" effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy">
                  {{ scope.row.orderId }}
                </el-button>
              </el-tooltip>
              <el-text type="info" v-else>--</el-text>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="退款原因" align="center" prop="refundType" width="130">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_TYPE" :value="scope.row.refundType" />
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center" prop="orderType" width="70">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_ORDER_TYPE" :value="scope.row.orderType" />
          </template>
        </el-table-column>
        <el-table-column label="套餐类型" align="center" prop="packageType" width="70">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.REFUND_PACKAGES_TYPE" :value="scope.row.packageType" />
          </template>
        </el-table-column>

        <el-table-column label="退款金额" align="center" prop="refundAmount" width="70" />

        <el-table-column label="固定课" align="center" prop="cancelFixLessonOrderStatus" width="150">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CANCEL_FIX_LESSON_ORDER_STATUS" :value="scope.row.cancelFixLessonOrderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="发票" align="center" prop="makeOutAnInvoiceStatus" width="100">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.MAKE_OUT_AN_INVOICE_STATUS" :value="scope.row.makeOutAnInvoiceStatus" />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="客户信息" align="center" width="150">
        <el-table-column label="客户名" align="center" prop="customerName" />
        <el-table-column label="退款时年龄" align="center" prop="refundAge" width="135">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.CRM_AGE" :value="scope.row.refundAge" />
          </template>
        </el-table-column>
        <el-table-column label="银行名" align="center" prop="bankName" width="250" />
        <el-table-column label="客户银行卡号" align="center" prop="customerBankCard" width="165">
          <template #default="scope">
            <el-tooltip v-if="scope.row.customerBankCard" effect="light" content="点击复制" placement="top">
              <el-button link type="primary" @click="handleCopy">
                {{ scope.row.customerBankCard }}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="金额记录信息" align="center">
        <el-table-column label="学习月数" align="center" prop="studyMonth" width="50" />
        <el-table-column label="当时支付金额" align="center" prop="paymentAmount" width="80" />
        <el-table-column label="当月套餐价格" align="center" prop="thisMonthPrice" width="80" />
        <el-table-column label="退款月数" align="center" prop="refundMonth" width="50" />
        <el-table-column label="赠品折算价格" align="center" prop="presentAmount" width="70" />
        <!-- <el-table-column label="剩余金额" align="center" prop="surplusAmount" width="70" /> -->
      </el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <el-button v-if="scope.row.status === 1 || !scope.row.status" link type="success"
            @click="openForm('update', scope.row)" v-hasPermi="['crm:refund-record:update-status']">
            更新审核状态
          </el-button>
          <el-button v-if="scope.row.status === 2 && scope.row.connectStatus !== 3" link type="primary"
            @click="openForm('update', scope.row)" v-hasPermi="['crm:refund-record:update-connect']">
            更新联系状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 订单退款 表单 -->
  <RefundForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import {
  getIntDictOptions,
  DICT_TYPE,
  handleRemoteCustomerOptions,
  handleRemoteUserOptions
} from '@/utils/dict'
import { formatDate, dateFormatterYMDHms, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { isEmpty } from '@/utils/is'
import { RefundApi, RefundVO } from '@/api/crm/finance/refund'
import RefundForm from './RefundForm.vue'

/** 退款记录管理 列表 */
defineOptions({ name: 'Refund' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()
const loading = ref(true) // 列表的加载中
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const list = ref<RefundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  refundDate: [],
  refundAmount: undefined,
  refundOrderId: undefined,
  orderId: undefined,
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
  status: undefined,
  refundAge: undefined,
  refundStatus: undefined,
  orderType: undefined,
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
  orderId: undefined,
  refundDate: undefined,
  refundSuccessDate: []
})

/* 远程搜索 */
// customer
const customerOptions = ref()
const customerOptionsLoading = ref(false)
const fetchRemoteCustomerOptions = async (query) => {
  const setOptions = (newValue) => (customerOptions.value = newValue)
  const setLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setOptions, setLoading)
}
// user
const userOptions = ref([])
const userOptionsLoading = ref(false)

const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
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
  } finally {
    loading.value = false
  }
}

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
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
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

/** 初始化 **/
onMounted(async () => {
  if (route.query.refundOrderId) {
    queryParams.refundOrderId = route.query.refundOrderId
    handleQuery()
  } else {
    getList()
  }
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
