<template>
  <div>
      <el-row style="margin:10px">
          <el-col :span="11">
              <el-col :span="8" v-for="data in alertCount" :key="data.name">
                  <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
                      <div class="actCard">
                          <div :style="'height: 75px;float:left;width: 30%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
                          <i :class="data.icon" style="transform: scale(1.8)"></i>
                        </div>
                        <div style="height: 75px;float:left;width: 70%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                          <div><span>{{data.name}}</span></div>
                          <div><span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">{{data.num}}</span></div>
                        </div>
                      </div>
                  </el-card>
              </el-col>
          </el-col>
          <el-col :span="13" style="padding:10px">
            <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
              <div slot="header" class="clearfix">
                <span>告警级别数量</span>
              </div>
              <el-col :span="6" v-for="data in severityCount" :key="data.value">
                <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
                    <div class="actCard">
                      <div :style="'height: 75px;float:left;width: 35%;text-align: center;line-height: 75px;background: ' + data.color">
                      </div>
                      <div style="height: 75px;float:left;width: 65%;text-align: center;line-height: 35px;">
                        <div><span>{{data.value}}</span></div>
                        <div><span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">{{data.count}}</span></div>
                      </div>
                    </div>
                </el-card>
              </el-col>
              <!-- <el-col :span="8">
                <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
                    <div class="actCard">
                    <div :style="'height: 75px;float:left;width: 30%;text-align: center;line-height: 75px;background: #ffae2f'">
                    </div>
                    <div style="height: 75px;float:left;width: 70%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>错误</span></div>
                        <div><span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">200</span></div>
                    </div>
                    </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin:20px">
                    <div class="actCard">
                    <div :style="'height: 75px;float:left;width: 30%;text-align: center;line-height: 75px;background: #fadc23'">
                    </div>
                    <div style="height: 75px;float:left;width: 70%;text-align: center;line-height: 35px;rgba(106, 146, 103, 0.1);">
                        <div><span>警告</span></div>
                        <div><span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">200</span></div>
                    </div>
                    </div>
                </el-card>
              </el-col> -->
            </el-card>
          </el-col>
      </el-row>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item label="告警级别" prop="severity">
          <el-input size="small" v-model="searchForm.severity" placeholder="请输入创单人" clearable></el-input>
        </el-form-item>
        <el-form-item label="告警来源" prop="source">
          <el-input size="small" v-model="searchForm.source" placeholder="请输入告警来源" clearable></el-input>
        </el-form-item>
        <el-form-item prop="status" label="告警状态">
            <el-select v-model="searchForm.status" clearable placeholder="请选择">
                <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="name" label="告警名称">
            <el-input size="small" v-model="searchForm.name" placeholder="请输入告警名称" clearable></el-input>
        </el-form-item>
		     <el-form-item prop="searchDates" label="告警时间">
        	     <el-date-picker
                  v-model="searchDates"
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
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
    <el-row>
        <el-button-group class="pull-right">
            <el-button
                type="default"
                size="small"
                icon="el-icon-search"
                @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button
                type="default"
                size="small"
                icon="el-icon-refresh"
                @click="refreshList">
            </el-button>
        </el-button-group>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="tabName" @tab-click="handleClick">
          <el-tab-pane label="今日告警" name="today">
              <el-table
                border
                :data="tabData.todayList"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="告警名称">
                </el-table-column>
                <el-table-column
                    prop="entityName"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="告警设备">
                </el-table-column>
                <el-table-column
                    prop="ip"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="IP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IP === undefined" type="success">--</span>
                        <span v-else>{{scope.row.IP}}</span>
                    </template>
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
                    label="告警内容">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                    <el-button  type="text" size="small"
                        @click="detail(scope.row)">查看
                    </el-button>
                    <el-button  type="text" size="small"
                        @click="detail(scope.row)">转工单
                    </el-button>
                    </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="total"
                background
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-tab-pane>
          <el-tab-pane label="全部告警" name="all">
            <el-table
                border
                :data="tabData.allList"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="告警名称">
                </el-table-column>
                <el-table-column
                    prop="entityName"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="告警设备">
                </el-table-column>
                <el-table-column
                    prop="ip"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="IP">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IP === undefined" type="success">--</span>
                        <span v-else>{{scope.row.IP}}</span>
                    </template>
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
                    label="告警内容">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                    <el-button  type="text" size="small"
                        @click="detail(scope.row)">查看
                    </el-button>
                    <el-button  type="text" size="small"
                        @click="detail(scope.row)">转工单
                    </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="total"
              background
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
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
      if (this.tabName === 'today') {
        this.startTime = new Date(new Date().toLocaleDateString()).getTime()
        this.refreshToday()
      } else {
        this.refreshAll()
      }
    },
    // 今日告警列表
    refreshToday () {
      this.loading = true
      this.$http({
        url: '/alert/query',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
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
    // 今日告警列表
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