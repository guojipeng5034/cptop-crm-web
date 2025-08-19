<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="标题" prop="title" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.title" placeholder="请输入标题" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="推送状态" prop="status" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.status" placeholder="请选择推送状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_MESSAGE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建时间" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="创建人" prop="creator" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.creator" clearable filterable remote :loading="queryOptions.creator.loading"
              :remote-method="queryOptions.creator.handleSearch" placeholder="请检索后选择创建人" class="!w-240px">
              <el-option v-for="option in queryOptions.creator.options" :key="option.value" :label="option.label"
                :value="option.value" />
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
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:wechat-message:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe show-overflow-tooltip border max-height="70vh"
      :row-key="(row) => row.id">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="推送状态 " align="center" prop="status">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_MESSAGE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="推送总数" align="center" prop="pushNum" />
      <el-table-column label="推送成功" align="center" prop="pushSuccessNum" />
      <el-table-column label="推送失败" align="center" prop="pushFailNum" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" width="180" />
      <el-table-column label="创建人" align="center" prop="creator" width="180" />
      <el-table-column label="操作" align="center" min-width="120">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" link type="primary" @click="editMessage(scope.row)"
            v-hasPermi="['crm:wechat-message:update']">
            编辑
          </el-button>
          <el-button v-if="scope.row.status === 1 || scope.row.status === 2" link type="primary"
            @click="checkMessage(scope.row)">
            查看
          </el-button>
          <el-button v-if="scope.row.status === 2 && scope.row.pushFailNum > 0" link type="warning"
            @click="repushMessage(scope.row)" v-hasPermi="['crm:wechat-message:reusePush']">
            重推
          </el-button>
          <el-button v-if="scope.row.status === 1" link type="danger" @click="stopPushMessage(scope.row)"
            v-hasPermi="['crm:wechat-message:stopPush']">
            停止推送
          </el-button>
          <el-button v-if="scope.row.status === 0" link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:wechat-message:delete']">
            删除
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
import router from '@/router'
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions } from '@/utils/dict'
import { useMessageStore } from '@/store/modules/message'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { WechatMessageApi, WechatMessageVO } from '@/api/crm/wechat/message'

/** 微信推送内容 列表 */
defineOptions({ name: 'WechatMessage' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<WechatMessageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const messageStore = useMessageStore()
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  title: undefined,
  status: undefined,
  createTime: [],
  creator: undefined
})

/* 选项列表 */
const queryOptions = reactive({
  creator: useRemoteSearch(handleRemoteUserOptions),
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WechatMessageApi.getWechatMessagePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

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

/* 查看操作 */
const checkMessage = (row) => {
  messageStore.setType('check')
  messageStore.setMessageId(row.id)
  router.push({
    name: 'MessageForm',
  })
}

/** 编辑操作 */
const editMessage = (row) => {
  messageStore.setType('update')
  messageStore.setMessageId(row.id)
  messageStore.setLimit(row.customerLimit)
  router.push({
    name: 'MessageForm',
  })
}

/* 重推操作 */
const repushMessage = async (row) => {
  try {
    await WechatMessageApi.reusePushWechatMessage(row.id)
    message.success('重推成功，请稍后前往“微信推送记录”跟进推送情况')
    getList()
  } catch (e) {
    message.error('重推失败')
  }
}

/* 停止推送操作 */
const stopPushMessage = async (row) => {
  try {
    await WechatMessageApi.stopPushWechatMessage(row.id)
    message.success('停止推送成功')
    getList()
  } catch (e) {
    message.error('停止推送失败')
  }
}

/** 删除操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WechatMessageApi.deleteWechatMessage(id)
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
    const data = await WechatMessageApi.exportWechatMessage(queryParams)
    download.excel(data, '微信推送内容.xlsx')
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
