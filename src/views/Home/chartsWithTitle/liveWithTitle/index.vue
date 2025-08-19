<template>
  <el-card shadow="never" class="mt-8px">
    <!-- <template #header>
      <span>
        {{ props.role }}{{ list.liveData.title }}
      </span>
    </template>
<el-segmented v-if="props.roleOptions && props.roleValue" v-model="roleValue" :options="props.roleOptions" class="mb-2">
  <template #default="{ item }">
        <div class="flex flex-col items-center gap-1 p-1" @click="handleClick(item.value)">
          <Icon :icon="item.icon" />
          <div>{{ item.label }}</div>
        </div>
      </template>
</el-segmented>
<Live v-bind="$attrs" /> -->
  </el-card>
</template>

<script setup lang="ts">
import Live from '@/views/Home/charts/live/index.vue'
const liveValue = ref('CPZH一部')
const liveOptions = ['CPZH一部', 'CPZH二部', 'CPZH三部']
const list = inject('list')
const props = defineProps({
  role: {
    type: String,
    required: true,
    default: '',
  },
  roleOptions: {
    type: Array,
    required: false,
    default: () => { },
  },
  roleValue: {
    type: String,
    required: false,
    default: () => { },
  },
})
const roleValue = ref(props.roleValue)
const emit = defineEmits(['change-value'])
watch(() => props.roleValue, (newVal) => {
  roleValue.value = newVal
})
const handleClick = (val) => {
  roleValue.value = val
  emit('change-value', val)
}
</script>