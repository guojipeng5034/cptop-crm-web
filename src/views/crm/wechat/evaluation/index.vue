<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="班次" prop="scheduling" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.scheduling" placeholder="请选择班次" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_EVALUATION_SCHEDULING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="顾问" prop="mentorId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.mentorId" clearable filterable remote :loading="queryOptions.mentor.loading"
              :remote-method="queryOptions.mentor.handleSearch" placeholder="请检索顾问" class="!w-240px">
              <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" v-hasPermi="['crm:wechat-evaluation:create']">
          <el-form-item label="客服" prop="serviceId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.serviceId" clearable filterable remote
              :loading="queryOptions.service.loading" :remote-method="queryOptions.service.handleSearch"
              placeholder="请检索客服" class="!w-240px">
              <el-option v-for="option in queryOptions.service.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="协助日期" prop="assistDate" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.assistDate" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="满意度" prop="satisfaction" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.satisfaction" placeholder="请选择满意度" clearable class="!w-240px">
              <el-option v-for="dict in wechatSatisfactionOptions" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="状态" prop="evaluationStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.evaluationStatus" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_EVALUATION_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
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
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['crm:wechat-evaluation:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:wechat-record:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="顾问" align="center" prop="mentorName" />
      <el-table-column label="客服" align="center" prop="serviceName" v-hasPermi="['crm:wechat-evaluation:create']" />
      <el-table-column label="班次" align="center" prop="scheduling">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_EVALUATION_SCHEDULING" :value="scope.row.scheduling" />
        </template>
      </el-table-column>
      <el-table-column label="绑定账号" align="center" prop="bindingAccount" />
      <el-table-column label="状态" align="center" prop="evaluationStatus">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_EVALUATION_STATUS" :value="scope.row.evaluationStatus" />
        </template>
      </el-table-column>
      <el-table-column label="协助日期" align="center" prop="assistDate" :formatter="dateFormatterYMD" />
      <el-table-column label="满意度" align="center" prop="satisfaction">
        <template #default="scope">
          <el-rate v-model="scope.row.satisfaction" :max="3" disabled />
        </template>
      </el-table-column>
      <el-table-column label="质量建议" align="center" prop="evaluation" />
      <el-table-column label="截图" align="center" :show-overflow-tooltip="false">
        <template #default="scope">
          <span v-for="(url, index) in scope.row.imgs" :key="index">
            <el-image style="width: 60px; height: 60px" :src="url" :preview-src-list="scope.row.imgs" preview-teleported
              :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :initial-index="index" fit="scale-down"
              :class="{ 'mr-2': index < scope.row.imgs.length - 1 }" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="scope">
          <el-button v-if="scope.row.evaluationStatus === 0 && scope.row.serviceId === userId" link type="primary"
            @click="openForm('update', scope.row.id, scope.row.mentorName)"
            v-hasPermi="['crm:wechat-evaluation:update']">
            编辑
          </el-button>
          <el-button v-if="scope.row.evaluationStatus === 0 && scope.row.mentorId === userId" link type="success"
            @click="handleEvaluation(scope.row.id, 'create')" v-hasPermi="['crm:wechat-evaluation:evaluation']">
            评价
          </el-button>
          <el-button v-if="scope.row.evaluationStatus === 1 && scope.row.mentorId === userId" link type="success"
            @click="handleEvaluation(scope.row.id, 'update')" v-hasPermi="['crm:wechat-evaluation:update']">
            修改评价
          </el-button>
          <!-- 已评价不允许删除 -->
          <el-button v-if="scope.row.serviceId === userId && scope.row.evaluationStatus === 0" link type="danger"
            @click="handleDelete(scope.row.id)" v-hasPermi="['crm:wechat-evaluation:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 创建/修改 表单 -->
  <CreateForm ref="createFormRef" @success="getList" />
  <!-- 评价 表单 -->
  <EvaluationForm ref="evaluationFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions, wechatSatisfactionOptions } from '@/utils/dict'
import { dateFormatterYMD } from '@/utils/formatTime'
import download from '@/utils/download'
import { useUserStore } from '@/store/modules/user'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { WechatEvaluationVO, WechatEvaluationApi } from '@/api/crm/wechat/evaluation'
import CreateForm from './CreateForm.vue'
import EvaluationForm from './EvaluationForm.vue'

/** 工作微信 列表 */
defineOptions({ name: 'WechatEvaluation' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<WechatEvaluationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const userId = useUserStore().getUser.id
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mentorId: undefined, // 顾问
  serviceId: undefined, // 客服
  assistDate: [], // 协助日期
  scheduling: undefined, // 班次
  evaluationStatus: undefined, // 状态
  satisfaction: undefined, // 满意度
  orderBy: undefined, // 排序
})

/* 选项列表 */
const queryOptions = reactive({
  mentor: useRemoteSearch(handleRemoteUserOptions),
  service: useRemoteSearch(handleRemoteUserOptions),
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WechatEvaluationApi.getWechatEvaluationPage(queryParams)
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

/** 新增/修改操作 */
const createFormRef = ref()
const openForm = (type: string, id?: number, mentorName?: string) => {
  createFormRef.value.open(type, id, mentorName)
}

/* 评价操作 */
const evaluationFormRef = ref()
const handleEvaluation = (id: number, type: string) => {
  evaluationFormRef.value.open(id, type)
}

/** 删除操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WechatEvaluationApi.deleteWechatEvaluation(id)
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
    const data = await WechatEvaluationApi.exportWechatEvaluation(queryParams)
    download.excel(data, '工作微信.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
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
