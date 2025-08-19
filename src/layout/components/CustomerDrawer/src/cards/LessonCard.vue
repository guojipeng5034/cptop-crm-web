<template>
  <el-card class="lesson-info mt-20px">
    <template #header>
      <span class="font-size-4 font-700">课程进度</span>
    </template>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <el-table
            v-loading="loading"
            :data="list"
            stripe
            border
            class="customer-lesson-table"
            :row-key="(row) => row.id"
          >
            <el-table-column label="教材名称" align="center" prop="textbookName" min-width="120" />
            <!-- <el-table-column label="教材ID" align="center" prop="textbookId" width="180">
              <template #default="scope">
                <el-button text type="primary" @click="handleCopy">{{
                  scope.row.textbookId
                }}</el-button>
              </template>
            </el-table-column> -->

            <el-table-column label="课程进度" align="center">
              <el-table-column label="已学页数" align="center" prop="learnedPages" width="120" />
              <el-table-column label="总页数" align="center" prop="totalPages" width="120" />
              <el-table-column label="完成进度" align="center" prop="completedRate" width="120">
                <template #default="scope">
                  <el-progress
                    type="circle"
                    width="50"
                    :percentage="convertToNumPercent(scope.row.completedRate)"
                    :color="[
                      { color: '#f56c6c', percentage: 20 },
                      { color: '#e6a23c', percentage: 40 },
                      { color: '#6f7ad3', percentage: 60 },
                      { color: '#1989fa', percentage: 80 },
                      { color: '#5cb87a', percentage: 100 }
                    ]"
                  >
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              prop="currentLearningFlag"
              label="是否当前在学课程"
              align="center"
              width="140"
            >
              <template #default="scope">
                <arco-tag
                  :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
                  :value="scope.row.currentLearningFlag"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- 折叠展开按钮 -->
    <el-divider class="!my-15px">
      <el-button type="primary" link @click="handleMore">
        {{ activeNames ? '收起' : '展开' }}
        <Icon
          icon="ep:arrow-up-bold"
          class="ml-0.5"
          :class="activeNames ? 'arrow-down' : 'arrow-up'"
        />
      </el-button>
    </el-divider>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { CustomerLessonApi, CustomerLessonVO } from '@/api/lesson/lessonAssessment'

const props = defineProps({
  studentUid: {
    type: String,
    default: ''
  }
})
const message = useMessage()

const activeNames = ref('') // 控制折叠展开
const loading = ref(false) // 加载中
const list = ref<CustomerLessonVO[]>([]) // 课程信息列表的数据

/* 展开/收起 */
const handleMore = () => {
  if (!activeNames.value) {
    activeNames.value = 'more'
    getCustomerLessonList()
  } else {
    activeNames.value = ''
  }
}

/* 获取课程信息 */
const getCustomerLessonList = async () => {
  loading.value = true
  try {
    const res = await CustomerLessonApi.getLearnedTextBookByStudentId(props.studentUid)
    list.value = res
  } catch (error) {
    message.error('获取课程信息失败')
  } finally {
    loading.value = false
  }
}

/* 课程进度百分比转换 */
const convertToNumPercent = (percentage: string) => {
  if (!percentage) return 0
  return Number(percentage.replace('%', ''))
}
</script>
<style scoped lang="scss">
/* 更多点击时箭头方向的的改变 */
.arrow-up {
  transform: rotate(180deg);
  transition: all 0.3s;
}

.arrow-down {
  transform: rotate(0);
  transition: all 0.3s;
}
.customer-lesson-table {
  /* 进度条 */
  .percentage-value {
    display: block;
    font-size: 16px;
  }
}
</style>
