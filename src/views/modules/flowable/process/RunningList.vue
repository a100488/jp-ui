<template>
  <div>
      <el-row>
        <el-button  type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0">作废
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
            prop="vars.title"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="processDefinitionName"
            label="流程名称">
          </el-table-column>
           <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.code === 0 
               || scope.row.code === 3
               || scope.row.code === 4 
               || scope.row.code === 5" type="danger">{{scope.row.status}}</el-tag>  <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span>
              <el-tag v-if="scope.row.code === 1" type="primary">{{scope.row.status}}  [{{scope.row.currentTask.name}}]</el-tag>
              <el-tag v-if="scope.row.code === 2" type="success">{{scope.row.status}}</el-tag>
             </template>
          </el-table-column>
           <el-table-column
            prop="vars.userName"
            label="流程发起人">
          </el-table-column>        
         <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button  type="text" size="small"
                        @click="detail(scope.row)">详情
              </el-button>
              <el-button  type="text" size="small"
                        @click="trace(scope.row)">进度
              </el-button>
              <el-button  type="text" size="small"
                        @click="del(scope.row.id)">作废
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
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
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
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/flowable/process/runningData',
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
          taskDefKey: row.activityId,
          procInsId: row.processInstanceId,
          procDefId: row.processDefinitionId
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
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$prompt('作废原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.loading = true
          this.$http.delete('/flowable/process/deleteProcIns', {params: {
            ids: ids,
            reason: value}}).then(({data}) => {
              this.refreshList()
              this.$message.success('作废成功')
            })
          this.loading = false
        })
      }
    }
  }
</script>
