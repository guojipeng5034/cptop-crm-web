<template>
  <el-tab-pane name="package">
    <template #label>
      <div class="custom-tabs-label pt-4px pb-4px">
        <Icon icon="fa:building" />
        <span>套餐</span>
      </div>
    </template>
    <template #default>
      <el-tabs type="border-card" stretch v-model="activeTabName" @tab-change="getList" class="!mr-10px">
        <el-tab-pane label="课时点套餐" name="point" class="!pt-0 !pb-0">
          <div class="point-title flex justify-end">
            <div class="point-create mt--5px mb-10px">
              <el-button type="primary" plain @click="openForm('create')" size="small"
                v-hasPermi="['crm:packages:customerpackage:create']">
                <Icon icon="ep:plus" class="mr-5px" /> 新增
              </el-button>
            </div>
          </div>
          <!-- 列表 -->
          <el-scrollbar max-height="calc(100vh - 320px)">
            <el-table v-loading="loading" :data="list" stripe border>
              <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
              <el-table-column label="课程状态" align="center" prop="lessonStatus" width="90">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.LESSON_STATUS" :value="scope.row.lessonStatus" />
                </template>
              </el-table-column>
              <el-table-column label="套餐" align="center">
                <el-table-column label="名称" align="center" prop="packageName" min-width="195" />
                <el-table-column label="类型" align="center" prop="packageType" width="85">
                  <template #default="scope">
                    <arco-tag :type="DICT_TYPE.PACKAGES_TYPE" :value="scope.row.packageType" />
                  </template>
                </el-table-column>
                <el-table-column label="上次刷新时间" align="center" prop="flushedTime" :formatter="timeWithoutSecondFormat"
                  width="110" />
                <el-table-column label="下次刷新时间" align="center" prop="nextFlushTime" :formatter="timeWithoutSecondFormat"
                  width="110" />
                <el-table-column label="总剩余刷新次数" align="center" prop="refreshTimes" width="100">
                  <template #default="scope">
                    <span v-if="scope.row.isSign === false">{{ scope.row.refreshTimes }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="到期时间" align="center" prop="expiresTime" :formatter="timeWithoutSecondFormat"
                  width="110">
                  <template #default="scope">
                    <span v-if="scope.row.isSign === false">
                      {{ formatDate(scope.row.expiresTime, 'YYYY-MM-DD HH:mm')
                      }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column label="当前消费订单" align="center">
                <el-table-column label="订单类型" align="center" width="90" class-name="padding-side-0">
                  <template #default="scope">
                    <el-tag v-if="showOrderType(scope.row.lessonStatus)" type="primary" size="small">{{
                      scope.row.orderType }}</el-tag>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="到期时间" align="center" prop="expiresTime" :formatter="timeWithoutSecondFormat"
                  width="110">
                  <template #default="scope">
                    <span v-if="scope.row.isSign === false">{{
                      formatDate(scope.row.expiresTime, 'YYYY-MM-DD HH:mm')
                    }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>

                <!-- 只显示当前消费订单的套餐刷新次数 -->
                <el-table-column label="总刷新次数" align="center" prop="totalRefreshTimes" width="80">
                  <template #default="scope">
                    <span v-if="scope.row.isSign === false && showRefreshTimes(scope.row.lessonStatus)">{{
                      scope.row.totalRefreshTimes }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="已刷新次数" align="center" prop="currentRefreshTimes" width="80">
                  <template #default="scope">
                    <span v-if="
                      scope.row.currentRefreshTimes !== null &&
                      showRefreshTimes(scope.row.lessonStatus)
                    ">{{ scope.row.currentRefreshTimes }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="剩余刷新次数" align="center" width="85">
                  <template #default="scope">
                    <span v-if="scope.row.isSign === false && showRefreshTimes(scope.row.lessonStatus)">
                      {{ scope.row.totalRefreshTimes - scope.row.currentRefreshTimes }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column label="开课" align="center">
                <el-table-column label="开课人" align="center" prop="openLessonUserName" width="150" />

                <el-table-column label="时间" align="center" prop="startLessonTime" :formatter="timeWithoutSecondFormat"
                  width="110px" />
              </el-table-column>

              <el-table-column label="停课" align="center">
                <el-table-column label="停课人" align="center" prop="stopLessonUserName" width="150" />

                <el-table-column label="时间" align="center" prop="stopLessonTime" :formatter="timeWithoutSecondFormat"
                  width="110px" />
              </el-table-column>

              <el-table-column label="解约" align="center">
                <el-table-column label="解约人" align="center" prop="revokeLessonUserName" width="150" />

                <el-table-column label="时间" align="center" prop="revokeLessonTime" :formatter="timeWithoutSecondFormat"
                  width="110px" />
              </el-table-column>

              <el-table-column label="套餐添加人" align="center" prop="creatorName" width="120" />

              <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
                width="110" />

              <el-table-column label="备注" align="center" prop="remark" min-width="150" :show-overflow-tooltip="true" />

              <el-table-column label="套餐订单记录" align="center" fixed="right" width="85">
                <template #default="scope">
                  <el-button plain size="small" @click="goRecord(scope.row.customerId, scope.row.customerName)"
                    class="!pl-6px !pr-6px">
                    查看
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="课程操作" align="center" fixed="right" width="120" v-hasPermi="[
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
                  " color="#4970d1" style="color: #fff" @click="handelCancelStartLesson(scope.row)"
                    class="!pl-6px !pr-6px" v-hasPermi="['crm:packages:customerpackage:cancelOpenSchedule']">
                    取消预约开课
                  </el-button>
                  <el-button size="small" v-if="
                    scope.row.lessonStatus === LESSON_STATUS.RESERVE_STOP &&
                    scope.row.packageType !== PACKAGE_TYPE.QQE_POINT_PACKET
                  " color="#497bd1" style="color: #fff" @click="handelCancelStopLesson(scope.row)"
                    class="!pl-6px !pr-6px" v-hasPermi="['crm:packages:customerpackage:cancelStopSchedule']">
                    取消预约停课
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right" width="160" v-hasPermi="[
                'crm:package-stop-log:query',
                'crm:packages:customerpackage:update',
                'crm:packages:customerpackage:delete'
              ]">
                <template #default="scope">
                  <el-button link type="primary" size="small" class="!ml-1"
                    @click="goStopLog(scope.row.customerId, scope.row.customerName)"
                    v-hasPermi="['crm:package-stop-log:query']">
                    停课记录
                  </el-button>
                  <el-button link type="primary" size="small" class="!ml-1"
                    @click="openForm('update', scope.row.id, scope.row.customerName)"
                    v-hasPermi="['crm:packages:customerpackage:update']" v-if="showEditBtn(scope.row.lessonStatus)">
                    编辑
                  </el-button>
                  <!-- pendding 才允许删除 -->
                  <el-button link type="danger" size="small" class="!ml-1" @click="handleDelete(scope.row.id)"
                    v-hasPermi="['crm:packages:customerpackage:delete']"
                    v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="pointQueryParams.pageNo" v-model:limit="pointQueryParams.pageSize"
            @pagination="getList" size="small" class="mt-4 !mb-0" />

          <!-- 学员套餐 表单 -->
          <CustomerPackageForm ref="pointFormRef" @success="getList" :hasCustomerId="true"
            :customer-id="props.customerId" />
          <!-- 课程操作弹窗 -->
          <LessonOperateForm ref="lessonOperateFormRef" @success="getList" />
        </el-tab-pane>

        <el-tab-pane label="次卡套餐" name="ticket" class="!pt-0 !pb-0">
          <div class="ticket-title flex justify-end">
            <div class="ticket-create mt--5px mb-10px">
              <el-button type="primary" plain @click="openForm('create')" size="small"
                v-hasPermi="['crm:packages:customerticketpackage:create']">
                <Icon icon="ep:plus" class="mr-5px" /> 新增
              </el-button>
            </div>
          </div>
          <!-- 列表 -->
          <el-scrollbar max-height="calc(100vh - 320px)">
            <el-table v-loading="loading" :data="list" :stripe="true" border
              :header-cell-style="{ background: 'var(--el-fill-color-light)' }">
              <el-table-column label="学员" align="center" prop="customerName" min-width="180" />
              <el-table-column label="套餐" align="center" prop="packageName" width="120" />
              <el-table-column label="开课时间" align="center" prop="startLessonTime" :formatter="timeWithoutSecondFormat"
                width="110px" sortable />
              <el-table-column label="到期时间" align="center" prop="expiresTime" :formatter="timeWithoutSecondFormat"
                width="110px" sortable />
              <el-table-column label="开课人" align="center" prop="openLessonUserName" width="150" />
              <el-table-column label="解约时间" align="center" prop="revokeLessonTime" :formatter="timeWithoutSecondFormat"
                width="110px" sortable />
              <el-table-column label="解约人" align="center" prop="revokeLessonUserName" width="150" />
              <el-table-column label="次卡使用次数" align="center" min-width="120">
                <template #default="scope">
                  {{ scope.row.usedTotal }} / {{ scope.row.useLimit }}
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
              <el-table-column label="套餐添加人" align="center" prop="creatorName" width="120" />
              <el-table-column label="创建时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
                width="110px" sortable />
              <el-table-column label="套餐课程状态" align="center" prop="lessonStatus" width="110">
                <template #default="scope">
                  <arco-tag :type="DICT_TYPE.LESSON_STATUS" :value="scope.row.lessonStatus" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="120" fixed="right" v-hasPermi="[
                'crm:packages:customerticketpackage:openLesson',
                'crm:packages:customerticketpackage:revokeLesson',
                'crm:packages:customerticketpackage:delete'
              ]">
                <template #default="scope">
                  <el-button size="small" color="#43ce1f" style="color: #fff" type="primary"
                    @click="handleLessonOperate(scope.row)"
                    v-hasPermi="['crm:packages:customerticketpackage:openLesson']"
                    v-if="scope.row.lessonStatus === LESSON_STATUS.PENDING">
                    开课
                  </el-button>
                  <el-button size="small" color="#d1221a" style="color: #fff" type="warning"
                    @click="handleLessonOperate(scope.row)"
                    v-hasPermi="['crm:packages:customerticketpackage:revokeLesson']"
                    v-if="scope.row.lessonStatus === LESSON_STATUS.OPEN">
                    解约
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
          </el-scrollbar>
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="ticketQueryParams.pageNo" v-model:limit="ticketQueryParams.pageSize"
            @pagination="getList" size="small" class="mt-4 !mb-0" />
          <!-- 学员次卡套餐 表单 -->
          <CustomerTicketPackageForm ref="ticketFormRef" @success="getList" :hasCustomerId="true"
            :customer-id="props.customerId" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-tab-pane>
</template>

<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { LESSON_STATUS, PACKAGE_TYPE } from '@/utils/constants'
import { timeWithoutSecondFormat } from '@/utils/formatter'
/* api */
import { CustomerPackageApi, CustomerPackageVO } from '@/api/crm/package/customerPackage'
import {
  CustomerTicketPackageApi,
  CustomerTicketPackageVO
} from '@/api/crm/package/customerTicketPackage'
import { PutOffApi, PutOffVO } from '@/api/crm/package/putOff'
/* vue */
import CustomerPackageForm from '@/views/crm/package/customerPackage/CustomerPackageForm.vue'
import LessonOperateForm from '@/views/crm/package/customerPackage/LessonOperateForm.vue'
import CustomerTicketPackageForm from '@/views/crm/package/customerTicketPackage/CustomerTicketPackageForm.vue'
import router from '@/router'

/** 套餐 Tab */
defineOptions({ name: 'PackageTab' })

const props = defineProps({
  customerId: {
    type: Number
  },
  customerName: {
    type: String
  }
})

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<PutOffVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const route = useRoute()

/* 当前学员 id */
const currentCustomerId = ref()

/* 课时点套餐/次卡套餐 */
const activeTabName = ref('') // tabs 绑定的 tab name point--课时点套餐； ticket--次卡套餐

/* 积分请求参数 */
const pointQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined
})

/* 次卡请求参数 */
const ticketQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  packageId: undefined,
  startLessonTime: [],
  expiresTime: [],
  openLessonUserId: undefined,
  revokeLessonTime: [],
  revokeLessonUserId: undefined,
  createTime: [],
  lessonStatus: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    let data = {}
    if (activeTabName.value === 'point') {
      data = await CustomerPackageApi.getCustomerPackagePage(pointQueryParams)
    } else if (activeTabName.value === 'ticket') {
      data = await CustomerTicketPackageApi.getCustomerTicketPackagePage(ticketQueryParams)
    }
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const pointFormRef = ref()
const ticketFormRef = ref()
const openForm = (type: string, id?: number, name?: string) => {
  name = props.customerName //新增时通过 name 绑定学员 select 组件
  const customerId = props.customerId
  if (activeTabName.value === 'point') {
    pointFormRef.value.open(type, id, name, customerId)
  } else if (activeTabName.value === 'ticket') {
    ticketFormRef.value.open(type, id, name, customerId)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    if (activeTabName.value === 'point') {
      await CustomerPackageApi.deleteCustomerPackage(id)
    } else if (activeTabName.value === 'ticket') {
      await CustomerTicketPackageApi.deleteCustomerTicketPackage(id)
    }
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
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
  return (
    lessonStatus === LESSON_STATUS.OPEN ||
    lessonStatus === LESSON_STATUS.RESERVE_STOP ||
    lessonStatus === LESSON_STATUS.STOP
  )
}

/** 控制列表编辑按钮显示  */
const showEditBtn = (lessonStatus: number) => {
  return (
    lessonStatus !== LESSON_STATUS.REVOKE &&
    lessonStatus !== LESSON_STATUS.EXPIRE &&
    lessonStatus !== LESSON_STATUS.REFUND
  )
}

/* Point Tab lesson operates */
const lessonOperateFormRef = ref()
const openLessonOperateForm = (type: string, id?: number, name?: string) => {
  lessonOperateFormRef.value.open(type, id, name)
}
/* 课程操作 */
// 停课按钮禁用 最后一个月且无可切换套餐不允许停课
const disableStopLesson = (row) => {
  return row.refreshTimes === 0 && row.changePackageStatus === false && !row.changePackageId
}

// 解约
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
    // TODO: more tips
    console.log(e)
  }
}

// 取消预约停课
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

// 取消预约开课
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
    // 刷新 table
    await getList()
  } catch (e) {
    console.log(e)
  }
}

