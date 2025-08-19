<template>
  <el-card class="p-inline-40">
    <div v-if="assignStore.success === true" v-loading="loading">
      <el-result icon="success" title="线索分配人员无异常" sub-title="导入完成后，自动分配线索按照此名单及规则自动分配。" />
    </div>
    <div v-else>
      <el-result icon="warning" title="请检查线索分配人员" sub-title="请检查是否有误，导入完成后，自动分配线索按照此名单及规则自动分配。" />
      <el-card class="m-b-4">
        <template #header>
          <div class="card-header">
            <span class="title">问题顾问</span>
          </div>
        </template>
        <el-table v-loading="loading" :data="assignStore.data" stripe show-overflow-tooltip>
          <el-table-column label="可分配顾问" prop="mentorName" />
          <el-table-column label="问题原因">
            <template #default="scope">
              <arco-tag :type="DICT_TYPE.SYS_USER_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="所属部门" prop="mentorDeptName" />
          <el-table-column label="岗位" prop="postNames" />
          <el-table-column label="分配日期" prop="assignTime" :formatter="dateFormatterYMD" />
        </el-table>
      </el-card>
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="title">不存在的顾问</span>
          </div>
        </template>
        <div class="flex flex-wrap gap-4">
          <el-card v-for="item in assignStore.notExistUsers" :key="item" style="width: 200px" shadow="always">
            {{ item }}
          </el-card>
        </div>
      </el-card>
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="danger" size="large" @click="back">返 回</el-button>
        <el-button type="primary" size="large" @click="save" :disabled="!assignStore.success">导 入</el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import router from '@/router';
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatterYMD } from '@/utils/formatTime'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAssignStore } from '@/store/modules/assign'
import { ListOwnerAssignApi } from '@/api/crm/customer/assign'

/** 核对线索分配 表单 */
defineOptions({ name: 'CheckAssignForm' })

/* 配置项 */
const message = useMessage()
const tagsViewStore = useTagsViewStore()
const assignStore = useAssignStore()
const loading = ref(false)
const visitedView = tagsViewStore.getVisitedViews.find((item) => item.name === "CheckAssignForm")

/* 返回 */
const back = () => {
  router.push({ name: 'ListOwnerAssign' }).then(() => {
    nextTick(() => {
      assignStore.clearState()
    })
  })
  tagsViewStore.delView(visitedView)
}

/* 导入 */
const save = async () => {
  loading.value = true
  try {
    await ListOwnerAssignApi.persistenceImport(
      assignStore.getDataKey, assignStore.getYearMonth[0], assignStore.getYearMonth[1]
    )
    message.success('导入成功')
  } catch (e) {
    message.error('导入失败')
  } finally {
    loading.value = false
  }
  back()
}

onUnmounted(() => {
  assignStore.clearState()
})
</script>
<style scoped lang="scss">
.card-header {
  .title {
    font-weight: 700;
  }
}

.footer {
  display: flex;
  justify-content: center;
}
</style>
