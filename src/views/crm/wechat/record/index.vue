<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="85">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="微信" prop="nickName" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.nickName" placeholder="请输入微信号/昵称/绑定手机号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="微信状态" prop="isDeleted" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isDeleted" placeholder="请选择微信状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TICKET_REMOVE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="是否在线" prop="isOnline" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.isOnline" placeholder="请选择是否在线" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="归属员工" prop="owner" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.owner" clearable filterable remote :loading="queryOptions.owner.loading"
              :remote-method="queryOptions.owner.handleSearch" placeholder="请检索后选择归属员工" class="!w-240px">
              <el-option v-for="option in queryOptions.owner.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="员工状态" prop="ownerState" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.ownerState" placeholder="请选择归属员工状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="员工部门" prop="ownerSectionId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.ownerSectionId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择或检索员工所属部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, queryParams.ownerSectionId)"
              class="!w-240px">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="号码归属地" prop="phoneHomePlace" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.phoneHomePlace" placeholder="请输入号码归属地" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="实名认证" prop="realName" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.realName" placeholder="请选择是否实名认证" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="绑定银行卡" prop="bindBank" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.bindBank" placeholder="请选择是否绑定银行卡" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="开始日期" prop="createTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="结束日期" prop="updateTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.updateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <!-- TODO: 权限标识 -->
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="warning" plain :disabled="isSyncDisabled" @click="syncWechatRecord">
          <Icon icon="ic:round-sync-alt" class="mr-5px" /> {{ buttonText }}
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
      <el-table-column label="微信昵称" align="center" prop="nickName" width="180" fixed="left" />
      <el-table-column label="微信号" align="center" prop="wechatAlias" width="190" fixed="left" />
      <el-table-column label="微信状态" align="center" prop="isDeleted" width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.TICKET_REMOVE_STATUS" :value="scope.row.isDeleted" />
        </template>
      </el-table-column>
      <el-table-column label="是否在线" align="center" prop="isOnline" width="90">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_BOOLEAN_INTEGER" :value="scope.row.isOnline" />
        </template>
      </el-table-column>
      <el-table-column label="归属员工" align="center" prop="ownerName" width="120" />
      <el-table-column label="员工状态" align="center" prop="ownerState" width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.ownerState" />
        </template>
      </el-table-column>
      <el-table-column label="员工部门" align="center" prop="ownerSection" width="140" />
      <el-table-column label="绑定手机号" align="center" prop="phone" width="200" />
      <el-table-column label="号码归属地" align="center" prop="phoneHomePlace" width="120" />
      <el-table-column label="实名认证" align="center" prop="realName" width="110">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_BOOLEAN_INTEGER" :value="scope.row.realName" />
        </template>
      </el-table-column>
      <el-table-column label="绑定银行卡" align="center" prop="bindBank" width="160">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.WECHAT_BOOLEAN_INTEGER" :value="scope.row.bindBank" />
        </template>
      </el-table-column>
      <el-table-column label="支付密码" align="center" prop="payPassword" width="90" />
      <el-table-column label="开始时间" align="center" prop="createTime" :formatter="dateFormatterYMDHms" width="220" />
      <el-table-column label="结束时间" align="center" prop="updateTime" :formatter="dateFormatterYMDHms" width="220" />
      <el-table-column label="操作" align="center" min-width="140" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row.id)" v-hasPermi="['crm:wechat-record:update']">
            编辑
          </el-button>
          <el-button link type="info" @click="openHistoryForm(scope.row.id)">历史记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 微信记录 表单 -->
  <EditForm ref="editFormRef" @success="getList" />
  <!-- 历史记录 表单 -->
  <HistoryForm ref="historyFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import download from '@/utils/download'
import { delay } from '@/utils/common'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { WechatRecordApi, WechatRecordVO } from '@/api/crm/wechat/record'
import EditForm from './EditForm.vue'
import HistoryForm from './HistoryForm.vue'

/** 工作微信 列表 */
defineOptions({ name: 'WechatRecord' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<WechatRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickName: undefined,
  wechatId: undefined,
  isDeleted: undefined,
  owner: undefined,
  ownerState: undefined,
  ownerSectionId: [],
  phone: undefined,
  phoneHomePlace: undefined,
  realName: undefined,
  bindBank: undefined,
  isOnline: undefined,
  updateTime: [],
  createTime: []
})

/* 选项列表 */
const queryOptions = reactive({
  owner: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
  }
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WechatRecordApi.getWechatRecordPage(queryParams)
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

/* 同步按钮 */
const isSyncDisabled = ref(false) // 同步按钮禁用状态
const countdown = ref(0) // 倒计时
const buttonText = ref('同步获取工作微信') // 按钮文字

// 从 localStorage 获取禁用状态和剩余时间
const checkButtonStatus = () => {
  const disableUntil = localStorage.getItem('syncWechatDisableUntil')
  const now = Date.now()

  // 如果当前时间小于禁用到期时间，则禁用按钮并显示倒计时
  if (disableUntil && now < Number(disableUntil)) {
    isSyncDisabled.value = true
    countdown.value = Math.ceil((Number(disableUntil) - now) / 1000)
    buttonText.value = `重新同步（${countdown.value}秒）`

    // 每秒更新倒计时
    const intervalId = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(intervalId)
        resetButtonStatus()
      } else {
        buttonText.value = `重新同步（${countdown.value}秒）`
      }
    }, 1000)
  }
}

// 重置按钮状态的通用方法
const resetButtonStatus = () => {
  countdown.value = 0
  isSyncDisabled.value = false
  localStorage.removeItem('syncWechatDisableUntil')
  buttonText.value = '同步获取工作微信'
}

// 同步微信记录
const syncWechatRecord = async () => {
  if (isSyncDisabled.value) return // 如果按钮已禁用，直接返回

  isSyncDisabled.value = true
  loading.value = true
  buttonText.value = '加载中...' // 设置加载状态
  // 等待一秒钟
  await delay(1000)
  countdown.value = 5 * 60 // 初始化倒计时
  // buttonText.value = `重新同步（${countdown.value}秒）`
  // 记录禁用到期时间到 localStorage
  const disableUntil = Date.now() + countdown.value * 1000
  localStorage.setItem('syncWechatDisableUntil', disableUntil)

  let intervalId = null
  try {
    // 调用同步 API
    await WechatRecordApi.syncWechatRecord()
    message.success('同步成功')
  } catch (e) {
    message.error('同步失败，请重试')
    resetButtonStatus()
    return // 提前退出，避免进入后续逻辑
  } finally {
    loading.value = false
  }
  // 设置定时器以更新倒计时
  intervalId = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(intervalId)
      resetButtonStatus()
    } else {
      buttonText.value = `重新同步（${countdown.value}秒）`
    }
  }, 1000)
  getList()
}

/** 修改操作 */
const editFormRef = ref()
const openForm = (id: number) => {
  editFormRef.value.open(id)
}

/* 历史记录 */
const historyFormRef = ref()
const openHistoryForm = (id: number) => {
  historyFormRef.value.open(id)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await WechatRecordApi.exportWechatRecord(queryParams)
    download.excel(data, '工作微信.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  checkButtonStatus()
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
