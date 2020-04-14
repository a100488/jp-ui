<template>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item prop="searchDates" label="创建时间">
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
            prop="vars.title"
            show-overflow-tooltip
            label="实例标题">       
          </el-table-column>
          <el-table-column
            prop="procDef.name"
            show-overflow-tooltip
            label="流程名称">
          </el-table-column>
           <el-table-column
            prop="procIns.status"
            show-overflow-tooltip
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.procIns.code === 0 
               || scope.row.procIns.code === 3
               || scope.row.procIns.code === 4 
               || scope.row.procIns.code === 5" type="danger">{{scope.row.procIns.status}}</el-tag> 
                <span v-if="scope.row.procIns.deleteReason">原因: {{scope.row.procIns.deleteReason}}</span>
                <el-tag v-if="scope.row.procIns.code === 1" type="primary">{{scope.row.procIns.status}}  [{{scope.row.procIns.currentTask.name}}]</el-tag>
                <el-tag v-if="scope.row.procIns.code === 2" type="success">{{scope.row.procIns.status}}</el-tag>
             </template>
          </el-table-column>
           <el-table-column
            prop="vars.userName"
            show-overflow-tooltip
            label="流程发起人">
          </el-table-column>
          <el-table-column
            prop="procIns.startTime"
            show-overflow-tooltip
            label="创建时间">
             <template slot-scope="scope">
              {{scope.row.procIns.startTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            prop="procIns.endTime"
            show-overflow-tooltip
            label="完成时间">
             <template slot-scope="scope">
              {{scope.row.procIns.endTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="150"
            label="操作">
            <template slot-scope="scope">
               <el-button v-if="scope.row.procIns.code === 1" type="text"  size="small" @click="urge(scope.row)">催办</el-button>
               <el-button v-if="scope.row.status != 'todo'" type="text" size="small" @click="transferTask(scope.row)">改派</el-button>
               <el-button v-if="scope.row.procIns.code === 1" type="text"  size="small" @click="callback(scope.row)">撤销</el-button>
              <el-button  type="text" size="small" @click="detail(scope.row)">历史</el-button>
              <!-- <el-button  type="text" size="small"
                        @click="trace(scope.row)">进度
              </el-button> -->
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
        title="查看流程历史"
        :close-on-click-modal="true"
        :visible.sync="visible"
        height="600px">
       
          <iframe :src="processPhotoUrl" frameborder="0" scrolling="auto" width="100%" height="600px"></iframe>
        </el-dialog>
        <urge-form ref="urgeForm"></urge-form>
        <user-select ref="userSelect" :limit="2" @doSubmit="selectUsersToTransferTask"></user-select>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import UrgeForm from './UrgeForm'
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
        processPhotoUrl: '',
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
    components: {
      UserSelect,
      UrgeForm
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
          url: '/flowable/task/myApplyed',
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
      trace (row) {
        this.processPhotoUrl = `${this.$http.BASE_URL}/flowable/task/trace/photo/${row.procIns.processInstanceId}`
        this.visible = true
      },
      // 改派弹框
      transferTask (row) {
        this.currentTask = row.procIns.currentTask
        this.$refs.userSelect.init()
      },
      detail (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.procIns.processInstanceId,
          procDefId: row.procDef.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: row.vars.title, formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
          // 撤销申请
      callback (row) {
        this.$confirm(`确定要撤销该流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/flowable/process/deleteProcIns', {params: {'ids': row.procIns.processInstanceId, 'reason': '用户撤销'}}).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
          })
        })
      },
      urge (row) {
        this.$refs.urgeForm.init()
      },
      // 委托任务
      selectUsersToDelegateTask (user) {
        this.$http.post('/flowable/task/delegate', {taskId: this.currentTask.id, userId: user[0].id}).then(({data}) => {
          this.$message.success(data.msg)
          this.refreshList()
        })
      },
      // 转派任务
      selectUsersToTransferTask (user) {
        this.$http.post('/flowable/task/transfer', {taskId: this.currentTask.id, userId: user[0].id, reason: '转派'}).then(({data}) => {
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
