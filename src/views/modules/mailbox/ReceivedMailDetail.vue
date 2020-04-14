<template>
  <el-dialog
  center
    :title="inputForm.mail.title"
    width="70%"
    :close-on-click-modal="false"
    append-to-body
    :before-close="handleClose"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm">

             <div>
              <span>发件人：{{inputForm.sender.name}}</span>
              <el-divider></el-divider>
              <span>收件人：{{inputForm.receiverNames}}</span>
              <el-divider></el-divider>
              <span>时间：{{inputForm.sendtime}}</span>
              <el-divider></el-divider>
               <el-card>
                 <p v-html="$utils.unescapeHTML(inputForm.mail.content)"></p>
            </el-card>
            </div>

    </el-form>
    <span slot="footer" class="dialog-footer">
       <el-button type="danger" @click="handleClose()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import WangeEditor from '@/components/editor/WangEditor'
  export default {
    data () {
      return {
        method: '',
        content: '',
        editorOption: {},
        visible: false,
        status: '',
        inputForm: {
          id: '',
          status: '',
          receiverIds: '',
          receiverNames: '',
          sendtime: '',
          mail: {
            title: '',
            overview: '',
            content: ''
          },
          sender: {
            name: ''
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
      init (id) {
        this.inputForm.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          this.$http({
            url: `/mailBox/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            if (data && data.success) {
              this.inputForm = this.recover(this.inputForm, data.mailBox)
            }
          })
        })
      },
            // 表单提交
      handleClose () {
        this.visible = false
        this.$emit('refreshList')
      }
    }
  }
</script>