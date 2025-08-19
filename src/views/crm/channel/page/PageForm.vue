<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading"
    :validate-on-rule-change="false">
    <el-row>
      <el-col :span="12">
        <el-form-item label="渠道细分" prop="pageName">
          <el-input v-model="formData.pageName" placeholder="请输入渠道细分" clearable />
        </el-form-item>
        <el-form-item label="渠道大类" prop="pageType">
          <el-select v-model="formData.pageType" placeholder="请选择渠道大类" disabled>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="推广负责人" prop="promotionResponsibleId">
          <el-select v-model="formData.promotionResponsibleId" placeholder="请选择推广负责人" filterable clearable remote
            :loading="formOptions.promotion.loading" :remote-method="formOptions.promotion.handleSearch">
            <el-option v-for="dict in formOptions.promotion.options" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="推广部门" prop="promotionResponsibleDeptId">
          <el-tree-select v-model="formData.promotionResponsibleDeptId" :data="formOptions.dept.list"
            :props="defaultProps" filterable clearable show-checkbox default-expand-all placeholder="请选择推广部门"
            node-key="id" />
        </el-form-item>
        <el-form-item label="推广业务线" prop="promotionBusinessLineId">
          <el-select v-model="formData.promotionBusinessLineId" placeholder="请选择推广业务线" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售负责人" prop="salesResponsibleId">
          <el-select v-model="formData.salesResponsibleId" placeholder="请选择销售负责人" filterable clearable remote
            :loading="formOptions.sales.loading" :remote-method="formOptions.sales.handleSearch">
            <el-option v-for="option in formOptions.sales.options" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="代理" prop="agencyId">
          <el-select v-model="formData.agencyId" placeholder="请选择代理" clearable filterable remote
            :loading="formOptions.agency.loading" :remote-method="formOptions.agency.handleSearch">
            <el-option v-for="option in formOptions.agency.options" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" clearable>
            <el-option v-for="option in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="option.value"
              :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="页面标签" prop="pageTags">
          <div class="flex justify-between items-center">
            <div class="flex gap-2 mr-2 flex-wrap">
              <el-tag v-for="item in pageTags" :key="item.value" closable class="w-100px text-3.5!"
                :disable-transitions="false" @close="pageTagsHandleClose(item)">
                {{ item.label }}
              </el-tag>
            </div>
            <el-popover :width="260" :visible="popoverVisible" placement="right" ref="popoverRef">
              <template #reference>
                <el-button :icon="Plus" size="small" circle @click="togglePopover(), popoverVisible = true"
                  v-click-outside="onClickOutside" />
              </template>
              <template #default>
                <div>设置标签</div>
                <div class="flex gap-2 p-2 my-2 flex-wrap b b-solid b-gray-300">
                  <el-tag v-for="tag in selectedTags" :key="tag.value" class="w-100px text-3.5!" closable
                    :disable-transitions="false" @close="selectedTagsHandleClose(tag)">
                    {{ tag.label }}
                  </el-tag>
                </div>
                <div class="flex gap-2 p-2 mb-2 flex-wrap">
                  <el-tag v-for="option in formOptions.pageTag.list" :key="option.value" :disable-transitions="false"
                    @click="handleClick(option)" class="cursor-pointer w-100px text-3.5!">
                    {{ option.label }}
                  </el-tag>
                </div>
                <div class="flex justify-end">
                  <el-button size="small" @click="selectedTagsSubmit">确定</el-button>
                  <el-button size="small" @click="selectedTagsReset">重置</el-button>
                </div>
              </template>
            </el-popover>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="pageBanner" label-width="60" class="relative">
          <form-create v-model="banner" :rule="bannerRule" :option="bannerOption" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="页面链接" prop="pageLinkId"
      v-if="props.variProps.formType === 'createPage' || props.variProps.formType === 'createChannel'">
      <el-select v-model="formData.pageLinkId" clearable placeholder="请选择页面链接">
        <el-option v-for="option in formOptions.registerLink.list" :key="option.value" :label="option.label"
          :value="option.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="页面链接" prop="pageLink" v-else>
      <el-select v-model="formData.pageLink" clearable placeholder="请选择页面链接" disabled>
        <el-option v-for="option in formOptions.registerLink.list" :key="option.value" :label="option.label"
          :value="option.value" />
      </el-select>
    </el-form-item>
    <div class="fw-bold my-4">Facebook分享信息</div>
    <el-form-item prop="facebookPicture" label-width="0">
      <form-create v-model="facebookPicture" :rule="facebookPictureRule" :option="facebookPictureOption" />
      <div class="ml-110px font-size-3 color-#BFBFBF">图片尺寸要求：600*315px，大小&lt;8MB</div>
    </el-form-item>
    <el-form-item label="分享标题" prop="facebookTitle">
      <el-input v-model="formData.facebookTitle" placeholder="文章的标题,不包含网站名称等任何品牌信息" />
    </el-form-item>
    <el-form-item label="分享描述" prop="facebookDescription">
      <el-input v-model="formData.facebookDescription" type="textarea" :rows="5"
        placeholder="内容的简略说明,通常为2-4个句子,此标签会显示在Facebook帖子的标题下方" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ClickOutside as vClickOutside } from "element-plus"
