<template>
  <div ref="scrollRef" v-infinite-scroll="lazyLoad">
    <!-- 搜索栏 -->
    <ContentWrap>
      <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" inline label-width="80">
        <el-row>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="活动" prop="activityManageId" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.activityManageId" placeholder="请检索后选择活动" clearable filterable remote
                :loading="queryOptions.activityManage.loading" :remote-method="queryOptions.activityManage.handleSearch"
                class="!w-240px">
                <el-option v-for="dict in queryOptions.activityManage.options" :key="dict.value" :value="dict.value"
                  :label="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="参与日期" prop="createTime" @keyup.enter="handleQuery">
              <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                start-placeholder="开始日期" end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="社交平台" prop="socialPlatform" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.socialPlatform" placeholder="请选择社交平台" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SOCIAL_PLATFORM)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="有无备注" prop="isRemark" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.isRemark" placeholder="请选择有无备注" clearable class="!w-240px">
                <el-option v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="学员" prop="customerId" class="customer" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.customerType" placeholder="类型" class="!w-80px type">
                <el-option v-for="dict in customerTypeOption" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
              <el-select v-model="queryParams.customerId" placeholder="请检索后选择学员" clearable filterable remote
                :loading="queryOptions.customer.loading" :remote-method="queryOptions.customer.handleSearch"
                class="!w-160px id">
                <el-option v-for="option in queryOptions.customer.options" :key="option.value" :value="option.value"
                  :label="option.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="分享人" prop="nickname" @keyup.enter="handleQuery">
              <el-input v-model="queryParams.nickname" placeholder="请输入分享人" clearable class="!w-240px" />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="分享权限" prop="visibles" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.visibles" placeholder="请选择分享权限" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_VISIBLES)" :key="dict.value"
                  :value="dict.value" :label="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="图片数量" prop="picNumTotal" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.picNumTotal" placeholder="请选择图片数量" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_PIC_NUM)" :key="dict.value"
                  :value="dict.value" :label="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
            <el-form-item label="存疑判断" prop="isDoubtful" @keyup.enter="handleQuery">
              <el-select v-model="queryParams.isDoubtful" placeholder="请选择存疑判断" clearable class="!w-240px">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_TYPE)" :key="dict.value"
                  :value="dict.value" :label="dict.label" />
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
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 工具栏 -->
    <div class="util">
      <el-segmented v-model="queryParams.status"
        :options="getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_STATUS).filter(item => item.value !== 2)"
        @change="handleSegmentedChange" />
      <span class="flex items-center gap-6">
        <span v-if="!isAudit">共 {{ total || 0 }} 条</span>
        <el-dropdown placement="bottom-end" class="dropdown" trigger="click" @command="handleDropdownClick">
          <span class="link">
            <span>{{dropdownList.find(item => item.value === queryParams.orderBy[0])?.label}}</span>
            <el-icon class="icon"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="dropdown in dropdownList" :key="dropdown.id" :command="dropdown.value" :style="{
                backgroundColor: queryParams.orderBy[0] === dropdown.value ? 'var(--el-color-primary-light-9)' : '',
                color: queryParams.orderBy[0] === dropdown.value ? 'var(--el-color-primary)' : ''
              }">
                {{ dropdown.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </div>
    <ContentWrap v-show="queryParams.status !== 1" class="tag-container">
      <el-check-tag v-for="tag of doubtfulTotalList" :key="tag.value" type="primary" :checked="tag.checked"
        class="tag-item" @change="handleTagClick(tag)">
        {{ tag.label }}
      </el-check-tag>
    </ContentWrap>

    <!-- 展示栏 -->
    <div v-if="listTotal !== 0" :class="queryParams.status !== 0 ? 'mt-15px' : ''">
      <div class="masonry-rows" ref="masonryContainer" v-loading="loading">
        <div v-for="(colItems, colIndex) in columns" :key="colIndex" class="masonry-column">
          <div v-for="item in colItems" :key="item.id" :class="{ selected: item.checked }">
            <el-card shadow="hover" v-loading="item.loading" ref="cardRef">
              <!-- 卡片主区域 -->
              <div v-if="!item.showInfo" class="content" @mouseenter="hoverIndex = item.id"
                @mouseleave="hoverIndex = null">
                <el-image class="image" :src="item.wechatImgs[item.now]" fit="contain" show-progress lazy
                  @load="() => item.loading = false">
                  <template #placeholder>
                    <el-skeleton animated class="full">
                      <template #template>
                        <el-skeleton-item variant="image" class="full" />
                      </template>
                    </el-skeleton>
                  </template>
                  <template #error>
                    <div class="error-slot">
                      <el-icon>
                        <Picture style="width: 50px" />
                      </el-icon>
                    </div>
                  </template>
                </el-image>

                <!-- 选择按钮 -->
                <el-button v-show="!item.checked && isAudit" class="check custom-button check24"
                  @click="item.checked = true" />
                <el-button v-show="item.checked && isAudit" class="checked custom-button check24"
                  @click="item.checked = false" />

                <!-- 控制按钮组 -->
                <div v-show="!item.loading">
                  <span v-show="hoverIndex === item.id && !item.loading" class="image-controls">
                    <span class="overlay-mask" @click="() => { if (isAudit) item.checked = !item.checked }"></span>
                    <el-button v-show="isAudit" class="pass" type="primary" bg
                      @click="execute('单个', 0, item.id)">通过</el-button>
                    <el-button v-show="isAudit" class="reject" type="danger" bg
                      @click="execute('单个', 1, item.id)">驳回</el-button>
                    <el-button v-show="item.wechatImgs.length > 1" circle bg text plain
                      class="custom-button circle prev" @click="goPrev(item)" />
                    <el-button v-show="item.wechatImgs.length > 1" circle bg text plain
                      class="custom-button circle next" @click="goNext(item)" />
                    <el-button v-show="!item.showInfo" class="custom-button square preview"
                      @click="togglePreview(item)" />
                    <el-button class="custom-button square more" @click="toggleInfo(item)" />
                    <span class="some-info activityManageId">{{ item.activityManageName }}</span>
                    <span class="some-info createTime">{{ dateFormatterYMDHms(_, _, item.createTime) }}</span>
                  </span>
                </div>
                <span class="image-controls" v-if="!item.loading && item.resultMessage">
                  <span class="some-info resultMessage">
                    <el-icon color="#f52525" :size="20">
                      <WarningFilled />
                    </el-icon>
                    {{ item.resultMessage }}
                  </span>
                </span>
              </div>

              <!-- 详情信息 -->
              <div v-else class="info">
                <el-scrollbar class="content" height="700">
                  <div class="empty">
                    <el-button v-show="!item.checked && isAudit" class="custom-button check24 check"
                      @click="item.checked = true" />
                    <el-button v-show="item.checked && isAudit" class="custom-button check24 checked"
                      @click="item.checked = false" />
                  </div>
                  <el-form>
                    <el-form-item label="活动名称:">{{ item.activityManageName }}</el-form-item>
                    <el-form-item label="参与时间:">
                      {{ dateFormatterYMDHms(_, _, item.createTime) }}
                    </el-form-item>
                    <el-form-item label="学员姓名:">{{ item.customerName }}</el-form-item>
                    <el-form-item label="学员学号:">{{ item.customerId }}</el-form-item>
                    <el-form-item label="分享人:">{{ item.nickname[item.now] || '-' }}</el-form-item>
                    <el-form-item label="分享次数:">{{ item.shareNum[item.now] || '-' }}</el-form-item>
                    <el-form-item label="图片数量:">{{ item.picNum[item.now] || '-' }}</el-form-item>
                    <el-form-item label="分享权限:">
                      {{ getLabelByValue(item.visibles[item.now],
                        getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_VISIBLES)) }}
                    </el-form-item>
                    <el-form-item label="分享文案:">
                      <div v-for="(content, index) in item.textContent[item.now]" :key="content" class="line-height-6">
                        <span class="fw-700">{{ index }}.</span> {{ content }}
                      </div>
                    </el-form-item>
                    <el-form-item label="存疑原因:">{{ item.doubtful[item.now] || '-' }}</el-form-item>
                    <el-form-item label="备注内容:">{{ item.remark || '-' }}</el-form-item>
                  </el-form>
                  <div class="info-controls">
                    <el-button class="custom-button square close" size="small" @click.stop="toggleInfo(item)" />
                  </div>
                </el-scrollbar>
              </div>

              <template #footer>
                <div v-if="!item.loading" class="footer">
                  <span v-if="item.doubtfulTotal.length > 0" class="status-wrapper">
                    <el-icon color="#f52525" :size="16">
                      <WarningFilled />
                    </el-icon>
                    <span class="text-#f52525 text">存疑</span>
                  </span>
                  <span v-else class="status-wrapper">
                    <el-icon color="#4db83b" :size="16">
                      <SuccessFilled />
                    </el-icon>
                    <span class="text-#4db83b text">合格</span>
                  </span>
                  <span v-show="item.doubtfulTotal.length > 0" class="doubtfulTotal">
                    {{item.doubtfulTotal
                      .map(reason => getLabelByValue(reason, getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_REASON)))
                      .join(' / ')}}
                  </span>
                </div>
                <el-skeleton v-else animated>
                  <template #template>
                    <el-skeleton-item variant="text" />
                  </template>
                </el-skeleton>
              </template>
            </el-card>
          </div>
        </div>
      </div>
      <div class="isLoad" v-if="total !== 0">
        <el-divider class="noMore text">
          <span v-if="loading && !noMore" class="flex items-center">
            <span>加载中</span>
            <el-icon class="is-loading m-l-1">
              <Loading />
            </el-icon>
          </span>
          <span v-else>没有更多数据了~</span>
        </el-divider>
      </div>
    </div>
    <ContentWrap v-if="listTotal === 0 && !loading" :class="queryParams.status !== 0 ? 'mt-15px' : ''">
      <el-empty :image-size="300" />
    </ContentWrap>

    <!-- 图片预览 -->
    <el-image-viewer v-if="showPreview" :url-list="previewSet.list" show-progress infinite hide-on-click-modal
      teleported :initial-index="previewSet.now" @close="togglePreview(_)" />

    <!-- 操作区 -->
    <div class="container-footer" :style="{ width: footerWidth }" v-if="isAudit">
      <div class="left">
        <el-button @click="execute('全部', 0)" v-if="queryParams.status === 1" :disabled="total === 0">全部审核通过</el-button>
      </div>
      <div class="right">
        <el-button v-show="checkStatus === 'all'" class="custom-button check16 checked" @click="checkAll" />
        <el-button v-show="checkStatus === 'none'" class="custom-button check16 check" @click="checkAll" />
        <el-button v-show="checkStatus === 'half'" class="custom-button check16 half" @click="checkAll" />
        <span class="selected-data">已选择：<span class="selected-num">{{ checkedCount }}</span> 条 （共 {{ total }} 条）</span>
        <el-button type="danger" @click="execute('批量', 1)" :disabled="!checkedCount">批量驳回</el-button>
        <el-button type="primary" @click="execute('批量', 0)" :disabled="!checkedCount">批量通过</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, getBoolDictOptions, getLabelByValue, customerTypeOption,
  handleRemoteCustomerOptions, handleRemoteActivityManageOptions
} from '@/utils/dict'
import { debounce } from 'lodash-es'
import { ArrowDown, Picture, WarningFilled, SuccessFilled, Loading } from '@element-plus/icons-vue'
import { dateFormatterYMDHms, getLast30Days } from '@/utils/formatTime'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { useAppStore } from '@/store/modules/app'
import { AuditAiApi } from '@/api/crm/activity/auditai'

