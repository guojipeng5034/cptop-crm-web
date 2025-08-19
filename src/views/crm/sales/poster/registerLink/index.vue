<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="链接标题" prop="pageTitle" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.pageTitle" placeholder="请输入链接标题" clearable class="!w-210px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-210px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="类型" prop="fontType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.fontType" placeholder="请选择类型" clearable class="!w-210px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_REGISTER_LINK_FONT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:channel-register-link:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:channel-register-link:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:channel-register-link:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:channel-register-link:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="链接标题" align="center" prop="pageTitle" />
      <el-table-column label="链接地址" align="center" width="550" prop="pageUrl" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"
            v-hasNotPermi="['crm:channel-register-link:update']" />
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" inline-prompt active-text="启用"
            inactive-text="停用" @change="handleStatusChange(scope.row)"
            v-hasPermi="['crm:channel-register-link:update']" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="fontType" width="80">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_REGISTER_LINK_FONT_TYPE" :value="scope.row.fontType"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-hasPermiAll="['crm:channel-register-link:update']">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:channel-register-link:update']">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 注册链接 表单 -->
  <RegisterLinkForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { CommonStatusEnum } from '@/utils/constants'
import { RegisterLinkApi, RegisterLinkVO } from '@/api/crm/sales/poster/registerlink'
import RegisterLinkForm from './RegisterLinkForm.vue'

/** 注册链接 列表 */
defineOptions({ name: 'Registerlink' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<RegisterLinkVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  pageTitle: undefined,
  status: undefined,
  fontType: undefined
})

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要${text}“${row.pageTitle}”该注册链接吗?`)
    // 发起修改状态
    await RegisterLinkApi.updateChannelRegisterLink(row)
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
    const data = await RegisterLinkApi.getChannelRegisterLinkPage(queryParams)
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
    const data = await RegisterLinkApi.exportChannelRegisterLink(queryParams)
    download.excel(data, '注册链接.xlsx')
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