import {
  getIntDictOptions, DICT_TYPE, getPageTagOptions, getRegisterLinkOptions,
  handleRemoteUserOptions, handleRemoteAgencyOptions
} from '@/utils/dict'
import { defaultProps, handleTree, findParentWithCondition } from '@/utils/tree'
import { useUserStore } from '@/store/modules/user'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { getUser } from '@/api/system/user'
import * as DeptApi from '@/api/system/dept'
import { ChannelAgencyApi } from '@/api/crm/agency/agencymag'
import { ChannelPageApi, ChannelPageVO } from '@/api/crm/channel/page'

/** 页面 表单 */
defineOptions({ name: 'PageForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref() // 表单 Ref
const props = defineProps({
  variProps: {
    type: Object,
    required: true
  },
  funcProps: {
    type: Object,
    required: true
  }
})
const userStore = useUserStore()
const currentUser = {
  id: userStore.getUser.id,
  nickname: userStore.getUser.nickname
}

/* popover状态 */
const popoverRef = ref()
const popoverVisible = ref(false)

const finishDisabled = ref(true)
const watchStatus = ref(false)

/* banner图 */
const banner = ref()
const bannerRule = ref([
  {
    "type": "UploadImg",
    "field": "banner",
    "title": "banner图",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "400px",
      "height": "280px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'channel/page/banner/'
    },
    "hidden": false,
    "display": true,
  }]
)
const bannerOption = ref({
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
  },
})
/* facebook banner图 */
const facebookPicture = ref()
const facebookPictureRule = ref([
  {
    "type": "UploadImg",
    "field": "facebookPicture",
    "title": "分享图",
    "props": {
      "fileSize": 8,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "200px",
      "height": "105px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'channel/page/facebook_picture/'
    },
    "hidden": false,
    "display": true,
  }]
)
const facebookPictureOption = ref({
  "form": {
    "labelPosition": "left",
    "size": "default",
    "labelWidth": "110px",
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
  },
})

// 表单接口
interface ChannelPageFormData {
  id: number | undefined
  pageName: string | undefined
  pageType: number | undefined
  channelId: number | undefined
  agencyId: number | undefined
  promotionResponsibleId: number | undefined
  promotionResponsibleName: string | undefined
  promotionResponsibleDeptId: number | undefined
  promotionBusinessLineId: number | undefined
  salesResponsibleId: number | undefined
  salesResponsibleName: string | undefined
  pageTags: number[]
  pageLink: number | undefined
  pageLinkId: number | undefined
  pageBanner: string | undefined
  status: number
  remark: string | undefined
  facebookPicture: string | undefined
  facebookTitle: string | undefined
  facebookDescription: string | undefined
}

