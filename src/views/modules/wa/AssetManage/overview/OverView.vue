<template>
  <div>
    <el-row>
      <el-col :span="14">
        <el-card class="box-card" style="margin:5px">
          <v-chart ref="chart1" :options="optionzl" style="width: 100%;height: 510px;" auto-resize></v-chart>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{ 'padding': '5px','margin': '5px' }" style="margin:5px">
              <v-chart ref="chart2" :options="optionfx" style="width: 100%;height: 250px" auto-resize></v-chart>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card :body-style="{ 'padding': '5px','margin': '5px' }" style="margin:5px">
              <v-chart ref="chart3" :options="optiontj" style="width: 100%;height: 250px" auto-resize></v-chart>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin:5px">
      <el-col :span="14" style="padding-right:5px">
        <el-table
          border
          :data="clrSumList"
          style="width: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);">
          <el-table-column
            prop="clr"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="状态类型">
          </el-table-column>
          <el-table-column
            prop="todo"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="云桌面终端">
          </el-table-column>
          <el-table-column
            prop="partin"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="计算机终端">
          </el-table-column>
          <el-table-column
            prop="overdue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="智能警务终端">
          </el-table-column>
          <el-table-column
            prop="overdue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="显示器">
          </el-table-column>
          <el-table-column
            prop="overdue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="移动介质">
          </el-table-column>
          <el-table-column
            prop="overdue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="打印机">
          </el-table-column>
          <el-table-column
            prop="overdue"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="其他终端">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" style="padding-left:5px">
        <el-table
          border
          :data="clrSumList"
          style="width: 100%;	box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);">
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
            formatter: '{b}<br />{a0}: {c0}',
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
            data: ['总数']
          },
          xAxis: {
            type: 'category',
            // boundaryGap: false,
            splitLine: {show: false},
            axisLabel: {interval: 0, rotate: 40},
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
              barWidth: 20,
              itemStyle: {
                color: 'rgb(56, 171, 248)'
              },
              areaStyle: {
                normal: {}
              },
              stack: '总数',
              data: [1, 3, 9, 7, 8, 4, 4, 3, 9]
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
            data: ['在保', '过保', '未知'],
            top: '15%'
          },
          xAxis: {
            type: 'category',
            name: '',
            // boundaryGap: false,
            splitLine: {show: false},
            axisLabel: {interval: 0, rotate: 40},
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            top: '35%',
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
                normal: {}
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
            },
            {
              name: '未知',
              type: 'bar',
              smooth: true,
              itemStyle: {
                color: 'rgb(170, 177, 182, 0.9)'
              },
              areaStyle: {},
              data: [1, 2, 4, 8, 6, 2, 6, 1, 0]
            }
          ]
        },
        optiontj: {
          title: {
            text: '设备生命周期状态统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['库存', '上架在用', '暂停使用', '已下架待报废', '已报废'],
            top: '10%'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '30%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {interval: 0, rotate: 40},
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '库存',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '上架在用',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '暂停使用',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '已下架待报废',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '已报废',
              type: 'line',
              stack: '总量',
              data: []
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
        loading: false,
        // 资产仓库总览设备名称
        deviceNameData: [],
        // 资产仓库总览的统计数据
        deviceNumData: [],
        // 设备维保状态设备名称
        deviceNameDataW: [],
        // 设备维保状态统计数据-在保
        deviceNumDataW1: [],
        // 设备维保状态统计数据-过保
        deviceNumDataW2: [],
        // 设备维保状态统计数据-未知
        deviceNumDataW3: [],
        // 设备生名周期设备名称
        deviceNameDataL: [],
        // 设备生命周期统计数据-库存
        deviceNumDataL1: [],
        // 设备生命周期统计数据-上架在用
        deviceNumDataL2: [],
        // 设备生命周期统计数据-暂停使用
        deviceNumDataL3: [],
        // 设备生命周期统计数据-已下架待报废
        deviceNumDataL4: [],
        // 设备生命周期统计数据-已报废
        deviceNumDataL5: []
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
    created () {
      this.getCmdbCountCi()
      this.getCmdbCountMaintenance()
      this.getCmdbCountLifeCycle()
    },
    methods: {
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      refreshClrSumList (m) {
        this.clrSumList = []
        var ywxt = ['未使用', '已使用', '待用', '拟报废', '已报废', '借用', '待回收']
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
        this.dataList2 = [{
          'name': '今日新增',
          'num': this.random(0, 8),
          'color': '#3883F8',
          'icon': 'el-icon-circle-plus-outline'
        },
          {'name': '本周待处理', 'num': this.random(0, 8), 'color': '#FFCD3D', 'icon': 'el-icon-time'},
          {'name': '本周逾期数', 'num': this.random(0, 8), 'color': '#FF4848', 'icon': 'fa fa-frown-o'},
          {'name': '工单解决率', 'num': (this.random(0, 8) + '%'), 'color': '#3CD768', 'icon': 'el-icon-circle-check'}]
      },
      getCmdbCountCi () {
        this.loading = true
        this.$http({
          url: '/cmdb/count/countCi',
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.success) {
            let cmdList = data.data
            for (let x of cmdList) {
              this.deviceNameData.push(x.name)
              this.deviceNumData.push(x.count)
            }
           // console.log(this.deviceNumData)
            this.loading = false
          }
        })
      },
      getCmdbCountMaintenance () {
        this.loading = true
        this.$http({
          url: '/cmdb/count/countMaintenance',
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.success) {
            let cmdList = data.data
            for (let i = 0; i < cmdList.length; i++) {
              for (let key in cmdList[i]) {
               // console.log(cmdList[i][key])
                if (key === 'online') {
                  this.deviceNumDataW1.push(cmdList[i][key])
                } else if (key === 'offline') {
                  this.deviceNumDataW2.push(cmdList[i][key])
                } else if (key === 'unknown') {
                  this.deviceNumDataW3.push(cmdList[i][key])
                }
              }
              this.deviceNameDataW.push(cmdList[i].name)
            }
            this.loading = false
          }
        })
      },
      getCmdbCountLifeCycle () {
        this.loading = true
        this.$http({
          url: '/cmdb/count/countLifeCycle',
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.success) {
            let cmdList = data.data
            console.log(cmdList)
            // for (let i = 0; i < cmdList.length; i++) {
            for (let key in cmdList) {
              console.log(key)
              this.deviceNumDataL1.push(cmdList[key].opt.kc)
              this.deviceNumDataL2.push(cmdList[key].opt.sjzy)
              this.deviceNumDataL3.push(cmdList[key].opt.ztsy)
              this.deviceNumDataL4.push(cmdList[key].opt.yxjdbf)
              this.deviceNumDataL5.push(cmdList[key].opt.ybf)
              this.deviceNameDataL.push(cmdList[key].name)
            }
            console.log(JSON.stringify(this.deviceNumDataL2))
            console.log(this.deviceNameDataL)
            this.loading = false
          }
        })
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
        this.$refs.chart1.options.xAxis.data = this.deviceNameData // 名称
        this.$refs.chart1.options.series[0].data = this.deviceNumData // 总数
        this.$refs.chart2.options.xAxis.data = this.deviceNameDataW // 名称
        this.$refs.chart2.options.series[0].data = this.deviceNumDataW1 // 在保
        this.$refs.chart2.options.series[1].data = this.deviceNumDataW2 // 过保
        this.$refs.chart2.options.series[2].data = this.deviceNumDataW3 // 未知
        this.$refs.chart3.options.xAxis.data = this.deviceNameDataL // 名称
        this.$refs.chart3.options.series[0].data = this.deviceNumDataL1 // 库存
        this.$refs.chart3.options.series[1].data = this.deviceNumDataL2 // 上架在用
        this.$refs.chart3.options.series[2].data = this.deviceNumDataL3 // 暂停使用
        this.$refs.chart3.options.series[3].data = this.deviceNumDataL4 // 已下架待报废
        this.$refs.chart3.options.series[4].data = this.deviceNumDataL5 // 已报废
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
