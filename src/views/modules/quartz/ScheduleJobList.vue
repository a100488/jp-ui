<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="任务名" clearable></el-input>
		     </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('quartz:scheduleJob:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('quartz:scheduleJob:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('quartz:scheduleJob:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button v-if="hasPermission('quartz:scheduleJob:startNow')" type="success" size="small" icon="el-icon-edit-outline" @click="startNow()"
         :disabled="dataListSelections.length != 1" plain>立即执行一次</el-button>
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
        prop="name"
        sortable="custom"
        show-overflow-tooltip
        label="任务名">
         <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('quartz:scheduleJob:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
	  <el-table-column
        prop="group"
        show-overflow-tooltip
        label="任务组">
        <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("schedule_task_group", scope.row.group, '-') }}
        </template>
      </el-table-column>
	  <el-table-column
        prop="cronExpression"
        sortable="custom"
        show-overflow-tooltip
        label="定时规则">
      </el-table-column>
	  <el-table-column
        prop="status"
        sortable="custom"
        show-overflow-tooltip
        label="启用状态">
        <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("yes_no", scope.row.status, '-') }}
        </template>
      </el-table-column>
	  <el-table-column
        prop="isInfo"
        sortable="custom"
        show-overflow-tooltip
        label="通知用户">
        <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("schedule_task_info", scope.row.isInfo, '-') }}
        </template>
      </el-table-column>
	  <el-table-column
        prop="className"
        sortable="custom"
        show-overflow-tooltip
        label="任务类">
      </el-table-column>
	  <el-table-column
        prop="description"
        sortable="custom"
        show-overflow-tooltip
        label="描述">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('quartz:scheduleJob:resume')" type="text" icon="el-icon-video-play" size="small" @click="start(scope.row.id)">启动</el-button>
          <el-button v-if="hasPermission('quartz:scheduleJob:stop')" type="text" icon="el-icon-video-pause" size="small" @click="stop(scope.row.id)">暂停</el-button>
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
    <ScheduleJobForm  ref="scheduleJobForm" @refreshDataList="refreshList"></ScheduleJobForm>
  </div>
</template>

<script>
  import ScheduleJobForm from './ScheduleJobForm'
  export default {
    data () {
      return {
        searchForm: {
          name: ''
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
      ScheduleJobForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/quartz/scheduleJob/list',
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
        this.$refs.scheduleJobForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.scheduleJobForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.scheduleJobForm.init('view', id)
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
            url: '/quartz/scheduleJob/delete',
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
       // 启动
      start (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$confirm(`确定要启动任务吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post(`/quartz/scheduleJob/resume?id=${id}`).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
             // 暂停
      stop (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$confirm(`确定要暂停任务吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post(`/quartz/scheduleJob/stop?id=${id}`).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
             // 立即执行一次
      startNow (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$confirm(`确定要立即执行一次该任务吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post(`/quartz/scheduleJob/startNow?id=${id}`).then(({data}) => {
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