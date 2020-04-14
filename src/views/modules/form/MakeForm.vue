<template>
<div>
  <el-dialog
    :title="title"
    fullscreen
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'"
             label-width="120px">
           <fm-making-form ref="formDesign" style="height:700px" :data="options"
             :uploadPath ="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/formbuilder`"
             preview tab-list  clearable>
          </fm-making-form>
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
        options: {},
        dataBindFields: [],
        inputForm: {
          id: '',
          name: '',
          tableName: '',
          fields: [],
          source: '',
          version: '',
          remarks: ''
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
          this.title = `新建数据表单`
        } else if (method === 'edit') {
          this.title = '修改数据表单'
        } else if (method === 'view') {
          this.title = '查看数据表单'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          if (method === 'add') {
            this.$refs.formDesign.setJSON({'list': [], 'config': {'labelWidth': 100, 'labelPosition': 'right', 'size': 'small', 'customClass': ''}})
          }
          // this.options = {}
          this.inputForm.name = ''
          this.inputForm.tableName = ''
          this.inputForm.source = ''
          this.inputForm.version = ''
          this.inputForm.remarks = ''
          this.inputForm.fields = []
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/form/make/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.form)
              this.options = JSON.parse(this.inputForm.source)
              this.$refs.formDesign.setJSON(this.options)
              this.loading = false
            })
          }
        })
      },
      handleSubmit () {

      },
      generateModel (genList) {
        for (let i = 0; i < genList.length; i++) {
          if (genList[i].type === 'grid') {
            genList[i].columns.forEach(item => {
              this.generateModel(item.list)
            })
          } else if (genList[i].type === 'tabs') {
            genList[i].tabs.forEach(item => {
              this.generateModel(item.list)
            })
          } else {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (genList[i].options.dataBind) {
              this.dataBindFields.push({'model': genList[i].model, 'name': genList[i].name, 'type': genList[i].type})
            }
          }
        }
        return this.dataBindFields
      },
      // 表单提交
      doSubmit () {
        this.inputForm.source = JSON.stringify(this.$refs.formDesign.getJSON())
        this.inputForm.fields = JSON.stringify(this.generateModel(this.$refs.formDesign.getJSON().list))
        this.$prompt('请输入表单名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.inputForm.name
        }).then(({ value }) => {
          this.inputForm.name = value
          this.$refs['inputForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: `/form/make/save`,
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
        })
      }
    }
  }
</script>