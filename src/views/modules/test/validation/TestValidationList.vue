<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="num">
                <el-input size="small" v-model="searchForm.num" placeholder="浮点数字" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="num2">
                <el-input size="small" v-model="searchForm.num2" placeholder="整数" clearable></el-input>
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
              :action="`${this.$http.BASE_URL}/test/validation/testValidation/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('test:validation:testValidation:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:validation:testValidation:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:validation:testValidation:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('test:validation:testValidation:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:validation:testValidation:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="num"
        show-overflow-tooltip
        sortable="custom"
        label="浮点数字">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:validation:testValidation:edit')" @click="edit(scope.row.id)">{{scope.row.num}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:validation:testValidation:view')"  @click="view(scope.row.id)">{{scope.row.num}}</el-link>
              <span v-else>{{scope.row.num}}</span>
            </template>
      </el-table-column>
	  <el-table-column
        prop="num2"
        show-overflow-tooltip
        sortable="custom"
        label="整数">
      </el-table-column>
	  <el-table-column
        prop="str"
        show-overflow-tooltip
        sortable="custom"
        label="字符串">
      </el-table-column>
	  <el-table-column
        prop="email"
        show-overflow-tooltip
        sortable="custom"
        label="邮件">
      </el-table-column>
	  <el-table-column
        prop="url"
        show-overflow-tooltip
        sortable="custom"
        label="网址">
      </el-table-column>
	  <el-table-column
        prop="newDate"
        show-overflow-tooltip
        sortable="custom"
        label="日期">
      </el-table-column>
	  <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
	  <el-table-column
        prop="c1"
        show-overflow-tooltip
        sortable="custom"
        label="浮点数小于等于0">
      </el-table-column>
	  <el-table-column
        prop="c2"
        show-overflow-tooltip
        sortable="custom"
        label="身份证号码">
      </el-table-column>
	  <el-table-column
        prop="c3"
        show-overflow-tooltip
        sortable="custom"
        label="QQ号码">
      </el-table-column>
	  <el-table-column
        prop="c4"
        show-overflow-tooltip
        sortable="custom"
        label="手机号码">
      </el-table-column>
	  <el-table-column
        prop="c5"
        show-overflow-tooltip
        sortable="custom"
        label="中英文数字下划线">
      </el-table-column>
	  <el-table-column
        prop="c6"
        show-overflow-tooltip
        sortable="custom"
        label="合法字符(a-z A-Z 0-9)">
      </el-table-column>
	  <el-table-column
        prop="en"
        show-overflow-tooltip
        sortable="custom"
        label="英语">
      </el-table-column>
	  <el-table-column
        prop="zn"
        show-overflow-tooltip
        sortable="custom"
        label="汉子">
      </el-table-column>
	  <el-table-column
        prop="enzn"
        show-overflow-tooltip
        sortable="custom"
        label="汉英字符">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:validation:testValidation:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:validation:testValidation:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:validation:testValidation:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <TestValidationForm  ref="testValidationForm" @refreshDataList="refreshList"></TestValidationForm>
  </div>
</template>

<script>
  import TestValidationForm from './TestValidationForm'
  export default {
    data () {
      return {
        searchForm: {
          num: '',
          num2: ''
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
      TestValidationForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/validation/testValidation/list',
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
        this.$refs.testValidationForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.testValidationForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.testValidationForm.init('view', id)
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
            url: '/test/validation/testValidation/delete',
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
        this.$utils.download('/test/validation/testValidation/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/validation/testValidation/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>