<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="processDefId">
                <el-input size="small" v-model="searchForm.processDefId" placeholder="流程定义id" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="taskDefId">
                <el-input size="small" v-model="searchForm.taskDefId" placeholder="节点id" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="formReadOnly">
                  <el-checkbox-group
                    v-model="searchForm.formReadOnly">
                    <el-checkbox v-for="formReadOnly in $dictUtils.getDictList('')" :label="formReadOnly.label" :key="formReadOnly.id">{{formReadOnly.value}}</el-checkbox>
                  </el-checkbox-group>
		     </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button  type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/extension/formSetting/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('extension:formSetting:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('extension:formSetting:edit')" type="success" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1">修改</el-button>
        <el-button v-if="hasPermission('extension:formSetting:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0">删除
        </el-button>
        <el-button v-if="hasPermission('extension:formSetting:import')" type="default" size="small" icon="el-icon-upload2" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false">导入</el-button>
        <el-button v-if="hasPermission('extension:formSetting:export')" type="default" size="small" icon="el-icon-download" @click="exportExcel()">导出</el-button>
        <el-button
          type="default"
          size="small"
          :icon="`el-icon-arrow-${!isSearchCollapse ? 'down' : 'up'}`"
          @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
          {{ !isSearchCollapse ? '展开' : '折叠' }}搜索
        </el-button>
      </el-row>
    <el-table
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
	  <el-table-column
        prop="processDefId"
        header-align="center"
        align="center"
        sortable="custom"
        label="流程定义id">
      </el-table-column>
	  <el-table-column
        prop="taskDefId"
        header-align="center"
        align="center"
        sortable="custom"
        label="节点id">
      </el-table-column>
	  <el-table-column
        prop="formReadOnly"
        header-align="center"
        align="center"
        sortable="custom"
        label="只读设置">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="400"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('extension:formSetting:view')" type="text" icon="el-icon-view" size="mini" @click="view(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="hasPermission('extension:formSetting:edit')" type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">
            修改
          </el-button>
          <el-button v-if="hasPermission('extension:formSetting:del')" type="text" size="mini" icon="el-icon-delete"  @click="del(scope.row.id)">
            删除
          </el-button>
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
    <FormSettingForm  ref="formSettingForm" @refreshDataList="refreshList"></FormSettingForm>
  </div>
</template>

<script>
  import FormSettingForm from './FormSettingForm'
  export default {
    data () {
      return {
        searchForm: {
          processDefId: '',
          taskDefId: '',
          formReadOnly: ''
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
      FormSettingForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/extension/formSetting/list',
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
        this.$refs.formSettingForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.formSettingForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.formSettingForm.init('view', id)
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
            url: '/extension/formSetting/delete',
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
        this.$utils.download('/extension/formSetting/import/template')
      },
      exportExcel () {
        this.$utils.download('/extension/formSetting/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>