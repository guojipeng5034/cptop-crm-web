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
            <el-form-item label="入公海次数" prop="frequency">
              <el-select v-model="queryParams.frequency" placeholder="请选择或检索入公海次数" clearable filterable
                @keyup.enter="handleQuery" class="!w-210px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_SEA_FREQUENCY)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="入公海原因" prop="reason">
              <el-select v-model="queryParams.reason" placeholder="请选择或检索入公海原因" clearable filterable
                @keyup.enter="handleQuery" class="!w-210px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_SEA_REASON)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
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
                  <el-form-item label="学员类型" prop="customerType">
                    <el-select v-model="queryParams.customerType" placeholder="请选择或检索学员类型" clearable filterable
                      @keyup.enter="handleQuery" class="!w-210px">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_STUDENT_TYPE)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
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
                      end-placeholder="结束时间" clearable format="YYYY-MM-DD" date-format="YYYY-MM-DD" :default-time="[
                        new Date(2000, 1, 1, 0, 0, 0),
                        new Date(2000, 2, 1, 23, 59, 59)
                      ]" value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" :disabled-date="disabledAfterDate"
                      class="!w-190px" />
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
          <el-button @click="handleQuery" class="!w-80px">
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

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border class="customer-table" max-height="70vh">
      <el-table-column label="学员信息" align="center" min-width="190" fixed>
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
            <arco-tag :type="DICT_TYPE.CRM_AGE" :value="scope.row.age" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="手机号码" align="center" prop="phone" width="130px" />

      <el-table-column label="邮箱" align="center" prop="mail" min-width="140px" />

      <el-table-column label="入公海次数" align="center" prop="frequency" width="100px" sortable>
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CUSTOMER_SEA_FREQUENCY" :value="scope.row.frequency" />
        </template>
      </el-table-column>

      <el-table-column label="入公海原因" align="center" prop="reason" width="90px">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CUSTOMER_SEA_REASON" :value="scope.row.reason" />
        </template>
      </el-table-column>

      <el-table-column label="Caller" align="center" prop="callerName" min-width="90px" />

      <el-table-column label="注册时间" align="center" prop="createTime" width="110px" :formatter="timeWithoutSecondFormat"
        sortable />

      <el-table-column label="试听课" align="center">
        <el-table-column prop="reserveFirstFtlTime" label="首次预约" align="center" width="110px"
          :formatter="timeWithoutSecondFormat" sortable />
        <el-table-column prop="firstFtlTime" label="首次试听" align="center" width="110px"
          :formatter="timeWithoutSecondFormat" sortable />
        <el-table-column prop="testerName" label="Tester" align="center" min-width="90px" />
      </el-table-column>

      <el-table-column label="推荐人数" align="center">
        <el-table-column prop="recommendedRegisterCount" label="注册" align="center" width="65px" sortable />
        <el-table-column prop="recommendedFtlCount" label="试听" align="center" width="65px" sortable />
        <el-table-column prop="recommendedPaidCount" label="付费" align="center" width="65px" sortable />
      </el-table-column>

      <el-table-column label="来源渠道" align="center" prop="channelName" min-width="110px" />

      <el-table-column label="操作" align="center" width="180px" fixed="right" class="list-last-column">
        <template #default="scope">
          <el-button link type="primary" @click="handleGetCustomer(scope.row)" class="!font-size-3 !ml-5px">
            领取
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
</template>

<!-- 暂时不用 -->
<!-- mentor/tester 信息弹窗-->
<!-- <Dialog :title="dialogTitle" v-model="dialogVisible">
    <h2>Dialog</h2>
  </Dialog> -->

<script setup lang="ts">
import {
  getIntDictOptions,
  handleRemoteUserOptions,
  // handleRemoteAgencyOptions,
  handleRemotePageTagOptions,
  handleRemotePageOptions,
  handleRemoteCustomerOptions,
  DICT_TYPE
} from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import { disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, ageToString } from '@/utils/formatter'
import download from '@/utils/download'

import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'
// import { ChannelAgencyApi, ChannelAgencyVO } from '@/api/crm/channel/agency'
// import { ChannelPageTagApi, ChannelPageTagVO } from '@/api/crm/channel/pagetag/'
import { ChannelPageApi, ChannelPageVO } from '@/api/crm/channel/page'
import * as UserApi from '@/api/system/user'

