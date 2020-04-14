<template>
  <div>
    <el-col :span="24">
      <el-row style="padding: 10px">
        <el-col :span="22">
          <span>资产分组</span>
          <el-radio-group v-model="resourceType" @change="refreshResouceList" style="margin-left: 15px;">
            <el-radio-button :label="data.id" v-for="data in TreeData" :key="data.id">{{data.name}}</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="2">
          <el-button  type="primary" @click="typeExport">导出</el-button>
        </el-col>
      </el-row>
      <el-row style="padding: 10px">
        <el-col :span="15" style="padding: 10px">
          <el-table
            border
            :data="resourceList"
            style="width: 100%">
            <el-table-column
              prop="jf"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="机房">
            </el-table-column>
            <el-table-column
              prop="jg"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="机柜">
              <template slot-scope="scope">
                <el-button  type="text" size="small" @click="showTable(scope.row)">{{scope.row.jg}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="设备数">
            </el-table-column>
            <el-table-column
              prop="using"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="U位使用率">
            </el-table-column>
            <el-table-column
              prop="fz"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="额定功率负载">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8" style="padding: 10px">
          <el-table
            border
            :data="dataList"
            style="width: 100%">
            <el-table-column
              prop="type"
              header-align="center"
              align="center"
              show-overflow-tooltip
              label="设备类型">
            </el-table-column>
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
              label="IP地址">
            </el-table-column>
          </el-table>
        </el-col>
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
        dataList: [],
        total: 0,
        pageSize: 10,
        pageNo: 1,
        deviceName: 'pc服务器',
        searchForm: {

        },
        TreeData: [
          {
            id: 100,
            name: '全部',
            jg: 3
          }, {
            id: 1,
            name: '1号机房',
            jg: 5
          }, {
            id: 2,
            name: '2号机房',
            jg: 4
          }, {
            id: 3,
            name: '3号机房',
            jg: 6
          }, {
            id: 4,
            name: '4号机房',
            jg: 5
          }, {
            id: 5,
            name: '5号机房',
            jg: 8
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
          for (let i = 1; i < this.TreeData.length; i++) {
            var map = {}
            map.jf = this.TreeData[i].name
            map.jg = '1机柜'
            map.num = this.random(5, 10)
            map.using = this.random(60, 90) + '%'
            map.fz = this.random(40, 80) + '%'
            this.resourceList.push(map)
            for (let j = 1; j < this.TreeData[i].jg; j++) {
              var map1 = {}
              map1.jf = ''
              map1.jg = j + 1 + '机柜'
              map1.num = this.random(5, 10)
              map1.using = this.random(60, 90) + '%'
              map1.fz = this.random(40, 80) + '%'
              this.resourceList.push(map1)
            }
          }
        } else {
          var map2 = {}
          map2.jf = this.TreeData[this.resourceType].name
          map2.jg = '1机柜'
          map2.num = this.random(5, 10)
          map2.using = this.random(60, 90) + '%'
          map2.fz = this.random(40, 80) + '%'
          this.resourceList.push(map2)
          for (let k = 1; k < this.TreeData[this.resourceType].jg; k++) {
            var map11 = {}
            map11.jf = ''
            map11.jg = k + 1 + '机柜'
            map11.num = this.random(5, 10)
            map11.using = this.random(60, 90) + '%'
            map11.fz = this.random(40, 80) + '%'
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
      },
      showTable (row) {
        console.log(row)
        this.dataList = []
        for (let aa = 0; aa < row.num; aa++) {
          var ma = {}
          ma.type = '服务器'
          ma.name = '服务器' + aa
          ma.ip = '192.168.0.' + aa
          this.dataList.push(ma)
        }
      }
    }
  }
</script>