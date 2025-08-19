<template>
  <el-card class="wechat-info">
    <template #header>
      <span class="header">微信信息</span>
    </template>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <el-descriptions title="学员微信">
            <el-descriptions-item label="微信号：" width="7%">{{ placeholder(formData.wechatAlias) }}</el-descriptions-item>
            <el-descriptions-item label="微信绑定手机号：" width="8%">
              {{ placeholder(formData.phone) }}
              <el-button v-if="formData.phone" size="small" class="!px-1 !h-5"
                @click="checkFullInfo(CRM_DESENSITIZE_TYPE.PHONE, formData.id)"
                v-hasPermi="['crm:sensitize:query']">查看</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="昵称：" width="15%">{{ placeholder(formData.nickName) }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="学员历史绑定微信号" class="mt-4">
            <el-descriptions-item>
              <el-table v-loading="loading" :data="formData.wechatMentorRespVoList" border stripe show-overflow-tooltip>
                <el-table-column label="绑定顾问" align="center" prop="ownerName" />
                <el-table-column label="顾问微信号" align="center" prop="wechatAlias" />
                <el-table-column label="顾问昵称" align="center" prop="nickName" />
                <el-table-column label="绑定时间" align="center" prop="bindTime" :formatter="dateFormatterYMDHms" />
                <el-table-column label="好友备注名" align="center" prop="remark" />
                <el-table-column label="好友微信标签" align="center" prop="labelsList" />
              </el-table>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- 折叠展开按钮 -->
    <el-divider class="!my-5px">
      <el-button type="primary" link @click="handleMore">
        {{ activeNames ? '收起' : '展开' }}
        <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="activeNames ? 'arrow-down' : 'arrow-up'" />
      </el-button>
    </el-divider>
  </el-card>

  <!-- 查看完整无掩码信息 -->
  <MasklessInfoDialog ref="masklessInfoDialogRef" />
</template>
<script lang="ts" setup>
import { placeholder } from '@/utils/common'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { CRM_DESENSITIZE_SOURCE, CRM_DESENSITIZE_TYPE } from '@/utils/constants'
import { WechatFriendApi } from '@/api/crm/wechat/friend'
import MasklessInfoDialog from '@/views/crm/components/MasklessInfoDialog/MasklessInfoDialog.vue'

/* 配置项 */
const message = useMessage()
const loading = ref()
const activeNames = ref('') // 控制折叠展开

/* 表单数据 */
const formData = ref({
  wechatAlias: undefined,
  phone: undefined,
  nickName: undefined,
  wechatMentorRespVoList: []
})

const props = defineProps({
  customerId: {
    type: Number,
    default: 0
  }
})

/* 展开/收起 */
const handleMore = async () => {
  activeNames.value = !activeNames.value ? 'more' : ''
}

/* 查看未脱敏数据 */
const masklessInfoDialogRef = ref()
const checkFullInfo = (type: number, id: number) => {
  masklessInfoDialogRef.value.open(type, id, CRM_DESENSITIZE_SOURCE.WECHAT)
}


onMounted(async () => {
  loading.value = true
  try {
    formData.value = await WechatFriendApi.getWechatCustomer(props.customerId)
    loading.value = false
  } catch (e) {
    message.error('获取学员微信信息失败')
  } finally {
    loading.value = false
  }
})
</script>
<style scoped lang="scss">
.wechat-info {
  margin-top: 20px;

  .header {
    font-size: 16px;
    font-weight: 700;
  }

  /* 更多点击时箭头方向的的改变 */
  .arrow-up {
    transform: rotate(180deg);
    transition: all 0.3s;
  }

  .arrow-down {
    transform: rotate(0);
    transition: all 0.3s;
  }
}

:deep(td.el-descriptions__cell) {
  width: 10%;
}
</style>