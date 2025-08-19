<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="830">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="115" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="套餐名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入套餐名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-only-numbers-with-minus v-model="formData.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保值标识" prop="hedgingTag">
            <el-select v-model="formData.hedgingTag" placeholder="请选择套餐类型" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PACKAGES_HEDGING_TAG)" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐类型" prop="packagesType">
            <el-select v-model="formData.packagesType" placeholder="请选择套餐类型" clearable>
              <el-option v-for="dict in packageTypeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否签约" prop="isSign">
            <el-radio-group v-model="formData.isSign" :disabled="isSignDisabled">
              <el-radio-button v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.packagesType !== 5">
          <el-form-item label="课时点数" prop="points">
            <el-input v-only-numbers v-model="formData.points" placeholder="请输入课时点数" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.isSign === true">
          <el-form-item label="每月扣费次数" prop="monthDeductTimes">
            <el-input-number v-only-numbers v-model="formData.monthDeductTimes" controls placeholder="请输入每月扣费次数（1-3次）"
              :min="1" :max="3" class="w-100%!" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-else-if="formData.isSign === false">
          <el-form-item label="有效月数" prop="expireMonth">
            <el-input v-only-numbers v-model="formData.expireMonth" placeholder="请输入有效月数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐状态" prop="packagesStatus">
            <el-select v-model="formData.packagesStatus" placeholder="请选择套餐状态">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效日期" prop="fixedTime">
            <el-date-picker v-model="formData.fixedTime" type="daterange" value-format="x" start-placeholder="生效日期"
              end-placeholder="失效日期" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="explain">
            <el-input type="textarea" v-model="formData.explain" placeholder="请输入描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <div v-for="merchant in merchantOption" :key="merchant.siteId" class="relative">
        <div class="absolute top--8px left-18px bg-#fff p-inline-2.5 font-700">
          {{ merchant.siteName }}
        </div>
        <el-descriptions class="b b-1 b-solid b-#ccc mb-4 p-4 pb-0" :column="1">
          <el-descriptions-item>
            <el-row>
              <el-col :span="16">
                <el-form-item v-if="formData.packagesType !== 4" label="QQE套餐/次卡" prop="qqePackageUid" class="!mb-0">
                  <el-select v-if="formData.packagesType !== 5" v-model="merchant.qqePackageUid"
                    placeholder="请选择QQE套餐UID" clearable>
                    <el-option v-for="dict in merchant.qqePackageOptions" :key="dict.uid" :label="dict.label"
                      :value="dict.uid" />
                  </el-select>
                  <el-select v-else v-model="merchant.qqePackageUid" placeholder="请选择QQE次卡" clearable>
                    <el-option v-for="dict in merchant.qqeTicketOptions" :key="dict.code" :label="dict.label"
                      :value="dict.code" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-collapse :name="merchant.siteId" class="pl-3 b-none!">
              <el-collapse-item title="默认支付方式">
                <template #icon="{ isActive }">
                  <Icon
                    :icon="isActive ? 'material-symbols:keyboard-double-arrow-down-rounded' : 'material-symbols:keyboard-double-arrow-right-rounded'"
                    :size="18" />
                </template>
                <el-form-item v-for="pay in merchant.payType" :key="pay.payTypeId" :label="pay.payTypename"
                  class="!mb-0" label-width="110">
                  <template #label>
                    <div class="flex items-center">
                      <span class="mr-2 float-left">{{ pay.payTypename }}</span>
                      <Icon class="float-right" :icon="pay.payTypeIcon" :size="18" :color="pay.payTypeIconColor" />
                    </div>
                  </template>
                  <el-checkbox-group class="ml-4" v-model="pay.selectId">
                    <el-checkbox v-for="mc in pay.merchant" :key="mc.id" :value="mc.id">
                      {{ mc.merchantName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="定制支付方式">
                <template #icon="{ isActive }">
                  <Icon
                    :icon="isActive ? 'material-symbols:keyboard-double-arrow-down-rounded' : 'material-symbols:keyboard-double-arrow-right-rounded'"
                    :size="18" />
                </template>
                <el-collapse class="pl-4">
                  <template v-for="(customPayValue, customPayKey) in merchant.cutomPay" :key="customPayKey">
                    <el-collapse-item>
                      <template #title>
                        <div class="!w-95% flex justify-between items-center">
                          <el-tag>方案{{ Number(customPayKey) + 1 }}</el-tag>
                          <el-button type="danger" plain size="small"
                            @click="(event) => handleDeleteCustomPay(merchant, customPayKey, event)">删除</el-button>
                        </div>
                      </template>
                      <div class="custom-pay-container border-solid b-#ccc b-1px px-2 py-2 mb-1">
                        <el-form-item label="适用订单类型" prop="customOrderType"
                          :validate-status="customOrderTypeErrors[merchant.siteId] && customOrderTypeErrors[merchant.siteId][customPayKey] ? 'error' : ''">
                          <el-select v-model="customPayValue.customOrderType" placeholder="请选择适用订单类型" multiple
                            filterable clearable @change="() => handleOrderTypeChange(merchant, customPayKey)">
                            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.CRM_ORDER_BILLING_TYPE)"
                              :key="dict.value" :label="dict.label" :value="dict.value"
                              :disabled="checkDuplicateOrderTypes(merchant, Number(customPayKey)).includes(dict.value)" />
                          </el-select>
                          <div
                            v-if="customOrderTypeErrors[merchant.siteId] && customOrderTypeErrors[merchant.siteId][customPayKey]"
                            class="el-form-item__error">{{ customOrderTypeErrors[merchant.siteId][customPayKey] }}</div>
                        </el-form-item>
                        <el-form-item v-for="customPay in customPayValue.customPayType" :key="customPay.payTypeId"
                          :label="customPay.payTypename" class="!mb-0" label-width="110">
                          <template #label>
                            <div class="flex items-center">
                              <span class="mr-2">{{ customPay.payTypename }}</span>
                              <Icon :icon="customPay.payTypeIcon" :size="18" :color="customPay.payTypeIconColor" />
                            </div>
                          </template>
                          <el-checkbox-group v-model="customPay.selectId">
                            <el-checkbox v-for="mc in customPay.merchant" :key="mc.id" :value="mc.id"
                              :label="mc.merchantName" />
                          </el-checkbox-group>
                        </el-form-item>
                      </div>
                    </el-collapse-item>
                  </template>
                </el-collapse>

                <el-button type="primary" plain class="mt-2 w-100%"
                  @click="handleAddCustomPay(merchant)">增加定制方案</el-button>
              </el-collapse-item>
            </el-collapse>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getBoolDictOptions, DICT_TYPE, getMerchantOptions } from '@/utils/dict'
