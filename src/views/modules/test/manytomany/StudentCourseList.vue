<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="student.id">
        		<GridSelect
                    title="选择学生"
                    labelName = 'name'
                    labelValue = 'id'
                    :value = "searchForm.student.id"
                    :limit="1"
                    size="small"
                    @getValue='(value) => {searchForm.student.id=value}'
                    :columns="[
                    {
                      prop: 'name',
                      label: '姓名'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'name',
                      label: '姓名'
                    }
                    ]"
                    dataListUrl="/test/manytomany/student/list"
                    entityBeanName="student"
                    queryEntityUrl="/test/manytomany/student/queryById">
                  </GridSelect>
		     </el-form-item>
		     <el-form-item prop="course.id">
        		<GridSelect
                    title="选择课程"
                    labelName = 'name'
                    labelValue = 'id'
                    :value = "searchForm.course.id"
                    :limit="1"
                    size="small"
                    @getValue='(value) => {searchForm.course.id=value}'
                    :columns="[
                    {
                      prop: 'name',
                      label: '课程名'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'name',
                      label: '课程名'
                    }
                    ]"
                    dataListUrl="/test/manytomany/course/list"
                    entityBeanName="course"
                    queryEntityUrl="/test/manytomany/course/queryById">
                  </GridSelect>
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
              :action="`${this.$http.BASE_URL}/test/manytomany/studentCourse/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('test:manytomany:studentCourse:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:manytomany:studentCourse:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:manytomany:studentCourse:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('test:manytomany:studentCourse:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:manytomany:studentCourse:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="student.name"
        show-overflow-tooltip
        sortable="custom"
        label="学生">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:manytomany:studentCourse:edit')" @click="edit(scope.row.id)">{{scope.row.student.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:manytomany:studentCourse:view')"  @click="view(scope.row.id)">{{scope.row.student.name}}</el-link>
              <span v-else>{{scope.row.student.name}}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="course.name"
        show-overflow-tooltip
        sortable="custom"
        label="课程">
      </el-table-column>
	  <el-table-column
        prop="score"
        show-overflow-tooltip
        sortable="custom"
        label="分数">
      </el-table-column>
	  <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:manytomany:studentCourse:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:manytomany:studentCourse:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:manytomany:studentCourse:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <StudentCourseForm  ref="studentCourseForm" @refreshDataList="refreshList"></StudentCourseForm>
  </div>
</template>

<script>
  import StudentCourseForm from './StudentCourseForm'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        searchForm: {
          student: {
            id: ''
          },
          course: {
            id: ''
          }
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
      GridSelect,
      StudentCourseForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/manytomany/studentCourse/list',
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
        this.$refs.studentCourseForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.studentCourseForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.studentCourseForm.init('view', id)
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
            url: '/test/manytomany/studentCourse/delete',
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
        this.$utils.download('/test/manytomany/studentCourse/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/manytomany/studentCourse/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>