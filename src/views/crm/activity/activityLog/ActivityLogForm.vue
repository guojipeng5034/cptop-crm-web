<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="740">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学员" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择或检索学员" clearable filterable remote
              :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions">
              <el-option v-for="option in customerOptions" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="hasAvailableActivity" label="活动" prop="activityManageId">
            <el-select v-model="formData.activityManageId" placeholder="请选择活动" clearable :disabled="false">
              <el-option v-for="dict in activityManageOption" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-else>
            <el-text size="large" class="font-bold" type="primary">选择学员以选择可参与的活动</el-text>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.activityManageId">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核状态" prop="auditStatus" v-loading="descriptionsLoading">
                <el-select v-model="formData.auditStatus" placeholder="请选择审核状态" clearable disabled>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ACTIVITY_AUDIT_STATUS)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="社交平台" prop=" socialPlatform">
                <el-select v-model="formData.socialPlatform" placeholder="请选择社交平台" clearable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SOCIAL_PLATFORM)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" v-loading="descriptionsLoading">
          <div class="flex justify-center font-700 mb-2">详细信息</div>
          <el-form-item label-width="30">
            <el-descriptions :column="1" border size="small" class="w-100%">
              <el-descriptions-item label="审核方式" align="center">
                <arco-tag :size="'small'" :type="DICT_TYPE.AUTO_AUDIT_STATUS"
                  :value="formData.activityManageInfo.autoAuditStatus" />
              </el-descriptions-item>
              <el-descriptions-item label="奖励发放方式" align="center">
                <arco-tag :size="'small'" :type="DICT_TYPE.REWARD_STATUS"
                  :value="formData.activityManageInfo.rewardStatus" />
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="formData.activityManageInfo.rewardStatus === 1">
          <el-form-item label="奖励类型" prop="rewardTypeSelected" v-loading="descriptionsLoading">
            <el-radio-group v-model="formData.rewardTypeSelected">
              <el-radio v-for="item in rewardTypeOption" :key="item.value" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="m-block-3">
          <el-form-item prop="partiallyVisibleStatus">
            <template #label>
              <div class="flex flex-col justify-center items-center">
                <span>朋友圈</span>
                <span>部分可见</span>
              </div>
            </template>
            <el-radio-group v-model="formData.partiallyVisibleStatus">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.PARTIALLY_VISIBLE_STATUS)" :key="dict.value"
                :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="微信图片" prop="wechatImgs">
            <form-create v-model="wechatImgs" :rule="wechatImgsRule" :option="wechatImgsOption" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请填写备注" />
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
  getIntDictOptions, DICT_TYPE, getAvailableActivityManageOptions,
  handleRemoteExistAccoutCustomerOptions
} from '@/utils/dict'
import { ActivityLogApi, ActivityLogVO } from '@/api/crm/activity/activityLog'
import { ActivityManageApi } from '@/api/crm/activity/activityManage'

/** 学生活动日志 表单 */
defineOptions({ name: 'ActivityLogForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref<{
  id: number | undefined;
  customerId: number | undefined;
  activityManageId: number | undefined;
  activityManageInfo: { autoAuditStatus: number | undefined; rewardStatus: number | undefined, rewardType: number[] };
  wechatImgs: string[];
  auditStatus: number | undefined;
  rewardTypeSelected: number | undefined;
  auditTime: string | undefined;
  auditUserId: number | undefined;
  socialPlatform: string | undefined;
  partiallyVisibleStatus: number | undefined;
  remark: string | undefined;
}>({
  id: undefined,
  customerId: undefined,
  activityManageId: undefined,
  activityManageInfo: { autoAuditStatus: undefined, rewardStatus: undefined, rewardType: [] },
  wechatImgs: [],
  auditStatus: undefined,
  rewardTypeSelected: undefined,
  auditTime: undefined,
  auditUserId: undefined,
  socialPlatform: undefined,
  partiallyVisibleStatus: undefined,
  remark: ''
})

/** 微信图片 */
const wechatImgs = ref({ wechatImgs: [] })
const wechatImgsRule = ref([
  {
    "type": "UploadImgs",
    "field": "wechatImgs",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "compress": true,
      "path": 'activity/activityLog/wechatImgs/'
    },
    "hidden": false,
    "display": true,
  }]
)
const wechatImgsOption = ref({
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

/* 表单校验规则 */
const formRules = reactive({
  customerId: [{ required: true, message: '学员不能为空', trigger: 'change' }],
  activityManageId: [{ required: true, message: '活动不能为空', trigger: 'change' }],
  // wechatImgs: [{ required: true, message: '微信图片不能为空', trigger: 'change' }],
  wechatImgs: [
    {
      required: true, validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback('请上传至少一张微信图片')
        } else {
          callback()
        }
      }, trigger: 'change'
    },
  ],
})

