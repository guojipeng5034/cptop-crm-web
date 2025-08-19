<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading"
    :validate-on-rule-change="false">
    <el-row>
      <el-col :span="8">
        <el-form-item label="合作模式" prop="agencyType">
          <el-select v-model="formData.agencyType" clearable placeholder="请选择合作模式">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_EXTERNAL_COOPERATION_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="姓名" prop="agencyName">
          <el-input v-model.trim="formData.agencyName" clearable placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别" prop="gender" class="gender">
          <el-segmented v-model="formData.gender" :options="getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)">
            <template #default="{ item }">
              <div class="p-inline-4">
                <div>{{ item.label }}</div>
              </div>
            </template>
          </el-segmented>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="地址" prop="agencyAddress">
          <el-input v-model.trim="formData.agencyAddress" clearable placeholder="请输入地址" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="学员" prop="agencyStudentId">
          <el-select v-model="formData.agencyStudentId" placeholder="请检索学员" clearable filterable remote
            :loading="customerOptionsLoading" :remote-method="fetchRemoteCustomerOptions">
            <el-option v-for="dict in customerOptions" :key="dict.value" :value="dict.value" :label="dict.label" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="国家区号" prop="countryCode">
          <el-select v-model="formData.countryCode" placeholder="请选择国家区号" clearable filterable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TELEPHONE_CODE_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="电话" prop="agencyPhone">
          <el-input v-only-numbers v-model.trim="formData.agencyPhone" clearable placeholder="请输入电话" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="代理类型" prop="agencySource">
          <el-select v-model="formData.agencySource" clearable placeholder="请选择代理类型">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_FROM).filter(item => item.value !== 0)"
              :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="来源渠道" prop="sourceChannel">
          <el-input v-model.trim="formData.sourceChannel" clearable placeholder="请输入来源渠道" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合作状态" prop="agencyStatus">
          <el-select v-model="formData.agencyStatus" clearable placeholder="请选择合作状态">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_AGENCY_STATUS)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="推荐人" prop="agencyReferenceId">
          <el-select v-model="formData.agencyReferenceId" clearable filterable remote :loading="agencyOptionsLoading"
            :remote-method="fetchRemoteAgencyOptions" placeholder="请选择推荐人">
            <el-option v-for="dict in agencyOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="佣金规则" prop="ruleId">
          <el-select v-model="formData.ruleId" clearable placeholder="请选择佣金规则">
            <el-option v-for="dict in commissionRulesOption" :key="dict.value" :label="dict.label" :value="dict.value"
              :disabled="dict.disabled" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="formData.remark" type="textarea" clearable placeholder="请填写备注" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider class="!mt-2">对公</el-divider>
    <el-row>
      <el-col :span="8">
        <el-form-item label="收款人姓名" prop="corporatePayeeName">
          <el-input v-model="formData.agencyPayment.corporatePayeeName" clearable placeholder="请输入收款人姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款账户" prop="corporatePaymentAccountNumber">
          <el-input v-only-numbers v-model.trim="formData.agencyPayment.corporatePaymentAccountNumber" clearable
            placeholder="请输入收款账户" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="纳税人识别号" prop="corporatePaymentTin">
          <el-input v-only-numbers-and-upword v-model.trim="formData.agencyPayment.corporatePaymentTin" clearable
            placeholder="请输入纳税人识别号" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所属银行" prop="corporatePaymentBank">
          <el-select v-model="formData.agencyPayment.corporatePaymentBank" clearable placeholder="请选择所属银行">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_BANK_LIST)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户行" prop="corporatePaymentOpeningBank">
          <el-input v-model.trim="formData.agencyPayment.corporatePaymentOpeningBank" clearable placeholder="请输入开户行" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户行联行号" prop="corporatePaymentOpeningBankAccount">
          <el-input v-only-numbers v-model.trim="formData.agencyPayment.corporatePaymentOpeningBankAccount" clearable
            placeholder="请输入开户行联行号" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider class="!mt-2 flex items-center">对私</el-divider>
    <el-row>
      <el-col :span="8">
        <el-form-item label="收款人姓名" prop="privatePayeeName">
          <el-input v-model="formData.agencyPayment.privatePayeeName" clearable placeholder="请输入收款人姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款账户" prop="privatePaymentAccountNumber">
          <el-input v-only-numbers v-model.trim="formData.agencyPayment.privatePaymentAccountNumber" clearable
            placeholder="请输入收款账户" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报税编号" prop="declareTaxesNumber">
          <el-input v-only-numbers v-model.trim="formData.agencyPayment.declareTaxesNumber" clearable
            placeholder="请输入报税编号" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所属银行" prop="privatePaymentBank">
          <el-select v-model="formData.agencyPayment.privatePaymentBank" clearable placeholder="请选择所属银行">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_BANK_LIST)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户行" prop="privatePaymentOpeningBank">
          <el-input v-model.trim="formData.agencyPayment.privatePaymentOpeningBank" clearable placeholder="请输入开户行" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户行联行号" prop="privatePaymentOpeningBankAccount">
          <el-input v-only-numbers v-model.trim="formData.agencyPayment.privatePaymentOpeningBankAccount" clearable
            placeholder="请输入开户行联行号" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="身份证号" prop="agencyPayment.idCardNumber">
          <el-input v-model.trim="formData.agencyPayment.idCardNumber" clearable placeholder="请填写身份证号（支持匹配性别）"
            maxlength="18" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="10">
        <el-form-item label-width="0">
          <el-popover :visible="showIdentity" placement="right-start" :width="318" trigger="click">
            <template #reference>
              <el-badge :value="identityNumber">
                <el-button round type="primary" @click="showIdentity = true">
                  <Icon icon="ep:upload" class="mr-5px" />上传身份信息
                </el-button>
              </el-badge>
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="bankCardFront" label-width="0" class="mb-0!">
                  <form-create v-model="bankCardFront" :rule="bankCardFrontRule" :option="bankCardFrontOption" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="bankCardBack" label-width="0" class="mb-0!">
                  <form-create v-model="bankCardBack" :rule="bankCardBackRule" :option="bankCardBackOption" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="idCardFront" label-width="0" class="mb-2!">
                  <form-create v-model="idCardFront" :rule="idCardFrontRule" :option="idCardFrontOption" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="idCardBack" label-width="0" class="mb-2!">
                  <form-create v-model="idCardBack" :rule="idCardBackRule" :option="idCardBackOption" />
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="resetIdentity">重置</el-button>
              <el-button size="small" type="primary" @click="uploadIdentity">确定</el-button>
            </div>
          </el-popover>
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider class="!mt-2 !mb-7">Responsible</el-divider>
    <el-row>
      <el-col :span="8" v-for="(item, index) in formData.responsibleList" :key="item.siteId" class="relative">
        <div class="absolute top--10px left-128px bg-#fff p-inline-2.5">{{ item.siteName }}</div>
        <el-descriptions class="b b-1 b-solid b-#ccc mb-2 pt-6 pr-4 pl-1 pb-0"
          :class="{ 'b-r-none': index < formData.responsibleList.length - 1 }" :column="1">
          <el-descriptions-item>
            <div class="cursor-pointer" @click="toggleTriangle(item, index)">
              <div class="isDefault" :class="{ 'default-clicked': item.isDefault }"></div>
              <Icon :icon="item.isDefault ? 'fluent-emoji-flat:star' : 'fluent-emoji-high-contrast:star'"
                class="default-icon" />
              <el-popconfirm width="220" confirm-button-text="我知道了" cancel-button-text="不再显示" :icon="InfoFilled"
                icon-color="var(--el-color-primary)" :visible="showTip"
                v-if="(props.variProps.channelInForm === 2 || props.variProps.formType === 'updateChannel') && index === 2 && props.variProps.formType !== 'createPage' && props.variProps.formType !== 'updatePage'"
                placement="right-end" title="点击右上角的星星以选择主要站点及其负责人" @confirm="confirmPop" @cancel="cancelPop">
                <template #reference>
                  <Icon :icon="item.isDefault ? 'fluent-emoji-flat:star' : 'fluent-emoji-high-contrast:star'"
                    class="default-icon" />
                </template>
              </el-popconfirm>
            </div>
            <el-form-item label="推广负责人" prop="promotionResponsibleId">
              <el-select v-model="item.promotionResponsibleId" clearable filterable remote
                :loading="item.promotionOptionsLoading"
                :remote-method="query => fetchRemoteUserOptions(query, 'promotion', handleRemoteUserOptions, index)"
                placeholder="请选择推广负责人">
                <el-option v-for="dict in item.promotionOptions" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="销售负责人" prop="salesResponsibleId">
              <el-select v-model="item.salesResponsibleId" clearable filterable remote
                :loading="item.salesOptionsLoading"
                :remote-method="query => fetchRemoteUserOptions(query, 'sales', handleRemoteUserOptions, index)"
                placeholder="请选择销售负责人">
                <el-option v-for="dict in item.salesOptions" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, handleRemoteUserOptions, handleRemoteAgencyOptions, handleRemoteCustomerOptions, getAgencyCommissionRulesOptions } from '@/utils/dict'
