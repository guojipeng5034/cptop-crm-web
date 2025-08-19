<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110" v-loading="formLoading">
      <div class="open-form" v-if="formType === 'open'">
        <el-form-item label="开课方式" prop="openLessonTimeStatus">
          <el-radio-group v-model="formData.openLessonTimeStatus">
            <el-radio :value="1">立即开课</el-radio>
            <el-radio :value="6">预约开课</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约开课时间" prop="putOffTime" v-if="formData.openLessonTimeStatus === 6">
          <el-date-picker v-model="formData.putOffTime" type="date" value-format="YYYY-MM-DD" placeholder="选择预约开课时间"
            :disabled-date="disabledBeforeDateAndToday" />
        </el-form-item>
      </div>

      <div class="close-form" v-if="formType === 'close'">
        <el-form-item label="停课类型" prop="stopLessonType">
          <el-select v-model="formData.stopLessonType" placeholder="请选择或检索停课类型" clearable filterable>
            <el-option v-for="dict in stopLessonTypeOptions" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="停课方式" prop="closeLessonTimeStatus">
          <el-radio-group v-model="formData.closeLessonTimeStatus">
            <el-radio :value="2">立即停课</el-radio>
            <el-radio :value="7">预约停课</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约停课时间" prop="putOffTime" v-if="formData.closeLessonTimeStatus === 7">
          <el-date-picker v-model="formData.putOffTime" type="date" value-format="YYYY-MM-DD" placeholder="选择预约停课时间"
            :disabled-date="disabledBeforeDateAndToday" class="!w-100%" />
        </el-form-item>
        <el-form-item label="预约时长(月)" prop="stopMonth" v-if="formData.closeLessonTimeStatus === 7">
          <el-input-number v-limit-input v-model="formData.stopMonth" placeholder="请输入预约时长(月)" :step="1" step-strictly
            :min="1" :max="6" class="!w-100%" />
        </el-form-item>
      </div>

      <div class="close-form" v-if="formType === 'postpone'">
        <div class="flex justify-center items-center mb-10px">学员已设置停课
          <span class="color-red-5 fw-bold">
            {{ stopMonth }}
          </span>
          个月，计划于<span class="color-red-5 fw-bold">{{ planOpenDate }}</span>开课。
        </div>
        <div class="flex justify-center items-center mb-10px"><span>请填写本次延期月数。</span></div>
        <el-form-item label="延期时长(月)" prop="delayNum">
          <el-input-number v-limit-input v-model="formData.delayNum" placeholder="请输入延期时长(月)" :step="1" step-strictly
            :min="1" :max="6" class="!w-100%" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { getUserRoleCategory } from '@/utils/permission'
import { formatDate, disabledBeforeDateAndToday } from '@/utils/formatTime'
import { CustomerPackageApi, CustomerPackageVO } from '@/api/crm/package/customerPackage'
import { StopLogApi, StopLogVO } from '@/api/crm/package/stopLog'

