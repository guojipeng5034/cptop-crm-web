<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="号码" prop="number" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.number" placeholder="请输入号码" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="active" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.active" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:ccc:phone:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:ccc:phone:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip  max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="号码" align="center" prop="number" />
      <el-table-column label="号码用途" align="center" prop="usage">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CCC_USAGE" :value="scope.row.usage" />
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="省份" align="center" prop="province" />
      <el-table-column label="状态" align="center" prop="active">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.active" />
        </template>
      </el-table-column>
      <el-table-column label="号码创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" width="180" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { CccPhoneNumberApi, CccPhoneNumberVO } from '@/api/crm/ccc/phone'

/** 阿里云外呼电话 列表 */
defineOptions({ name: 'CccPhoneNumber' })

/* 配置项 */
const loading = ref(true) // 列表的加载中
const list = ref<CccPhoneNumberVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  active: undefined,
  number: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CccPhoneNumberApi.getCccPhoneNumberPage(queryParams)
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
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}
</style>