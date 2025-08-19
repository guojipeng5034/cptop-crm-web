<template>
  <el-card class="contact-status-info">
    <template #header>
      <span class="header">客户联系状态记录</span>
    </template>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <el-table :data="list" :row-key="(row) => row.id">
            <el-table-column prop="contactUserName" label="联系用户姓名" align="center">
              <template #default="scope">
                {{ placeholder(scope.row.contactUserName) }}
              </template>
            </el-table-column>
            <el-table-column prop="beforeStatus" label="变更前的状态" align="center">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.CALL_STATUS" :value="scope.row.beforeStatus" />
              </template>
            </el-table-column>
            <el-table-column prop="afterStatus" label="变更后的状态" align="center">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.CALL_STATUS" :value="scope.row.afterStatus" />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatterYMDHms" />
          </el-table>
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- 折叠展开按钮 -->
    <el-divider class="!my-15px">
      <el-button type="primary" link @click="handleMore">
        {{ activeNames ? '收起' : '展开' }}
        <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="activeNames ? 'arrow-down' : 'arrow-up'" />
      </el-button>
    </el-divider>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { placeholder } from '@/utils/common'
import { dateFormatterYMDHms } from '@/utils/formatTime'
import { CustomerApi } from '@/api/crm/customer/base'

const props = defineProps({
  customerId: {
    type: Number,
    default: 0
  }
})

/* 配置项 */
const message = useMessage()
const activeNames = ref('more') // 控制折叠展开
const loading = ref(false)
const list = ref([]) //列表的数据

/* 请求参数 */
const formData = ref({
  pageSize: 500,
  pageNo: 1,
  customerId: props.customerId,
})

/* 展开/收起 */
const handleMore = () => {
  activeNames.value = !activeNames.value ? 'more' : ''
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await CustomerApi.getContactStatus(formData.value)
    list.value = res.list
  } catch (error) {
    message.error('获取客户联系状态记录失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  getList()
})
</script>
<style scoped lang="scss">
.contact-status-info {
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