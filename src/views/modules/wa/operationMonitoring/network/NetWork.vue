<template>
  <div>
      <!-- <el-row>
        <el-col :span="24">
          <el-card class="box-card" shadow="never" :body-style="{ padding: '0px'}" style="margin:10px">
            <el-col :span="4">
                <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}" style="margin:10px">
                    <div :style="'height: 75px;float:left;width: 40%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
                      <span>监控总数</span>
                    </div>
                    <div style="height: 75px;float:left;width: 60%;text-align: center;rgba(106, 146, 103, 0.1);">
                      <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);line-height: 75px;-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">{{countType[0].value}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}" style="margin:10px">
                    <div :style="'height: 75px;float:left;width: 40%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
                      <span>在线/离线/未知</span>
                    </div>
                    <div style="height: 75px;float:left;width: 60%;text-align: center;rgba(106, 146, 103, 0.1);">
                      <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);line-height: 75px;-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">{{availableNum.online}}/{{availableNum.offline}}/{{availableNum.unknown}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}" style="margin:10px">
                    <div :style="'height: 75px;float:left;width: 40%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
                      <span>路由器/交换机/防火墙</span>
                    </div>
                    <div style="height: 75px;float:left;width: 60%;text-align: center;rgba(106, 146, 103, 0.1);">
                      <span style="-webkit-text-fill-color: rgb(14, 116, 218, 0.55);line-height: 75px;-webkit-text-stroke: 2px rgb(14, 116, 218, 0.35);font-size: 28px;">{{countType[1].value}}/{{countType[2].value}}/{{countType[3].value}}</span>
                    </div>
                </el-card>
            </el-col>
          </el-card>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-card class="box-card" shadow="never" :body-style="{ padding: '0px'}" style="margin:10px">
          <el-col :span="8">
          </el-col>
          <el-col :span="8">
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-card>
      </el-row> -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}">
            <div :style="'height: 75px;float:left;width: 40%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
              <span>监控总数</span>
            </div>
            <div class="num-div-style">
              <span class="numStyle">{{countType[0].value}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}" >
            <div :style="'height: 75px;float:left;width: 40%;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
              <span>在线/离线/未知</span>
            </div>
            <div class="num-div-style">
              <span class="numStyle">{{availableNum.online}}/{{availableNum.offline}}/{{availableNum.unknown}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px'}">
            <div :style="'height: 75px;float:left;width: 180px;text-align: center;line-height: 75px;background: rgba(106, 146, 103, 0.1);'">
              <span>路由器/交换机/防火墙</span>
            </div>
            <div class="num-div-style">
              <span class="numStyle">{{countType[1].value}}/{{countType[2].value}}/{{countType[3].value}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="7">
            <v-chart ref="chart1" :options="pieOption" style="width: 100%;height: 320px" auto-resize></v-chart>
        </el-col>
        <el-col :span="8">
          <!-- <v-chart ref="chart1" :options="optionLD1" style="width: 100%;height: 325px" auto-resize></v-chart> -->
          <!-- <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px', 'text-align': 'center'}" > -->
            <div class="progres">
              <span style="font-size: 20px;font-weight: bold;">设备CPU负载统计</span>
            </div>
            <el-row class="progres">
              <!-- <el-col :span="12"><span>负载区间</span></el-col>
              <el-col :span="12"><span>设备占比</span></el-col> -->
              <span>{{fw1}}</span>
              <el-progress :text-inside="true" :stroke-width="24" :percentage="100" status="success"></el-progress>
            </el-row>
            <el-row class="progres">
              <span>{{fw2}}</span>
              <el-progress :text-inside="true" :stroke-width="22" :percentage="80" status="warning"></el-progress>
              <!-- <el-col :span="12"><span>{{fw1}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col> -->
            </el-row>
            <el-row class="progres">
              <span>{{fw3}}</span>
              <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception"></el-progress>
              <!-- <el-col :span="12"><span>{{fw2}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col> -->
            </el-row>
            <!-- <el-row type="flex" class="row-bg">
              <el-col :span="12"><span>{{fw3}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col>
            </el-row> -->
          <!-- </el-card> -->
        </el-col>
        <el-col :span="8">
          <v-chart ref="chart1" :options="optionLD" style="width: 100%;height: 325px" auto-resize></v-chart>
          <!-- <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px', 'text-align': 'center'}">
            <div slot="header" class="clearfix">
              <span>设备内存负载统计</span>
            </div>
            <el-row type="flex" class="row-bg">
              <el-col :span="12"><span>负载区间</span></el-col>
              <el-col :span="12"><span>设备占比</span></el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="12"><span>{{fw1}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="12"><span>{{fw2}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col>
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-col :span="12"><span>{{fw3}}</span></el-col>
              <el-col :span="12"><span>0(0%)</span></el-col>
            </el-row>
          </el-card> -->
        </el-col>
      </el-row>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item label="ip地址" prop="ip">
            <el-input size="small" v-model="searchForm.ip" placeholder="请输入创单人" clearable></el-input>
		     </el-form-item>
		     <el-form-item label="工单标题" prop="title">
            <el-input size="small" v-model="searchForm.title" placeholder="请输入工单标题" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="sex" label="在线状态">
           <el-select v-model="searchForm.zxzt" clearable placeholder="请选择">
              <el-option
                v-for="item in dataList2"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
		     </el-form-item>
         <el-form-item prop="sex1" label="设备名称">
            <el-input size="small" v-model="searchForm.status" placeholder="请输入流程状态" clearable></el-input>
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
            <!-- <el-button v-if="hasPermission('test:onetomany:testDataMainForm:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:onetomany:testDataMainForm:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button> -->
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
      <el-col :span="24" style="margin:10px">
        <el-table
          border
          :data="dataList"
          style="width: 100%">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="设备名称">
          </el-table-column>
          <el-table-column
            prop="ip"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="设备IP">
          </el-table-column>
          <el-table-column
              prop="className"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="设备类型">
          </el-table-column>
          <el-table-column
            prop="state_alert"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="告警状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_alert === '紧急'"  type="danger">紧急</el-tag>
              <el-tag v-if="scope.row.state_alert === '错误'"  type="warning">错误</el-tag>
              <el-tag v-else-if="scope.row.state_alert === '正常'" type="success">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="cpu"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="CPU">
          </el-table-column>
          <el-table-column
            prop="ram"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="内存">
            <template slot-scope="scope">
              <span v-if= "scope.row.ram === undefined" type="success">暂无数据</span>
              <span v-else type="success">{{scope.row.ram}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ping"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="延迟">
            <template slot-scope="scope">
              <span v-if= "scope.row.ping === undefined" type="success">暂无数据</span>
              <span v-else type="success">{{scope.row.ping}}ms</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state_available"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state_available === '离线'"  type="danger">离线</el-tag>
              <el-tag v-else-if="scope.row.state_available === '未知'">未知</el-tag>
              <el-tag v-else type="success">在线</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="trace(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts/components/ECharts'
  export default {
    data () {
      return {
        availableNum: {
          online: 0,
          offline: 0,
          unknown: 0
        },
        countType: [
          {
            object_name: '设备总数',
            value: 0
          },
          {
            object_name: '交换机总数',
            value: 0
          },
          {
            object_name: '路由器总数',
            value: 0
          },
          {
            object_name: '防火墙总数',
            value: 0
          }
        ],
        fw1: '0<,<30',
        fw2: '30<,<60',
        fw3: '>60',
        optionLD: {
          title: {
            text: '设备内存负载统计',
            subtext: ''
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            data: ['>60', '30<,<60', '0<,<30']
          },
          series: [
            {
              name: '设备内存负载统计',
              type: 'funnel',
              left: '10%',
              top: 60,
              // x2: 80,
              bottom: 60,
              width: '80%',
              // height: {totalHeight} - y - y2,
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
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
              data: [
                {
                  value: 20,
                  name: '>60',
                  itemStyle: {
                    color: 'rgba(70, 228, 177, 0.85)'
                  }
                },
                {value: 40, name: '30<,<60'},
                {value: 60, name: '0<,<30'}
              ]
            }
          ]
        },
        optionLD1: {
          title: {
            text: '设备CPU负载统计',
            subtext: ''
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          toolbox: {
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            data: ['>60', '30<,<60', '0<,<30']
          },
          series: [
            {
              name: '设备内存负载统计',
              type: 'funnel',
              left: '10%',
              top: 60,
              bottom: 60,
              width: '80%',
              min: 0,
              max: 100,
              minSize: '40%',
              maxSize: '100%',
              // sort: 'descending',
              // gap: 2,
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
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
              data: [
                {
                  value: 10,
                  name: '>60'
                },
                {
                  value: 20,
                  name: '30<,<60',
                  itemStyle: {
                    color: 'rgba(255, 205, 61, 0.75)'
                  }
                },
                {
                  value: 30,
                  name: '0<,<30',
                  itemStyle: {
                    color: 'rgb(70, 228, 177)'
                  }
                }
              ]
            }
          ]
        },
        pieOption: {
          title: {
            text: '设备告警状态统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['正常', '紧急']
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
                  name: '正常'
                },
                {
                  value: 30,
                  name: '紧急'
                }
              ]
            }
          ]
        },
        searchForm: {
          beginDate: '',
          endDate: '',
          name: '',
          ip: '',
          inDate: ''
        },
        searchDates: '',
        visible: false,
        dataList: [],
        dataList2: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        dataListSelections: [],
        isSearchCollapse: false,
        loading: false
      }
    },
    components: {
      'v-chart': ECharts
    },
    activated () {
      this.refreshList()
      this.countByState()
      this.countByType()
    },
    watch: {
      searchDates () {
        if (this.searchDates) {
          this.searchForm.beginDate = this.searchDates[0]
          this.searchForm.endDate = this.searchDates[1]
        } else {
          this.searchForm.beginDate = ''
          this.searchForm.endDate = ''
        }
      }
    },
    methods: {
      // 获取在线/离线/未知数
      countByState () {
        this.loading = true
        this.$http({
          url: '/network/getnum',
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data) {
            this.availableNum = data
            this.loading = false
          }
        })
      },
      // 总数/路由器/交换机/防火墙
      countByType () {
        this.loading = true
        this.$http({
          url: '/network/getdatasets',
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data) {
            this.countType = data
            this.loading = false
          }
        })
      },
      // 统计 CPU&内存 各区间 个数
      // countNum () {
      //   this.loading = true
      //   this.$http({
      //     url: '/network/getdatasets',
      //     method: 'get',
      //     params: {}
      //   }).then(({data}) => {
      //     if (data) {
      //       this.countType = data
      //       this.loading = false
      //     }
      //   })
      // },
      // 获取数据列表
      refreshList () {
        this.refreshAllList()
      },
      // 网络设备列表
      refreshAllList () {
        this.loading = true
        this.$http({
          url: '/network/querymetric',
          method: 'post',
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            'pageNum': this.pageNo - 1,
            'pageSize': this.pageSize,
            'needCount': true,
            'conditions': [
              {
                'field': 'classCode',
                'value': ['Router', 'Firewall', 'Switch'],
                'operator': 'IN'
              }
            ]
          }
        }).then(({data}) => {
          if (data && data.dataList) {
            console.log(data.dataList)
            this.dataList = data.dataList
            this.total = data.total
            this.loading = false
          }
        })
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        // this.refreshList()
      }
    }
  }
</script>
<style>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
    border: 1px solid #EBEEF5;
    margin: 10px;
  }
  .num-div-style {
    height: 75px;
    float:left;
    width: 60%;
    text-align: center;
    line-height: 75px;
  }
  .progres {
    margin: 20px;
    text-align: center;
  }
</style>