/* 表单数据 */
const formData = ref<ChannelPageFormData>({
  id: undefined,
  pageName: undefined,
  pageType: undefined,
  channelId: undefined,
  agencyId: undefined,
  promotionResponsibleId: undefined,
  promotionResponsibleName: undefined,
  promotionResponsibleDeptId: undefined,
  promotionBusinessLineId: undefined,
  salesResponsibleId: undefined,
  salesResponsibleName: undefined,
  pageTags: [],
  pageLink: undefined,
  pageLinkId: undefined,
  pageBanner: undefined,
  status: 0,
  remark: undefined,
  facebookPicture: undefined,
  facebookTitle: undefined,
  facebookDescription: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  pageName: [{ required: true, message: '渠道细分不能为空', trigger: 'blur' }],
  pageType: [{ required: true, message: '页面类型不能为空', trigger: 'change' }],
  promotionResponsibleId: [{ required: true, message: '推广负责人不能为空', trigger: 'change' }],
  promotionResponsibleDeptId: [{ required: true, message: '推广部门不能为空', trigger: 'change' }],
  promotionBusinessLineId: [{ required: true, message: '推广业务线不能为空', trigger: 'change' }],
  salesResponsibleId: [],
  agencyId: [{ required: true, message: '代理不能为空', trigger: 'blur' }],
  pageLinkId: [{ required: true, message: '页面链接不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
})

/* 选项列表 */
const formOptions = reactive({
  promotion: useRemoteSearch(handleRemoteUserOptions),
  sales: useRemoteSearch(handleRemoteUserOptions),
  agency: useRemoteSearch(handleRemoteAgencyOptions),
  registerLink: {
    list: ref([]),
    async get() {
      this.list = await getRegisterLinkOptions()
    }
  },
  pageTag: {
    list: ref([]),
    async get() {
      this.list = await getPageTagOptions()
    }
  },
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  async init() {
    await this.dept.load()
    await this.registerLink.get()
    await this.pageTag.get()
  }
})

/* 删除外层的标签 */
const pageTagsHandleClose = (tag: string) => {
  const index = selectedTags.value.findIndex(obj => JSON.stringify(obj) === JSON.stringify(tag))
  if (index !== -1) {
    formData.value.pageTags.splice(index, 1)
    selectedTags.value.splice(index, 1)
    formOptions.pageTag.list.push(tag)
  }
}

/* 删除内层的标签 */
const selectedTagsHandleClose = (tag: string) => {
  formOptions.pageTag.list.push(tag)
  selectedTags.value.splice(selectedTags.value.indexOf(tag), 1)
}

/* 添加标签 */
const handleClick = (tag: string) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    formOptions.pageTag.list = formOptions.pageTag.list.filter(item => item.value !== tag.value || item.label !== tag.label)
  }
}

/* 切换 Popover 的显示和隐藏状态 */
const togglePopover = () => {
  popoverVisible.value = !popoverVisible.value
}

/* 点击空白处隐藏 */
const onClickOutside = (e: any) => {
  if (
    popoverVisible.value &&
    !unref(popoverRef).popperRef.contentRef.contains(e.target)
  ) {
    popoverVisible.value = false
  }
}

/* 提交标签 */
const selectedTagsSubmit = () => {
  pageTags.value = selectedTags.value
  formData.value.pageTags = []
  selectedTags.value.forEach(tag => {
    formData.value.pageTags.push(tag.value)
  })
  togglePopover()
}

/* 重置标签 */
const selectedTagsReset = () => {
  if (selectedTags.value) {
    selectedTags.value.forEach(tag => {
      formOptions.pageTag.list.push(tag)
    })
    selectedTags.value = []
  }
}

// 5.pageTag
const selectedTags = ref([])
const pageTags = ref([])

/* 用户id获得用户名 */
const getUserNameFromId = async (id) => {
  const user = await getUser(id)
  return user.nickname
}

