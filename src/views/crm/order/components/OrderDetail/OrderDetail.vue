<template>
  <div class="order-detail">
    <el-input v-model="paymentUrl" v-if="paymentUrl" readonly class="paymentUrl">
      <template #prepend>支付链接</template>
      <template #append>
        <el-button :disabled="!paymentUrl" class="append-button" @click="openPaymentUrl">
          打开链接
        </el-button>
        <el-button :disabled="!paymentUrl" class="append-button" @click="copyPaymentUrl">
          复制链接
        </el-button>
      </template>
    </el-input>
    <div class="content">
      <div class="flex-1">
        <el-descriptions border :column="2" label-width="100">
          <el-descriptions-item :span="2" label="学员" label-class-name="desp-label" class-name="desp-content-span-2">
            <span class="customer-name">{{ paymentInfo.customer.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="订单内容" label-class-name="desp-label" class-name="desp-content-span-2">
            <template #default>
              <div class="package-info">
                <div>
                  <span class="sub-label">套餐名称：</span>
                  <span>{{ paymentInfo.packages.name }}</span>
                </div>
                <div>
                  <span class="sub-label">套餐类型：</span>
                  <span type="primary">{{ packagesTypeName }}</span>
                </div>
                <!-- 课时点套餐 签约制 -->
                <div v-if="packageType === 'point' || packageType === 'sign'">
                  <span class="sub-label">每月课时点：</span>
                  <span>{{ paymentInfo.packages.points }} 课时点</span>
                </div>
                <!-- 课时包 -->
                <div v-if="packageType === 'packet'">
                  <span class="sub-label">课时点：</span>
                  <span>{{ paymentInfo.packages.points }} 课时点</span>
                </div>
                <!-- 课时点-->
                <div v-if="packageType === 'point'">
                  <span class="sub-label">有效期：</span>
                  <span>{{ paymentInfo.packages.expireMonth }} 个月</span>
                </div>
                <!-- 次卡 -->
                <!-- <div v-if="packageType==='ticket'"> 
                  <span class="sub-label">有效期：</span> <span>valid time 天</span> 
                </div> -->
                <!-- 次卡 -->
                <!-- <div v-if="packageType === 'ticket'">
                  <span class="sub-label">上课次数：</span> <span>valid time 次</span>
                </div> -->
                <div>
                  <span class="sub-label">原价：</span>
                  <span>{{ formatDecimal(paymentInfo.packages.price) }}元</span><span
                    v-if="packageType === 'sign'">/每月</span>
                </div>
                <!-- 签约制 -->
                <div v-if="packageType === 'sign'">
                  <span class="sub-label">每月扣费次数：</span>
                  <span>{{ paymentInfo.packages.monthDeductTimes }} 次</span>
                </div>
              </div>
            </template>
          </el-descriptions-item>
          <el-descriptions-item :span="1" label="优惠" label-class-name="desp-label" class-name="desp-content-span-1"
            :align="paymentInfo.discountSum ? '' : 'center'">
            <el-text v-if="paymentInfo.discountSum" type="primary" class="font-bold">
              减 {{ formatDecimal(paymentInfo.discountSum) }} 元
            </el-text>
            <span v-else>--</span>
          </el-descriptions-item>
          <!-- 本次应付金额 -->
          <el-descriptions-item :span="1" label="应付金额" label-class-name="desp-label" class-name="desp-content-span-1">
            {{ formatDecimal(paymentInfo.remainingAmount) }} 元
          </el-descriptions-item>
          <el-descriptions-item :span="1" label="支付类型" label-class-name="desp-label" class-name="desp-content-span-1">
            <span v-if="paymentInfo.paymentType">
              {{ getDictLabel(DICT_TYPE.CRM_ORDER_PAYMENT_TYPE, paymentInfo.paymentType) }}
            </span>
            <span v-else>签约月付</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="packageType !== 'sign'" :span="1" label="支付方式" label-class-name="desp-label"
            class-name="desp-content-span-1">
            {{ getDictLabel(DICT_TYPE.CRM_PAYMENT_LIST, paymentInfo.paymentMethod) }}
          </el-descriptions-item>
          <el-descriptions-item v-else :span="1" label="签约类型" label-class-name="desp-label"
            class-name="desp-content-span-1">
            {{ getDictLabel(DICT_TYPE.SIGN_ORDER_TYPE, paymentInfo.orderType) }}
          </el-descriptions-item>
          <!-- 分次 -->
          <el-descriptions-item v-if="paymentInfo.paymentType === CRM_ORDER_PAYMENT_TYPE.INSTALLMENTS" :span="1"
            label="已支付" label-class-name="desp-label" class-name="desp-content-span-1">
            <span>{{ formatDecimal(paymentInfo.paidAmount) }}元</span>
          </el-descriptions-item>
          <!-- 分次 -->
          <el-descriptions-item v-if="paymentInfo.paymentType === CRM_ORDER_PAYMENT_TYPE.INSTALLMENTS" :span="2"
            label="剩余尾款" label-class-name="desp-label" class-name="desp-content-span-1">
            <span>{{ formatDecimal(paymentInfo.outstandingAmount) }}元</span>
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="支付金额" label-class-name="desp-label" class-name="desp-content-span-1"
            align="center">
            <span class="font-size-5">{{ formatDecimal(paymentInfo.amount) }}</span> 元
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div>
        <Qrcode v-if="paymentUrl" tag="canvas" :logo="logoSrc" :text="paymentUrl" :width="300" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { handleCopy } from '@/utils/common'
import { formatDecimal } from '@/utils/formatter'
import { isEmpty } from '@/utils/is'
import { PACKAGE_TYPE, CRM_ORDER_PAYMENT_TYPE } from '@/utils/constants'
import logoSrc from '@/assets/imgs/logo.png'

const props = defineProps({
  paymentInfo: {
    type: Object,
    default: () => { }
  }
})

/** 类型 
 * 套餐类型
    * point: 课时点，
    * ticket: 次卡,
    * packet: 课时包
    * sign: 签约制
*/
const packageType = computed(() => {
  const packages = props.paymentInfo.packages;
  if (isEmpty(packages)) return
  if (props.paymentInfo.packages?.isSign) {
    return 'sign'
  }
  if (props.paymentInfo.packages?.packagesType === PACKAGE_TYPE.TICKET) {
    return 'ticket'
  } else if (props.paymentInfo.packages.packagesType === PACKAGE_TYPE.QQE_POINT_PACKET) {
    return 'packet'
  } else {
    return 'point'
  }
})

/** 支付链接 */
const paymentUrl = computed(() => {
  return props.paymentInfo.payUrl
})

/** 支付类型  */
const paymentType = computed(() => {
  return getDictLabel(DICT_TYPE.CRM_ORDER_PAYMENT_TYPE, props.paymentInfo.paymentType)
})

/* 6.打开/复制支付链接 */
const copyPaymentUrl = () => {
  handleCopy(paymentUrl.value)
}
const openPaymentUrl = () => {
  window.open(paymentUrl.value, '_blank')
}

/** 套餐类型 */
const packagesTypeName = computed(() => {
  if (props.paymentInfo.packages.packagesType === PACKAGE_TYPE.TICKET) {
    return '次卡套餐'
  } else if (props.paymentInfo.packages.packagesType === PACKAGE_TYPE.QQE_POINT_PACKET) {
    return '课时包套餐'
  } else {
    return props.paymentInfo.packages?.isSign ? '课时点套餐(签约月付)' : '课时点套餐(非签约)'
  }
})
</script>

<style lang="scss" scoped>
:deep(.desp-label) {
  text-align: center !important;
  font-weight: bold !important;
}

:deep(.desp-content-span-2) {
  max-width: 450px;
}

:deep(.desp-content-span-1) {
  max-width: 180px;
  white-space: break-spaces;
}

.order-detail {
  flex-direction: column;

  .paymentUrl {
    margin-bottom: 15px;

    .append-button {
      color: #409eff;
    }
  }

  .content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .customer-name {
      font-weight: 700;
      color: var(--el-color-primary);
    }

    .package-info {
      line-height: 28px;

      .sub-label {
        display: inline-block;
        width: 100px;
        font-weight: bold;
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>
