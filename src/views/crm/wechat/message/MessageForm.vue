<template>
  <el-card class="p-inline-40">
    <el-form v-if="!isCheck" ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading"
      label-width="100">
      <el-form-item label="推送主题" prop="title">
        <el-input type="textarea" v-model="formData.title" placeholder="仅内部查看使用，字符限制50个字符" show-word-limit
          :maxlength="50" />
      </el-form-item>
      <el-divider content-position="center">
        <span class="font-700 text-4.5">推送内容</span>
      </el-divider>
      <div class="flex justify-center text-red font-700 text-3.8 m-b">※ 至少选择其中一项内容填写一项，也可同时选择多项填写</div>
      <el-form-item label="文字" prop="content">
        <el-input type="textarea" v-model="formData.content" />
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <form-create v-model="formData.pic" :rule="picRule" :option="picOption" />
      </el-form-item>
      <el-form-item v-show="isActivity" label="活动" prop="activityId">
        <el-select v-model="formData.activityId" clearable placeholder="请选择活动">
          <el-option v-for="item in activityOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-row v-show="isActivity && formData.activityId">
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否推送海报" prop="isPushPoster" label-width="150">
            <el-switch v-model="formData.isPushPoster" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否推送短链接" prop="isPushShortUrl" label-width="150">
            <el-switch v-model="formData.isPushShortUrl" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否排除代理学员" prop="isExcludeAgencyCustomer" label-width="150">
            <el-switch v-model="formData.isExcludeAgencyCustomer" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">
        <span class="font-700 text-4.5">推送学员</span>
      </el-divider>
      <el-table v-loading="createOrUpdateLoading" :data="createOrUpdateList" stripe show-overflow-tooltip border>
        <el-table-column label="学号" align="center" prop="customerId" />
        <el-table-column label="学员姓名" align="center" prop="customerName" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="danger" @click="deleteCustomer(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, prev, pager, next, jumper" v-model:current-page="queryParams.pageNo"
        :total="createOrUpdateTotal" :default-page-size="queryParams.pageSize" hide-on-single-page background
        class="flex justify-center m-t-4" @current-change="getCreateOrUpdateList" />
    </el-form>
    <el-form v-else ref="formRef" :model="formData" v-loading="formLoading" label-width="120">
      <el-form-item label="推送主题">
        {{ formData.title }}
      </el-form-item>
      <el-row>
        <el-form-item label="推送内容">
          <el-col :span="24">
            <el-form-item label="文本：" label-width="50" class="content">
              {{ formData.content || '无' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片：" label-width="50" class="pic">
              <span v-if="formData.pic && formData.pic.length">
                <el-image v-for="(item, index) in formData.pic" :key="item" style="width: 120px; height: 120px"
                  :src="item" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="formData.pic"
                  :initial-index="index" fit="contain" class="m-r-4" />
              </span>
              <span v-else>无</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="isActivity">
            <el-form-item label="活动：" label-width="50" class="content">
              {{ formData.activityName || '无' }}
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row v-show="isActivity && formData.activityId">
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否推送海报" prop="isPushPoster" label-width="150">
            <el-switch v-model="formData.isPushPoster" disabled inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否推送短链接" prop="isPushShortUrl" label-width="150">
            <el-switch v-model="formData.isPushShortUrl" disabled inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" :offset="2">
          <el-form-item label="是否排除代理学员" prop="isExcludeAgencyCustomer" label-width="150">
            <el-switch v-model="formData.isExcludeAgencyCustomer" disabled inline-prompt active-text="是"
              inactive-text="否" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="推送学员" class="customer">
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="160" label-position="top">
              <template #label>
                从 &lt;{{ tableName }}&gt; 列表选择的学员如下
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form :model="queryParams" ref="checkFormRef" inline class="flex justify-between m-b-3">
              <el-form-item label="推送状态：" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择推送状态" clearable class="!w-240px">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CUSTOMER_STATUS)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="checkQuery">
                  <Icon icon="ep:search" class="mr-5px" /> 搜索
                </el-button>
                <el-button @click="checkReset">
                  <Icon icon="ep:refresh" class="mr-5px" /> 重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-table v-loading="checkLoading" :data="checkList" stripe show-overflow-tooltip border>
            <el-table-column label="学号" align="center" prop="customerId" width="90" />
            <el-table-column label="学员姓名" align="center" prop="customerName" />
            <el-table-column label="推送状态" align="center" prop="status">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.WECHAT_CUSTOMER_STATUS" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="失败原因" align="center" prop="faliRemarks" />
            <el-table-column label="推送时间" align="center" prop="pushTime" :formatter="dateFormatterYMDHms" />
          </el-table>
          <el-pagination layout="total, prev, pager, next, jumper" v-model:current-page="queryParams.pageNo"
            :total="checkTotal" :default-page-size="queryParams.pageSize" hide-on-single-page background
            class="m-auto m-t-4" @current-change="getCheckList" />
        </el-row>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-center">
        <el-button type="danger" @click="back">返 回</el-button>
        <el-button v-show="!isCheck" type="warning" @click="saveDraft">暂 存</el-button>
        <el-button v-show="!isCheck" type="primary" @click="pushMessage">立即推送</el-button>
      </div>
    </template>
  </el-card>
</template>
<script setup lang="ts">
import router from '@/router';
import { DICT_TYPE, getIntDictOptions, getValidActivityManageOptions } from '@/utils/dict'
import { formatDate, dateFormatterYMDHms } from '@/utils/formatTime'
import { useMessageStore } from '@/store/modules/message'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { WechatMessageApi, WechatMessageVO } from '@/api/crm/wechat/message'
import { WechatCustomerApi, WechatCustomerVO } from '@/api/crm/wechat/customer'

/** 微管家推送 表单 */
defineOptions({ name: 'MessageForm' })

/* 配置项 */
const message = useMessage()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改；check - 查看；
const messageStore = useMessageStore()
const tagsViewStore = useTagsViewStore()
const isCheck = ref() // 查看，禁用表单
const tableName = ref() // 来源列表
const visitedView = tagsViewStore.getVisitedViews.find((item) => item.name === "MessageForm")
const isActivity = computed(() => formData.value.customerLimit !== -1)

/* 表格数据 */
const createOrUpdateList = ref([]) // 创建列表
const createOrUpdateTotal = ref() // 创建列表的总页数
const createOrUpdateLoading = ref(false) // 创建列表的加载中
const checkList = ref([]) // 查看列表
const checkTotal = ref() // 查看列表的总页数
const checkFormRef = ref() // 查看的表单
const checkLoading = ref(false) // c列表的加载中

/* 列表请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  messageId: messageStore.getMessageId || undefined,
  status: undefined
})

/* 表单数据 */
const formData = ref({
  id: undefined,
  title: undefined,
  content: undefined,
  pic: { pic: [] },
  video: [],
  activityId: undefined,
  activityName: undefined,
  audio: [],
  customerIdList: [],
  isPush: undefined,
  isPushPoster: isActivity ? true : false,
  isPushShortUrl: false,
  isExcludeAgencyCustomer: false,
  customerLimit: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  title: { required: true, message: '请输入推送主题', trigger: 'blur' }
})

/** 微信图片 */
const picRule = ref([
  {
    "type": "UploadImgs",
    "field": "pic",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "compress": false,
      "path": 'wechatMessage/'
    },
    "hidden": false,
    "display": true,
  }]
)
const picOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
    "labelWidth": "125px",
    "hideRequiredAsterisk": false,
    "showMessage": true,
    "inlineMessage": false
  },
  "submitBtn": {
    "show": false,
    "innerText": "提交"
  },
  "resetBtn": {
    "show": false,
    "innerText": "重置"
  }
})
const formRef = ref() // 表单 Ref

