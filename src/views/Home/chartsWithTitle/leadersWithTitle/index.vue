<!-- <template>
  <el-card shadow="never">
    <template #header>
      <span>{{ list.leadersData.title }}</span>
    </template>
    <el-skeleton :loading="list.leadersData.loading" animated>
      <el-row class="text-center flex items-center">
        <el-col :span="6" v-for="data in list.leadersData.data" :key="data.id" class="flex items-center justify-center">
          <Icon :icon="data.icon" size="40" class="mr-2" color="var(--el-color-primary)" />
          <p class="flex flex-col items-center justify-center">
            <span class="mb-2 text-5">{{ data.value }}</span>
            <span>{{ data.title }}</span>
          </p>
        </el-col>
      </el-row>
    </el-skeleton>
  </el-card>
</template>
<script setup lang="ts">
const list = inject('list')
</script> -->
<template>
  <el-card shadow="never">
    <template #header>
      <span>{{ list.leadersData.title }}</span>
    </template>
    <el-skeleton :loading="list.leadersData.loading" animated>
      <el-row :gutter="30" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6">
          <div class="card-panel flex justify-between items-center">
            <div class="card-panel-icon-wrapper icon-student">
              <Icon icon="ph:student" size="50" />
            </div>
            <div class="card-panel-description flex flex-col items-center">
              <div class="card-panel-text">
                学员数
              </div>
              <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel flex justify-between items-center">
            <div class="card-panel-icon-wrapper icon-yes">
              <Icon icon="dashicons:yes" size="50" />
            </div>
            <div class="card-panel-description flex flex-col items-center">
              <div class="card-panel-text">
                有效已预约数
              </div>
              <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel flex justify-between items-center">
            <div class="card-panel-icon-wrapper icon-target">
              <Icon icon="mdi:target" size="50" />
            </div>
            <div class="card-panel-description flex flex-col items-center">
              <div class="card-panel-text">
                锁定数
              </div>
              <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel flex justify-between items-center">
            <div class="card-panel-icon-wrapper icon-receive">
              <Icon icon="icon-park-outline:receive" size="50" />
            </div>
            <div class="card-panel-description flex flex-col items-center">
              <div class="card-panel-text">
                公海领取数
              </div>
              <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-skeleton>
  </el-card>
</template>

<script setup lang="ts">
const list = inject('list')
</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(158, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-student {
        background: #36a3f7;
      }

      .icon-yes {
        background: #40c9c6;
      }

      .icon-target {
        background: #f4516c;
      }

      .icon-receive {
        background: #34bfa3
      }
    }

    .icon-student {
      color: #36a3f7;
    }

    .icon-yes {
      color: #40c9c6;
    }

    .icon-target {
      color: #f4516c;
    }

    .icon-receive {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      margin: 5px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 5px 14px 0 0;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
