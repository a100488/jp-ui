<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="任务名" prop="name"
                :rules="[
                  {required: true, message:'任务名不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.name" placeholder="请填写任务名"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="任务组" prop="group"
                :rules="[
                  {required: true, message:'任务组不能为空', trigger:'blur'}
                 ]">
		            <el-select v-model="inputForm.group" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('schedule_task_group')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="定时规则" prop="cronExpression"
                :rules="[
                  {required: true, message:'定时规则不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.cronExpression" placeholder="请填写定时规则"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="启用状态" prop="status"
                :rules="[
                  {required: true, message:'启用状态不能为空', trigger:'blur'}
                 ]">
		            <el-select v-model="inputForm.status" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="通知用户" prop="isInfo"
                :rules="[
                 ]">
		            <el-select v-model="inputForm.isInfo" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('schedule_task_info')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="任务类" prop="className"
                :rules="[
                  {required: true, message:'任务类不能为空', trigger:'blur'},
                   { validator: validateClassName, trigger: 'blur' }
                 ]">
			        <el-input v-model="inputForm.className" placeholder="请填写任务类"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="描述" prop="description"
                :rules="[
                 ]">
					<el-input type="textarea" v-model="inputForm.description" placeholder="请填写描述"     ></el-input>
	         </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
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
        loading: false,
        inputForm: {
          id: '',
          name: '',
          group: '',
          cronExpression: '',
          status: '',
          isInfo: '',
          className: '',
          description: ''
        },
        validateClassName: (rule, value, callback) => {
          this.$http.get(`/quartz/scheduleJob/existsClass?className=${value}`).then(({data}) => {
            if (!data.success) {
              callback(new Error('类不存在!'))
            } else {
              callback()
            }
          })
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
          this.title = `新建定时任务`
        } else if (method === 'edit') {
          this.title = '修改定时任务'
        } else if (method === 'view') {
          this.title = '查看定时任务'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/quartz/scheduleJob/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.scheduleJob)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/quartz/scheduleJob/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>