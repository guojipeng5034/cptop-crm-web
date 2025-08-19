<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效期类型" prop="validityType">
            <el-select v-model="formData.validityType" placeholder="请选择有效期类型" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.VALIDITY_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效天数" prop="expireDays" v-if="formData.validityType === 1">
            <el-input v-only-numbers v-model="formData.expireDays" placeholder="请输入有效天数" />
          </el-form-item>
          <el-form-item label="有效日期" prop="fixedTime" v-else-if="formData.validityType === 2">
            <el-date-picker v-model="formData.fixedTime" type="daterange" value-format="x" start-placeholder="生效日期"
              end-placeholder="失效日期" clearable :disabled-date="disabledBeforeDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="inventory">
            <el-input v-only-numbers v-model="formData.inventory" placeholder="请输入库存" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠金额" prop="discount">
            <el-input v-only-numbers v-model="formData.discount" placeholder="请输入优惠金额" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="优惠券分类" prop="couponType">
            <el-select v-model="formData.couponType" placeholder="请选择优惠券分类" clearable>
              <el-option v-for="dict in couponTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select v-model="formData.enableStatus" placeholder="请选择启用状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架状态" prop="getatableStatus">
            <el-select v-model="formData.getatableStatus" placeholder="请选择上架状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.GETATABLE_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="优惠券说明" prop="explain">
        <el-input v-model="formData.explain" type="textarea" placeholder="请输入优惠券说明" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="可用套餐" prop="packagesBindType">
            <el-radio-group v-model="formData.packagesBindType">
              <el-radio class="!mr-4" v-for="dict in getIntDictOptions(DICT_TYPE.CRM_PACKAGES_BIND_TYPE)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 可用套餐为：可用套餐类型 时显示 -->
          <el-form-item v-if="formData.packagesBindType === 0" label="可用套餐分类" prop="packageType">
            <el-select v-model="formData.packageType" placeholder="请选择可用套餐分类" filterable clearable multiple>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PACKAGES_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-else label="套餐名称" prop="packageIds">
            <el-cascader v-model="formData.packageIds" :options="packageCascaderOptions" :props="packageCascaderProps"
              collapse-tags collapse-tags-tooltip />
          </el-form-item>

        </el-col>
        <el-form-item label-width="40">
          <el-text size="small" type="info">说明：选择可用套餐类型表示后续在该套餐类型下新增的套餐名称也可使用该优惠券</el-text>
        </el-form-item>
      </el-row>

      <el-form-item label="是否单独使用" prop="isSingle">
        <el-radio-group v-model="formData.isSingle">
          <el-radio class="!mr-4" v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_INTEGER)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="40">
        <el-text size="small" type="info">说明：设置单独使用即同一个订单内选择该优惠券不可与其他所有优惠叠加使用</el-text>
      </el-form-item>

      <el-form-item label="互斥优惠券设置" prop="mutexGroup" label-width="120">
        <el-select v-model="formData.mutexGroup" placeholder="请选择互斥优惠券组" multiple collapse-tags :max-collapse-tags="1"
          collapse-tags-tooltip clearable placement="top" class="!w-300px">
          <template #header>
            <div>
              <el-button type="primary" size="small" @click="checkAll('mutex')"> 全选 </el-button>
              <el-button type="info" size="small" @click="clearAll('mutex')"> 清空 </el-button>
            </div>
            <div class="mt-2 flex justify-between items-center">
              <el-input v-model="mutexGroupQueryParams.groupName" placeholder="请输入券组名（联想输入）" :prefix-icon="Search"
                @input="mutextGroupSearch" class="m-r-2" clearable />
              <!-- 当前 -->
              <el-check-tag v-show="formType === 'update'" :checked="currentChecked" size="small" type="primary"
                @change="(status) => currentOnChange(status, 'mutex')" class="text-center">
                <Icon icon="octicon:note-16" :size="16" />
              </el-check-tag>
            </div>
          </template>
          <div v-loading="mutexGroupOptionsLoading">
            <el-option v-for="item in mutexGroupOptions.list" :key="item.id" :label="item.groupName" :value="item.id">
              <template #default>
                <el-popover :content="getGroupOptionPop(item.coupons)" placement="right" width="auto" :offset="20"
                  :popper-style="{ marginRight: '20px' }">
                  <template #reference>
                    <div class="w-auto">{{ item.groupName }}</div>
                  </template>
                </el-popover>
              </template>
            </el-option>
          </div>
          <template #footer>
            <el-pagination size="small" layout="prev, pager, next" :total="mutexGroupOptions.total" :page-size="5"
              v-model:page="mutexGroupQueryParams.pageNo" @change="getMutexGroupList" />
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label-width="40">
        <el-text size="small" type="info">说明：即优惠券组内所有券在同一订单中不可叠加使用，且使用一张优惠券之后，其他优惠券不可选中</el-text>
      </el-form-item>

      <el-form-item label="互斥失效优惠券设置" prop="mutexInvalidGroup" label-width="140">
        <el-select v-model="formData.mutexInvalidGroup" placeholder="请选择互斥失效优惠券组" multiple collapse-tags
          :max-collapse-tags="1" collapse-tags-tooltip clearable placement="top" class="!w-280px">
          <template #header>
            <div>
              <el-button type="primary" size="small" @click="checkAll('invalid')"> 全选 </el-button>
              <el-button type="info" size="small" @click="clearAll('invalid')"> 清空 </el-button>
            </div>
            <div class="mt-2 flex justify-between items-center">
              <el-input v-model="invalidGroupQueryParams.groupName" placeholder="请输入券组名（联想输入）" :prefix-icon="Search"
                @input="invalidGroupSearch" class="m-r-2" clearable />
              <!-- 当前 -->
              <el-check-tag v-show="formType === 'update'" :checked="currentChecked" size="small" type="primary"
                @change="(status) => currentOnChange(status, 'invalid')" class="text-center">
                <Icon icon="octicon:note-16" :size="16" />
              </el-check-tag>
            </div>
          </template>
          <div v-loading="invalidGroupLoading">
            <el-option v-for="item in invalidGroupOptions.list" :key="item.id" :label="item.groupName" :value="item.id">
              <template #default>
                <el-popover :content="getGroupOptionPop(item.coupons)" placement="right" width="auto" :offset="20"
                  :popper-style="{ marginRight: '20px' }">
                  <template #reference>
                    <div class="w-auto">{{ item.groupName }}</div>
                  </template>
                </el-popover>
              </template>
            </el-option>
          </div>
          <template #footer>
            <el-pagination size="small" layout="prev, pager, next" :total="invalidGroupOptions.total" :page-size="5"
              v-model:page="invalidGroupQueryParams.pageNo" @change="getInvalidGroupList" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label-width="40">
        <el-text size="small" type="info">说明：即优惠券组内所有券在同一订单中不可叠加使用，且使用一张优惠券之后，其他优惠券状态变为失效状态</el-text>
      </el-form-item>


    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getPackageOptions, getCouponMutexGroupOptionsByType } from '@/utils/dict'
