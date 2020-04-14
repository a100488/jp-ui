<template>
<div style="min-width: 720px;max-width: 1000px;margin: auto;">
  <h4 style="text-align:center;font-size: 20px">{{title}}</h4>
  <el-tabs type="border-card" style="margin-bottom:60px" v-model="taskSelectedTab" @tab-click="handleTabClick">
    <el-tab-pane label="表单信息" name="form-first">
      <component :formReadOnly="formReadOnly" v-if="formType === '2'" :class="formReadOnly?'readonly':''"  ref="form" :businessId="businessId" :is="form"></component>
      
      <PreviewForm   v-if="formType !== '2'"  :processDefinitionId="procDefId" :edit="true" :taskFormData="taskFormData" ref="form"/>
    </el-tab-pane>
    <el-tab-pane label="流程信息" v-if="procInsId"  name="form-second">
       <el-card class="box-card"  shadow="hover">
          <div slot="header" class="clearfix">
            <span>流程信息</span>
          </div>
          <el-timeline :reverse="true" v-if="histoicFlowList.length">
              <el-timeline-item color="#3f9eff" :key="index" v-for="(act, index) in histoicFlowList"  :timestamp="moment(act.histIns.endTime).format('YYYY-MM-DD')" placement="top">
                <el-card>
                  <h4>{{act.histIns.activityName}}</h4>
                  <p>{{act.assigneeName}} : {{act.comment}}</p>
                  <p>开始时间 : {{moment(act.histIns.startTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
                  <p>结束时间 : {{moment(act.histIns.endTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
                  <p>用时 : {{act.durationTime || '0秒'}}</p>
                </el-card>
              </el-timeline-item>
          </el-timeline>
        </el-card>
    </el-tab-pane>
    <el-tab-pane label="流程图" style=""  name="form-third">
       <el-card class="box-card"  shadow="hover">
          <div slot="header" class="clearfix">
            <span>流程图</span>
          </div>
          <flow-chart ref="chart1" v-if="procInsId" :processInstanceId="procInsId" />
          <flow-chart ref="chart2" v-if="!procInsId" :processDefId="procDefId" />
        </el-card>
    </el-tab-pane>
    <el-tab-pane label="流转记录" v-if="procInsId" name="form-forth">
          <el-card class="box-card"  shadow="hover" style="margin-top:5px">
      <div slot="header" class="clearfix">
        <span>流转记录</span>
      </div>
      <el-steps :active="histoicFlowList.length">
        <el-step :key="index" v-for="(act, index) in histoicFlowList" :title="act.histIns.activityName" finish-status="success"  :description="(act.assigneeName||'') +'    '   + moment(act.histIns.endTime).format('YYYY-MM-DD HH:mm:ss')"></el-step>
      </el-steps>
      <el-table
       border
      :data="histoicFlowList"
      style="width: 100%">
      <el-table-column
        prop="histIns.activityName"
        label="执行环节"
        width="180">
      </el-table-column>
      <el-table-column
        prop="assigneeName"
        label="执行人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="histIns.startTime"
        label="开始时间">
        <template slot-scope="scope">
          {{scope.row.histIns.startTime | formatDate}}
        </template>
      </el-table-column>
       <el-table-column
        prop="histIns.endTime"
        label="结束时间">
        <template slot-scope="scope">
          {{scope.row.histIns.endTime | formatDate}}
        </template>
      </el-table-column>
       <el-table-column
        prop="comment"
        label="审批意见">
      </el-table-column>
       <el-table-column
        prop="durationTime"
        label="任务历时">
        <template slot-scope="scope">
          {{scope.row.durationTime || '0秒'}}
        </template>
      </el-table-column>
    </el-table>
    </el-card>
     </el-tab-pane>
  </el-tabs>
  <el-card class="el-card1" style="margin-top:10px;width: 1000px;" v-if="(!procInsId || taskId) && card1Visible">
      <el-form :model="auditForm"   ref="auditForm" label-width="120px">
        <el-col :span="16">
          <el-form-item  v-if="false"  label="流程标题" prop="title">
            <el-input
              placeholder="请输入流程标题"
              v-model="title">
            </el-input>
        </el-form-item>
        <el-form-item  v-if="taskId"  label="审批信息" prop="comment">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入审批意见"
              v-model="auditForm.comment">
            </el-input>
        </el-form-item>
        </el-col>
        <!-- <el-col :span="16">
          <el-form-item>
            <el-checkbox v-model="isCC">是否抄送</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item v-if="isCC"  :rules="[
                  {required: true, message: '用户不能为空', trigger: 'blur'}
                ]"  prop="userIds" label="抄送给">
                <user-select :value="auditForm.userIds"  @getValue='(value) => {auditForm.userIds=value}'>></user-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="16">
          <el-form-item>
            <el-checkbox v-model="isAssign">指定下一步处理者(不设置就使用默认处理人)</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item v-if="isAssign"  :rules="[
                  {required: true, message: '用户不能为空', trigger: 'blur'}
                ]"  prop="assign" label="指定">
                <user-select :limit="2" :value="auditForm.assign"  @getValue='(value) => {auditForm.assign=value}'>></user-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="16">
          <el-form-item>
              <el-button type="primary" v-show="button.isHide === '0'" v-for="(button, index) in buttons" :key="index" @click="submit(button, buttons)"  v-noMoreClick>{{button.name}}</el-button>
          </el-form-item>
        </el-col>
    </el-form>
  </el-card>
</div>
</template>

<script>
  // import FlowChart from '../modeler/FlowChart'
  import UserSelect from '@/components/userSelect'
  import PreviewForm from './form/WaGenerateFlowableForm'
  import ResourceSelect from '@/components/resourceSelect'
  const _import = require('@/router/import-' + process.env.NODE_ENV)
  export default {
    activated () {
      this.init()
      if (this.formType === '2') {
        if (this.formUrl === '/404') {
          this.form = null
          this.$message.info('没有关联流程表单!')
        } else {
          this.form = _import(`modules${this.formUrl}`)
        }
      } else {
        // 读取流程表单
        if (this.formUrl === '/404') {
          this.$refs.form.createForm('')
        } else {
          this.$refs.form.createForm(this.formUrl)
        }
        if (this.status === 'start') {
          // 读取启动表单配置
          this.$http.get('/wa/flowable/form/getStartFormData',
              {params: {processDefinitionId: this.procDefId}}
              ).then(({data}) => {
                this.taskFormData = data.data.startFormData
              })
        } else {
          // 读取任务表单配置
          this.$http.get('/flowable/form/getTaskFormData',
              {params: {taskId: this.taskId}}
              ).then(({data}) => {
                this.taskFormData = data.taskFormData
              })
        }
      }
       // 读取按钮配置
      if (this.status === 'start') {
        this.buttons = [{id: 'start', name: '创建', isHide: '0'}]
      } else if (this.procDefKey && this.taskDefKey) {
        // 读取按钮
        this.$http.get('/extension/taskDefExtension/queryByDefIdAndTaskId', {params: {
          processDefId: this.procDefKey,
          taskDefId: this.taskDefKey
        }}).then(({data}) => {
          if (data.success) {
            this.buttons = data.taskDefExtension.flowButtonList
          }
        })
      }
    // 读取历史任务列表
      this.$http.get(`/flowable/task/histoicFlowList?procInsId=${this.procInsId}`).then(({data}) => {
        this.histoicFlowList = data.histoicFlowList
      })
    },
    components: {
      UserSelect,
      ResourceSelect,
      PreviewForm
      // FlowChart
    },
    watch: {
      isAssign (val) {
        if (!val) {
          this.assign = null
        }
      },
      taskSelectedTab (val) {
        if (val === 'form-third') {
          this.card1Visible = false
          if (this.procInsId) {
            this.$refs.chart1.init()
          } else {
            this.$refs.chart2.init()
          }
        } else {
          this.card1Visible = true
        }
      }
    },
    methods: {
      init () {
        // this.procInsI = false
        this.card1Visible = true
        this.taskSelectedTab = 'form-first'
        this.procDefId = this.$route.query.procDefId
        this.procDefKey = this.$route.query.procDefKey
        this.formType = this.$route.query.formType
        this.formUrl = this.$route.query.formUrl
        this.taskId = this.$route.query.taskId
        this.taskDefKey = this.$route.query.taskDefKey
        this.status = this.$route.query.status
        this.title = this.$route.query.formTitle
        this.businessId = this.$route.query.businessId
        this.procInsId = this.$route.query.procInsId
        this.formReadOnly = this.$route.query.formReadOnly !== undefined && this.$route.query.formReadOnly !== 'false' && this.$route.query.formReadOnly !== false
        this.isCC = false
        this.isAssign = false
        this.auditForm.assign = null
        this.auditForm.userIds = null
        this.auditForm.comment = ''
      },
      cc (data) {
        if (this.isCC && this.auditForm.userIds) {
          this.$refs['auditForm'].validate((valid) => {
            if (valid) {
              this.$http.post('/extension/flowCopy/save', {
                userIds: this.auditForm.userIds,
                procDefId: this.procDefId,
                procInsId: data.procInsId,
                procDefName: '',
                procInsName: this.title,
                taskName: ''
              })
            }
          })
        }
      },
      handleTabClick (tab, event) {
        if (tab.name === 'form-third') {
          this.card1Visible = false
        }
      },
      submit (currentBtn, buttons) {
        let vars = {}
        buttons.forEach((btn) => {
          vars[btn.code] = false
        })
        vars[currentBtn.code] = true
        vars.title = this.title
        vars.assign = this.auditForm.assign
        if (currentBtn.id === 'start') {
          if (this.formType === '2') {
            this.$refs.form.saveForm((businessTable, businessId) => {
              this.$http.post('/flowable/task/start', {
                procDefKey: this.procDefKey,
                businessTable: businessTable,
                businessId: businessId,
                ...vars,
                title: this.title,
                assign: this.auditForm.assign
              }).then(({data}) => {
                if (data.success) {
                  this.$message.success(data.msg)
                  this.$events.$emit('closeTab', this.$route.fullPath)
                  // this.$router.push('/flowable/task/TodoList')
                  this.cc(data)
                }
              })
            })
          } else {
            console.log(this.$refs.form)
            this.$refs.form.submitStartFormData(vars, (data) => {
              if (data.success) {
                this.$events.$emit('closeTab', this.$route.fullPath)
                this.$router.push('/maintenanceManage/order') // 创单成功，跳转运维工单
                this.cc(data)
              }
            })
          }
        } else {
          if (this.formType === '2') {
            this.$refs.form.saveForm((businessTable, businessId) => {
              this.$http.post('/flowable/task/audit', {
                taskId: this.taskId,
                taskDefKey: this.taskDefKey,
                procInsId: this.procInsId,
                procDefId: this.procDefId,
                vars: vars,
                comment: this.auditForm.comment,
                assign: this.auditForm.assign
              }).then(({data}) => {
                if (data.success) {
                  this.$message.success(data.msg)
                  this.$events.$emit('closeTab', this.$route.fullPath)
                  this.$router.push('/flowable/task/TodoList')
                  this.cc(data)
                }
              })
            })
          } else {
            this.$refs.form.submitTaskFormData(vars, this.taskId, (data) => {
              if (data.success) {
                this.$events.$emit('closeTab', this.$route.fullPath)
                this.$router.push('/maintenanceManage/order')
                this.cc(data)
              }
            })
          }
        }
      }
    },
    data () {
      return {
        form: null,
        formType: '',
        formUrl: '',
        taskSelectedTab: 'frist',
        histoicFlowList: [],
        procDefId: '',
        procInsId: '',
        card1Visible: true,
        formReadOnly: false,
        procDefKey: '',
        taskId: '',
        taskFormData: [],
        taskDefKey: '',
        status: '',
        title: '',
        businessId: '',
        buttons: [],
        isCC: false,
        isAssign: false,
        auditForm: {
          comment: '',
          userIds: null,
          assign: null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
 
  .el-card1 {
    bottom: 20px;
    position: fixed;
    z-index: 10;
    width: 84.5%;
  }
</style>