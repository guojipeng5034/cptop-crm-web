<template>
  <el-card class="transfer-info">
    <template #header>
      <span class="header">流转信息</span>
    </template>

    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="more">
        <template #default>
          <div class="mb-4">
            <!-- 搜索工作栏 -->
            <el-form class="-mb-15px search-form" :model="queryParams" ref="queryFormRef" :inline="true"
              label-width="110px">
              <div class="search-form-items pos-relative">
                <el-row>
                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="变更前所属人" prop="oldId">
                      <template #label>
                        <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                          变更前所属人
                        </el-tooltip>
                      </template>
                      <el-select v-model="queryParams.oldId" clearable filterable remote :loading="userOptionsLoading"
                        :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择变更前顾问" @keyup.enter="handleQuery"
                        class="!w-240px">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="变更后所属人" prop="newId">
                      <template #label>
                        <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                          变更后所属人
                        </el-tooltip>
                      </template>
                      <el-select v-model="queryParams.newId" clearable filterable remote :loading="userOptionsLoading"
                        :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择变更后顾问" @keyup.enter="handleQuery"
                        class="!w-240px">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="转让原因" prop="reason">
                      <el-select v-model="queryParams.reason" placeholder="请选择或检索所属转让原因" clearable filterable
                        class="!w-240px">
                        <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_REASON)" :key="dict.value"
                          :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="流转来源" prop="source">
                      <el-select v-model="queryParams.source" placeholder="请选择流转来源" clearable filterable
                        class="!w-240px">
                        <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TRANSFER_SOURCE)" :key="dict.value"
                          :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                        <el-form-item label="变更老师部门" prop="newDeptId" label-width="auto">
                          <el-tree-select
                            v-model="queryParams.newDeptId"
                            filterable
                            clearable
                            :data="deptList"
                            :props="defaultProps"
                            collapse-tags
                            :max-collapse-tags="3"
                            default-expand-all
                            check-strictly
                            placeholder="请检索或选择变更老师部门"
                            node-key="id"
                            class="!w-235px"
                          />
                        </el-form-item>
                      </el-col> -->

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="转让时间" prop="createTime">
                      <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss"
                        type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-220px" />
                    </el-form-item>
                  </el-col>

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="操作人" prop="creator">
                      <template #label>
                        <el-tooltip effect="light" content="支持昵称/账号/手机号/邮箱检索" placement="top-start">
                          操作人
                        </el-tooltip>
                      </template>
                      <el-select v-model="queryParams.creator" clearable filterable remote :loading="userOptionsLoading"
                        :remote-method="fetchRemoteUserOptions" placeholder="请检索后选择操作人" @keyup.enter="handleQuery"
                        class="!w-240px">
                        <el-option v-for="item in userOptions" :key="item.value" :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remarks">
                      <el-input v-model="queryParams.remarks" placeholder="请输入备注" class="!w-240px"
                        @keyup.enter="handleQuery" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="search-form-buttons mt-10px mb-5px">
                <el-form-item>
                  <el-button @click="handleQuery" v-hasPermi="['crm:customer-transfer-log:query']">
                    <Icon icon="ep:search" class="mr-5px" /> 搜索
                  </el-button>
                  <el-button @click="resetQuery" v-hasPermi="['crm:customer-transfer-log:query']">
                    <Icon icon="ep:refresh" class="mr-5px" /> 重置
                  </el-button>
                  <!-- <el-button
                    type="success"
                    plain
                    @click="handleExport"
                    :loading="exportLoading"
                    v-hasPermi="['crm:customer-transfer-log:export']"
                  >
                    <Icon icon="ep:download" class="mr-5px" /> 导出
                  </el-button> -->
                </el-form-item>
              </div>
            </el-form>
          </div>
          <el-table v-loading="loading" :data="list" :stripe="true" border>
            <el-table-column label="变更前所属人" align="center" prop="oldName" min-width="100px" />
            <el-table-column label="变更后所属人" align="center" prop="newName" min-width="100px" />
            <el-table-column label="转让原因" align="center" prop="reason" width="120">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.TRANSFER_REASON" :value="scope.row.reason" />
              </template>
            </el-table-column>
            <el-table-column label="流转来源" align="center" prop="source" width="110">
              <template #default="scope">
                <arco-tag :type="DICT_TYPE.TRANSFER_SOURCE" :value="scope.row.source" />
              </template>
            </el-table-column>
            <el-table-column label="转让时间" align="center" prop="createTime" :formatter="timeWithoutSecondFormat"
              width="110px" />
            <el-table-column label="操作人" align="center" prop="createUserName" width="110px" />

            <el-table-column label="备注" align="center" prop="remarks" :show-overflow-tooltip="true" min-width="120px" />
          </el-table>
          <!-- 分页 -->
          <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
            @pagination="getList" />
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- 折叠展开按钮 -->
    <el-divider class="!my-15px">
      <el-button type="primary" link @click="handleMore">
        {{ activeNames ? '收起' : '展开' }}
        <Icon icon="ep:arrow-up-bold" class="ml-0.5" :class="activeNames ? 'arrow-down' : 'arrow-up'" />
      </el-button>
    </el-divider>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, handleRemoteUserOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import { timeWithoutSecondFormat } from '@/utils/formatter'
