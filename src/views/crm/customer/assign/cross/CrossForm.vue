<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" v-loading="formLoading">
      <el-form-item label="分配规则" prop="ployId">
        <el-select v-model="formData.ployId" placeholder="请选择分配规则" clearable filterable>
          <el-option v-for="option in queryOptions.ploy.list" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="顾问" prop="userId">
        <el-select v-model="formData.userId" placeholder="请检索后选择顾问" clearable filterable remote
          :loading="queryOptions.user.loading" :remote-method="queryOptions.user.handleSearch">
          <el-option v-for="option in queryOptions.user.options" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select v-model="formData.deptId" placeholder="请选择部门" filterable clearable
          :data="queryOptions.dept.list" :props="defaultProps" check-strictly show-checkbox default-expand-all
          node-key="id">
          <template #default="{ node, data }">
            <div class="custom-tree-node flex items-center gap-1">
              <el-tag v-show="data.status === 1" type="info" size="small">无效</el-tag>
              <span>{{ node.label }}</span>
            </div>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item label="分配日期" prop="assignTime">
        <el-date-picker v-model="formData.assignTime" type="date" value-format="YYYY-MM-DD" placeholder="选择分配日期"
          class="!w-100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getListOwnerAssignPloyOptions, handleRemoteUserOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import { useRemoteSearch } from '@/hooks/web/useRemoteSearch'
import { ListOwnerAssignPloyMentorCrossApi, ListOwnerAssignPloyMentorCrossVO } from '@/api/crm/customer/assign/cross'
import * as DeptApi from '@/api/system/dept'

/** 人员范围 表单 */
defineOptions({ name: 'AssignCrossForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

/* 表单数据 */
const formData = ref({
  id: undefined,
  ployId: undefined,
  userId: undefined,
  deptId: undefined,
  assignTime: undefined
})

/* 表单校验规则 */
const formRules = reactive({
  ployId: [{ required: true, message: '分配规则不能为空', trigger: 'change' }],
  userId: [{ required: true, message: '顾问不能为空', trigger: 'change' }],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'change' }],
  assignTime: [{ required: true, message: '分配日期不能为空', trigger: 'blur' }]
})

/* 选项列表 */
const queryOptions = reactive({
  user: useRemoteSearch(handleRemoteUserOptions),
  dept: {
    list: ref<Tree[]>([]),
    async load() {
      this.list = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
    }
  },
  ploy: {
    list: ref([]),
    async load() {
      this.list = await getListOwnerAssignPloyOptions()
    }
  },
  async init() {
    await this.dept.load()
    await this.ploy.load()
  }
})

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await queryOptions.init()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ListOwnerAssignPloyMentorCrossApi.getListOwnerAssignPloyMentorCross(id)
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
    const data = formData.value as unknown as ListOwnerAssignPloyMentorCrossVO
    if (formType.value === 'create') {
      await ListOwnerAssignPloyMentorCrossApi.createListOwnerAssignPloyMentorCross(data)
      message.success(t('common.createSuccess'))
    } else {
      await ListOwnerAssignPloyMentorCrossApi.updateListOwnerAssignPloyMentorCross(data)
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
    ployId: undefined,
    userId: undefined,
    deptId: undefined,
    assignTime: undefined
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