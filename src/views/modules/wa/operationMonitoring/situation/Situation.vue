<template>
    <div>
      <el-row style="margin:10px">
        <el-card>
          <el-col :span="9" style="margin:10px">
            <v-chart ref="chart1"  style="width: 100%" auto-resize></v-chart>
          </el-col>
          <el-col :span="9" style="margin:10px">
            <v-chart ref="chart2"  style="width: 100%" auto-resize></v-chart>
          </el-col>
          <el-col :span="5" style="margin:10px">
            <v-chart ref="chart3" :options="pieOption" style="width: 100%" auto-resize></v-chart>
          </el-col>
        </el-card>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
          <!-- <el-card> -->
            <el-col :span="7" style="margin:10px">
              <v-chart ref="chart4"  style="width: 100%" auto-resize></v-chart>
            </el-col>
            <el-col :span="7" style="margin:10px">
              <v-chart ref="chart5" :options="optionLine" style="width: 100%" auto-resize></v-chart>
            </el-col>
            <el-col :span="7" style="margin:10px">
              <v-chart ref="chart6" :options="pieOption1" style="width: 100%" auto-resize></v-chart>
            </el-col>
          <!-- </el-card> -->
      </el-row>
    </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts'
export default {
  data () {
    return {
      list: [],
      pieOption: {
        title: {
          text: '今日告警来源统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['网络监控报警', '视频监控报警', '基础资源监控']
        },
        series: [
          {
            name: '工单',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 35,
                itemStyle: {
                  color: 'rgba(70, 228, 177, 0.85)'
                },
                name: '网络监控报警'
              }, {
                value: 30,
                name: '视频监控报警',
                itemStyle: {
                  color: 'rgba(255, 72, 72, 0.9)'
                }
              }, {
                value: 130,
                name: '基础资源监控',
                itemStyle: {
                  color: '#8dcaea'
                }
              }
            ]
          }
        ]
      },
      pieOption1: {
        title: {
          text: '终端在线情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['在线', '离线']
        },
        series: [
          {
            name: '在线率',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 35,
                itemStyle: {
                  color: 'rgba(70, 228, 177, 0.85)'
                },
                name: '在线'
              }, {
                value: 30,
                name: '离线',
                itemStyle: {
                  color: 'rgba(255, 72, 72, 0.9)'
                }
              }
            ]
          }
        ]
      },
      optionLine: {
        title: {
          text: '数据量监测趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        legend: {
          left: 'left',
          data: ['上传', '下载']
        },
        xAxis: {
          type: 'category',
          name: '',
          boundaryGap: false,
          splitLine: {show: false},
          data: ['2020.2.22', '2020.2.23', '2020.2.24', '2020.2.25', '2020.2.26', '2020.2.27', '2020.2.28']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '上传',
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(63,227,236,0.8)'
                }, {
                  offset: 1,
                  color: 'rgba(63,227,236,0.00)'
                }])
              }
            },
            itemStyle: {
              color: '#3E86B7'
            },
            data: [9, 7, 8, 4, 4, 3, 9]
          },
          {
            name: '下载',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: 'rgb(60, 215, 104)'
            },
            areaStyle: {
              normal: {
                color: ''
              }
            },
            data: [4, 8, 6, 2, 6, 1, 0]
          }
        ]
      }
    }
  },
  components: {
    'v-chart': ECharts
  },
  activated () {
    this.initEcharts()
  },
  methods: {
    initEcharts () {
      this.$refs.chart5.options.series[1].areaStyle.normal.color = new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: 'rgba(60, 215, 104, 0.5)'
      }, {
        offset: 1,
        color: 'rgba(60, 215, 104, 0.00)'
      }])
    }
  }
}
</script>