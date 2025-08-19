<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading"
      :validate-on-rule-change="false">
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动状态" prop="activityStatus">
            <el-select v-model="formData.activityStatus" placeholder="请选择活动状态">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS).filter(item => item.value !== 1)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="商品折扣" prop="discount" v-if="formData.activityStatus === 0">
            <div class="flex items-center">
              <el-input-number v-model="formData.discount" :min="1" :max="10" :step="0.5" step-strictly
                placeholder="1~10" />
              <span class="ml-4">折</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="折扣时间" prop="activityTime" v-if="formData.activityStatus === 0">
            <el-date-picker v-model="formData.activityTime" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学员限制" prop="studentLimit">
            <template #label>
              <span class="studentLimit">
                学员限制
                <el-tooltip class="box-item" effect="dark" content="设置完成统一调整所选商品的学员限制条件" placement="top-start">
                  <el-icon class="questionFilled">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-switch v-model="formData.studentLimit" @change="changeStudentLimit" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="studentLimitStatus" v-if="formData.studentLimit">
            <el-radio-group v-model="formData.studentLimitStatus" @change="changeStudentLimitStatus">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.STUDENT_LIMIT_TYPE)" :key="dict.value"
                :value="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="活动" prop="activityIds" v-if="formData.studentLimit && formData.studentLimitStatus === 5">
            <MultiSelect v-model="formData.activityIds" :api-fn="ActivityManageApi.getSimpleSelectPage"
              label-field="activityNameInternal" value-field="id" placeholder="请选择活动"
              search-placeholder="请输入活动名（联想输入）" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { PointsCommodityApi, pointsCommodityBacthUpdateReqVO } from '@/api/crm/sales/pointsCommodity/commodity'
import { ActivityManageApi } from '@/api/crm/activity/activityManage'
import { QuestionFilled } from '@element-plus/icons-vue'

/** 批量设置 表单 */
defineOptions({ name: 'SettingForm' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('批量设置') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/* 表单数据 */
const formData = ref({
  ids: [],
  activityStatus: 0, // 活动状态
  discount: undefined, // 商品折扣
  activityTime: [], // 折扣时间
  activityStartTime: '', // 活动开始时间
  activityEndTime: '', // 活动结束时间
  studentLimit: false, // 学员限制
  studentLimitStatus: undefined, // 学员限制
  activityIds: [], // 参与活动ID
  remark: undefined, // 备注
})

/* 表单校验规则 */
const formRules = reactive({
  activityStatus: [{ required: true, message: '活动状态不能为空', trigger: 'change' }],
  discount: [{ required: true, message: '商品折扣不能为空', trigger: 'change' }],
  activityTime: [{ required: true, message: '折扣时间不能为空', trigger: 'change' }],
  studentLimitStatus: [{}],
  activityIds: [{}],
})
const formRef = ref() // 表单 Ref

const changeStudentLimit = (val) => {
  if (val) {
    formRules.studentLimitStatus = [{ required: true, message: '对应学员不能为空', trigger: 'change' }]
  } else {
    formData.value.studentLimitStatus = undefined
  }
}

const changeStudentLimitStatus = (val) => {
  if (val === 5) {
    formRules.activityIds = [{ required: true, message: '活动不能为空', trigger: 'change' }]
  } else {
    formData.value.activityIds = []
  }
}

/** 打开弹窗 */
const open = async (ids: number[]) => {
  dialogVisible.value = true
  resetForm(ids)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success', 'cancelSelection']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  if (formData.value.activityTime.length !== 0) {
    formData.value.activityStartTime = formData.value.activityTime[0].getTime()
    formData.value.activityEndTime = formData.value.activityTime[1].getTime()
  }
  try {
    const data = formData.value as unknown as pointsCommodityBacthUpdateReqVO
    await PointsCommodityApi.batchUpdatePointsCommodity(data)
    message.success('批量设置成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    // 发送取消选择
    emit('cancelSelection')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = (ids) => {
  formData.value = {
    ids: ids,
    activityStatus: 0,
    discount: undefined,
    activityTime: [],
    activityStartTime: '',
    activityEndTime: '',
    studentLimit: false,
    studentLimitStatus: undefined,
    remark: undefined,
    activityIds: [],
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

.studentLimit {
  position: relative;

  .questionFilled {
    position: absolute;
    top: -2px;
  }
}
</style>