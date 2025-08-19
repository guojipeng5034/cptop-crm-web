<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="85px">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐名称" prop="name" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐类型" prop="packagesType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packagesType" placeholder="请选择套餐类型" clearable filterable multiple class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否签约" prop="isSign" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isSign" placeholder="请选择是否签约" clearable class="!w-240px"
              :disabled="isSignDisabled">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="套餐状态" prop="packagesStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.packagesStatus" placeholder="请选择套餐状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="保值标识" prop="hedgingTag" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.hedgingTag" placeholder="请选择套餐保值标识" clearable filterable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PACKAGES_HEDGING_TAG)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:base:packages:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:base:packages:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:base:packages:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:base:packages:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="套餐名称" header-align="center" align="left" prop="name" width="300">
        <template #default="{ row }">
          <arco-tag v-show="row.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="row.hedgingTag" size="small"/>
          <span class="ml-1">{{ row.name }}</span>            
        </template>
      </el-table-column>
      <el-table-column label="套餐类型" align="center" prop="packagesType" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.PACKAGES_TYPE" :value="scope.row.packagesType" />
        </template>
      </el-table-column>
      <el-table-column label="是否签约" align="center" prop="isSign" min-width="130">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isSign" />
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="price" min-width="100" />
      <el-table-column label="课时点数" align="center" prop="points" min-width="100" />
      <el-table-column label="套餐状态" align="center" prop="packagesStatus" min-width="100">
        <template #default="scope">
          <arco-tag :size="'large'" :type="DICT_TYPE.PACKAGES_STATUS" :value="scope.row.packagesStatus"
            v-hasNotPermi="['crm:base:packages:update']" />
          <el-switch v-model="scope.row.packagesStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="启用" inactive-text="停用" @change="handleStatusChange(scope.row)"
            v-hasPermi="['crm:base:packages:update']" />
        </template>
      </el-table-column>
      <el-table-column label="有效日期" align="center" width="200">
        <template #default="scope">
          {{ dateObjectToStr2(scope.row.effectiveTime) }} -
          {{ dateObjectToStr2(scope.row.noneffctiveTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right" v-hasPermiAll="['crm:base:packages:update']">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:base:packages:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 套餐 表单 -->
  <PackageForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateObjectToStr2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { CommonStatusEnum1 } from '@/utils/constants'
import { PackageApi, PackageVO } from '@/api/crm/package/package'
import PackageForm from './PackageForm.vue'

/** 套餐 列表 */
defineOptions({ name: 'Package' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<PackageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  packagesType: [],
  isSign: undefined,
  packagesId: undefined,
  packagesStatus: undefined,
  effectiveTime: [],
  noneffctiveTime: [],
  hedgingTag: undefined
})

/* 是否签约禁用 */
const isSignDisabled = ref(false)

watch(() => queryParams.packagesType, (val) => {
  if (val !== 5) {
    isSignDisabled.value = false
  } else {
    isSignDisabled.value = true
    queryParams.isSign = undefined
  }
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.packagesStatus === CommonStatusEnum1.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.name}”该套餐吗?`)
    // 发起修改状态，由于el-switch已经修改了，所以两次状态设置为相同
    switch (row.packagesStatus) {
      case CommonStatusEnum1.ENABLE:
        await PackageApi.updatePackagesStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await PackageApi.updatePackagesStatus(row.id, CommonStatusEnum1.DISABLE)
        break
    }
  } catch {
    // 取消后，进行恢复按钮
    row.packagesStatus =
      row.packagesStatus === CommonStatusEnum1.ENABLE
        ? CommonStatusEnum1.DISABLE
        : CommonStatusEnum1.ENABLE
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PackageApi.getPackagesPage(queryParams)
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PackageApi.exportPackages(queryParams)
    download.excel(data, '套餐.xlsx')
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

:deep(.el-radio-button__inner) {
  padding-inline: 40px;
}
</style>