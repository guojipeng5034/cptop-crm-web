<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="130">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动名称（外部）" prop="activityNameVisible" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.activityNameVisible" placeholder="请输入活动名称（外部）" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动名称（内部）" prop="activityNameInternal" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.activityNameInternal" placeholder="请输入活动名称（内部）" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员限制" prop="customerLimit" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerLimit" placeholder="请选择学员限制" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_LIMIT)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动开始时间" prop="activityStartTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.activityStartTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动结束时间" prop="activityEndTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.activityEndTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="审核方式" prop="autoAuditStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.autoAuditStatus" placeholder="请选择审核方式" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.AUTO_AUDIT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="奖励发放方式" prop="rewardStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.rewardStatus" placeholder="请选择奖励发放方式" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REWARD_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动状态" prop="activityStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityStatus" clearable placeholder="请选择活动状态" class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
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
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:activity-manage:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:activity-manage:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="活动名称(外部)" align="center" prop="activityNameVisible" min-width="300" />
      <el-table-column label="活动名称(内部)" align="center" prop="activityNameInternal" min-width="300" />
      <el-table-column label="学员限制" align="center" prop="customerLimit" width="300">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CUSTOMER_LIMIT" :value="scope.row.customerLimit" />
        </template>
      </el-table-column>
      <el-table-column label="活动开始时间" align="center" prop="activityStartTime" :formatter="dateFormatterYMDHms"
        width="180" />
      <el-table-column label="活动结束时间" align="center" prop="activityEndTime" :formatter="dateFormatterYMDHms"
        width="180" />
      <el-table-column label="审核方式" align="center" prop="autoAuditStatus" width="160">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.AUTO_AUDIT_STATUS" :value="scope.row.autoAuditStatus" />s
        </template>
      </el-table-column>
      <el-table-column label="奖励发放方式" align="center" prop="rewardStatus" width="160">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.REWARD_STATUS" :value="scope.row.rewardStatus" />
        </template>
      </el-table-column>
      <el-table-column label="奖励类型" align="center" prop="rewardType" :show-overflow-tooltip="false" width="180">
        <template #default="scope">
          <el-tag v-for="item in scope.row.rewardTypeName" :key="item" type="primary" class="mr-1.8">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" align="center" prop="activityStatus" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.activityStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" fixed="right">
        <template #default="scope">
          <el-button v-if="!scope.row.posterId" link type="success"
            @click="openPosterForm('create', undefined, scope.row.id)">
            新建海报
          </el-button>
          <el-button v-else link type="warning" @click="openPosterForm('update', scope.row.posterId, scope.row.id)">
            海报
          </el-button>
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:activity-manage:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:activity-manage:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 活动设置 表单 -->
  <ActivityManageForm ref="activityManageFormRef" @success="getList" />
  <!-- 海报 表单 -->
  <PosterForm ref="posterFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { ActivityManageApi, ActivityManageVO } from '@/api/crm/activity/activityManage'
import ActivityManageForm from './ActivityManageForm.vue'
import PosterForm from '@/views/crm/sales/poster/poster/PosterForm.vue'

/** 活动设置 列表 */
defineOptions({ name: 'ActivityManage' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ActivityManageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  activityNameVisible: undefined,
  activityNameInternal: undefined,
  customerLimit: undefined,
  activityStartTime: [],
  activityEndTime: [],
  rewardNumber: undefined,
  couponId: undefined,
  // posterId: undefined,
  activityStatus: undefined,
  wechatScript: undefined,
  autoAuditStatus: undefined,
  rewardStatus: undefined,
  rewardType: undefined,
  siteId: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ActivityManageApi.getActivityManagePage(queryParams)
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

/** 活动设置 表单操作 */
const activityManageFormRef = ref()
const openForm = (type: string, id?: number) => {
  activityManageFormRef.value.open(type, id)
}

/** 海报 表单操作 */
const posterFormRef = ref()
const openPosterForm = (type: string, id: undefined, activityId?: number) => {
  posterFormRef.value.open(type, id, activityId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ActivityManageApi.deleteActivityManage(id)
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
    // 发起导出
    exportLoading.value = true
    const data = await ActivityManageApi.exportActivityManage(queryParams)
    download.excel(data, '活动设置.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}
</style>