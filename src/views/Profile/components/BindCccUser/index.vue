<template>
  <div v-loading="userLoading">
    <el-empty v-if="!cccUserInfo" description="如果暂无阿里云外呼账号，请联系经理创建账号">
      <el-button type="primary" size="large" @click="bind(userInfo?.id)">绑定账号</el-button>
    </el-empty>
    <div v-else>
      <el-descriptions title="阿里云外呼账号" border :column="2">
        <el-descriptions-item label="登录名">{{ cccUserInfo.loginName }}</el-descriptions-item>
        <el-descriptions-item label="展示名">{{ cccUserInfo.displayName }}</el-descriptions-item>
        <el-descriptions-item label="邮箱地址">{{ cccUserInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="电话号码">{{ cccUserInfo.mobile }}</el-descriptions-item>
        <el-descriptions-item label="角色名称">{{ cccUserInfo.roleName }}</el-descriptions-item>
        <el-descriptions-item label="技能等级">{{ cccUserInfo.level }}</el-descriptions-item>
        <el-descriptions-item label="技能">
          <el-tag v-for="tag in cccUserInfo.skillLevelList" :key="tag">{{ tag }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="text-center m-t-3">
        <XButton title="重新绑定" size="large" type="primary" @click="bind(userInfo?.id)" />
      </div>
    </div>
  </div>
  <BindCccUser ref="bindCccUserRef" @success="getList" />
</template>
<script lang="ts" setup>
import { getUserProfile, ProfileVO } from '@/api/system/user/profile'
import { CccUserApi } from '@/api/crm/ccc/user'
import BindCccUser from './BindCccUser.vue'

defineOptions({ name: 'BindCccUser' })

/* 配置项 */
const userInfo = ref<ProfileVO>()
const cccUserInfo = ref()
const userLoading = ref(true)
const bindCccUserRef = ref()

/* 绑定账号 */
const bind = (id) => {
  bindCccUserRef.value.open(id)
}

const getList = async () => {
  try {
    userLoading.value = true
    cccUserInfo.value = await CccUserApi.getAliyunCCCUser(userInfo.value?.id)
  } catch (e) {
    console.log(e)
  } finally {
    userLoading.value = false
  }
}

onMounted(async () => {
  userInfo.value = await getUserProfile()
  getList()
})
</script>
<style scoped lang="scss">
:deep(.el-empty__description) {
  p {
    font-size: 18px;
  }
}
</style>
