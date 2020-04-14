<template>
  <div>
      <el-row>
        <el-col :span="24">
          <el-card class="box-card" shadow="hover" style="margin:10px" :body-style="{ padding: '10px 20px 0px 20px'}">
            <el-row :gutter="10">
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
          </el-card>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-card :body-style="{ 'padding': '10px 20px 0px 20px','margin': '0px' }" style="margin:5px 10px">
            <div slot="header">
              <span>工单趋势</span>
              <el-date-picker
                v-model="searchForm.inDate"
                style="float: right; margin-top: -6px"
                type="daterange"
                size="small"
                align="right"
                value-format="yyyy-MM-dd hh:mm:ss"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <span style="float: right;">选择统计时间段：</span>
            </div>
            <div style="">
              <v-chart ref="chart1" :options="option" style="width: 100%;height: 380px"></v-chart>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" style="margin:10px">
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
        <el-col :span="5" style="margin:10px">
          <v-chart ref="chart2" :options="pieOption" style="width: 100%" auto-resize></v-chart>
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
        searchForm: {
          tableDta: [],
          tuser: {
            id: ''
          },
          name: '',
          sex: '',
          inDate: ''
        },
        clrSumList: [],
        tabData: {
          partInList: [],
          allList: []
        },
        visible: false,
        pieOption: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['已完成', '未完成']
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
                  value: 335,
                  itemStyle: {
                    color: 'rgba(70, 228, 177, 0.85)'
                  },
                  name: '已完成'},
                {value: 30, name: '未完成'}
              ]
            }
          ]
        },
        option: {
          title: {
            text: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            left: 'left',
            data: ['工单创建', '工单完成', '工单逾期']
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
              name: '工单创建',
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
              name: '工单完成',
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
              name: '工单逾期',
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
        this.dataList2 = [{'name': '今日新增', 'num': this.random(0, 8), 'color': '#3883F8', 'icon': 'el-icon-circle-plus-outline'},
        {'name': '本周待处理', 'num': this.random(0, 8), 'color': '#FFCD3D', 'icon': 'el-icon-time'},
        {'name': '本周逾期数', 'num': this.random(0, 8), 'color': '#FF4848', 'icon': 'fa fa-frown-o'},
        {'name': '工单解决率', 'num': (this.random(10, 80) + '%'), 'color': '#3CD768', 'icon': 'el-icon-circle-check'}]
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
        console.log(this.$refs)
        this.option.series[0].data = [5, 4, 6, 4, 8, 5, 4, 3, 1] // 创建
        this.option.series[1].data = [2, 3, 4, 3, 4, 3, 6, 2, 3] // 完成
        this.option.series[2].data = [1, 2, 1, 2, 1, 2, 0, 0, 0] // 逾期
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
<style>
  .numStyle {
    -webkit-text-fill-color: rgb(14, 116, 218, 0.55);
    -webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);
    font-size: 28px;
  } 
</style>