/** AI审核管理 列表 */
defineOptions({ name: 'AuditAi' })

/* 接口 */
interface AuditItem {
  id: string | number
  checked: boolean
  showInfo: boolean
  wechatImgs: string[]
  now: number
  loading: boolean
  activityManageName: string
  createTime: string[]
  customerName: string
  customerId: string
  nickname: string[]
  shareNum: number[]
  shareNumTotal: number
  picNum: number[]
  picNumTotal: number
  visibles: any[]
  textContent: string[][]
  doubtful: string[]
  remark?: string
  resultMessage?: any
  status?: number
  doubtfulTotal: any[]
}
interface listItem {
  id: string | number
  checked: boolean
  showInfo: boolean
  wechatImgs: string[]
  now: number
  loading?: boolean
}

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  activityManageId: undefined, // 活动名称
  createTime: getLast30Days(), // 参与日期
  socialPlatform: undefined, // 社交平台
  isRemark: undefined, // 有无备注
  customerType: 1, /// 学员类型
  customerId: undefined, // 学员
  nickname: undefined, //
  visibles: undefined, // 分享权限
  picNumTotal: undefined, // 图片数量
  isDoubtful: undefined, // 存疑判断
  status: 0, // 审核状态
  doubtfulTotal: undefined, // 存疑类型
  orderBy: [null] // 综合排序
})
const queryFormRef = ref() // 搜索的表单

