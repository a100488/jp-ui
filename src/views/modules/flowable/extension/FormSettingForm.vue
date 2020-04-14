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
            <el-form-item label="节点id" prop="taskDefId"
                :rules="[
                 ]">
			        <el-input v-model="inputForm.taskDefId" placeholder="请填写节点id"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="只读设置" prop="formReadOnly"
                :rules="[
                 ]">
		            <el-checkbox-group
                        v-model="inputForm.formReadOnly">
                       <el-checkbox v-for="formReadOnly in $dictUtils.getDictList('')" :label="formReadOnly.label" :key="formReadOnly.id">{{formReadOnly.value}}</el-checkbox>
                    </el-checkbox-group>
	         </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        formSettingTab: '0',
        inputForm: {
          id: '',
          processDefId: '',
          taskDefId: '',
          formReadOnly: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建表单只读配置`
        } else if (method === 'edit') {
          this.title = '修改表单只读配置'
        } else if (method === 'view') {
          this.title = '查看表单只读配置'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.formSettingTab = '0'
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/extension/formSetting/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.formSetting)
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/extension/formSetting/save`,
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