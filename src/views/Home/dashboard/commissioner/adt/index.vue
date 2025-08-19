<template>
  <!-- 业绩 -->
  <AchievementWithTitle :role="'部门'" :roleOptions="deptOptions" :roleValue="achievementDeptValue" @change-value="changeAchievementDeptValue" />
  <AchievementWithTitle :role="'各组'" :roleOptions="teamOptions" :roleValue="achievementTeamValue" @change-value="changeAchievementTeamValue" />
  <!-- 实时数据 -->
  <LiveWithTitle :span="8" :role="'部门'" :roleOptions="deptOptions" :roleValue="liveDeptValue" @change-value="changeLiveDeptValue" />
  <LiveWithTitle :span="8" :role="'各组'" :roleOptions="teamOptions" :roleValue="liveTeamValue" @change-value="changeLiveTeamValue" />
  <!-- 业绩排名 -->
  <RankWithTitle />
  <!-- 通信 -->
  <CommunicationWithTitle :role="'部门'" :roleOptions="deptOptions" :roleValue="communicationDeptValue" @change-value="changeCommunicationDeptValue" />
  <CommunicationWithTitle :role="'各组'" :roleOptions="teamOptions" :roleValue="communicationTeamValue" @change-value="changeCommunicationTeamValue" />
</template>
<script lang="ts" setup>
import LeadersWithTitle from '@/views/Home/chartsWithTitle/leadersWithTitle/index.vue'
import AchievementWithTitle from '@/views/Home/chartsWithTitle/achievementWithTitle/index.vue'
import LiveWithTitle from '@/views/Home/chartsWithTitle/liveWithTitle/index.vue'
import CommunicationWithTitle from '@/views/Home/chartsWithTitle/communicationWithTitle/index.vue'
import RankWithTitle from '@/views/Home/chartsWithTitle/rankWithTitle/multiple/index.vue'
const deptOptions = [
  { value: '总计', label: '总计', icon: 'lets-icons:notebook-light' },
  { value: 'ADT一部', label: 'ADT一部', icon: 'la:user' },
  { value: 'ADT二部', label: 'ADT二部', icon: 'la:user' },
  { value: 'ADT三部', label: 'ADT三部', icon: 'la:user' },
]
const teamOptions = [
  { value: 'xx队1', label: 'xx队1', icon: 'la:user' },
  { value: 'xx队2', label: 'xx队2', icon: 'la:user' },
  { value: 'xx队3', label: 'xx队3', icon: 'la:user' },
  { value: 'xx队4', label: 'xx队4', icon: 'la:user' },
  { value: 'xx队5', label: 'xx队5', icon: 'la:user' },
  { value: 'xx队6', label: 'xx队6', icon: 'la:user' },
]
const achievementDeptValue = ref('总计')
const achievementTeamValue = ref('xx队1')
const liveDeptValue = ref('总计')
const liveTeamValue = ref('xx队1')
const communicationDeptValue = ref('总计')
const communicationTeamValue = ref('xx队1')
const changeAchievementDeptValue = (val) => {
  achievementDeptValue.value = val
}
const changeAchievementTeamValue = (val) => {
  achievementTeamValue.value = val
}
const changeLiveDeptValue = (val) => {
  liveDeptValue.value = val
}
const changeLiveTeamValue = (val) => {
  liveTeamValue.value = val
}
const changeCommunicationDeptValue = (val) => {
  communicationDeptValue.value = val
}
const changeCommunicationTeamValue = (val) => {
  communicationTeamValue.value = val
}
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