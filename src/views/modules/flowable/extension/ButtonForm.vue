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
            <el-form-item label="名称" prop="name"
                :rules="[
                  {required: true, message:'名称不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.name" placeholder="请填写名称"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="编码" prop="code"
                :rules="[
                  {required: true, message:'编码不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.code" placeholder="请填写编码"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="排序" prop="sort"
                :rules="[
                  {required: true, message:'排序不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.sort" placeholder="请填写排序"     ></el-input>
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
        buttonTab: '0',
        inputForm: {
          id: '',
          name: '',
          code: '',
          sort: ''
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
          this.title = `新建常用按钮`
        } else if (method === 'edit') {
          this.title = '修改常用按钮'
        } else if (method === 'view') {
          this.title = '查看常用按钮'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.buttonTab = '0'
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/extension/button/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.button)
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
              url: `/extension/button/save`,
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