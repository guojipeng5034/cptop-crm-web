<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="search-form -mb-15px" :model="queryParams" ref="queryFormRef" inline label-width="80">
      <el-form-item prop="ployType">
        <el-radio-group v-model="queryParams.ployType" @change="getList">
          <el-radio-button v-for="dict in getIntDictOptions(DICT_TYPE.PLOY_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-radio-group>
      </el-form-item>
      <div>
        <span v-if="!isSort">
          <el-button type="primary" plain auto-insert-space @click="openForm('create')"
            v-hasPermi="['crm:list-owner-assign-ploy:create']">
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button plain auto-insert-space @click="handleSort" v-hasPermi="['crm:list-owner-assign-ploy:update']">
            <Icon icon="ep:sort" class="mr-5px" /> 排序
          </el-button>
        </span>
        <span v-else>
          <el-button type="primary" plain auto-insert-space @click="handleSave"
            v-hasPermi="['crm:list-owner-assign-ploy:update']">
            <Icon icon="ep:check" class="mr-5px" /> 保存
          </el-button>
          <el-button plain auto-insert-space @click="getList" v-hasPermi="['crm:list-owner-assign-ploy:update']">
            <Icon icon="ep:close" class="mr-5px" /> 取消
          </el-button>
        </span>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe row-key="id">
      <el-table-column label="规则名称" align="center" fixed prop="ployName" min-width="200" />
      <el-table-column v-if="queryParams.ployType === 0" label="推广业务线" align="center" prop="promotionBusinessLineId"
        min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.CRM_PROMOTE_BUSINESS_LINES" :value="scope.row.promotionBusinessLineId" />
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" fixed prop="ployOrder" min-width="120" />
      <el-table-column v-if="queryParams.ployType === 0" label="渠道" align="center" prop="channel" min-width="120" />
      <el-table-column v-if="queryParams.ployType === 1" label="推荐人归属顾问的部门" align="center"
        prop="referrerMentorDeptNames" min-width="270">
        <template #default="scope">
          <template
            v-if="scope.row.referrerMentorDeptNames && Array.isArray(scope.row.referrerMentorDeptNames.value) && scope.row.referrerMentorDeptNames.value.length">
            <a-tag
              v-for="(dept, index) in scope.row.referrerMentorDeptNames.value.slice(0, scope.row.referrerMentorDeptNames.showMore ? undefined : 3)"
              :key="index" color="blue" class="m-r-1">
              {{ dept }}
            </a-tag>
            <a-tag v-show="scope.row.referrerMentorDeptNames.value.length > 3" color="magenta" style="cursor: pointer;"
              @click="scope.row.referrerMentorDeptNames.showMore = !scope.row.referrerMentorDeptNames.showMore">
              {{ scope.row.referrerMentorDeptNames.showMore ? '收起' : `+${scope.row.referrerMentorDeptNames.value.length
                - 3}` }}
            </a-tag>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="queryParams.ployType === 3" label="Mentor部门" align="center" prop="mentorDeptNames"
        min-width="270">
        <template #default="scope">
          <template
            v-if="scope.row.mentorDeptNames && Array.isArray(scope.row.mentorDeptNames.value) && scope.row.mentorDeptNames.value.length">
            <a-tag
              v-for="(dept, index) in scope.row.mentorDeptNames.value.slice(0, scope.row.mentorDeptNames.showMore ? undefined : 3)"
              :key="index" color="blue" class="m-r-1">
              {{ dept }}
            </a-tag>
            <a-tag v-show="scope.row.mentorDeptNames.value.length > 3" color="magenta" style="cursor: pointer;"
              @click="scope.row.mentorDeptNames.showMore = !scope.row.mentorDeptNames.showMore">
              {{ scope.row.mentorDeptNames.showMore ? '收起' : `+${scope.row.mentorDeptNames.value.length - 3}` }}
            </a-tag>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="queryParams.ployType === 3" label="是否是代理" align="center" prop="isAgency" min-width="140">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.INFRA_BOOLEAN_INTEGER" :value="scope.row.isAgency" />
        </template>
      </el-table-column>
      <el-table-column label="分配策略" align="center" prop="assignStrategy" min-width="120">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ASSIGN_STRATEGY" :value="scope.row.assignStrategy" />
        </template>
      </el-table-column>
      <el-table-column label="分配目标" align="center" prop="assignTarget" min-width="180">
        <template #default="scope">
          <arco-tag :type="DICT_TYPE.ASSIGN_TARGET" :value="scope.row.assignTarget" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="ployEnable" min-width="110">
        <template #default="scope">
          <el-switch v-model="scope.row.ployEnable" :active-value="1" :inactive-value="0" inline-prompt active-text="启用"
            inactive-text="停用" @change="handleStatusChange(scope.row)"
            v-hasPermi="['crm:channel-natural-flow:update']" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creatorName" min-width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatterYMDHm" min-width="160" />
      <el-table-column label="备注" align="center" prop="ployRemark" min-width="180" />
      <el-table-column label="操作" align="center" fixed="right" min-width="140">
        <template #default="scope">
          <el-button v-if="!isSort" link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['crm:list-owner-assign-ploy:update']">
            编辑
          </el-button>
          <span v-else class="flex justify-center items-center gap-3">
            <Icon icon="material-symbols:drag-pan-rounded" :size="18" class="cursor-move" />
            <Icon icon="lsicon:top-filled" :size="18" class="cursor-pointer" @click="handleMoveToTop(scope.$index)" />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 规则管理 表单 -->
  <PloyForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatterYMDHm } from '@/utils/formatTime'
