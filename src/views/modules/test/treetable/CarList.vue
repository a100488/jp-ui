<template>
  <div>
  <el-row :gutter="10">
    <el-col :span="5">
     <el-card  shadow="never" :body-style="contentViewHeight">
      <el-tag
        closable
        size="small" 
        style="margin-bottom:5px"
        v-if="selectCarKindName"
        :disable-transitions="false"
        @close="handleNodeClose">
        {{selectCarKindName}}
      </el-tag>
      <el-row :gutter="5">
        <el-col :span="20">
          <el-input
            placeholder="输入关键字进行过滤"
            size="small"
            v-model="filterText">
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="addTreeNode" size="small" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
      <el-tree
        class="filter-tree"
        :data="carKindTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'name',         // 显示名称
              children: 'childNodes'    // 子级字段名
            }"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="carKindTree">
           <span class="custom-tree-node" slot-scope="{ node, data}">
            <span>{{ node.label }}</span>
            <span>
               <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)">
               </el-button>
                <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)">
               </el-button>
                <el-button type="text" class="tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)">
               </el-button>
            </span>
          </span>
      </el-tree>
      </el-card>
    </el-col>

    <el-col :span="19">
    <el-card  shadow="never" :body-style="contentViewHeight">
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="kind.id">
		<SelectTree
                      ref="kind"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'childNodes'    // 子级字段名
                        }"
                      size="small"
                      url="/test/treetable/carKind/treeData"
                      :value="searchForm.kind.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {searchForm.kind.id=value}"/>
		     </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/test/treetable/car/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('test:treetable:car:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:treetable:car:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:treetable:car:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('test:treetable:car:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:treetable:car:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
      border
      size="medium"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        size="medium"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
	  <el-table-column
        prop="name"
        show-overflow-tooltip
        sortable="custom"
        label="品牌">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:treetable:car:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:treetable:car:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="kind.name"
        show-overflow-tooltip
        sortable="custom"
        label="车系">
      </el-table-column>
	  <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="简介">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:treetable:car:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:treetable:car:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:treetable:car:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    </el-card>
    </el-col>
</el-row>
        <!-- 弹窗, 新增 / 修改 -->
    <CarForm  ref="carForm" @refreshDataList="refreshList"></CarForm>
    <CarKindForm  ref="carKindForm" @refreshTree="refreshTree"></CarKindForm>

  </div>
</template>

<script>
  import CarForm from './CarForm'
  import CarKindForm from './CarKindForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        searchForm: {
          kind: {
            id: ''
          }
        },
        filterText: '',
        carKindTreeData: [],
        selectCarKindName: '',
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      SelectTree,
      CarForm,
      CarKindForm
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      }
    },
    watch: {
      filterText (val) {
        this.$refs.carKindTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      refreshTree () {
        this.$http({
          url: `/test/treetable/carKind/treeData`,
          method: 'get'
        }).then(({data}) => {
          this.carKindTreeData = data.treeData
        })
      },
      handleNodeClick (data) {
        this.searchForm.kind.id = data.id
        this.selectCarKindName = '已选: ' + data.name
        this.refreshList()
      },
      handleNodeClose () {
        this.searchForm.kind.id = ''
        this.selectCarKindName = ''
        this.refreshList()
      },
      addChildTreeNode (node) {
        this.$refs.carKindForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
      },
       // 新增
      addTreeNode () {
        this.$refs.carKindForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      editTreeNode (data) {
        this.$refs.carKindForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
      },
      delTreeNode (data) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/test/treetable/carKind/delete',
            method: 'delete',
            params: {'id': data.id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.loading = false
              this.refreshTree()
              this.refreshList()
            }
          })
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/treetable/car/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
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

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.carForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.carForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.carForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/test/treetable/car/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
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
      // 下载模板
      downloadTpl () {
        this.$utils.download('/test/treetable/car/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/treetable/car/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.selectCarKindName = ''
        this.refreshList()
      }
    }
  }
</script>