import { disabledBeforeDate } from '@/utils/formatTime'
import { CRM_COUPON_GROUP_TYPE } from '@/utils/constants'
import { CouponApi, CouponVO } from '@/api/crm/sales/coupon/coupon'
import { CouponMutexGroupApi, CouponMutexGroupVO } from '@/api/crm/sales/coupon/couponMutexGroup'
import { Search, Plus, Edit, Check, Delete, Picture } from '@element-plus/icons-vue'

/** 优惠券 表单 */
defineOptions({ name: 'CouponForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* 表单数据 */
const formData = ref({
  id: undefined,
  name: undefined,
  discount: undefined,
  validityType: undefined,
  expireDays: undefined,
  fixedTime: [],
  effectiveTime: undefined,
  noneffctiveTime: undefined,
  inventory: undefined,
  explain: undefined,
  couponType: undefined,
  packageType: [],
  enableStatus: 1,
  getatableStatus: 1,

  packagesBindType: 0,
  packageIds: [],
  isSingle: 0,
  mutexGroup: [],
  mutexInvalidGroup: []
})

/* 表单校验规则 */
const formRules = ({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  discount: [{ required: true, message: '优惠金额不能为空', trigger: 'blur' }],
  validityType: [{ required: true, message: '有效期类型不能为空', trigger: 'change' }],
  expireDays: [{}],
  fixedTime: [{}],
  inventory: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
  explain: [{ required: true, message: '优惠券说明不能为空', trigger: 'blur' }],
  couponType: [{ required: true, message: '优惠券分类不能为空', trigger: 'change' }],
  packageType: [{ required: true, message: '可用套餐分类不能为空', trigger: 'change' }],
  enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
  getatableStatus: [{ required: true, message: '上架状态不能为空', trigger: 'change' }],
  packagesBindType: [{ required: true, message: '套餐类型不能为空', trigger: 'change' }],
  packageIds: [{ type: 'array', required: true, message: '套餐为必选项', trigger: 'change' }],
  isSingle: [{ required: true, message: '是否单独使用不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/* 去除停课券的优惠券类型 */
const couponTypeOptions = computed(() => getIntDictOptions(DICT_TYPE.COUPON_TYPE).filter((item) => item.value !== 4))

/* options */
// 套餐级联
const packageCascaderProps = ref({
  emitPath: false,
  multiple: true
})
const packageCascaderOptions = ref<any[]>([])

// 互斥优惠券组
const couponMutexGroupOptions = ref<any[]>([])

// 互斥失效优惠券组
const couponMutexGroupInvalidOptions = ref<any[]>([])

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  handleAllOptions()
  getInvalidGroupList(invalidGroupQueryParams.pageNo)
  getMutexGroupList(mutexGroupQueryParams.pageNo)
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await CouponApi.getCoupon(id)
      data.mutexGroup = data.mutexGroup === null ? [] : data.mutexGroup.map((item) => item.id)
      data.mutexInvalidGroup = data.mutexInvalidGroup === null ? [] : data.mutexInvalidGroup.map((item) => item.id)
      formData.value = data
      formData.value.fixedTime = [formData.value.effectiveTime, formData.value.noneffctiveTime]
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
  formData.value.effectiveTime = formData.value.fixedTime[0]
  formData.value.noneffctiveTime = formData.value.fixedTime[1]
  if (formData.value.packagesBindType === 0) {
    delete formData.value.packageIds
  } else if (formData.value.packagesBindType === 1) {
    delete formData.value.packageType
  }
  try {
    const data = formData.value as unknown as CouponVO
    if (formType.value === 'create') {
      await CouponApi.createCoupon(data)
      message.success(t('common.createSuccess'))
    } else {
      await CouponApi.updateCoupon(data)
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
    discount: undefined,
    validityType: undefined,
    expireDays: undefined,
    fixedTime: [],
    effectiveTime: undefined,
    noneffctiveTime: undefined,
    inventory: undefined,
    explain: undefined,
    couponType: undefined,
    packageType: [],
    enableStatus: 1,
    getatableStatus: 1,
    packagesBindType: 0,
    packageIds: [],
    isSingle: 0,
    mutexGroup: [],
    mutexInvalidGroup: []
  }
  formRef.value?.resetFields()
}

/* 处理所有 options */
const handleAllOptions = async () => {
  packageCascaderOptions.value = await getPackageCascaderOptions()
  couponMutexGroupOptions.value = await getCouponMutexGroupOptionsByType(CRM_COUPON_GROUP_TYPE.MUTEX)
  couponMutexGroupInvalidOptions.value = await getCouponMutexGroupOptionsByType(CRM_COUPON_GROUP_TYPE.MUTEX_INVALID)
}
/* 组合套餐级联options */
const getPackageCascaderOptions = async () => {
  // 一级级联options 套餐类型
  const packageType = getIntDictOptions(DICT_TYPE.PACKAGES_TYPE)
  // 初始化一级级联options结构
  packageType.forEach((item) => {
    item.children = []
  })
  // 二级级联options
  const packages = await getPackageOptions()

  // 组装树形结构
  const treeOptions = packageType.map((item) => {
    return {
      ...item,
      children: packages.filter((child) => child.type === item.value),
      disabled: packages.filter((child) => child.type === item.value).length === 0
    }
  })

  return treeOptions
}

/** 互斥/失效券组 */
/* 券组分页查询 */
const invalidGroupOptionsLoading = ref(false)
const mutexGroupOptionsLoading = ref(false)
let invalidGroupQueryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  groupName: undefined,
  groupType: 1 // 互斥失效
})
let mutexGroupQueryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  groupName: undefined,
  groupType: 0 // 互斥
})
/* 券组列表 */
const getInvalidGroupList = async (val) => {
  invalidGroupQueryParams.pageNo = val
  invalidGroupOptionsLoading.value = true
  try {
    const data = await CouponMutexGroupApi.getCouponMutexGroupPage(invalidGroupQueryParams)
    invalidGroupOptions.value.list = data.list
    invalidGroupOptions.value.total = data.total
  } finally {
    invalidGroupOptionsLoading.value = false
  }
}

const getMutexGroupList = async (val) => {
  mutexGroupQueryParams.pageNo = val
  mutexGroupOptionsLoading.value = true
  try {
    const data = await CouponMutexGroupApi.getCouponMutexGroupPage(mutexGroupQueryParams)
    mutexGroupOptions.value.list = data.list
    mutexGroupOptions.value.total = data.total
  } finally {
    mutexGroupOptionsLoading.value = false
  }
}
/* 券组 options */
const invalidGroupOptions = ref<{
  list: CouponMutexGroupVO[]
  total: number
}>({
  list: [],
  total: 0
})
const mutexGroupOptions = ref<{
  list: CouponMutexGroupVO[]
  total: number
}>({
  list: [],
  total: 0
})
/* 券组全选 */
const checkAll = (type: string) => {
  // 旧券组（去重） + 新券组
  if (type === "invalid") {
    formData.value.mutexInvalidGroup = [
      ...new Set([
        ...(formData.value.mutexInvalidGroup || []),
        ...invalidGroupOptions.value.list.map((item) => item.id)
      ])
    ]
  } else {
    formData.value.mutexGroup = [
      ...new Set([
        ...(formData.value.mutexGroup || []),
        ...mutexgroupOptions.value.list.map((item) => item.id)
      ])
    ]
  }
}

/* 券组清空 */
const clearAll = (type: string) => {
  if (type === "invalid") {
    formData.value.mutexInvalidGroup = []
  } else {
    formData.value.mutexGroup = []
  }
}

/* 优惠券当前按钮 */
const currentChecked = ref(false) // 选中状态
const currentOnChange = async (status: boolean, type: string) => {
  currentChecked.value = status
  if (status === true) {
    if (type === "invalid" && formData.value.mutexInvalidGroup.length) invalidGroupOptions.value.list = await CouponMutexGroupApi.getSimpleCouponMutexGroupListByGroupIds(formData.value.mutexInvalidGroup)
    else if (type === "mutex" && formData.value.mutexGroup.length) mutexGroupOptions.value.list = await CouponMutexGroupApi.getSimpleCouponMutexGroupListByGroupIds(formData.value.mutexGroup)
  } else {
    if (type === "invalid") invalidGroupOptions.value = await CouponMutexGroupApi.getCouponMutexGroupPage(invalidGroupQueryParams)
    else if (type === "mutex") mutexGroupOptions.value = await CouponMutexGroupApi.getCouponMutexGroupPage(mutexGroupQueryParams)
  }
}

/* 模糊搜索 */
const invalidGroupLoading = ref(false)
const mutexGroupLoading = ref(false)
const invalidGroupSearch = async () => {
  invalidGroupLoading.value = true
  try {
    invalidGroupOptions.value = await CouponMutexGroupApi.getCouponMutexGroupPage(invalidGroupQueryParams)
  } catch (e) {
    message.error('获取优惠券列表失败')
  } finally {
    invalidGroupLoading.value = false
  }
}
const mutextGroupSearch = async () => {
  mutexGroupLoading.value = true
  try {
    mutexGroupOptions.value = await CouponMutexGroupApi.getCouponMutexGroupPage(mutexGroupQueryParams)
  } catch (e) {
    message.error('获取优惠券列表失败')
  } finally {
    mutexGroupLoading.value = false
  }
}

/* 券组 options popover */
const getGroupOptionPop = (coupons) => {
  if (coupons !== undefined) {
    let resStr = ''
    coupons?.forEach((item, index) => {
      if (index !== coupons.length - 1) resStr += `${item.name}， `
      else resStr += `${item.name}`
    })
    return resStr
  }
}

onBeforeMount(() => {
  watch(() => formData.value.validityType, (newValue) => {
    formRules.expireDays = newValue === 1 ? [{ required: true, message: '有效天数不能为空', trigger: 'change' }] : []
    formRules.fixedTime = newValue === 2 ? [{ required: true, message: '有效日期不能为空', trigger: 'change' }] : []
  })
})
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>