<template>
  <div class="drawer">
    <el-drawer v-model="drawerVisible" :show-close="false" size="90%" @closed="closedDrawer" destroy-on-close>
      <template #header="{ close }">
        <div class="hearder" v-loading="!customerInfo">
          <el-button v-show="customerInfo && customerInfo.studyStatus === 1" type="primary"
            @click="handleConnect">学员交接</el-button>
          <el-button type="primary" @click="goToMonthReport(currentUid)">月度报告</el-button>
          <el-button type="primary" @click="goToPointMall(currentUid)"
            v-hasPermi="['crm:points-store:query']">积分商城</el-button>
          <el-button type="primary" @click="goToQQE(currentUid)"
            v-hasPermi="['crm:customer:get:qqe:button']">QQE</el-button>
          <el-button type="primary" @click="goToStudentPage(currentUid)">学员页面</el-button>
          <el-button type="primary" @click="createQQEAcount" v-hasPermi="['crm:customer-account:create']">
            创建QQE账号
          </el-button>
          <el-button type="danger" @click="close">关闭</el-button>
        </div>
      </template>
      <template #default>
        <!-- 1.2.1 学员 Tab -->
        <el-tabs v-loading="tabLoading" v-model="currentCustomerId" type="border-card" closable @tab-remove="removeTab"
          class="!h-full">
          <el-tab-pane v-for="item in customerTabList" :key="item.name" :name="item.name" class="!mt--20px">
            <template #label>
              <span class="font-size-4 font-bold">{{ item.title }}</span>
            </template>
            <template #default>
              <CustomerDetail :ref="(el) => setCustomerDetailRef(el, item.name)" :customer-id="item.name"
                :customer-name="item.title" @add-customer-tab="addTab" @refresh-uid="refreshStudentUid"
                @refresh-customer-name="refreshTabName" />
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>

    <!-- 创建QQE账户 表单 -->
    <CustomerQQEAccountForm ref="customerQQEAccountFormRef" @success="refreshAccountList" />
  </div>
</template>
<script setup lang="ts">
import { goToQQE, goToStudentPage, goToMonthReport, goToPointMall } from '@/utils/navigation'
import { CustomerApi, CustomerVO } from '@/api/crm/customer/base'
import CustomerDetail from './detail/CustomerDetail.vue'
import CustomerQQEAccountForm from './CustomerQQEAccountForm.vue'

/** 学员详情 Drawer */
defineOptions({ name: 'CustomerDrawer' })

/* 配置项 */
const message = useMessage() // 消息弹窗
const customerInfo = ref()
const currentCustomerId = ref() // 当前 active 的 customer id, 当前学员 tab 的 name
const currentUid = ref() // 当前 active 的 customer uid，用于 drawer header 按钮组使用
const drawerVisible = ref(false) // Drawer 是否展示
const tabLoading = ref(false) // tab 加载中
const customerTabList = ref([]) // tab 列表
const MAX_TAB_COUNT = 6 // 最大 tab 数量
const customerDetailRefs = ref(new Map()) // customerId 与 CustomerDetail 实例的映射关系

/* 打开 Drawer */
const openDrawer = async (customerId: number, customerName: string) => {
  currentCustomerId.value = customerId
  drawerVisible.value = true
  await addTab(customerId, customerName)
}

/* 关闭 Drawer */
const closedDrawer = () => {
  drawerVisible.value = false
  customerTabList.value = [] // 清空 tab
  customerInfo.value = null
  customerDetailRefs.value.clear()  // 清空所有 CustomerDetailRef 实例引用
  // emit('refreshCustomerList') // 刷新列表
}

/* 创建 QQE 账号 */
const customerQQEAccountFormRef = ref()
const createQQEAcount = async () => {
  customerQQEAccountFormRef.value.open(currentCustomerId.value)
}

/* 设置（set） CustomerDetail 实例 */
const setCustomerDetailRef = (el: any, customerId: number) => {
  el && customerDetailRefs.value.set(customerId, el)
}

/* 获取（get）当前 tab 的 CustomerDetail 实例 */
const getCurrentCustomerDetailRef = (method: string, ...args: any[]) => {
  const instance = customerDetailRefs.value.get(currentCustomerId.value)
  instance?.[method]?.(...args)
}

