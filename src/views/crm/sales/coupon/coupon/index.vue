<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="名称" prop="name" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.name" placeholder="请输入优惠券名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="优惠券分类" prop="couponType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.couponType" placeholder="请选择优惠券分类" clearable class="!w-240px">
              <el-option v-for="dict in couponTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="有效期类型" prop="validityType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.validityType" placeholder="请选择有效期类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.VALIDITY_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="启用状态" prop="enableStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.enableStatus" placeholder="请选择启用状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐类型" prop="packageType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packageType" placeholder="请选择套餐类型" clearable filterable multiple
              class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐" prop="packageIds" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packageIds" placeholder="请选择套餐" clearable filterable multiple
              class="!w-240px">
              <el-option v-for="dict in packageOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否单独使用" prop="isSingle" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isSingle" placeholder="是否单独使用" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否设置互斥" prop="isMutex" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isMutex" placeholder="是否设置互斥" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否设置互斥失效" prop="isMutexInvalid" @keyup.enter="handleQuery" label-width="auto">
            <el-select v-model="queryParams.isMutexInvalid" placeholder="是否设置互斥失效" clearable class="!w-220px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:coupon:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:coupon:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:sales:coupon:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:coupon:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="primary" plain @click="openMutexGroupForm('batch')"
          v-hasPermi="['crm:coupon-mutex-group:create']">
          <Icon icon="ep:setting" class="mr-5px" /> 互斥失效设置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id" ref="tableRef" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" reserve-selection />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="优惠金额" align="center" prop="discount" />
      <el-table-column label="优惠券分类" align="center" prop="couponType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COUPON_TYPE" :value="scope.row.couponType" />
        </template>
      </el-table-column>
      <el-table-column label="有效期类型" align="center" prop="validityType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.VALIDITY_TYPE" :value="scope.row.validityType" />
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="inventory" />
      <el-table-column label="启用状态" align="center" prop="enableStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ENABLE_STATUS" :value="scope.row.enableStatus"
            v-hasNotPermi="['crm:sales:coupon:update']" />
          <el-switch v-model="scope.row.enableStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="启用" inactive-text="停用" @change="handleEnableStatusChange(scope.row)"
            v-hasPermi="['crm:sales:coupon:update']" />
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="getatableStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.GETATABLE_STATUS" :value="scope.row.getatableStatus"
            v-hasNotPermi="['crm:sales:coupon:update']" />
          <el-switch v-model="scope.row.getatableStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="上架" inactive-text="下架" @change="handleGetatableStatusChange(scope.row)"
            v-hasPermi="['crm:sales:coupon:update']" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creatorName" width="120" />
      <el-table-column label="操作" align="center" fixed="right"
        v-hasPermi="['crm:sales:coupon:update', 'crm:sales:coupon:delete']">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:sales:coupon:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:sales:coupon:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 优惠券 表单 -->
  <CouponForm ref="formRef" @success="getList" />
  <!-- 互斥失效设置 弹窗：创建券组 -->
  <CouponMutexGroupForm ref="mutexGroupFormRef" @cancel-selection="cancelSelection" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getPackagesOptions } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum1 } from '@/utils/constants'
import { CouponApi, CouponVO } from '@/api/crm/sales/coupon/coupon'
import CouponForm from './CouponForm.vue'
import CouponMutexGroupForm from '@/views/crm/sales/coupon/couponMutexGroup/CouponMutexGroupForm.vue'

/** 优惠券 列表 */
defineOptions({ name: 'CouponSet' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<CouponVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  discount: undefined,
  couponType: undefined,
  validityType: undefined,
  expireDays: undefined,
  enableStatus: undefined,
  getatableStatus: undefined,
  packageType: undefined,
  packageIds: undefined,
  isSingle: undefined,
  isMutex: undefined,
  isMutexInvalid: undefined
})
const queryFormRef = ref() // 搜索的表单

/* options */
/* 去除停课券的优惠券类型 */
const couponTypeOptions = computed(() => getIntDictOptions(DICT_TYPE.COUPON_TYPE).filter((item) => item.value !== 4))

/* 全部套餐名称options */
let allPackages = ref()
const packageOption = ref()
// 监听套餐类型动态加载套餐名称options
watch(() => queryParams.packageType, async (newPackageType) => {
  if (newPackageType?.length) {
    packageOption.value = allPackages.value.filter(item => newPackageType.includes(item.packagesType))
  } else {
    packageOption.value = await getPackagesOptions()
  }
})

/** 修改启用状态 */
const handleEnableStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.enableStatus === CommonStatusEnum1.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.name}”该优惠券吗?`)
    switch (row.enableStatus) {
      case CommonStatusEnum1.ENABLE:
        await CouponApi.updateCouponEnableStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await CouponApi.updateCouponEnableStatus(row.id, CommonStatusEnum1.DISABLE)
        break
    }
  } catch {
    // 取消后，进行恢复按钮
    row.enableStatus =
      row.enableStatus === CommonStatusEnum1.ENABLE
        ? CommonStatusEnum1.DISABLE
        : CommonStatusEnum1.ENABLE
  }
}
/** 修改上架状态 */
const handleGetatableStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.getatableStatus === CommonStatusEnum1.ENABLE ? '上架' : '下架'
    await message.confirm(`确认要${text}“${row.name}”该优惠券吗?`)
    // 发起修改状态，由于el-switch已经修改了，所以两次状态设置为相同
    switch (row.getatableStatus) {
      case CommonStatusEnum1.ENABLE:
        await CouponApi.updateCouponGetatableStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await CouponApi.updateCouponGetatableStatus(row.id, CommonStatusEnum1.DISABLE)
        break
    }
  } catch {
    // 取消后，进行恢复按钮
    row.getatableStatus =
      row.getatableStatus === CommonStatusEnum1.ENABLE
        ? CommonStatusEnum1.DISABLE
        : CommonStatusEnum1.ENABLE
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CouponApi.getCouponPage(queryParams)
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
    await CouponApi.deleteCoupon(id)
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
    const data = await CouponApi.exportCoupon(queryParams)
    download.excel(data, '优惠券.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/* 互斥失效设置 */
const mutexGroupFormRef = ref()
const openMutexGroupForm = (type: string) => {
  if (multipleSelection.value.length < 2) {
    message.warning('请至少选择2种优惠券进行操作')
  } else {
    mutexGroupFormRef.value.open(type, null, multipleSelection.value, multiplePageData.value)
  }
}

/** 列表多选 */
/* 列表选中状态变化 */
const multipleSelection = ref([])
const multiplePageData = ref({ list: [], total: 0 })
const tableRef = ref()

/* 选中变化 */
const handleSelectionChange = (val) => {
  console.log(val)
  multipleSelection.value = val.map((item) => item.id)
  multiplePageData.value = {
    list: val.map((item) => ({ customerId: item.id, customerName: item.name })),
    total: val.length
  }
}
/* 取消多选 */
const cancelSelection = () => {
  tableRef?.value.clearSelection()
}

/** 初始化 **/
onMounted(async () => {
  allPackages.value = await getPackagesOptions()
  packageOption.value = allPackages.value
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
