<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item label="完成时间" prop="searchDates">
          <el-date-picker
            v-model="searchDates"
            type="daterange"
            size="small"
            align="right"
            value-format="yyyy-MM-dd hh:mm:ss"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
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
          size = "medium"
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
            prop="task.name"
            show-overflow-tooltip=""
            label="任务">
            <template slot-scope="scope">
              {{scope.row.task.name}} 
                 <el-button v-if="scope.row.isBack" type="warning" size="mini"
                        @click="callback(scope.row)">撤销
                </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="vars.title"
            show-overflow-tooltip
            label="实例标题">
          </el-table-column>
          <el-table-column
            prop="proc.name"
            label="流程名称">
          </el-table-column>
          <el-table-column
            prop="status"
            show-overflow-tooltip
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.code === 0 
               || scope.row.code === 3
               || scope.row.code === 4 
               || scope.row.code === 5"  type="danger">{{scope.row.status}}</el-tag>  <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span>
              <el-tag v-if="scope.row.code === 1" type="primary">{{scope.row.status}}</el-tag>
              <el-tag v-if="scope.row.code === 2" type="success">{{scope.row.status}}</el-tag>
             </template>
          </el-table-column>
           <el-table-column
            prop="vars.userName"
            label="流程发起人">
          </el-table-column>
          <el-table-column
            prop="task.endTime"
            show-overflow-tooltip
            label="完成时间">
             <template slot-scope="scope">
              {{scope.row.task.endTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button  type="text" size="small"
                        @click="detail(scope.row)">历史
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
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  export default {
    data () {
      return {
        searchForm: {
          beginDate: '',
          endDate: ''
        },
        searchDates: '',
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        isSearchCollapse: false,
        loading: false,
        visible: false,
        dataListSelections: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
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
      }
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/flowable/task/historic/',
          method: 'get',
          params: {
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
      detail (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: row.task.taskDefinitionKey,
          procInsId: row.proc.processInstanceId,
          procDefId: row.proc.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, taskId: row.task.executionId, title: `${row.proc.name}【${row.task.name}】`, formTitle: `${row.proc.name}`, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
          // 取回
      callback (row) {
        this.$confirm(`确定取回流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.post('/flowable/task/callback',
            {'processInstanceId': row.proc.processInstanceId,
              'preTaskDefKey': row.task.taskDefinitionKey,
              'preTaskId': row.task.id,
              'currentTaskId': row.currentTask.id,
              'currentTaskDefKey': row.currentTask.taskDefinitionKey
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
        this.searchDates = ''
        this.$refs.searchForm.resetFields()
        this.$nextTick(() => {
          this.refreshList()
        })
      }
    }
  }
</script>
