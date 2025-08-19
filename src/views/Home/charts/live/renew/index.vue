<template>
  <el-card shadow="hover" class="mb-8px">
    <!-- <el-skeleton :loading="list.liveData.data.renewOptionsData.loading" animated>
      <Echart :options="list.liveData.data.renewOptionsData" :height="251" />
      <div class="flex justify-center">续费率：80%</div>
    </el-skeleton> -->
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
</script>