<template>
  <el-form ref="formRef" label-width="100" :model="formData" :rules="formRules">
    <el-form-item :label="t('profile.user.nickname')" prop="nickname">
      <el-input v-model="formData.nickname" :placeholder="t('profile.rules.nickname')" disabled />
    </el-form-item>
    <el-form-item :label="t('profile.user.mobile')" prop="mobile">
      <el-input v-model="formData.mobile" placeholder="请输入手机号码" clearable />
    </el-form-item>
    <el-form-item :label="t('profile.user.email')" prop="email">
      <el-input v-model="formData.email" placeholder="请输入用户邮箱" clearable :disabled="isDisabledQQe" />
    </el-form-item>
    <el-form-item :label="t('profile.user.sex')" prop="sex">
      <el-radio-group v-model="formData.sex">
        <el-radio :label="1">{{ t('profile.user.man') }}</el-radio>
        <el-radio :label="2">{{ t('profile.user.woman') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="微信二维码" prop="wechatQrcodeBusinessCard">
      <form-create v-model="formData.wechatQrcodeBusinessCard" :rule="wechatQrcodeBusinessCardRule"
        :option="wechatQrcodeBusinessCardOption" />
    </el-form-item>
  </el-form>
  <div class="text-center">
    <XButton :title="t('common.save')" size="large" type="primary" @click="submit()" />
    <XButton :title="t('common.reset')" size="large" type="danger" @click="init()" />
  </div>
</template>
<script lang="ts" setup>
import { getUserProfile, updateUserProfile } from '@/api/system/user/profile'
import * as DeptApi from '@/api/system/dept'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'BasicInfo' })

/* 配置项 */
const { t } = useI18n()
const message = useMessage() // 消息弹窗
const userStore = useUserStore()
const isDisabledQQe = ref(false)

isDisabledQQe.value = JSON.parse(localStorage.getItem('roles')).includes('QQE_FORBIDDEN_OP') && !JSON.parse(localStorage.getItem('roles')).includes('super_admin')

/* 微信二维码 */
const wechatQrcodeBusinessCardRule = ref([
  {
    "type": "UploadImg",
    "field": "wechatQrcodeBusinessCard",
    "props": {
      "fileSize": 5,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "path": 'profile/baseInfo/wechatQrcodeBusinessCard/'
    },
    "hidden": false,
    "display": true
  }]
)
const wechatQrcodeBusinessCardOption = ref({
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

/* 表单数据 */
const formData = ref({
  nickname: '',
  mobile: '',
  email: '',
  sex: 1,
  wechatQrcodeBusinessCard: { wechatQrcodeBusinessCard: '' },
  dept: {
    id: undefined,
    name: ''
  }
})

/* 表单校验规则 */
const formRules = reactive({
  nickname: [{ required: true, message: t('profile.rules.nickname'), trigger: 'blur' }],
  mobile: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: t('profile.rules.truephone'), trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: t('profile.rules.truemail'), trigger: ['blur', 'change'] }
  ],
})

const formRef = ref() // 表单 Ref

/* 得到表单数据 */
const init = async () => {
  formData.value = await getUserProfile()
  // 回显图片
  formData.value.wechatQrcodeBusinessCard = { wechatQrcodeBusinessCard: formData.value.wechatQrcodeBusinessCard }
  // const regexRuleIndex = formRules.nickname.findIndex(
  //   (rule) => 'pattern' in rule
  // )
  // if (regexRuleIndex !== -1) {
  //   formRules.nickname.splice(regexRuleIndex, 1)
  // }
  // if (formData.value.depts) {
  //   const belongIds = formData.value.depts.map(item => item.belongId)
  //   const has70Or80 = belongIds.includes(70) || belongIds.includes(80)
  //   if (has70Or80) {
  //     formRules.nickname.push({
  //       pattern: /^[A-Z][a-zA-Z]*[\u4e00-\u9fa5]+$/,
  //       message: '用户姓名需符合规范，例如：Jo李明哲',
  //       trigger: ['change', 'blur']
  //     })
  //   } else {
  //     formRules.nickname.push({
  //       pattern: /^[A-Z][a-zA-Z]+$/,
  //       message: '用户姓名需符合规范，例如：Jo',
  //       trigger: ['change', 'blur']
  //     })
  //   }
  // }
}

/* 提交表单 */
const submit = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  try {
    // 分配图片
    formData.value.wechatQrcodeBusinessCard = formData.value.wechatQrcodeBusinessCard.wechatQrcodeBusinessCard
    const data = formData.value
    await updateUserProfile(data)
    message.success(t('common.updateSuccess'))
    userStore.setUserNicknameAction(formData.value.nickname)
  } finally { }
}

onMounted(async () => {
  await init()
})
</script>
