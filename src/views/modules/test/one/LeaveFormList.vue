<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="office.id">
        		<SelectTree
                  ref="office.id"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'childNodes'    // 子级字段名
                    }"
                   size="small"
                  :url="`/sys/office/treeData?type=2`"
                  :value="searchForm.office.id"
                  :clearable="true"
                  :accordion="true"
                  @getValue="(value) => {searchForm.office.id=value}"/>
		     </el-form-item>
		     <el-form-item prop="tuser.id">
		        <user-select :limit='2' size="small" :value="searchForm.tuser.id" @getValue='(value) => {searchForm.tuser.id=value}'></user-select>
		     </el-form-item>
		     <el-form-item prop="area">
                  <CityPicker 
                     style="width:100%"
                    size="small"
                    :value="searchForm.area"
                    :clearable="true" 
                    :accordion="true"
                    @getValue="(value) => {searchForm.area=value}"/>
		     </el-form-item>
		     <el-form-item prop="beginDate">
        	     <el-date-picker
                    v-model="searchForm.beginDate"
                    type="daterange"
                    size="small"
                    align="right"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
		     </el-form-item>
		     <el-form-item prop="endDate">
                <el-date-picker
                  v-model="searchForm.endDate"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
		     </el-form-item>
		     <el-form-item prop="remarks">
                <el-input size="small" v-model="searchForm.remarks" placeholder="备注信息" clearable></el-input>
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
              :action="`${this.$http.BASE_URL}/test/one/leaveForm/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('test:one:leaveForm:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:one:leaveForm:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:one:leaveForm:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('test:one:leaveForm:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:one:leaveForm:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="office.name"
        show-overflow-tooltip
        sortable="custom"
        label="归属部门">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:one:leaveForm:edit')" @click="edit(scope.row.id)">{{scope.row.office.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:one:leaveForm:view')"  @click="view(scope.row.id)">{{scope.row.office.name}}</el-link>
              <span v-else>{{scope.row.office.name}}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="tuser.name"
        show-overflow-tooltip
        sortable="custom"
        label="员工">
      </el-table-column>
	  <el-table-column
        prop="area"
        show-overflow-tooltip
        sortable="custom"
        label="归属区域">
      </el-table-column>
	  <el-table-column
        prop="beginDate"
        show-overflow-tooltip
        sortable="custom"
        label="请假开始日期">
      </el-table-column>
	  <el-table-column
        prop="endDate"
        show-overflow-tooltip
        sortable="custom"
        label="请假结束日期">
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
          <el-button v-if="hasPermission('test:one:leaveForm:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:one:leaveForm:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:one:leaveForm:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <LeaveFormForm  ref="leaveFormForm" @refreshDataList="refreshList"></LeaveFormForm>
  </div>
</template>

<script>
  import LeaveFormForm from './LeaveFormForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import UserSelect from '@/components/userSelect'
  import CityPicker from '@/components/cityPicker'
  export default {
    data () {
      return {
        searchForm: {
          office: {
            id: ''
          },
          tuser: {
            id: ''
          },
          area: '',
          beginDate: '',
          endDate: '',
          remarks: ''
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
      SelectTree,
      UserSelect,
      CityPicker,
      LeaveFormForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/one/leaveForm/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginBeginDate: this.searchForm.beginDate[0],
            endBeginDate: this.searchForm.beginDate[1],
            ...this.lodash.omit(this.searchForm, 'beginDate')
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
        this.$refs.leaveFormForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.leaveFormForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.leaveFormForm.init('view', id)
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
            url: '/test/one/leaveForm/delete',
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
        this.$utils.download('/test/one/leaveForm/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/one/leaveForm/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>