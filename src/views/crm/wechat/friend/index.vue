<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="110">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="好友微信" prop="nickname" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.nickname" placeholder="请输入好友微信/微信昵称/手机号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员绑定关系" prop="bindStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.bindStatus" placeholder="请选择学员绑定关系" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CUSTOMER_BIND_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="学员" prop="customerId" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.customerId" placeholder="请输入学员/姓名" clearable filterable remote
              :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
              class="!w-240px">
              <el-option v-for="option in queryOptions.customer.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="绑学员日期" prop="bindTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.bindTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="顾问微信号" prop="mentorWechatAlias" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.mentorWechatAlias" placeholder="请输入微信号" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="顾问微信昵称" prop="mentorNickname" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.mentorNickname" placeholder="请输入顾问微信昵称" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="绑定顾问" prop="owner" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.owner" clearable filterable remote :loading="queryOptions.owner.loading"
              :remote-method="queryOptions.owner.handleSearch" placeholder="请检索后选择绑定顾问" class="!w-240px">
              <el-option v-for="option in queryOptions.owner.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="顾问部门" prop="ownerSectionId" @keyup.enter="handleQuery">
            <el-tree-select v-model="queryParams.ownerSectionId" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="3"
              show-checkbox default-expand-all placeholder="请选择或检索顾问部门" node-key="id"
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
          <el-form-item label="顾问状态" prop="ownerState" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.ownerState" placeholder="请选择顾问状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="备注名" prop="remark" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.remark" placeholder="请输入备注名" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="微信标签" prop="labels" @keyup.enter="handleQuery">
            <el-input v-model="queryParams.labels" placeholder="请输入微信标签" clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="好友状态" prop="friendStatus" @keyup.enter="handleQuery">
            <el-select v-model="queryParams.friendStatus" placeholder="请选择好友状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_FRIEND_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="添加日期" prop="addTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.addTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
          <el-form-item label="删除日期" prop="deleteTime" @keyup.enter="handleQuery">
            <el-date-picker v-model="queryParams.deleteTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
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
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['crm:wechat-friend:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button @click="expandAllRows" type="primary">全部展开</el-button>
        <el-button @click="collapseAllRows">全部收起</el-button>
        <el-button type="warning" plain :disabled="isSyncUpdateDisabled" @click="syncUpdateIncrement">
          <Icon icon="ic:round-sync-alt" class="mr-5px" /> {{ updateButtonText }}
        </el-button>
        <el-button type="warning" plain :disabled="isSyncBindDisabled" @click="syncAutoBind">
          <Icon icon="ic:round-sync-alt" class="mr-5px" /> {{ bindButtonText }}
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table ref="tableRef" v-loading="loading" :data="list" stripe border max-height="70vh" class="data-table"
      :row-key="(row) => row.id">
      <el-table-column type="expand" fixed>
        <template #default="expandProps">
          <div class="sub-table ml-12">
            <div class="sub-order">
              <el-scrollbar>
                <el-table :data="expandProps.row.wechatMentorRespVoList"
                  :header-cell-style="{ backgroundColor: '#f0eeff' }" :row-style="{ backgroundColor: '#f8f8ff' }">
                  <el-table-column label="顾问微信号" align="center" prop="wechatAlias" />
                  <el-table-column label="顾问微信昵称" align="center" prop="nickName" />
                  <el-table-column label="绑定顾问" align="center" prop="ownerName" />
                  <el-table-column label="顾问部门" align="center" prop="ownerSection" />
                  <el-table-column label="顾问状态" align="center" prop="ownerState">
                    <template #default="scope">
                      <arco-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.ownerState" />
                    </template>
                  </el-table-column>
                  <el-table-column label="好友备注名" align="center" prop="remark" />
                  <el-table-column label="好友备注标签" align="center" prop="labelsList">
                    <template #default="scope">
                      <el-tag v-for="tag in scope.row.labelsList" :key="tag">
                        {{ tag }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="好友状态" align="center" prop="friendStatus">
                    <template #default="scope">
                      <arco-tag :type="DICT_TYPE.WECHAT_FRIEND_STATUS" :value="scope.row.friendStatus" />
                    </template>
                  </el-table-column>
                  <el-table-column label="添加时间" align="center" prop="addTime" :formatter="formatWechatTime" />
                  <el-table-column label="删除时间" align="center" prop="deleteTime" :formatter="formatWechatTime" />
                </el-table>
              </el-scrollbar>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="微信原始ID" align="center" prop="wechatId" />
      <el-table-column label="微信号" align="center" prop="wechatAlias" />
      <el-table-column label="微信昵称" align="center" prop="nickName" />
      <el-table-column label="手机号" align="center" prop="phone" :formatter="formatNullValue" />
      <el-table-column label="学员学号" align="center" prop="customerId" :formatter="formatNullValue" />
      <el-table-column label="学员姓名" align="center" prop="customerName" :formatter="formatNullValue" />
      <el-table-column label="绑定时间" align="center" prop="bindTime" :formatter="dateFormatterYMD" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="handleBind(scope.row.wechatId, scope.row.nickName)">
            绑定学员
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 学员绑定 表单 -->
  <BindForm ref="bindFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions, handleRemoteCustomerOptions } from '@/utils/dict'
import { formatNullValue, formatWechatTime } from '@/utils/formatter'
import { dateFormatterYMD } from '@/utils/formatTime'
import { delay } from '@/utils/common'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import download from '@/utils/download'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import * as DeptApi from '@/api/system/dept'
import { WechatFriendApi, WechatFriendVO } from '@/api/crm/wechat/friend'
import BindForm from './BindForm.vue'

/** 学员微信 列表 */
defineOptions({ name: 'WechatFriend' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<WechatFriendVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: undefined, // 好友微信
  bindStatus: undefined, // 学员绑定状态
  customerId: undefined,  // 学员
  bindTime: undefined, // 绑定时间	
  mentorWechatAlias: undefined,  // 顾问微信号
  mentorNickname: undefined, // 顾问微信昵称
  owner: undefined,  // 绑定顾问ID
  owners: undefined,  // 绑定顾问ID集合
  ownerSectionId: [],  // 顾问部门Id
  ownerState: undefined,  // 顾问状态
  remark: undefined,  // 备注名
  labels: undefined,  // 微信标签
  friendStatus: undefined,  // 好友状态
  addTime: undefined, // 添加时间
  deleteTime: undefined,  // 	删除时间
})

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions),
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
    const data = await WechatFriendApi.getWechatFriendPage(queryParams)
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

const tableRef = ref()
/* 全部展开 */
const expandAllRows = () => {
  list.value.forEach((row) => {
    tableRef.value.toggleRowExpansion(row, true)
  })
}

/* 全部收起 */
const collapseAllRows = () => {
  list.value.forEach((row) => {
    tableRef.value.toggleRowExpansion(row, false)
  })
}

/* 重置自动绑定学员按钮状态 */
const resetBindButtonStatus = () => {
  bindCountdown.value = 0
  isSyncBindDisabled.value = false
  localStorage.removeItem('syncBindDisableUntil')
  bindButtonText.value = '自动绑定学员'
}

/* 同步自动绑定学员按钮 */
const isSyncBindDisabled = ref(false) // 同步按钮禁用状态
const bindCountdown = ref(0) // 倒计时
const bindButtonText = ref('自动绑定学员') // 按钮文字

/* 检查自动绑定学员按钮状态 */
const checkBindButtonStatus = () => {
  const disableUntil = localStorage.getItem('syncBindDisableUntil')
  const now = Date.now()
  // 如果当前时间小于禁用到期时间，则禁用按钮并显示倒计时
  if (disableUntil && now < Number(disableUntil)) {
    isSyncBindDisabled.value = true
    bindCountdown.value = Math.ceil((Number(disableUntil) - now) / 1000)
    bindButtonText.value = `重新同步（${bindCountdown.value}秒）`
    // 每秒更新倒计时
    const intervalId = setInterval(() => {
      bindCountdown.value--
      if (bindCountdown.value <= 0) {
        clearInterval(intervalId)
        resetBindButtonStatus()
      } else {
        bindButtonText.value = `重新同步（${bindCountdown.value}秒）`
      }
    }, 1000)
  }
}

/* 同步自动绑定学员 */
const syncAutoBind = async () => {
  if (isSyncBindDisabled.value) return // 如果按钮已禁用，直接返回
  isSyncBindDisabled.value = true
  loading.value = true
  bindButtonText.value = '加载中...' // 设置加载状态
  // 等待一秒钟
  await delay(1000)
  bindCountdown.value = 5 * 60 // 初始化倒计时
  // 记录禁用到期时间到 localStorage
  const disableUntil = Date.now() + bindCountdown.value * 1000
  localStorage.setItem('syncBindDisableUntil', disableUntil)
  let intervalId = null
  try {
    // 调用同步 API
    await WechatFriendApi.autoBindFriend()
    message.success('正在绑定学员，请在1~2分钟后刷新页面...')
  } catch (e) {
    message.error('绑定失败，请重试')
    resetBindButtonStatus()
    return // 提前退出，避免进入后续逻辑
  } finally {
    loading.value = false
  }
  // 设置定时器以更新倒计时
  intervalId = setInterval(() => {
    bindCountdown.value--
    if (bindCountdown.value <= 0) {
      clearInterval(intervalId)
      resetBindButtonStatus()
    } else {
      bindButtonText.value = `重新绑定（${bindCountdown.value}秒）`
    }
  }, 1000)
  getList()
}

/* 同步获取好友微信 按钮 */
const isSyncUpdateDisabled = ref(false) // 同步按钮禁用状态
const updateCountdown = ref(0) // 倒计时
const updateButtonText = ref('获取好友微信') // 按钮文字

/* 重置获取好友微信状态 */
const resetUpdateButtonStatus = () => {
  updateCountdown.value = 0
  isSyncUpdateDisabled.value = false
  localStorage.removeItem('syncUpdateDisableUntil')
  updateButtonText.value = '获取好友微信'
}

/* 检查获取好友微信按钮状态 */
const checkUpdateButtonStatus = () => {
  const disableUntil = localStorage.getItem('syncUpdateDisableUntil')
  const now = Date.now()
  // 如果当前时间小于禁用到期时间，则禁用按钮并显示倒计时
  if (disableUntil && now < Number(disableUntil)) {
    isSyncUpdateDisabled.value = true
    updateCountdown.value = Math.ceil((Number(disableUntil) - now) / 1000)
    updateButtonText.value = `重新同步（${updateCountdown.value}秒）`
    // 每秒更新倒计时
    const intervalId = setInterval(() => {
      updateCountdown.value--
      if (updateCountdown.value <= 0) {
        clearInterval(intervalId)
        resetUpdateButtonStatus()
      } else {
        updateButtonText.value = `重新同步（${updateCountdown.value}秒）`
      }
    }, 1000)
  }
}

/* 同步获取好友微信 */
const syncUpdateIncrement = async () => {
  if (isSyncUpdateDisabled.value) return // 如果按钮已禁用，直接返回
  isSyncUpdateDisabled.value = true
  loading.value = true
  updateButtonText.value = '加载中...' // 设置加载状态
  // 等待一秒钟
  await delay(1000)
  updateCountdown.value = 60 * 60 // 初始化倒计时
  // 记录禁用到期时间到 localStorage
  const disableUntil = Date.now() + updateCountdown.value * 1000
  localStorage.setItem('syncUpdateDisableUntil', disableUntil)
  let intervalId = null
  try {
    // 调用同步 API
    await WechatFriendApi.updateIncrement()
    message.success('正在同步获取好友微信，请在1~2分钟后刷新页面...')
  } catch (e) {
    message.error('获取失败，请重试')
    resetUpdateButtonStatus()
    return // 提前退出，避免进入后续逻辑
  } finally {
    loading.value = false
  }
  // 设置定时器以更新倒计时
  intervalId = setInterval(() => {
    updateCountdown.value--
    // 计算小时、分钟和秒
    const hours = Math.floor(updateCountdown.value / 3600)
    const minutes = Math.floor((updateCountdown.value % 3600) / 60)
    const seconds = updateCountdown.value % 60

    // 格式化为 HH:MM:SS 形式
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    if (updateCountdown.value <= 0) {
      clearInterval(intervalId)
      resetUpdateButtonStatus()
    } else {
      updateButtonText.value = `重新获取（${formattedTime}秒）`
    }
  }, 1000)
}

/** 手动绑定学员 */
const bindFormRef = ref()
const handleBind = (wechatId: number, nickName: string) => {
  bindFormRef.value.open(wechatId, nickName)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await WechatFriendApi.exportWechatFriend(queryParams)
    download.excel(data, '学员微信.xlsx')
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await queryOptions.init()
  checkBindButtonStatus()
  checkUpdateButtonStatus()
  getList()
})
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
}

.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      th.el-table__cell {
        padding: 0;
      }

      td.el-table__cell {
        padding: 0;
      }

      .cell {
        padding: 0;
        /* line-height: 20px; */
      }
    }

    /* 隐藏折叠图标 清除动效 */
    .el-table__expand-icon {
      transition: none;

      .el-icon svn {
        display: none;
      }
    }

    /* 隐藏展开图标 清除动效*/
    .el-table__expand-icon--expanded {
      transform: rotate(0);
    }

    /* 折叠图标 */
    .el-table__expand-icon :after {
      display: inline-block;
      content: url('@/assets/svgs/PlusBoxOutline.svg');
    }

    /* 展开图标 */
    .el-table__expand-icon--expanded :after {
      display: inline-block;
      content: url('@/assets/svgs/MinusBoxOutline.svg');
    }

    .el-table__cell.el-table__expanded-cell {
      padding: 0;
    }
  }
}
</style>