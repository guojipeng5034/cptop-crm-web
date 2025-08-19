<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="券码链接" prop="couponLink" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.couponLink" placeholder="请输入券码链接" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="类型" prop="type" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.type" placeholder="请选择类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_COUPON_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="使用状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择使用状态" clearable class="!w-240px">
              <el-option v-for="dict in PROMOTION_COUPON_STATUS" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="订单号" prop="orderId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.orderId" placeholder="请输入订单号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="使用时间" prop="employTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.employTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:points-coupon:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:points-coupon:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['crm:points-coupon:create']">
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:points-coupon:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="券码链接" align="center" prop="couponLink" width="1000">
        <template #default="scope">
          <el-button link type="primary" @click="handleCopy" class="!font-size-3 !p-0">
            {{ scope.row.couponLink }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POINTS_COUPON_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="使用状态" align="center" prop="status" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.PROMOTION_COUPON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="使用时间" align="center" prop="employTime" :formatter="dateFormatterYMD" width="260" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 导入积分商品券 表单 -->
  <CouponImportForm ref="couponImportFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMD } from '@/utils/formatTime'
import { handleCopy } from '@/utils/common'
import download from '@/utils/download'
import { PointsCouponApi, PointsCouponVO } from '@/api/crm/sales/pointsCommodity/coupon'
import CouponImportForm from './CouponImportForm.vue'

/** 积分商品券库 列表 */
defineOptions({ name: 'PointsCoupon' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<PointsCouponVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  couponLink: undefined,
  type: undefined,
  status: undefined,
  orderId: undefined,
  employTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单489
const exportLoading = ref(false) // 导出的加载中

const PROMOTION_COUPON_STATUS = getIntDictOptions(DICT_TYPE.PROMOTION_COUPON_STATUS).filter(item => item.value !== 3)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PointsCouponApi.getPointsCouponPage(queryParams)
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

/** 导入按钮操作 */
const couponImportFormRef = ref()
const handleImport = () => {
  couponImportFormRef.value.open()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PointsCouponApi.exportPointsCoupon(queryParams)
    download.excel(data, '积分商品券库.xlsx')
  } catch {
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