<template>
  <el-card shadow="hover" class="mb-8px">
    <!-- <el-skeleton :loading="list.liveData.data.clockOptionsData.loading" animated>
      <Echart :options="list.liveData.data.clockOptionsData" :height="272" />
    </el-skeleton> -->
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
</script>