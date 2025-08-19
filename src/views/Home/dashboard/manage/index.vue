<template>
  <el-segmented v-model="manageValue" :options="manageOptions" size="large" />
  <br />
  <Dept v-if="manageValue==='部门'" />
  <Team v-if="manageValue==='xxx队'" />
</template>
<script lang="ts" setup>
import Dept from '@/views/Home/dashboard/manage/dept/index.vue'
import Team from '@/views/Home/dashboard/manage/team/index.vue'
const manageValue = ref('部门')
const manageOptions = ['部门', 'xxx队']
</script> 