import { PackageApi, PackageVO } from '@/api/crm/package/package'
import { SubscriptionApi } from '@/api/crm/qqe/subscription'

/** 套餐 表单 */
defineOptions({ name: 'PackageForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* type */
interface PayTypeInfo {
  payTypeId: string | number
  payTypeIcon: string
  payTypeIconColor: string
  selectId: (string | number)[] | null
}

/* 表单数据 */
const formData = ref({
  id: undefined,
  name: undefined,
  price: undefined,
  hedgingTag: 0, // 默认非保值
  packagesSimpleType: 1,
  packagesType: undefined,
  points: undefined,
  expireMonth: undefined, // 有效月数
  packagesStatus: 1,
  fixedTime: [],
  effectiveTime: undefined,
  noneffctiveTime: undefined,
  monthDeductTimes: undefined, // 每月扣费次数
  explain: undefined,
  isSign: false,
  packagesBaseSetList: []
})

/* 表单校验规则 */
const formRules = reactive({
  name: [{ required: true, message: '套餐名称不能为空', trigger: 'change' }],
  price: [{ required: true, message: '价格不能为空', trigger: 'change' }],
  hedgingTag: [{ required: true, message: '保值标识不能为空', trigger: 'change' }],
  packagesSimpleType: [{ required: true, message: '套餐大类不能为空', trigger: 'change' }],
  packagesType: [{ required: true, message: '套餐类型不能为空', trigger: 'change' }],
  points: [{ required: true, message: '课时点数不能为空', trigger: 'change' }],
  expireMonth: [{ required: true, message: '有效月数不能为空', trigger: 'change' }],
  monthDeductTimes: [{ required: true, message: '每月扣费次数不能为空', trigger: 'change' }],
  packagesStatus: [{ required: true, message: '套餐状态不能为空', trigger: 'change' }],
  fixedTime: [{ required: true, message: '有效日期不能为空', trigger: 'change' }]
})

/* 是否签约禁用 */
const isSignDisabled = ref(false)

/* 商户映射对象 */
const payTypeMap = {
  1: { icon: 'ri:alipay-fill', color: '#226bf3' },
  9: { icon: 'mingcute:wechat-pay-fill', color: '#22ac38' },
  22: { icon: 'material-symbols:cloud', color: '#ff5d41' },
  23: { icon: 'solar:square-arrow-right-up-bold', color: '#4f638e' },
  24: { icon: 'mingcute:bank-fill', color: '#999' },
  25: { icon: 'bi:stripe', color: '#635bff' },
  26: { icon: 'lineicons:tiktok-alt', color: '#000' }
}

/* 套餐类型 */
const packageTypeOption = getIntDictOptions(DICT_TYPE.PACKAGES_TYPE).filter(
  (item) => item.value !== 99
)

/* 获得商户信息 */
const merchantOption = ref()

/** 定制支付方式 */
let initialPayType = reactive([]) // 模板支付方式，用于定制支付方式时向customPayType插入
const CUSTOME_PAY_COUNT_MAX = 5 // 最大定制支付方式数量
const customOrderType = ref([]) // 定制支付方式适用订单类型

/* 定义定制支付方式的错误信息 */
const customOrderTypeErrors = reactive({})

/* 增加定制支付方式 */
const handleAddCustomPay = (merchantItem) => {
  try {
    const customPayTypeCount = Object.keys(merchantItem.cutomPay || {}).length

    if (customPayTypeCount >= CUSTOME_PAY_COUNT_MAX) {
      message.warning(`最多支持添加${CUSTOME_PAY_COUNT_MAX}个定制支付方式`)
      return
    }

    // 1. 确保使用正确的初始支付方式模板
    const newCustomPayType = merchantItem.payType.map(pay => ({
      ...pay,
      payTypeIcon: payTypeMap[pay.payTypeId]?.icon,
      payTypeIconColor: payTypeMap[pay.payTypeId]?.color,
      selectId: [] // 新增时默认清空选择
    }))

    // 2. 初始化新的定制支付方式
    merchantItem.cutomPay = merchantItem.cutomPay || {}
    merchantItem.cutomPay[customPayTypeCount] = {
      customPayType: newCustomPayType,
      customOrderType: []
    }

    // 3. 如果是修改场景，同步更新 customConfigs
    if (formType.value === 'update') {
      merchantItem.customConfigs = merchantItem.customConfigs || []
      merchantItem.customConfigs.push({
        ...merchantItem,
        useOrderBillingType: [],
        payType: newCustomPayType
      })
    }
  } catch (error) {
    console.error('Error in handleAddCustomPay:', error)
    message.error('添加定制支付方案失败')
  }
}

/* 检查是否重复适用订单类型 */
const checkDuplicateOrderTypes = (merchantItem, currentIndex) => {
  if (!merchantItem || !merchantItem.cutomPay) {
    return []
  }

  const customePay = merchantItem.cutomPay
  const allSelectedTypes = []

  // 收集所有已选择的订单类型（排除当前方案）
  for (const key in customePay) {
    if (Number(key) !== currentIndex) {
      const existingTypes = customePay[key].customOrderType || []
      allSelectedTypes.push(...existingTypes)
    }
  }

  // 返回重复的类型
  return allSelectedTypes
}

/* 验证订单类型是否有重复 */
const validateOrderTypes = (merchantItem) => {
  const allOrderTypes = new Set()
  let hasDuplicate = false

  if (merchantItem && merchantItem.cutomPay) {
    for (const key in merchantItem.cutomPay) {
      const customOrderTypes = merchantItem.cutomPay[key].customOrderType || []
      for (const orderType of customOrderTypes) {
        if (allOrderTypes.has(orderType)) {
          hasDuplicate = true
          message.error('同一站点下的不同定制支付方案中不能选相同的适用订单类型')
          break
        }
        allOrderTypes.add(orderType)
      }
      if (hasDuplicate) break
    }
  }
  return !hasDuplicate
}

/* 处理订单类型选择变更 */
const handleOrderTypeChange = (merchantItem, customPayKey) => {
  const siteId = merchantItem.siteId; // 获取当前 siteId
  // 清除对应的错误信息
  if (customOrderTypeErrors[siteId]) {
    delete customOrderTypeErrors[siteId][customPayKey];
  }
  if (!validateOrderTypes(merchantItem)) {
    // 如果验证失败，清空当前选择
    merchantItem.cutomPay[customPayKey].customOrderType = []
  }
}

/**
 * 删除定制支付方案
 * @param merchantItem 站点信息
 * @param customPayIndex 要删除的定制方案索引
 */
const handleDeleteCustomPay = async (merchantItem, customPayIndex, event) => {
  // 阻止事件冒泡，避免触发折叠面板
  event?.stopPropagation()

  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要删除该定制支付方案吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 用户确认后执行删除操作
    // 1. 删除当前定制方案
    delete merchantItem.cutomPay[customPayIndex]

    // 2. 重新整理剩余的定制方案索引
    const newCustomPay = {}
    let newIndex = 0
    Object.values(merchantItem.cutomPay).forEach(payConfig => {
      if (payConfig) {
        newCustomPay[newIndex] = payConfig
        newIndex++
      }
    })
    merchantItem.cutomPay = newCustomPay

    // 3. 处理 customConfigs
    if (formType.value === 'update' || formType.value === 'updating') {
      // 修改场景：需要同步更新 customConfigs
      merchantItem.customConfigs.splice(customPayIndex, 1)

      // 如果没有定制方案了，清空 customConfigs
      if (Object.keys(merchantItem.cutomPay).length === 0) {
        merchantItem.customConfigs = []
      }
    }

    // https://zentao.52cebu.com/zentao/bug-view-1783.html
    // 4. 清除错误信息(无需清除)
    // delete customOrderTypeErrors[siteId][customPayIndex]

    // 5. 提示用户
    message.success('删除定制支付方案成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error in handleDeleteCustomPay:', error)
      message.error('删除定制支付方案失败')
    }
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  try {
    // 初始化弹窗状态
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    resetForm()
    resetErrors()

    formLoading.value = true

    // 获取商户选项
    const options = await getMerchantOptions(id)
    if (!options?.length) {
      throw new Error('Failed to get merchant options')
    }

    // 按siteId分组，处理重复站点和定制配置
    const siteMap = new Map()
    options.forEach(option => {
      if (!siteMap.has(option.siteId)) {
        // 首次遇到该站点，初始化基础数据
        siteMap.set(option.siteId, {
          ...option,
          customConfigs: []
        })
      }

      const existingSite = siteMap.get(option.siteId)
      if (option.useOrderBillingType?.length) {
        // 如果当前配置包含定制方案，添加到对应站点的customConfigs中
        existingSite.customConfigs.push(option)
      } else if (!existingSite.qqePackageUid && option.qqePackageUid) {
        // 更新基础配置（如果新的配置包含更多信息）
        Object.assign(existingSite, {
          qqePackageUid: option.qqePackageUid,
          payType: option.payType
        })
      }
    })

    // 转换为数组并处理数据
    merchantOption.value = Array.from(siteMap.values()).map(site => ({
      ...site,
      cutomPay: {}, // 初始化定制支付方式对象
      payType: site.payType?.map(pay => ({
        ...pay,
        // 添加支付方式图标和颜色
        payTypeIcon: payTypeMap[pay.payTypeId]?.icon,
        payTypeIconColor: payTypeMap[pay.payTypeId]?.color,
        // 根据merchant数组中的selected字段设置默认支付方式的selectId
        // selectId: pay.merchant?.find(m => m.selected)?.id ? [pay.merchant.find(m => m.selected).id] : []
        selectId: pay.merchant?.map(m => {if(m.selected) return m.id}) ? pay.merchant?.map(m => {if(m.selected) return m.id}) : [],
      }))|| []
    }))

    if (id) {
      // 修改时的数据处理
      const packageData = await PackageApi.getPackages(id)
      if (packageData) {
        // 设置表单数据
        formData.value = packageData
        formData.value.fixedTime = [formData.value.effectiveTime, formData.value.noneffctiveTime]

        // 处理回显数据
        merchantOption.value.forEach(merchant => {
          // 只处理有定制配置的站点
          if (merchant.customConfigs?.length) {
            // 处理定制支付方式：根据customConfigs数组创建定制支付方案
            merchant.customConfigs.forEach((config, index) => {
              merchant.cutomPay[index] = {
                customPayType: merchant.payType.map(pay => {
                  // 从定制配置中找到对应的支付方式配置
                  const customPayConfig = config.payType?.find(p => p.payTypeId === pay.payTypeId)
                  return {
                    ...pay,
                    // 使用定制配置中的商户选择
                    // selectId: customPayConfig?.merchant?.find(m => m.selected)?.id ? [customPayConfig.merchant.find(m => m.selected).id] : []
                    selectId: customPayConfig?.merchant?.map(m => {if(m.selected) return m.id}) ? customPayConfig?.merchant?.map(m => {if(m.selected) return m.id}) : [],
                  }
                }),
                // 设置定制支付方式适用的订单类型
                customOrderType: config.useOrderBillingType || []
              }
            })
          }
        })
      }
      setTimeout(() => {
        formType.value = 'updating'
      }, 1)
    } else {
      // 创建时设置默认时间范围
      formData.value.fixedTime = [
        new Date(new Date().getFullYear(), 0, 1).getTime(),
        new Date(new Date().getFullYear(), 11, 31).getTime()
      ]
    }
  } catch (error) {
    console.error('Error in open:', error)
    message.error('加载数据失败')
  } finally {
    formLoading.value = false
  }
}

watch(
  () => formData.value.packagesType,
  (val, oldVal) => {
    if (!val) return
    if (val !== 5) {
      formData.value.packagesSimpleType = 1
      isSignDisabled.value = false
      merchantOption.value.forEach(
        async (item: { siteId: number | undefined; qqePackageOptions: any }) => {
          const sourcePackage = await SubscriptionApi.getSimpleQqePointsList(item.siteId)
          item.qqePackageOptions = sourcePackage.map((source: { uid: any; name: any }) => ({
            uid: source.uid,
            label: source.name
          }))
        }
      )
    } else {
      formData.value.packagesSimpleType = 2
      formData.value.isSign = false
      isSignDisabled.value = true
      merchantOption.value.forEach(
        async (item: { siteId: number | undefined; qqeTicketOptions: any }) => {
          const sourceTicket = await SubscriptionApi.getSimpleTicketList(item.siteId)
          item.qqeTicketOptions = sourceTicket.map((source: { code: any; name: any }) => ({
            code: source.code,
            label: source.name
          }))
        }
      )
    }
    if (formType.value !== 'update') {
      formData.value.points = undefined
      formData.value.expireMonth = undefined
      // 套餐类型 次卡、课时点互相转换 清除QQE套餐/次卡
      merchantOption.value.forEach(
        async (item: { siteId: number | undefined }) => {
          item.qqePackageUid = ''
        }
      )
    }
  }
)

watch(
  () => formData.value.isSign,
  (val) => {
    if (val === true) {
      formData.value.expireMonth = undefined
    } else {
      formData.value.monthDeductTimes = undefined
    }
  }
)

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()

  // 新增的验证逻辑：检查定制支付方式中的订单类型
  let hasError = false;
  for (const item of merchantOption.value) {
    if (item.cutomPay) {
      for (const [index, customPay] of Object.entries(item.cutomPay)) {
        const siteId = item.siteId; // 获取当前 siteId
        if (!customOrderTypeErrors[siteId]) {
          customOrderTypeErrors[siteId] = {}; // 初始化 siteId 的错误信息
        }
        if (customPay.customOrderType.length === 0) {
          customOrderTypeErrors[siteId][index] = '定制支付方式中至少需要选择一个订单类型';
          hasError = true;
        } else {
          delete customOrderTypeErrors[siteId][index]; // 清除错误信息
        }
      }
    }
  }

  if (hasError) {
    formLoading.value = false;
    return;
  }

  // 提交请求
  formLoading.value = true
  formData.value.effectiveTime = formData.value.fixedTime[0]
  formData.value.noneffctiveTime = formData.value.fixedTime[1]
  // 处理默认支付方式和定制支付方式
  formData.value.packagesBaseSetList = merchantOption.value.flatMap((item) => {
    const baseList = []
    // const defaultMerchantIds = item.payType.map((pt) => pt.selectId[0])
    const defaultMerchantIds = item.payType.map((pt) => pt.selectId).filter(Boolean).flatMap((ids) => ids)
    if (defaultMerchantIds.length > 0) {
      baseList.push({
        siteId: item.siteId,
        qqePackageUid: item.qqePackageUid,
        merchantIds: defaultMerchantIds
      })
    }

    // 处理定制支付方式
    if (item.cutomPay) {
      Object.values(item.cutomPay).forEach((customPay) => {
        // const merchantIds = customPay.customPayType.map((pt) => pt.selectId[0]).filter(Boolean)
        const merchantIds = customPay.customPayType.map((pt) => pt.selectId).filter(Boolean).flatMap((ids) => ids)
        if (merchantIds.length > 0) {
          baseList.push({
            siteId: item.siteId,
            qqePackageUid: item.qqePackageUid,
            merchantIds: merchantIds,
            useOrderBillingType: customPay.customOrderType
          })
        }
      })
    }

    return baseList
  })
  /**
   * 套餐状态和商户校验逻辑
   * 1 启用：判断是否有不符合条件的项
   * 2 停用：无须判断，直接通过（草稿）
   */
  if (formData.value.packagesStatus === 1) {
    // 是否有不符合条件的项
    let hasValidItem = false
    // QQE套餐/次卡和商户的必填校验
    for (const pbs of formData.value.packagesBaseSetList) {
      const isQQEPackageUidValid = pbs.qqePackageUid !== '' && pbs.qqePackageUid !== undefined
      const isMerchantIdsNotAllNull = !pbs.merchantIds.every(id => !id) // 检查是否不全为 null
      // 套餐类型：课时包，无 QQE套餐/次卡，解除 QQEPackageUid 的限制
      if (formData.value.packagesType === 4) {
        if (isMerchantIdsNotAllNull) {
          hasValidItem = true
          break
        }
      } else {
        // 如果发现任何一个不符合条件的项
        if (isQQEPackageUidValid && isMerchantIdsNotAllNull) {
          hasValidItem = true
          break
        }
      }
    }
    // 统一处理，检查是否有任何一个项不符合条件
    if (!hasValidItem) {
      message.error('请至少选择一个完整的QQE套餐和商户，如若不然，可将套餐状态改为停用后提交')
      formLoading.value = false
      return
    }
  }

  try {
    const data = formData.value as unknown as PackageVO
    // console.log("data", data)
    if (formType.value === 'create') {
      await PackageApi.createPackages(data)
      message.success(t('common.createSuccess'))
    } else {
      await PackageApi.updatePackages(data)
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
  formData.value = {
    id: undefined,
    name: undefined,
    price: undefined,
    hedgingTag: 0, // 默认非保值
    packagesSimpleType: 1,
    packagesType: undefined,
    points: undefined,
    expireMonth: undefined,
    explain: undefined,
    packagesStatus: 1,
    fixedTime: [],
    effectiveTime: undefined,
    noneffctiveTime: undefined,
    monthDeductTimes: undefined,
    isSign: false,
    packagesBaseSetList: []
  }
  formRef.value?.resetFields()
}

// 在打开表单时重置错误信息
const resetErrors = () => {
  for (const siteId in customOrderTypeErrors) {
    delete customOrderTypeErrors[siteId]; // 清除所有错误信息
  }
}

defineExpose({ open })
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

:deep(.el-radio-button__inner) {
  padding-inline: 40px;
}

:deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
  padding-bottom: 2px;
}

:deep(.el-collapse-item__header) {
  font-size: 14px;
  /* border: none; */
  justify-content: space-between;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 12px;
}
</style>
