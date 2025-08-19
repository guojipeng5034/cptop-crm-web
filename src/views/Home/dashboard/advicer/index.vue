<template>
  <el-row class="mt-8px" :gutter="8" justify="space-between">
    <el-col :xl="18" :lg="18" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- Leaders数据 -->
      <LeadersWithTitle />
    </el-col>
    <el-col :xl="6" :lg="6" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 常用功能 -->
      <CommonWithTitle />
    </el-col>
    <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 个人业绩 -->
      <AchievementWithTitle :role="'个人'" />
    </el-col>
    <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 实时数据 -->
      <LiveWithTitle :span="12" />
      <!-- 通信 -->
      <CommunicationWithTitle />
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 业绩排名 -->
      <RankWithTitle />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import LeadersWithTitle from '@/views/Home/chartsWithTitle/leadersWithTitle/index.vue'
import AchievementWithTitle from '@/views/Home/chartsWithTitle/achievementWithTitle/index.vue'
import LiveWithTitle from '@/views/Home/chartsWithTitle/liveWithTitle/index.vue'
import CommunicationWithTitle from '@/views/Home/chartsWithTitle/communicationWithTitle/index.vue'
import CommonWithTitle from '@/views/Home/chartsWithTitle/commonWithTitle/index.vue'
import RankWithTitle from '@/views/Home/chartsWithTitle/rankWithTitle/single/index.vue'
</script>
<style scoped lang="scss">
:deep(.el-card__header) {
  font-size: 1.2rem;
  border-bottom: none;
  font-weight: 700;
  padding: 20px;
  padding-bottom: 0px;
  padding-left: 20px;
}
</style>