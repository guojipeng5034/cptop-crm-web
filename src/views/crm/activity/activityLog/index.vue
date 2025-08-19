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
          <el-form-item label="活动" prop="activityManageId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityManageId" placeholder="请选择活动" clearable multiple collapse-tags
              :max-collapse-tags="3" class="!w-240px">
              <el-option v-for="dict in activityManageOption" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="审核状态" prop="auditStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACTIVITY_AUDIT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="审核时间" prop="auditTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.auditTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="审核人" prop="auditUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.auditUserId" placeholder="请检索后选择审核人" clearable filterable remote
              :loading="queryOptions.auditUser.loading" :remote-method="queryOptions.auditUser.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.auditUser.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="驳回原因" prop="resultDoubtfulId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.resultDoubtfulId" placeholder="请选择驳回原因" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_REASON)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="奖励状态" prop="addRewardStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.addRewardStatus" placeholder="请选择奖励状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ADD_REWARD_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="社交平台" prop="socialPlatform" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.socialPlatform" placeholder="请选择社交平台" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SOCIAL_PLATFORM)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="朋友圈部分可见" prop="partiallyVisibleStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.partiallyVisibleStatus" placeholder="请选择朋友圈部分可见" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PARTIALLY_VISIBLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="item in queryOptions.mentor.options" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="mentorDeptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.mentorDeptId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.mentorDeptId)"
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
          <el-form-item label="创建人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" placeholder="请检索后选择创建人" clearable filterable remote
              :loading="queryOptions.creator.loading" :remote-method="queryOptions.creator.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.creator.options" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="参与时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
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
          <el-form-item label="备注" prop="remark" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.remark" placeholder="请填写备注" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:activity-log:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:activity-log:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:activity-log:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:activity-log:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe max-height="70vh" :row-key="(row) => row.id"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="学员" align="center" fixed="left" min-width="150">
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
              v-truncate="10">
              {{ scope.row.customerName }}
            </el-button>
          </div>
          <div class="student-info font-size-2.5 c-#777">
            <span class="student-number flex justify-center items-center">
              <span class="m-r-1">学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3">
                  {{ scope.row.customerId }}
                </el-button>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动" align="center" prop="activityManageName" min-width="150" />
      <el-table-column label="审核状态" align="center" prop="auditStatus" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ACTIVITY_AUDIT_STATUS" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="auditTime" :formatter="dateFormatterYMDHms" min-width="110" />
      <el-table-column label="审核人" align="center" prop="auditUserName" min-width="140" />
      <el-table-column label="驳回原因" align="center" prop="doubtful" min-width="180" />
      <el-table-column label="奖励状态" align="center" prop="addRewardStatus" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ADD_REWARD_STATUS" :value="scope.row.addRewardStatus" />
        </template>
      </el-table-column>
      <el-table-column label="社交平台" align="center" prop="socialPlatform" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_SOCIAL_SOFTWARE" :value="scope.row.socialPlatform" />
        </template>
      </el-table-column>
      <el-table-column label="朋友圈部分可见" align="center" prop="partiallyVisibleStatus" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.PARTIALLY_VISIBLE_STATUS" :value="scope.row.partiallyVisibleStatus" />
        </template>
      </el-table-column>
      <el-table-column label="微信图片" align="center" prop="wechatImgs" min-width="300">
        <template #default="scope">
          <span v-for="(url, index) in scope.row.wechatImgs" :key="index">
            <el-image style="width: 60px; height: 60px" :src="url" :preview-src-list="scope.row.wechatImgs"
              preview-teleported :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :initial-index="index"
              fit="scale-down" hide-on-click-modal />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creatorName" min-width="140" />
      <el-table-column label="参与时间" align="center" prop="createTime" min-width="140" :formatter="dateFormatterYMDHms" />
      <el-table-column label="备注" align="center" prop="remark" min-width="300" />
      <el-table-column label="Mentor" align="center" prop="mentorName" min-width="100" />
      <el-table-column label="操作" align="center" fixed="right" min-width="140">
        <template #default="scope">
          <el-button v-if="scope.row.auditStatus === 3" link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:activity-log:update']">
            编辑
          </el-button>
          <el-button v-if="scope.row.auditStatus === 3" link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:activity-log:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学生活动日志 表单 -->
  <ActivityLogForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  getIntDictOptions, DICT_TYPE, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteUserOptions, getActivityManageOptions
} from '@/utils/dict'
import { getLast30Days, dateFormatterYMDHms } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { ActivityLogApi, ActivityLogVO } from '@/api/crm/activity/activityLog'
import ActivityLogForm from './ActivityLogForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 学生活动日志 列表 */
defineOptions({ name: 'ActivityLog' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ActivityLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  activityManageId: [], // 活动
  auditStatus: undefined, // 审核状态
  auditTime: [], // 审核时间
  auditUserId: undefined, // 审核人
  resultDoubtfulId: undefined, // 驳回原因
  addRewardStatus: undefined, // 奖励状态
  socialPlatform: undefined, // 社交平台
  partiallyVisibleStatus: undefined, // 朋友圈部分可见
  mentorId: undefined, // mentor
  mentorDeptId: [], // mertor所属部门
  deptId: [], // 部门
  creator: undefined, // 创建人
  createTime: getLast30Days(), // 参与时间
  siteId: [], // 学员站点
  fromArea: undefined, // 来源地区
  remark: undefined, // 备注
})
const queryFormRef = ref() // 搜索的表单

// 2.activityManage
const activityManageOption = ref()

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  auditUser: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  creator: useRemoteSearch(handleRemoteUserOptions),
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

/* 多选 */
const tableRef = ref()
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}

/* 取消多选 */
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ActivityLogApi.getActivityLogPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ActivityLogApi.deleteActivityLog(id)
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
    // 导出参数
    const exportParams = {
      ...queryParams,
      ...(multipleSelection.value.length > 0 ? { ids: multipleSelection.value } : {}),
    }
    // 发起导出
    exportLoading.value = true
    const data = await ActivityLogApi.exportActivityLog(exportParams)
    download.excel(data, '学生活动日志.xlsx')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  activityManageOption.value = await getActivityManageOptions()
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
</style>