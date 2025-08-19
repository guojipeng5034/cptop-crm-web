<template>
  <Dialog title="赠品" v-model="dialogVisible" width="350">
    <el-segmented v-model="presentType" :options="presentOptions" block class="mb-6" />
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80" v-loading="formLoading"
      :validate-on-rule-change="false">
      <div class="point" v-if="presentType === PRESENT_TYPE['point']">
        <el-form-item label="积分" label-width="60" prop="awardPointsNum">
          <el-input v-model.number="formData.awardPointsNum" placeholder="请输入积分数量" :maxlength="3"
            :disabled="disabledPoint" clearable />
        </el-form-item>
      </div>
      <div class="ticket" v-else-if="presentType === PRESENT_TYPE['ticket']">
        <el-form-item label="次卡数量" label-width="80" prop="awardTicketNum">
          <el-input v-model.number="formData.awardTicketNum" placeholder="请输入次卡数量" :maxlength="1"
            :disabled="disabledTicket" clearable />
        </el-form-item>
      </div>
      <div class="qqe-point" v-else-if="presentType === PRESENT_TYPE['qqePoint']">
        <el-form-item label="课时点" label-width="75" prop="awardQqePointsNum">
          <el-input v-model.number="formData.awardQqePointsNum" placeholder="请输入课时点数量" :maxlength="3"
            :disabled="disabledQqePoints" clearable />
        </el-form-item>
      </div>
      <div class="book" v-else-if="presentType === PRESENT_TYPE['book']">
        <div v-if="disabledBook" class="w-100% flex justify-center mb-5"><el-tag type="danger">赠送书籍已发货不允许修改</el-tag>
        </div>
        <el-form-item label="书籍" prop="awardBookType">
          <el-select v-model="formData.awardBookType" placeholder="请选择或检索书籍类型" clearable filterable
            :disabled="disabledBook">
            <el-option v-for="option in getStrDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE)" :key="option.value"
              :value="option.value" :label="option.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人" prop="receiveName">
          <el-input v-model.trim="formData.receiveName" :disabled="disabledRreceiveName" placeholder="请输入收货人" />
        </el-form-item>
        <el-form-item label="收货电话" prop="receivePhone">
          <el-input v-phone-input v-model.trim="formData.receivePhone" :disabled="disabledRreceivePhone"
            placeholder="请输入收货电话" />
        </el-form-item>
        <el-form-item label="收货地址" prop="receiveAddress">
          <el-input v-model.trim="formData.receiveAddress" type="textarea" :disabled="disabledRreceiveAddress"
            placeholder="请输入收货地址" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || disabledSumbitBtn">
        {{ submitButton }}
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { ORDER_TYPE, PRESENT_TYPE, PRESENT_LIMIT } from '@/utils/constants'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package/index'
import { BookOrderApi, BookOrderVO } from '@/api/crm/order/bookOrder/index'

/** 学员套餐管理 表单 */
defineOptions({ name: 'PresentForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const submitButton = computed(() => {
  const current = presentOptions.find((item) => item.value === presentType.value)
  return '赠送' + current.label
}) // 提交按钮文案

/* 基础数据 */
const baseData = ref({
  orderId: undefined,
  customerId: undefined,
  orderType: undefined
})

/* 表单数据 */
const formData = ref({
  awardPointsNum: undefined,
  awardTicketNum: undefined,
  awardQqePointsNum: undefined,
  awardBookType: undefined,
  receiveName: undefined,
  receivePhone: undefined,
  receiveAddress: undefined
})

/* 分段控制器 */
const presentType = ref()
const presentOptions = reactive([
  { label: '积分', value: PRESENT_TYPE['point'], disabled: false },
  { label: '次卡', value: PRESENT_TYPE['ticket'], disabled: false },
  { label: '课时点', value: PRESENT_TYPE['qqePoint'], disabled: false },
  { label: '书籍', value: PRESENT_TYPE['book'], disabled: false }
])

