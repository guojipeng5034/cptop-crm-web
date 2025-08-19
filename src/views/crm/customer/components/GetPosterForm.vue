<template>
  <Dialog title="获取海报" v-model="dialogVisible" width="500">
    <div class="flex justify-center mb-4 font-700 font-size-5">
      <span>{{ customerName?customerName : "未命名" }}</span>
      <span class="mx-2">:</span>
      <span>{{ customerId }}</span>
    </div>
    <el-table v-loading="loading" :data="list" stripe border v-if="hasPoster">
      <el-table-column prop="activityName" label="活动名" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary"
            @click="getCompositionPoster(scope.row.activityId, customerId, referrerUid, scope.row.registerUrls)">
            获取海报
          </el-button>
          <el-popover width="450" :visible="scope.row.popoverVisible" title="海报列表" trigger="click" placement="right"
            ref="popoverRef">
            <template #reference>
              <el-button link type="success" ref="registerRef"
                @click="toRegisterUrl(scope.row.registerUrls, scope.row.activityId)" v-click-outside="onClickOutside">
                活动链接
              </el-button>
            </template>
            <template #default>
              <el-table :data="scope.row.registerUrls">
                <el-table-column property="pageName" label="海报名" align="center" width="120" />
                <el-table-column label="操作" align="center" width="300">
                  <template #default="innerScope">
                    <el-button link type="primary" @click="toBlank(innerScope.row.url)">
                      打开
                    </el-button>
                    <el-button link type="success" @click="getPosterShortUrl(innerScope.row.url)">
                      获取短链接
                    </el-button>
                    <el-tooltip effect="light" content="点击复制" placement="top">
                      <el-button link type="success" :disabled="!innerScope.row.hasFacebook" @click="copyFacebookShareUrl(innerScope.row.url)">
                        Facebook分享链接
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="image-container">
      <div v-for="(item, index) in posterList" :key="item.pageName" class="image-card" :class="lastImageClass(index)">
        <div class="text-center h-5">{{ item.pageName? item.pageName : '暂无' }}</div>
        <el-image class="image" :src="item.posterUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
          :preview-src-list="previewPosterList" :initial-index="index" fit="cover" />
      </div>
    </div>
    <template #footer>
      <el-button v-show="!hasPoster" class="float-left"
        @click="reset(customerId, referrerUid, agencyFlag, customerName)">返回</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ClickOutside as vClickOutside } from "element-plus"
import { handleCopy } from '@/utils/common'
import { BaseApi } from '@/api/crm/base'
import { PosterApi } from '@/api/crm/sales/poster/poster'
import { RenewApi } from '@/api/crm/activity/renew'
import { ActivityClockApi } from '@/api/crm/activity/clock'
import { ActivityLevelApi } from '@/api/crm/activity/level'

/** 获取学员海报 表单 */
defineOptions({ name: 'GetPosterForm' })

/* 配置项 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter()
const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const customerId = ref()
const referrerUid = ref('')
const agencyFlag = ref(false)
const hasPoster = ref(true)
const posterList = ref([])
const customerName = ref('')

const popoverRef = ref()
const registerRef = ref()

/* 预览海报 */
const previewPosterList = computed(() => {
  return posterList.value.map(item => item.posterUrl)
})

// 处理最后一张海报图样式
const lastImageClass = (index: number) => {
  if ((posterList.value.length % 2 === 1) && (index === posterList.value.length - 1) && (posterList.value.length > 1)) {
    return 'image-card-last'
  }
  return ''
}

/** 打开弹窗 */
const open = async (id: number, uid: string, flag: boolean, type?: string, name: string, adid?: string) => {
  dialogVisible.value = true
  loading.value = true
  reset(id, uid, flag, name)
  try {
    switch (type) {
      case 'renew':
        list.value = await RenewApi.getEffectiveCampaignPoster(id)
        break
      case 'clock':
        list.value = await ActivityClockApi.getEffectiveCampaignPoster(id)
        break
      case 'level':
        list.value = await ActivityLevelApi.getEffectiveCampaignPoster(id)
        break
      default:
        list.value = await PosterApi.getEffectiveCampaignPoster(id)
    }
  } finally {
    loading.value = false
  }
  list.value.forEach(item => {
    item.popoverVisible = false
  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/* 获取海报 */
const getCompositionPoster = async (activityId: number, customerId: number, referrerUid: string, url: string | null) => {
  if (!url) {
    try {
      await message.confirm('请先创建该活动基础海报, 是否跳转至海报管理页面创建该活动基础海报？')
      push({ name: 'PosterMag' })
    } catch (e) {
      console.log(e)
    }
    return
  }
  loading.value = true
  try {
    posterList.value = await PosterApi.getCompositionPoster(activityId, customerId, referrerUid)
    hasPoster.value = false
    message.success('海报获取成功')
  } catch {
    message.error('海报获取失败')
  } finally {
    loading.value = false
  }
}

/* 跳转活动链接 */
const toRegisterUrl = async (urls: string, activityId: number) => {
  if (!urls || urls.length === 0) {
    try {
      await message.confirm('请先创建该活动基础海报, 是否跳转至海报管理页面创建该活动基础海报？')
      push({ name: 'PosterMag' })
    } catch (e) {
      console.log(e)
    }
    return
  }
  list.value.forEach(item => {
    if (item.activityId === activityId) {
      item.popoverVisible = !item.popoverVisible
    }
  })
}

/* 跳转 */
const toBlank = (url) => {
  if (agencyFlag.value === true) {
    window.open(url, '_blank')
  } else {
    window.open(url + '&referrerUid=' + referrerUid.value, '_blank')
  }
}

/* 获取短链接 */
const getPosterShortUrl = async (url: string) => {
  const shortUrlObj = await BaseApi.shortUrl(url + '&referrerUid=' + referrerUid.value)
  handleCopy(shortUrlObj.shortUrl)
}

/* 获取短链接 */
const copyFacebookShareUrl = (url: string) => {
  // 从传入的 url 中获取 adid
  const urlObj = new URL(url)
  const adid = urlObj.searchParams.get('adid')
  // 拼接 facebook 分享链接
  const facebookShareUrl = 
    import.meta.env.VITE_BASE_URL + 
    `/crm/facebook/page?agencyFlag=${agencyFlag.value}&referrerUid=${referrerUid.value}&adid=${adid}`
  handleCopy(facebookShareUrl)
}

/* 点击空白处隐藏 */
const onClickOutside = (e: any) => {
  list.value.forEach(item => {
    if (item.popoverVisible) {
      item.popoverVisible = false
    }
  })
}

/* 重置 */
const reset = (id: number, uid: string, flag: boolean, name: string) => {
  customerId.value = id
  referrerUid.value = uid
  agencyFlag.value = flag
  hasPoster.value = true
  posterList.value = []
  customerName.value = name
}
</script>
<style scoped lang="scss">
.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .image-card {
    margin-top: 10px;
    width: 40%;

    .image {
      margin-top: 5px;
      /* margin-right: 20px; */
      transition: transform 0.5s ease, box-shadow 0.5s ease;

      &:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      }
    }

    &:nth-child(even) {
      margin-left: 20px;
    }
  }

  .image-card-last {
    margin-left: 30px;
    margin-right: auto;
  }
}
</style>