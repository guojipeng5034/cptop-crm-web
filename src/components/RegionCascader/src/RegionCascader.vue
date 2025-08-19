<template>
  <el-cascader
    :model-value="modelValue"
    :options="regionOptions"
    :props="cascaderProps"
    :label-field="labelField"
    :value-field="valueField"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="filterable"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
import type { CascaderProps } from '@/types/components'

interface Props {
  modelValue: (string | number)[] | undefined // 选中的值
  labelField?: string // 显示文本的字段名
  valueField?: string // 值的字段名
  placeholder?: string
  clearable?: boolean
  filterable?: boolean
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  cascaderProps?: CascaderProps
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  labelField: 'name',
  valueField: 'id',
  placeholder: '请选择',
  clearable: true,
  filterable: true,
  collapseTags: true,
  collapseTagsTooltip: true,
  cascaderProps: {
    expandTrigger: 'click',
    multiple: true,
    checkStrictly: false,
    emitPath: false,
    lazy: false
  }
})



const regionOptions = ref<CascaderOption[]>([
  {
    value: '1',
    label: '北京市',
    children: [
      { value: '11', label: '东城区' },
      { value: '12', label: '西城区' },
      { value: '13', label: '朝阳区' },
      { value: '14', label: '海淀区' },
      { value: '15', label: '丰台区' },
      { value: '16', label: '石景山区' },
      { value: '17', label: '门头沟区' },
      { value: '18', label: '房山区' }
    ]
  },
  {
    value: '2',
    label: '上海市',
    children: [
      { value: '21', label: '黄浦区' },
      { value: '22', label: '徐汇区' },
      { value: '23', label: '长宁区' },
      { value: '24', label: '静安区' },
      { value: '25', label: '普陀区' },
      { value: '26', label: '虹口区' },
      { value: '27', label: '杨浦区' },
      { value: '28', label: '闵行区' }
    ]
  },
  {
    value: '3',
    label: '广州省',
    children: [
      {
        value: '31',
        label: '广州市',
        children: [
          { value: '311', label: '天河区' },
          { value: '312', label: '白云区' },
          { value: '313', label: '黄埔区' },
          { value: '314', label: '番禺区' },
          { value: '315', label: '花都区' }
        ]
      },
      {
        value: '32',
        label: '深圳市',
        children: [
          { value: '321', label: '南山区' },
          { value: '322', label: '福田区' },
          { value: '323', label: '宝安区' }
        ]
      },
      {
        value: '33',
        label: '珠海市',
        children: [
          { value: '331', label: '香洲区' },
          { value: '332', label: '金湾区' },
          { value: '333', label: '斗门区' }
        ]
      },
      {
        value: '34',
        label: '汕头市',
        children: [
          { value: '341', label: '龙湖区' },
          { value: '342', label: '金平区' },
          { value: '343', label: '澄海区' }
        ]
      },
      {
        value: '35',
        label: '佛山市',
        children: [
          { value: '351', label: '禅城区' },
          { value: '352', label: '南海区' },
          { value: '353', label: '顺德区' },
          { value: '354', label: '高明区' },
          { value: '355', label: '三水区' }
        ]
      },
      {
        value: '36',
        label: '韶关市',
        children: [
          { value: '361', label: '武江区' },
          { value: '362', label: '浈江区' },
          { value: '363', label: '曲江区' },
          { value: '364', label: '始兴县' },
          { value: '365', label: '仁化县' },
          { value: '366', label: '翁源县' },
          { value: '367', label: '乳源瑶族自治县' },
          { value: '368', label: '新丰县' },
          { value: '369', label: '乐昌市' }
        ]
      }
    ]
  }
])

const emit = defineEmits(['update:modelValue'])

const handleChange = (value: (string | number)[]) => {
  emit('update:modelValue', value)
}
</script>
