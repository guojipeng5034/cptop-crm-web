<template>
  <el-select v-model="selectedValue" :placeholder="placeholder" multiple collapse-tags collapse-tags-tooltip
    :clearable="clearable" :placement="placement" :loading="loading">
    <template #header>
      <div>
        <el-button type="primary" size="small" @click="handleCheckAll">
          全选
        </el-button>
        <el-button type="info" size="small" @click="handleClearAll">
          清空
        </el-button>
      </div>
      <div class="mt-2 flex justify-between items-center">
        <el-input v-model="queryParams.searchValue" :placeholder="searchPlaceholder" :prefix-icon="Search"
          :disabled="currentChecked" @input="handleSearch" />
        <!-- 当前 -->
        <el-check-tag v-if="showCurrentOption && modelValue.length > 0" v-loading="loading" :checked="currentChecked"
          size="small" type="primary" @change="handleCurrentChange" class="text-center"
          :class="showCurrentOption && modelValue.length > 0 ? 'm-l-2' : ''">
          <Icon icon="octicon:note-16" :size="16" />
        </el-check-tag>
      </div>
    </template>
    <div v-loading="loading">
      <el-option v-for="item in options.list" :key="getItemValue(item)" :label="getItemLabel(item)"
        :value="getItemValue(item)" />
    </div>
    <template #footer v-if="showPagination && !currentChecked">
      <el-pagination size="small" layout="prev, pager, next" :total="options.total" :page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNo" @current-change="fetchData" />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

interface Props {
  modelValue: (string | number)[] | undefined // 选中的值
  type?: string // 类型 'activity'、'coupon'
  apiFn: (params: any) => Promise<any> // 获取数据的API函数
  labelField?: string // 显示文本的字段名
  valueField?: string // 值的字段名
  placeholder?: string
  searchPlaceholder?: string
  showCurrentOption?: boolean // 是否显示"当前"选项
  currentFn?: (params: any) => Promise<any> // 获取当前数据的API函数
  showPagination?: boolean // 是否显示分页
  pageSize?: number // 每页条数
  clearable?: boolean
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  labelField: 'name',
  valueField: 'id',
  placeholder: '请选择',
  searchPlaceholder: '请输入搜索内容（联想输入）',
  showCurrentOption: false,
  showPagination: true,
  pageSize: 5,
  clearable: true,
  placement: 'bottom'
})

const emit = defineEmits(['update:modelValue'])

// 选中的值
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 数据选项
const options = ref<{
  list: any[]
  total: number
}>({
  list: [],
  total: 0
})

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: props.pageSize,
  searchValue: ''
})

// 加载状态
const loading = ref(false)
const currentChecked = ref(false) // 当前选中状态

// 获取选项标签
const getItemLabel = (item: any) => {
  return item[props.labelField]
}

// 获取选项值
const getItemValue = (item: any) => {
  return item[props.valueField]
}

// 初始化获取数据
const fetchData = async (pageNo = 1) => {
  try {
    loading.value = true
    queryParams.pageNo = pageNo
    const data = await props.apiFn(queryParams)
    options.value.list = data.list || []
    options.value.total = data.total || 0
  } finally {
    loading.value = false
  }
}

// 全选
const handleCheckAll = () => {
  selectedValue.value = [
    ...new Set([
      ...(selectedValue.value || []),
      ...options.value.list.map(item => getItemValue(item))
    ])
  ]
}

// 清空
const handleClearAll = () => {
  selectedValue.value = []
}

// 当前选项变化
const handleCurrentChange = async (status: boolean) => {
  currentChecked.value = status
  if (status) {
    if (selectedValue.value?.length) {
      loading.value = true
      try {
        let response
        if (props.type === 'activity') {
          response = await props.currentFn!(props.modelValue)
        } else if (props.type === 'coupon') {
          response = await props.currentFn!(props.modelValue.join(','))
        }
        options.value.list = Array.isArray(response) ? response : response.list || []
      }
      finally {
        loading.value = false
      }
    } else {
      currentChecked.value = false
    }
  } else {
    await fetchData()
  }
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 初始化逻辑
onMounted(async () => {
  await fetchData()
  if (props.showCurrentOption) {
    await handleCurrentChange(true)
  }
})

// 监听pageSize变化
watch(() => props.pageSize, (newVal) => {
  queryParams.pageSize = newVal
  fetchData()
})

// 监听字段名变化
watch(() => [props.labelField, props.valueField], () => {
  fetchData()
}, { deep: true })
</script>