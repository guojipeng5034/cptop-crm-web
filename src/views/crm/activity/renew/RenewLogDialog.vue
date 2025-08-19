<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1300">
    <el-table v-loading="tableLoading" :data="list" stripe border class="data-table">
      <el-table-column label="拒绝续费的类型" align="center" prop="refuseRenewType" class-name="padding-side-0" width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.REFUND_TYPE" :value="scope.row.refuseRenewType" />
        </template>
      </el-table-column>
      <el-table-column label="拒绝续费的原因" align="center" prop="refuseReason" width="140" show-overflow-tooltip />
      <el-table-column label="是否有效沟通" align="center" prop="effectiveChatFlag" width="90">
        <template #default="scope">
          <Icon :icon="dealIcon(scope.row.effectiveChatFlag)[0]" :size="16" color="#fff"
            :style="`background-color: ${dealIcon(scope.row.effectiveChatFlag)[1]}`"
            style="padding: 4px; border-radius: 20px" />
        </template>
      </el-table-column>
      <el-table-column label="有效沟通的内容" align="center" prop="effectiveContent" width="140" show-overflow-tooltip />
      <el-table-column prop="creatorName" label="创建人" align="center" min-width="120" />
      <el-table-column prop="createTime" label="创建时间" align="center" width="110" :formatter="timeWithoutSecondFormat" />
      <el-table-column prop="updaterName" label="更新人" align="center" min-width="120" />
      <el-table-column prop="updateTime" label="更新时间" align="center" width="110" :formatter="timeWithoutSecondFormat" />
      <el-table-column label="操作" align="center" fixed="right" width="160" v-hasPermi="[
        'crm:customer-package-renew-log:update',
        'crm:customer-package-renew-log:delete'
      ]">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row.id)"
            v-hasPermi="['crm:customer-package-renew-log:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['crm:customer-package-renew-log:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-if="total >= 5" size="small" :total="total" v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize" @pagination="getList" />
  </Dialog>
  <!-- 学员续费 表单 -->
  <RenewForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { isEmpty } from '@/utils/is'
import { RenewLogApi, RenewLogVO } from '@/api/crm/activity/renewLog'
import { dealIcon } from '@/utils/constants'
import RenewForm from './RenewForm.vue'

/** 退款表单 */
defineOptions({ name: 'RenewLogDialog' })

/** 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

/** 列表 */
const tableLoading = ref(true) // 列表的加载中
const list = ref<RenewLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
let queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  packageRenewId: undefined
})

/** 查询列表 */
const getList = async () => {
  tableLoading.value = true
  try {
    const data = await RenewLogApi.getCustomerPackageRenewLogPage(queryParams)
    // 筛选出已付全款的 payment 数据
    list.value = data.list
    total.value = data.total
  } catch (e) {
    console.log('renew log dialog getList error', e)
  } finally {
    tableLoading.value = false
  }
}

/** 弹窗 */
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const open = async (packageRenewId: number) => {
  dialogVisible.value = true
  dialogTitle.value = '续费日志'
  reset()
  queryParams.packageRenewId = packageRenewId
  await getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 重置 */
const reset = () => {
  queryParams = {
    pageNo: 1,
    pageSize: 5,
    packageRenewId: undefined
  }
}

/** 修改操作 */
const formRef = ref()
const openForm = (id: number) => {
  formRef.value.open('update', id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RenewLogApi.deleteCustomerPackageRenewLog(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
    message.error('删除失败')
  }
}
</script>

<style lang="scss" scoped>
.data-table {
  :deep(.el-table__inner-wrapper) {
    .padding-side-0 {
      th.el-table__cell {
        padding: 0;
      }

      td.el-table__cell {
        padding: 0;
      }

      .cell {
        padding: 0;
        /* line-height: 20px; */
      }
    }
  }
}
</style>
