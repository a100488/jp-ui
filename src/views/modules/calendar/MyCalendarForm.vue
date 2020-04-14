<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="16">
            <el-form-item label="日程内容" prop="title"
                :rules="[
                  {required: true, message:'日程内容不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.title" placeholder=""     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="开始时间" prop="start"
                :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
		            <el-date-picker
                v-model="inputForm.start"
                type="datetime"
                 value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
	         </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="结束时间" prop="end"
                :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
			         <el-date-picker
                v-model="inputForm.end"
                type="datetime"
                 value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
	         </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
       <el-button type="danger" v-if="method === 'edit'"  @click="del">删除</el-button>
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
          title: '',
          start: '',
          end: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id, start, end) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建日程`
        } else if (method === 'edit') {
          this.title = '修改日程'
        } else if (method === 'view') {
          this.title = '查看日程'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/myCalendar/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.myCalendar)
              this.loading = false
            })
          } else {
            this.inputForm.start = start
            this.inputForm.end = end
          }
        })
      },
      del () {
        this.loading = true
        this.$http.delete(
          `/myCalendar/del?id=${this.inputForm.id}`
        ).then(({data}) => {
          if (data && data.success) {
            this.visible = false
            this.$message.success(data.msg)
            this.$emit('refreshDataList')
          }
          this.loading = false
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/myCalendar/save`,
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