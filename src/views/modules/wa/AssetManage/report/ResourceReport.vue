<template>
  <div>
    <el-col :span="24">
      <el-row style="padding: 10px">
        <el-col :span="22">
          <span>资产分组</span>
          <el-radio-group v-model="resourceType" @change="refreshResouceList" style="margin-left: 15px;">
            <el-radio-button :label="100">全部</el-radio-button>
            <el-radio-button :label="0">计算设备</el-radio-button>
            <el-radio-button :label="1">终端设备</el-radio-button>
            <el-radio-button :label="2">网络设备</el-radio-button>
            <el-radio-button :label="3">链路信息</el-radio-button>
            <el-radio-button :label="4">机房信息</el-radio-button>
            <el-radio-button :label="5">软件资源</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="2">
          <el-button  type="primary" @click="typeExport">导出</el-button>
        </el-col>
      </el-row>
      <el-row style="padding: 10px">
        <el-table
          border
          :data="resourceList"
          style="width: 100%">
          <el-table-column
            prop="zcfz"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="资产分组">
          </el-table-column>
          <el-table-column
            prop="zclx"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="资产类型">
          </el-table-column>
          <el-table-column
            prop="sum"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="配置项总数">
          </el-table-column>
          <el-table-column
            prop="using"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="在用">
          </el-table-column>
          <el-table-column
            prop="wxz"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="维修中">
          </el-table-column>
          <el-table-column
            prop="unusing"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="停用">
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
  export default {
    data () {
      return {
        interval: 2000,
        resourceType: 100,
        classCode: '',
        resourceList: [],
        total: 0,
        pageSize: 10,
        pageNo: 1,
        deviceName: 'pc服务器',
        searchForm: {

        },
        TreeData: [
          {
            name: '计算机设备',
            id: '1',
            childNodes: [
              {
                name: 'pc服务器',
                id: 'pc'
              }, {
                name: '存储设备',
                id: 'ccsb'
              }
            ]
          },
          {
            name: '终端设备',
            id: '2',
            childNodes: [
              {
                name: '云桌面终端',
                id: 'uzmzd'
              }, {
                name: '计算机终端',
                id: 'jsjzd'
              }, {
                name: '智能警务终端',
                id: 'znjwzd'
              }, {
                name: '其他终端',
                id: 'otherzd'
              }
            ]
          },
          {
            name: '网络设备',
            id: '3',
            childNodes: [
              {
                name: '路由器',
                id: 'Router'
              }, {
                name: '交换机',
                id: 'Switch'
              }, {
                name: '传输设备',
                id: 'cssb'
              }, {
                name: '防火墙',
                id: 'Firewall'
              }
            ]
          },
          {
            name: '链路信息',
            id: '4',
            childNodes: [
              {
                name: '链路信息',
                id: 'Link'
              }
            ]
          },
          {
            name: '机房信息',
            id: '5',
            childNodes: [
              {
                name: '机房',
                id: 'jf'
              },
              {
                name: '机柜',
                id: 'jg'
              },
              {
                name: '机房设施',
                id: 'jfss'
              }
            ]
          },
          {
            name: '软件资源',
            id: '6',
            childNodes: [
              {
                name: '操作系统',
                id: 'czxt'
              },
              {
                name: '数据库',
                id: 'database'
              },
              {
                name: '中间件',
                id: 'zjj'
              },
              {
                name: '其他',
                id: 'rjzyother'
              }
            ]
          }
        ]
      }
    },
    components: {

    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.refreshResouceList()
      },
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      refreshResouceList () {
        this.resourceList = []
        if (this.resourceType === 100) {
          for (let i = 0; i < this.TreeData.length; i++) {
            var map = {}
            map.zcfz = this.TreeData[i].name
            map.zclx = this.TreeData[i].childNodes[0].name
            map.sum = this.random(180, 200)
            map.using = this.random(120, 170)
            map.wxz = this.random(1, 10)
            map.unusing = map.sum - map.using - map.wxz
            this.resourceList.push(map)
            for (let j = 1; j < this.TreeData[i].childNodes.length; j++) {
              var map1 = {}
              map1.zcfz = ''
              map1.zclx = this.TreeData[i].childNodes[j].name
              map1.sum = this.random(180, 200)
              map1.using = this.random(120, 170)
              map1.wxz = this.random(1, 10)
              map1.unusing = map1.sum - map1.using - map1.wxz
              this.resourceList.push(map1)
            }
          }
        } else {
          var map2 = {}
          map2.zcfz = this.TreeData[this.resourceType].name
          map2.zclx = this.TreeData[this.resourceType].childNodes[0].name
          map2.sum = this.random(180, 200)
          map2.using = this.random(120, 170)
          map2.wxz = this.random(1, 10)
          map2.unusing = map2.sum - map2.using - map2.wxz
          this.resourceList.push(map2)
          for (let k = 1; k < this.TreeData[this.resourceType].childNodes.length; k++) {
            var map11 = {}
            map11.zcfz = ''
            map11.zclx = this.TreeData[this.resourceType].childNodes[k].name
            map11.sum = this.random(180, 200)
            map11.using = this.random(120, 170)
            map11.wxz = this.random(1, 10)
            map11.unusing = map11.sum - map11.using - map11.wxz
            this.resourceList.push(map11)
          }
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleNodeClick (data) {
        console.log(data)
        this.deviceName = data.name
        this.total = this.random(2, 13)
        this.pageNo = 1
        this.refreshResouceList()
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