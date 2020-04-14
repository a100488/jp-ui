<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="tuser.id">
		        <user-select :limit='2' size="small" :value="searchForm.tuser.id" @getValue='(value) => {searchForm.tuser.id=value}'></user-select>
		     </el-form-item>
          
		     <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="名称" clearable></el-input>
		     </el-form-item>
		     <el-form-item prop="sex">
                  <el-radio-group v-model="searchForm.sex">
                    <el-radio v-for="item in $dictUtils.getDictList('sex')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
                  </el-radio-group>
		     </el-form-item>
		     <el-form-item prop="inDate">
        	     <el-date-picker
                    v-model="searchForm.inDate"
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
              :action="`${this.$http.BASE_URL}/test/onetomany/testDataMainForm/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('test:onetomany:testDataMainForm:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:onetomany:testDataMainForm:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:onetomany:testDataMainForm:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <el-button v-if="hasPermission('test:onetomany:testDataMainForm:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:onetomany:testDataMainForm:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      size="medium"
      @expand-change="detail"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column type="expand">
      <template slot-scope="scope">
      <el-tabs>
            <el-tab-pane label="火车票">
                  <el-table
                  border
                  size="medium"
                  :data="scope.row.testDataChild21List"
                  style="width: 100%">
                  <el-table-column
                    prop="startArea.name"
                    label="出发地">
                  </el-table-column>
                  <el-table-column
                    prop="endArea.name"
                    label="目的地">
                  </el-table-column>
                <el-table-column
                    prop="starttime"
                    show-overflow-tooltip
                    label="出发时间">
                  </el-table-column>
                <el-table-column
                    prop="endtime"
                    show-overflow-tooltip
                    label="到达时间">
                  </el-table-column>
                <el-table-column
                    prop="price"
                    show-overflow-tooltip
                    label="代理价格">
                  </el-table-column>
                <el-table-column
                    prop="remarks"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="飞机票">
                  <el-table
                  border
                  size="medium"
                  :data="scope.row.testDataChild22List"
                  style="width: 100%">
                  <el-table-column
                    prop="startArea.name"
                    label="出发地">
                  </el-table-column>
                  <el-table-column
                    prop="endArea.name"
                    label="目的地">
                  </el-table-column>
                <el-table-column
                    prop="startTime"
                    show-overflow-tooltip
                    label="出发时间">
                  </el-table-column>
                <el-table-column
                    prop="endTime"
                    show-overflow-tooltip
                    label="到达时间">
                  </el-table-column>
                <el-table-column
                    prop="price"
                    show-overflow-tooltip
                    label="代理价格">
                  </el-table-column>
                <el-table-column
                    prop="remarks"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="汽车票">
                  <el-table
                  border
                  size="medium"
                  :data="scope.row.testDataChild23List"
                  style="width: 100%">
                  <el-table-column
                    prop="startArea.name"
                    label="出发地">
                  </el-table-column>
                  <el-table-column
                    prop="endArea.name"
                    label="目的地">
                  </el-table-column>
                <el-table-column
                    prop="startTime"
                    show-overflow-tooltip
                    label="出发时间">
                  </el-table-column>
                <el-table-column
                    prop="endTime"
                    show-overflow-tooltip
                    label="到达时间">
                  </el-table-column>
                <el-table-column
                    prop="price"
                    show-overflow-tooltip
                    label="代理价格">
                  </el-table-column>
                <el-table-column
                    prop="remarks"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </template>
      </el-table-column>
      <el-table-column
        prop="tuser.name"
        show-overflow-tooltip
        sortable="custom"
        label="用户">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:onetomany:testDataMainForm:edit')" @click="edit(scope.row.id)">{{scope.row.tuser.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:onetomany:testDataMainForm:view')"  @click="view(scope.row.id)">{{scope.row.tuser.name}}</el-link>
              <span v-else>{{scope.row.tuser.name}}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="office.name"
        show-overflow-tooltip
        sortable="custom"
        label="所属部门">
      </el-table-column>
      <el-table-column
        prop="area.name"
        show-overflow-tooltip
        sortable="custom"
        label="所属区域">
      </el-table-column>
	  <el-table-column
        prop="name"
        show-overflow-tooltip
        sortable="custom"
        label="名称">
      </el-table-column>
	  <el-table-column
        prop="sex"
        show-overflow-tooltip
        sortable="custom"
        label="性别">
        <template slot-scope="scope">
             {{ $dictUtils.getDictLabel("sex", scope.row.sex, '-') }}
        </template>
      </el-table-column>
	  <el-table-column
        prop="file"
        show-overflow-tooltip
        sortable="custom"
        label="身份证照片">
        <template slot-scope="scope" v-if="scope.row.file">
          <el-image
            style="height: 50px;width:50px;margin-right:10px;"
            :src="src" v-for="(src, index) in scope.row.file.split('|')" :key="index"
            :preview-src-list="scope.row.file.split('|')">
          </el-image>
        </template>
      </el-table-column>
	  <el-table-column
        prop="inDate"
        show-overflow-tooltip
        sortable="custom"
        label="加入日期">
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
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:onetomany:testDataMainForm:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:onetomany:testDataMainForm:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:onetomany:testDataMainForm:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <!-- <resource-select :limit='2' size="small" :value="searchForm.tableDta" @getValue='(value) => {searchForm.tableDta=value}'></resource-select> -->
        <!-- 弹窗, 新增 / 修改 -->
    <TestDataMainFormForm  ref="testDataMainFormForm" @refreshDataList="refreshList"></TestDataMainFormForm>
  </div>
</template>

<script>
  import TestDataMainFormForm from './TestDataMainFormForm'
  import UserSelect from '@/components/userSelect'
  import ResourceSelect from '@/components/resourceSelect'
  export default {
    data () {
      return {
        searchForm: {
          tableDta: [],
          tuser: {
            id: ''
          },
          name: '',
          sex: '',
          inDate: ''
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
      UserSelect,
      TestDataMainFormForm,
      ResourceSelect
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/onetomany/testDataMainForm/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginInDate: this.searchForm.inDate[0],
            endInDate: this.searchForm.inDate[1],
            ...this.lodash.omit(this.searchForm, 'inDate')
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
        this.$refs.testDataMainFormForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.testDataMainFormForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.testDataMainFormForm.init('view', id)
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
            url: '/test/onetomany/testDataMainForm/delete',
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
     // 查看详情
      detail (row) {
        this.$http.get(`/test/onetomany/testDataMainForm/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.testDataChild21List = data.testDataMainForm.testDataChild21List
              item.testDataChild22List = data.testDataMainForm.testDataChild22List
              item.testDataChild23List = data.testDataMainForm.testDataChild23List
            }
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
        this.$utils.download('/test/onetomany/testDataMainForm/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>