/* options */
// activity
const activityOption = ref()

/* 获取创建列表 */
const getCreateOrUpdateList = async () => {
  if (formType.value === 'create') {
    const startIndex = (queryParams.pageNo - 1) * queryParams.pageSize
    const endIndex = startIndex + queryParams.pageSize
    // create 的数据
    const createData = messageStore.getPageData || { list: [], total: 0 }
    createOrUpdateList.value = createData.list.slice(startIndex, endIndex)
    createOrUpdateTotal.value = createData.total
  } else if (formType.value === 'update') {
    // update 的数据
    const updateData = await WechatCustomerApi.getWechatCustomerPage(queryParams)
    createOrUpdateList.value = updateData.list
    createOrUpdateTotal.value = updateData.total
  }
}

/* 删除学员 */
const deleteCustomer = async (row) => {
  if (formType.value === 'create') {
    const createData = messageStore.getPageData
    const index = createData.list.findIndex(item => item.customerId === row.customerId)
    if (index !== -1) {
      // 删除对应学员数据
      createData.list.splice(index, 1)
      // 同步更新 formData.customerIdList
      formData.value.customerIdList.splice(index, 1)
      // 更新 pinia 数据
      messageStore.setPageData({ list: createData.list, total: createData.list.length })
      messageStore.setIds(formData.value.customerIdList)
    }
  } else if (formType.value === 'update') {
    await WechatCustomerApi.deleteWechatCustomer(row.id)
  }
  getCreateOrUpdateList()
}

