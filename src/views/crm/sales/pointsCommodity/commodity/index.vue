<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="130">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="标题" prop="title" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.title" placeholder="请输入标题" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="站点" prop="siteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.siteId" placeholder="请选择站点" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员限制" prop="studentLimitStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.studentLimitStatus" placeholder="请选择学员限制" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STUDENT_LIMIT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否自动添加商品" prop="autoAddStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.autoAddStatus" placeholder="请选择是否自动添加商品" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_AUTO_ADD_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否有限制" prop="existLimit" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.existLimit" placeholder="请选择是否有限制" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否需要发邮件" prop="sendEmail" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.sendEmail" placeholder="请选择是否需要发邮件" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_SEND_EMAIL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="兑换方式" prop="purchaseMethod" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.purchaseMethod" placeholder="请选择兑换方式" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_PURCHASE_METHOD)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="商品有效时间" prop="validTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.validTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="商品失效时间" prop="invalidTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.invalidTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动状态" prop="activityStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityStatus" placeholder="请选择活动状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
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
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:points-commodity:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:points-commodity:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="warning" plain @click="handleSetting" v-hasPermi="['crm:points-commodity:batch-update']">
          <Icon icon="ep:setting" class="mr-5px" /> 批量设置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh" ref="tableRef"
      @selection-change="handleSelectionChange" :row-key="(row) => row.id">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="标题" align="center" prop="title" fixed="left" min-width="300" />
      <el-table-column label="站点" align="center" prop="siteId" min-width="180" :show-overflow-tooltip="false">
        <template #default="scope">
          <a-tag v-for="siteId in scope.row.siteId" :key="siteId"
            :color="getCssClassByValue(siteId, getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE))">
            {{ getLabelByValue(siteId, getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)) }}
          </a-tag>
        </template>
      </el-table-column>
      <el-table-column label="学员限制" align="center" prop="studentLimitStatus" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.STUDENT_LIMIT_TYPE" :value="scope.row.studentLimitStatus" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否自动添加商品" align="center" prop="autoAddStatus" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POINTS_AUTO_ADD_STATUS" :value="scope.row.autoAddStatus" />
          <arco-tag v-if="scope.row.autoAddStatus == 1" :type="DICT_TYPE.REWARD_TYPE"
            :value="scope.row.autoAddCommodityType" class="m-l-2" />
        </template>
      </el-table-column>
      <el-table-column label="是否有限制" align="center" prop="existLimit" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_INTEGER" :value="scope.row.existLimit" />
        </template>
      </el-table-column>
      <el-table-column label="是否需要发邮件" align="center" prop="sendEmail" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POINTS_SEND_EMAIL" :value="scope.row.sendEmail" />
        </template>
      </el-table-column>
      <el-table-column label="兑换方式" align="center" prop="purchaseMethod" min-width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POINTS_PURCHASE_METHOD" :value="scope.row.purchaseMethod" />
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="inventory" min-width="120" />
      <el-table-column label="商品有效时间" align="center" prop="validTime" :formatter="dateFormatterYMDHms"
        min-width="180" />
      <el-table-column label="商品失效时间" align="center" prop="invalidTime" :formatter="dateFormatterYMDHms"
        min-width="180" />
      <el-table-column label="活动状态" align="center" prop="activityStatus" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.activityStatus" />
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="activityPoints" min-width="140">
        <template #default="scope">
          <div class="flex justify-between"
            :class="scope.row.activityStatus === 0 && scope.row.activityPoints ? 'm-b-1' : ''">
            <el-tag type="primary" class="w-60%">日常使用</el-tag>
            <span class="w-40%">{{ scope.row.points }}</span>
          </div>
          <div v-if="scope.row.activityStatus === 0 && scope.row.activityPoints" class="flex justify-between">
            <el-tag type="success" class="w-60%">活动期间</el-tag>
            <span class="w-40%">{{ scope.row.activityPoints }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="现金" align="center" prop="siteAmount" min-width="150">
        <template #default="{ row }">
          <div v-if="row.siteAmount !== null">
            <div v-if="row.siteAmount.CN" class="flex items-center">
              <el-tag size="small" type="success">CN</el-tag> <span class="ml-2">
                {{ formatDecimal(row.siteAmount.CN) }}
              </span>
            </div>
            <div v-if="row.siteAmount.CPZH" class="flex items-center my-1">
              <el-tag size="small">CPZH</el-tag>
              <span class="ml-2">{{ formatDecimal(row.siteAmount.CPZH) }}</span>
            </div>
            <div v-if="row.siteAmount.CNADT" class="flex items-center">
              <el-tag size="small" type="danger">CNADT</el-tag>
              <span class="ml-2">{{ formatDecimal(row.siteAmount.CNADT) }}</span>
            </div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="活动开始时间" align="center" prop="activityStartTime" :formatter="dateFormatterYMDHms"
        width="180" />
      <el-table-column label="活动结束时间" align="center" prop="activityEndTime" :formatter="dateFormatterYMDHms"
        width="180" />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:points-commodity:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 积分商品 表单 -->
  <PointsCommodityForm ref="formRef" @success="getList" />
  <!-- 批量设置 表单 -->
  <SettingForm ref="settingRef" @success="getList" @cancel-selection="cancelSelection" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, getLabelByValue, getCssClassByValue } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { formatDecimal } from '@/utils/formatter'
import download from '@/utils/download'
import { PointsCommodityApi, PointsCommodityVO } from '@/api/crm/sales/pointsCommodity/commodity'
import PointsCommodityForm from './PointsCommodityForm.vue'
import SettingForm from './SettingForm.vue'

/** 积分商品 列表 */
defineOptions({ name: 'PointsCommodity' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<PointsCommodityVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  title: undefined,
  siteId: undefined,
  studentLimitStatus: undefined,
  points: undefined,
  status: undefined,
  autoAddStatus: undefined,
  ticketCommodity: undefined,
  existLimit: undefined,
  sendEmail: undefined,
  limitCondition: undefined,
  limitCount: undefined,
  purchaseMethod: undefined,
  validTime: [],
  invalidTime: [],
  indexFileSavePath: undefined,
  detailFileSavePath: undefined,
  activityStatus: undefined,
  activityStartTime: [],
  activityEndTime: [],
  activityImg: undefined,
  autoAddCommodityType: undefined,
  pointsCommodity: undefined,
  groupValue: undefined,
  couponCommodity: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PointsCommodityApi.getPointsCommodityPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/* 列表选中状态变化 */
const multipleSelection = ref([])

/* 多选 */
const tableRef = ref()
// 选中变化
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}
// 取消多选
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/* 批量设置操作 */
const settingRef = ref()
const handleSetting = () => {
  if (multipleSelection.value.length === 0) {
    message.warning('请至少选择一个积分商品进行操作')
  } else {
    settingRef.value.open(multipleSelection.value)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PointsCommodityApi.deletePointsCommodity(id)
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
    const data = await PointsCommodityApi.exportPointsCommodity(queryParams)
    download.excel(data, '积分商品.xlsx')
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