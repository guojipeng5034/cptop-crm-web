<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-row>
        <el-col :span="24" class="title">分配规则基础信息：</el-col>
        <el-col :span="10">
          <el-form-item label="规则名称" prop="ployName">
            <el-input v-model="formData.ployName" placeholder="请输入规则名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="ployEnable">
            <el-switch v-model="formData.ployEnable" :active-value="1" :inactive-value="0" inline-prompt />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="ployRemark">
            <el-input v-model="formData.ployRemark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="title">符合以下全部条件的线索：</el-col>
        <el-col :span="8">
          <el-form-item label="分配类型" prop="ployType">
            <el-select v-model="formData.ployType" placeholder="请选择分配类型" clearable :disabled="formType === 'update'"
              @change="(val) => handleFieldChange('ployType', val)">
              <el-option-group v-for="group in queryOptions.ployType.options" :key="group.label" :label="group.label">
                <el-option v-for="option in group.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 0">
          <el-form-item label="推广业务线" prop="promotionBusinessLineId">
            <el-select v-model="formData.promotionBusinessLineId" placeholder="请选择推广业务线" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 0">
          <el-form-item label="一级渠道" prop="channelFirst">
            <el-select v-model="formData.channelFirst" placeholder="一级渠道" clearable filterable
              @change="queryOptions.channelFirst.change">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_CHANNEL_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 0">
          <el-form-item label="二级渠道" prop="channelSecond">
            <el-select v-model="formData.channelSecond" placeholder="二级渠道" :disabled="!formData.channelFirst" clearable
              filterable>
              <el-option v-for="option in queryOptions.channelSecond.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 0">
          <el-form-item label="三级渠道" prop="channelThird">
            <el-select v-model="formData.channelThird" placeholder="三级渠道"
              :disabled="formData.channelFirst === undefined" clearable :remote="needRemote"
              :loading="channelThirdOptionLoading" :remote-method="fetchRemoteChannelThirdOptions" filterable>
              <el-option v-for="dict in channelThirdOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 0">
          <el-form-item label="四级渠道" prop="channelFourth">
            <el-select v-model="formData.channelFourth" placeholder="四级渠道" clearable filterable remote
              :loading="channelFourthOptionsLoading" :remote-method="fetchRemoteChannelFourthOptions">
              <el-option v-for="item in channelFourthOptions" :key="item.value" :label="item.label" :value="item.value">
                <div class="flex justify-between gap-4">
                  <span>{{ item.label }}</span>
                  <span style="color: var(--el-text-color-secondary); font-size: 13px;">
                    {{ getDictLabel(DICT_TYPE.CRM_CHANNEL_TYPE, item.pageType) }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="formData.ployType === 1">
          <el-form-item label="推荐人归属顾问的部门" prop="referrerMentorDeptIds" label-width="180">
            <el-tree-select v-model="formData.referrerMentorDeptIds" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="5"
              show-checkbox default-expand-all placeholder="请选择推荐人归属顾问的部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, formData.referrerMentorDeptIds, 'id', formLoading)">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.ployType === 3">
          <el-form-item label="是否是代理" prop="isAgency">
            <el-select v-model="formData.isAgency" placeholder="请选择是否是代理" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="formData.ployType === 3">
          <el-form-item label="Mentor部门" prop="mentorDeptIds">
            <el-tree-select v-model="formData.mentorDeptIds" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="5"
              show-checkbox default-expand-all placeholder="请选择Mentor部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, formData.mentorDeptIds, 'id', formLoading)">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="title">通过以下策略：</el-col>
        <el-col :span="8">
          <el-form-item label="分配策略" prop="assignStrategy">
            <el-select v-model="formData.assignStrategy" placeholder="请选择分配策略" clearable
              @change="(val) => handleFieldChange('assignStrategy', val)">
              <el-option v-for="option in queryOptions.assignStrategy.options" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="title">分配给：</el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="8">
              <el-form-item label="分配目标" prop="assignTarget">
                <div v-if="formData.assignStrategy === 0">
                  <span v-if="formData.ployType === 1">
                    {{ getLabelByValue(4, getIntDictOptions(DICT_TYPE.ASSIGN_TARGET)) }}
                  </span>
                  <span v-else-if="formData.ployType === 2">
                    {{ getLabelByValue(2, getIntDictOptions(DICT_TYPE.ASSIGN_TARGET)) }}
                  </span>
                  <span v-if="formData.ployType === 3">
                    {{ getLabelByValue(3, getIntDictOptions(DICT_TYPE.ASSIGN_TARGET)) }}
                  </span>
                </div>
                <el-radio-group v-model="formData.assignTarget" v-else
                  @change="(val) => handleFieldChange('assignTarget', val)">
                  <el-radio-button v-for="option in queryOptions.assignTarget.options" :key="option.value"
                    :label="option.label" :value="option.value" :disabled="option.disabled" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="formData.assignTarget === 1">
              <el-form-item prop="publicPoolDeptIds" label-width="10">
                <el-tree-select v-model="formData.publicPoolDeptIds" multiple filterable clearable
                  :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags
                  :max-collapse-tags="5" show-checkbox default-expand-all placeholder="请选择部门" node-key="id"
                  @check-change="(node, checked) => handleTreeCheckChange(node, checked, formData.publicPoolDeptIds, 'id', formLoading)">
                  <template #default="{ node, data }">
                    <div class="custom-tree-node flex items-center gap-1">
                      <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                      <span>{{ node.label }}</span>
                    </div>
                  </template>
                </el-tree-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="flex justify-between items-center" v-if="formData.assignTarget === 0">
        <el-col :span="8">
          <el-form-item label="选择方式" prop="chooseMethod">
            <el-select v-model="formData.chooseMethod" placeholder="请选择选择方式" clearable
              @change="(val) => handleFieldChange('chooseMethod', val)">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CHOOSE_METHOD)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-if="formData.chooseMethod === 0">
          <el-form-item prop="chooseByDeptIds" label-width="10">
            <el-tree-select v-model="formData.chooseByDeptIds" multiple filterable clearable
              :data="queryOptions.dept.list" :props="defaultProps" check-strictly collapse-tags :max-collapse-tags="5"
              show-checkbox default-expand-all placeholder="请选择部门" node-key="id"
              @check-change="(node, checked) => handleTreeCheckChange(node, checked, formData.chooseByDeptIds, 'id', formLoading)">
              <template #default="{ node, data }">
                <div class="custom-tree-node flex items-center gap-1">
                  <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" v-else-if="formData.chooseMethod === 1">
          <el-form-item prop="chooseByPostIds" label-width="10">
            <el-select v-model="formData.chooseByPostIds" placeholder="请选择岗位" multiple>
              <el-option v-for="option in queryOptions.post.list" :key="option.id" :label="option.name"
                :value="option.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <div v-else-if="formData.chooseMethod === 2">
          <el-form-item prop="mentorId" label-width="0">
            <transition name="slide-right">
              <el-select v-model="formData.mentorId" v-if="showSelect" placeholder="请检索后选择可分配顾问" clearable filterable
                remote :loading="queryOptions.mentor.loading" :remote-method="queryOptions.mentor.handleSearch"
                class="!w-240px">
                <el-option v-for="option in queryOptions.mentor.options" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </transition>
            <el-button class="m-l-2" v-show="showSelect" type="success" @click="addMentor">加入</el-button>
            <el-button v-show="showSelect" type="danger" @click="cancelAdd">取消</el-button>
            <el-button v-show="!showSelect" type="primary" @click="startAdd">新增</el-button>
          </el-form-item>
        </div>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="formData.chooseMethod === 2">
          <el-form-item prop="chooseByMentorIds" label-width="0">
            <el-table v-loading="loading" :data="list" border stripe>
              <el-table-column label="可分配顾问" align="center" prop="nickname" />
              <el-table-column label="所在部门" align="center" prop="deptNames" />
              <!-- <el-table-column label="岗位" align="center" prop="postIds" /> -->
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button link type="danger" @click="deleteMentor(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  DICT_TYPE, getIntDictOptions, getDictLabel, getLabelByValue,
  handleRemoteChannelActivityOptions, handleRemoteAgencyOptions, handleRemotePageOptions,
  handleRemoteUserOptions
} from '@/utils/dict'
import { isArray } from '@/utils/is'
import { defaultProps, handleTree, handleTreeCheckChange } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ListOwnerAssignPloyApi, ListOwnerAssignPloyVO } from '@/api/crm/customer/assign/ploy'
import { getUser } from '@/api/system/user'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import { ChannelActivityApi } from '@/api/crm/channel/activity'
import { ChannelAgencyApi } from '@/api/crm/agency/agencymag'
import { ChannelPageApi } from '@/api/crm/channel/page'

