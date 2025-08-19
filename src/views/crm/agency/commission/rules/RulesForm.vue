<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" v-loading="formLoading">
      <el-form-item label="佣金规则名称" prop="ruleName">
        <el-input v-model="formData.ruleName" placeholder="请输入佣金规则名称" :readonly="formType === 'update'" />
      </el-form-item>

      <el-form-item label="升级所需点数" prop="upgradePoints">
        <el-input-number v-limit-input v-model="formData.upgradePoints" placeholder="请输入升级所需点数" clearable :min="0"
          :max="999999999" :step="1" step-strictly class="!w100%" />
      </el-form-item>

      <el-form-item label="是否可升级" prop="isUpgradeFlag">
        <el-radio-group v-model="formData.isUpgradeFlag" :disabled="formType === 'update'">
          <el-radio border :value="true" label="是" />
          <el-radio border :value="false" label="否" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上级佣金规则" prop="parentRulesId" v-if="formType === 'create' || formData.parentRulesId">
        <el-select v-model="formData.parentRulesId" placeholder="请选择或检索佣金规则" clearable filterable
          :disabled="formType === 'update'">
          <el-option v-for="dict in ruleOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入备注" />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getAgencyCommissionRulesOptions } from '@/utils/dict'
import { AgencyCommissionRulesApi, AgencyCommissionRulesVO } from '@/api/crm/agency/commission/rules'

/** 代理佣金规则 表单 */
defineOptions({ name: 'AgencyCommissionRulesForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  ruleName: undefined,
  isUpgradeFlag: undefined,
  upgradePoints: undefined,
  parentRulesId: undefined,
  description: undefined,
  status: undefined,
})
const formRules = reactive({
  ruleName: [{ required: true, message: '佣金规则名称为必填项', trigger: 'blur' }],
  isUpgradeFlag: [{ required: true, message: '是否可升级为必选项', trigger: 'change' }],
  upgradePoints: [{ required: true, message: '升级所需点数为必填项', trigger: 'blur' }],
  status: [{ required: true, message: '状态为必选项', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/* options */
/* rule */
const ruleOptions = ref([])

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  await handleRuleOptions()
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AgencyCommissionRulesApi.getAgencyCommissionRules(id)
    } finally {
      formLoading.value = false
    }
  }
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
    const data = formData.value as unknown as AgencyCommissionRulesVO
    if (formType.value === 'create') {
      await AgencyCommissionRulesApi.createAgencyCommissionRules(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgencyCommissionRulesApi.updateAgencyCommissionRules(data)
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
    ruleName: undefined,
    isUpgradeFlag: undefined,
    upgradePoints: undefined,
    parentRulesId: undefined,
    description: undefined,
    status: undefined,
  }
  formRef.value?.resetFields()
}

const handleRuleOptions = async () => {
  const res = await getAgencyCommissionRulesOptions()
  ruleOptions.value = res.filter(item => item.disabled !== 1)
}

</script>