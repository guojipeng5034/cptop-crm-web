<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="80">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门分类" prop="belongId">
            <el-select :disabled="isDisabled" v-model="formData.belongId" placeholder="请选择部门分类" clearable
              @change="handleChange">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYS_PRESET_DEPT)" :key="dict.value"
                :label="dict.label" :value="dict.value" v-show="dict.cssClass != 'noshow'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parentId" v-if="formData.belongId">
            <el-tree-select v-model="formData.parentId" :data="deptTree" :props="defaultProps" check-strictly
              default-expand-all filterable clearable placeholder="请选择上级部门" value-key="id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称" prop="name">
            <el-input :maxlength="20" v-model="formData.name" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leaderUserId">
            <!-- <el-select  v-model="formData.leaderUserId" filterable clearable :loading="userOptionsLoading"
               placeholder="请选择销售负责人">
              <el-option v-for="dict in userList" :key="dict.id" :label="dict.nickname" :value="dict.id" />
            </el-select> -->
            <el-select v-model="formData.leaderUserId" filterable clearable remote :loading="userOptionsLoading"
              :remote-method="formData.belongId ? fetchRemoteUserOptions : fetchRemoteUserOptionsAll" placeholder="请选择负责人">
              <el-option v-for="dict in userOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示排序" prop="sort">
            <el-input-number :precision="0" v-model="formData.sort" :min="1" :max="9999" :controls="false"
              @keydown="handleKeyDown" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone" maxlength="11" placeholder="请输入联系电话" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" maxlength="50" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公地" :prop="formData.belongId == 50 ? 'campusId' : ''">
            <!-- <el-select v-model="formData.campusId" clearable placeholder="请选择办公地">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_CAMPUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select> -->
            <el-select v-model="formData.campusId" placeholder="请选择办公地" clearable filterable class="!w-240px">
              <el-option v-for="dict in OfficePlaceList" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" clearable placeholder="请选择状态">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions, handleRemoteUserOptions1 } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { CommonStatusEnum } from '@/utils/constants'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemDeptForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const isDisabled = ref(false)
const leId = ref()

/* user */
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query, belongId) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions1(query, belongId, setUserOptions, setUserLoading)
}
const fetchRemoteUserOptionsAll = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}
/* 表单数据 */
const formData = ref({
  id: undefined,
  title: '',
  parentId: undefined,
  name: undefined,
  sort: undefined,
  leaderUserId: undefined,
  phone: undefined,
  email: undefined,
  campusId: undefined,
  belongId: undefined,
  status: CommonStatusEnum.ENABLE,
  isClearleaderUserId: false,
})

/* 表单校验规则 */
const formRules = reactive<FormRules>({
  parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
  belongId: [{ required: true, message: '请选择部门分类', trigger: 'change' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  phone: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  campusId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const deptTree = ref() // 树形结构
const userList = ref<UserApi.UserVO[]>([]) // 用户列表
const OfficePlaceList = ref<OfficePlaceApi.OfficePlaceVO[]>([]) // 办公地列表


/** 打开弹窗 */
const open = async (type: string, id?: number, leaderUserName?: string, leaderUserId?: any) => {
  OfficePlaceList.value = await OfficePlaceApi.OfficePlaceApi.getOfficePlaceList()
  dialogVisible.value = true
  isDisabled.value = false
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DeptApi.getDept(id)
      // leId.value = leaderUserId
      // formData.value.leaderUserId = leaderUserName
      let arr = []
      arr.push(formData.value.belongId)
      localStorage.setItem('belongId', JSON.stringify(arr))
      fetchRemoteUserOptions(leaderUserName, arr)
      isDisabled.value = true
      await getTree()
    } finally {
      formLoading.value = false
    }
  } else {
    localStorage.removeItem('belongId')
  }
  // 获得用户列表
  // userList.value = await UserApi.getSimpleUserList()
  // 获得部门树
  // await getTree()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const handleKeyDown = (e: KeyboardEvent) => {
  if (['+', '-'].includes(e.key)) {
    e.preventDefault() // 阻止默认输入行为
    // cleanSymbol()     // 执行清理操作
  }
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    if (formData.value.leaderUserId) {
      formData.value.isClearleaderUserId = false
    } else {
      formData.value.isClearleaderUserId = true
    }
    // if(leId.value) {
    //   formData.value.leaderUserId = leId.value
    // }
    const data = formData.value as unknown as DeptApi.DeptVO
    if (formType.value === 'create') {
      await DeptApi.createDept(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeptApi.updateDept(data)
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
    title: '',
    parentId: undefined,
    name: undefined,
    sort: undefined,
    leaderUserId: undefined,
    phone: undefined,
    email: undefined,
    campusId: undefined,
    status: CommonStatusEnum.ENABLE
  }
  formRef.value?.resetFields()
  userOptions.value = []
}

/** 获得部门树 */
const getTree = async () => {
  deptTree.value = []
  let data = await DeptApi.getSimpleDeptList()
  // data = data.filter(item => item.belongId == formData.value.belongId)
  // let dept: Tree = { id: 0, name: '顶级部门', children: [] }
  // dept.children = handleTree(data)
  // deptTree.value.push(dept)
  let datas = data.filter(item => item.belongId == formData.value.belongId)

  let parentDepts = data.filter(item => item.id === formData.value.parentId)
  let parentDept = parentDepts.length > 0 ? parentDepts[0] : { belongId: 0 }
  let parentBelongId = parentDept.belongId
  console.log(parentBelongId)

  if (parentBelongId != formData.value.belongId) {
    let dept: Tree = { id: parentDept.id, name: parentDept.name, children: datas }
    dept.children = handleTree(datas)
    deptTree.value.push(dept)
    console.log(deptTree.value)
  } else {
    deptTree.value.push(handleTree(datas)[0])
  }

}
const handleChange = async (val) => {
  formData.value.parentId = undefined
  formData.value.leaderUserId = undefined
  deptTree.value = []
  let arr = []
  arr.push(val)
  localStorage.setItem('belongId', JSON.stringify(arr))
  let data = await DeptApi.getSimpleDeptList()
  data = data.filter(item => item.belongId == val)
  deptTree.value.push(handleTree(data)[0])
}

</script>