/* 配置项 */
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const noMore = ref(false) // 没有更多数据
const hoverIndex = ref()
const showPreview = ref(false)
const previewSet = ref({
  list: [],
  now: 0
})
const list = ref<listItem[]>([])
const total = ref()
const listTotal = computed(() => list.value.length)
const columnCount = ref(4) // 分列

/* 计算属性 */
const isAudit = computed(() => queryParams.status === 0 || queryParams.status === 1)
const footerWidth = computed(() =>
  appStore.getCollapse ?
    'calc(100% - var(--left-menu-min-width) - var(--app-content-padding) * 4 - 2px)' :
    'calc(100% - var(--left-menu-max-width) - var(--app-content-padding) * 4 - 2px)'
)
const checkedCount = computed(() => list.value.filter(item => item.checked).length)
const checkStatus = computed(() => {
  if (checkedCount.value === 0) return 'none'   // 全不选
  if (checkedCount.value === total.value) return 'all' // 全选
  return 'half' // 部分选中
})
const checkedData = computed(() => list.value.filter(item => item.checked).map(item => item.id))

/* 选项列表 */
const queryOptions = reactive({
  customer: useRemoteSearch(handleRemoteCustomerOptions, {
    customerType: toRef(queryParams, 'customerType'),
  }),
  activityManage: useRemoteSearch(handleRemoteActivityManageOptions),
})
watch(() => queryParams.customerType, () => { queryParams.customerId = undefined })

