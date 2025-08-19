<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900">
    <el-form ref="activityManageFormRef" :model="activityManageFormData" :rules="activityManageFormRules"
      label-width="110" v-loading="activityManageFormLoading" v-show="active === 1" :validate-on-rule-change="false">
      <el-row class="m-block-4">
        <el-col :span="12">
          <el-form-item label="活动名称" prop="activityNameVisible">
            <template #label>
              <div class="flex flex-col justify-center items-center">
                <span>活动名称</span>
                <span>（外部）</span>
              </div>
            </template>
            <el-input v-model="activityManageFormData.activityNameVisible" placeholder="请输入活动名称（外部）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="activityNameInternal">
            <template #label>
              <div class="flex flex-col justify-center items-center">
                <span>活动名称</span>
                <span>（内部）</span>
              </div>
            </template>
            <el-input v-model="activityManageFormData.activityNameInternal" placeholder="请输入活动名称（内部）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="有效时间" prop="activityTime">
            <el-date-picker v-model="activityManageFormData.activityTime" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledBeforeDate"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="适用站点" prop="siteId">
            <el-checkbox-group v-model="activityManageFormData.siteId">
              <el-checkbox-button v-for="dict in getIntDictOptions(DICT_TYPE.CRM_SITE_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学员限制" prop="customerLimit">
            <el-radio-group v-model="activityManageFormData.customerLimit">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_LIMIT)" :key="dict.value"
                :value="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="activityManageFormData.customerLimit === 10">
          <el-form-item label="限制参与类型" prop="customerLevelLimit">
            <el-checkbox-group v-model="activityManageFormData.customerLevelLimit">
              <el-checkbox v-for="dict in getIntDictOptions(DICT_TYPE.STUDENT_TYPE)" :key="dict.value"
                :value="dict.value">
                {{ dict.label }}
              </el-checkbox>
            </el-checkbox-group>
            <div class="flex ml-6">
              <el-button type="primary" size="small" @click="limitCheckAll">
                全选
              </el-button>
              <el-button type="info" size="small" @click="limitClearAll">
                清空
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-else-if="activityManageFormData.customerLimit === 9">
          <el-form-item label="是否关联等级" prop="relationActivityStatus">
            <el-select v-model="activityManageFormData.relationActivityStatus" clearable placeholder="请选择是否关联活动">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.RELATION_ACTIVITY_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          v-if="activityManageFormData.customerLimit != 9 && activityManageFormData.customerLimit !== undefined">
          <el-form-item label="归属月份" prop="activityMonth">
            <el-date-picker v-model="activityManageFormData.activityMonth" type="month" placeholder="请选择归属月份" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="activityManageFormData.customerLimit === 8">
          <el-form-item label="续费定金金额限制 ≥" prop="renewAmountLimit" label-width="160">
            <div class="flex items-center">
              <el-input v-model="activityManageFormData.renewAmountLimit" placeholder="请输入正整数" v-only-decimal="0" />
              <span class="ml-4">元</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核方式" prop="autoAuditStatus">
            <el-select v-model="activityManageFormData.autoAuditStatus" placeholder="请选择审核方式" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.AUTO_AUDIT_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="奖励发放方式" prop="rewardStatus">
            <el-select v-model="activityManageFormData.rewardStatus" placeholder="请选择奖励发放方式" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.REWARD_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="奖励类型" prop="rewardType">
            <el-checkbox-group v-model="activityManageFormData.rewardType">
              <el-checkbox-button v-for="dict in REWARD_TYPE" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="积分" prop="rewardPointNumber" v-show="activityManageFormData.rewardType.includes(1)">
            <el-input v-only-numbers v-model="activityManageFormData.rewardPointNumber" placeholder="请输入积分" />
          </el-form-item>
          <el-form-item label="课时点" prop="rewardQqePointNumber" v-show="activityManageFormData.rewardType.includes(2)">
            <el-input v-only-numbers v-model="activityManageFormData.rewardQqePointNumber" placeholder="请输入课时点" />
          </el-form-item>
          <el-form-item label="优惠券" prop="couponId" v-show="activityManageFormData.rewardType.includes(4)">
            <MultiSelect v-model="activityManageFormData.couponId" :type="'coupon'"
              :api-fn="CouponApi.getSimpleSelectPage" label-field="name" value-field="id" placeholder="请选择优惠券"
              search-placeholder="请输入优惠券（联想输入）" :show-current-option="formType === 'update'"
              :current-fn="CouponApi.getByList" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-show="activityManageFormData.rewardType.includes(3) && activityManageFormData.siteId.length === 0">
            <span class="text-red text-4.5 font-bold">如选择次卡请先指定适用站点！</span>
          </el-form-item>
          <el-form-item
            v-show="activityManageFormData.rewardType.includes(3) && activityManageFormData.siteId.includes(102)"
            label="次卡" prop="CN">
            <div class="w-24%">
              <el-input v-model="CNLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="activityManageFormData.CN" multiple collapse-tags collapse-tags-tooltip
                placeholder="请选择站点 CN 的次卡">
                <el-option v-for="option in CNOptions" :key="option.code" :label="option.name" :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            v-show="activityManageFormData.rewardType.includes(3) && activityManageFormData.siteId.includes(600)"
            label="次卡" prop="CPZH">
            <div class="w-24%">
              <el-input v-model="CPZHLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="activityManageFormData.CPZH" multiple collapse-tags collapse-tags-tooltip
                placeholder="请选择站点 CPZH 的次卡">
                <el-option v-for="option in CPZHOptions" :key="option.code" :label="option.name" :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            v-show="activityManageFormData.rewardType.includes(3) && activityManageFormData.siteId.includes(113)"
            label="次卡" prop="CNADT">
            <div class="w-24%">
              <el-input v-model="CNADTLabel" placeholder="站点" readonly />
            </div>
            <div class="w-3%"></div>
            <div class="w-73%">
              <el-select v-model="activityManageFormData.CNADT" multiple collapse-tags collapse-tags-tooltip
                placeholder="请选择站点 CNADT 的次卡">
                <el-option v-for="option in CNADTOptions" :key="option.code" :label="option.name"
                  :value="option.code" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="微信话术" prop="wechatScript">
            <el-input v-model="activityManageFormData.wechatScript" placeholder="请输入微信话术" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动状态" prop="activityStatus">
            <el-select v-model="activityManageFormData.activityStatus" clearable placeholder="请选择活动状态">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动规则" prop="activityRules">
            <el-input v-model="activityManageFormData.activityRules" type="textarea" placeholder="请输入活动规则" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动备注" prop="activityRemark">
            <el-input v-model="activityManageFormData.activityRemark" type="textarea" placeholder="请输入活动备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="posterFormRef" :model="posterFormData" :rules="formRules" label-width="85"
      v-loading="posterFormLoading" v-show="active === 2">
      <el-row>
        <el-col :span="8">
          <el-form-item label="活动" prop="activityId" label-width="65">
            <el-select v-model="posterFormData.activityId" placeholder="请选择活动">
              <el-option v-for="dict in activityManageOptions" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动代码" prop="activityCode">
            <el-input v-model="posterFormData.activityCode" placeholder="微信公众号专用" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内容类型" prop="wechatContentType">
            <el-select v-model="posterFormData.wechatContentType" placeholder="请选择内容类型">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WECHAT_CONTENT_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文案" prop="scriptContent" label-width="65">
            <el-input type="textarea" v-model="posterFormData.scriptContent" placeholder="用于顾问提取海报时的专属话术" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="relative">
        <el-segmented v-model="selectType" :options="settingType" block size="large" class="mb-6" />
        <div class="cursor-pointer" @click="toggleTriangle">
          <div class="isDefault" :class="{ 'default-clicked': posterFormData.textDisplayFlag }"></div>
          <Icon :icon="posterFormData.textDisplayFlag ? 'fluent-emoji-flat:star' : 'fluent-emoji-high-contrast:star'"
            class="default-icon" />
        </div>
      </div>
      <div v-show="selectType === 1">
        <el-row>
          <el-col :span="17">
            <el-row>
              <el-col :span="12">
                <el-form-item label="海报类型" prop="posterType">
                  <el-select v-model="posterFormData.posterType" placeholder="请选择海报类型">
                    <el-option v-for="dict in getIntDictOptions(DICT_TYPE.POSTER_TYPE)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="海报背景" prop="posterImg">
                  <form-create v-model="poster" :rule="posterRule" :option="posterOption" :limit="100"
                    :compress="false" />
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
              <span v-else>{{ getLabelByLink(posterFormData.pageLinkId, registerUrlOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="X" align="center" prop="qrCodeXCoordinate">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-only-numbers v-model.number.trim="scope.row.qrCodeXCoordinate">
                  <template #append>px</template>
                </el-input>
              </template>
              <span v-else>{{ scope.row.qrCodeXCoordinate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Y" align="center" prop="qrCodeYCoordinate">
            <template #default="scope">
              <template v-if="scope.row.edit">
                <el-input v-only-numbers v-model.number.trim="scope.row.qrCodeYCoordinate">
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
      <div v-if="active === 1 && formType === 'create'">
        <el-button @click="submitActivityManageForm">下一步</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
      <div v-else-if="active === 1 && formType === 'update'">
        <el-button @click="submitActivityManageForm">完 成</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
      <div v-else>
        <el-button @click="preview" color="#00cb73" style=" color: #fff;" class="float-left"
          v-loading="previewLoading">生成预览图</el-button>
        <el-button @click="close" style="background-color: #ffa086; color: #fff;">暂不创建</el-button>
        <el-button @click="active--">上一步</el-button>
        <el-button @click="submitPosterForm" :disabled="posterFormLoading">完 成</el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE, getLabelByLink, getRegisterLinkOptions, getFontsOptions, getActivityManageOptions } from '@/utils/dict'
import { formatDate, convertDateArrayToTimestamp, disabledBeforeDate } from '@/utils/formatTime'
import { SITE_MAPPING } from '@/utils/constants'
import { mapToJson, jsonToFields, parseIfString } from '@/utils/common'
import { ActivityManageApi, ActivityManageVO } from '@/api/crm/activity/activityManage'
import { CouponApi } from '@/api/crm/sales/coupon/coupon'
import { PosterApi, PosterVO } from '@/api/crm/sales/poster/poster'
import { SubscriptionApi } from '@/api/crm/qqe/subscription'
import { Plus, Edit, Check, Delete, Picture } from '@element-plus/icons-vue'

/** 活动设置 表单 */
defineOptions({ name: 'ActivityManageForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const active = ref() // 当前页数

/* 活动设置 */
const activityManageFormLoading = ref(false) // 活动设置表单的加载中

/** 表单数据 */
const activityManageFormData = ref({
  id: undefined, // 编号
  activityNameVisible: undefined, // 活动名称(外部可见)
  activityNameInternal: undefined, // 活动名称(内部可见)
  siteId: [], // 站点
  customerLimit: undefined, // 学员限制
  customerLevelLimit: [], // 限制参与类型
  relationActivityStatus: undefined, // 是否关联等级
  activityMonth: undefined, // 归属月份
  renewAmountLimit: undefined, // 续费定金金额限制
  activityTime: undefined, // 活动时间
  activityStartTime: undefined, // 活动开始时间
  activityEndTime: undefined, // 活动结束时间
  rewardPointNumber: undefined, // 积分奖励数量
  rewardQqePointNumber: undefined, // 课时点奖励数量
  couponId: [], // 优惠券
  rewardStatus: undefined, // 奖励发放方式
  rewardType: [], // 奖励类型
  activityStatus: 0, // 活动状态
  wechatScript: undefined, // 微信话术
  autoAuditStatus: undefined, // 审核方式
  ticketCode: {}, // 次卡代码
  ticketName: {}, // 次卡名称
  activityRules: undefined, // 活动规则
  activityRemark: undefined, // 活动备注
  CN: [], // CN次卡
  CPZH: [], // CPZH次卡
  CNADT: [], // CNADT次卡
})

const CNLabel = ref('CN')
const CPZHLabel = ref('CPZH')
const CNADTLabel = ref('CNADT')
const CNOptions = ref()
const CPZHOptions = ref()
const CNADTOptions = ref()
const REWARD_TYPE = getIntDictOptions(DICT_TYPE.REWARD_TYPE).filter(item => item.value !== 6 && item.value !== 7)

/** 表单校验规则 */
const activityManageFormRules = reactive({
  activityNameVisible: [{ required: true, message: '活动名称（外部）不能为空', trigger: 'blur' }],
  activityNameInternal: [{ required: true, message: '活动名称（内部）不能为空', trigger: 'blur' }],
  activityTime: [{ required: true, message: '有效时间不能为空', trigger: 'change' }],
  siteId: [{ required: true, message: '适用站点不能为空', trigger: 'change' }],
  customerLimit: [{ required: true, message: '学员限制不能为空', trigger: 'change' }],
  activityMonth: [{}],
  autoAuditStatus: [{ required: true, message: '审核方式不能为空', trigger: 'change' }],
  rewardStatus: [{ required: true, message: '奖励发放方式不能为空', trigger: 'change' }],
  rewardType: [{ required: true, message: '奖励类型不能为空', trigger: 'change' }],
  activityRules: [{ required: true, message: '活动规则不能为空', trigger: 'blur' }],
})

/* 监视奖励类型和次卡代码 */
watch([
  () => activityManageFormData.value.rewardType,
  () => activityManageFormData.value.siteId,
],
  async ([newRewardType, newSiteId]) => {
    activityManageFormRules.rewardPointNumber = newRewardType.includes(1) ? [{ required: true, message: '积分不能为空', trigger: 'blur' }] : []
    activityManageFormRules.rewardQqePointNumber = newRewardType.includes(2) ? [{ required: true, message: '课时点不能为空', trigger: 'blur' }] : []
    activityManageFormRules.ticketCode = newRewardType.includes(3) ? [{ required: true, message: '次卡不能为空', trigger: 'blur' }] : []
    activityManageFormRules.couponId = newRewardType.includes(4) ? [{ required: true, message: '优惠券不能为空', trigger: 'change' }] : []
    const updateRuleAndOption = async (key, optionKey, checkSiteId, message) => {
      activityManageFormRules[key] = [{ required: true, message, trigger: 'blur' }]
      optionKey.value = await SubscriptionApi.getSimpleTicketList(checkSiteId)
    }
    if (newRewardType.includes(3) && newSiteId.includes(102)) {
      await updateRuleAndOption('CN', CNOptions, 102, 'CN次卡不能为空')
    } else {
      activityManageFormRules.CN = []
    }

    if (newRewardType.includes(3) && newSiteId.includes(600)) {
      await updateRuleAndOption('CPZH', CPZHOptions, 600, 'CPZH次卡不能为空')
    } else {
      activityManageFormRules.CPZH = []
    }

    if (newRewardType.includes(3) && newSiteId.includes(113)) {
      await updateRuleAndOption('CNADT', CNADTOptions, 113, 'CNADT次卡不能为空')
    } else {
      activityManageFormRules.CNADT = []
    }
  }
)

/* 监视学员限制，以清空关联等级和归属月份 */
watch(() => activityManageFormData.value.customerLimit, (newVal, oldVal) => {
  if (newVal && oldVal !== undefined) {
    activityManageFormData.value.relationActivityStatus = undefined
    activityManageFormData.value.activityMonth = undefined
    activityManageFormData.value.customerLevelLimit = []
    activityManageFormData.value.renewAmountLimit = undefined
  }
  if (newVal !== 9) {
    activityManageFormRules.activityMonth = [{ required: true, message: '归属月份不能为空', trigger: 'change' }]
  } else {
    activityManageFormRules.activityMonth = [{}]
  }
})

watch(() => activityManageFormData.value.rewardType, (val) => {
  const fields = {
    1: "rewardPointNumber",
    2: "rewardQqePointNumber",
    3: "ticketCode",
    4: "couponId",
  }
  Object.entries(fields).forEach(([key, field]) => {
    if (!val.includes(Number(key))) {
      activityManageFormData.value[field] = key === "4" ? [] : undefined
    }
  })
})

/** 表单 Ref */
const activityManageFormRef = ref()

/** 全选 */
const limitCheckAll = () => {
  activityManageFormData.value.customerLevelLimit = getIntDictOptions(DICT_TYPE.STUDENT_TYPE).map(item => item.value)
}

/* 清空 */
const limitClearAll = () => {
  activityManageFormData.value.customerLevelLimit = []
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitActivityManageForm = async () => {
  if (activityManageFormData.value.activityTime) {
    activityManageFormData.value.activityStartTime = activityManageFormData.value.activityTime[0].getTime()
    activityManageFormData.value.activityEndTime = activityManageFormData.value.activityTime[1].getTime()
  }
  if (activityManageFormData.value.activityMonth) {
    activityManageFormData.value.activityMonth = formatDate(activityManageFormData.value.activityMonth, 'YYYY-MM-DD')
  }
  // 校验表单
  await activityManageFormRef.value.validate()
  // 提交请求
  activityManageFormLoading.value = true
  try {
    // 站点次卡 转 json
    const ticketCodeData = Object.fromEntries(
      Object.entries({
        CN: parseIfString(activityManageFormData.value.CN),
        CPZH: parseIfString(activityManageFormData.value.CPZH),
        CNADT: parseIfString(activityManageFormData.value.CNADT),
      }).filter(([_, value]) => Array.isArray(value) && value.length > 0)
    )
    const ticketNameData = Object.fromEntries(
      Object.entries({
        CN: CNOptions.value ? CNOptions.value.filter(item => activityManageFormData.value.CN.includes(item.code)).map(item => item.name) : [],
        CPZH: CPZHOptions.value ? CPZHOptions.value.filter(item => activityManageFormData.value.CPZH.includes(item.code)).map(item => item.name) : [],
        CNADT: CNADTOptions.value ? CNADTOptions.value.filter(item => activityManageFormData.value.CNADT.includes(item.code)).map(item => item.name) : [],
      }).filter(([_, value]) => Array.isArray(value) && value.length > 0)
    )
    activityManageFormData.value.ticketCode = mapToJson(SITE_MAPPING, ticketCodeData)
    activityManageFormData.value.ticketName = mapToJson(SITE_MAPPING, ticketNameData)
    const data = activityManageFormData.value as unknown as ActivityManageVO
    if (formType.value === 'create') {
      if (!activityManageFormData.value.id) {
        try {
          activityManageFormData.value.id = await ActivityManageApi.createActivityManage(data)
          message.success(t('common.createSuccess'))
          // 新增成功，获取 options
          activityManageOptions.value = await getActivityManageOptions(0)
          registerUrlOptions.value = await getRegisterLinkOptions()
          fontsOptions.value = await getFontsOptions()
          active.value++
          dialogTitle.value = '创建海报'
          // 传递活动编号
          posterFormData.value.activityId = activityManageFormData.value.id
          posterFormData.value.activityName = activityManageFormData.value.activityNameVisible
        } catch {
          message.error('新增失败')
        }
      } else {
        try {
          await ActivityManageApi.updateActivityManage(data)
          message.success(t('common.updateSuccess'))
          active.value++
        } catch (e) {
          message.error('修改失败')
        }
      }
    } else {
      try {
        await ActivityManageApi.updateActivityManage(data)
        message.success(t('common.updateSuccess'))
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
      } catch {
        message.error('修改失败')
      }
    }
  } finally {
    activityManageFormLoading.value = false
  }
}

/** 重置表单 */
const activityManageResetForm = () => {
  activityManageFormData.value = {
    id: undefined, // 编号
    activityNameVisible: undefined, // 活动名称(外部可见)
    activityNameInternal: undefined, // 活动名称(内部可见)
    siteId: [], // 站点
    customerLimit: undefined, // 学员限制
    customerLevelLimit: [], // 限制参与类型
    relationActivityStatus: undefined, // 是否关联等级
    activityMonth: undefined, // 归属月份
    renewAmountLimit: undefined, // 续费定金金额限制
    activityTime: undefined, // 活动时间
    activityStartTime: undefined, // 活动开始时间
    activityEndTime: undefined, // 活动结束时间
    rewardPointNumber: undefined, // 积分奖励数量
    rewardQqePointNumber: undefined, // 课时点奖励数量
    couponId: [], // 优惠券
    rewardStatus: undefined, // 奖励发放方式
    rewardType: [], // 奖励类型
    activityStatus: 0, // 活动状态
    wechatScript: undefined, // 微信话术
    autoAuditStatus: undefined, // 审核方式
    ticketCode: {}, // 次卡代码
    ticketName: {}, // 次卡名称
    activityRules: undefined, // 活动规则
    activityRemark: undefined, // 活动备注
    CN: [], // CN次卡
    CPZH: [], // CPZH次卡
    CNADT: [], // CNADT次卡
  }
  activityManageFormRef.value?.resetFields()
  CNOptions.value = []
  CPZHOptions.value = []
  CNADTOptions.value = []
}

/* 海报设置 */
/** 表单数据 */
const posterFormData = ref({
  id: undefined,
  activityId: undefined,
  activityName: undefined,
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

/** 表单校验规则 */
const formRules = reactive({
  activityId: [{ required: true, message: '活动不能为空', trigger: 'change' }],
  wechatContentType: [{ required: true, message: '海报类型不能为空', trigger: 'change' }],
})
const posterFormLoading = ref(false) // 海报设置表单的加载中

/** 表单 Ref */
const posterFormRef = ref()

/** 二维码 */
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

/** 文案 */
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

/** 海报图 */
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
      "path": 'activity/activityManage/poster'
    },
    "hidden": false,
    "display": true,
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

/** 分段控制器展示 */
const settingType = ref([
  { value: 1, label: "海报" },
  { value: 2, label: "二维码" },
  { value: 3, label: "文字", disabled: !posterFormData.value.textDisplayFlag },
])
const selectType = ref(1)
const toggleTriangle = async () => {
  if (posterFormData.value.textDisplayFlag === false) {
    posterFormData.value.textDisplayFlag = true
    selectType.value = 3
  } else {
    try {
      // 二次确认 activityManageFormData.value.relationActivityStatus = undefined
      activityManageFormData.value.activityMonth = undefined
      activityManageFormData.value.customerLevelLimit = []
      await message.confirm(`确认关闭文字吗?`)
      // 发起修改状态
      posterFormData.value.textDisplayFlag = false
      selectType.value = 1
      textList.value = []
      posterFormData.value = {
        ...posterFormData.value,
        textXCoordinate: [],
        textYCoordinate: [],
        textFont: [],
        textSize: [],
        textColor: []
      }
    } catch {
      // 取消后，进行恢复
      posterFormData.value.textDisplayFlag = true
    }
  }
}

// textDisplayFlag 与 settingType.value[2].disabled 双向绑定（相反）
watch(() => posterFormData.value.textDisplayFlag, (newVal) => {
  settingType.value.find(item => item.value === 3)!.disabled = !newVal
})


/** 活动表单校验 */
const validateForm = async () => {
  try {
    await posterFormRef.value.validate()
    return true
  } catch {
    return false
  }
}

/** 文案新增 */
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
  // 删除后重新更新 id
  textList.value.forEach((item, idx) => {
    item.id = idx + 1
  })
}

/** 二维码校验 */
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
  posterFormData.value = {
    ...posterFormData.value,
    pageLinkId: qrInfo.pageLinkId,
    qrCodeXCoordinate: qrInfo.qrCodeXCoordinate,
    qrCodeYCoordinate: qrInfo.qrCodeYCoordinate,
    qrCodeWidth: qrInfo.qrCodeWidth,
    qrCodeLength: qrInfo.qrCodeLength
  }
  return true
}

/** 文字信息校验 */
const validateTextInfo = () => {
  if (!posterFormData.value.textDisplayFlag) return true
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
  posterFormData.value.textXCoordinate = textList.value.map(item => item.textXCoordinate)
  posterFormData.value.textYCoordinate = textList.value.map(item => item.textYCoordinate)
  posterFormData.value.textFont = textList.value.map(item => item.textFont)
  posterFormData.value.textSize = textList.value.map(item => item.textSize)
  posterFormData.value.textColor = textList.value.map(item => item.textColor)
  return true
}

/** 海报信息校验 */
const validatePoster = () => {
  if (!poster.value || poster.value.poster.length === 0) {
    message.error('请补全海报信息')
    selectType.value = 1
    return false
  }
  posterFormData.value.posterImg = poster.value.poster
  return true
}

/** 预览 */
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
    const data = posterFormData.value as unknown as PosterVO
    const res = await PosterApi.getPreviewPoster(data)
    srcList.value = res.map(item => item.posterUrl)
    message.success('预览图已生成')
  } catch {
    message.error('预览图生成失败，请重试')
  } finally {
    previewLoading.value = false
  }
}

/* options */
const activityManageOptions = ref()
const fontsOptions = ref()
const registerUrlOptions = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  active.value = 1
  dialogVisible.value = true
  formType.value = type
  activityManageResetForm()
  posterResetForm()
  // 修改时，设置数据
  if (id) {
    dialogTitle.value = '修改活动'
    activityManageFormLoading.value = true
    try {
      activityManageFormData.value = await ActivityManageApi.getActivityManage(id)
      // 当前模式
      if (activityManageFormData.value.activityStartTime && activityManageFormData.value.activityEndTime) {
        activityManageFormData.value.activityTime = [
          new Date(activityManageFormData.value.activityStartTime),
          new Date(activityManageFormData.value.activityEndTime)
        ]
      }
      if (activityManageFormData.value.activityMonth) {
        activityManageFormData.value.activityMonth = new Date(convertDateArrayToTimestamp(activityManageFormData.value.activityMonth))
      }
      // 次卡 json 映射为数组
      activityManageFormData.value = {
        ...activityManageFormData.value,
        ...jsonToFields(activityManageFormData.value.ticketCode, SITE_MAPPING)
      }
    } finally {
      activityManageFormLoading.value = false
    }
  } else {
    dialogTitle.value = '创建活动'
  }
}
defineExpose({ open })

/* 关闭弹窗 */
const close = () => {
  dialogVisible.value = false
  emit('success')
}

/** 提交表单 */
const submitPosterForm = async () => {
  // 校验
  if (!(await validateForm())) return
  if (!validateQRCode()) return
  if (!validateTextInfo()) return
  if (!validatePoster()) return
  // 提交请求
  posterFormLoading.value = true
  try {
    const data = posterFormData.value as unknown as PosterVO
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
    posterFormLoading.value = false
  }
}

/** 重置表单 */
const posterResetForm = () => {
  posterFormData.value = {
    id: undefined,
    activityId: undefined,
    activityName: undefined,
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
  posterFormRef.value?.resetFields()
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
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

:deep(.el-loading-mask) {
  top: -7px;
}

:deep(.el-input-group__append) {
  padding-inline: 8px;
}

:deep(.el-date-editor),
:deep(.el-date-editor--datetime) {
  width: 100%;
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