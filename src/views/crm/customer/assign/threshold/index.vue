<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="search-form -mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="80">
      <el-row>
        <el-col :span="24" class="tip">
          针对非“定向分配”的分配策略，可配置每人每天的阈值上限。
        </el-col>
        <el-col :span="24" class="threshold">
          <el-form-item label="默认阈值" label-width="130">
            <span v-if="defaultRes.thresholdType === 1">
              每天自动分配上限<span class="m-inline-3">{{ defaultRes.assignThreshold }}</span>人
            </span>
            <span v-else>不设上限</span>
            <el-button type="primary" size="small" auto-insert-space class="m-l-4"
              @click="openForm('updateDefault')">修改</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="threshold">
          <el-form-item label="特殊阈值" label-width="130">
            可以对新人或金牌顾问下调或上浮每天系统自动分配的上限。优先级：特殊阈值>默认阈值。
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="顾问" prop="mentorId">
            <el-select v-model="queryParams.mentorId" placeholder="请检索后选择顾问" clearable filterable remote
              :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="分配阈值" prop="assignThreshold">
            <el-input v-model="queryParams.assignThreshold" placeholder="请输入分配阈值" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
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
        <el-button type="primary" plain @click="openForm('create')"
          v-hasPermi="['crm:list-owner-assign-threshold:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:list-owner-assign-threshold:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip>
      <el-table-column label="顾问" align="center" prop="mentorName" min-width="120" />
      <el-table-column label="分配阈值" align="center" prop="assignThreshold" min-width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" min-width="120" />
      <el-table-column label="更新者" align="center" prop="updaterName" min-width="120" />
      <el-table-column label="操作" align="center" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('updateSpecial', scope.row.id)"
            v-hasPermi="['crm:list-owner-assign-threshold:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:list-owner-assign-threshold:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 特殊阈值管理 表单 -->
  <ThresholdForm ref="formRef" @success="getList(), getDefaultAssignThreshold()" />
</template>

<script setup lang="ts">
import { handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ListOwnerAssignThresholdApi, ListOwnerAssignThresholdVO } from '@/api/crm/customer/assign/threshold'
import ThresholdForm from './ThresholdForm.vue'

/** 阈值管理 列表 */
defineOptions({ name: 'AssignThreshold' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<ListOwnerAssignThresholdVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中
const defaultRes = ref({
  thresholdType: null,
  assignThreshold: null
}) // 默认分配阈值结果
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mentorId: undefined,
  assignThreshold: undefined,
  createTime: []
})

/* 选项列表 */
const queryOptions = reactive({
  mentor: useRemoteSearch(handleRemoteUserOptions),
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ListOwnerAssignThresholdApi.getListOwnerAssignThresholdPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 获取默认分配阈值
const getDefaultAssignThreshold = async () => {
  defaultRes.value = await ListOwnerAssignThresholdApi.getDefaultAssignThreshold()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getDefaultAssignThreshold()
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
    await ListOwnerAssignThresholdApi.deleteListOwnerAssignThreshold(id)
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
    const data = await ListOwnerAssignThresholdApi.exportListOwnerAssignThreshold(queryParams)
    download.excel(data, '特殊阈值.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getDefaultAssignThreshold()
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

  .tip {
    margin-block: 22px;
  }

  .threshold {
    :deep(.el-form-item__label) {
      display: inline-block;
      text-align: left;
      text-align-last: left;
      font-weight: 700;
      color: #000;
    }
  }

}
</style>