/* 获取查看列表 */
const getCheckList = async () => {
  checkLoading.value = true
  try {
    const checkData = await WechatCustomerApi.getWechatCustomerPage(queryParams)
    checkList.value = checkData.list
    checkTotal.value = checkData.total
  } finally {
    checkLoading.value = false
  }
}

/** 查看列表搜索按钮操作 */
const checkQuery = () => {
  queryParams.pageNo = 1
  getCheckList()
}

/** 查看列表重置按钮操作 */
const checkReset = () => {
  checkFormRef.value.resetFields()
  checkQuery()
}

/* 暂存 */
const saveDraft = async () => {
  try {
    assignImage()
    formRules.title = {}
    const data = formData.value as unknown as WechatMessageVO
    if (formType.value === 'create') {
      formData.value.isPush = false
    }
    const apiCall = formType.value === 'create'
      ? WechatMessageApi.createWechatMessage
      : WechatMessageApi.updateWechatMessage
    await apiCall(data)
    message.success('草稿保存成功，请前往"微信推送记录"查看和推送微信消息')
    router.push({ name: 'WechatMessage' })
    resetAll()
  } catch (error) {
    message.error('草稿保存失败')
  }
}

/* 立即推送消息 */
const pushMessage = async () => {
  try {
    formRules.title = { required: true, message: '请输入推送主题', trigger: 'blur' }
    await formRef.value.validate()
    formLoading.value = true
    assignImage()
    formData.value.isPush = true
    await ElMessageBox.confirm(
      '请确认是否立即推送微信消息？',
      '立即推送',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    if (formType.value === 'create') {
      const data = formData.value as unknown as WechatMessageVO
      await WechatMessageApi.createWechatMessage(data)
    } else {
      await WechatMessageApi.pushWechatMessage(formData.value.id)
    }
    message.success('推送发送成功，请前往"微信推送记录"跟进推送情况')
    router.push({ name: 'WechatMessage' })
    resetAll()
  } catch (error) {
    if (error !== 'cancel') { // 排除用户取消的情况
      console.error('推送失败:', error)
      message.error('推送失败')
    }
  } finally {
    formLoading.value = false
  }
}

/* 返回 */
const back = () => {
  router.back() // 关闭当前标签页
  resetAll()
}

/** 重置表单 */
const resetAll = async () => {
  formRef.value?.resetFields()
  messageStore.clearState()
  tagsViewStore.delView(visitedView)
  new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    formData.value = {
      ...formData.value,
      id: undefined,
      title: undefined,
      content: undefined,
      pic: { pic: [] },
      video: [],
      activityId: undefined,
      activityName: undefined,
      audio: [],
      customerIdList: [],
      isPush: undefined,
      isPushPoster: isActivity ? true : false,
      isPushShortUrl: false,
      isExcludeAgencyCustomer: false,
    }
  })
}

/* 赋值图片 */
const assignImage = () => {
  formData.value.pic = formData.value.pic.pic
}

onMounted(async () => {
  formType.value = messageStore.getType
  formData.value.customerLimit = messageStore.getLimit
  if (formData.value.customerLimit === 7 || formData.value.customerLimit === 8) {
    activityOption.value = await getValidActivityManageOptions(0, messageStore.getLimit)
  } else if (formData.value.customerLimit === -2) {
    activityOption.value = await getValidActivityManageOptions(0, 10)
  }
  if (formType.value === 'create') {
    formData.value.customerIdList = messageStore.getIds
    getCreateOrUpdateList()
  } else if (formType.value === 'update') {
    formData.value = await WechatMessageApi.getWechatMessage(messageStore.getMessageId)
    formData.value.pic = { pic: formData.value.pic }
    getCreateOrUpdateList()
  } else if (formType.value === 'check') {
    isCheck.value = true
    formData.value = await WechatMessageApi.getWechatMessage(messageStore.getMessageId)
    getCheckList()
    switch (formData.value.customerLimit) {
      case -2:
        tableName.value = '学员分类'
        break
      case -1:
        tableName.value = '有效学员'
        break
      case 7:
        tableName.value = '新生打卡'
        break
      case 8:
        tableName.value = '老生续费'
        break
    }
  }
})
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  font-weight: 700;
  font-size: 16px;
}

.content {
  :deep(.el-form-item__label) {
    margin-right: 10px;
  }
}

.pic {
  :deep(.el-form-item__label) {
    height: 120px;
    margin-right: 10px;
  }
}

.customer {
  :deep(.el-form-item__label) {
    height: 50px;
    margin-right: 10px;
  }
}
</style>
