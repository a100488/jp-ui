<template>
  <div>
    <el-row :gutter="10">
    <el-col :span="5">
      <el-card  shadow="never" :body-style="contentViewHeight">
      <el-tag
        closable
        size="small" 
        style="margin-bottom:5px"
        v-if="selectDbName"
        :disable-transitions="false"
        @close="handleNodeClose">
        {{selectDbName}}
      </el-tag>
     
      <el-input
        placeholder="输入关键字进行过滤"
        size="small"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="databaseTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'label',         // 显示名称
              children: 'childNodes'    // 子级字段名
            }"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="databaseTree">
      </el-tree>
      </el-card>
    </el-col>
    <el-col :span="19">
     <el-card  shadow="never" :body-style="contentViewHeight">
     <el-form :inline="true"  ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="name">
           <el-input size="small" v-model="searchForm.name" placeholder="表名" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
      </el-form>
    <el-table
      :data="dataList"
      v-loading="loading"
      :height="600"
      border
      size = "medium"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>>
      <el-table-column
        prop="name"
        sortable
        show-overflow-tooltip
        label="表名">
         <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="view(scope.row)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="schema"
        sortable
        show-overflow-tooltip
        label="模式">
      </el-table-column>
       <el-table-column
        prop="catalog"
        sortable
        show-overflow-tooltip
        label="数据库">
      </el-table-column>
      <el-table-column
        prop="Description"
        sortable
        show-overflow-tooltip
        label="说明">
      </el-table-column>
      <el-table-column 
      align="center"
      label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view" type="text" size="small"
            @click="view(scope.row)">查看数据</el-button>
        </template>
    </el-table-column>
    </el-table>
    <el-alert
      :title = "`总共${dataList.length}条记录`"
      type="success"
      :closable="false">
    </el-alert>
    </el-card>
    </el-col>
    </el-row>
    <el-dialog title="查看数据" width="80%" v-if="viewDataVisible" :visible.sync="viewDataVisible">
      <el-table :data="viewData.dataList">
        <el-table-column v-for="column in viewData.columnList" show-overflow-tooltip :key="column.name" :property="column.name" :label="column.description || column.name" ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          name: '',
          dataSourceId: ''
        },
        filterText: '',
        viewDataVisible: false,
        dataList: [],
        databaseTreeData: [],
        orderBy: '',
        dataListSelections: [],
        loading: false,
        selectDbName: '',
        dataSourceId: '',
        viewData: {
          columnList: [],
          dataList: []
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.databaseTree.filter(val)
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      }
    },
    activated () {
      this.refreshTree()
      if (this.searchForm.dataSourceId !== '') {
        this.refreshList()
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 获取数据列表
      refreshList () {
        if (!this.searchForm.dataSourceId) {
          this.$message.warning('请选择一个数据库!')
          return
        }
        this.loading = true
        this.$http({
          url: '/database/table/list',
          method: 'get',
          params: {
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            let results = data.data.rows.filter((row) => {
              if (row.name.indexOf(this.searchForm.name) >= 0) {
                return row
              }
            })
            this.dataList = results
            this.loading = false
          } else {
            this.dataList = []
            this.loading = false
          }
        }).catch(({data}) => {
          this.dataList = []
          this.loading = false
        })
      },
      refreshTree () {
        this.$http({
          url: `/database/datalink/dataSource/treeData2`,
          method: 'get'
        }).then(({data}) => {
          this.databaseTreeData = data.treeData
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      handleNodeClick (data) {
        if (data.type === 'db') {
          this.searchForm.dataSourceId = data.id
          this.selectDbName = '已选数据库: ' + data.label
          this.dataSourceId = data.id
          this.refreshList()
        }
      },
      handleNodeClose () {
        this.searchForm.dataSourceId = ''
        this.selectDbName = ''
        this.dataSourceId = ''
        this.dataList = []
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      edit (row) {
  
      },
      view (row) {
        this.viewDataVisible = true
        this.$http.get(`/database/table/executeSql/${row.name}?dataSourceId=${this.dataSourceId}`).then(({data}) => {
          if (data.success) {
            this.viewData.columnList = data.columns
            this.viewData.dataList = data.list
          }
        })
      },
      doSubmit () {
        let names = this.dataListSelections.map((item) => {
          return item.name
        }).join(',')
        this.$http({
          url: '/gen/genTable/saveTableFromDB',
          method: 'post',
          data: {
            name: names,
            'dataSource.id': this.dataSourceId
          },
          loading: true,
          loadingText: '正在导入数据库...'
        }).then(({data}) => {
          if (data.success) {
            this.$message.success({
              message: data.msg,
              dangerouslyUseHTMLString: true
            })
            this.$emit('refreshDataList')
            this.visible = false
          }
        })
      }
    }
  }
</script>
