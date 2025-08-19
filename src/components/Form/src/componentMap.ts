import type { Component } from 'vue'
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElTreeSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider
} from 'element-plus'


import InputPassword from 'remote-sys-base/InputPassword'
import Editor from 'remote-sys-base/Editor'
import UploadImg from 'remote-sys-base/UploadImg'
import UploadImgs from 'remote-sys-base/UploadImgs'
import UploadFile from 'remote-sys-base/UploadFile'

import { ComponentName } from '@/types/components'

const componentMap: Recordable<Component, ComponentName> = {
  Radio: ElRadioGroup,
  Checkbox: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  Input: ElInput,
  Autocomplete: ElAutocomplete,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  Cascader: ElCascader,
  Switch: ElSwitch,
  Slider: ElSlider,
  TimePicker: ElTimePicker,
  DatePicker: ElDatePicker,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  Transfer: ElTransfer,
  Divider: ElDivider,
  TimeSelect: ElTimeSelect,
  SelectV2: ElSelectV2,
  TreeSelect: ElTreeSelect,
  RadioButton: ElRadioGroup,
  InputPassword: InputPassword,
  Editor: Editor,
  UploadImg: UploadImg,
  UploadImgs: UploadImgs,
  UploadFile: UploadFile
}

export { componentMap }
