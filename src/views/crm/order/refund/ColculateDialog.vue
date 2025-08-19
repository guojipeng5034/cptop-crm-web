<template>
  <Dialog title="计算退费金额" v-model="dialogVisible" width="600">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90"
      v-loading="formLoading"
    >
      <el-form-item label="套餐类型" prop="packageType" label-width="80px">
        <el-radio-group v-model="formData.packageType">
          <template
            v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_PACKAGES_TYPE)"
            :key="dict.value"
          >
            <el-radio :label="dict.label" :value="dict.value" />
          </template>
        </el-radio-group>

        <!-- <el-select v-model="formData.packageType" placeholder="请选择套餐类型">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.REFUND_PACKAGES_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
      </el-form-item>

      <div class="flex justify-between">
        <el-form-item label="支付总金额" prop="paymentAmount" label-width="90" class="!w48%">
          <el-input
            v-model="formData.paymentAmount"
            :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
            disabled
            placeholder="请输入当时支付的金额"
          />
        </el-form-item>
        <el-form-item
          label="剩余可退金额"
          prop="totalRefundableAmount"
          label-width="90"
          class="!w-48%"
        >
          <el-input
            v-model="totalRefundableAmount"
            :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
            disabled
            placeholder="请输入当时支付的金额"
          />
        </el-form-item>
      </div>
      <el-form-item label="手续费比例%" prop="handlingFee" label-width="100px">
        <el-input-number
          v-model="formData.handlingFee"
          :min="0"
          :max="12"
          :step="1"
          step-strictly
          v-limit-input
          placeholder="请输入手续费比例"
          class="!w-full"
        />
      </el-form-item>

      <el-form-item label-width="85px">
        <template #label>
          <span>已学费用</span>
          <el-popover
            placement="bottom"
            title="已学费用计算方式"
            width="auto"
            trigger="click"
            content="该套餐当月的价格乘以已经学习的月数"
          >
            <template #reference>
              <Icon
                icon="fa:question-circle-o"
                class="!font-size-2.5 ml-0.5 self-center color-#999 cursor-pointer hover:color-#409eff"
              />
            </template>
          </el-popover>
        </template>
        <template #default>
          <el-form-item prop="thisMonthPrice" class="flex-1">
            <el-input-number
              v-model="formData.thisMonthPrice"
              :min="0"
              :step="1"
              step-strictly
              v-limit-input
              placeholder="当月套餐价格"
              class="!w-full"
            />
          </el-form-item>
          <span class="fw-700 mx-2">x</span>
          <el-form-item prop="refundMonth" class="flex-1">
            <el-input-number
              v-model="formData.refundMonth"
              :min="0"
              :max="24"
              :step="1"
              step-strictly
              v-limit-input
              placeholder="已学月数"
              class="!w-full"
            />
          </el-form-item>
        </template>
      </el-form-item>

      <el-form-item label="赠送记录" label-width="85">
        <template #label>
          <span>赠送记录</span>
          <el-popover
            placement="bottom"
            title="赠品折算价值说明"
            width="auto"
            trigger="click"
            content="书籍（QQE59元、SK98元、WE158元）、积分0.5元、次卡60元"
          >
            <template #reference>
              <Icon
                icon="fa:question-circle-o"
                class="!font-size-2.5 ml-0.5 self-center color-#999 cursor-pointer hover:color-#409eff"
              />
            </template>
          </el-popover>
        </template>
        <template #default>
          <el-descriptions :column="2" border class="w-100%">
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="present-label keep"
              label="书籍名称"
            >
              <el-form-item prop="presentBookName" class="flex-1 !w-150px">
                <el-select
                  v-model="formData.presentBookName"
                  clearable
                  filterable
                  :disabled="disabledBook"
                >
                  <el-option
                    v-for="option in getStrDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE)"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  />
                </el-select>
                <!-- <el-input v-model="formData.presentBookName" placeholder="未赠送书籍" /> -->
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="switch-label"
              label="是否折算"
            >
              <el-switch
                class="custom-switch"
                v-model="isCalculateBook"
                width="70"
                inline-prompt
                size="large"
                :active-text="convertSwitchText(isCalculateBook)"
                :inactive-text="convertSwitchText(isCalculateBook)"
                :disabled="!formData.presentBookName"
                @change="calculatePresentAmount"
              />
            </el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="present-label"
              label="积分数量"
              ><el-form-item prop="presentPoint" class="flex-1 !w-150px">
                <el-input v-model.number="formData.presentPoint" /> </el-form-item
            ></el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="switch-label"
              label="是否折算"
            >
              <el-switch
                class="custom-switch"
                v-model="isCalculatePoint"
                width="70"
                inline-prompt
                size="large"
                :active-text="convertSwitchText(isCalculatePoint)"
                :inactive-text="convertSwitchText(isCalculatePoint)"
                @change="calculatePresentAmount"
              />
            </el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="present-label"
              label="次卡数量"
              ><el-form-item prop="presentTicket" class="flex-1 !w-150px">
                <el-input v-model.number="formData.presentTicket"/> </el-form-item
            ></el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="switch-label"
              label="是否折算"
            >
              <el-switch
                class="custom-switch"
                v-model="isCalculateTicket"
                width="70"
                inline-prompt
                size="large"
                :active-text="convertSwitchText(isCalculateTicket)"
                :inactive-text="convertSwitchText(isCalculateTicket)"
                @change="calculatePresentAmount"
              />
            </el-descriptions-item>
            <el-descriptions-item
              label-align="center"
              align="center"
              label-class-name="keep"
              label="合计"
            >
              {{ formData.presentAmount }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- <el-descriptions direction="vertical" :column="4" border class="w-100%">
            <el-descriptions-item label-align="center" align="center" label-class-name="present-label keep"
              label="书籍名称">
              <el-form-item prop="presentBookName" class="flex-1">
                <el-select v-model="formData.presentBookName" placeholder="未赠送书籍" disabled class="!w-150px">
                  <el-option v-for="dict in getStrDictOptions(DICT_TYPE.CRM_ORDER_GIVE_BOOK_TYPE)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label-align="center" align="center" label-class-name="present-label"
              label="积分数量"><el-form-item prop="presentPoint" class="flex-1">
                <el-input v-model="formData.presentPoint" disabled /> </el-form-item></el-descriptions-item>
            <el-descriptions-item label-align="center" align="center" label-class-name="present-label"
              label="次卡数量"><el-form-item prop="presentTicket" class="flex-1">
                <el-input v-model="formData.presentTicket" disabled /> </el-form-item></el-descriptions-item>
            <el-descriptions-item label-align="center" align="center" label-class-name="keep" label="合计">
              {{ formData.presentAmount }}
            </el-descriptions-item>
          </el-descriptions> -->
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="calculateRefundAmount">计算</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'

const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('')

const formRef = ref() // 表单 Ref
const formData = ref({
  // 计算
  packageType: undefined, // 套餐类型: 1：长期；2：短期；3：次卡
  paymentAmount: undefined, // 订单的支付金额
  handlingFee: undefined, // 手续费
  thisMonthPrice: undefined, // 当前月价格
  refundMonth: undefined, // 学习月数
  presentBookName: undefined, // 赠送书籍名称
  presentPoint: 0, // 赠送积分数量
  presentTicket: 0, // 赠送次卡数量
  presentAmount: undefined, // 赠品价格
  refundAmount: 0 // 退费金额
})
const formRules = reactive({
  packageType: [{ required: true, message: '套餐类型为必选项', trigger: 'change' }],
  thisMonthPrice: [{ required: true, message: '当月套餐价格为必填项', trigger: 'blur' }],
  refundMonth: [{ required: true, message: '已学习月数为必填项', trigger: 'blur' }]
})

const dialogVisible = ref(false)
const open = (colculateData) => {
  formLoading.value = true
  dialogVisible.value = true
  const { paymentAmount, presentBookName, presentPoint, presentTicket, refundableAmount } =
    colculateData
  formData.value.paymentAmount = paymentAmount
  formData.value.presentBookName = presentBookName
  formData.value.presentPoint = presentPoint
  formData.value.presentTicket = presentTicket
  totalRefundableAmount.value = paymentAmount - refundableAmount // 剩余可退金额
  // 计算赠品价格
  calculatePresentAmount()
  formLoading.value = false
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/* 生成 switch 文案*/
const convertSwitchText = (val) => {
  if (val) return '折算'
  else return '不折算'
}

/* 计算赠品折算价值 */
const isCalculateBook = ref(false) // 是否计算书籍
const isCalculatePoint = ref(false) // 是否计算积分
const isCalculateTicket = ref(false) // 是否计算次卡
const calculatePresentAmount = () => {
  let amount = 0
  // 计算书籍价格: 已赠送并且选择折算
  if (formData.value.presentBookName && isCalculateBook.value) {
    if (formData.value.presentBookName.includes('QQE')) {
      amount += 59
    } else if (formData.value.presentBookName.includes('SK')) {
      amount += 98
    } else if (formData.value.presentBookName.includes('WE')) {
      amount += 158
    }
  }

  // 计算积分价格: 已赠送并且选择折算
  if (formData.value.presentPoint && isCalculatePoint.value) {
    amount += Number(formData.value.presentPoint) * 0.5
  } else if (!formData.value.presentPoint) {
    formData.value.presentPoint = 0
  }

  // 计算次卡价格: 已赠送并且选择折算
  if (formData.value.presentTicket && isCalculateTicket.value) {
    amount += Number(formData.value.presentTicket) * 60
  } else if (!formData.value.presentTicket) {
    formData.value.presentTicket = 0
  }

  formData.value.presentAmount = amount
}

/* 计算退费金额 */
/* 
  * 剩余可退金额=支付总金额-已退金额
  * 退款金额=剩余可退金额-当前月价格*学习月数-赠品价格
  * 当手续费比例=0时: 实际退款金额=退款金额
  * 当手续费比例>0时:
    1.订单为长期套餐:退款金额-剩余可退金额*手续费比例
    2.订单为短期或者次卡套餐:退款金额-退款金额*手续费比例

*/
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const totalRefundableAmount = ref(0) // 可退金额： 支付总金额 - 已退金额
const calculateRefundAmount = async () => {
  // 校验表单
  await formRef.value.validate()
  formLoading.value = true

  // 计算退款金额
  let refundAmount =
    totalRefundableAmount.value -
    formData.value.thisMonthPrice * formData.value.refundMonth -
    formData.value.presentAmount

    // 处理不同手续费及不同套餐类型的情况
  if (formData.value.handlingFee > 0) {
    if (formData.value.packageType === 1) {
      // 长期套餐
      refundAmount -= totalRefundableAmount.value * (formData.value.handlingFee / 100)
    } else {
      // 短期或次卡套餐
      refundAmount -= refundAmount * (formData.value.handlingFee / 100)
    }
  }

  if (refundAmount < 0) {
    ElMessage({
      showClose: true,
      message: `当前计算退款金额为${refundAmount}, 退款金额不能小于0, 请检查并修改后重新计算`,
      type: 'warning',
      duration: 5000
    })

    formLoading.value = false
    return
  }

  // 更新实际的退款金额
  formData.value.refundAmount = Number.parseInt(refundAmount)

  formLoading.value = false
  const calcData = Object.assign({}, formData.value)
  calcData.presentBookName = isCalculateBook.value ? formData.value.presentBookName : undefined
  calcData.presentPoint = isCalculatePoint.value ? formData.value.presentPoint : undefined
  calcData.presentTicket = isCalculateTicket.value ? formData.value.presentTicket : undefined
  emit('success', calcData)
  dialogVisible.value = false
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  isCalculateBook.value = false
  isCalculatePoint.value = false
  isCalculateTicket.value = false
}
</script>
<style lang="scss" scoped>
.custom-switch {
  --el-switch-off-color: #c2c6ce; /* 自定义未激活背景颜色 */
}
</style>
