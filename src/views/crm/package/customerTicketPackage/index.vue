<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="90">
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
          <el-form-item label="套餐" prop="packageId" @keyup.enter="handleQuery">
            <el-select-v2 v-model="queryParams.packageId" :options="queryOptions.ticketPackage.list"
              placeholder="请选择或检索套餐" clearable filterable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="开课时间" prop="startLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.startLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="到期时间" prop="expiresTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.expiresTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="开课人" prop="openLessonUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.openLessonUserId" placeholder="请检索后选择开课人" clearable filterable remote
              :loading="queryOptions.openLessonUser.loading" :remote-method="queryOptions.openLessonUser.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.openLessonUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="解约时间" prop="revokeLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.revokeLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="解约人" prop="revokeLessonUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.revokeLessonUserId" placeholder="请检索后选择解约人" clearable filterable remote
              :loading="queryOptions.revokeLessonUser.loading"
              :remote-method="queryOptions.revokeLessonUser.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.revokeLessonUser.options" :key="option.value"
                :label="option.label" :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="课程状态" prop="lessonStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.lessonStatus" placeholder="请选择套餐课程状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.LESSON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
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
          <el-form-item label="旧站点学号" prop="oldStudentNumber" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.oldStudentNumber" clearable placeholder="请输入旧站点学号" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="所属旧站点" prop="oldSiteId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.oldSiteId" placeholder="请选择或检索所属旧站点" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:packages:customerticketpackage:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:packages:customerticketpackage:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')"
          v-hasPermi="['crm:packages:customerticketpackage:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:packages:customerticketpackage:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table class="data-table" v-loading="loading" :data="list" stripe border :row-key="(row) => row.id"
      max-height="70vh" @sort-change="handleSortChange">
      <el-table-column label="学员信息" align="center" prop="customerName" min-width="180">
        <template #default="scope">
          <el-button link type="primary" @click="handleOpenDrawer(scope.row.customerId, scope.row.customerName)"
            v-truncate="10">
            {{ scope.row.customerName }}
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
      <el-table-column label="套餐" align="center" prop="packageName" min-width="200" />
      <el-table-column label="次卡使用次数" align="center" min-width="120">
        <template #default="scope">
          {{ scope.row.usedTotal }} / {{ scope.row.useLimit }}
        </template>
      </el-table-column>
      <el-table-column label="开课时间" align="center" prop="startLessonTime" :formatter="timeWithoutSecondFormat"
        min-width="110" sortable="custom" />
      <el-table-column label="到期时间" align="center" prop="expiresTime" :formatter="timeWithoutSecondFormat"
        min-width="110" sortable="custom" />
      <el-table-column label="开课人" align="center" prop="openLessonUserName" min-width="180" />
      <el-table-column label="解约时间" align="center" prop="revokeLessonTime" :formatter="timeWithoutSecondFormat"
        min-width="110" sortable="custom" />
      <el-table-column label="解约人" align="center" prop="revokeLessonUserName" min-width="180" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="套餐添加人" align="center" prop="creatorName" min-width="180" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        sortable="custom" min-width="120" />
      <el-table-column label="课程状态" align="center" prop="lessonStatus" min-width="100">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.LESSON_STATUS" :value="scope.row.lessonStatus" />
        </template>
      </el-table-column>
      <el-table-column label="课程操作" align="center" fixed="right" min-width="100" v-hasPermi="[
        'crm:packages:customerticketpackage:openLesson',
        'crm:packages:customerticketpackage:revokeLesson',
      ]">
        <template #default="scope">
          <el-button size="small" color="#43ce1f" style="color: #fff" type="primary"
            @click="handleLessonOperate(scope.row)" v-hasPermi="['crm:packages:customerticketpackage:openLesson']"
            v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING">
            开课
          </el-button>
          <el-button size="small" color="#d1221a" style="color: #fff" type="warning"
            @click="handleLessonOperate(scope.row)" v-hasPermi="['crm:packages:customerticketpackage:revokeLesson']"
            v-if="scope.row.lessonStatus === LESSON_STATUS.OPEN">
            解约
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="170" fixed="right" v-hasPermi="[
        'crm:packages:customerticketpackage:delete',
        'crm:customer-account:get-main-student'
      ]">
        <template #default="scope">
          <el-button link type="primary" @click="goToQQE(null, scope.row.customerId)"
            v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
            QQE
          </el-button>
          <el-button link type="primary"
            @click="openForm('update', scope.row.id, scope.row.customerName, scope.row.customerId)"
            v-hasPermi="['crm:packages:customerpackage:update']">
            编辑
          </el-button>
          <!-- pendding和已解约才允许删除 -->
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:packages:customerticketpackage:delete']"
            v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING || scope.row.lessonStatus === LESSON_STATUS.REVOKE">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员次卡套餐 表单 -->
  <CustomerTicketPackageForm ref="formRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, getPackagesOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { disabledAfterDate } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import { LESSON_STATUS } from '@/utils/constants'
import { goToQQE } from '@/utils/navigation'
import download from '@/utils/download'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { handleSortfields } from '@/utils/table'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { CustomerTicketPackageApi, CustomerTicketPackageVO } from '@/api/crm/package/customerTicketPackage'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import CustomerTicketPackageForm from './CustomerTicketPackageForm.vue'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'

/** 学员次卡套餐管理 列表 */
defineOptions({ name: 'CustomerTicketPackage' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CustomerTicketPackageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  packageId: undefined, // 套餐
  startLessonTime: [], // 开课时间
  expiresTime: [], // 到期时间
  openLessonUserId: undefined,
  revokeLessonTime: [],
  revokeLessonUserId: undefined,
  createTime: [],
  lessonStatus: undefined,
  mentorId: undefined,
  deptId: [],
  orderBy: [''],
  oldStudentNumber: undefined, // 旧站点学号
  oldSiteId: undefined, // 所属旧站点
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  openLessonUser: useRemoteSearch(handleRemoteUserOptions),
  revokeLessonUser: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  ticketPackage: {
    list: ref([]),
    async get() {
      this.list = await getPackagesOptions('ticket')
    }
  },
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
    await this.ticketPackage.get()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerTicketPackageApi.getCustomerTicketPackagePage(queryParams)
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
const openForm = (type: string, id?: number, name?: string, customerId?: number) => {
  formRef.value.open(type, id, name, customerId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerTicketPackageApi.deleteCustomerTicketPackage(id)
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
    const data = await CustomerTicketPackageApi.exportCustomerTicketPackage(queryParams)
    download.excel(data, '学员次卡套餐管理.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/* 打开学员详情抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/* 开课/解约操作 */
const handleLessonOperate = async (rowData) => {
  const { id, customerId, orderId } = rowData
  const data = {
    id,
    customerId,
    orderId,
  }
  try {
    if (rowData.lessonStatus === 0) {
      await message.confirm('确定为该学员开通套餐吗？')
      await CustomerTicketPackageApi.openTicketPackage(data)
      await message.confirm('已为该学员开通套餐。')
    } else if (rowData.lessonStatus === 1) {
      await message.confirm('请确认已与学员沟通。确认进行套餐解约吗？')
      await message.confirm('解约套餐为不可逆操作！请再次确认！')
      await CustomerTicketPackageApi.revokeTicketPackage(data)
      await message.confirm('已为该学员解约成功。')
    }
    await getList()
  } catch (e) {
    console.log('handleLessonOperate', e)
  }
}

/** 初始化 **/
onMounted(async () => {
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

.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      .cell {
        padding: 0;
      }
    }
  }
}
</style>
