<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerId" placeholder="请输入学员/姓名" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="标题" prop="messageId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.messageId" placeholder="请检索后选择标题" clearable filterable remote
              :loading="queryOptions.wechatMessage.loading" :remote-method="queryOptions.wechatMessage.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.wechatMessage.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动名称" prop="messageTitle" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.messageTitle" clearable placeholder="请输入活动名称" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="预警类型" prop="warningType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.warningType" placeholder="请选择预警类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.MESSAGE_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="Mentor" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索后选择Mentor" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属部门" prop="deptId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.deptId" multiple filterable clearable :data="queryOptions.dept.list"
              :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3" show-checkbox default-expand-all
              placeholder="请选择或检索所属部门" node-key="id"
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
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="预警创建时间" prop="warningCreateTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.warningCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="发送状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择发送状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CUSTOMER_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推送创建人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="queryOptions.creator.loading"
              :remote-method="queryOptions.creator.handleSearch" placeholder="请检索后选择推送创建人" class="!w-240px">
              <el-option v-for="option in queryOptions.creator.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="来源地区" prop="fromArea" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.fromArea" clearable placeholder="请输入来源地区" class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table ref="tableRef" v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" min-width="130" fixed>
        <template #default="scope">
          <div class="student-name flex justify-center items-center">
            <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
              v-truncate="10">
              {{ scope.row.customerName }}
            </el-button>
          </div>
          <div class="student-info font-size-3 c-#777 m-t-1">
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
      <el-table-column label="学员站点" align="center" prop="siteId" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_SITE_TYPE" :value="scope.row.siteId" />
        </template>
      </el-table-column>
      <el-table-column label="发送状态" align="center" prop="status" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_CUSTOMER_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="标题 / 活动名称" align="center" prop="messageTitle" min-width="160">
        <template #default="scope">
          <span v-if="scope.row.messageTitle">{{ scope.row.messageTitle }}</span>
          <span v-else-if="scope.row.title">{{ scope.row.title }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="预警类型" align="center" prop="warningType" min-width="130">
        <template #default="scope">
          <arco-tag v-if="scope.row.warningType" :type="DICT_TYPE.MESSAGE_TYPE" :value="scope.row.warningType" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="失败原因" align="center" prop="faliRemarks" :formatter="formatNullValue" min-width="200" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="120" />
      <el-table-column label="预警创建时间" align="center" prop="warningCreateTime" :formatter="dateFormatterYMD"
        min-width="120" />
      <el-table-column label="推送创建人" align="center" prop="creator" :formatter="formatNullValue" min-width="120" />
      <el-table-column label="操作" align="center" min-width="140">
        <template #default="scope">
          <el-button v-if="scope.row.status === 2" link type="warning" @click="repushCustomer(scope.row)"
            v-hasPermi="['crm:wechat-message:reusePush']">
            重推
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
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions,
  handleRemoteUserOptions, handleRemoteCustomerOptions, handleRemoteWechatMessageOptions
} from '@/utils/dict'
import { formatNullValue } from '@/utils/formatter'
import { dateFormatterYMD, dateFormatterYMDHms } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import * as DeptApi from '@/api/system/dept'
import { WechatCustomerApi, WechatCustomerVO } from '@/api/crm/wechat/customer'

/** 学员微信 列表 */
defineOptions({ name: 'WechatCustommer' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<WechatCustomerVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,  // 学员
  warningType: undefined, // 预警类型	
  siteId: undefined,  // 站点
  messageId: undefined, // 标题
  messageTitle: undefined, // 活动名称
  mentorId: undefined, // mentor
  deptId: [], // 所属部门
  status: undefined, // 发送状态
  createTime: [], // 创建时间
  warningCreateTime: [], // 
  creator: undefined, // 推送创建人
  fromArea: undefined // 来源地区
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  creator: useRemoteSearch(handleRemoteUserOptions),
  wechatMessage: useRemoteSearch(handleRemoteWechatMessageOptions),
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

/* 打开抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WechatCustomerApi.getWechatCustomerExtraPage(queryParams)
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

/* 重推操作 */
const repushCustomer = async (row) => {
  try {
    await WechatCustomerApi.reusePushWechatCustomer(row.id)
    message.success('重推成功')
  } catch (e) {
    message.error('重推失败')
  }
  getList()
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  getList()
})
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}
</style>