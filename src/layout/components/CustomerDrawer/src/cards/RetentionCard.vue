<template>
  <el-card class="retention-info">
    <template #header>
      <span class="header">留资信息</span>
    </template>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <el-table :data="formData" :row-key="(row) => row.id">
            <el-table-column prop="retentionInformationTime" label="留资时间" align="center" min-width="100"
              :formatter="dateFormatterYMDHms" />
            <el-table-column prop="retentionInformationSource" label="留资来源" align="center" min-width="120" />
            <el-table-column prop="channel" label="渠道大类" align="center" />
            <el-table-column prop="channelSub" label="渠道子类" align="center" />
            <el-table-column prop="channelPage" label="渠道细分" align="center" />
          </el-table>
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- 折叠展开按钮 -->
    <el-divider>
      <el-button type="primary" link @click="handleMore">
        {{ activeNames ? '收起' : '展开' }}
        <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="activeNames ? 'arrow-down' : 'arrow-up'" />
      </el-button>
    </el-divider>
  </el-card>
</template>

<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { CustomerApi } from '@/api/crm/customer/base'
import { dateFormatterYMDHms } from '@/utils/formatTime'

/* 配置项 */
const message = useMessage()
const loading = ref()
const activeNames = ref('') // 控制折叠展开

const props = defineProps({
  customerId: {
    type: Number,
    default: 0
  }
})

/* 表单数据 */
const formData = ref([])

/* 展开/收起 */
const handleMore = async () => {
  activeNames.value = !activeNames.value ? 'more' : ''
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    formData.value = await CustomerApi.getRetentionInfo(props.customerId)
    loading.value = false
  } catch (e) {
    message.error('获取学员微信信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  getList()
})
</script>
<style scoped lang="scss">
.retention-info {
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
</style>