/* 监听窗口大小 */
const updateColumnCount = () => {
  const width = window.innerWidth
  if (width >= 1950) columnCount.value = 5
  else if (width >= 1680) columnCount.value = 4
  else if (width >= 1280) columnCount.value = 3
  else if (width >= 920) columnCount.value = 2
  else columnCount.value = 1
}

/* 分列处理数据 */
const columns = computed(() => {
  const result: AuditItem[][] = Array.from({ length: columnCount.value }, () => [])
  // 避免类型错误
  if (!Array.isArray(list.value)) return result
  list.value.forEach((item, i) => result[i % columnCount.value].push(item))
  return result
})
const handleSegmentedChange = () => {
  queryParams.doubtfulTotal = undefined
  doubtfulTotalList.value.forEach(tag => tag.checked = tag.value === 0)
  handleQuery()
}

/* 下拉栏 */
const dropdownList = ref([
  { id: 0, label: '综合排序', value: null },
  { id: 1, label: '分享次数升序', value: 'shareNumTotal,asc' },
  { id: 2, label: '分享次数降序', value: 'shareNumTotal,desc' },
  { id: 3, label: '分享数量升序', value: 'picNumTotal,asc' },
  { id: 4, label: '分享数量降序', value: 'picNumTotal,desc' },
])
const handleDropdownClick = (command) => {
  queryParams.orderBy = [command]
  getList()
}

