<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item label="创建时间" prop="searchDates">
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
        <el-form-item label="标题" prop="searchTitle">
            <el-input v-model="searchForm.title" size="small" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="流程名称" prop="searchProcDefName">
            <el-input v-model="searchForm.procDefKey" size="small" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item label="当前环节" prop="searchTaskName">
            <el-input v-model="searchForm.taskName" size="small" placeholder="请输入当前环节"></el-input>
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
            prop="vars.title"
            label="实例标题">
                <template slot-scope="scope">
                  <el-link  type="primary" :underline="false" v-if="scope.row.status === 'todo'"  @click="todo(scope.row)">{{scope.row.vars.title}}</el-link>
                  <span v-else>{{scope.row.vars.title}}</span>
                </template>
          </el-table-column>
          <el-table-column
            prop="procDef.name"
            label="流程名称">
          </el-table-column>
           <el-table-column
            prop="task.name"
            label="当前环节">
              <template slot-scope="scope">
                <el-tag>{{scope.row.task.name}}</el-tag>
             </template>
          </el-table-column>
           <el-table-column
            prop="vars.userName"
            label="流程发起人">
          </el-table-column>
          <el-table-column
            prop="task.createTime"
            show-overflow-tooltip
            label="创建时间">
             <template slot-scope="scope">
              {{scope.row.task.createTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 'claim'" type="text" size="small" @click="claim(scope.row)">签收任务</el-button>
              <el-button v-if="scope.row.status === 'todo'" type="text" size="small" @click="todo(scope.row)">办理</el-button>
              <el-button v-if="scope.row.status === 'todo'" type="text" size="small" @click="transferTask(scope.row)">委派</el-button>
              <el-button v-if="scope.row.claimTime" type="text" size="small" @click="unclaim(scope.row)">取消签收</el-button>
              <el-button  type="text" size="small" @click="trace(scope.row)">进度</el-button>
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
      <el-dialog
      title="查看进度"
      :close-on-click-modal="true"
      :visible.sync="visible"
      width="70%"
      height="600px">
      
        <flow-chart ref="preview" :processInstanceId="processInstanceId"></flow-chart>
      </el-dialog>
        <user-select ref="userSelect" :limit="2" @doSubmit="selectUsersToTransferTask"></user-select>
        
  </div>
</template>

<script>
  // import FlowChart from '../modeler/FlowChart'
  import pick from 'lodash.pick'
  import UserSelect from '@/components/userSelect/UserSelectDialog'
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
        currentTask: null,
        dataListSelections: [],
        processInstanceId: '',
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
    components: {
      UserSelect
      // FlowChart
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
          url: '/flowable/task/todo',
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
      claim (row) {
        this.$http.post('/flowable/task/claim', {taskId: row.task.id}).then(({data}) => {
          if (data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
        })
      },
      unclaim (row) {
        this.$http.post('/flowable/task/unclaim', {taskId: row.task.id}).then(({data}) => {
          if (data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
        })
      },
      todo (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskId: row.task.id,
          taskName: row.task.name,
          taskDefKey: row.task.taskDefinitionKey,
          procInsId: row.task.processInstanceId,
          procDefId: row.task.processDefinitionId,
          status: row.status
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {formTitle: `${row.vars.title}`, title: `审批【${row.task.name || ''}】`, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      trace (row) {
        this.processInstanceId = row.task.processInstanceId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.preview.init()
        })
      },
      transferTask (row) {
        this.currentTask = row.task
        this.$refs.userSelect.init()
      },
      selectUsersToTransferTask (user) {
        this.$http.post('/flowable/task/delegate', {taskId: this.currentTask.id, userId: user[0].id}).then(({data}) => {
          this.$message.success(data.msg)
          this.refreshList()
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
