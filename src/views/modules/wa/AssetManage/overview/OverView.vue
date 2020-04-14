<template>
  <div>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card" style="margin:10px">
            <v-chart ref="chart1" :options="optionzl" style="width: 100%;height: 355px" auto-resize></v-chart>
          </el-card>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="12">
          <el-card :body-style="{ 'padding': '10px','margin': '10px' }" style="margin:10px">
            <v-chart ref="chart2" :options="optionfx" style="width: 100%;height: 335px" auto-resize></v-chart>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card :body-style="{ 'padding': '10px','margin': '10px' }" style="margin:10px">
            <v-chart ref="chart3" :options="optiontj" style="width: 100%;height: 335px" auto-resize></v-chart>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin:10px">
        <el-col :span="10" style="padding-right:10px">
          <el-table
            border
            :data="clrSumList"
            style="width: 100%">
            <el-table-column
              prop="clr"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="系统">
            </el-table-column>
            <el-table-column
              prop="todo"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="服务器">
            </el-table-column>
            <el-table-column
              prop="partin"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="数据库">
            </el-table-column>
            <el-table-column
              prop="overdue"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="中间件">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="14" style="padding-left:10px">
          <el-table
            border
            :data="clrSumList"
            style="width: 100%">
            <el-table-column
              prop="jf"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="机房">
            </el-table-column>
            <el-table-column
              prop="todo"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="机柜个数">
            </el-table-column>
            <el-table-column
              prop="partin"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="网络设备">
            </el-table-column>
            <el-table-column
              prop="overdue"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="服务器设备">
            </el-table-column>
            <el-table-column
              prop="partin"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="安全设备">
            </el-table-column>
            <el-table-column
              prop="overdue"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="其他设备">
            </el-table-column>
          </el-table>
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
        clrSumList: [],
        visible: false,
        optionzl: {
          title: {
            text: '资产仓库总览',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            textStyle: {
              color: '#fff',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 16
            }
          },
          legend: {
            left: 'left',
            data: ['总数', '在用']
          },
          xAxis: {
            type: 'category',
            name: '设备类型',
            // boundaryGap: false,
            splitLine: {show: false},
            data: ['服务器', '存储设备', '云桌面终端', '计算机终端', '智能警务终端', '路由器', '交换机', '安全设备', '传输设备', '软件资源']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            name: '设备数'
          },
          // "dataZoom":[{
          //   "show": true,
          //   "height": 12,
          //   "xAxisIndex": [
          //     0
          //   ],
          //   bottom:'5%',
          //   "start": 10,
          //   "end": 90,
          //   handleSize: '110%',
          //   handleStyle:{
          //     color:"#d3dee5",

          //   },
          //   textStyle:{
          //     color:"#fff"},
          //   borderColor:"#90979c"
          // }, {
          //   "type": "inside",
          //   "show": true,
          //   "height": 15,
          //   "start": 1,
          //   "end": 35
          // }],
          series: [
            {
              name: '总数',
              type: 'bar',
              smooth: true,
              itemStyle: {
                color: 'rgb(56, 171, 248)'
              },
              areaStyle: {
                normal: {
                }
              },
              data: [1, 3, 9, 7, 8, 4, 4, 3, 9]
            },
            {
              name: '在用',
              type: 'bar',
              smooth: true,
              itemStyle: {
                color: 'rgb(60, 215, 104)'
              },
              areaStyle: {
                normal: {
                }
              },
              data: [1, 2, 4, 8, 6, 2, 6, 1, 0]
            }
          ]
        },
        optionfx: {
          title: {
            text: '设备维保状态分析',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            left: 'left',
            data: ['在保', '过保']
          },
          xAxis: {
            type: 'category',
            name: '',
            // boundaryGap: false,
            splitLine: {show: false},
            data: ['服务器设备', '存储设备', '终端设备', '网络设备', '安全设备']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            name: ''
          },
          series: [
            {
              name: '在保',
              type: 'bar',
              smooth: true,
              areaStyle: {
                normal: {
                }
              },
              itemStyle: {
                color: 'rgb(60, 215, 104)'
              },
              data: [1, 3, 9, 7, 8, 4, 4, 3, 9]
            },
            {
              name: '过保',
              type: 'bar',
              smooth: true,
              itemStyle: {
                color: 'rgb(255, 72, 72)'
              },
              areaStyle: {},
              data: [1, 2, 4, 8, 6, 2, 6, 1, 0]
            }
          ]
        },
        optiontj: {
          title: {
            text: '设备借出情况统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            left: 'left',
            data: ['总数', '借出']
          },
          xAxis: {
            type: 'category',
            name: '',
            // boundaryGap: false,
            splitLine: {show: false},
            data: ['服务器', '存储设备', '计算机终端', '路由器', '交换机']
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '1%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            name: ''
          },
          series: [
            {
              name: '总数',
              type: 'bar',
              smooth: true,
              areaStyle: {
                normal: {
                }
              },
              itemStyle: {
                color: 'rgb(56, 171, 248)'
              },
              data: [1, 3, 9, 7, 8, 4, 4, 3, 9]
            },
            {
              name: '借出',
              type: 'bar',
              smooth: true,
              itemStyle: {
                color: 'rgb(255, 205, 61)'
              },
              areaStyle: {
                normal: {
                }
              },
              data: [1, 2, 4, 8, 6, 2, 6, 1, 0]
            }
          ]
        },
        dataList2: [],
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
    activated () {
      // this.refreshType()
      // this.refreshToDoList()
      this.initEcharts()
      this.refreshSumList()
      this.refreshClrSumList(this.random(0, 8))
    },

    methods: {
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      refreshClrSumList (m) {
        this.clrSumList = []
        var ywxt = ['A业务系统', 'B业务系统', 'C业务系统', 'D业务系统', 'E业务系统']
        var jf = ['一号机房', '二号机房', '三号机房', '四号机房', '五号机房']
        for (let i = 0; i < 5; i++) {
          var map = {}
          map.clr = ywxt[i]
          map.jf = jf[i]
          map.todo = this.random(0, 8)
          map.partin = this.random(6, 18)
          map.overdue = this.random(6, 18)
          this.clrSumList.push(map)
        }
      },
      refreshSumList () {
        this.dataList2 = [{'name': '今日新增', 'num': this.random(0, 8), 'color': '#3883F8', 'icon': 'el-icon-circle-plus-outline'},
        {'name': '本周待处理', 'num': this.random(0, 8), 'color': '#FFCD3D', 'icon': 'el-icon-time'},
        {'name': '本周逾期数', 'num': this.random(0, 8), 'color': '#FF4848', 'icon': 'fa fa-frown-o'},
        {'name': '工单解决率', 'num': (this.random(0, 8) + '%'), 'color': '#3CD768', 'icon': 'el-icon-circle-check'}]
      },
      // 获取工单类型列表
      refreshType () {
        this.loading = true
        this.$http({
          url: '/flowable/process/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList2 = data.page.list
            // this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 代办工单列表
      refreshToDoList () {
        this.loading = true
        this.$http({
          url: '/flowable/task/todo',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.todoList = data.page.list
            this.total = data.page.count
            console.log(data.page.list)
            this.loading = false
          }
        })
      },
      // 参与数据列表
      refreshPartList () {
        this.loading = true
        this.$http({
          url: '/flowable/task/historic/',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.partInList = data.page.list
            // this.total = data.page.count
            this.loading = false
          }
        })
      },
      initEcharts () {
        console.log(this.$refs.chart1)
        this.$refs.chart1.options.series[0].data = [5, 4, 6, 4, 8, 5, 9, 13, 11, 16] // 总数
        this.$refs.chart1.options.series[1].data = [2, 3, 4, 3, 4, 3, 6, 2, 3, 14] // 在用
        this.$refs.chart2.options.series[0].data = [10, 12, 31, 14, 51] // 在保
        this.$refs.chart2.options.series[1].data = [1, 3, 1, 0, 2] // 过保
        this.$refs.chart3.options.series[0].data = [10, 21, 13, 14, 15] // 总数
        this.$refs.chart3.options.series[1].data = [2, 3, 4, 3, 7] // 借出
        console.log(this.$refs.chart1.options)
      },
      exportExcel () {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        // this.refreshList()
      }
    }
  }
</script>
