<template>
  <el-dialog
    title="写站内信"
    width="1200px"
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="16">
            <el-form-item label="发送到" prop="receiverIds"
                :rules="[
                  {required: true, message:'收信人不能为空', trigger:'blur'}
                 ]">
          		   <user-select  :value="inputForm.receiverIds" @getValue='(value) => {inputForm.receiverIds=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="标题" prop="mail.title"
                :rules="[
                 ]">
			        <el-input v-model="inputForm.mail.title" placeholder="请输入标题"     ></el-input>
	         </el-form-item>
        </el-col>
         <el-col :span="24">
           <el-form-item label="内容">
            <WangeEditor ref="editor"    v-model="inputForm.mail.content"/>
           </el-form-item>
         </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
       <el-button type="danger" @click="doSubmit('0')">存为草稿</el-button>
      <el-button  type="primary" @click="doSubmit('1')">发送邮件</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import WangeEditor from '@/components/editor/WangEditor'
  export default {
    data () {
      return {
        visible: false,
        inputForm: {
          id: '',
          status: '',
          receiverIds: '',
          mail: {
            title: '',
            overview: '',
            content: ''
          }
        }
      }
    },
    components: {
      UserSelect,
      WangeEditor
    },
    mounted () {
    },
    methods: {
      init (method, obj) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          this.inputForm.mail.content = ''
          this.$refs.editor.init(this.inputForm.mail.content)
          if (method === 'edit') { // 修改
            this.inputForm.id = obj
            this.$http({
              url: `/mailCompose/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.success) {
                this.inputForm = this.recover(this.inputForm, data.mailCompose)
                this.$refs.editor.init(this.inputForm.mail.content)
              }
            })
          }
          if (method === 'reply') { // 修改
            this.inputForm.mail.title = obj.title
            this.inputForm.mail.content = obj.content
            this.$refs.editor.init(this.inputForm.mail.content)
            this.inputForm.receiverIds = obj.sender.id
          }
        })
      },
            // 表单提交
      doSubmit (status) {
        this.inputForm.status = status
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/mailCompose/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshList')
              }
            })
          }
        })
      }
    }
  }
</script>