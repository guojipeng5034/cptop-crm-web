<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="名称" prop="skillGroupName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.skillGroupName" placeholder="请输入名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="展示名" prop="displayName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.displayName" placeholder="请输入展示名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="媒体类型" prop="mediaType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mediaType" placeholder="请选择媒体类型" clearable class="!w-240px">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CCC_MEDIA_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="技能组编号" prop="skillGroupId" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.skillGroupId" placeholder="请输入技能组编号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:ccc:skillgroup:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:ccc:skillgroup:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="名称" align="center" prop="skillGroupName" />
      <el-table-column label="关联的号码数量" align="center" prop="phoneNumberCount" />
      <el-table-column label="关联的坐席数量" align="center" prop="userCount" />
      <el-table-column label="展示名" align="center" prop="displayName" />
      <el-table-column label="媒体类型" align="center" prop="mediaType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CCC_MEDIA_TYPE" :value="scope.row.mediaType" />
        </template>
      </el-table-column>
      <el-table-column label="技能组编号" align="center" prop="skillGroupId" />
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { CccSkillGropApi, CccSkillGropVO } from '@/api/crm/ccc/skillgroup'

/** 阿里云外呼技能组 列表 */
defineOptions({ name: 'CccSkillGroup' })

/* 配置项 */
const loading = ref(true) // 列表的加载中
const list = ref<CccSkillGropVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  skillGroupName: undefined,
  displayName: undefined,
  mediaType: undefined,
  skillGroupId: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CccSkillGropApi.getCccSkillGropPage(queryParams)
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