<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" v-loading="formLoading">
      <el-form-item label="当前套餐" prop="oldPackageId">
        <div class="flex items-center">
          <arco-tag v-show="hedgingTagValue" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="hedgingTagValue"
            size="small" />
          <span class="ml-2 mr-auto font-bold">{{ oldPackageName }}</span>
        </div>
      </el-form-item>
      <el-form-item label="更换套餐" prop="packageId">
        <el-select v-model="formData.packageId" filterable clearable placeholder="请选择想要更换的套餐">
          <el-option v-for="dict in packageOption" :key="dict.id" :label="dict.name" :value="dict.id">
            <template #default>
              <div class="flex justify-between items-center">
                <arco-tag v-show="dict.hedgingTag" :type="DICT_TYPE.CRM_PACKAGES_HEDGING_TAG" :value="dict.hedgingTag"
                  size="small" />
                <span class="ml-2 mr-auto">{{ dict.name }}</span>
                <span class="pl-4">￥{{ dict.price }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { PackageOrderApi, PackageOrderVO } from '@/api/crm/order/package'
import { PackageApi } from '@/api/crm/package/package'

/** 学员账号 表单 */
defineOptions({ name: 'ChangePackageFrom' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('更换套餐') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const hedgingTagValue = ref() // 当前套餐保值tag
const oldPackageName = ref('') // 当前套餐名称

/* 表单数据 */
const formData = ref({
  packageId: undefined,
  orderId: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  packageId: [{ required: true, message: '更换套餐为必选项', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** options */
// 1.package
const packageOption = ref([])

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  formLoading.value = true
  packageOption.value = await PackageApi.getSwitchSimplePackagesList(row.customerId)
  resetForm()
  hedgingTagValue.value = row.hedgingTag
  oldPackageName.value = row.packageName
  formLoading.value = false
  formData.value.oldPackageId = row.packageId
  formData.value.orderId = row.id
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
    const { orderId, packageId } = formData.value as unknown as PackageOrderVO
    await PackageOrderApi.switchOrderPackage(orderId, packageId)
    message.success('更换成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (e) {
    message.error('更换失败')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    packageId: undefined,
    orderId: undefined
  }
  formRef.value?.resetFields()
  hedgingTagValue.value = undefined
  oldPackageName.value = ''
}

</script>