/* 标签栏 */
const doubtfulTotalList = ref(
  [
    { value: 0, label: '全部', checked: true },
    ...getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_REASON).map(item => ({
      ...item,
      checked: false
    }))
  ]
)
const handleTagClick = (clickedTag) => {
  if (clickedTag.value === 0) {
    // 点击"全部"标签
    queryParams.doubtfulTotal = undefined
    doubtfulTotalList.value.forEach(tag => {
      tag.checked = tag.value === 0
    })
  } else {
    // 点击其他标签
    const allTag = doubtfulTotalList.value.find(tag => tag.value === 0)
    allTag.checked = false // 取消"全部"的选中状态
    clickedTag.checked = !clickedTag.checked

    // 更新查询参数 - 这里需要根据你的实际需求处理多选值
    const selectedValues = doubtfulTotalList.value
      .filter(tag => tag.value !== 0 && tag.checked)
      .map(tag => tag.value)
    queryParams.doubtfulTotal = selectedValues.length > 0
      ? selectedValues.join(',')
      : undefined
  }
  getList()
}

/* 整理列表 */
const formatList = (raw: listItem[]) => {
  return raw.map(item => ({
    ...item,
    now: 0,
    checked: false,
    loading: false,
    showInfo: false,
  }))
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AuditAiApi.getAuditaiPage(queryParams)
    list.value = formatList(data.list)
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/* 懒加载 */
const lazyLoad = async () => {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const nextPage = queryParams.pageNo + 1
    const res = await AuditAiApi.getAuditaiPage({ ...queryParams, pageNo: nextPage })
    const items = formatList(res?.list) ?? []
    if (items.length) {
      list.value.push(...items)
      queryParams.pageNo = nextPage
    } else {
      noMore.value = true
    }
  } catch (err) {
    console.error('懒加载出错：', err)
  } finally {
    loading.value = false
  }
}

/* 选中状态 */
const checkAll = () => {
  if (checkStatus.value === 'none') {
    list.value.forEach(item => {
      item.checked = true
    })
  } else if (checkStatus.value === 'all' || checkStatus.value === 'half') {
    list.value.forEach(item => {
      item.checked = false
    })
  }
}

/* 图片详情 */
const toggleInfo = (item) => {
  item.showInfo = !item.showInfo
}

/* 图片预览 */
const togglePreview = (item) => {
  previewSet.value = {
    list: item.wechatImgs,
    now: item.now
  }
  showPreview.value = !showPreview.value
}

/* 上一张图 */
const goPrev = (item) => {
  item.now = item.now <= 0 ? item.wechatImgs.length - 1 : item.now - 1
}

/* 下一张图 */
const goNext = (item) => {
  item.now = item.now >= item.wechatImgs.length - 1 ? 0 : item.now + 1
}

// 全部通过
const handleAllPass = async (type1: string) => {
  await ElMessageBox.confirm(`是否确认对当前 ${total.value} 条内容${type1}审核通过？`, '提示', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
  })
  loading.value = true
  try {
    await AuditAiApi.auditaiAllPass()
    await new Promise(r => setTimeout(r, 2500))
    message.success(`${type1}审核成功！`)
  } catch (e) {
    message.error(`正在处理数据中，请稍候再试！`)
  } finally {
    loading.value = false
  }
  getList()
}

// 批量处理
const handleBatch = async (type1: string, type2: number) => {
  const executeType = type2 === 0 ? '通过' : '驳回'
  const resultDoubtfulId = ref()
  await ElMessageBox({
    title: '提示',
    message: type2 === 0 ? `是否确认对当前 ${checkedCount.value} 条内容${type1}审核${executeType}？` :
      h('div', null, [
        h('p', null, `是否确认对当前 ${checkedCount.value} 条内容${type1}审核${executeType}？`),
        h(ElFormItem, { label: '驳回原因', style: 'width: 150%; margin-top: 15px;', }, () => [
          h(ElSelect, {
            modelValue: resultDoubtfulId.value,
            'onUpdate:modelValue': (val) => (resultDoubtfulId.value = val),
            placeholder: '若与AI给出原因不符，请选择具体原因',
          },
            getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_REASON).map(opt => h(ElOption, { label: opt.label, value: opt.value }))
          ),
        ]),
      ]),
    showCancelButton: true,
    confirmButtonText: executeType,
    cancelButtonText: '取消',
  })
  try {
    await AuditAiApi.auditaiBatch({
      pageNo: 1,
      pageSize: 20,
      ids: checkedData.value,
      auditMethod: type2,
      resultDoubtfulId: resultDoubtfulId.value
    })
    message.success(`${type1}审核成功！`)
  } catch (e) {
    message.error(`${type1}审核失败！`)
  }
  getList()
}

