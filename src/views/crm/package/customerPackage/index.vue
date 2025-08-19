<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="110">
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
            <el-select-v2 v-model="queryParams.packageId" :options="queryOptions.package.list" placeholder="请选择或检索套餐"
              clearable filterable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否签约" prop="isSign" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isSign" placeholder="请选择是否签约" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐到期时间" prop="expiresTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.expiresTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="课程状态" prop="lessonStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.lessonStatus" placeholder="请选择或检索课程状态" clearable filterable
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.LESSON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
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
          <el-form-item label="开课时间" prop="startLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.startLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课人" prop="stopLessonUserId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.stopLessonUserId" placeholder="请检索后选择停课人" clearable filterable remote
              :loading="queryOptions.stopLessonUser.loading" :remote-method="queryOptions.stopLessonUser.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.stopLessonUser.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="停课时间" prop="stopLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.stopLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
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
          <el-form-item label="解约时间" prop="revokeLessonTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.revokeLessonTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" :disabled-date="disabledAfterDate"
              class="!w-220px" />
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
            <el-select v-model="queryParams.mentorId" placeholder="请检索后选择Mentor" clearable filterable remote
              :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch" class="!w-240px">
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
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" @keyup.enter="handleQuery">
          <el-form-item label="旧站点学号" prop="oldStudentNumber">
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
        <el-button @click="handleQuery" v-hasPermi="['crm:packages:customerpackage:query']">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:packages:customerpackage:query']">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')"
          v-hasPermi="['crm:packages:customerpackage:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:packages:customerpackage:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table class="data-table" v-loading="loading" :data="list" stripe border max-height="70vh"
      @sort-change="handleSortChange" :row-key="(row) => row.id">
      <el-table-column label="学员信息" align="center" prop="customerName" fixed min-width="180">
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
      <el-table-column label="课程状态" align="center" prop="lessonStatus" min-width="110" sortable="custom">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.LESSON_STATUS" :value="scope.row.lessonStatus" />
        </template>
      </el-table-column>
      <el-table-column label="套餐" align="center">
        <el-table-column label="名称" align="center" prop="packageName" min-width="190" sortable="custom" />
        <el-table-column label="是否签约" align="center" prop="isSign" min-width="100" sortable="custom">
          <template #default="scope">
            <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isSign" />
          </template>
        </el-table-column>
        <el-table-column label="上次刷新时间" align="center" prop="flushedTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom" />
        <el-table-column label="下次刷新时间" align="center" prop="nextFlushTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom" />
        <el-table-column label="总剩余刷新次数" align="center" prop="refreshTimes" min-width="100" sortable="custom">
          <template #default="scope">
            <span v-if="scope.row.isSign === false">{{ scope.row.refreshTimes }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center" prop="expiresTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom">
          <template #default="scope">
            <span v-if="scope.row.isSign === false">{{
              formatDate(scope.row.expiresTime, 'YYYY-MM-DD HH:mm')
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="当前消费订单" align="center">
        <el-table-column label="订单类型" align="center" min-width="90" class-name="padding-side-0" sortable="custom">
          <template #default="scope">
            <el-tag v-if="showOrderType(scope.row.lessonStatus)" type="primary" size="small">
              {{ scope.row.orderType }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 只显示当前消费订单的套餐刷新次数 -->
        <el-table-column label="总刷新次数" align="center" prop="totalRefreshTimes" min-width="80" sortable="custom">
          <template #default="scope">
            <span v-if="scope.row.isSign === false && showRefreshTimes(scope.row.lessonStatus)">{{
              scope.row.totalRefreshTimes }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="已刷新次数" align="center" prop="currentRefreshTimes" min-width="80" sortable="custom">
          <template #default="scope">
            <span v-if="scope.row.currentRefreshTimes !== null && showRefreshTimes(scope.row.lessonStatus)">{{
              scope.row.currentRefreshTimes }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余刷新次数" align="center" min-width="85" sortable="custom">
          <template #default="scope">
            <span v-if="scope.row.isSign === false && showRefreshTimes(scope.row.lessonStatus)">
              {{ scope.row.totalRefreshTimes - scope.row.currentRefreshTimes }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="开课" align="center">
        <el-table-column label="开课人" align="center" prop="openLessonUserName" min-width="120" />
        <el-table-column label="时间" align="center" prop="startLessonTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom" />
      </el-table-column>

      <el-table-column label="停课" align="center">
        <el-table-column label="停课人" align="center" prop="stopLessonUserName" min-width="120" />
        <el-table-column label="时间" align="center" prop="stopLessonTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom" />
      </el-table-column>

      <el-table-column label="解约" align="center">
        <el-table-column label="解约人" align="center" prop="revokeLessonUserName" min-width="120" sortable="custom" />
        <el-table-column label="时间" align="center" prop="revokeLessonTime" :formatter="timeWithoutSecondFormat"
          min-width="110" sortable="custom" />
      </el-table-column>

      <el-table-column label="套餐添加人" align="center" prop="creatorName" min-width="120" />

      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
        min-width="110" />

      <el-table-column label="备注" align="center" prop="remark" min-width="150" show-overflow-tooltip />

      <el-table-column label="套餐订单记录" align="center" fixed="right" min-width="85">
        <template #default="scope">
          <el-button plain size="small" @click="goRecord(scope.row.customerId, scope.row.customerName)"
            class="!pl-6px !pr-6px">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="课程操作" align="center" fixed="right" min-width="100" class-name="padding-side-0" v-hasPermi="[
        'crm:packages:customerpackage:openLesson',
        'crm:packages:customerpackage:stopLesson',
        'crm:packages:customerpackage:revokeLesson',
        'crm:packages:customerpackage:restartLesson',
        'crm:packages:customerpackage:delayLesson',
        'crm:packages:customerpackage:cancelSchedule',
        'crm:packages:customerpackage:cancelSchedule'
      ]">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING" color="#43ce1f"
            style="color: #fff" @click="openLessonOperateForm('open', scope.row)" class="!pl-6px !pr-6px"
            v-hasPermi="['crm:packages:customerpackage:openLesson']">
            开课
          </el-button>
          <el-button size="small" v-if="
            scope.row.lessonStatus === LESSON_STATUS.OPEN &&
            scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
          " color="#eddd37" style="color: #6e6e6e" @click="openLessonOperateForm('close', scope.row)"
            class="!pl-6px !pr-6px" v-hasPermi="['crm:packages:customerpackage:stopLesson']"
            :disabled="disableStopLesson(scope.row)">
            停课
          </el-button>
          <el-button size="small" v-if="scope.row.lessonStatus === LESSON_STATUS.OPEN" color="#d1221a"
            style="color: #fff" @click="handelRevokeLesson(scope.row)" class="!pl-6px !pr-6px"
            v-hasPermi="['crm:packages:customerpackage:revokeLesson']">
            解约
          </el-button>
          <el-button size="small" v-if="
            scope.row.lessonStatus === LESSON_STATUS.STOP &&
            scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
          " color="#2f94d1" style="color: #fff" @click="handelRecoverLesson(scope.row)" class="!pl-6px !pr-6px"
            v-hasPermi="['crm:packages:customerpackage:restartLesson']">
            恢复
          </el-button>
          <el-button size="small" v-if="
            scope.row.lessonStatus === LESSON_STATUS.STOP &&
            scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
          " color="#ce4bc2" style="color: #fff" @click="openLessonOperateForm('postpone', scope.row)"
            class="!pl-6px !pr-6px" v-hasPermi="['crm:packages:customerpackage:delayLesson']">
            延期
          </el-button>
          <el-button size="small" v-if="
            scope.row.lessonStatus === LESSON_STATUS.RESERVE_OPEN &&
            scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
          " color="#4970d1" style="color: #fff" @click="handelCancelStartLesson(scope.row)" class="!pl-6px !pr-6px"
            v-hasPermi="['crm:packages:customerpackage:cancelOpenSchedule']">
            取消预约开课
          </el-button>
          <el-button size="small" v-if="
            scope.row.lessonStatus === LESSON_STATUS.RESERVE_STOP &&
            scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
          " color="#497bd1" style="color: #fff" @click="handelCancelStopLesson(scope.row)" class="!pl-6px !pr-6px"
            v-hasPermi="['crm:packages:customerpackage:cancelStopSchedule']">
            取消预约停课
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" min-width="175" class-name="padding-side-0" v-hasPermi="[
        'crm:customer-account:get-main-student',
        'crm:packages:customerpackage:update',
        'crm:packages:customerpackage:delete',
        'crm:package-stop-log:query'
      ]">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goToQQE(null, scope.row.customerId)"
            v-hasPermiAll="['crm:customer-account:get-main-student', 'crm:customer:get:qqe:button']">
            QQE
          </el-button>
          <el-button link type="primary" size="small" class="!ml-1"
            @click="goStopRecord(scope.row.customerId, scope.row.customerName)"
            v-hasPermi="['crm:package-stop-log:query']">
            停课记录
          </el-button>
          <el-button v-if="showEditBtn(scope.row.lessonStatus)" class="!ml-1" link type="primary" size="small"
            @click="openForm('update', scope.row.id, scope.row.customerName)"
            v-hasPermi="['crm:packages:customerpackage:update']">
            编辑
          </el-button>
          <!-- pendding 才允许删除 -->
          <el-button v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING" class="!ml-1" link type="danger"
            size="small" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:packages:customerpackage:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 课时点套餐 表单 -->
  <CustomerPackageForm ref="formRef" @success="getList" />
  <!-- 课程操作 表单 -->
  <LessonOperateForm ref="lessonOperateFormRef" @success="getList" />
  <!-- 学员详情 抽屉 -->
  <CustomerDrawer ref="CustomerDrawerRef" @refresh-customer-list="getList" />
</template>

<script setup lang="ts">
import router from '@/router'
import {
  DICT_TYPE, getIntDictOptions, getBoolDictOptions, customerTypeOption,
  handleRemoteCustomerOptions, getPackagesOptions, handleRemoteUserOptions
} from '@/utils/dict'
import { LESSON_STATUS, PACKAGE_TYPE } from '@/utils/constants'
import { handleCopy } from '@/utils/common'
import { goToQQE } from '@/utils/navigation'
import download from '@/utils/download'
import { handleSortfields } from '@/utils/table'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { formatDate, disabledAfterDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat, dateWithoutTimeFormat } from '@/utils/formatter'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { CustomerDrawer } from '@/layout/components/CustomerDrawer'
import * as DeptApi from '@/api/system/dept'
import { CustomerPackageApi, CustomerPackageVO } from '@/api/crm/package/customerPackage'
import { PutOffApi, PutOffVO } from '@/api/crm/package/putOff'
import CustomerPackageForm from './CustomerPackageForm.vue'
import LessonOperateForm from './LessonOperateForm.vue'

/** 学员套餐管理 列表 */
defineOptions({ name: 'CustomerPackage' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CustomerPackageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerType: 1, // 学员类型
  customerId: undefined, // 学员
  packageId: undefined,
  isSign: undefined,
  startLessonTime: [],
  expiresTime: [],
  lessonStatus: undefined,
  stopLessonTime: [],
  openLessonUserId: undefined,
  stopLessonUserId: undefined,
  revokeLessonTime: [],
  revokeLessonUserId: undefined,
  createTime: [],
  mentorId: undefined,
  deptId: [],
  oldStudentNumber: undefined, // 旧站点学号
  oldSiteId: undefined, // 所属旧站点
  orderBy: ['']
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  openLessonUser: useRemoteSearch(handleRemoteUserOptions),
  stopLessonUser: useRemoteSearch(handleRemoteUserOptions),
  revokeLessonUser: useRemoteSearch(handleRemoteUserOptions),
  mentor: useRemoteSearch(handleRemoteUserOptions),
  package: {
    list: ref([]),
    async get() {
      this.list = await getPackagesOptions('point')
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
    await this.package.get()
  }
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerPackageApi.getCustomerPackagePage(queryParams)
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
const openForm = (type: string, id?: number, name?: string) => {
  formRef.value.open(type, id, name)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerPackageApi.deleteCustomerPackage(id)
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
    const data = await CustomerPackageApi.exportCustomerPackage(queryParams)
    download.excel(data, '学员套餐管理.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/* 表格排序字段变化 */
const handleSortChange = (data) => {
  queryParams.orderBy = handleSortfields(data)
  handleQuery()
}

/** 控制列表订单类型显示 */
const showOrderType = (lessonStatus: number) => {
  return (
    lessonStatus !== LESSON_STATUS.PENDING &&
    lessonStatus !== LESSON_STATUS.REVOKE &&
    lessonStatus !== LESSON_STATUS.EXPIRE
  )
}

/** 控制刷新次数显示  */
const showRefreshTimes = (lessonStatus: number) => {
  return (lessonStatus === LESSON_STATUS.OPEN || lessonStatus === LESSON_STATUS.RESERVE_STOP || lessonStatus === LESSON_STATUS.STOP)
}

/** 控制列表编辑按钮显示  */
const showEditBtn = (lessonStatus: number) => {
  return lessonStatus !== LESSON_STATUS.REVOKE && lessonStatus !== LESSON_STATUS.EXPIRE && lessonStatus !== LESSON_STATUS.REFUND
}

/* 开课操作 */
const lessonOperateFormRef = ref()
const openLessonOperateForm = (type: string, id?: number, name?: string) => {
  lessonOperateFormRef.value.open(type, id, name)
}

/* 课程操作 */
// 0.停课按钮禁用 最后一个月且无可切换套餐不允许停课
const disableStopLesson = (row) => {
  return row.refreshTimes === 0 && row.changePackageStatus === false && !row.changePackageId
}
// 1.解约
const handelRevokeLesson = async (row) => {
  try {
    const data = { id: row.id, customerId: row.customerId, packageId: row.packageId }
    await message.confirm('请确认已与学员沟通。确认进行套餐解约吗？')
    await message.confirm('解约套餐为不可逆操作！请再次确认！')
    await CustomerPackageApi.revokeLesson(data)
    await message.confirm('已为该学员解约成功。')
    // 刷新 table
    await getList()
  } catch (e) {
    console.log('handelRevokeLesson', e)
  }
}

// 2.取消预约停课
const handelCancelStopLesson = async (row) => {
  try {
    const putOffRecordeRes = await PutOffApi.getPutOffRecord(
      row.customerId,
      row.id,
      row.lessonStatus
    )
    const data = { id: row.id, customerId: row.customerId, packageId: row.packageId }
    const reservedStopTime = formatDate(putOffRecordeRes.putOffTime, 'YYYY-MM-DD')
    await message.confirm(`确定取消预约停课吗？预约停课日期: ${reservedStopTime}`)
    await CustomerPackageApi.cancelStopSchedule(data)
    await message.confirm('已为该学员取消预约停课操作。')
    // 刷新 table
    await getList()
  } catch (e) {
    console.log(e)
  }
}

// 3.取消预约开课
const handelCancelStartLesson = async (row) => {
  try {
    const putOffRecordeRes = await PutOffApi.getPutOffRecord(
      row.customerId,
      row.id,
      row.lessonStatus
    )
    const data = { id: row.id, customerId: row.customerId, packageId: row.packageId }
    const reservedStartTime = formatDate(putOffRecordeRes.putOffTime, 'YYYY-MM-DD')
    await message.confirm(`确定取消预约开课吗？预约开课日期: ${reservedStartTime}`)
    await CustomerPackageApi.cancelOpenSchedule(data)
    await message.confirm('已为该学员取消预约开课操作。')
    await getList()
  } catch (e) {
    console.log(e)
  }
}

// 4.恢复
const handelRecoverLesson = async (row) => {
  try {
    const data = { id: row.id, customerId: row.customerId, packageId: row.packageId }
    await message.confirm('确定恢复学员套餐？')
    await CustomerPackageApi.restartLesson(data)
    await message.confirm('已为该学员恢复套餐。')
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/* 打开学员详情抽屉 */
const CustomerDrawerRef = ref()
const handleOpenDrawer = (id: number, name: string) => {
  CustomerDrawerRef.value.openDrawer(id, name)
}

/** 订单交付 */
const goRecord = (customerId, customerName) => {
  router.push({
    name: 'Record',
    query: {
      customerId,
      customerName
    }
  })
}

/** 查看停课记录  */
const goStopRecord = (customerId, customerName) => {
  router.push({
    name: 'StopLog',
    query: {
      customerId,
      customerName
    }
  })
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
