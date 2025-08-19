<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="优惠券名称" prop="couponId">
            <el-select v-model="queryParams.couponId" placeholder="请输入后选择优惠券" clearable filterable remote multiple
              collapse-tags collapse-tags-tooltip :max-collapse-tags="3" :loading="couponOptionsLoading"
              :remote-method="fetchRemoteCouponOptions" class="!w-240px">
              <el-option v-for="item in couponOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="creator" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                创建人
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择创建人" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="更新时间" prop="updateTime">
            <el-date-picker v-model="queryParams.updateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item prop="updater" @keyup.enter="handleQuery">
            <template #label>
              <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                更新人
              </el-tooltip>
            </template>
            <el-select v-model="queryParams.updater" clearable filterable remote :loading="userOptionsLoading"
              :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择更新人" class="!w-240px">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="券组类型" prop="groupType">
            <el-select v-model="queryParams.groupType" placeholder="请选择券组类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_COUPON_GROUP_TYPE)" :key="dict.value"
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
        <!-- <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="券组名" prop="groupName">
            <el-input
              v-model="queryParams.groupName"
              placeholder="请输入券组名"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:coupon-mutex-group:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:coupon-mutex-group:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border max-height="70vh" :row-key="(row) => row.id"
      class="data-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="序号" align="center" min-width="80" fixed>
        <template #default="scope">
          {{ calculateTableOrderNum(scope.$index, queryParams.pageSize, queryParams.pageNo) }}
        </template>
      </el-table-column>
      <el-table-column label="优惠券组名称" align="center" prop="groupName" min-width="260" fixed show-overflow-tooltip />
      <el-table-column label="券组类型" align="center" prop="groupType" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_COUPON_GROUP_TYPE" :value="scope.row.groupType" />
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称" header-align="center" align="left" min-width="500" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="item in row.coupons" :key="item.id" size="small" class="ml-1 my-1">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="120" />
      <el-table-column label="创建人" align="center" prop="creatorName" min-width="150" />
      <el-table-column label="更新时间" align="center" prop="updateTime" :formatter="dateFormatterYMDHm" min-width="120" />
      <el-table-column label="更新人" align="center" prop="updaterName" min-width="150" />
      <el-table-column label="操作" align="center" min-width="120" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:coupon-mutex-group:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:coupon-mutex-group:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 互斥管理 表单 -->
  <CouponMutexGroupForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions,
  handleRemoteCouponOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { disabledAfterDate, dateFormatterYMDHm } from '@/utils/formatTime'
import { calculateTableOrderNum } from '@/utils/table'
import download from '@/utils/download'
import { CouponMutexGroupApi, CouponMutexGroupVO } from '@/api/crm/sales/coupon/couponMutexGroup'
import CouponMutexGroupForm from './CouponMutexGroupForm.vue'

/** 优惠券互斥组记录 列表 */
defineOptions({ name: 'CouponMutexGroup' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CouponMutexGroupVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponId: [],
  createTime: [],
  creator: undefined,
  updateTime: [],
  updater: undefined,
  groupType: undefined,
  siteId: []
  // groupName: undefined,
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.coupon
const couponOptionsLoading = ref(false)
const couponOptions = ref([])
const fetchRemoteCouponOptions = async (query) => {
  const setCouponOptions = (newValue) => (couponOptions.value = newValue)
  const setCouponLoading = (newValue) => (couponOptionsLoading.value = newValue)
  await handleRemoteCouponOptions(query.trim(), setCouponOptions, setCouponLoading)
}

// 2.user
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

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
    const data = await CouponMutexGroupApi.getCouponMutexGroupPage(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CouponMutexGroupApi.deleteCouponMutexGroup(id)
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
    const data = await CouponMutexGroupApi.exportCouponMutexGroup(exportParams)
    download.excel(data, '优惠券互斥组记录.xls')
  } finally {
    exportLoading.value = false
  }
  cancelSelection()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}
</style>