/** 学员套餐管理课程操作表单 */
defineOptions({ name: 'LessonOperateForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：open-开课; close-停课

/* 表单数据 */
const formData = ref({
  id: undefined,
  customerId: undefined,
  packageId: undefined,
  lessonStatus: undefined,
  // 开课
  openLessonTimeStatus: 1,
  // 停课
  stopLessonType: undefined,
  closeLessonTimeStatus: 2,
  stopMonth: undefined,
  putOffTime: undefined,   // 预约开课/停课时间
  // 延期
  delayNum: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  startLessonTime: [{ required: true, message: '预约开课时间为必选项', trigger: 'blur' }],
  stopLessonType: [{ required: true, message: '停课类型为必选项', trigger: 'change' }],
  closeLessonTimeStatus: [{ required: true, message: '停课方式为必选项', trigger: 'change' }],
  stopMonth: [{ required: true, message: '预约时长必填项', trigger: 'blur' }],
  delayNum: [{ required: true, message: '延期时长必填项', trigger: 'blur' }],
  putOffTime: [{ required: true, message: '预约时间为必选项', trigger: 'change' }],
  changePackageId: [{ required: true, message: '切换的套餐为必选项', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/* 弹窗标题处理 */
const handleDialogTitle = (operateType: string) => {
  if (operateType === 'open') {
    return '开课设置'
  } else if (operateType === 'close') {
    return '停课设置'
  } else if (operateType === 'postpone') {
    return '停课延期设置(单位:月)'
  }
}

/* 延期操作：获取当前学员当前套餐停课信息 */
const stopMonth = ref(0) // 延期弹窗：已设置听课月数
const planOpenDate = ref('') // 延期弹窗：停课结束后的计划开课日期
const getStopLog = async (customerId: number) => {
  try {
    const stopLogRes = await StopLogApi.getStopLogRecord(customerId)
    stopMonth.value = stopLogRes.stopMonthCount
    planOpenDate.value = formatDate(stopLogRes.planOpenLessonTime, "YYYY-MM-DD")
  } catch (e) {
    console.log("getStopLog", e)
  }
}

/* options */
// stopLessonType
const masterValues = [1, 2, 3] // 主人值
const slaveValues = [1, 2] // 奴隶值
const stopLessonTypeOptions = computed(() => {
  const oriData = getIntDictOptions(DICT_TYPE.STOP_LESSON_TYPE)
  let roleOptions: Array<any> = []
  // 根据 权限标识 筛选出对应的操作类型
  let roleCategory = getUserRoleCategory(2) // 角色大类
  if (roleCategory === '奴隶') {
    roleOptions = oriData.filter(item => slaveValues.includes(item.value))
  } else {
    roleOptions = oriData.filter(item => masterValues.includes(item.value))
  }
  return roleOptions
})

/** 打开弹窗 */
const open = async (type: string, row) => {
  dialogVisible.value = true
  dialogTitle.value = handleDialogTitle(type)
  formType.value = type
  // 延期操作
  if (type === 'postpone') await getStopLog(row.customerId)
  resetForm()
  formData.value = Object.assign(formData.value, row)
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
    const data = { ...formData.value }
    const basicParams = {
      id: data.id,
      customerId: data.customerId,
      packageId: data.packageId,
      lessonStatus: data.lessonStatus
    }
    if (formType.value === 'open') {
      // 提交前逻辑
      if (data.openLessonTimeStatus === 1) {
        await message.confirm(`确定为该学员开课吗？`)
        await CustomerPackageApi.openLesson(basicParams)
        message.alertSuccess(`已为该学员开课成功。`)
      } else if (data.openLessonTimeStatus === 6) {
        const reservedOpenTime = formatDate(data.putOffTime, 'YYYY-MM-DD')
        const params = { putOffTime: data.putOffTime, ...basicParams }
        await CustomerPackageApi.scheduleOpenLesson(params)
        message.alertSuccess(`预约开课成功，学员将于${reservedOpenTime}自动开课。`)
      }
    } else if (formType.value === 'close') {
      if (data.closeLessonTimeStatus === 2) {
        const params = { stopLessonType: data.stopLessonType, ...basicParams }
        await message.confirm(`确定为该学员停课吗？`)
        await CustomerPackageApi.stopLesson(params)
        message.alertSuccess(`已为该学员停课成功。`)
      } else if (data.closeLessonTimeStatus === 7) {
        const params = { stopLessonType: data.stopLessonType, putOffTime: data.putOffTime, stopMonth: data.stopMonth, ...basicParams }
        const reservedCloseTime = formatDate(data.putOffTime, 'YYYY-MM-DD')
        await CustomerPackageApi.scheduleStopLesson(params)
        message.alertSuccess(`预约停课成功，学员将于${reservedCloseTime}自动停课。`)
      }
    } else if (formType.value === 'postpone') {
      const params = { delayNum: data.delayNum, ...basicParams }
      await message.confirm(`确定为该学员延期吗？`)
      await CustomerPackageApi.delayLesson(params)
      message.alertSuccess(`已为该学员延期成功。`)
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
    customerId: undefined,
    packageId: undefined,
    lessonStatus: undefined,

    // 开课
    openLessonTimeStatus: 1,

    // 停课
    stopLessonType: undefined,
    closeLessonTimeStatus: 2,
    stopMonth: undefined,
    // 预约开课/停课时间
    putOffTime: undefined,

    // 延期
    delayNum: undefined,
  }
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
</style>