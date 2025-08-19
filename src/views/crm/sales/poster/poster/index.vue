<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="100">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="活动" prop="activityId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.activityId" placeholder="请选择活动" clearable class="!w-240px">
              <el-option v-for="dict in activityManageOptions" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="海报类型" prop="posterType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.posterType" placeholder="请选择海报类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POSTER_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推送内容类型" prop="wechatContentType" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.wechatContentType" placeholder="请选择推送内容类型" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CONTENT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="handleQuery" v-hasPermi="['crm:poster-setting:query']">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery" v-hasPermi="['crm:poster-setting:query']">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:poster-setting:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:poster-setting:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh" :row-key="(row) => row.id">
      <el-table-column label="活动" align="center" prop="activityName" />
      <el-table-column label="海报类型" align="center" prop="posterType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.POSTER_TYPE" :value="scope.row.posterType" />
        </template>
      </el-table-column>
      <el-table-column label="推送内容类型" align="center" prop="wechatContentType">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_CONTENT_TYPE" :value="scope.row.wechatContentType" />
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          {{ formatDate(scope.row.createTime[0]) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="info" @click="toPageList(scope.row)">
            查看渠道页面
          </el-button>
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:poster-setting:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['crm:poster-setting:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 海报 表单 -->
  <PosterForm ref="formRef" @success="getList" @close="clearRouterQuery" />
</template>

<script setup lang="ts">
import router from '@/router'
import { getIntDictOptions, DICT_TYPE, getActivityManageOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { PosterApi, PosterVO } from '@/api/crm/sales/poster/poster'
import PosterForm from './PosterForm.vue'

/** 海报设置 列表 */
defineOptions({ name: 'PosterMag' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<PosterVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  activityId: undefined,
  activityCode: undefined,
  posterType: undefined,
  wechatContentType: undefined,
  textDisplayFlag: undefined,
})
const queryFormRef = ref() // 搜索的表单

/* options */
const activityManageOptions = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PosterApi.getPosterSettingPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 查看渠道页面列表 */
const toPageList = (row) => {
  router.push({
    name: 'Page',
    query: {
      id: row.channelPageId,
      pageType: 1
    }
  })
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
    await PosterApi.deletePosterSetting(id)
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
    const data = await PosterApi.exportPosterSetting(queryParams)
    download.excel(data, '海报设置.xlsx')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  activityManageOptions.value = await getActivityManageOptions()
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