import { ChannelAgencyApi, ChannelAgencyVO } from '@/api/crm/agency/agencymag'
import { InfoFilled } from '@element-plus/icons-vue'

/** 代理 表单 */
defineOptions({ name: 'AgencyForm' })

/* 传递数据 */
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

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 远程搜索 */
const respobsileItem = ref({
  siteId: undefined,
  siteName: '',
  promotionResponsibleId: '',
  salesResponsibleId: '',
  isDefault: 0,
  promotionOptions: [],
  promotionOptionsLoading: false,
  salesOptions: [],
  salesOptionsLoading: false,
})

/* 表单数据 */
const formData = ref({
  id: undefined,
  lineType: 102,
  siteId: 1,
  agencyType: undefined,
  agencyName: undefined,
  gender: undefined,
  countryCode: 43,
  agencyPhone: undefined,
  agencyAddress: undefined,
  agencySource: undefined,
  sourceChannel: undefined,
  agencyStudentId: undefined,
  agencyStatus: 1,
  agencyReferenceId: undefined,
  remark: undefined,
  agencyPayment: {
    // 对公
    corporatePayeeName: undefined,
    corporatePaymentAccountNumber: undefined,
    corporatePaymentTin: undefined,
    corporatePaymentBank: undefined,
    corporatePaymentOpeningBank: undefined,
    corporatePaymentOpeningBankAccount: undefined,
    // 对私
    privatePayeeName: undefined,
    privatePaymentAccountNumber: undefined,
    declareTaxesNumber: undefined,
    privatePaymentBank: undefined,
    privatePaymentOpeningBank: undefined,
    privatePaymentOpeningBankAccount: undefined,
    idCardNumber: undefined,
    bankCardFront: '',
    bankCardBack: '',
    idCardFront: '',
    idCardBack: '',
  },
  responsibleList: [],
  ruleId: undefined
})

