<template>
  <el-segmented v-model="groupValue" :options="groupOptions" size="large" />
  <br />
  <Team v-if="groupValue==='小组'" />
  <Person v-else-if="groupValue==='个人'" />
</template>
<script lang="ts" setup>
import Team from '@/views/Home/dashboard/group/team/index.vue'
import Person from '@/views/Home/dashboard/group/person/index.vue'
const groupValue = ref('小组')
const groupOptions = ['小组', '个人']
</script> 