/* 监听活动变化 */
watch(() => formData.value.activityManageId, async (val) => {
  if (!val) return
  descriptionsLoading.value = true
  try {
    formData.value.activityManageInfo = (({ autoAuditStatus, rewardStatus, rewardType }) => ({
      autoAuditStatus,
      rewardStatus,
      rewardType,
    }))(await ActivityManageApi.getActivityManage(val))
    // 设置延迟
    setTimeout(() => {
      if (formType.value === 'create') {
        switch (formData.value.activityManageInfo.autoAuditStatus) {
          case 1:
            formData.value.auditStatus = 1
            break
          case 0:
            formData.value.auditStatus = 0
            break
          default:
            formData.value.auditStatus = 0
        }
      }
      rewardTypeOption.value = getIntDictOptions(DICT_TYPE.REWARD_TYPE)
        .filter(item => formData.value.activityManageInfo.rewardType.includes(item.value))
      descriptionsLoading.value = false // 停止加载
    }, 500)
  } catch (e) {
    console.log(e)
  }
})

const descriptionsLoading = ref(true)

/* option */
// 1.customer
const customerOptionsLoading = ref(false)
const customerOptions = ref([])
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  handleRemoteExistAccoutCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

// 2.activityManage
const activityManageOption = ref()

// 3.rewardType
const rewardTypeOption = ref()

/* 可用活动设置情况 */
const hasAvailableActivity = ref(false)
/* 监视学员变化 */
watch(() => formData.value.customerId, async (newVal) => {
  if (formType.value === 'update') return
  // 切换学员时，清空活动和微信图片
  hasAvailableActivity.value = false
  formData.value.activityManageId = undefined
  formData.value.wechatImgs = { wechatImgs: [] }
  try {
    if (newVal) {
      // 获取可用活动
      activityManageOption.value = await getAvailableActivityManageOptions(newVal)
      hasAvailableActivity.value = true
    } else {
      activityManageOption.value = []
      hasAvailableActivity.value = false
    }
  } catch (e) {
    console.log(e)
  }
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ActivityLogApi.getActivityLog(id)
      if (formData.value.activityManageId) {
        activityManageOption.value = await getAvailableActivityManageOptions(formData.value.customerId)
        hasAvailableActivity.value = true
      }
      fetchRemoteCustomerOptions(formData.value.customerId)
      wechatImgs.value.wechatImgs = formData.value.wechatImgs
    } finally {
      formLoading.value = false
      setTimeout(() => {
        formType.value = 'updating'
      }, 1)
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (wechatImgs.value.wechatImgs)
    formData.value.wechatImgs = wechatImgs.value.wechatImgs
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ActivityLogVO
    if (formType.value === 'create') {
      await ActivityLogApi.createActivityLog(data)
      message.success(t('common.createSuccess'))
    } else {
      await ActivityLogApi.updateActivityLog(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  customerOptions.value = []
  wechatImgs.value = { wechatImgs: [] }
  formData.value = {
    id: undefined,
    customerId: undefined,
    activityManageId: undefined,
    activityManageInfo: { autoAuditStatus: undefined, rewardStatus: undefined, rewardType: [] },
    wechatImgs: [],
    auditStatus: undefined,
    rewardTypeSelected: undefined,
    auditTime: undefined,
    auditUserId: undefined,
    socialPlatform: undefined,
    partiallyVisibleStatus: undefined,
    remark: ''
  }
  formRef.value?.resetFields()
}
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

:deep(.el-descriptions--small .el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
  padding: 1px;
}
</style>