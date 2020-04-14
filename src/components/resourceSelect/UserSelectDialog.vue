<template>
  <div>
    <el-dialog
    title="关联配置"
    width="70%"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visible">
    <el-row>
    <el-col :span="5">
      <!-- <el-input
        placeholder="输入关键字进行过滤"
        size="small"
        v-model="filterText">
      </el-input> -->
      <!-- <el-tree
        class="filter-tree"
        :data="officeTreeData"
        :props="{
              value: 'code',             // ID字段名
              label: 'name',         // 显示名称
              children: 'childNodes'    // 子级字段名
            }"
        default-expand-all
        node-key="id"
        :default-checked-keys="['5d47cf1c87aa13ea48a9350e']"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @check-change="handleNodeClick"
        show-checkbox
        ref="officeTree">
      </el-tree> -->
      <el-tree
        class="filter-tree"
        node-key="label"
        :default-expanded-keys="expandedKeys"
        :data="TreeData"
        @node-click="handleNodeClick"
        >
      </el-tree>
    </el-col>
    <el-col :span="15">
     <el-form :inline="true" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="name">
          <el-input size="small" v-model="searchForm.name" placeholder="设备名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="ip">
           <el-input size="small" v-model="searchForm.ip" placeholder="IP" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        v-loading="loading"
        border
        size="medium"
        ref="rsourceTable"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="45">
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          min-width="90"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          header-align="center"
          align="center"
          min-width="80"
          label="IP">
          <template slot-scope="scope">
            <p v-if="scope.row.ip != '' && scope.row.ip != undefined" >{{scope.row.ip}}</p>
            <p v-else >--</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="whcs[0].name"
          header-align="center"
          align="center"
          min-width="110"
          label="维护厂商">
          <template slot-scope="scope">
            <p v-if="scope.row.whcs != '' && scope.row.whcs != undefined" >{{scope.row.ip}}</p>
            <p v-else >--</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          header-align="center"
          align="center"
          min-width="90"
          label="序列号">
        </el-table-column>
        <el-table-column
          prop="cameraState"
          header-align="center"
          align="center"
          min-width="50"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cameraState === 'using'" size="small" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.cameraState === '0'" size="small" type="danger">禁用</el-tag>
            <el-tag v-else size="small" type="danger">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          label="操作">
          <template  slot-scope="scope">
            <el-button type="text"  icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-col>
    <el-col :span="4">
      <el-tag
        :key="tag.id"
        v-for="tag in dataListAllSelections"
        closable
        :disable-transitions="false"
        @close="del(tag)">
        {{tag.name}}
      </el-tag>
    </el-col>
    </el-row>
     <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="doSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <resource-form  ref="resourceForm"></resource-form>
  </div>
</template>

