<template>
  <el-card shadow="hover" class="mb-8px">
    <el-skeleton :loading="list.communicationData.data.communicationOptionsData.loading" animated>
      <Echart :options="list.communicationData.data.communicationOptionsData" :height="280" />
    </el-skeleton>
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
</script>