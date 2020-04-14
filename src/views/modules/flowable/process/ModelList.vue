<template>
  <div>
  <el-row :gutter="15">
    <el-col :span="24">
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item label="模型名称" prop="filterText">
            <el-input v-model="searchForm.filterText" size="small" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button  type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0">删除
        </el-button>
        <el-button type="success" :disabled="dataListSelections.length != 1" size="small" @click="setCategory()">
            设置分类
        </el-button>
        <el-button-group class="pull-right">
          <el-tooltip class="item" effect="dark" content="搜索" placement="top">
            <el-button 
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button 
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
          </el-tooltip>     
        </el-button-group>
      </el-row>
        <el-table
          :data="dataList"
          border
          size="medium"
          v-loading="loading"
          @selection-change="selectionChangeHandle"
          class="table">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
         <el-table-column
            prop="name"
            show-overflow-tooltip
            label="流程名称">
          </el-table-column>
          <el-table-column
            prop="key"
            show-overflow-tooltip
            label="流程KEY">
          </el-table-column>
          <el-table-column
            prop="procDef.category"
            label="分类">
          </el-table-column>
          <el-table-column
            prop="version"
            label="流程版本">
            <template slot-scope="scope">       
              <el-tag>{{scope.row.procDef.version || '0'}}</el-tag>
             </template>
          </el-table-column>
          <el-table-column
            prop="version"
            label="流程状态">
            <template slot-scope="scope">       
              <el-tag :type="scope.row.procDef.suspended===false?'success':(scope.row.procDef.suspended===undefined?'primary':'danger')">{{scope.row.procDef.suspended===false?'已发布':(scope.row.procDef.suspended===undefined?'草稿':'已挂起')}}</el-tag>
             </template>
          </el-table-column>
          <el-table-column
            prop="lastUpdated"
            show-overflow-tooltip
            label="更新时间">
             <template slot-scope="scope">
              {{scope.row.lastUpdated | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="250"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="design(scope.row)">设计</el-button>
              <el-button  type="text" size="small" @click="deploy(scope.row)">发布</el-button>
              <el-button type="text" size="small" v-if="scope.row.procDef.suspended===true" @click="active(scope.row.procDef)">激活</el-button>
               <el-button type="text" size="small" v-if="scope.row.procDef.suspended===false" @click="suspend(scope.row.procDef)">挂起</el-button>
               <el-button  type="text" size="small" @click="exportXML(scope.row)">导出</el-button>
              <el-button  type="text" size="small" @click="del(scope.row.id)">删除</el-button>
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
    </el-col>
  </el-row>
       <el-dialog
        title="查看进度"
        :close-on-click-modal="true"
        :visible.sync="visible"
        height="600px">
       
          <iframe :src="processPhotoUrl" frameborder="0" scrolling="auto" width="100%" height="600px"></iframe>
        </el-dialog>

        
    <!-- 弹窗, 新增 / 修改 -->
    <model-form  ref="modelForm"  @create="create"></model-form>
    <!--模型编辑-->
    <design-form ref="designForm" @refreshList="refreshList"></design-form>
    <category-form ref="categoryForm" @refreshList="refreshList"></category-form>

  </div>
</template>

<script>
  import ModelForm from './ModelForm'
  import CategoryForm from './CategoryForm'
  export default {
    data () {
      return {
        searchForm: {
          filterText: ''
        },
        filterText: '',
        searchDates: '',
        selectCategoryName: '',
        categoryTreeData: [],
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        isSearchCollapse: false,
        loading: false,
        visible: false,
        dataListSelections: [],
        processPhotoUrl: ''
      }
    },
    components: {
      ModelForm,
      CategoryForm
    },
    activated () {
      this.refreshList()
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
      },
      filterText (val) {
        this.$refs.categoryTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 获取树数据
      refreshTree () {
        this.$http({
          url: '/extension/actCategory/treeData',
          method: 'get'
        }).then(({data}) => {
          this.categoryTreeData = data.treeData
        })
      },
      handleNodeClick (data) {
        this.searchForm.category = data.id
        this.selectCategoryName = '已选类型: ' + data.name
        this.refreshList()
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/flowable/model/list',
          method: 'get',
          params: {
            'filter': 'processes',
            'modelType': 0,
            'sort': 'modifiedDesc',
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
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
      create (data) {
        // window.open(`${process.env.SERVER_URL}/static/modler/index.html#/editor/${data.id}`)
        this.$refs.designForm.init(data.id)
      },
      design (row) {
        this.$refs.designForm.init(row.id, row.procDef.category)
      },
      design1 (row) {
        this.$refs.designForm1.init(row.id)
      },
      design2 (row) {
        window.open(`${process.env.VUE_APP_SERVER_URL}/static/modler/index.html#/editor/${row.id}`)
      },
      exportXML (row) {
        window.open(`${process.env.VUE_APP_SERVER_URL}/app/rest/models/${row.id}/bpmn20?version=` + new Date().getTime())
      },
      // 部署
      deploy (row) {
        this.$confirm(`确认要发布流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let category = row.procDef.category ? row.procDef.category : '未分类'
          this.$http.post('/flowable/model/deploy', {id: row.id, category: category}).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
       // 新增
      add () {
        // this.$refs.modelForm.init()
        this.$refs.designForm.init()
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除该流程吗?删除流程会级联删除已经存在的实例与历史数据，且不可恢复，请谨慎操作!`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.delete('/flowable/model/delete', {params: {'ids': ids}}).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      suspend (row) {
        this.$confirm(`确认要挂起该流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`/flowable/process/update/suspend?procDefId=${row.id}`).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      active (row) {
        this.$confirm(`确定要激活码?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`/flowable/process/update/active?procDefId=${row.id}`).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      setCategory () {
        let row = this.dataListSelections[0]
        if (row.procDef.id) {
          this.$refs.categoryForm.init(row.procDef.id, row.procDef.category)
        } else {
          this.$message.error('未发布的流程不能设置分类，请先发布流程')
        }
      },
      resetSearch () {
        this.searchDates = ''
        this.searchForm.category = ''
        this.selectCategoryName = ''
        this.$refs.searchForm.resetFields()
        this.$nextTick(() => {
          this.refreshList()
        })
      }
    }
  }
</script>
