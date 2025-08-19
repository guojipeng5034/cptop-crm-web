<template>
  <el-card shadow="never" class="mt-8px">
    <template #header>
      <span>{{ list.rankData.title }}</span>
    </template>
    <el-skeleton :loading="list.rankData.loading" animated>
      <el-row :gutter="30" justify="space-between">
        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <PersonalRank />
        </el-col>
        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <GroupRank />
        </el-col>
        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <DeptRank />
        </el-col>
      </el-row>
    </el-skeleton>
  </el-card>
</template>
<script setup lang="ts">
import PersonalRank from '@/views/Home/charts/rank/multiple/personal/index.vue'
import GroupRank from '@/views/Home/charts/rank/multiple/group/index.vue'
import DeptRank from '@/views/Home/charts/rank/multiple/dept/index.vue'
const list = inject('list')
</script>
<style scoped lang="scss">
.ranking {
  --el-card-padding: 10px;
}
</style>