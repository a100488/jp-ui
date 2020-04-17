<template>
  <div>
      <el-row :gutter="10" style="margin:10px">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4" v-for="data in dataList2" :key="data.id">
            <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
                <div class="actCard" style="disply:flex">
                  <div :style="'height: 75px;float:left;width: 75px;text-align: center;line-height: 75px;background: '+data.color+';'">
                    <i :class="data.icon" style="transform: scale(1.8)"></i>
                  </div>
                  <div style="height: 75px;flex:1;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                    <div><span>{{data.name}}</span></div>
                    <div><span class="numStyle">{{data.num}}</span></div>
                  </div>
                </div>
            </el-card>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="18">
          <el-card :body-style="{ 'padding': '10px 20px 0px 20px','margin': '0px' }" style="margin:5px 10px">
            <div slot="header">
              <span>工单趋势</span>
              <el-date-picker
                v-model="queryDate"
                style="float: right; margin-top: -6px"
                type="daterange"
                size="small"
                align="right"
                value-format="yyyy-MM-dd hh:mm:ss"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :change="query()">
              </el-date-picker>
              <span style="float: right;">选择统计时间段：</span>
            </div>
            <div>
              <v-chart ref="chart1" :options="option" style="width: 100%;height: 370px"></v-chart>
            </div>
          </el-card>
        </el-col>
        <el-col  :span="6" style="padding:10px">
          <el-card :body-style="{ 'padding': '10px 20px 0px 20px','margin': '0px' }">
            <v-chart ref="chart3" :options="pieOption1" style="width: 100%" auto-resize></v-chart>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" style="padding:10px">
          <el-table
            border
            :data="clrSumList"
            style="width: 100%">
            <el-table-column
              prop="clr"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="处理人">
            </el-table-column>
            <el-table-column
              prop="todo"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="待办工单">
            </el-table-column>
            <el-table-column
              prop="partin"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="参与工单">
            </el-table-column>
            <el-table-column
              prop="overdue"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="逾期工单">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" style="padding:10px">
          <el-card :body-style="{ 'padding': '10px 20px 0px 20px','margin': '0px' }">
            <v-chart ref="chart2" :options="pieOption" style="width: 100%" auto-resize></v-chart>
          </el-card>
        </el-col>
      </el-row>
      <!-- 查看进度 弹窗 -->
    <el-dialog
      title="查看进度"
      :close-on-click-modal="true"
      :visible.sync="visible"
      width="70%"
      height="600px">
    </el-dialog>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts/components/ECharts'
  export default {
    data () {
      return {
        queryDate: [],
        clrSumList: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        visible: false,
        pieOption: {
          title: {
            text: '按状态统计',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['已完成', '未完成']
          },
          color: [ 'rgba(106, 159, 224, 0.8)', 'rgba(60, 215, 104, 0.5)', 'rgba(171, 117, 220, 0.8)', 'rgba(87, 194, 226, 0.8)', '#FF0000', '#FE8463' ],
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
                  // itemStyle: {
                  //   color: 'rgba(70, 228, 177, 0.85)'
                  // },
                  name: '已完成'},
                {value: 30, name: '未完成'}
              ]
            }
          ]
        },
        pieOption1: {
          title: {
            text: '按类型统计',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: []
          },
          color: [ 'rgba(106, 159, 224, 0.8)', 'rgba(60, 215, 104, 0.5)', 'rgba(171, 117, 220, 0.8)', 'rgba(87, 194, 226, 0.8)', '#FF0000', '#FE8463' ],
          series: [
            {
              name: '工单',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: []
            }
          ]
        },
        option: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            left: 'left',
            data: ['新建工单数', '完成工单数', '逾期工单数']
          },
          xAxis: {
            type: 'category',
            name: '日期',
            boundaryGap: false,
            splitLine: {show: false},
            data: ['2020.2.20', '2020.2.21', '2020.2.22', '2020.2.23', '2020.2.24', '2020.2.25', '2020.2.26', '2020.2.27', '2020.2.28']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            name: '工单数'
          },
          series: [
            {
              name: '新建工单数',
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
              data: [1, 3, 9, 7, 8, 4, 4, 3, 9]
            },
            {
              name: '完成工单数',
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
              data: [1, 2, 4, 8, 6, 2, 6, 1, 0]
            },
            {
              name: '逾期工单数',
              type: 'line',
              smooth: true,
              itemStyle: {
                color: '#FF4848'
              },
              areaStyle: {
                normal: {
                  color: ''
                }
              },
              data: [2, 4, 8, 6, 3, 4, 8, 2, 1]
            }
          ]
        },
        dataList2: [],
        dataListType: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      'v-chart': ECharts
    },
    created () {
      const end = new Date(new Date().toLocaleDateString())
      const start = new Date(new Date().toLocaleDateString())
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.queryDate = [this.formatDateTime(start), this.formatDateTime(end)]
    },
    activated () {
      this.initEcharts()
      this.query()
      this.querybytype()
      this.refreshSumList()
      // this.refreshClrSumList(this.random(0, 8))
    },
    mounted () {
      // 根据屏幕大小改变，重新加载chart
      window.addEventListener('resize', () => {
        this.$refs.chart1.resize()
        this.$refs.chart2.resize()
        this.$refs.chart3.resize()
      })
      // this.query()
    },
    methods: {
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      // chart1 data
      query () {
        this.$http({
          url: '/wa/count/querydate',
          method: 'get',
          params: {
            startDate: this.queryDate[0],
            endDate: this.queryDate[1]
          }
        }).then(({data}) => {
          if (data && data.success) {
            console.log(data.data)
            this.$refs.chart1.options.series[0].data = data.data.create // 创建
            this.$refs.chart1.options.series[1].data = data.data.complete // 完成
            this.$refs.chart1.options.series[2].data = data.data.overdu // 逾期
            this.$refs.chart1.options.xAxis.data = data.data.dates //
          }
        })
      },
      querybytype () {
        this.$http({
          url: '/wa/count/querybytype',
          method: 'get'
        }).then(({data}) => {
          if (data && data.success) {
            console.log(data.data)
            this.$refs.chart3.options.series[0].data = data.data.valueList // 逾期
            this.$refs.chart3.options.legend.data = data.data.name //
          }
        })
      },
      refreshClrSumList (m) {
        this.clrSumList = []
        var clr = ['小明', '小红', '小花', '小小', '张三', '李四', '王五']
        for (let i = 0; i < m; i++) {
          var map = {}
          map.clr = clr[i]
          map.todo = this.random(0, 8)
          map.partin = this.random(6, 18)
          map.overdue = this.random(6, 18)
          this.clrSumList.push(map)
        }
      },
      refreshSumList () {
        this.dataList2 = [
          {'name': '今日新增', 'num': 0, 'color': '#3883F8', 'icon': 'el-icon-circle-plus-outline'},
          {'name': '待处理总数', 'num': 0, 'color': '#FFCD3D', 'icon': 'el-icon-time'},
          // {'name': '逾期总数', 'num': '开发中', 'color': '#FF4848', 'icon': 'fa fa-frown-o'},
          {'name': '工单解决率', 'num': (0 + '%'), 'color': '#3CD768', 'icon': 'el-icon-circle-check'}]
        this.$http({
          url: '/wa/count/sum',
          method: 'get',
          params: {
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList2[1].num = data.data.bzwwc
            this.dataList2[0].num = data.data.jrxj
            this.dataList2[3].num = (data.data.finished / (data.data.unfinished + data.data.finished) * 100).toFixed(0) + '%'
            this.$refs.chart2.options.series[0].data = [
              {name: '已完成', value: data.data.finished},
              {name: '未完成', value: data.data.unfinished}]
          }
        })
      },

      initEcharts () {
        console.log(this.$refs)
        this.$refs.chart1.options.series[2].areaStyle.normal.color = new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(255, 72, 72, 0.5)'
        }, {
          offset: 1,
          color: 'rgba(255, 72, 72, 0.00)'
        }])
        this.$refs.chart1.options.series[1].areaStyle.normal.color = new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(60, 215, 104, 0.5)'
        }, {
          offset: 1,
          color: 'rgba(60, 215, 104, 0.00)'
        }])
        // this.$refs.chart3.options.legend.data = ['设备机房出入申请单', '人员机房出入申请', '申领新设备申请表', '系统升级工单']
        // this.$refs.chart3.options.series[0].data = [{value: '8', name: '设备机房出入申请单'},
        // {value: '5', name: '人员机房出入申请'}, {value: '2', name: '申领新设备申请表'}, {value: '4', name: '系统升级工单'}]
      },
      exportExcel () {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        // this.refreshList()
      },
      formatDateTime (date) {
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        minute = minute < 10 ? ('0' + minute) : minute
        var second = date.getSeconds()
        second = second < 10 ? ('0' + second) : second
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      }
    }
  }
</script>
<style>
  .numStyle {
    -webkit-text-fill-color: rgb(14, 116, 218, 0.55);
    -webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);
    font-size: 28px;
  } 
</style>