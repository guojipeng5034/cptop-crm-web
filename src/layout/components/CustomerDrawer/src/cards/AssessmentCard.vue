<template>
  <el-card class="assessment-info mt-20px">
    <template #header>
      <span class="font-size-4 font-700">老师评价</span>
    </template>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <div class="mb-4">
            <!-- 搜索工作栏 -->
            <el-form
              class="-mb-15px search-form"
              :model="queryParams"
              ref="queryFormRef"
              inline
              label-width="90"
            >
              <el-row>
                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                      v-model="queryParams.startTime"
                      value-format="x"
                      type="date"
                      placeholder="请选择开始时间"
                      class="!w-240px"
                    />
                  </el-form-item>
                </el-col>

                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                      v-model="queryParams.endTime"
                      value-format="x"
                      type="date"
                      placeholder="请选择结束时间"
                      class="!w-240px"
                    />
                  </el-form-item>
                </el-col>

                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="专注度" prop="attitude">
                    <el-select
                      v-model="queryParams.attitude"
                      placeholder="请选择或检索专注度"
                      clearable
                      filterable
                      class="!w-240px"
                    >
                      <el-option
                        v-for="dict in getStrDictOptions(DICT_TYPE.ATTITUDE_TYPE)"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                  <el-form-item label="课程难易度" prop="difficultyMatching">
                    <el-select
                      v-model="queryParams.difficultyMatching"
                      placeholder="请选择或检索课程难易度"
                      clearable
                      filterable
                      class="!w-240px"
                    >
                      <el-option
                        v-for="dict in getStrDictOptions(DICT_TYPE.DIFFICULTY_MATCHING_TYPE)"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button @click="handleQuery">
                  <Icon icon="ep:search" class="mr-5px" /> 搜索
                </el-button>
                <el-button @click="resetQuery">
                  <Icon icon="ep:refresh" class="mr-5px" /> 重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 列表 -->
          <el-table
            v-loading="loading"
            :data="list"
            stripe
            border
            :header-cell-style="{ backgroundColor: 'var(--el-fill-color-light)' }"
            :row-key="(row) => row.id"
          >
            <el-table-column
              label="开始时间"
              align="center"
              prop="startTime"
              width="110"
              :formatter="timeWithoutSecondFormat"
            />
            <el-table-column label="老师姓名" align="center" prop="teacherName" min-width="110" />
            <el-table-column label="专注度" align="center" prop="attitude">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.ATTITUDE_TYPE" :value="scope.row.attitude" />
              </template>
            </el-table-column>
            <el-table-column label="课程难易度" align="center" prop="difficultyMatching">
              <template #default="scope">
                <arco-tag
                  :type="DICT_TYPE.DIFFICULTY_MATCHING_TYPE"
                  :value="scope.row.difficultyMatching"
                />
              </template>
            </el-table-column>

            <el-table-column label="课程链接" align="center" prop="courseLink" width="220">
              <template #default="scope">
                <el-link
                  type="primary"
                  :href="scope.row.courseLink"
                  target="_blank"
                  :disabled="!scope.row.courseLink"
                >
                  <Icon icon="qlementine-icons:jump-16" class="mr-2" />打开
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
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
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { getCurrentDayStartTime, getCurrentYearStartDate } from '@/utils/formatTime'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import { CustomerLessonApi, LessonAssessmentVO } from '@/api/lesson/lessonAssessment'

const props = defineProps({
  studentUid: {
    type: String,
    default: ''
  }
})

const { t } = useI18n() // 国际化
const message = useMessage()

const activeNames = ref('') // 控制折叠展开
const loading = ref(false)
const list = ref<LessonAssessmentVO[]>([]) //列表的数据
const total = ref(0) // 列表的总页数

/* 请求参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  studentUid: undefined,
  startTime: getCurrentYearStartDate('YYYY-MM-DD', true),
  endTime: getCurrentDayStartTime(),
  attitude: undefined,
  difficultyMatching: undefined,
  orderBy: []
})
const queryFormRef = ref() // 搜索的表单

/* 展开/收起 */
const handleMore = () => {
  if (!props.studentUid) {
    message.notify('当前学员还没有QQE账号，请创建QQE账号')
    return
  }
  if (!activeNames.value) {
    activeNames.value = 'more'
    getList()
  } else {
    activeNames.value = ''
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  queryParams.studentUid = props.studentUid

  try {
    const res = await CustomerLessonApi.getLessonAssessmentPage(queryParams)
    list.value = res.list
    total.value = res.total
  } catch (error) {
    message.error('获取老师评价失败')
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
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

.assessment-info {
  .search-form {
    :deep(.el-form-item__label) {
      display: inline-block;
      text-align: justify;
      text-align-last: justify;
    }
  }
}
</style>