/* 监听 tab 切换 */
watch(currentCustomerId, (newCustomerId) => {
  currentUid.value = customerTabList.value.find(tab => tab.name === newCustomerId)?.uid
})

/* 添加 tab */
const addTab = async (customerId: number, tabTitle: string) => {
  tabLoading.value = true
  try {
    // 判断 tab 是否存在, 如果 tab 已经存在，则切换到该 tab
    if (customerTabList.value.some((tab) => tab.name === customerId)) {
      currentCustomerId.value = customerId
      return
    }
    // 限制 tab 数量
    if (customerTabList.value.length >= MAX_TAB_COUNT) {
      message.warning(`最多支持打开 ${MAX_TAB_COUNT} 个学员详情，请关闭部分学员详情。`)
      return
    }
    customerInfo.value = await CustomerApi.getCustomer(customerId)
    // 添加学员 tab
    customerTabList.value.push({
      title: tabTitle,
      name: customerId,
      uid: customerInfo.value.studentUid
    })
    currentCustomerId.value = customerId // 切换到新 tab
    currentUid.value = customerInfo.value.studentUid // 更新 currentUid
  } finally {
    tabLoading.value = false
  }
}

/* 删除 tab */
const removeTab = (targetName: number) => {
  const tabs = customerTabList.value
  let activeName = currentCustomerId.value
  // 切换上/下一个 tab
  if (activeName === targetName) {
    const currentIndex = tabs.findIndex(tab => tab.name === targetName)
    const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1]
    activeName = nextTab?.name || null
    if (!activeName) return closedDrawer()
  }
  customerDetailRefs.value.delete(targetName) // 删除对应的 CustomerDetail 实例引用
  currentCustomerId.value = activeName // 切换到其他 tab
  customerTabList.value = tabs.filter((tab) => tab.name !== targetName)
}

/* 创建QQE账号，刷新QQE账户列表 */
const refreshAccountList = async () => {
  getCurrentCustomerDetailRef('refreshAccountList')
  getCurrentCustomerDetailRef('customerEditSuccess')
  // 如果当前学员从未创建过QQE账号，创建后需则刷新当前学员的UID，并赋值给customerTabList对应的 uid
  if (!currentUid.value) {
    await refreshStudentUid() // 刷新当前学员的UID
    // 更新 customerTabList
    customerTabList.value.forEach((tab) => {
      if (tab.name === currentCustomerId.value) {
        tab.uid = currentUid.value
      }
    })
  }
}
const emit = defineEmits(['refreshCustomerList']) // 定义事件，用于操作成功后的通知回调

/* 刷新当前学员的UID */
const refreshStudentUid = async () => {
  const data = await CustomerApi.getCustomer(currentCustomerId.value)
  currentUid.value = data.studentUid
}

/* 刷新当前学员的姓名 */
const refreshTabName = async (customerId: number, customerName: string) => {
  customerTabList.value.forEach(tab => {
    if (tab.name === customerId) {
      tab.title = customerName
    }
  })
}

/* 学员交接 */
const handleConnect = async () => {
  await ElMessageBox.confirm(
    `请确认是否交接，交接后学员的Mentor将重新自动分配。`, '交接学员',
    { confirmButtonText: '确定', cancelButtonText: '取消' }
  )
    .then(async () => {
      await CustomerApi.handleValidCustomerConnect(currentCustomerId.value)
      message.success('交接成功')
      getCurrentCustomerDetailRef('customerEditSuccess')
    })
}

defineExpose({ openDrawer }) // 提供 openDrawer 方法，用于打开 Drawer
</script>

<style lang="scss" scoped>
.drawer {
  :deep(.el-drawer) {

    /* Drawer header */
    .el-drawer__header {
      margin: 0;
      padding: 10px 20px 0 20px;
    }

    /* Drawer body */
    .el-drawer__body {
      padding: 10px 20px;
    }

    /* Card header */
    .el-card__header {
      padding: 10px 15px;
    }

    /* Card body */
    .el-card__body {
      padding: 10px 15px;
    }

    /* 所有表格表头背景色 */
    .el-table thead.is-group th.el-table__cell {
      background: var(--el-fill-color-light);
    }
  }

  .hearder {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
  }
}
</style>
