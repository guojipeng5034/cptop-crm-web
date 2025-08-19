<template>
  <el-skeleton :loading="list.commonData.loading" animated>
    <el-row>
      <el-col v-for="(common, index) in list.commonData.data" :key="common.id" :span="8"
        :class="{ 'mt-8 mb-4': index > 2 }">
        <div class="flex justify-center items-center">
          <el-link type="default" :underline="false" @click="linkToPage(common.link)">
            <!-- <span class="text-4">{{ common.name }}</span> -->
            <div class="icon-container">
              <Icon :icon="common.icon" :size="20" class="Icon" />
              <span>{{ common.name }}</span>
            </div>
          </el-link>
        </div>
      </el-col>
    </el-row>
  </el-skeleton>
</template>
<script setup lang="ts">
import router from '@/router'
const list = inject('list')
const linkToPage = (link: string) => {
  router.push({
    name: link,
    params: {}
  })
}
</script>
<style scoped lang="scss">
.icon-container {
  position: relative;
  width: 40px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
}

// .icon-container::before {
//   position: absolute;
//   content: '';
//   inset: 30px;
//   box-shadow: 0 0 0 10px var(#fff), 0 0 0 20px var(#222), 0 0 0 22px var(#fff);
//   transition: 0.5s;
// }

.icon-container .Icon {
  font-size: 2em;
  transition: 0.5s;
  // color: var(#fff);
  opacity: 1;
}

.icon-container:hover .Icon {
  // color: var(#fff);
  transform: translateY(-40%);
}

.icon-container span {
  position: absolute;
  // color: var(#fff);
  opacity: 0;
  transition: 0.5s;
  transform: scale(0) translateY(200%);
}

.icon-container:hover span {
  opacity: 1;
  transform: scale(1) translateY(100%);
}
</style>