// 单个处理
const handleSingle = async (type1: string, type2: number, id: number) => {
  const executeType = type2 === 0 ? '通过' : '驳回'
  const resultDoubtfulId = ref()
  await ElMessageBox({
    title: '提示',
    message: type2 === 0 ? `是否确认对当前内容${type1}审核${executeType}？` :
      h('div', null, [
        h('p', null, `是否确认对当前内容${type1}审核${executeType}？`),
        h(ElFormItem, { label: '驳回原因', style: 'width: 170%; margin-top: 15px;', }, () => [
          h(ElSelect, {
            modelValue: resultDoubtfulId.value,
            'onUpdate:modelValue': (val) => (resultDoubtfulId.value = val),
            placeholder: '若与AI给出原因不符，请选择具体原因',
          },
            getIntDictOptions(DICT_TYPE.CRM_AI_AUDIT_DOUBTFUL_REASON).map(opt => h(ElOption, { label: opt.label, value: opt.value }))
          ),
        ]),
      ]),
    showCancelButton: true,
    confirmButtonText: executeType,
    cancelButtonText: '取消',
  })
  try {
    await AuditAiApi.auditaiBatch({
      pageNo: 1,
      pageSize: 20,
      ids: [id],
      auditMethod: type2,
      resultDoubtfulId: resultDoubtfulId.value
    })
    message.success(`${type1}审核成功！`)
  } catch (e) {
    message.error(`${type1}审核失败！`)
  }
  getList()
}

/* 操作 */
const execute = async (type1: string, type2: number, id?: number) => {
  // 全部处理
  if (type1 === '全部') {
    await handleAllPass(type1)
  } else if (type1 === '批量') {
    // 批量处理
    await handleBatch(type1, type2)
  } else if (id) {
    // 单个处理
    await handleSingle(type1, type2, id)
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
  Object.assign(queryParams, {
    status: 0,
    doubtfulTotal: undefined,
    orderBy: [],
  })
  doubtfulTotalList.value.forEach(tag => tag.checked = tag.value === 0)
  handleQuery()
}

onMounted(async () => {
  window.addEventListener('resize', debounce(updateColumnCount, 500))
  getList()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateColumnCount)
})
</script>
<style scoped lang="scss">
.full {
  width: 100%;
  height: 100%;
}

$img-min-height: 400px;