/** 规则管理 表单 */
defineOptions({ name: 'AssignPolyForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
interface Mentor {
  id: string | number
  nickname: string
  deptNames: string
  postIds: string[] | number[]
}
const list = ref<Mentor[]>([]) // 列表数据
const loading = ref(false)
const showSelect = ref(false)
const isSubmitting = ref(false)

/* 表单数据 */
const formData = ref({
  ployName: undefined, // 分配规则名称
  ployEnable: 0, // 状态
  ployRemark: undefined, // 备注
  ployType: undefined, // 分配类型
  promotionBusinessLineId: undefined, // 推广业务线
  channelFirst: undefined, // 一级渠道
  channelSecond: undefined, // 二级渠道
  channelThird: undefined, // 三级渠道
  channelFourth: undefined, // 四级渠道
  isAgency: undefined, // 是否是代理
  mentorDeptIds: [], // mentor部门
  referrerMentorDeptIds: [], // 推荐人归属顾问的部门
  assignStrategy: undefined, // 分配策略
  assignTarget: 0, // 分配目标
  chooseMethod: undefined, // 选择方式
  chooseByDeptIds: [],
  chooseByPostIds: [],
  chooseByMentorIds: [],
  publicPoolDeptIds: [],
  mentorId: undefined // 顾问（自用字段）
})

/* 表单校验规则 */
const formRules = reactive({
  ployName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  ployEnable: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  ployType: [{ required: true, message: '分配类型不能为空', trigger: 'change' }],
  referrerMentorDeptIds: computed(() => formData.value.ployType === 1 ? [{ required: true, message: '推荐人归属顾问的部门不能为空', trigger: 'change' }] : []),
  // isAgency: computed(() => formData.value.ployType === 3 ? [{ required: true, message: '是否是代理不能为空', trigger: 'change' }] : []),
  mentorDeptIds: computed(() => formData.value.ployType === 3 ? [{ required: true, message: 'Mentor部门不能为空', trigger: 'change' }] : []),
  assignStrategy: [{ required: true, message: '分配策略不能为空', trigger: 'change' }],
  assignTarget: [{ required: true, message: '分配目标不能为空', trigger: 'change' }],
  chooseMethod: computed(() => formData.value.ployType !== 2 ? [{ required: true, message: '选择方式不能为空', trigger: 'change' }] : []),
  mentorId: computed(() =>
    showSelect.value && formData.value.chooseMethod === 2 && !isSubmitting.value ? [
      { required: true, message: 'mentor不能为空', trigger: 'change' },
      {
        validator: async (rule, value, callback) => {
          const isExist = list.value.some(item => item.id === value)
          if (isExist) {
            callback('mentor已存在')
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ] : []),
  chooseByDeptIds: computed(() => formData.value.ployType !== 0 ? [{ required: true, message: '部门不能为空', trigger: 'change' }] : []),
  chooseByPostIds: computed(() => formData.value.ployType !== 1 ? [{ required: true, message: '岗位不能为空', trigger: 'change' }] : []),
  chooseByMentorIds: computed(() => formData.value.ployType !== 2 ? [{ required: true, message: '顾问不能为空', trigger: 'change' }] : []),
})

/* 选项列表 */
const queryOptions = reactive({
  ployType: {
    options: Object.entries({ '线索分配': [0, 1, 2], '学员分配': [3] })
      .map(([groupName, values]) => ({
        label: groupName,
        options: getIntDictOptions(DICT_TYPE.PLOY_TYPE)
          .filter(item => values.includes(item.value))
          .map(item => ({
            value: item.value,
            label: item.label
          }))
      }))
  },
  assignStrategy: {
    options: computed(() => {
      if (formData.value.ployType === 2) {
        return getIntDictOptions(DICT_TYPE.ASSIGN_STRATEGY).filter(item => item.value === 0)
      } else if (formData.value.ployType === 0 || formData.value.ployType === 3) {
        return getIntDictOptions(DICT_TYPE.ASSIGN_STRATEGY).filter(item => item.value === 1)
      }
      return getIntDictOptions(DICT_TYPE.ASSIGN_STRATEGY)
    })
  },
  assignTarget: {
    options: computed(() => {
      if (formData.value.assignStrategy === 0) {
        if (formData.value.ployType === 1) {
          return getIntDictOptions(DICT_TYPE.ASSIGN_TARGET).filter(item => item.value === 4)
        } else if (formData.value.ployType === 2) {
          return getIntDictOptions(DICT_TYPE.ASSIGN_TARGET).filter(item => item.value === 2)
        } else if (formData.value.ployType === 3) {
          return getIntDictOptions(DICT_TYPE.ASSIGN_TARGET).filter(item => item.value === 3)
        }
      } else {
        if (formData.value.ployType === 3) {
          return getIntDictOptions(DICT_TYPE.ASSIGN_TARGET)
            .filter(item => item.value === 0 || item.value === 1)
            .map(item => ({
              ...item,
              disabled: item.value === 1
            }))
        }
      }
      return getIntDictOptions(DICT_TYPE.ASSIGN_TARGET).filter(item => item.value === 0 || item.value === 1)
    })
  },
  channelFirst: {
    change: () => {
      formData.value.channelSecond = undefined
      formData.value.channelThird = undefined
    },
  },
  channelSecond: {
    options: computed(() => {
      switch (formData.value.channelFirst) {
        case 1:
          return getIntDictOptions(DICT_TYPE.CRM_ACTIVITY_TYPE)
        case 2:
          return getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM).filter(item => item.value !== 0)
        case 3:
          return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_CHANNELS)
        case 4:
          return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_SOURCE)
        case 5:
          return getIntDictOptions(DICT_TYPE.CRM_NEW_MEDIA_BUSINESS)
      }
    }),
  },
  mentor: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  post: {
    list: ref([] as PostApi.PostVO[]),
    async load() {
      this.list = await PostApi.getSimplePostList()
    }
  },
  async init() {
    await this.dept.load()
    await this.post.load()
  }
})

// 4.channelActivity
const channelActivityOptions = ref([])
const channelActivityOptionsLoading = ref(false)
const fetchRemoteChannelActivityOptions = async (query) => {
  const setActivityOptions = (newValue) => (channelActivityOptions.value = newValue)
  const setActivityLoading = (newValue) => (channelActivityOptionsLoading.value = newValue)
  await handleRemoteChannelActivityOptions(query, setActivityOptions, setActivityLoading, formData.value.channelSecond)
}

// 5.channelAgency
const channelAgencyOptions = ref([])
const channelAgencyOptionsLoading = ref(false)
const fetchRemoteChannelAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (channelAgencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (channelAgencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query, setAgencyOptions, setAgencyLoading, 2, formData.value.channelSecond)
}

// 8.channelThird
const needRemote = computed(() => formData.value.channelFirst === 1 || formData.value.channelFirst === 2)
const channelThirdOption = computed(() => {
  switch (formData.value.channelFirst) {
    case 1:
      return channelActivityOptions.value
    case 2:
      return channelAgencyOptions.value
    case 3:
      return getIntDictOptions(DICT_TYPE.ADVERTISEMENT_PLATFORM)
    case 4:
      return getIntDictOptions(DICT_TYPE.NATURAL_FLOW_REGISTER_TYPE)
    case 5:
      return getIntDictOptions(DICT_TYPE.CRM_SNS_TYPE)
  }
})
const channelThirdOptionLoading = computed(() => {
  switch (formData.value.channelFirst) {
    case 1:
      return channelActivityOptionsLoading.value
    case 2:
      return channelAgencyOptionsLoading.value
  }
})
const fetchRemoteChannelThirdOptions = computed(() => {
  switch (formData.value.channelFirst) {
    case 1:
      return fetchRemoteChannelActivityOptions
    case 2:
      return fetchRemoteChannelAgencyOptions
  }
})

// 9.channelFourth
const channelFourthOptions = ref([])
const channelFourthOptionsLoading = ref(false)
const fetchRemoteChannelFourthOptions = async (query) => {
  const setPageOptions = (newValue) => (channelFourthOptions.value = newValue)
  const setPageLoading = (newValue) => (channelFourthOptionsLoading.value = newValue)
  await handleRemotePageOptions(query.trim(), setPageOptions, setPageLoading, formData.value.channelFirst, formData.value.channelSecond, formData.value.channelThird)
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await queryOptions.init()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ListOwnerAssignPloyApi.getListOwnerAssignPloy(id)
      // 三、四级渠道回显
      if (formData.value?.channelThird) {
        // 策略配置：建议提取到文件顶部或单独配置文件中
        const strategy = {
          1: {
            api: ChannelActivityApi.getChannelActivity,
            optionsRef: channelActivityOptions,
            labelKey: 'activityName',
          },
          2: {
            api: ChannelAgencyApi.getChannelAgency,
            optionsRef: channelAgencyOptions,
            labelKey: 'agencyName',
          },
        }
        const channelType = Number(formData.value.channelFirst)
        const { api, optionsRef, labelKey } = strategy[channelType]
        const response = await api(formData.value.channelThird)
        optionsRef.value = Array.isArray(response)
          ? response.map(item => ({ value: item.id, label: item[labelKey] }))
          : [{ value: response.id, label: response[labelKey] }]
      }
      if (formData.value.channelFourth) {
        const response = await ChannelPageApi.getChannelPage(formData.value.channelFourth)
        channelFourthOptions.value = [response].map(item => ({
          value: item.id,
          label: item.pageName,
        }))
      }
      if (formData.value.chooseByMentorIds) {
        formData.value.chooseByMentorIds.forEach(async (item) => {
          const { id, nickname, deptNames, postIds } = await getUser(item)
          list.value.push({
            id,
            nickname,
            deptNames,
            postIds
          })
        })
      }
    } finally {
      await new Promise(resolve => requestAnimationFrame(resolve))
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// change 处理函数
const handleFieldChange = async (fieldName, value) => {
  const relation = fieldRelations[fieldName]
  if (relation?.clears) {
    relation.clears.forEach(field => {
      formData.value[field] = isArray(formData.value[field]) ? [] : null
    })
  }
  if (relation?.specialLogic) {
    await relation.specialLogic(value, formData.value)
  }
}

const fieldRelations = {
  ployType: {
    // clears: ['promotionBusinessLineId', 'channelFirst', 'channelSecond', 'channelThird', 'channelFourth',
    //   'isAgency', 'mentorDeptIds', 'referrerMentorDeptIds',
    //   'assignStrategy', 'assignTarget', 'chooseMethod', 'chooseByDeptIds', 'chooseByPostIds', 'chooseByMentorIds', 'publicPoolDeptIds', 'mentorId'],
    clears: ['assignTarget', 'assignStrategy', 'mentorId'],
    specialLogic: (value, formData) => {
      if (value === 2) {
        formData.assignStrategy = 0 // 分配策略：定向分配
        formData.assignTarget = 2 // 分配目标：渠道指定销售负责人
      } else if (value === 1) {
        formData.assignStrategy = 0 // 分配策略：定向分配
        formData.assignTarget = 4 // 分配目标：渠道指定销售负责人
      } else {
        formData.assignStrategy = 1 // 分配策略：轮询分配
        formData.assignTarget = 0 // 分配目标：个人私海
      }
    }
  },
  assignStrategy: {
    clears: ['assignTarget', 'mentorId'],
    specialLogic: (value, formData) => {
      if (value === 0) {
        if (formData.ployType === 1) {
          formData.assignTarget = 4 // 分配目标：推荐人原归属顾问
        } else if (formData.ployType === 2) {
          formData.assignTarget = 2 // 分配目标：渠道指定销售负责人
        } else if (formData.assignTarget = 3) {
          formData.assignTarget = 3 // 分配目标：成单顾问
        }
      } else {
        formData.assignTarget = 0 // 分配目标：个人私海
      }
    }
  },
  // assignTarget: {
  //   clears: ['chooseMethod', 'chooseByDeptIds', 'chooseByPostIds', 'chooseByMentorIds', 'publicPoolDeptIds', 'mentorId'],
  // },
  chooseMethod: {
    // clears: ['chooseByDeptIds', 'chooseByPostIds', 'chooseByMentorIds', 'publicPoolDeptIds', 'mentorId'],
    specialLogic: () => {
      showSelect.value = false
    }
  },
}

/* （开启）新增 */
const startAdd = () => {
  showSelect.value = true
}

/* （关闭）新增 */
const cancelAdd = async () => {
  showSelect.value = false
  await formRef.value.validateField('mentorId')
}

/* 添加 */
const addMentor = async () => {
  await formRef.value.validateField('mentorId')
  const { id, nickname, deptNames, postIds } = await getUser(formData.value.mentorId)
  list.value.push({
    id,
    nickname,
    deptNames,
    postIds
  })
  formData.value.chooseByMentorIds.push(id)
}

/* 删除 */
const deleteMentor = async (id) => {
  const listIdx = list.value.findIndex(item => item.id === id)
  if (listIdx !== -1) {
    list.value.splice(listIdx, 1)
  }
  const formIdx = formData.value.chooseByMentorIds.findIndex(item => item === id)
  if (formIdx !== -1) {
    formData.value.chooseByMentorIds.splice(formIdx, 1)
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  isSubmitting.value = true
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ListOwnerAssignPloyVO
    if (formType.value === 'create') {
      await ListOwnerAssignPloyApi.createListOwnerAssignPloy(data)
      message.success(t('common.createSuccess'))
    } else {
      await ListOwnerAssignPloyApi.updateListOwnerAssignPloy(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    isSubmitting.value = false
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    ployName: undefined,
    ployEnable: 0,
    ployRemark: undefined,
    ployType: undefined,
    promotionBusinessLineId: undefined,
    channelFirst: undefined,
    channelSecond: undefined,
    channelThird: undefined,
    channelFourth: undefined,
    isAgency: undefined,
    mentorDeptIds: [],
    referrerMentorDeptIds: [],
    assignStrategy: undefined,
    assignTarget: 0,
    chooseMethod: undefined,
    chooseByDeptIds: [],
    chooseByPostIds: [],
    chooseByMentorIds: [],
    publicPoolDeptIds: [],
    mentorId: undefined
  }
  formRef.value?.resetFields()
  list.value = []
}
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.title {
  font-weight: 700;
  margin-bottom: 15px;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 12px;
    background: #366cff;
    line-height: 12px;
    margin-right: 8px;
  }
}

/* 从右向左滑入动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>