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
          <el-form-item label="上架状态" prop="getatableStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.getatableStatus" placeholder="请选择上架状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.GETATABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:sales:suspend:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:sales:suspend:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:sales:suspend:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:sales:suspend:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="有效期类型" align="center" prop="validityType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.VALIDITY_TYPE" :value="scope.row.validityType" />
        </template>
      </el-table-column>
      <el-table-column label="启用状态" align="center" prop="enableStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ENABLE_STATUS" :value="scope.row.enableStatus"
            v-hasNotPermi="['crm:sales:suspend:update']" />
          <el-switch v-model="scope.row.enableStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="启用" inactive-text="停用" @change="handleEnableStatusChange(scope.row)"
            v-hasPermi="['crm:sales:suspend:update']" />
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="getatableStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.GETATABLE_STATUS" :value="scope.row.getatableStatus"
            v-hasNotPermi="['crm:sales:suspend:update']" />
          <el-switch v-model="scope.row.getatableStatus" :active-value="1" :inactive-value="2" inline-prompt
            active-text="上架" inactive-text="下架" @change="handleGetatableStatusChange(scope.row)"
            v-hasPermi="['crm:sales:suspend:update']" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right"
        v-hasPermi="['crm:sales:suspend:update', 'crm:sales:suspend:delete']">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:sales:suspend:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:sales:suspend:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 停课券 表单 -->
  <SuspendForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum1 } from '@/utils/constants'
import { SuspendApi, SuspendVO } from '@/api/crm/sales/suspend/suspend/index'
import SuspendForm from './SuspendForm.vue'

/** 优惠券 列表 */
defineOptions({ name: 'Suspend' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<SuspendVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  discount: undefined,
  validityType: undefined,
  expireDays: undefined,
  enableStatus: undefined,
  getatableStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 修改启用状态 */
const handleEnableStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.enableStatus === CommonStatusEnum1.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.name}”该停课券吗?`)
    switch (row.enableStatus) {
      case CommonStatusEnum1.ENABLE:
        await SuspendApi.updateSuspendEnableStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await SuspendApi.updateSuspendEnableStatus(row.id, CommonStatusEnum1.DISABLE)
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
    await message.confirm(`确认要${text}“${row.name}”该停课券吗?`)
    // 发起修改状态，由于el-switch已经修改了，所以两次状态设置为相同
    switch (row.getatableStatus) {
      case CommonStatusEnum1.ENABLE:
        await SuspendApi.updateSuspendGetatableStatus(row.id, CommonStatusEnum1.ENABLE)
        break
      case CommonStatusEnum1.DISABLE:
        await SuspendApi.updateSuspendGetatableStatus(row.id, CommonStatusEnum1.DISABLE)
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
    const data = await SuspendApi.getSuspendPage(queryParams)
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
    await SuspendApi.deleteSuspend(id)
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
    const data = await SuspendApi.exportSuspend(queryParams)
    download.excel(data, '停课券.xlsx')
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