import download from '@/utils/download'
import * as DeptApi from '@/api/system/dept'
import { TransferLogApi, TransferLogVO } from '@/api/crm/customer/transferLog'

const props = defineProps({
  customerId: {
    type: Number,
    default: undefined
  }
})

const activeNames = ref('') // 控制折叠展开

const message = useMessage()
/* 展开/收起 */
const handleMore = async () => {
  if (!activeNames.value) {
    activeNames.value = 'more'
    getList()
  } else {
    activeNames.value = ''
  }
}

const loading = ref(true) // 列表的加载中
const list = ref<TransferLogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined,
  oldId: undefined,
  newId: undefined,
  reason: undefined,
  source: undefined,
  creator: undefined,
  remarks: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** options */
/* 1.user */
const userOptionsLoading = ref(false)
const userOptions = ref([])
const fetchRemoteUserOptions = async (query) => {
  const setUserOptions = (newValue) => (userOptions.value = newValue)
  const setUserLoading = (newValue) => (userOptionsLoading.value = newValue)
  await handleRemoteUserOptions(query, setUserOptions, setUserLoading)
}

/* 2.dept */
const deptList = ref<Tree[]>([]) // 树形结构
const getDeptOptions = async () => {
  try {
    deptList.value = handleTree(await DeptApi.getSimpleKuaiKuDeptList())
  } catch (error) {
    console.log('getDeptOptions', error)
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  queryParams.customerId = props.customerId
  try {
    const data = await TransferLogApi.getCustomerTransferLogPage(queryParams)
    list.value = data.list
    total.value = data.total
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TransferLogApi.deleteCustomerTransferLog(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await TransferLogApi.exportCustomerTransferLog(queryParams)
    download.excel(data, '学员流转记录.xls')
  } finally {
    exportLoading.value = false
  }
}

defineExpose({ getList }) // 提供 getList 方法，用于刷新

/** 初始化 **/
onMounted(() => {
  getDeptOptions()
  getList()
})
</script>

<style scoped lang="scss">
.transfer-info {
  margin-top: 20px;

  .header {
    font-size: 16px;
    font-weight: 700;
  }

  /* 更多点击时箭头方向的的改变 */
  .arrow-up {
    transform: rotate(180deg);
    transition: all 0.3s;
  }

  .arrow-down {
    transform: rotate(0);
    transition: all 0.3s;
  }

  /* Search Form 部分样式 */
  .search-form {
    .search-form-items {

      /* 减少表单元素下外边距 */
      .el-form-item {
        margin-bottom: 10px;
      }

      /* 控制 search form label 分散对齐 */
      :deep(.el-form-item label:after) {
        content: '';
        width: 100%;
      }

      :deep(.el-form-item__label) {
        display: inline-block;
        text-align: justify;
        text-align-last: justify;
        word-break: break-all;
      }
    }
  }
}
</style>
