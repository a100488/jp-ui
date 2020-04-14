<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="version">
                <el-input size="small" v-model="searchForm.version" placeholder="版本号" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="status">
                <el-input size="small" v-model="searchForm.status" placeholder="状态" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="isPrimary">
                <el-input size="small" v-model="searchForm.isPrimary" placeholder="是否主版本" clearable></el-input>
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
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
	  <el-table-column
        prop="formDefinitionId"
        show-overflow-tooltip
        sortable="custom"
        width="280"
        label="表单定义id">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false"  @click="view(scope.row.id)">{{scope.row.formDefinitionId}}</el-link>
        </template>
      </el-table-column>
	  <el-table-column
        prop="json"
        show-overflow-tooltip
        sortable="custom"
        label="流程表单结构体">
      </el-table-column>
	  <el-table-column
        prop="version"
        show-overflow-tooltip
        sortable="custom"
        label="版本号">
      </el-table-column>
	  <el-table-column
        prop="status"
        show-overflow-tooltip
        sortable="custom"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" type="success">已发布</el-tag>
          <el-tag v-else size="small" type="danger">未发布</el-tag>
        </template>
      </el-table-column>
	  <el-table-column
        prop="isPrimary"
        show-overflow-tooltip
        sortable="custom"
        label="是否主版本">
          <template slot-scope="scope">
          <el-tag v-if="scope.row.isPrimary === '1'" size="small" type="success">主版本</el-tag>
          <el-tag v-else size="small" type="danger">非主版本</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        fixed="right"
        width="250"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">预览</el-button>
          <el-button type="text" icon="el-icon-edit"  v-if="scope.row.isPrimary === '0'" size="small" @click="updatePrimary(scope.row.id)">设置为主版本</el-button>
          <el-button type="text"  icon="el-icon-delete"  v-if="scope.row.isPrimary === '0'" size="small" @click="del(scope.row.id)">删除</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
    <FormDefinitionJsonForm  ref="formDefinitionJsonForm" @refreshDataList="refreshList"></FormDefinitionJsonForm>
  </div>
</template>

<script>
  import FormDefinitionJsonForm from './FormDefinitionJsonForm'
  export default {
    data () {
      return {
        searchForm: {
          formDefinitionId: this.$route.query.id,
          version: '',
          status: '',
          isPrimary: ''
        },
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
      FormDefinitionJsonForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/extension/formDefinitionJson/list',
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
      // 查看
      view (id) {
        this.$refs.formDefinitionJsonForm.init(id)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除该版本吗? 删除之后，已发起的流程如果使用了该版本，将无法查看表单内容!`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/extension/formDefinitionJson/delete',
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
      // 设置为主版本
      updatePrimary (id) {
        this.$confirm(`确定设置该版本为主版本吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/extension/formDefinitionJson/updatePrimary',
            method: 'post',
            data: {'id': id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>