/* 表单校验规则 */
const formRules = reactive({
  awardPointsNum: [{}],
  awardTicketNum: [{}],
  awardQqePointsNum: [{}],
  awardBookType: [{}],
  receiveName: [{}],
  receivePhone: [{}],
  receiveAddress: [{}]
})
const formRef = ref() // 表单 Ref

/* 监视 presentType 变化 */
watch(
  () => presentType.value,
  (val) => {
    formRules.awardPointsNum =
      val === PRESENT_TYPE['point']
        ? [
          { required: true, message: '积分数量不能为空', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              if (
                baseData.value.orderType === ORDER_TYPE.NEW &&
                value > PRESENT_LIMIT.NEW_ORDER_POINT
              ) {
                callback(new Error('New 订单赠送积分数量不能超过300点'))
              } else if (
                baseData.value.orderType !== ORDER_TYPE.NEW &&
                value > PRESENT_LIMIT.RENEW_ORDER_POINT
              ) {
                callback(new Error('Renew 订单赠送积分数量不能超过150点'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
        : []
    formRules.awardTicketNum =
      val === PRESENT_TYPE['ticket']
        ? [
          { required: true, message: '次卡数量不能为空', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              if (value > PRESENT_LIMIT.TICKET) {
                callback(new Error('赠送次卡数量不能超过7张'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
        : []
    formRules.awardQqePointsNum =
      val === PRESENT_TYPE['qqePoint']
        ? [
          { required: true, message: '课时点不能为空', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              if (value > PRESENT_LIMIT.QQE_POINT) {
                callback(new Error('赠送课时点数量不能超过300点'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
        : []
    formRules.awardBookType =
      val === PRESENT_TYPE['book']
        ? [{ required: true, message: '书籍类型不能为空', trigger: 'blur' }]
        : []
    formRules.receiveName =
      val === PRESENT_TYPE['book']
        ? [{ required: true, message: '收货人不能为空', trigger: 'blur' }]
        : []
    formRules.receivePhone =
      val === PRESENT_TYPE['book']
        ? [{ required: true, message: '收货电话不能为空', trigger: 'blur' }]
        : []
    formRules.receiveAddress =
      val === PRESENT_TYPE['book']
        ? [{ required: true, message: '收货地址不能为空', trigger: 'blur' }]
        : []
  }
)

/** 打开弹窗 */
const open = async (presentData) => {
  dialogVisible.value = true
  formLoading.value = true
  resetForm()
  const { orderId, customerId, orderType } = presentData
  // 临时需求：https://zentao.52cebu.com/zentao/story-view-376.html，结束后删除
  if (orderType === 1) {
    presentType.value = PRESENT_TYPE['ticket']
  } else {
    presentType.value = PRESENT_TYPE['qqePoint']
  }
  baseData.value.orderId = orderId
  baseData.value.customerId = customerId
  baseData.value.orderType = orderType
  handleDisableForm(presentData)
  await fetchReceiveInfo(presentData.orderId)
  formLoading.value = false
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    let data = {}
    switch (presentType.value) {
      case PRESENT_TYPE['point']:
        data = { ...baseData.value, awardPointsNum: formData.value.awardPointsNum }
        break
      case PRESENT_TYPE['ticket']:
        data = { ...baseData.value, awardTicketNum: formData.value.awardTicketNum }
        break
      case PRESENT_TYPE['qqePoint']:
        data = { ...baseData.value, awardQqePointsNum: formData.value.awardQqePointsNum }
        break
      case PRESENT_TYPE['book']:
        data = {
          ...baseData.value,
          awardBookType: formData.value.awardBookType,
          receiveName: formData.value.receiveName,
          receivePhone: formData.value.receivePhone,
          receiveAddress: formData.value.receiveAddress
        }
    }
    await PackageOrderApi.distributePackageOrderPresent(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/* 表单项禁用 */
const disabledPoint = ref(false)
const disabledTicket = ref(false)
const disabledQqePoints = ref(false)
const disabledBook = ref(false)
const disabledRreceiveName = ref(false)
const disabledRreceivePhone = ref(false)
const disabledRreceiveAddress = ref(false)
const disabledSumbitBtn = computed(() => {
  if (presentType.value === PRESENT_TYPE['point']) return disabledPoint.value
  if (presentType.value === PRESENT_TYPE['ticket']) return disabledTicket.value
  if (presentType.value === PRESENT_TYPE['qqePoint']) return disabledQqePoints.value
  if (presentType.value === PRESENT_TYPE['book']) return disabledBook.value
})

/* 切换赠送类型 */
const handleDisableForm = (presentData) => {
  // new 订单不可送课时点，renew 订单不可送次卡和书籍
  if (presentData.orderType === ORDER_TYPE.NEW) {
    presentOptions.find((item) => item.label === '课时点').disabled = true
  } else {
    presentOptions.find((item) => item.label === '次卡').disabled = true
    presentOptions.find((item) => item.label === '书籍').disabled = true
  }

  // 临时需求：https://zentao.52cebu.com/zentao/story-view-376.html，结束后删除
  presentOptions.find((item) => item.label === '积分').disabled = true

  // 禁用表单项（如果有值则禁用）
  if (presentData.awardPointsNum) {
    formData.value.awardPointsNum = presentData.awardPointsNum
    disabledPoint.value = true
  }
  if (presentData.awardTicketNum) {
    formData.value.awardTicketNum = presentData.awardTicketNum
    disabledTicket.value = true
  }
  if (presentData.awardQqePointsNum) {
    formData.value.awardQqePointsNum = presentData.awardQqePointsNum
    disabledQqePoints.value = true
  }

  // Bug-1911: https://zentao.52cebu.com/zentao/bug-view-1911.html
  // if (presentData.awardBookType) {
  //   formData.value.awardBookType = presentData.awardBookType
  //   disabledBook.value = true
  //   disabledRreceiveName.value = true
  //   disabledRreceivePhone.value = true
  //   disabledRreceiveAddress.value = true
  // }
}

/* 获取收货信息 */
const hasbook = ref(false) // 是否已经送过书籍
const fetchReceiveInfo = async (orderId) => {
  try {
    const bookOrderData = await BookOrderApi.getBookOrderByOrderId(orderId)
    if (!bookOrderData) return
    // 如果书籍赠送状态为已处理（2）则不允许修改提交
    if (bookOrderData.status === 2) {
      disabledBook.value = true
      disabledRreceiveName.value = true
      disabledRreceivePhone.value = true
      disabledRreceiveAddress.value = true
    }
    hasbook.value = true
    formData.value.awardBookType = bookOrderData.bookName
    formData.value.receiveName = bookOrderData.receiveName
    formData.value.receivePhone = bookOrderData.receivePhone
    formData.value.receiveAddress = bookOrderData.receiveAddress
  } catch (error) {
    console.log('fetchReceiveInfo', error)
  }
}

/** 重置表单 */
const resetForm = () => {
  baseData.value = {
    orderId: undefined,
    customerId: undefined,
    orderType: undefined
  }
  formData.value = {
    awardPointsNum: undefined,
    awardTicketNum: undefined,
    awardQqePointsNum: undefined,
    awardBookType: undefined,
    receiveName: undefined,
    receivePhone: undefined,
    receiveAddress: undefined
  }
  formRef.value?.resetFields()
  // 重置分段器 */
  // 临时需求：https://zentao.52cebu.com/zentao/story-view-376.html，结束后改为 point
  // presentType.value = PRESENT_TYPE['point']
  presentOptions.forEach((item) => {
    item.disabled = false
  })

  // 重置禁用项
  disabledPoint.value = false
  disabledTicket.value = false
  disabledQqePoints.value = false
  disabledBook.value = false
  disabledRreceiveName.value = false
  disabledRreceivePhone.value = false
  disabledRreceiveAddress.value = false
  // disabledSumbitBtn.value = true
}
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