/* 银行卡正面 */
const bankCardFront = ref()
const bankCardFrontRule = ref([
  {
    "type": "UploadImg",
    "field": "bankCardFront",
    "title": "银行卡正面",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
    },
    "hidden": false,
    "display": true
  }]
)
const bankCardFrontOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
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
/* 银行卡背面 */
const bankCardBack = ref()
const bankCardBackRule = ref([
  {
    "type": "UploadImg",
    "field": "bankCardBack",
    "title": "银行卡背面",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
    },
    "hidden": false,
    "display": true
  }]
)
const bankCardBackOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
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
/* 身份证正面 */
const idCardFront = ref()
const idCardFrontRule = ref([
  {
    "type": "UploadImg",
    "field": "idCardFront",
    "title": "身份证正面",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
    },
    "hidden": false,
    "display": true
  }]
)
const idCardFrontOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
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
/* 身份证背面 */
const idCardBack = ref()
const idCardBackRule = ref([
  {
    "type": "UploadImg",
    "field": "idCardBack",
    "title": "身份证背面",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
    },
    "hidden": false,
    "display": true
  }]
)
const idCardBackOption = ref({
  "form": {
    "labelPosition": "top",
    "size": "default",
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

/* 表单校验规则 */
const formRules = reactive({
  agencyType: [{ required: true, message: '合作模式不能为空', trigger: 'change' }],
  agencyName: [{ required: true, message: '名字不能为空', trigger: 'change' }],
  // gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
  countryCode: [{ required: true, message: '国家区号不能为空', trigger: 'change' }],
  agencyPhone: [
    { required: true, message: '电话不能为空', trigger: 'change' },
    {
      validator: async (rule, value, callback) => {
        if (value && props.variProps.formType === 'create') {
          try {
            await ChannelAgencyApi.channelAgencyCheckPhone(value)
          } catch (e) {
            callback(new Error('手机号已存在'))
          }
        }
      }, trigger: 'blur'
    }
  ],
  agencySource: [{ required: true, message: '代理类型不能为空', trigger: 'change' }],
  agencyStatus: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  ruleId: [{ required: true, message: '佣金规则不能为空', trigger: 'change' }],
  paymentType: [{ required: true, message: '收款类型不能为空', trigger: 'change' }],
})

// 固定顺序
const siteOrder = ref()

/* options */
const agencyOptions = ref()
const agencyOptionsLoading = ref(false)
const customerOptions = ref()
const customerOptionsLoading = ref(false)
const siteOption = ref()
const commissionRulesOption = ref()

/* 气泡框状态 */
const showTip = ref(true)
const showIdentity = ref(false)

/* '我知道了'操作 */
const confirmPop = () => {
  showTip.value = false
}
/* '不再显示'操作 */
const cancelPop = () => {
  showTip.value = false
  localStorage.setItem('hideTip', 'true')
}

/* 上传图片 */
const uploadIdentity = () => {
  if (bankCardFront.value) {
    formData.value.agencyPayment.bankCardFront = bankCardFront.value.bankCardFront
  }
  if (bankCardBack.value) {
    formData.value.agencyPayment.bankCardBack = bankCardBack.value.bankCardBack
  }
  if (idCardFront.value) {
    formData.value.agencyPayment.idCardFront = idCardFront.value.idCardFront
  }
  if (idCardBack.value) {
    formData.value.agencyPayment.idCardBack = idCardBack.value.idCardBack
  }
  showIdentity.value = false
}
const resetIdentity = () => {
  if (bankCardFront.value) {
    formData.value.agencyPayment.bankCardFront = bankCardFront.value.bankCardFront = ''
  }
  if (bankCardBack.value) {
    formData.value.agencyPayment.bankCardBack = bankCardBack.value.bankCardBack = ''
  }
  if (idCardFront.value) {
    formData.value.agencyPayment.idCardFront = idCardFront.value.idCardFront = ''
  }
  if (idCardBack.value) {
    formData.value.agencyPayment.idCardBack = idCardBack.value.idCardBack = ''
  }
}

/* 远程搜索 */
const fetchRemoteUserOptions = async (query, type, handlerFunction, index?) => {
  const setUserOptions = (newValue) => (formData.value.responsibleList[index][`${type}Options`] = newValue)
  const setUserLoading = (newValue) => (formData.value.responsibleList[index][`${type}OptionsLoading`] = newValue)
  await handlerFunction(query, setUserOptions, setUserLoading)
}
const fetchRemoteAgencyOptions = async (query) => {
  const setAgencyOptions = (newValue) => (agencyOptions.value = newValue)
  const setAgencyLoading = (newValue) => (agencyOptionsLoading.value = newValue)
  await handleRemoteAgencyOptions(query, setAgencyOptions, setAgencyLoading)
}
const fetchRemoteCustomerOptions = async (query) => {
  const setCustomerOptions = (newValue) => (customerOptions.value = newValue)
  const setCustomerLoading = (newValue) => (customerOptionsLoading.value = newValue)
  await handleRemoteCustomerOptions(query, setCustomerOptions, setCustomerLoading)
}

/* 主要 Responsible 变色 */
const toggleTriangle = (item, index) => {
  formData.value.responsibleList.forEach(respobsile => {
    respobsile.isDefault = 0
  })
  formData.value.responsibleList[index].isDefault = 1
}

/** 提交表单 */
const submitForm = async () => {
  showIdentity.value = false
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  if (bankCardFront.value) {
    formData.value.agencyPayment.bankCardFront = bankCardFront.value.bankCardFront
  }
  if (bankCardBack.value) {
    formData.value.agencyPayment.bankCardBack = bankCardBack.value.bankCardBack
  }
  if (idCardFront.value) {
    formData.value.agencyPayment.idCardFront = idCardFront.value.idCardFront
  }
  if (idCardBack.value) {
    formData.value.agencyPayment.idCardBack = idCardBack.value.idCardBack
  }
  try {
    const data = formData.value as unknown as ChannelAgencyVO
    const isDefaultItem = data.responsibleList.find(item => item.isDefault === 1)
    if (props.variProps.formType === 'createChannel') {
      // 创建时的创建操作
      if (!formData.value.id) {
        if (!isDefaultItem) {
          message.error('新增失败，请选择一个默认站点')
          return
        } else {
          try {
            formData.value.id = await ChannelAgencyApi.createChannelAgency(data)
            message.success(t('common.createSuccess'))
            props.funcProps.next()
          } catch (e) {
            message.error('新增失败')
          }
        }
      }
      // 创建时的上一步修改操作，而非编辑时的修改操作
      else {
        if (!isDefaultItem) {
          message.error('修改失败，请选择一个默认站点')
          return
        } else {
          try {
            await ChannelAgencyApi.updateChannelAgency(data)
            message.success(t('common.updateSuccess'))
            props.funcProps.next()
          } catch (e) {
            message.error('修改失败')
          }
        }
      }
      // 修改时的修改操作
    } else {
      try {
        await ChannelAgencyApi.updateChannelAgency(data)
        message.success(t('common.updateSuccess'))
        props.funcProps.close()
      } catch (e) {
        message.error('修改失败')
      }
    }
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  formLoading.value = true
  try {
    // 1. 初始化基础数据
    if (localStorage.getItem('hideTip')) showTip.value = false
    siteOption.value = getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)
    siteOrder.value = siteOption.value.map(item => item.value)

    // 2. 获取佣金规则（所有分支都需要）
    const unnfilterCommissionRulesOption = await getAgencyCommissionRulesOptions()

    if (props.variProps.formType === 'updateChannel') {
      // 修改模式特有逻辑
      commissionRulesOption.value = unnfilterCommissionRulesOption.map(item => ({
        ...item,
        disabled: [1, 4, 5].includes(item.value)
      }))

      if (props.variProps.fData.id) {
        const res = await ChannelAgencyApi.getChannelAgency(props.variProps.fData.id)

        // 3. 处理响应数据
        if (res.responsibleList.length !== 0) {
          formData.value = res
          // 等待所有远程数据加载完成
          await Promise.all([
            formData.value.agencyReferenceId && fetchRemoteAgencyOptions(formData.value.agencyReferenceId),
            formData.value.agencyStudentId && fetchRemoteCustomerOptions(formData.value.agencyStudentId)
          ])

          // 排序和处理站点数据
          formData.value.responsibleList = formData.value.responsibleList.sort((a, b) =>
            siteOrder.value.indexOf(a.siteId) - siteOrder.value.indexOf(b.siteId)
          )

          // 并行处理用户选项
          await Promise.all(siteOption.value.map(async (_, i) => {
            formData.value.responsibleList[i].siteName = siteOption.value[i].label
            const promises: Promise<any>[] = []
            if (formData.value.responsibleList[i].promotionResponsibleId) {
              promises.push(fetchRemoteUserOptions(
                formData.value.responsibleList[i].promotionResponsibleName,
                'promotion',
                handleRemoteUserOptions,
                i
              ))
            }
            if (formData.value.responsibleList[i].salesResponsibleId) {
              promises.push(fetchRemoteUserOptions(
                formData.value.responsibleList[i].salesResponsibleName,
                'sales',
                handleRemoteUserOptions,
                i
              ))
            }
            return Promise.all(promises)
          }))
        } else {
          // 处理空数据情况
          formData.value = {
            ...res,
            responsibleList: siteOption.value.map(item => ({
              ...JSON.parse(JSON.stringify(respobsileItem.value)),
              siteId: item.value,
              siteName: item.label
            }))
          }

          await Promise.all([
            formData.value.agencyReferenceId && fetchRemoteAgencyOptions(formData.value.agencyReferenceId),
            formData.value.agencyStudentId && fetchRemoteCustomerOptions(formData.value.agencyStudentId)
          ])
        }

        // 4. 处理支付信息
        if (!res.agencyPayment) {
          formData.value.agencyPayment = {
            // 对公
            corporatePayeeName: undefined,
            corporatePaymentAccountNumber: undefined,
            corporatePaymentTin: undefined,
            corporatePaymentBank: undefined,
            corporatePaymentOpeningBank: undefined,
            corporatePaymentOpeningBankAccount: undefined,
            // 对私
            privatePayeeName: undefined,
            privatePaymentAccountNumber: undefined,
            declareTaxesNumber: undefined,
            privatePaymentBank: undefined,
            privatePaymentOpeningBank: undefined,
            privatePaymentOpeningBankAccount: undefined,
            idCardNumber: undefined,
            bankCardFront: '',
            bankCardBack: '',
            idCardFront: '',
            idCardBack: '',
          }
        } else {
          bankCardFront.value = { bankCardFront: formData.value.agencyPayment.bankCardFront }
          bankCardBack.value = { bankCardBack: formData.value.agencyPayment.bankCardBack }
          idCardFront.value = { idCardFront: formData.value.agencyPayment.idCardFront }
          idCardBack.value = { idCardBack: formData.value.agencyPayment.idCardBack }
        }
      }
    } else {
      // 新增模式逻辑
      commissionRulesOption.value = unnfilterCommissionRulesOption
        .filter(item => item.value !== 4 && item.value !== 5)
        .map(item => ({
          ...item,
          disabled: item.value === 1
        }))

      formData.value.responsibleList = siteOption.value.map(item => ({
        ...JSON.parse(JSON.stringify(respobsileItem.value)),
        siteId: item.value,
        siteName: item.label
      }))
    }
  } catch (error) {
    message.error('初始化表单数据失败，请刷新重试')
  } finally {
    formLoading.value = false
  }
})

/* 暴露信息 */
defineExpose({ formData, submitForm })
</script>
<style scoped lang="scss">
:deep(.el-divider__text) {
  color: #606266;
  font-weight: 700;
}

:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.isDefault {
  width: 25px;
  height: 25px;
  background-color: #ccc;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0px 0px 0 25px;
}

.default-clicked {
  background-color: var(--el-color-primary);
}

.default-icon {
  position: absolute;
  top: 2px;
  right: 1px;
}

.gender {
  --el-border-radius-base: 16px;
}
</style>