import { ListOwnerAssignPloyApi, ListOwnerAssignPloyVO } from '@/api/crm/customer/assign/ploy'
import PloyForm from './PloyForm.vue'
import Sortable from 'sortablejs'

/** 规则管理 列表 */
defineOptions({ name: 'AssignPloy' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const list = ref<ListOwnerAssignPloyVO[]>([]) // 列表的数据
const isSort = ref(false) // 是否在拖拽
const sortableInstance = ref()
const queryFormRef = ref() // 搜索的表单

/* 请求参数 */
const queryParams = reactive({
  ployType: 0 // 规则类型
})

/** 查询列表 */
const getList = async () => {
  handleCancel()
  loading.value = true
  try {
    list.value = await ListOwnerAssignPloyApi.getListOwnerAssignPloyList(queryParams)
    list.value = list.value.map(item => {
      return ({
        ...item,
        referrerMentorDeptNames: {
          value: item.referrerMentorDeptNames,
          showMore: false
        },
        mentorDeptNames: {
          value: item.mentorDeptNames,
          showMore: false
        }
      })
    })
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 修改状态 */
const handleStatusChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.ployEnable === 1 ? '启用' : '停用'
    await message.confirm(`确认要${text}该规则吗?`)
    // 发起修改状态
    await ListOwnerAssignPloyApi.updateListOwnerAssignPloy(row)
  } catch {
    // 取消后，进行恢复按钮
    row.ployEnable =
      row.ployEnable === 1 ? 0 : 1
  }
  getList()
}

// 更新优先级序号
const updateOrderNumbers = () => {
  list.value.forEach((item, index) => {
    item.ployOrder = index + 1
  })
}

/* 置顶 */
const handleMoveToTop = (index) => {
  const temp = list.value[index]
  list.value.splice(index, 1) // 从原位置移除
  list.value.unshift(temp) // 添加到数组开头
  updateOrderNumbers()
  ElMessage.success('置顶成功')
}

/* 排序操作 */
const handleSort = () => {
  isSort.value = true
  sortableInstance.value.option('disabled', false) // 启用拖拽
}

/* 保存排序结果 */
const handleSave = async () => {
  loading.value = true
  try {
    await ListOwnerAssignPloyApi.updateBatchListOwnerAssignPloy(list.value)
    message.success('保存排序成功')
  } finally {
    loading.value = false
  }
  getList()
}

/* 取消操作 */
const handleCancel = () => {
  isSort.value = false
  sortableInstance.value.option('disabled', true) // 禁用拖拽
}

/* 初始化拖拽 */
const initSortable = () => {
  const table = document.querySelector('.el-table__body-wrapper tbody')
  sortableInstance.value = Sortable.create(table, {
    animation: 150,
    onEnd: ({ newIndex, oldIndex }) => {
      const temp = list.value[oldIndex]
      list.value.splice(oldIndex, 1)
      list.value.splice(newIndex, 0, temp)
      updateOrderNumbers()
    },
  })
}

/** 初始化 **/
onMounted(() => {
  initSortable()
  getList()
})
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;

  :deep(.el-form-item__label) {
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
}
</style>