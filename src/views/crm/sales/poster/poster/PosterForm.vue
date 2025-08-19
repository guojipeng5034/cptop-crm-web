<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="860">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="85" v-loading="formLoading">
      <el-row>
        <el-col :span="8">
          <el-form-item label="活动" prop="activityId" label-width="65">
            <el-select v-model="formData.activityId" placeholder="请选择活动">
              <el-option v-for="dict in activityManageOptions" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动代码" prop="activityCode">
            <el-input v-model="formData.activityCode" placeholder="微信公众号专用" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内容类型" prop="wechatContentType">
            <el-select v-model="formData.wechatContentType" placeholder="请选择内容类型">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CONTENT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文案" prop="scriptContent" label-width="65">
            <el-input type="textarea" v-model="formData.scriptContent" placeholder="用于顾问提取海报时的专属话术" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="relative">
        <el-segmented v-model="selectType" :options="settingType" block size="large" class="mb-6" />
        <div class="cursor-pointer" @click="toggleTriangle">
          <div class="isDefault" :class="{ 'default-clicked': formData.textDisplayFlag }"></div>
          <Icon :icon="formData.textDisplayFlag ? 'fluent-emoji-flat:star' : 'fluent-emoji-high-contrast:star'"
            class="default-icon" />
        </div>
      </div>
      <div v-show="selectType === 1">
        <el-row>
          <el-col :span="17">
            <el-row>
              <el-col :span="12">
                <el-form-item label="海报类型" prop="posterType">
                  <el-select v-model="formData.posterType" placeholder="请选择海报类型">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POSTER_TYPE)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="海报背景" prop="posterImg">
                  <form-create v-model="poster" :rule="posterRule" :option="posterOption" :limit="100" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7">
            <el-image style="width: 100%; height: 200px" :src="srcList[0]" :preview-src-list="srcList" :zoom-rate="1.2"
              :max-scale="7" :min-scale="0.2" :initial-index="0" fit="scale-down" v-loading="previewLoading">
              <template #error>
                <div class="error-slot">
                  <el-icon :size="60">
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="text-center mt-1 text-blueGray">预览图内容仅供参考</div>
          </el-col>
        </el-row>
      </div>
      <div v-show="selectType === 2">
        <el-table :data="qrList" border>
          <el-table-column label="注册链接" align="center" prop="pageLinkId" width="200">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-select v-model="scope.row.pageLinkId" placeholder="">
                  <el-option v-for="dict in registerUrlOptions" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </template>
              <span v-else>{{ getLabelByValue(scope.row.pageLinkId, registerUrlOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="X" align="center" prop="qrCodeXCoordinate">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.qrCodeXCoordinate" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.qrCodeXCoordinate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Y" align="center" prop="qrCodeYCoordinate">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.qrCodeYCoordinate" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.qrCodeYCoordinate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="宽度" align="center" prop="qrCodeWidth">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.qrCodeWidth" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.qrCodeWidth }}</span>
            </template>
          </el-table-column>
          <el-table-column label="高度" align="center" prop="qrCodeLength">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.qrCodeLength" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.qrCodeLength }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button v-if="scope.row.edit" type="success" size="small" :icon="Check"
                @click="scope.row.edit = !scope.row.edit" />
              <el-button v-else type="primary" size="small" :icon="Edit" @click="scope.row.edit = !scope.row.edit" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="selectType === 3">
        <el-table :data="textList" border>
          <el-table-column label="编号" align="center" prop="id" width="70" />
          <el-table-column label="X" align="center" prop="textXCoordinate" width="115">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.textXCoordinate" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.textXCoordinate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Y" align="center" prop="textYCoordinate" width="115">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.textYCoordinate" v-only-numbers>
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.textYCoordinate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字体" align="center" prop="textFont" width="170">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-select v-model="scope.row.textFont" placeholder="">
                  <el-option v-for="dict in fontsOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </template>
              <span v-else>{{ scope.row.textFont }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小" align="center" prop="textSize" width="115">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.number.trim="scope.row.textSize">
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.textSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="颜色" align="center" prop="textColor" width="90">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-color-picker v-model="scope.row.textColor" />
              </template>
              <span v-else>{{ scope.row.textColor }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button v-if="scope.row.edit" type="success" size="small" :icon="Check"
                @click="scope.row.edit = !scope.row.edit" />
              <el-button v-else type="primary" size="small" :icon="Edit" @click="scope.row.edit = !scope.row.edit" />
              <el-button type="danger" size="small" :icon="Delete" @click.prevent="deleteRow(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-2 text-center w-100%">
          <el-button :icon="Plus" size="small" circle @click="onAddItem" />
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button :disabled="previewLoading" @click="preview" color="#00cb73" style="color: #fff;"
        class="float-left">生成预览图</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getLabelByLink, getActivityManageOptions, getRegisterLinkOptions, getFontsOptions, getLabelByValue } from '@/utils/dict'
import { PosterApi, PosterVO } from '@/api/crm/sales/poster/poster'
import { Edit, Check, Delete, Plus, Picture } from '@element-plus/icons-vue'

/** 海报设置 表单 */
defineOptions({ name: 'PosterForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

/* option */
const activityManageOptions = ref()
const fontsOptions = ref()
const registerUrlOptions = ref()

/* 二维码 */
interface qrItem {
  edit?: boolean
  pageLinkId: number | undefined
  qrCodeXCoordinate?: number
  qrCodeYCoordinate?: number
  qrCodeWidth?: number
  qrCodeLength?: number
}
const qrList = ref<qrItem[]>([
  {
    edit: true,
    pageLinkId: undefined,
    qrCodeXCoordinate: 571,
    qrCodeYCoordinate: 1170,
    qrCodeWidth: 140,
    qrCodeLength: 140,
  }
])

/* 文案 */
interface textItem {
  id: number
  edit: boolean
  textXCoordinate?: number
  textYCoordinate?: number
  textFont?: string
  textSize?: number
  textColor?: string
}
const textList = ref<textItem[]>([
  {
    id: 1,
    edit: true,
    textXCoordinate: undefined,
    textYCoordinate: undefined,
    textFont: undefined,
    textSize: undefined,
    textColor: undefined,
  }
])

/* 海报图 */
const poster = ref()
const posterRule = ref([
  {
    "type": "UploadImgs",
    "field": "poster",
    "props": {
      "fileSize": 1,
      "fileType": ["image/jpeg", "image/jpg", "image/png"],
      "width": "140px",
      "height": "140px",
      "disabled": false,
      "showBtnText": false,
      "drag": true,
      "compress": false,
      "path": 'poster/'
    },
    "hidden": false,
    "display": true
  }]
)
const posterOption = ref({
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
  id: undefined,
  activityId: undefined,
  activityCode: undefined,
  pageLinkId: undefined,
  qrCodeXCoordinate: undefined,
  qrCodeYCoordinate: undefined,
  posterType: 1,
  posterImg: [],
  wechatContentType: 2,
  qrCodeWidth: undefined,
  qrCodeLength: undefined,
  textDisplayFlag: false,
  textXCoordinate: [],
  textYCoordinate: [],
  textFont: [],
  textSize: [],
  textColor: [],
  scriptContent: undefined,
})

/* 表单校验规则 */
const formRules = reactive({
  activityId: [{ required: true, message: '活动不能为空', trigger: 'change' }],
  wechatContentType: [{ required: true, message: '海报类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/* 分段控制器展示 */
const settingType = ref([
  { value: 1, label: "海报" },
  { value: 2, label: "二维码" },
  { value: 3, label: "文字", disabled: !formData.value.textDisplayFlag },
])
const selectType = ref(1)
const toggleTriangle = async () => {
  if (formData.value.textDisplayFlag === false) {
    formData.value.textDisplayFlag = true
    selectType.value = 3
  } else {
    try {
      // 二次确认
      await message.confirm(`确认关闭文字吗?`)
      // 发起修改状态
      formData.value.textDisplayFlag = false
      selectType.value = 1
      textList.value = []
      formData.value = {
        ...formData.value,
        textXCoordinate: [],
        textYCoordinate: [],
        textFont: [],
        textSize: [],
        textColor: []
      }
    } catch {
      // 取消后，进行恢复
      formData.value.textDisplayFlag = true
    }
  }
}

// textDisplayFlag 与 settingType.value[2].disabled 双向绑定（相反）
watch(() => formData.value.textDisplayFlag, (newVal) => {
  settingType.value.find(item => item.value === 3)!.disabled = !newVal
})

/* 文案新增 */
const onAddItem = () => {
  textList.value.forEach(item => item.edit = false)
  textList.value.push({
    id: textList.value.length + 1,
    edit: true,
    textXCoordinate: undefined,
    textYCoordinate: undefined,
    textFont: undefined,
    textSize: undefined,
    textColor: undefined,
  })
}

/* 文案删除 */
const deleteRow = (index: number) => {
  textList.value.splice(index, 1)
  // 删除后重新更新id
  textList.value.forEach((item, idx) => {
    item.id = idx + 1
  })
}

/** 打开弹窗 */
const open = async (type: string, id?: number, activityId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  formLoading.value = true
  try {
    activityManageOptions.value = await getActivityManageOptions()
    registerUrlOptions.value = await getRegisterLinkOptions()
    fontsOptions.value = await getFontsOptions()
  } finally {
    formLoading.value = false
  }
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PosterApi.getPosterSetting(id)
      if (formData.value.posterImg) poster.value = { poster: formData.value.posterImg }
      const qrInfo = qrList.value[0]
      qrInfo.pageLinkId = formData.value.pageLinkId
      qrInfo.qrCodeXCoordinate = formData.value.qrCodeXCoordinate
      qrInfo.qrCodeYCoordinate = formData.value.qrCodeYCoordinate
      qrInfo.qrCodeWidth = formData.value.qrCodeWidth
      qrInfo.qrCodeLength = formData.value.qrCodeLength
      if (formData.value.textDisplayFlag) {
        textList.value = []
        for (let i = 1; i <= formData.value.textSize.length; i++) {
          textList.value.push({
            id: textList.value.length + 1,
            edit: true,
            textXCoordinate: undefined,
            textYCoordinate: undefined,
            textFont: undefined,
            textSize: undefined,
            textColor: undefined,
          })
        }
      }
      textList.value.forEach((item, index) => {
        item.textXCoordinate = formData.value.textXCoordinate[index]
        item.textYCoordinate = formData.value.textYCoordinate[index]
        item.textFont = formData.value.textFont[index]
        item.textSize = formData.value.textSize[index]
        item.textColor = formData.value.textColor[index]
      })
    } finally {
      formLoading.value = false
    }
  }
  if (activityId) {
    formData.value.activityId = activityId
  }
}

/* 表单校验 */
const validateForm = async () => {
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

/* 二维码校验 */
const validateQRCode = () => {
  const qrInfo = qrList.value[0]
  if (!qrInfo.pageLinkId ||
    qrInfo.qrCodeXCoordinate === undefined ||
    qrInfo.qrCodeYCoordinate === undefined ||
    qrInfo.qrCodeWidth === undefined ||
    qrInfo.qrCodeLength === undefined
  ) {
    message.error('请补全二维码信息')
    selectType.value = 2
    return false
  }
  formData.value = {
    ...formData.value,
    pageLinkId: qrInfo.pageLinkId,
    qrCodeXCoordinate: qrInfo.qrCodeXCoordinate,
    qrCodeYCoordinate: qrInfo.qrCodeYCoordinate,
    qrCodeWidth: qrInfo.qrCodeWidth,
    qrCodeLength: qrInfo.qrCodeLength
  }
  return true
}

/* 文字信息校验 */
const validateTextInfo = () => {
  if (!formData.value.textDisplayFlag) return true
  const incompleteTextItem = textList.value.some(item =>
    item.textXCoordinate === undefined ||
    item.textYCoordinate === undefined ||
    !item.textFont ||
    !item.textSize ||
    !item.textColor
  )
  if (incompleteTextItem) {
    message.error('请补全文字信息')
    selectType.value = 3
    return false
  }
  formData.value.textXCoordinate = textList.value.map(item => item.textXCoordinate)
  formData.value.textYCoordinate = textList.value.map(item => item.textYCoordinate)
  formData.value.textFont = textList.value.map(item => item.textFont)
  formData.value.textSize = textList.value.map(item => item.textSize)
  formData.value.textColor = textList.value.map(item => item.textColor)
  return true
}

/* 海报信息校验 */
const validatePoster = () => {
  if (!poster.value || poster.value.poster.length === 0) {
    message.error('请补全海报信息')
    selectType.value = 1
    return false
  }
  formData.value.posterImg = poster.value.poster
  return true
}

/* 预览 */
const srcList = ref([])
const previewLoading = ref(false)
const preview = async () => {
  // 校验
  if (!(await validateForm())) return
  if (!validateQRCode()) return
  if (!validateTextInfo()) return
  if (!validatePoster()) return
  // 自动跳转海报页
  selectType.value = 1
  // 生成预览图
  previewLoading.value = true
  try {
    const data = formData.value as unknown as PosterVO
    const res = await PosterApi.getPreviewPoster(data)
    srcList.value = res.map(item => item.posterUrl)
    message.success('预览图已生成')
  } catch {
    message.error('预览图生成失败，请重试')
  } finally {
    previewLoading.value = false
  }
}

/* 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验
  if (!(await validateForm())) return
  if (!validateQRCode()) return
  if (!validateTextInfo()) return
  if (!validatePoster()) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PosterVO
    if (formType.value === 'create') {
      await PosterApi.createPosterSetting(data)
      message.success(t('common.createSuccess'))
    } else {
      await PosterApi.updatePosterSetting(data)
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
    activityId: undefined,
    activityCode: undefined,
    pageLinkId: undefined,
    qrCodeXCoordinate: undefined,
    qrCodeYCoordinate: undefined,
    posterImg: [],
    posterType: 1,
    wechatContentType: 2,
    qrCodeLength: undefined,
    qrCodeWidth: undefined,
    textDisplayFlag: false,
    textXCoordinate: [],
    textYCoordinate: [],
    textFont: [],
    textSize: [],
    textColor: [],
    scriptContent: undefined,
  }
  formRef.value?.resetFields()
  selectType.value = 1
  settingType.value.find(item => item.value === 3)!.disabled = true
  if (poster.value) {
    poster.value.poster = []
  }
  qrList.value = [
    {
      edit: true,
      pageLinkId: undefined,
      qrCodeXCoordinate: 571,
      qrCodeYCoordinate: 1170,
      qrCodeWidth: 140,
      qrCodeLength: 140,
    }
  ]
  textList.value = [
    {
      id: 1,
      edit: true,
      textXCoordinate: undefined,
      textYCoordinate: undefined,
      textFont: undefined,
      textSize: undefined,
      textColor: undefined,
    }
  ]
  srcList.value = []
  previewLoading.value = false
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

:deep(.el-input-group__append) {
  padding-inline: 8px;
}

.isDefault {
  width: 25px;
  height: 25px;
  background-color: transparent;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0px 0px 0 25px;
}

.default-clicked {
  background-color: transparent;
}

.default-icon {
  position: absolute;
  top: 2px;
  right: 1px;
}

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.error-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}
</style>