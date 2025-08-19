<template>
  <Dialog title="生成合同" v-model="dialogVisible">
    <el-alert v-if="eContractStatus !== 1" type="info" show-icon :closable="false" effect="dark">
      <template #title>
        <span class="flex items-center">
          <span class="text-3.5">
            审核通过的合同地址会在这里显示。
          </span>
        </span>
      </template>
    </el-alert>
    <el-alert v-else type="success" show-icon :closable="false" effect="dark" v-loading="shortUrlLoading">
      <template #title>
        <span class="flex items-center">
          <span class="text-3.5">电子合同查看地址：</span>
        </span>
      </template>
      <template #default>
        <el-button link @click="openEContract" style="color: #fff;">打开</el-button>
        <el-button link @click="copyEContract" style="color: #fff;">复制</el-button>
      </template>
    </el-alert>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="95" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学员姓名" prop="studentName">
            <el-input v-model="formData.studentName" placeholder="请输入学员姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="formData.idCard" placeholder="请输入学员身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监护人姓名" prop="parentName">
            <el-input v-model="formData.parentName" placeholder="请输入监护人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="parentIdCard">
            <el-input v-model="formData.parentIdCard" placeholder="请输入监护人身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-only-numbers v-model="formData.phone" placeholder="请输入电话号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="套餐名称" prop="packageName">
            <el-input v-model="formData.packageName" placeholder="请输入套餐名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单原价" prop="totalAmount">
            <el-input v-model="formData.totalAmount" placeholder="请输入订单原价" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠金额" prop="discountAmount">
            <el-input v-model="formData.discountAmount" placeholder="请输入优惠金额" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实付金额" prop="actualAmount">
            <el-input v-model="formData.actualAmount" placeholder="请输入实付金额" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款日期" prop="fullPaymentTime">
            <el-date-picker v-model="formData.fullPaymentTime" type="datetime" placeholder="请选择付款日期" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button v-if="eContractStatus !== 1 && formType === 'create'" class="float-left"
        @click="generateContract" type="primary" :disabled="formLoading">生成合同</el-button>
      <el-button @click="closeDialog" type="primary" :disabled="formLoading">{{ closeText }}</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { handleCopy } from '@/utils/common'
import { EContractApi, EContractVO } from '@/api/crm/order/econtract'
import { BaseApi } from '@/api/crm/base'

/** 合同信息 表单 */
defineOptions({ name: 'ContractForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const shortUrlLoading = ref(false) // 生成短链的加载中

/* 电子合同数据 */
const eContractStatus = ref() // 电子合同状态
const formType = ref() // 合同生成状态
const eContractUrl = ref('') // 电子合同 url
const customerId = ref()
const orderNum = ref()
const closeText = computed(() => formType.value === 'create' ? '关闭' : '保存')

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  orderId: undefined,
  studentName: undefined,
  idCard: undefined,
  parentName: undefined,
  parentIdCard: undefined,
  phone: undefined,
  address: undefined,
  packageName: undefined,
  totalAmount: undefined,
  discountAmount: undefined,
  actualAmount: undefined,
  fullPaymentTime: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  studentName: [{ required: true, message: '学员姓名不能为空', trigger: 'blur' }],
  parentName: [{ required: true, message: '监护人姓名不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 设置合同 URL */
const setContractUrl = async (studentUID: string, orderNum: string) => {
  let campustopShortUrl, qqeShortUrl
  shortUrlLoading.value = true
  try {
    shortUrlLoading.value = true
    const campustopRes = await BaseApi.shortUrl(encodeURIComponent(`${import.meta.env.VITE_ECONTRACT_CAMPUSTOP_URL}?studentUID=${studentUID}&orderNum=${orderNum}`))
    const qqeRes = await BaseApi.shortUrl(encodeURIComponent(`${import.meta.env.VITE_ECONTRACT_QQE_URL}?studentUID=${studentUID}&orderNum=${orderNum}`))
    campustopShortUrl = campustopRes.shortUrl
    qqeShortUrl = qqeRes.shortUrl
    if (campustopShortUrl === null || qqeShortUrl === null) {
      message.error('短链生成失败，展示长链接')
      campustopShortUrl = `${import.meta.env.VITE_ECONTRACT_CAMPUSTOP_URL}?studentUID=${studentUID}&orderNum=${orderNum}`
      qqeShortUrl = `${import.meta.env.VITE_ECONTRACT_QQE_URL}?studentUID=${studentUID}&orderNum=${orderNum}`
    }
  } finally {
    shortUrlLoading.value = false
  }
  const site = await EContractApi.getSite(customerId.value)
  eContractUrl.value = site.siteId === 600 ? campustopShortUrl : qqeShortUrl
}

/** 设置表单数据 */
const setFormData = (res, row) => {
  Object.assign(formData.value, {
    id: res.id,
    customerId: row.customerId,
    orderId: row.id,
    studentName: res.studentName,
    idCard: res.idCard,
    parentName: res.parentName,
    parentIdCard: res.parentIdCard,
    phone: res.phone,
    address: res.address,
    packageName: row.packageName,
    totalAmount: row.totalAmount,
    discountAmount: row.discountAmount,
    actualAmount: row.actualAmount,
    fullPaymentTime: row.fullPaymentTime
  })
}

/* 打开合同链接 */
const openEContract = () => {
  window.open(eContractUrl.value, '_blank')
}

/* 复制合同链接 */
const copyEContract = () => {
  handleCopy(eContractUrl.value)
}

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  customerId.value = row.customerId
  formLoading.value = true
  try {
    const res = await EContractApi.getEContractDetail(row.id)
    eContractStatus.value = res.status
    formType.value = 'update'
    orderNum.value = row.orderNum
    setFormData(res, row)
    setContractUrl(res.studentUID, orderNum.value)
  } catch {
    eContractStatus.value = -1
    formType.value = 'create'
    setFormData({}, row)
    formData.value.studentName = row.customerName
  } finally {
    formLoading.value = false
  }
}

/* 生成合同 */
const generateContract = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as unknown as EContractVO
    await EContractApi.createEContract(data)
    message.success('合同生成成功')
    const res = await EContractApi.getEContractDetail(data.orderId)
    formData.value.id = res.id
    eContractStatus.value = 1
    setContractUrl(res.studentUID, res.orderNum)
    formType.value = ''
  } finally {
    formLoading.value = false
  }
}

/* 关闭弹窗 */
const emit = defineEmits(['success'])
const closeDialog = async () => {
  if (eContractStatus.value === 1 && formType.value === 'update') {
    await formRef.value.validate()
    formLoading.value = true
    try {
      const data = formData.value as unknown as EContractVO
      await EContractApi.updateEContract(data)
      message.success(t('common.updateSuccess'))
    } finally {
      formLoading.value = false
    }
  }
  dialogVisible.value = false
  emit('success')
}

/** 重置表单 */
const resetForm = () => {
  eContractStatus.value = -1
  eContractUrl.value = ''
  formData.value = {
    id: undefined,
    customerId: undefined,
    orderId: undefined,
    studentName: undefined,
    idCard: undefined,
    parentName: undefined,
    parentIdCard: undefined,
    phone: undefined,
    address: undefined,
    packageName: undefined,
    totalAmount: undefined,
    discountAmount: undefined,
    actualAmount: undefined,
    fullPaymentTime: undefined,
  }
  formRef.value?.resetFields()
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

.el-alert {
  margin-bottom: 15px;
}
</style>