<script>
  import resourceForm from './ResourceForm'
  export default {
    data () {
      return {
        searchForm: {
          loginName: '',
          company: {
            id: ''
          },
          office: {
            id: ''
          },
          name: ''
        },
        filterText: '',
        dataListAllSelections: [],   // 所有选中的数据包含跨页数据
        dataListSelections: [],
        idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        dataList: [],
        dynamicTags: [],
        TreeData: [],
        expandedKeys: [],
        officeTreeData: [
          {
            name: '计算机终端',
            id: '5d47cf1c87aa13ea48a9350e',
            code: 'computer'
          },
          {
            name: '磁盘阵列',
            id: '5d47cf1c87aa13ea48a9350f',
            code: 'DiskArray'
          },
          {
            name: 'NVR',
            id: '5de62812d845e376b2088af9',
            code: 'NVR'
          }],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        classCode: '',
        orderBy: '',
        loading: false,
        visible: false,
        selectOfficeName: ''
      }
    },
    components: {
      resourceForm
    },
    props: {
      selectData: {
        type: Array,
        default: () => { return [] }
      },
      limit: {
        type: Number,
        default: 999999
      }
    },
    watch: {
      filterText (val) {
        this.$refs.officeTree.filter(val)
      }
    },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData))
          // this.refreshTree()
          this.getTreeData()
          // this.resetSearch()
        })
      },
      getTreeData () {
        this.TreeData = []
        this.loading = true
        this.$http({
          url: '/cmdb/categories/repoClassTree',
          methods: 'get'
        }).then(({data}) => {
          if (data && data.success) {
            let rt = data.data
            let children = []
            console.log(rt)
            for (let item of rt) {
              if (item.name === '计算设备' || item.name === '网络设备' || item.name === '安全设备' || item.name === '传输设备' || item.name === '通信设备') {
                children = []
                for (let temp of item.children) {
                  children.push({'label': temp.name + '(' + temp.totals + ')', 'code': temp.code})
                }
                this.TreeData.push({'label': item.name + '(' + item.totals + ')', 'children': children})
              }
            }
            this.loading = false
          }
          this.expandedKeys = [this.TreeData[0].label]
          this.classCode = this.TreeData[0].children[0].code
          this.resetSearch()
          // this.query(this.pageSize, this.pageNo, this.classCode)
        })
      },
      // 设置选中的方法
      setSelectRow () {
        if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
          this.$refs.rsourceTable.clearSelection()
          return
        }
                // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        this.$refs.rsourceTable.clearSelection()
        for (var i = 0; i < this.dataList.length; i++) {
          if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
                        // 设置选中，记住table组件需要使用ref="table"
            this.$refs.rsourceTable.toggleRowSelection(this.dataList[i], true)
          }
        }
      },
      // 记忆选择核心方法
      changePageCoreRecordData () {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey
        let that = this
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.dataListAllSelections.length <= 0) {
          this.dataListSelections.forEach(row => {
            that.dataListAllSelections.push(row)
          })
          return
        }
        // 总选择里面的key集合
        let selectAllIds = []
        this.dataListAllSelections.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        let selectIds = []
         // 获取当前页选中的id
        this.dataListSelections.forEach(row => {
          selectIds.push(row[idKey])
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.dataListAllSelections.push(row)
          }
        })
        let noSelectIds = []
              // 得到当前页没有选中的id
        this.dataList.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey])
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.dataListAllSelections.length; i++) {
              if (that.dataListAllSelections[i][idKey] === id) {
                                // 如果总选择中有未被选中的，那么就删除这条
                that.dataListAllSelections.splice(i, 1)
                break
              }
            }
          }
        })
      },
     // 得到选中的所有数据
      getAllSelectionData () {
         // 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
        this.changePageCoreRecordData()
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      del (tag) {
        this.dataListAllSelections.splice(this.dataListAllSelections.indexOf(tag), 1)
        this.$nextTick(() => {
          this.setSelectRow()
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/cmdb/query',
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
                'value': this.classCode,
                'operator': 'EQ'
              }
            ]
          }
        }).then(({data}) => {
          if (data && data.dataList) {
            this.dataList = data.dataList
            console.log(this.dataList)
            this.total = data.totalRecords
            this.loading = false
          }
          this.$nextTick(() => {
            this.setSelectRow()
          })
        })
      },
      // refreshTree () {
      //   this.$http({
      //     url: `/sys/office/treeData`,
      //     method: 'get'
      //   }).then(({data}) => {
      //     this.officeTreeData = data.treeData
      //   })
      // },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
        this.$nextTick(() => {
          this.changePageCoreRecordData()
        })
      },
       // 排序
      sortChangeHandle (obj) {
        if (obj.prop === 'office.name') {
          obj.prop = 'o.name'
        }
        if (obj.prop === 'company.name') {
          obj.prop = 'c.name'
        }
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      handleNodeClick (data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
        if (data.code !== undefined) {
          this.classCode = data.code
          this.refreshList()
        }
      },
      handleNodeClose () {
        this.searchForm.office.id = ''
        this.searchForm.company.id = ''
        this.selectOfficeName = ''
        this.refreshList()
      },
      resetSearch () {
        this.searchForm.company.id = ''
        this.searchForm.office.id = ''
        this.selectOfficeName = ''
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      handleEdit (index, row) {
        console.log(index, row)
        this.visible = false
        this.$refs.resourceForm.init('edit', row)
      },
      doSubmit () {
        if (this.limit < this.dataListAllSelections.length) {
          console.log(this.dataListAllSelections)
          this.$message.error(`你最多选择${this.limit}个设备`)
          return
        }
        this.visible = false
        this.$emit('doSubmit', this.dataListAllSelections)
      }
    }
  }
</script>