.custom-button {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: none;
  padding: 0;

  // 方按钮
  &.square {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  // 圆按钮
  &.circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  // 选择按钮 24
  &.check24 {
    width: 24px;
    height: 24px;
  }

  // 选择按钮 16
  &.check16 {
    width: 18px;
    height: 18px;
  }
}

// 搜索栏
.search-form {
  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }

  .customer {
    :deep(.el-form-item__content) {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    .type {
      :deep(.el-select__wrapper) {
        font-size: 12px;
        font-weight: 700;
        background-color: #f5f7fa;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .id {
      :deep(.el-select__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}

// 工具栏
.util {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;

  .el-segmented {
    --el-border-radius-base: 8px;
  }

  :deep(.el-segmented__item) {
    padding: 10px 11px;
  }

  .dropdown {
    .link {
      cursor: pointer;
      display: flex;
      align-items: center;

      .icon {
        margin-left: 8px;
      }
    }
  }
}

.tag-container {
  .tag-item {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
}

// 展示栏
.masonry-rows {
  display: flex;
  gap: 12px;
  min-height: 70vh;

  .masonry-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .content {
      position: relative;
      display: flex;
      align-items: center;
      min-height: 300px;

      :deep(.el-form-item) {
        margin-bottom: 4px;
      }

      .image {
        width: 100%;
        // height: auto;
        height: 700px;
        min-height: $img-min-height;

        .error-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--el-fill-color-light);
          color: var(--el-text-color-secondary);
          min-height: $img-min-height;

          .el-icon {
            font-size: 30px;
          }
        }
      }

      // 选择
      .check {
        position: absolute;
        top: 18px;
        right: 15px;
        z-index: 20; // 保证在所有遮罩和按钮之上
        background-image: url('@/assets/imgs/check.png');
        background-color: transparent;
      }

      .checked {
        position: absolute;
        top: 18px;
        right: 15px;
        z-index: 20; // 保证在所有遮罩和按钮之上
        background-image: url('@/assets/imgs/checked.png');
        background-color: transparent;
      }

      .image-controls {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // z-index: 10;
        pointer-events: none;

        .el-button,
        .el-checkbox {
          position: absolute;
          // z-index: 2; // 按钮在最上面
          pointer-events: auto;
        }

        // 遮罩层
        .overlay-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          // z-index: 1;
          pointer-events: auto;
        }

        // 通过
        .pass {
          top: 10px;
          left: 15px;
        }

        // 驳回
        .reject {
          top: 10px;
          left: 72px;
        }

        // 上一张图片
        .prev {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          background-image: url('@/assets/imgs/prev.png');
        }

        // 下一张图片
        .next {
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          background-image: url('@/assets/imgs/next.png');
        }

        // 预览
        .preview {
          bottom: 55px;
          right: 15px;
          background-image: url('@/assets/imgs/preview.png');
        }

        // 详情
        .more {
          bottom: 15px;
          right: 15px;
          background-image: url('@/assets/imgs/more.png');
        }

        // 文字信息
        .some-info {
          position: absolute;
          left: 12px;
          color: #fff;
          opacity: .9;
        }

        // 活动名称
        .activityManageId {
          bottom: 50px;
          font-size: 20px;
          font-weight: 700;
        }

        // 创建时间
        .createTime {
          bottom: 20px;
          font-size: 16px;
        }

        .resultMessage {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 40px;
          background-color: #000;
          border-radius: 18px;
          opacity: 0.7;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .info {
      position: relative;

      .empty {
        height: 22px;

        // 选择
        .check {
          position: absolute;
          right: 15px;
          z-index: 20; // 保证在所有遮罩和按钮之上
          pointer-events: auto;
          background-image: url('@/assets/imgs/check.png');
        }

        .checked {
          position: absolute;
          right: 15px;
          z-index: 20; // 保证在所有遮罩和按钮之上
          pointer-events: auto;
          background-image: url('@/assets/imgs/checked.png');
        }
      }

      .content {
        padding-inline: 16px;
      }

      .info-controls {
        // height: 20px;

        // 关闭
        .close {
          background-image: url('@/assets/imgs/close.png');
          position: absolute;
          right: 15px;
          bottom: 15px;
        }
      }
    }

    .selected {
      outline: 3px solid #366cff;
    }

    .footer {
      display: flex;
      align-items: flex-start;
      line-height: 24px;

      .status-wrapper {
        width: 20%;
        display: flex;
        align-items: center;

        .text {
          margin-left: 4px;
        }
      }

      .doubtfulTotal {
        width: 80%;
      }
    }
  }
}

// 加载
.isLoad {
  height: calc(20px + var(--app-content-padding));
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  :deep(.el-loading-spinner) {
    margin-top: 0;
  }

  :deep(.el-divider__text) {
    background-color: var(--app-content-bg-color);
  }

  .text {
    color: #888;
    font-size: 14px;
  }
}

// 底部
.container-footer {
  position: fixed;
  bottom: 0;
  height: 56px;
  background-color: #fff;
  z-index: 20;
  padding-inline: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ebebeb;

  .right {
    display: flex;
    align-items: center;
    // gap: 20px;
    font-size: 14px;

    .selected-data {
      margin: 0 20px 0 12px;

      .selected-num {
        color: #366cff;
      }
    }

    .check {
      background-image: url('@/assets/imgs/check_white.png');
      background-color: transparent;
    }

    .checked {
      background-image: url('@/assets/imgs/checked.png');
      background-color: transparent;
    }

    .half {
      background-image: url('@/assets/imgs/half.png');
      background-color: transparent;
    }
  }
}
</style>