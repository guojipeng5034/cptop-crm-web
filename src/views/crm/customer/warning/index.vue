<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="85">
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
          <el-form-item label="预警类型" prop="warningType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.warningType" placeholder="请选择预警类型" clearable class="!w-240px">
              <el-option v-for="dict in queryOptions.warningType" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理状态" prop="handleStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.handleStatus" placeholder="请选择处理状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DISPOSE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理时间" prop="handleTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.handleTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="处理人" prop="handleUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.handleUserId" clearable filterable remote
              :loading="queryOptions.handleUser.loading" :remote-method="queryOptions.handleUser.handleSearch"
              placeholder="请选择处理人" class="!w-240px">
              <el-option v-for="option in queryOptions.handleUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="接收人" prop="receiveUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.receiveUserId" clearable filterable remote
              :loading="queryOptions.handleUser.loading" :remote-method="queryOptions.handleUser.handleSearch"
              placeholder="请选择接收人" class="!w-240px">
              <el-option v-for="option in queryOptions.handleUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索Mentor" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
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
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:warning:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:warning:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:warning:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180">
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
              v-truncate="10">
              {{ scope.row.customerName }}
            </el-button>
            <arco-tag class="ml-5px" :type="DICT_TYPE.STUDY_STATUS" :value="scope.row.studyStatus" />
          </div>
          <div class="student-info font-size-3 c-#777">
            <span class="student-number flex justify-center items-center">
              <span>学号:</span>
              <el-tooltip effect="light" content="点击复制" placement="right">
                <el-button link type="primary" @click="handleCopy" class="!font-size-3">
                  {{ scope.row.customerId }}
                </el-button>
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预警类型" align="center" prop="warningType" min-width="200">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.MESSAGE_TYPE" :value="scope.row.warningType" />
        </template>
      </el-table-column>
      <el-table-column label="预警内容" align="center" prop="warningContent" min-width="380" />
      <el-table-column label="微信话术" align="center" prop="wechatMsg" min-width="140">
        <template #default="scope">
          <el-button text :type="scope.row.wechatMsg ? 'primary' : 'info'" @click="handleCopy(scope.row.wechatMsg)"
            :disabled="!scope.row.wechatMsg">
            {{ scope.row.wechatMsg ? '一键复制' : '无' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="handleStatus" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.DISPOSE_STATUS" :value="scope.row.handleStatus" />
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="handleTime" :formatter="dateFormatterYMDHm" min-width="140" />
      <el-table-column label="处理人" align="center" prop="handleUserName" min-width="150" />
      <el-table-column label="图片" min-width="300" align="center">
        <template #default="scope">
          <span v-for="(url, index) in scope.row.agreeImage" :key="index">
            <el-image style="width: 60px; height: 60px" :src="url" :preview-src-list="scope.row.agreeImage"
              preview-teleported :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :initial-index="index"
              fit="scale-down" hide-on-click-modal />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="接收人" align="center" prop="receiveUserName" min-width="150" />
      <el-table-column label="mentor" align="center" prop="mentorName" min-width="150" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="150" />
      <el-table-column label="操作" align="center" fixed="right" min-width="150">
        <template #default="scope">
          <el-popconfirm title="确定处理该预警吗？">
            <template #reference>
              <el-button
                v-if="scope.row.handleStatus === 1 && (scope.row.receiveUserId === useUserStore().getUser.id || scope.row.mentorId === useUserStore().getUser.id)"
                type="primary" link plain>
                处理
              </el-button>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">取消</el-button>
              <el-button type="primary" size="small" @click="updateHandleStatus(scope.row.id, confirm)">
                确定
              </el-button>
            </template>
          </el-popconfirm>
          <!--  1.预警类型：课时点清零预警（System）、旷课预警（System）
                2.本条数据的接收人是当前登录用户
                3.本条数据的mentor是当前登录用户
                4.返还课时点数大于 0
                5.返还类型：未返还过 -->
          <el-button
            v-if="(scope.row.warningType === 7 || scope.row.warningType === 8) && (scope.row.receiveUserId === useUserStore().getUser.id || scope.row.mentorId === useUserStore().getUser.id) && scope.row.returnPoints > 0 && scope.row.returnStatus === 0"
            type="warning" link @click="openForm(scope.row)" v-hasPermi="['crm:warning:returnPoints']">
            返还
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
  <!-- 返还课时点 表单 -->
  <ReturnQqePointsForm ref="returnQqePointsFormRef" @success="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteUserOptions, handleRemoteCustomerOptions,
} from '@/utils/dict'
import { dateFormatterYMDHm, dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { handleCopy } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { useUserStore } from '@/store/modules/user'
import ReturnQqePointsForm from '@/views/crm/customer/warning/ReturnQqePointsForm.vue'
import { WarningApi, WarningVO } from '@/api/crm/customer/warning'
import * as DeptApi from '@/api/system/dept'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 预警 列表 */
defineOptions({ name: 'CustomerWarning' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<WarningVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  warningType: undefined, // 预警类型
  handleStatus: undefined, // 处理状态
  handleTime: [], // 处理时间
  handleUserId: undefined, // 处理人
  receiveUserId: undefined, // 接收人
  mentorId: undefined, // Mentor
  deptId: [], // 所属部门
  createTime: [] // 创建时间
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  handleUser: useRemoteSearch(handleRemoteUserOptions),
  receiveUser: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  warningType: getIntDictOptions(DICT_TYPE.MESSAGE_TYPE).filter(item => item.value !== 26),
  async init() {
    await this.dept.load()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/* 打开学员详情 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningApi.getWarningPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 确认按钮 */
const updateHandleStatus = async (id: number, fn) => {
  try {
    await WarningApi.updateHandleStatus(id)
    message.success('处理成功，已更新处理状态！')
    getList()
    fn()
  } catch {
    message.error('处理失败')
  }
}

/* 课时点清零预警 返还课时点 */
const returnQqePointsFormRef = ref()
const openForm = (row) => {
  returnQqePointsFormRef.value.open(row)
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
    const data = await WarningApi.exportWarning(queryParams)
    download.excel(data, '预警.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  if (useUserStore().getRoles.includes('顾问')) {
    queryParams.mentorId = useUserStore().getUser.id
    queryOptions.mentor.handleSearch(useUserStore().getUser.nickname)
  } else {
    queryParams.mentorId = undefined
  }
  await queryOptions.init()
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
