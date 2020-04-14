<template>
  <div>
    <el-col :span="24">
      <el-row style="padding: 10px">
        <el-col :span="22">
          <span>资产分组</span>
          <el-radio-group v-model="resourceType" @change="refreshResouceList" style="margin-left: 15px;">
            <el-radio-button :label="data.id" v-for="data in TreeData" :key="data.id">{{data.name}}</el-radio-button>
          </el-radio-group>
          <!-- <el-radio-group v-model="resourceType" @change="refreshResouceList" style="margin-left: 15px;">
            <el-radio-button :label="100">全部</el-radio-button>
            <el-radio-button :label="0">A业务系统</el-radio-button>
            <el-radio-button :label="1">B业务系统</el-radio-button>
            <el-radio-button :label="2">C业务系统</el-radio-button>
            <el-radio-button :label="3">D业务系统</el-radio-button>
          </el-radio-group> -->
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
            label="业务名称">
          </el-table-column>
          <el-table-column
            prop="zclx"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="服务器总数">
          </el-table-column>
          <el-table-column
            prop="sum"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="操作系统">
          </el-table-column>
          <el-table-column
            prop="using"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="数据库">
          </el-table-column>
          <el-table-column
            prop="wxz"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="中间件">
          </el-table-column>
          <el-table-column
            prop="unusing"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="其他">
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
        TreeData: [{
          id: 100,
          name: '全部'
        }, {
          id: 0,
          name: 'A业务系统'
        }, {
          id: 1,
          name: 'B业务系统'
        }, {
          id: 2,
          name: 'C业务系统'
        }, {
          id: 3,
          name: 'A业务系统'
        }]
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
            map.zclx = this.random(180, 200)
            map.sum = this.random(1, 3)
            map.using = this.random(120, 170)
            map.wxz = this.random(1, 10)
            map.unusing = this.random(1, 10)
            this.resourceList.push(map)
          }
        } else {
          var map2 = {}
          map2.zcfz = this.TreeData[this.resourceType].name
          map2.zclx = this.random(180, 200)
          map2.sum = this.random(1, 3)
          map2.using = this.random(120, 170)
          map2.wxz = this.random(1, 10)
          map2.unusing = this.random(1, 10)
          this.resourceList.push(map2)
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