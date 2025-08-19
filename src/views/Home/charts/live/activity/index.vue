<template>
  <el-card shadow="hover" class="mb-8px">
    <!-- <el-skeleton :loading="list.liveData.data.activityOptionsData.loading" animated>
      <Echart :options="list.liveData.data.activityOptionsData" :height="240" />
      <div class="flex justify-center">
        <el-select v-model="value" placeholder="请选择活动" class="w-240px!">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </el-skeleton> -->
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
</script>