/* 代理id获得代理名 */
const getAgencyNameFromId = async (id) => {
  const agency = await ChannelAgencyApi.getChannelAgency(id)
  return agency.agencyName
}

// 处理负责人逻辑
const handleResponsibleData = async (type, id, name) => {
  if (id) {
    formData.value[`${type}ResponsibleId`] = id
    await formOptions[type].handleSearch(name)
  } else if (type === 'promotion') {
    // 只有推广负责人需要默认设置当前用户
    formData.value.promotionResponsibleId = currentUser.id
    await formOptions.promotion.handleSearch(currentUser.nickname)
  }
}

// 处理代理逻辑
const handleAgencyData = async (id, name) => {
  if (name) {
    formData.value.agencyId = id
    await formOptions.agency.handleSearch(name)
  } else {
    // 默认代理
    formData.value.agencyId = 1
    await formOptions.agency.handleSearch('CampusTop')
  }
}

// 处理页面标签逻辑
const handlePageTags = () => {
  if (formData.value.pageTags === null) {
    formData.value.pageTags = []
  }
  selectedTags.value = pageTags.value = transformArray(
    formOptions.pageTag.list,
    formData.value.pageTags
  )
  // 过滤已选择的标签
  if (pageTags.value.length > 0) {
    const tagValues = new Set(pageTags.value.map(tag => `${tag.value}-${tag.label}`))
    formOptions.pageTag.list = formOptions.pageTag.list.filter(
      item => !tagValues.has(`${item.value}-${item.label}`)
    )
  }
}

const transformArray = (array1, array2) => {
  const map = new Map(array1.map(item => [item.value, item]))
  return array2.map(value => map.get(value))
}

// 获取推广部门和推广业务线
const getDeptAndBusinessLine = () => {
  if (formOptions.promotion.options[0].deptIds && formOptions.promotion.options[0].deptIds.length === 1) {
    formData.value.promotionResponsibleDeptId = formOptions.promotion.options.find(item => formData.value.promotionResponsibleId === item.value).deptIds[0]
    const parentDept = findParentWithCondition(formOptions.dept.list, formData.value.promotionResponsibleDeptId, getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES).map(item => item.value))
    if (parentDept) formData.value.promotionBusinessLineId = parentDept.id
  }
}

/* 从上一页继承数据 */
const getDataFromChannel = async (channel) => {
  formData.value.channelId = props.variProps.fData.id
  formData.value.pageType = channel
  // 若上个页面有设置推广负责人，自动带入上一页面配置的推广负责人，若无自动带入当前的登录用户为推广负责人
  if (props.variProps.fData.promotionResponsibleId) {
    formData.value.promotionResponsibleId = props.variProps.fData.promotionResponsibleId
    formData.value.promotionResponsibleName = await getUserNameFromId(props.variProps.fData.promotionResponsibleId)
    await formOptions.promotion.handleSearch(formData.value.promotionResponsibleName)
  } else {
    formData.value.promotionResponsibleId = useUserStore().getUser.id
    await formOptions.promotion.handleSearch(useUserStore().getUser.nickname)
  }
  getDeptAndBusinessLine()
  // 若上个页面有设置销售负责人，自动带入上一页面配置的销售负责人
  if (props.variProps.fData.salesResponsibleId) {
    formData.value.salesResponsibleId = props.variProps.fData.salesResponsibleId
    formData.value.salesResponsibleName = await getUserNameFromId(props.variProps.fData.salesResponsibleId)
    await formOptions.sales.handleSearch(formData.value.salesResponsibleName)
  }
  switch (channel) {
    case 1:
      formData.value.pageName = props.variProps.fData.activityName
      formData.value.agencyId = 1
      await formOptions.agency.handleSearch('CampusTop')
      break
    case 2:
      formRules.salesResponsibleId = formData.value.pageType === 2 ? [{ required: true, message: '销售负责人不能为空', trigger: 'change' }] : [{ required: false }]
      formData.value.agencyId = props.variProps.fData.id
      const agencyName = await getAgencyNameFromId(formData.value.agencyId)
      await formOptions.agency.handleSearch(agencyName)
      const isDefaultItem = props.variProps.fData.responsibleList.find(item => item.isDefault === 1)
      if (isDefaultItem) {
        if (isDefaultItem.promotionResponsibleId) {
          formData.value.promotionResponsibleId = isDefaultItem.promotionResponsibleId
          formData.value.promotionResponsibleName = await getUserNameFromId(isDefaultItem.promotionResponsibleId)
          await formOptions.promotion.handleSearch(formData.value.promotionResponsibleName)
        }
        if (isDefaultItem.salesResponsibleId) {
          formData.value.salesResponsibleId = isDefaultItem.salesResponsibleId
          formData.value.salesResponsibleName = await getUserNameFromId(isDefaultItem.salesResponsibleId)
          await formOptions.sales.handleSearch(formData.value.salesResponsibleName)
        }
      }
      break
    default:
      formData.value.agencyId = 1
      await formOptions.agency.handleSearch('CampusTop')
      break
  }
}

