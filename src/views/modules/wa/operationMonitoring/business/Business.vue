<template>
  <div>
    <el-row style="margin:10px">
      <el-col :span="11">
        <el-row>
          <el-col>
            <el-card class="box-card"  style="margin:20px">
              <div slot="header" class="clearfix">
                  <span>XX系统</span>
              </div>
              <el-row>
                <el-col :span="11" style="margin:10px">
                  <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
                    <div class="actCard">
                      <div :style="'height: 75px;float:left;width: 60%;text-align: center;line-height: 75px;'">
                      <!-- <i :class="data.icon" style="transform: scale(1.8)"></i> -->
                          <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">99.9%</span>
                      </div>
                      <div style="height: 75px;float:left;width: 40%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>近30天</span></div>
                        <div><span>无故障率</span></div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="11" style="margin:10px">
                  <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
                    <div class="actCard">
                      <div style="height: 75px;float:left;width: 100%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>业务服务：</span><el-tag>正常</el-tag></div>
                        <div><span>业务处理：</span><el-tag>正常</el-tag></div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11" style="margin:10px">
                  <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
                    <div class="actCard">
                      <div :style="'height: 75px;float:left;width: 60%;text-align: center;line-height: 75px;'">
                          <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">99</span>
                      </div>
                      <div style="height: 75px;float:left;width: 40%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>近30天</span></div>
                        <div><span>应用故障次数</span></div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="11" style="margin:10px">
                  <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
                    <div class="actCard">
                      <div :style="'height: 75px;float:left;width: 60%;text-align: center;line-height: 75px;'">
                          <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">9</span>
                      </div>
                      <div style="height: 75px;float:left;width: 40%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>近30天</span></div>
                        <div><span>设备故障次数</span></div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
                <el-table
                  border
                  :data="tabData.todayList"
                  style="width: 100%">
                  <el-table-column
                      prop="name"
                      header-align="center"
                      align="center"
                      show-overflow-tooltip
                      label="资源类型">
                  </el-table-column>
                  <el-table-column
                      prop="entityName"
                      header-align="center"
                      align="center"
                      show-overflow-tooltip
                      label="资源量">
                  </el-table-column>
                  <el-table-column
                      prop="count"
                      header-align="center"
                      align="center"
                      show-overflow-tooltip
                      label="监测量">
                  </el-table-column>
                  <el-table-column
                      prop="subNum"
                      header-align="center"
                      align="center"
                      show-overflow-tooltip
                      label="异常数量">
                  </el-table-column>
                </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="13" style="padding:10px">
        <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:10px">
          <el-table
            border
            :data="tabData.allList"
            style="width: 100%">
            <el-table-column
                prop="name"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="业务模块">
            </el-table-column>
            <el-table-column
                prop="entityName"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="响应时间">
            </el-table-column>
            <el-table-column
                prop="severity"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="登录状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.severity === 0" type="success">恢复</el-tag>
                    <el-tag v-if="scope.row.severity === 1">提醒</el-tag>
                    <el-tag v-if="scope.row.severity === 2" type="warning">警告</el-tag>
                    <el-tag v-if="scope.row.severity === 3" type="danger">紧急</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="firstOccurTime"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="查询次数">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            border
            :data="tabData.todayList"
            style="width: 100%">
            <el-table-column
                prop="name"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="故障类型">
            </el-table-column>
            <el-table-column
                prop="entityName"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="故障节点">
            </el-table-column>
            <el-table-column
                prop="severity"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="告警级别">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.severity === 0" type="success">恢复</el-tag>
                    <el-tag v-if="scope.row.severity === 1">提醒</el-tag>
                    <el-tag v-if="scope.row.severity === 2" type="warning">警告</el-tag>
                    <el-tag v-if="scope.row.severity === 3" type="danger">紧急</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="持续时长">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabData: {
        allList: [],
        todayList: []
      },
      pageNo: 1,
      pageSize: 10,
      pageSize1: 4,
      total: 0,
      startTime: '',
      tabName: 'today',
      isSearchCollapse: false,
      alertCount: [
        {
          name: '网络告警',
          num: 101
        }, {
          name: '服务器告警',
          num: 200
        }, {
          name: '安全告警',
          num: 166
        }, {
          name: '机房告警',
          num: 188
        }, {
          name: '终端告警',
          num: 199
        }, {
          name: '其他告警',
          num: 120
        }
      ],
      severityCount: [
        {
          value: '紧急',
          count: '',
          color: '#FF4848'
        }, {
          value: '警告',
          count: '',
          color: '#fadc23'
        }, {
          value: '错误',
          count: '',
          color: '#ffae2f'
        }, {
          value: '恢复',
          count: '',
          color: '#52edcb'
        }
      ],
      statusList: [
        {
          id: 0,
          name: '新告警'
        }, {
          id: 40,
          name: '已确认'
        }, {
          id: 150,
          name: '处理中'
        }, {
          id: 190,
          name: '已解决'
        }, {
          id: 255,
          name: '已关闭'
        }
      ],
      searchDates: '',
      searchForm: {

      },
      loading: false
    }
  },
  activated () {
    this.refreshList()
    this.refreshSeverity()
  },
  methods: {
    refreshList () {
      this.startTime = new Date(new Date().toLocaleDateString()).getTime()
      this.refreshToday()
      this.refreshAll()
    },
    // 今日告警列表
    refreshToday () {
      this.loading = true
      this.$http({
        url: '/alert/query',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize1,
          'begin': this.startTime,
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.total) {
          this.tabData.todayList = data.records
          this.total = data.total
          console.log(data.records)
          this.loading = false
        }
      })
    },
    // 全部告警列表
    refreshAll () {
      this.loading = true
      this.$http({
        url: '/alert/query',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.total) {
          this.tabData.allList = data.records
          this.total = data.total
          console.log(data.records)
          this.loading = false
        }
      })
    },
    // 按告警级别统计
    refreshSeverity () {
      this.loading = true
      this.$http({
        url: '/alert/statistics',
        method: 'get',
        params: {
          'groupBy': 'severity'
        }
      }).then(({data}) => {
        if (data) {
          console.log(data)
          data.forEach(e => {
            if (e.value === '3') {
              this.severityCount[0].count = e.count
            } else if (e.value === '2') {
              this.severityCount[1].count = e.count
            } else if (e.value === '1') {
              this.severityCount[2].count = e.count
            } else if (e.value === '0') {
              this.severityCount[3].count = e.count
            }
          })
        //   this.severityCount = data
          this.loading = false
        }
      })
    },
    handleClick (tab, event) {
      console.log(tab.name)
      this.refreshList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.refreshList()
    },
      // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList()
    },
    color (value) {
      if (value === '3') {
        return '#FF4848'
      }
      if (value === '2') {
        return '#fadc23'
      } else {
        return '#FF4848'
      }
    }
  }
}
</script>