<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryformRef" :inline="true" label-width="85px">
      <div class="search-form-items pos-relative">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员" prop="customerId">
              <template #label>
                <el-tooltip effect="light" content="支持学号/名字/手机号/邮箱检索" placement="top-start">
                  学员
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
                :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-210px">
                <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="mentorId">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  Mentor
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="userOptionsLoading"
                :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择Mentor" @keyup.enter="handleQuery"
                class="!w-210px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="callerId">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  Caller
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.callerId" clearable filterable remote :loading="userOptionsLoading"
                :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择Caller" @keyup.enter="handleQuery"
                class="!w-210px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="referrerNum">
              <template #label>
                <el-tooltip effect="light" content="支持学号/名字/手机号/邮箱检索" placement="top-start">
                  推荐人
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.referrerNum" placeholder="请检索后选择推荐人" clearable filterable remote
                :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions" class="!w-210px">
                <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item prop="referrerMentorId" label-width="95" class="font-size-3">
              <template #label>
                <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                  推荐人Mentor
                </el-tooltip>
              </template>
              <el-select v-model="queryParams.referrerMentorId" clearable filterable remote
                :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择推荐人Mentor"
                @keyup.enter="handleQuery" class="!w-200px">
                <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="来源渠道" prop="adid">
              <el-select v-model="queryParams.adid" placeholder="支持名称及adid检索" clearable filterable remote
                :loading="pageOptionsLoading" :remote-method="fetchRemotePageOptions" @keyup.enter="handleQuery"
                class="!w-210px">
                <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="旧站点学号" prop="oldStudentNumber">
              <el-input v-model="queryParams.oldStudentNumber" clearable placeholder="请输入旧站点学号"
                @keyup.enter="handleQuery" class="!w-210px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="所属旧站点" prop="oldSiteId">
              <el-radio-group v-model="queryParams.oldSiteId" class="!w-210px" @change="handleQuery">
                <template v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value">
                  <el-radio-button :label="dict.label" :value="dict.value" />
                </template>
              </el-radio-group>
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
                  <el-form-item label="年龄" prop="age">
                    <el-select v-model="queryParams.age" placeholder="请选择或检索年龄" clearable filterable
                      @keyup.enter="handleQuery" class="!w-210px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="所属部门/组" prop="deptId" class="font-size-3">
                    <el-tree-select v-model="queryParams.deptId" clearable filterable :data="deptList"
                      :props="defaultProps" check-strictly default-expand-all placeholder="请选择或检索所属部门或小组" node-key="id"
                      class="!w-210px" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="代理" prop="agencyId">
                    <el-select v-model="queryParams.agencyId" placeholder="支持名称及手机号检索" clearable filterable remote
                      :loading="agencyOptionsLoading" :remote-method="fetchRemoteAgencyOptions" class="!w-210px">
                      <el-option v-for="dict in agencyOptions" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="注册时间" prop="createTime">
                    <el-date-picker v-model="queryParams.createTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="YYYY-MM-DD"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" :disabled-date="disabledAfterDate"
                      class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="首次FTL时间" prop="firstFtlTime" class="font-size-3">
                    <el-date-picker v-model="queryParams.firstFtlTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" :disabled-date="disabledAfterDate"
                      class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item prop="reserveDatetime">
                    <template #label>
                      <div class="font-size-11px">预约测试时间</div>
                    </template>
                    <el-date-picker v-model="queryParams.reserveDatetime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item prop="firstPaidTime">
                    <template #label>
                      <div class="font-size-11px">首次付费时间</div>
                    </template>
                    <el-date-picker v-model="queryParams.firstPaidTime" type="daterange" start-placeholder="开始时间"
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="MMM DD, YYYY"
                      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                      value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" :disabled-date="disabledAfterDate"
                      class="!w-190px" />
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="来源地区" prop="fromArea">
                    <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" @keyup.enter="handleQuery"
                      class="!w-210px" />
                  </el-form-item>
                </el-col>
                <!-- bug-view-749 暂时隐藏 -->
                <!-- <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="页面标签" prop="pageTags">
                    <el-select v-model="queryParams.pageTags" placeholder="支持名称检索" clearable filterable remote
                      :loading="pageTagOptionsLoading" :remote-method="fetchRemotePageTagOptions" class="!w-210px">
                      <el-option v-for="dict in pageTagOptions" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="search-form-buttons mt-10px mb-5px">
        <el-form-item>
          <el-button @click="handleQuery" class="!w-80px" v-hasPermi="['crm:customer:common:export']">
            <Icon icon="ep:search" class="mr-5px" /> 搜索
          </el-button>

          <el-button @click="resetQuery(queryformRef)" class="!w-80px">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>

          <el-button type="success" plain @click="handleExport" v-hasPermi="['crm:customer:common:export']"
            :loading="exportLoading" class="!w-80px">
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 按钮组 -->
  <el-button-group class="btn-group">
    <el-button type="primary" plain @click="handleBtnGroupClick('新注册')">
      <template #default>
        <el-badge :value="2"> 新注册 </el-badge>
      </template>
    </el-button>

    <el-button type="primary" plain @click="handleBtnGroupClick('今日试听')">
      <template #default>
        <el-badge :value="12"> 今日试听 </el-badge>
      </template>
    </el-button>

    <el-button type="primary" plain @click="handleBtnGroupClick('5日未签单')">
      <template #default>
        <el-badge :value="4"> 5日未签单 </el-badge>
      </template>
    </el-button>

    <el-button type="primary" plain @click="handleBtnGroupClick('试听未出席')">
      <template #default>
        <el-badge :value="5"> 试听未出席 </el-badge>
      </template>
    </el-button>

    <el-button type="primary" plain @click="handleBtnGroupClick('5日未约试听课')">
      <template #default>
        <el-badge :value="1"> 5日未约试听课 </el-badge>
      </template>
    </el-button>
    <el-button type="primary" plain @click="handleBtnGroupClick('今日待办')">
      <template #default>
        <el-badge :value="19"> 今日待办 </el-badge>
      </template>
    </el-button>
  </el-button-group>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" class="customer-table">
      <el-table-column label="学员信息" align="center" min-width="190px" fixed>
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <span>{{ scope.row.name }}</span>
            <arco-tag class="ml-5px" :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.studyStatus" />
          </div>
          <div class="student-info font-size-2.5 c-#777">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="top">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
                  {{ scope.row.id }}
                </el-button>
              </el-tooltip>
            </span>
            <span class="divider ml-1 mr-1 font-size-3 color-#e8e8e8" v-if="scope.row.age">|</span>
            <!-- <span class="age">{{ ageToString(scope.row.age) }}</span> -->
            <arco-tag :type="DICT_TYPE.CRM_AGE" :value="scope.row.age" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="跟进状态" align="center" prop="callStatus" width="130" class-name="padding-side-0">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CALL_STATUS" :value="scope.row.callStatus" />
        </template>
      </el-table-column>

      <el-table-column label="手机号码" align="center" prop="phone" width="130px" />

      <el-table-column label="邮箱" align="center" prop="mail" min-width="140px" />

      <el-table-column label="Caller" align="center" prop="caller" min-width="90px" />

      <el-table-column label="注册时间" align="center" prop="createTime" width="110px" :formatter="timeWithoutSecondFormat"
        sortable />

      <el-table-column label="试听课" align="center">
        <el-table-column prop="reserveFirstFtlTime" label="首次预约" align="center" width="110px"
          :formatter="timeWithoutSecondFormat" sortable />
        <el-table-column prop="firstFtlTime" label="首次试听" align="center" width="110px"
          :formatter="timeWithoutSecondFormat" sortable />
        <el-table-column prop="testerName" label="Tester" align="center" min-width="90px" />
      </el-table-column>

      <el-table-column label="付费" align="center">
        <el-table-column prop="firstPaidTime" label="首次时间" align="center" width="110px"
          :formatter="timeWithoutSecondFormat" sortable />
        <el-table-column prop="mentorName" label="Mentor" align="center" min-width="90px" />
      </el-table-column>

      <el-table-column label="推荐人数" align="center">
        <el-table-column prop="recommendedRegisterCount" label="注册" align="center" width="65px" sortable />
        <el-table-column prop="recommendedFtlCount" label="试听" align="center" width="65px" sortable />
        <el-table-column prop="recommendedPaidCount" label="付费" align="center" width="65px" sortable />
      </el-table-column>

      <el-table-column label="转介绍信息" align="center" min-width="90px">
        <template #default="scope">
          <div class="referrer-mentor">
            {{ scope.row.referrerMentorName }}
          </div>
          <div class="referrer-number" v-if="scope.row.referrerNum">
            <el-tooltip effect="light" content="打开该学员详情页" placement="top">
              <el-button link type="primary" size="small"
                @click="handleOpenDrawer(scope.row.referrerNum, scope.row.referrerName)">{{
                  scope.row.referrerName }}</el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="来源渠道" align="center" prop="channelName" min-width="110px" />

      <el-table-column label="来源地区" align="center" prop="fromArea" min-width="70px" />

      <el-table-column label="归属人" align="center" prop="ownerName" min-width="90px" />

      <el-table-column label="代理" align="center" prop="agencyName" min-width="90px" />

      <el-table-column label="部门/组" align="center" prop="deptName" width="90px" />

      <el-table-column label="完课率" align="center" prop="classRate" width="70px" />

      <el-table-column label="操作" align="center" width="180px" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleReleaseCustomer(scope.row)" class="!font-size-3">
            释放
          </el-button>
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.id, scope.row.name)"
            class="!font-size-3 !ml-5px">
            详情
          </el-button>
          <el-button link type="primary" @click="handleLinkQQE(scope.row.id)" class="!font-size-3 !ml-5px">
            QQE
          </el-button>

          <el-dropdown @command="(command) => handleCommand(command, scope.row)" class="!pl-5px">
            <el-button type="primary" link class="!font-size-3">更多
              <Icon icon="ep:d-arrow-right" class="ml--2px" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="getScript">
                  <Icon icon="ep:chat-line-square" /><span class="list-dropdown-item-text">话术</span>
                </el-dropdown-item>
                <el-dropdown-item command="getPoster">
                  <Icon icon="ep:postcard" /><span class="list-dropdown-item-text">海报</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 详情 Drawer -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />

  <!-- 释放学员确认弹窗 -->
  <Dialog :title="releaseDialogTitle" v-model="releaseDialogVisible">
    <el-form :model="releaseDialogFormData" ref="releaseDialogFormRef" :rules="dialogFromRules">
      <el-form-item label="释放原因" prop="reason">
        <el-select v-model="releaseDialogFormData.reason" placeholder="请选择或检索释放原因" clearable filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_SEA_REASON)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelReleaseDialogForm">取消</el-button>
      <el-button @click="submitReleaseDialogForm" type="primary">释放</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {
  getIntDictOptions,
  handleRemoteUserOptions,
  handleRemoteAgencyOptions,
  handleRemotePageTagOptions,
  handleRemotePageOptions,
  handleRemoteCustomerOptions,
  DICT_TYPE
} from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, ageToString } from '@/utils/formatter'
import download from '@/utils/download'
import { defaultProps, handleTree } from '@/utils/tree'

