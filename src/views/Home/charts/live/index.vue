<template>
  <el-skeleton :loading="false" animated>
    <el-row :gutter="20" justify="space-between">
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Source />
      </el-col>
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Renew />
      </el-col>
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Clock />
      </el-col>
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Activity />
      </el-col>
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Award />
      </el-col>
      <el-col :xl="props.span" :lg="props.span" :md="8" :sm="24" :xs="24">
        <Package />
      </el-col>
    </el-row>
  </el-skeleton>
</template>

<script setup lang="ts">
import Source from '@/views/Home/charts/live/source/index.vue'
import Renew from '@/views/Home/charts/live/renew/index.vue'
import Clock from '@/views/Home/charts/live/clock/index.vue'
import Activity from '@/views/Home/charts/live/activity/index.vue'
import Award from '@/views/Home/charts/live/award/index.vue'
import Package from '@/views/Home/charts/live/package/index.vue'
const props = defineProps({
  span: {
    type: Number,
    required: true,
    default: 8,
  },
})
</script>