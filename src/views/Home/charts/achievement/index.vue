<template>
  <el-descriptions class="margin-top" :column="4" border>
    <el-descriptions-item label="时间" width="161">{{ date }}</el-descriptions-item>
    <el-descriptions-item label="时间进度" width="161">{{ schedule }}</el-descriptions-item>
    <el-descriptions-item label="剩余" width="161">{{ remainder }}天</el-descriptions-item>
    <el-descriptions-item label="平均每天业绩" width="161">1800</el-descriptions-item>
  </el-descriptions>

  <el-table :data="list.achievementData.data.personalData" border>
    <el-table-column prop="index" width="153" />
    <el-table-column prop="list" label="本月名单" align="center" width="82" />
    <el-table-column prop="achievement" label="销售业绩" align="center" width="82" />
    <el-table-column label="邀约" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.invited.value }}
        </template>
      </el-table-column>
      <el-table-column label="邀约率" align="center">
        <template #default="scope">
          {{ scope.row.invited.radio }}%
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="FTL" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.ftl.value }}
        </template>
      </el-table-column>
      <el-table-column label="FTL试听率" align="center" width="100">
        <template #default="scope">
          {{ scope.row.ftl.radio }}%
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="付费" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.paid.value }}
        </template>
      </el-table-column>
      <el-table-column label="付费率" align="center">
        <template #default="scope">
          {{ scope.row.paid.radio }}%
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="目标" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.goal.value }}
        </template>
      </el-table-column>
      <el-table-column label="目标率" align="center">
        <template #default="scope">
          {{ scope.row.goal.radio }}%
          <Icon icon="solar:map-arrow-up-line-duotone" :size="12" color="#69C982" />
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="高标" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.highGoal.value }}
        </template>
      </el-table-column>
      <el-table-column label="高标率" align="center" class="flex items-center">
        <template #default="scope">
          {{ scope.row.highGoal.radio }}%
          <Icon icon="solar:map-arrow-down-line-duotone" :size="12" color="#F40002" />
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="超高标" align="center">
      <el-table-column label="数量" align="center">
        <template #default="scope">
          {{ scope.row.superGoal.value }}
        </template>
      </el-table-column>
      <el-table-column label="超高标率" align="center" width="100">
        <template #default="scope">
          {{ scope.row.superGoal.radio }}%
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>

  <!-- <Echart :options="list.achievementData.data.achievementOptionsData" :height="280" /> -->
</template>
<script setup lang="ts">
import { getNowDateTime, formatDate, getDaysInCurrentMonth } from '@/utils/formatTime'
import { getRadio } from '@/utils/index'
const list = inject('list')
const date = formatDate(getNowDateTime(), 'YYYY-MM-DD')
const nowDay = getNowDateTime().get('D')
const daysInCurrentMonth = getDaysInCurrentMonth()
const schedule = getRadio(nowDay / daysInCurrentMonth, 0)
const remainder = daysInCurrentMonth - nowDay
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}

.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