import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'
// import { ChannelAgencyApi, ChannelAgencyVO } from '@/api/crm/base/channel/manage/agency'
import { ChannelPageTagApi, ChannelPageTagVO } from '@/api/crm/channel/pageTag'
import { ChannelPageApi, ChannelPageVO } from '@/api/crm/channel/page'
import * as UserApi from '@/api/system/user'
import * as DeptApi from '@/api/system/dept'

import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 私海管理 */
defineOptions({ name: 'Individual' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CustomerVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/** 1.Search From */
const queryParams = reactive({
  seaType: 2,
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  mentorId: undefined,
  callerId: undefined,
  referrerNum: undefined,
  referrerMentorId: undefined,
  adid: undefined,
  oldStudentNumber: undefined,
  oldSiteId: undefined,

  // 折叠 QueryForm
  age: undefined,
  deptId: undefined,
  agencyId: undefined,
  registeTime: [],
  firstFtlTime: [],
  reserveDatetime: [],
  firstPaidTime: [],
  fromArea: undefined,
  pageTags: undefined
})
const queryformRef = ref() // 搜索的表单组件

/** 1.1 展示更多搜索条件 */
const showMoreItems = ref('')
const showMoreFormItems = () => {
  if (!showMoreItems.value) {
    showMoreItems.value = 'more'
  } else {
    showMoreItems.value = ''
  }
}

/** 1.2 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 1.3 重置按钮操作 */
const resetQuery = () => {
  queryParams.registeTime = []
  queryformRef.value.resetFields()
  handleQuery()
}

/** 1.4 导出按钮操作 */
const exportLoading = ref(false) // 导出的加载中
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CustomerApi.exportCustomer(queryParams)
    download.excel(data, '私海学员.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 1.5 获取所需下拉框options */
/* customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])

const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading)
}

/* user */
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

/* agency */
// const agencyOptions = ref([])
// const agencyOptionsLoading = ref(false)
// const fetchRemoteAgencyOptions = async (query) => {
//   const setAgencyOptions = (newValue) => (agencyOptions.value = newValue)
//   const setAgencyLoading = (newValue) => (agencyOptionsLoading.value = newValue)
//   handleRemoteAgencyOptions(query, setAgencyOptions, setAgencyLoading)
// }

/* page tag */
const pageTagOptionsLoading = ref(false)
const pageTagOptions = ref([])
const fetchRemotePageTagOptions = async (query) => {
  const setPageTagOptions = (newValue) => (pageTagOptions.value = newValue)
  const setPageTagLoading = (newValue) => (pageTagOptionsLoading.value = newValue)
  await handleRemotePageTagOptions(query.trim(), setPageTagOptions, setPageTagLoading)
}

/* page */
const pageOptionsLoading = ref(false)
const pageOptions = ref([])

const fetchRemotePageOptions = async (query) => {
  const setPageOptions = (newValue) => (pageOptions.value = newValue)
  const setPageLoading = (newValue) => (pageOptionsLoading.value = newValue)
  await handleRemotePageOptions(query.trim(), setPageOptions, setPageLoading)
}
/* dept */
const deptList = ref<Tree[]>([]) // 树形结构

/** 1.6 按钮组点击逻辑 */
// TODO：等API后完善
const handleBtnGroupClick = (status) => {
  message.info('该功能暂未开放')
  console.log(status)
}

/** 2.列表 */
/** 2.1 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerApi.getCustomerPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 2.2 操作 */
/** 2.2.1 释放学员 */
const releaseDialogTitle = ref('释放学员') // 弹窗的标题
const releaseDialogVisible = ref(false) // 弹窗的是否展示
const releaseDialogFormRef = ref()
const releaseDialogFormData = ref({
  id: undefined,
  reason: undefined,
  seaType: 1
})

// *1.确认消息弹窗
const handleReleaseCustomer = async (rowData) => {
  try {
    await message.confirm('确定释放该学员吗？')
    await openReleaseDialog(rowData.id)
  } catch (error) {
    message.info('取消释放')
  }
}

//  *2.Dialog弹窗
const openReleaseDialog = async (id) => {
  releaseDialogFormData.value.id = id
  releaseDialogVisible.value = true
}

// *3.提交 Dialog 表单
const dialogFromRules = reactive({
  reason: [{ required: true, message: '释放原因是必选项', trigger: 'change' }]
})
const submitReleaseDialogForm = async () => {
  // 校验表单
  await releaseDialogFormRef.value.validate()
  // 提交请求
  try {
    await CustomerApi.updateCustomer(releaseDialogFormData.value)
    message.success('释放成功')
    releaseDialogVisible.value = false
  } catch (error) {
    console.log(error)
    message.warning('释放失败')
  } finally {
    releaseDialogFormData.value = {
      id: undefined,
      reason: undefined,
      seaType: 1
    }
    getList()
  }
}

const cancelReleaseDialogForm = () => {
  releaseDialogVisible.value = false
  message.info('取消释放')
  releaseDialogFormData.value = {
    id: undefined,
    reason: undefined,
    seaType: 1
  }
}
/** 2.2.1 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 2.2.2 QQE */
// TODO: QQE 按钮点击
const handleLinkQQE = () => {
  message.notify('该功能暂未开放')
}

/** 2.2.4 更多
 * 更多 dropdown 事件
 * getScript 获取话术
 * getPoster 获取海报
 */
// TODO: 更多操作按钮点击逻辑
const getScript = (row) => {
  message.notify('该功能暂未开放')
  console.log('get script' + row.id)
}
const getPoster = (row) => {
  message.notify('该功能暂未开放')
  console.log('get poster' + row.id)
}
/** 操作分发 */
const handleCommand = (command: string, row: UserApi.UserVO) => {
  switch (command) {
    case 'getScript':
      getScript(row)
      break
    case 'getPoster':
      getPoster(row)
      break
    default:
      break
  }
}

/** 初始化 **/
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  getList()
})
</script>
<style lang="scss" scoped>
/* content wrap */
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
    }

    .font-size-3 :deep(.el-form-item__label) {
      font-size: 12px;
    }

    /* 这里去除必选字段的*,这个符号会造成一定影响,去掉之后我用了li列表进行定位,在前面加上" * ". */
    /* :deep(.el-form-item.is-required .el-form-item__label:before)  {
    content: none !important;
    } */

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

.customer-table {
  :deep(.el-table__inner-wrapper) {
    th.el-table__cell {
      padding: 5px 0;
    }

    td.el-table__cell {
      padding: 6px 0;
    }

    .cell {
      padding: 0px 6px;
      /* line-height: 20px; */
    }

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

:deep(.el-tag) {
  height: 20px;
  line-height: 10px;
  padding: 0 3px;

  .el-tag__content {
    text-align: center;
    font-size: 10px;
  }
}

:deep(.el-table-fixed-column--right) {
  border-left: var(--el-table-border);

  .el-dropdown {
    vertical-align: bottom;
    padding-left: 10px;
  }
}

/* 按钮组 badge 位置调整*/
.btn-group {
  .el-button {
    padding-right: 25px;
  }

  :deep(.el-badge__content.is-fixed) {
    top: -9px;
    transform: translateY(-50%) translateX(120%);
    z-index: 200;
  }
}
</style>
