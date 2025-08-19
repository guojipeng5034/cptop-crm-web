<template>
  <!-- 业绩 -->
  <AchievementWithTitle :role="'组员'" :roleOptions="advicerOptions" :roleValue="achievementAdvicerValue" @change-value="changeAchievementAdvicerValue" />
  <AchievementWithTitle :role="'各组'" :roleOptions="teamOptions" :roleValue="achievementTeamValue" @change-value="changeAchievementTeamValue" />
  <!-- 实时数据 -->
  <LiveWithTitle :span="8" :role="'组员'" :roleOptions="advicerOptions" :roleValue="liveAdvicerValue" @change-value="changeLiveAdvicerValue" />
  <LiveWithTitle :span="8" :role="'各组'" :roleOptions="teamOptions" :roleValue="liveTeamValue" @change-value="changeLiveTeamValue" />
  <!-- 业绩排名 -->
  <RankWithTitle />
  <!-- 通信 -->
  <CommunicationWithTitle :role="'组员'" :roleOptions="advicerOptions" :roleValue="communicationAdvicerValue" @change-value="changeCommunicationAdvicerValue" />
  <CommunicationWithTitle :role="'各组'" :roleOptions="teamOptions" :roleValue="communicationTeamValue" @change-value="changeCommunicationTeamValue" />
</template>
<script lang="ts" setup>
import AchievementWithTitle from '@/views/Home/chartsWithTitle/achievementWithTitle/index.vue'
import LiveWithTitle from '@/views/Home/chartsWithTitle/liveWithTitle/index.vue'
import CommunicationWithTitle from '@/views/Home/chartsWithTitle/communicationWithTitle/index.vue'
import RankWithTitle from '@/views/Home/chartsWithTitle/rankWithTitle/multiple/index.vue'
const advicerOptions = [
  { value: '总计', label: '总计', icon: 'lets-icons:notebook-light' },
  { value: '顾问1', label: '顾问1', icon: 'la:user' },
  { value: '顾问2', label: '顾问2', icon: 'la:user' },
  { value: '顾问3', label: '顾问3', icon: 'la:user' },
  { value: '顾问4', label: '顾问4', icon: 'la:user' },
  { value: '顾问5', label: '顾问5', icon: 'la:user' },
]
const teamOptions = [
  { value: 'xx队1', label: 'xx队1', icon: 'la:user' },
  { value: 'xx队2', label: 'xx队2', icon: 'la:user' },
  { value: 'xx队3', label: 'xx队3', icon: 'la:user' },
  { value: 'xx队4', label: 'xx队4', icon: 'la:user' },
  { value: 'xx队5', label: 'xx队5', icon: 'la:user' },
  { value: 'xx队6', label: 'xx队6', icon: 'la:user' },
]
const achievementAdvicerValue = ref('总计')
const achievementTeamValue = ref('xx队1')
const liveAdvicerValue = ref('总计')
const liveTeamValue = ref('xx队1')
const communicationAdvicerValue = ref('总计')
const communicationTeamValue = ref('xx队1')
const changeAchievementAdvicerValue = (val) => {
  achievementAdvicerValue.value = val
}
const changeAchievementTeamValue = (val) => {
  achievementTeamValue.value = val
}
const changeLiveAdvicerValue = (val) => {
  liveAdvicerValue.value = val
}
const changeLiveTeamValue = (val) => {
  liveTeamValue.value = val
}
const changeCommunicationAdvicerValue = (val) => {
  communicationAdvicerValue.value = val
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