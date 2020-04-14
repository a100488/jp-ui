<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''" :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="16">
            <el-form-item label="流程定义id" prop="processDefId"
                :rules="[
                 ]">
			        <el-input v-model="inputForm.processDefId" placeholder="请填写流程定义id"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="任务定义id" prop="taskDefId"
                :rules="[
                 ]">
			        <el-input v-model="inputForm.taskDefId" placeholder="请填写任务定义id"     ></el-input>
	         </el-form-item>
        </el-col>
		<el-col :span="24">
		 <el-form-item label-width="0">
            <el-tabs v-model="taskDefExtensionTab">
            <el-tab-pane label="按钮设置">
                  <el-button size="small" @click="addFlowButtonRow" type="primary">新增</el-button>
                  <el-table
                  border
                  :data="inputForm.flowButtonList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
            	  <el-table-column
                    prop="name"
                    header-align="center"
                    align="center"
                    label="按钮名称">
                  </el-table-column>
            	  <el-table-column
                    prop="code"
                    header-align="center"
                    align="center"
                    label="编码">
                  </el-table-column>
            	  <el-table-column
                    prop="isHide"
                    header-align="center"
                    align="center"
                    label="是否隐藏">
                  </el-table-column>
            	  <el-table-column
                    prop="next"
                    header-align="center"
                    align="center"
                    label="下一节点审核人">
                  </el-table-column>
            	  <el-table-column
                    prop="sort"
                    header-align="center"
                    align="center"
                    label="排序">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewFlowButtonRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editFlowButtonRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delFlowButtonRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
  <FlowButtonForm ref="flowButtonForm" @addRow="saveFlowButtonRow(arguments)"></FlowButtonForm>
</div>
</template>

<script>
  import FlowButtonForm from './FlowButtonForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        taskDefExtensionTab: '0',
        inputForm: {
          id: '',
          flowButtonList: [],
          processDefId: '',
          taskDefId: ''
        }
      }
    },
    components: {
      FlowButtonForm
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建工作流扩展`
        } else if (method === 'edit') {
          this.title = '修改工作流扩展'
        } else if (method === 'view') {
          this.title = '查看工作流扩展'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.taskDefExtensionTab = '0'
          this.inputForm.flowButtonList = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/extension/taskDefExtension/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.taskDefExtension)
            })
          }
        })
      },
      saveFlowButtonRow (child) {
        if (child[0] === '') {
          this.inputForm.flowButtonList.push(child[1])
        } else {
          this.inputForm.flowButtonList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.flowButtonList.splice(index, 1, child[1])
            }
          })
        }
      },
      addFlowButtonRow (child) {
        this.$refs.flowButtonForm.init('add')
      },
      viewFlowButtonRow (child) {
        this.$refs.flowButtonForm.init('view', child)
      },
      editFlowButtonRow (child) {
        this.$refs.flowButtonForm.init('edit', child)
      },
      delFlowButtonRow (child) {
        this.inputForm.flowButtonList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.flowButtonList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.flowButtonList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/extension/taskDefExtension/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>