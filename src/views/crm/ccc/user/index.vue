<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="登录名" prop="loginName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.loginName" placeholder="请输入登录名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="展示名" prop="displayName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.displayName" placeholder="请输入展示名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="邮箱" prop="email" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="技能组名称" prop="skillGroupName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.skillGroupName" placeholder="请输入技能组名称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="角色名称" prop="roleName" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.roleName" placeholder="请选择角色名称" clearable class="!w-240px">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CCC_ROLE_NAME)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:ccc:user:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:ccc:user:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="坐席登录名" align="center" prop="loginName" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="技能组名称" align="center" prop="skillGroupName" />
      <el-table-column label="角色名称" align="center" prop="roleName">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CCC_ROLE_NAME" :value="scope.row.roleName" />
        </template>
      </el-table-column>
      <el-table-column label="坐席展示名" align="center" prop="displayName" />
      <el-table-column label="工作模式" align="center" prop="workMode">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CCC_WORK_MODE" :value="scope.row.workMode" />
        </template>
      </el-table-column>
      <el-table-column label="系统用户名" align="center" prop="systemUserName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="updateRamKey(scope.row.id)">
            重置密钥
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { CccUserApi, CccUserVO } from '@/api/crm/ccc/user'

/** 阿里云外呼坐席管理 列表 */
defineOptions({ name: 'CccUser' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<CccUserVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  loginName: undefined,
  email: undefined,
  skillGroupName: undefined,
  roleName: undefined,
  displayName: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CccUserApi.getCccUserPage(queryParams)
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

/* 重置密钥 */
const updateRamKey = async (id: number) => {
  try {
    await CccUserApi.updateRamUserKey(id)
    message.success('重置成功')
    getList()
  } catch (e) {
    message.error('重置失败')
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