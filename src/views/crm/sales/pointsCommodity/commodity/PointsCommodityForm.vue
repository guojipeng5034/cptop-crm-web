<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="870">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="请选择状态">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="适用站点" prop="siteId">
            <el-checkbox-group v-model="formData.siteId">
              <el-checkbox-button v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学员限制" prop="studentLimitStatus">
            <el-radio-group v-model="formData.studentLimitStatus">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.STUDENT_LIMIT_TYPE)" :key="dict.value"
                :value="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="活动" prop="activityIds" v-if="formData.studentLimitStatus === 5">
            <MultiSelect v-model="formData.activityIds" :type="'activity'"
              :api-fn="ActivityManageApi.getSimpleSelectPage" label-field="activityNameInternal" value-field="id"
              placeholder="请选择活动" search-placeholder="请输入活动名（联想输入）"
              :show-current-option="formType === 'update' || formType === 'updating' && formData.activityIds.length > 0"
              :current-fn="ActivityManageApi.getByList" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品描述信息" prop="describe">
            <!-- <el-input v-model="formData.describe" type="textarea" placeholder="请输入商品描述信息" /> -->
            <Editor :height="100" v-model="formData.describe" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-only-numbers v-model="formData.sort" placeholder="排序" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自动添加商品" prop="autoAddStatus">
            <el-select v-model="formData.autoAddStatus" placeholder="请选择自动添加商品" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_AUTO_ADD_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.autoAddStatus === 1">
        <el-col :span="12">
          <el-form-item label="类型" prop="autoAddCommodityType">
            <el-select v-model="formData.autoAddCommodityType" placeholder="请选择自动添加商品类型" clearable>
              <el-option v-for="dict in autoAddCommodityTypeOptions" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="formData.autoAddCommodityType === 2" label="课时点" prop="pointsCommodity">
            <el-input v-model="formData.pointsCommodity" placeholder="请输入课时点" />
          </el-form-item>
          <el-form-item v-show="formData.autoAddCommodityType === 3 && formData.siteId.length === 0">
            <span class="text-red text-4.5 font-bold">如选择次卡请先指定适用站点！</span>
          </el-form-item>
          <el-form-item v-show="formData.autoAddCommodityType === 3 && formData.siteId.includes(102)" label="次卡"
            prop="CN">
            <div class="w-24%">
              <el-input v-model="CNLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="formData.CN" multiple collapse-tags collapse-tags-tooltip placeholder="请选择站点 CN 的次卡">
                <el-option v-for="option in CNOptions" :key="option.code" :label="option.name" :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item v-show="formData.autoAddCommodityType === 3 && formData.siteId.includes(600)" label="次卡"
            prop="CPZH">
            <div class="w-24%">
              <el-input v-model="CPZHLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="formData.CPZH" multiple collapse-tags collapse-tags-tooltip
                placeholder="请选择站点 CPZH 的次卡">
                <el-option v-for="option in CPZHOptions" :key="option.code" :label="option.name" :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item v-show="formData.autoAddCommodityType === 3 && formData.siteId.includes(113)" label="次卡"
            prop="CNADT">
            <div class="w-24%">
              <el-input v-model="CNADTLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="formData.CNADT" multiple collapse-tags collapse-tags-tooltip
                placeholder="请选择站点 CNADT 的次卡">
                <el-option v-for="option in CNADTOptions" :key="option.code" :label="option.name"
                  :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item v-show="formData.autoAddCommodityType === 4" label="优惠券" prop="couponId">
            <MultiSelect v-model="formData.couponId" :type="'coupon'" :api-fn="CouponApi.getSimpleSelectPage"
              label-field="name" value-field="id" placeholder="请选择优惠券" search-placeholder="请输入优惠券（联想输入）"
              :show-current-option="(formType === 'update' || formType === 'updating') && formData.couponId.length > 0"
              :current-fn="CouponApi.getByList" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="分类" prop="groupValue">
            <el-checkbox-group v-model="formData.groupValue">
              <el-checkbox v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_COMMODITY_GROUP)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有限制" prop="existLimit">
            <el-radio-group v-model="formData.existLimit">
              <el-radio-button v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否需要发邮件" prop="sendEmail">
            <el-select v-model="formData.sendEmail" placeholder="请选择是否需要发邮件" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_SEND_EMAIL)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.existLimit === 1">
        <el-col :span="12">
          <el-form-item label="限制条件" prop="limitCondition">
            <el-select v-model="formData.limitCondition" placeholder="请选择限制条件" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_LIMIT_CONDITION)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制次数" prop="limitCount">
            <el-input-number v-only-numbers v-model="formData.limitCount" placeholder="请输入限制次数" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="商品有效时间" prop="commodityTime">
            <el-date-picker v-model="formData.commodityTime" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledBeforeDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库存" prop="inventory">
            <el-input-number v-only-numbers v-model="formData.inventory" placeholder="库存" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品类型" prop="commodityType">
            <el-select v-model="formData.commodityType" placeholder="请选择商品类型" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_COMMODITY_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="兑换方式" prop="purchaseMethod">
            <el-select v-model="formData.purchaseMethod" placeholder="请选择兑换方式" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POINTS_PURCHASE_METHOD)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="formData.purchaseMethod === 1 || formData.purchaseMethod === 3" label="积分"
            prop="points">
            <el-input v-model="formData.points" placeholder="请输入积分" v-only-decimal />
          </el-form-item>
          <el-form-item
            v-show="(formData.purchaseMethod === 2 || formData.purchaseMethod === 3) && formData.siteId.length === 0">
            <span class="text-red text-4.5 font-bold">如选择现金请先指定适用站点！</span>
          </el-form-item>
          <el-form-item
            v-if="(formData.purchaseMethod === 2 || formData.purchaseMethod === 3) && formData.siteId.includes(102)"
            label="现金" prop="siteAmount.CN">
            <div class="w-24%">
              <el-input v-model="CNLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-input v-model="formData.siteAmount.CN" placeholder="请输入现金" v-only-decimal />
            </div>
          </el-form-item>
          <el-form-item
            v-if="(formData.purchaseMethod === 2 || formData.purchaseMethod === 3) && formData.siteId.includes(600)"
            label="现金" prop="siteAmount.CPZH">
            <div class="w-24%">
              <el-input v-model="CPZHLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-input v-model="formData.siteAmount.CPZH" placeholder="请输入现金" v-only-decimal />
            </div>
          </el-form-item>
          <el-form-item
            v-if="(formData.purchaseMethod === 2 || formData.purchaseMethod === 3) && formData.siteId.includes(113)"
            label="现金" prop="siteAmount.CNADT">
            <div class="w-24%">
              <el-input v-model="CNADTLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-input v-model="formData.siteAmount.CNADT" placeholder="请输入现金" v-only-decimal />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动状态" prop="activityStatus">
            <el-select v-model="formData.activityStatus" placeholder="请选择活动状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-popover :visible="showIdentity" placement="right" :width="280" trigger="click">
            <template #reference>
              <el-button class="btn" @click="showIdentity = true">
                <span class="btm">上传商品活动图片</span>
              </el-button>
            </template>
            <el-row>
              <el-col :span="12" :offset="6">
                <el-form-item prop="indexFileSavePath" label-width="0" class="mb-0!">
                  <form-create v-model="indexFileSavePath" :rule="indexFileSavePathRule"
                    :option="indexFileSavePathOption" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="detailFileSavePath" label-width="0">
                  <form-create v-model="detailFileSavePath" :rule="detailFileSavePathRule"
                    :option="detailFileSavePathOption" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="activityImg" label-width="0">
                  <form-create v-model="activityImg" :rule="activityImgRule" :option="activityImgOption" />
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="resetIdentity">重置</el-button>
              <el-button size="small" type="primary" @click="uploadIdentity">确定</el-button>
            </div>
          </el-popover>
        </el-col>
        <el-col :span="16">
          <el-form-item label="活动有效时间" prop="activityTime" v-if="formData.activityStatus === 0">
            <el-date-picker v-model="formData.activityTime" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledBeforeDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="期间兑换积分" prop="activityPoints" v-if="formData.activityStatus === 0">
            <el-input-number v-only-numbers v-model="formData.activityPoints" placeholder="活动期间兑换积分" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { disabledBeforeDate } from '@/utils/formatTime'