// 监视数据填写情况
watch([
  () => formData.value.pageName,
  () => formData.value.pageType,
  () => formData.value.status,
  () => formData.value.pageLinkId
],
  () => {
    if (formData.value.pageName &&
      formData.value.pageType &&
      typeof formData.value.status === 'number' &&
      typeof formData.value.pageLinkId === 'number') {
      finishDisabled.value = false
    } else {
      finishDisabled.value = true
    }
  })

watch(() => formData.value.promotionResponsibleId, () => {
  if (watchStatus.value) {
    getDeptAndBusinessLine()
  }
})

/* 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    if (banner.value) formData.value.pageBanner = banner.value.banner
    if (facebookPicture.value) formData.value.facebookPicture = facebookPicture.value.facebookPicture
    const data = formData.value as unknown as ChannelPageVO
    if (props.variProps.formType === 'createPage' || props.variProps.formType === 'createChannel') {
      try {
        await ChannelPageApi.createChannelPage(data)
        message.success(t('common.createSuccess'))
        props.funcProps.close()
      } catch (e) {
        message.error('新增失败')
      }
    } else {
      await ChannelPageApi.updateChannelPage(data)
      message.success(t('common.updateSuccess'))
      props.funcProps.close()
    }
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await formOptions.init()
  formLoading.value = true
  try {
    formData.value.pageType = props.variProps.channelInForm
    formData.value.channelId = props.variProps.fData.id
    if (props.variProps.formType === 'createPage') {
      // 处理推广负责人
      await handleResponsibleData(
        'promotion',
        props.variProps.fData.promotionResponsibleId,
        props.variProps.fData.promotionResponsibleName
      )
      // 处理销售负责人
      await handleResponsibleData(
        'sales',
        props.variProps.fData.salesResponsibleId,
        props.variProps.fData.salesResponsibleName
      )
      // 处理代理
      await handleAgencyData(
        props.variProps.fData.id,
        props.variProps.fData.agencyName
      )
    } else if (props.variProps.formType === 'updatePage') {
      // 获取页面数据
      formData.value = await ChannelPageApi.getChannelPage(props.variProps.fData.id)
      // 处理推广负责人
      await handleResponsibleData(
        'promotion',
        formData.value.promotionResponsibleId,
        formData.value.promotionResponsibleName
      )
      // 处理销售负责人
      await formOptions.sales.handleSearch(formData.value.salesResponsibleName)
      // 处理代理
      await formOptions.agency.handleSearch(formData.value.agencyName)
      // 处理页面标签
      handlePageTags()
      // 设置banner和facebook图片
      banner.value = { banner: formData.value.pageBanner }
      facebookPicture.value = { facebookPicture: formData.value.facebookPicture }
    }
    getDeptAndBusinessLine()
  } finally {
    formLoading.value = false
    watchStatus.value = true
  }
})
defineExpose({ formData, submitForm, finishDisabled, getDataFromChannel })
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>