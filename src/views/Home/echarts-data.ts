import { EChartsOption } from 'echarts'

export const achievementOptions: EChartsOption = {
  color: ['#fcbcbd', '#b6a2de', '#2ec7c9'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [],
  loading: false
}
export const sourceOptions: EChartsOption = {
  color: ['#fcbcbd', '#b6a2de', '#2ec7c9', '#ffb980'],
  title: {
    text: '生源',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%'
  },
  legend: {
    top: '20%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '生源',
      type: 'funnel',
      left: '0',
      top: 90,
      width: '100%',
      height: '65%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '90%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: []
    }
  ],
  loading: false
}
export const renewOptions: EChartsOption = {
  color: ['#fcbcbd', '#929191'],
  title: {
    text: '续费',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: '12%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '续费',
      type: 'pie',
      top: 15,
      radius: '65%',
      width: '100%',
      height: '90%',
      center: ['50%', '60%'],
      data: []
    }
  ],
  loading: false
}
export const clockOptions: EChartsOption = {
  color: ['#fcbcbd', '#929191'],
  title: {
    text: '新生打卡',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: '12%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '新生打卡',
      type: 'pie',
      top: 15,
      radius: '65%',
      width: '100%',
      height: '90%',
      center: ['50%', '60%'],
      data: []
    }
  ],
  loading: false
}
export const activityOptions: EChartsOption = {
  color: ['#fcbcbd', '#929191'],
  title: {
    text: '活动',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: '12%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '活动',
      type: 'pie',
      top: 15,
      radius: '65%',
      width: '100%',
      height: '90%',
      center: ['50%', '60%'],
      data: []
    }
  ],
  loading: false
}
export const awardOptions: EChartsOption = {
  color: ['#fcbcbd', '#929191'],
  title: {
    text: '奖学金',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: '12%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '奖学金',
      type: 'pie',
      top: 15,
      radius: '65%',
      width: '100%',
      height: '90%',
      center: ['50%', '60%'],
      data: []
    }
  ],
  loading: false
}
export const packageOptions: EChartsOption = {
  color: ['#fcbcbd', '#b6a2de', '#2ec7c9'],
  title: {
    text: '套餐',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    top: '12%',
    left: 'center',
    data: []
  },
  series: [
    {
      name: '套餐',
      type: 'pie',
      top: 15,
      radius: '65%',
      width: '100%',
      height: '90%',
      center: ['50%', '60%'],
      data: []
    }
  ],
  loading: false
}
export const communicationOptions: EChartsOption = {
  color: ['#fcbcbd', '#b6a2de', '#2ec7c9'],
  title: {
    text: '通时通次'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [],
  loading: false
}
