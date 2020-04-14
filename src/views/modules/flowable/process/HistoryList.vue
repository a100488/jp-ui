<template>
  <div>
      <el-row>
        <el-button  type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0">删除
        </el-button>
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
            prop="processVariables.title"
            label="实例名称">
          </el-table-column>
          <el-table-column
            prop="processDefinitionName"
            label="流程名称">
          </el-table-column>
           <el-table-column
            prop="processVariables.userName"
            label="流程发起人">
          </el-table-column>
          <el-table-column
            prop="startTime"
            show-overflow-tooltip
            label="流程启动时间">
             <template slot-scope="scope">
              {{scope.row.startTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            show-overflow-tooltip
            label="流程结束时间">
             <template slot-scope="scope">
              {{scope.row.endTime | formatDate}}
             </template>
          </el-table-column>
          <el-table-column
            prop="deleteReason"
            width="150"
            show-overflow-tooltip
            label="流程状态">
             <template slot-scope="scope">
               <el-tag v-if="scope.row.deleteReason === undefined" type="success">正常结束</el-tag>
               <el-tag v-else-if="scope.row.deleteReason === '用户撤销'" type="danger">用户撤销</el-tag>
               <div v-else><el-tag type="danger">流程作废 </el-tag> <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span></div>
             </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
            <el-button  type="text" size="small"
                        @click="trace(scope.row)">流程图
              </el-button>
              <el-button  type="text" size="small"
                        @click="detail(scope.row)">历史
              </el-button>
              <el-button  type="text" size="small"
                        @click="del(scope.row.id)">删除
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
        <el-dialog
        title="查看进度"
        :close-on-click-modal="true"
        :visible.sync="visible"
        width="70%"
        height="600px">
          <flow-chart ref="preview" :processInstanceId="processInstanceId"></flow-chart>
        </el-dialog>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  // import FlowChart from '../modeler/FlowChart'
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
        processInstanceId: ''
      }
    },
    activated () {
      this.refreshList()
    },
    components: {
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
          url: '/flowable/process/historyListData',
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
        this.processInstanceId = row.processInstanceId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.preview.init()
        })
      },
      detail (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.processInstanceId,
          procDefId: row.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: row.processVariables.title, formTitle: row.processVariables.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
          // 撤销申请
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定要删除历史流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http.delete('/flowable/process/history/deleteAllProcIns', {params: {'procInsIds': ids}}).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
            this.loading = false
          })
        })
      }
    }
  }
</script>
