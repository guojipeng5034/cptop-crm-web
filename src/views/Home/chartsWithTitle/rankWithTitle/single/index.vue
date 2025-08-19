<template>
  <el-card shadow="never" class="mt-8px">
    <template #header>
      <span>{{ list.rankData.title }}</span>
    </template>
    <el-skeleton :loading="list.rankData.loading" animated>
      <Rank />
    </el-skeleton>
  </el-card>
</template>
<script setup lang="ts">
import Rank from '@/views/Home/charts/rank/single/index.vue'
const list = inject('list')
</script>
<style scoped lang="scss">
.ranking {
  --el-card-padding: 10px;
}
</style>