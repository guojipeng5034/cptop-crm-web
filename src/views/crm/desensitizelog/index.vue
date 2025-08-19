<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true" label-width="110px">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="敏感信息查看人" prop="queryUserId">
            <el-select v-model="queryParams.queryUserId" placeholder="请检索后请选择敏感信息查看人" clearable filterable remote
              :loading="userOptionsLoading" :remote-method="fetchRemoteUserOptions" class="!w-240px">
              <el-option v-for="option in userOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="被查看敏感信息ID" prop="queryBizId" label-width="auto">
            <el-input v-model="queryParams.queryBizId" placeholder="请输入被查看敏感信息ID" clearable @keyup.enter="handleQuery"
              class="!w-225px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="敏感信息所属模块" prop="desensitizeSource" label-width="auto">
            <el-select v-model="queryParams.desensitizeSource" placeholder="请选择敏感信息所属模块" clearable class="!w-225px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_DESENSITIZE_SOURCE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="敏感信息类型" prop="desensitizeType">
            <el-select v-model="queryParams.desensitizeType" placeholder="请选择敏感信息类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_DESENSITIZE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否操作成功" prop="result">
            <el-select v-model="queryParams.result" placeholder="请选择操作结果" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="操作时间" prop="createTime">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" v-hasPermi="['crm:sensitize:query']" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" v-hasPermi="['crm:sensitize:query']" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe border show-overflow-tooltip max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="敏感信息查看人" align="center" prop="queryUserName" min-width="150" />
      <el-table-column label="被查看敏感信息ID" align="center" prop="queryBizId" min-width="100" />
      <el-table-column label="敏感信息所属模块" align="center" prop="desensitizeSource" min-width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_DESENSITIZE_SOURCE" :value="scope.row.desensitizeSource" />
        </template>
      </el-table-column>
      <el-table-column label="敏感信息类型" align="center" prop="desensitizeType" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_DESENSITIZE_TYPE" :value="scope.row.desensitizeType" />
        </template>
      </el-table-column>
      <el-table-column label="是否操作成功" align="center" prop="result" min-width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_INTEGER" :value="scope.row.result" />
        </template>
      </el-table-column>
      <el-table-column label="失败原因" align="center" prop="errorLog" />
      <el-table-column label="操作时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="110"
        :show-overflow-tooltip="false" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { DesensitizeLogApi, DesensitizeLogVO } from '@/api/crm/desensitizeLog'
// import DesensitizeLogForm from './DesensitizeLogForm.vue'

/** 查看敏感信息日志 列表 */
defineOptions({ name: 'DesensitizeLog' })

const loading = ref(true) // 列表的加载中
const list = ref<DesensitizeLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  queryUserId: undefined,
  queryBizId: undefined,
  desensitizeSource: undefined,
  desensitizeType: undefined,
  result: undefined,
  errorLog: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/* options */
// 1.user
const userOptions = ref()
const userOptionsLoading = ref(false)
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query.trim(), setUserOptions, setUserLoading)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DesensitizeLogApi.getDesensitizeLogPage(queryParams)
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

/** 初始化 **/
onMounted(() => {
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
}
</style>
