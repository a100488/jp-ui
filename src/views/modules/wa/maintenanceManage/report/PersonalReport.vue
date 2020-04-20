<template>
  <div>
    <el-col :span="24">
      <el-row style="padding: 10px">
          <el-form :inline="true"  label-width="120px" label-position="right" label-suffix="：" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
              <!-- 搜索框-->
            <el-form-item prop="searchDates" label="时间">
              <el-radio-group v-model="resourceType" @change="refreshResouceList" style="margin-left: 15px;">
                <el-radio-button :label="'today'">今日</el-radio-button>
                <el-radio-button :label="'week'">本周</el-radio-button>
                <el-radio-button :label="'month'">本月</el-radio-button>
                <el-radio-button :label="'other'">自定义时间</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="searchDates"
                v-if= "resourceType==='other'"
                type="daterange"
                size="small"
                align="right"
                value-format="yyyy-MM-dd hh:mm:ss"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="procDefKey" label="流程名称">
              <el-select v-model="searchForm.procDefKey" size="small" clearable placeholder="请选择">
                <template v-for="item in dataList2">
                  <el-option
                    v-if="item.id.substring(0,2) === 'WA'"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
              <el-button @click="resetSearch()" size="small">导出</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      <el-row style="padding: 10px">
          <el-table
            border
            :data="resourceList"
            style="width: 100%">
            <el-table-column
              prop="date"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="参与人">
            </el-table-column>
            <el-table-column
              prop="date"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="工单类型">
            </el-table-column>
            <el-table-column
              prop="date"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="工单总数">
            </el-table-column>
            <el-table-column
              prop="create"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="完成工单数">
            </el-table-column>
            <el-table-column
              prop="complete"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="未完成工单数">
            </el-table-column>
            <el-table-column
              prop="overdu"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="逾期工单数">
            </el-table-column>
            <el-table-column
              prop="overdu"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="工单完成率">
            </el-table-column>
          </el-table>
        <!-- <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination> -->
      </el-row>
    </el-col>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts/components/ECharts'
  export default {
    data () {
      return {
        resourceType: 'today',
        searchDates: '',
        resourceList: [],
        dataList2: [],
        total: 0,
        pageSize: 10,
        pageNo: 1,
        deviceName: 'pc服务器',
        searchForm: {
          procDefKey: ''
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
        }
      }
    },
    components: {
      'v-chart': ECharts
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.refreshType()
        // this.initEcharts()
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
            this.loading = false
          }
        })
      },
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      refreshResouceList () {
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      onSubmit () {
        console.log(this.searchForm)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshResouceList()
        console.log(val)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.refreshResouceList()
        console.log(val)
      },
      typeExport () {
        console.log(11)
      }
    }
  }
</script>