<template>
  <el-card shadow="hover" class="mb-8px relative">
    <!-- <el-skeleton :loading="list.liveData.data.sourceOptionsData.loading" animated>
      <Echart :options="list.liveData.data.sourceOptionsData" :height="272" />
      <div class="absolute top-12 right-4">
        <el-link 
          v-for="item in links"
          :key="item.id"
          :underline="false"
          class="mr-2"
          :class="{'isActive': item.active === true}"
          @click="linkClick(item.id)"
        >
          {{ item.name }}
        </el-link>
      </div>
    </el-skeleton> -->
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
const links = ref([
  { id: 1, name: '昨日', value: '', active: false },
  { id: 2, name: '今日', value: '', active: true },
  { id: 3, name: '本周', value: '', active: false },
  { id: 4, name: '本月', value: '', active: false },
])
const linkClick = (id) => {
  links.value.forEach(item => item.active = false)
  const isActiveLInk = links.value.find(item => item.id === id)
  isActiveLInk!.active = true
}
</script>
<style scope lang="scss">
.isActive {
  color: var(--el-color-primary);
  font-weight: 700;
}
</style>