import { SITE_MAPPING } from '@/utils/constants'
import { mapToJson, jsonToFields, parseIfString } from '@/utils/common'
import { PointsCommodityApi, PointsCommodityVO } from '@/api/crm/sales/pointsCommodity/commodity'
import { CouponApi } from '@/api/crm/sales/coupon/coupon'
import { ActivityManageApi } from '@/api/crm/activity/activityManage'
import { SubscriptionApi } from '@/api/crm/qqe/subscription'

/** 积分商品 表单 */
defineOptions({ name: 'PointsCommodityForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* 表单数据 */
const formData = ref({
  id: undefined, // 编号
  title: undefined, // 标题
  siteId: [], // 适用站点
  studentLimitStatus: undefined, // 学员限制
  activityIds: [], // 参与活动
  points: undefined, // 积分
  status: 0, // 状态
  autoAddStatus: 0, // 是否自动添加商品
  ticketCommodity: {}, // 次卡
  existLimit: 0, // 是否有限制
  sendEmail: undefined, // 是否发送邮件
  limitCondition: undefined, // 限制条件
  limitCount: undefined, // 限制次数
  purchaseMethod: undefined, // 兑换方式
  commodityTime: undefined, // 商品时间
  validTime: undefined, // 商品有效时间
  invalidTime: undefined, // 商品失效时间
  indexFileSavePath: undefined, // 主图地址
  detailFileSavePath: undefined, // 详情图地址
  activityStatus: undefined, // 活动状态
  activityPoints: undefined, // 活动期间兑换积分
  activityTime: undefined, // 活动时间
  activityStartTime: undefined, // 活动开始时间
  activityEndTime: undefined, // 活动结束时间
  activityImg: undefined, // 活动主图
  sort: 100, // 排序
  autoAddCommodityType: undefined, // 自动添加商品类型
  pointsCommodity: undefined, // 课时点
  groupValue: [], // 分类
  channelId: undefined, // 渠道ID
  amount: undefined, // 现金金额
  describe: undefined, // 商品描述信息
  couponId: [], // 优惠券
  commodityType: 1, // 商品类型
  inventory: undefined, // 库存
  CN: [], // CN次卡
  CPZH: [], // CPZH次卡
  CNADT: [], // CNADT次卡
  siteAmount: {
    CPZH: undefined,
    CN: undefined,
    CNADT: undefined
  }
})

const CNLabel = ref('CN')
const CPZHLabel = ref('CPZH')
const CNADTLabel = ref('CNADT')

const CNOptions = ref([])
const CPZHOptions = ref([])
const CNADTOptions = ref([])

/* 表单校验规则 */
const formRules = reactive({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  siteId: [{ required: true, message: '适用站点不能为空', trigger: 'change' }],
  studentLimitStatus: [{ required: true, message: '学员限制不能为空', trigger: 'change' }],
  activityIds: [{}],
  points: [{}],
  describe: [{ required: true, message: '商品描述信息不能为空', trigger: 'blur' }],
  autoAddCommodityType: [{ required: true, message: '自动添加商品类型不能为空', trigger: 'change' }],
  commodityTime: [{ required: true, message: '商品有效时间不能为空', trigger: 'change' }],
  purchaseMethod: [{ required: true, message: '兑换方式不能为空', trigger: 'change' }],
  commodityType: [{ required: true, message: '商品类型不能为空', trigger: 'change' }],
  'siteAmount.CN': [{}],
  'siteAmount.CPZH': [{}],
  'siteAmount.CNADT': [{}],
  inventory: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
})

watch(() => formData.value.studentLimitStatus, (val) => {
  formRules.activityIds = val === 5 ? [{ required: true, message: '活动不能为空', trigger: 'change' }] : []
})

watch([() => formData.value.purchaseMethod, () => formData.value.siteId], ([newValue, newSiteId]) => {
  formRules.points = newValue === 1 || newValue === 3 ? [{ required: true, message: '积分不能为空', trigger: 'blur' }] : []
  if ((newValue === 2 || newValue === 3)) {
    // 取消siteId的某个站点后，重置对应的站点的金额和校验规则 , 选中则设置现金金额校验规则
    if (!newSiteId.includes(102)) {
      formRules['siteAmount.CN'] = []
      formRef.value?.clearValidate('siteAmount.CN')
      formData.value.siteAmount.CN = undefined
    } else {
      formRules['siteAmount.CN'] = [{ required: true, message: 'CN现金不能为空', trigger: 'blur' }]
    }

    if (!newSiteId.includes(600)) {
      formRules['siteAmount.CPZH'] = []
      formRef.value?.clearValidate('siteAmount.CPZH')
      formData.value.siteAmount.CPZH = undefined
    } else {
      formRules['siteAmount.CPZH'] = [{ required: true, message: 'CPZH现金不能为空', trigger: 'blur' }]
    }

    if (!newSiteId.includes(113)) {
      formRules['siteAmount.CNADT'] = []
      formRef.value?.clearValidate('siteAmount.CNADT')
      formData.value.siteAmount.CNADT = undefined
    } else {
      formRules['siteAmount.CNADT'] = [{ required: true, message: 'CNADT现金不能为空', trigger: 'blur' }]
    }
  }

  // 取消siteId的某个站点后，重置对应的站点的金额和校验规则 
  // if(!formData.value.siteId.includes(102)) {
  //   formRef.value?.clearValidate('siteAmount.CN')
  //   formData.siteAmount.CN = undefined
  // } 

  // if(!formData.value.siteId.includes(600)) {
  //   formRef.value?.clearValidate('siteAmount.CPZH')
  //   formData.siteAmount.CPZH = undefined
  // }

  // if(!formData.value.siteId.includes(113)) {
  //   formRef.value?.clearValidate('siteAmount.CNADT')
  //   formData.siteAmount.CNADT = undefined
  // }
})

watch([
  () => formData.value.autoAddStatus,
  () => formData.value.autoAddCommodityType,
  () => formData.value.siteId
],
  async ([newAutoAddStatus, newAutoAddCommodityType, newSiteId]) => {
    if (newAutoAddStatus === 1) {
      formRules.autoAddCommodityType = [{ required: true, message: '自动添加商品类型不能为空', trigger: 'change' }]
    } else {
      formRules.autoAddCommodityType = []
      formData.value.autoAddCommodityType = undefined
      formData.value.pointsCommodity = undefined
      formData.value.couponId = []
      formData.value.CN = []
      formData.value.CPZH = []
      formData.value.CNADT = []
    }
    if (!newAutoAddCommodityType && newSiteId.length === 0) return
    if (newAutoAddCommodityType !== 2) formData.value.pointsCommodity = undefined
    if (formData.value.autoAddCommodityType !== 4) formData.value.couponId = []
    formRules.pointsCommodity = newAutoAddCommodityType === 2 ? [{ required: true, message: '课时点不能为空', trigger: 'blur' }] : []
    formRules.couponId = newAutoAddCommodityType === 4 ? [{ required: true, message: '优惠券不能为空', trigger: 'change' }] : []
    if (newAutoAddCommodityType === 3) {
      formRules.CN = newSiteId.includes(102) ? [{ required: true, message: 'CN次卡不能为空', trigger: 'change' }] : []
      formRules.CPZH = newSiteId.includes(600) ? [{ required: true, message: 'CPZH次卡不能为空', trigger: 'change' }] : []
      formRules.CNADT = newSiteId.includes(113) ? [{ required: true, message: 'CNADT次卡不能为空', trigger: 'change' }] : []
      if (newSiteId.includes(102)) {
        try {
          CNOptions.value = await SubscriptionApi.getSimpleTicketList(102)
        } catch (e) {
          message.error('获取 CN 站点次卡失败')
          CNOptions.value = []
        }
      }
      if (newSiteId.includes(600)) {
        try {
          CPZHOptions.value = await SubscriptionApi.getSimpleTicketList(600)
        } catch (e) {
          message.error('获取 CPZH 站点次卡失败')
          CPZHOptions.value = []
        }
      }
      if (newSiteId.includes(113)) {
        try {
          CNADTOptions.value = await SubscriptionApi.getSimpleTicketList(113)
        } catch (e) {
          message.error('获取 CNADT 站点次卡失败')
          CNADTOptions.value = []
        }
      }
    } else {
      formRules.CN = []
      formRules.CPZH = []
      formRules.CNADT = []
    }
    if (!newSiteId.includes(102) && !newSiteId.includes(600) && !newSiteId.includes(113)) {
      formData.value.CN = []
      formData.value.CPZH = []
      formData.value.CNADT = []
      formRules.CN = []
      formRules.CPZH = []
      formRules.CNADT = []
    }
  })

/* 是否有限制和限制条件、 限制次数绑定 */
watch(() => formData.value.existLimit, (newValue) => {
  if (formType.value !== 'update') {
    formRules.limitCondition = newValue === 1 ? [{ required: true, message: '限制条件不能为空', trigger: 'change' }] : []
    formRules.limitCount = newValue === 1 ? [{ required: true, message: '限制次数不能为空', trigger: 'change' }] : []
    formData.value.limitCondition = undefined
    formData.value.limitCount = undefined
  }
})

/* 活动状态和活动有效时间 、活动期间兑换积分绑定 */
watch([
  () => formData.value.activityStatus,
  () => formData.value.activityTime
], ([newActivityStatus, newActivityTime]) => {
  formRules.activityTime = newActivityStatus === 0 ? [{ required: true, message: '活动时间不能为空', trigger: 'change' }] : []
  formRules.activityPoints = newActivityStatus === 0 && newActivityTime ? [{ required: true, message: '活动期间兑换积分不能为空', trigger: 'change' }] : []
  if (newActivityStatus === 1) {
    formData.value.activityTime = undefined
    formData.value.activityPoints = undefined
  }
})

const formRef = ref() // 表单 Ref

/* 主图 */
const indexFileSavePath = ref()
const indexFileSavePathRule = ref([
  {
    "type": "UploadImg",
    "field": "indexFileSavePath",
    "title": "主图",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "120px",
      "height": "120px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'pointsCommodity/'
    },
    "hidden": false,
    "display": true
  }]
)
const indexFileSavePathOption = ref({
  "form": {
    "inline": true,
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
/* 详情图 */
const detailFileSavePath = ref()
const detailFileSavePathRule = ref([
  {
    "type": "UploadImg",
    "field": "detailFileSavePath",
    "title": "详情图",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "120px",
      "height": "120px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'pointsCommodity/'
    },
    "hidden": false,
    "display": true
  }]
)
const detailFileSavePathOption = ref({
  "form": {
    "inline": true,
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
/* 活动图 */
const activityImg = ref()
const activityImgRule = ref([
  {
    "type": "UploadImg",
    "field": "activityImg",
    "title": "活动图",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "120px",
      "height": "120px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'pointsCommodity/'
    },
    "hidden": false,
    "display": true
  }]
)
const activityImgOption = ref({
  "form": {
    "inline": true,
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

/* 上传图片 */
const showIdentity = ref(false)
const uploadIdentity = () => {
  if (indexFileSavePath.value) formData.value.indexFileSavePath = indexFileSavePath.value.indexFileSavePath
  if (detailFileSavePath.value) formData.value.detailFileSavePath = detailFileSavePath.value.detailFileSavePath
  if (activityImg.value) formData.value.activityImg = activityImg.value.activityImg
  showIdentity.value = false
}
const resetIdentity = () => {
  if (indexFileSavePath.value) formData.value.indexFileSavePath = indexFileSavePath.value.indexFileSavePath = ''
  if (detailFileSavePath.value) formData.value.detailFileSavePath = detailFileSavePath.value.detailFileSavePath = ''
  if (activityImg.value) formData.value.activityImg = activityImg.value.activityImg = ''
}

/* 自动添加商品类型 */
const autoAddCommodityTypeOptions = getIntDictOptions(DICT_TYPE.REWARD_TYPE).filter(item => item.value !== 1 && item.value !== 5)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  showIdentity.value = false
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PointsCommodityApi.getPointsCommodity(id)
      // 当前模式
      if (formData.value.validTime && formData.value.invalidTime) {
        formData.value.commodityTime = [
          new Date(formData.value.validTime),
          new Date(formData.value.invalidTime)
        ]
      }
      if (formData.value.activityStartTime && formData.value.activityEndTime) {
        formData.value.activityTime = [
          new Date(formData.value.activityStartTime),
          new Date(formData.value.activityEndTime)
        ]
      }
      // 次卡json 映射为数组
      formData.value = {
        ...formData.value,
        ...jsonToFields(formData.value.ticketCommodity, SITE_MAPPING)
      }
      if (formData.value.indexFileSavePath) indexFileSavePath.value = { indexFileSavePath: formData.value.indexFileSavePath }
      if (formData.value.detailFileSavePath) detailFileSavePath.value = { detailFileSavePath: formData.value.detailFileSavePath }
      if (formData.value.activityImg) activityImg.value = { activityImg: formData.value.activityImg }
      // 编辑时, 如 siteAmount 字段为空，需要初始化数据结构
      if (!formData.value.siteAmount) {
        formData.value.siteAmount = { CPZH: undefined, CN: undefined, CNADT: undefined }
      }
    } finally {
      formLoading.value = false
      setTimeout(() => {
        formType.value = 'updating'
      }, 1)
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const close = () => {
  resetIdentity()
  showIdentity.value = false
  dialogVisible.value = false
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (formData.value.commodityTime) {
    formData.value.validTime = formData.value.commodityTime[0].getTime()
    formData.value.invalidTime = formData.value.commodityTime[1].getTime()
  }
  if (formData.value.activityTime) {
    formData.value.activityStartTime = formData.value.activityTime[0].getTime()
    formData.value.activityEndTime = formData.value.activityTime[1].getTime()
  }
  // 校验表单
  await formRef.value.validate()
  if (!formData.value.indexFileSavePath) {
    message.error('请补全主图')
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    // 站点次卡 转 json
    const filteredSourceData = Object.fromEntries(
      Object.entries({
        CN: parseIfString(formData.value.CN),
        CPZH: parseIfString(formData.value.CPZH),
        CNADT: parseIfString(formData.value.CNADT),
      }).filter(([_, value]) => Array.isArray(value) && value.length > 0)
    )
    formData.value.ticketCommodity = mapToJson(SITE_MAPPING, filteredSourceData)
    const data = formData.value as unknown as PointsCommodityVO
    if (formType.value === 'create') {
      await PointsCommodityApi.createPointsCommodity(data)
      message.success(t('common.createSuccess'))
    } else {
      await PointsCommodityApi.updatePointsCommodity(data)
      message.success(t('common.updateSuccess'))
    }
    close()
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    title: undefined,
    studentLimitStatus: undefined,
    activityIds: [],
    points: undefined,
    status: 0,
    autoAddStatus: 0,
    ticketCommodity: {},
    siteId: [],
    existLimit: 0,
    sendEmail: undefined,
    limitCondition: undefined,
    limitCount: undefined,
    purchaseMethod: undefined,
    commodityTime: undefined,
    validTime: undefined,
    invalidTime: undefined,
    indexFileSavePath: undefined,
    detailFileSavePath: undefined,
    activityStatus: undefined,
    activityPoints: undefined,
    activityTime: undefined,
    activityStartTime: undefined,
    activityEndTime: undefined,
    activityImg: undefined,
    sort: 100,
    autoAddCommodityType: undefined,
    pointsCommodity: undefined,
    groupValue: [],
    channelId: undefined,
    amount: undefined,
    describe: undefined,
    couponId: [],
    commodityType: 1,
    inventory: undefined,
    CN: [], // CN次卡
    CPZH: [], // CPZH次卡
    CNADT: [], // CNADT次卡
    siteAmount: {
      CPZH: undefined,
      CN: undefined,
      CNADT: undefined
    }
  }
  indexFileSavePath.value = { indexFileSavePath: '' }
  detailFileSavePath.value = { detailFileSavePath: '' }
  activityImg.value = { activityImg: '' }
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

:deep(.el-input-group__append) {
  padding-inline: 8px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-date-editor),
:deep(.el-date-editor--datetime) {
  width: 100%;
}

$size: 7.5em;
$btn: #59c3e1;
$btnShadow: adjust-hue(desaturate(darken($btn, 4%), 20%), 10);
$shadow: adjust-hue(desaturate(lighten($btn, 15%), 60%), 330);
$textColor: #fafafa;

.btn {
  width: $size * 2;
  height: $size * .35;
  background: $btn;
  color: $textColor;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border-radius: $size * .05;
  font-size: calc($size / 10);
  font-weight: 700;
  box-shadow:
    0 ($size * .075) 0 $btnShadow,
    0 ($size * .125) 0 ($size * .035) $shadow;
  text-align: center;
  padding: ($size * .05) ($size * .65);
  transition: all .1s;

  &:focus {
    transition: all .25s;
    background: $textColor;
    color: $btn;
    box-shadow:
      0 ($size * .075) 0 darken($textColor, 22%),
      0 ($size * .125) 0 ($size * .035) $shadow;
  }

  &:active {
    box-shadow: 0 0 0 ($size * .035) $shadow;
    transform: translate(0, ($size * .125));
    transition: all .1s;
  }

  .btm {
    font-size: ($size * .18);
  }

}
</style>