import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 公海管理 */
defineOptions({ name: 'Common' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

/** 1.Search From */
const queryParams = reactive({
  seaType: 1,
  pageNo: 1,
  pageSize: 10,

  customerId: undefined,
  mentorId: undefined,
  callerId: undefined,
  referrerNum: undefined,
  referrerMentorId: undefined,
  adid: undefined,
  frequency: undefined,
  reason: undefined,
  oldStudentNumber: undefined,
  oldSiteId: undefined,

  // 折叠 QueryForm
  customerType: undefined,
  agencyId: undefined,
  createTime: [],
  pageTags: undefined
  // TODO:其他查询条件
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
    download.excel(data, '公海学员.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 1.5 获取所需下拉框options */
/* 1.customer */
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteCustomerOptions(query.trim(), setCustomerOptions, setCustomerLoading)
}

/* 2.user */
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
//   handleRemoteAgencyOptions(query.trim(), setAgencyOptions, setAgencyLoading)
// }

/* 3.pageTag */
const pageTagOptionsLoading = ref(false)
const pageTagOptions = ref([])
const fetchRemotePageTagOptions = async (query) => {
  const setPageTagOptions = (newValue) => (pageTagOptions.value = newValue)
  const setPageTagLoading = (newValue) => (pageTagOptionsLoading.value = newValue)
  handleRemotePageTagOptions(query.trim(), setPageTagOptions, setPageTagLoading)
}

/* 4.page */
const pageOptionsLoading = ref(false)
const pageOptions = ref([])
const fetchRemotePageOptions = async (query) => {
  const setPageOptions = (newValue) => (pageOptions.value = newValue)
  const setPageLoading = (newValue) => (pageOptionsLoading.value = newValue)
  handleRemotePageOptions(query.trim(), setPageOptions, setPageLoading)
}

/** 2.列表 */
/** 打开弹窗 暂时不用*/
// const dialogVisible = ref(false) // 弹窗的是否展示
// const dialogTitle = ref('') // 弹窗的标题
// const handleOpenDialog = () => {
//   dialogVisible.value = true
// }

/** 2.1 查询列表 */
const loading = ref(true) // 列表的加载中
const list = ref<CustomerVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
/** 2.2.1 领取学员 */
const customerParams = ref({
  id: undefined,
  seaType: 2
})
const handleGetCustomer = async (rowData) => {
  loading.value = true
  customerParams.value.id = rowData.id
  try {
    await CustomerApi.updateCustomer(customerParams.value)
    message.success('领取成功')
  } catch (error) {
    console.log(error)
    message.warning('领取失败')
  } finally {
    loading.value = false
    customerParams.value = {
      id: undefined,
      seaType: 2
    }
    getList()
  }
}

/** 2.2.2 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 2.2.3 QQE */
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

/** 2.3 列表过滤函数  */
/** 2.3.1 入公海原因过滤函数  */
// const dictStore = useDictStore()
// const getFilterLabel = () => {
// const reasons = dictStore.getDictByType('customer_sea_reason')
// const filterLabels = ref([])
//   reasons.forEach((item) => {
//     const reason = {
//       text: item.label,
//       value: item.value
//     }
//     filterLabels.value.push(reason)
//   })
//   return filterLabels
// }

const resons = ref([
  { text: '未及时联系', value: 1 },
  { text: '未完成FTL', value: 2 },
  { text: '未及时付费', value: 3 },
  { text: '自然注册', value: 4 },
  { text: '有效过期', value: 5 }
])
const filterReasonTag = (value: string, row) => {
  return row.reason === value
}

/** 3. 工具函数  */
/** 3.1 信息脱敏 */
const desensitizePhone = (row) => {
  if (!row.phone) {
    return null
  }
  return row.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const desensitizeMail = (row) => {
  if (!row.mail) {
    return null
  }
  let emailArray = row.mail.split('@')
  const desensitizedLocalPart = emailArray[0].replace(/^(.{3}).*(.{2})$/, '$1****$2')
  return desensitizedLocalPart + '@' + emailArray[1]
}

/** 初始化 **/
onMounted(async () => {
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
</style>
