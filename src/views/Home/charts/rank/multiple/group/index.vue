<template>
  <h3 class="text-center m-0">小组排名</h3>
  <div class="flex justify-between items-center mt-2 mb-4">
    <div>
      <el-link
        v-for="item in links.leftLink"
        :key="item.id"
        :underline="false"
        class="mr-2"
        :class="{'isActive': item.active === true}"
        @click="leftLinkActive(item.id)"
      >
        {{ item.name }}
      </el-link>
    </div>
    <div>
      <el-link
        v-for="item in links.rightLink"
        :key="item.id"
        :underline="false"
        class="mr-2"
        :class="{'isActive': item.active === true}"
        @click="rightLinkActive(item.id)"
      >
        {{ item.name }}
      </el-link>
    </div>
  </div>
  <el-card v-for="item in list.rankData.data.multiple.group" :key="item.id" class="h-10 mb-2 ranking" shadow="always">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <Icon :icon="item.icon" :size="20" />
        <span class="ml-12">{{ item.name }}</span>
      </div>
      <span>{{ item.achievement }}</span>
    </div>
  </el-card>
  <el-pagination layout="next, pager, prev" :total="50" class="flex flex-row-reverse"/>
</template>
<script setup lang="ts">
const list = inject('list')
list.rankData.data.multiple.group.find((item => item.id === 1)).icon = 'noto:1st-place-medal'
list.rankData.data.multiple.group.find((item => item.id === 2)).icon = 'noto:2nd-place-medal'
list.rankData.data.multiple.group.find((item => item.id === 3)).icon = 'noto:3rd-place-medal'
list.rankData.data.multiple.group
  .filter(item => ![1, 2, 3].includes(item.id))
  .forEach(item => item.icon = 'solar:medal-ribbons-star-linear')
const links = ref({
  leftLink: [
    { id: 1, name: '总业绩', value: '', active: true },
    { id: 2, name: '新签数', value: '', active: false },
    { id: 3, name: '通时',  value: '', active: false },
  ],
  rightLink: [
    { id: 1, name: '今日', value: '', active: true },
    { id: 2, name: '本周', value: '', active: false },
    { id: 3, name: '本月', value: '', active: false },
  ]
})
const leftLinkActive = (id) => {
  links.value.leftLink.forEach(item => item.active = false)
  const isActiveLInk = links.value.leftLink.find(item => item.id === id)
  isActiveLInk!.active = true
}
const rightLinkActive = (id) => {
  links.value.rightLink.forEach(item => item.active = false)
  const isActiveLInk = links.value.rightLink.find(item => item.id === id)
  isActiveLInk!.active = true
}
</script>
<style scoped lang="scss">
.ranking {
  --el-card-padding: 10px;
}
.isActive {
  color: var(--el-color-primary);
  font-weight: 700;
}
</style>