<template>
  <el-segmented v-model="commissionerValue" :options="commissionerOptions" size="large" />
  <br />
  <Cpzh v-if="commissionerValue==='CPZH'" />
  <Cn v-if="commissionerValue==='CN'" />
  <Adt v-if="commissionerValue==='ADT'" />
</template>
<script lang="ts" setup>
import Cpzh from '@/views/Home/dashboard/commissioner/cpzh/index.vue'
import Cn from '@/views/Home/dashboard/commissioner/cn/index.vue'
import Adt from '@/views/Home/dashboard/commissioner/adt/index.vue'
const commissionerValue = ref('CPZH')
const commissionerOptions = ['CPZH', 'CN', 'ADT']
</script> 