// 恢复
const handelRecoverLesson = async (row) => {
  try {
    const data = { id: row.id, customerId: row.customerId, packageId: row.packageId }
    await message.confirm('确定恢复学员套餐？')
    await CustomerPackageApi.restartLesson(data)
    await message.confirm('已为该学员恢复套餐。')
    // 刷新 table
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 订单交付 */
const goRecord = (customerId, customerName) => {
  if (route.name === 'Record') {
    window.location.reload()
  } else {
    router.push({
      name: 'Record',
      query: {
        customerId,
        customerName
      }
    })
  }
}

/** 查看停课记录  */
const goStopLog = (customerId, customerName) => {
  if (route.name === 'StopLog') {
    window.location.reload()
  } else {
    router.push({
      name: 'StopLog',
      query: {
        customerId,
        customerName
      }
    })
  }
}

/* Ticket Tab lesson operates */
/* 开课/解约操作 */
const handleLessonOperate = async (rowData) => {
  const { id, customerId, orderId } = rowData
  const data = {
    id,
    customerId,
    orderId
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
  } catch (e) {
    console.log('handleLessonOperate', e)
  } finally {
    // 刷新 table
    await getList()
  }
}

/* 复位tab */
const resetTabActiveName = () => {
  activeTabName.value = 'point'
}

defineExpose({ getList, resetTabActiveName })

onMounted(() => {
  pointQueryParams.customerId = toRef(props, 'customerId')
  ticketQueryParams.customerId = toRef(props, 'customerId')
  currentCustomerId.value = toRef(props, 'customerId')
  resetTabActiveName()
})
</script>

<style lang="scss" scoped>
/* tabs pane label 图标与文字上下排列*/
/* TODO:抽取至父组件 */
:deep(.el-tabs__item) {
  padding: 4px 20px;
}

.custom-tabs-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
