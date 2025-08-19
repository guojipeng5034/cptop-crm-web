<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="商户名" prop="merchantName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.merchantName" placeholder="请输入商户名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="商户类型" prop="merchantType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.merchantType" placeholder="请选择商户类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PAYMENT_LIST)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="货币类型" prop="currencyType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.currencyType" placeholder="请选择货币类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORDER_PAYMENT_CURRENCY)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:merchant-set:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:merchant-set:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:merchant-set:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:merchant-set:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="商户名" align="center" prop="merchantName" />
      <el-table-column label="商户类型" align="center" prop="merchantType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_PAYMENT_LIST" :value="scope.row.merchantType" />
        </template>
      </el-table-column>
      <el-table-column label="货币类型" align="center" prop="currencyType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ORDER_PAYMENT_CURRENCY" :value="scope.row.currencyType" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"
            v-hasNotPermi="['crm:merchant-set:update']" />
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" inline-prompt active-text="启用"
            inactive-text="停用" @change="handleStatusChange(scope.row)" v-hasPermi="['crm:merchant-set:update']" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-hasPermiAll="['crm:merchant-set:update']">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:merchant-set:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MerchantForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import { MerchantApi, MerchantVO } from '@/api/crm/finance/merchant'
import MerchantForm from './MerchantForm.vue'

/** 商户基础配置 列表 */
defineOptions({ name: 'MerchantSet' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<MerchantVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  merchantType: undefined,
  currencyType: undefined,
  merchantName: undefined,
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.merchantName}”该商户吗?`)
    // 发起修改状态
    await MerchantApi.updateMerchant(row)
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MerchantApi.getMerchantPage(queryParams)
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
    const data = await MerchantApi.exportMerchant(queryParams)
    download.excel(data, '商户基础配置.xlsx')
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