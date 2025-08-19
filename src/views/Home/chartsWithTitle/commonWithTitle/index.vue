<template>
  <el-card shadow="never" class="h-193.5px">
    <template #header>
      <span>{{ list.commonData.title }}</span>
    </template>
    <Common />
  </el-card>
</template>
<script setup lang="ts">
import Common from '@/views/Home/charts/common/index.vue'
const list = inject('list')
</script>