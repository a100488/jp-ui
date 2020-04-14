<template>
  <el-dialog
    :title="!inputForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    append-to-body=""
    :visible.sync="visible">
    <el-form :model="inputForm" :rules="dataRule" v-loading="loading" ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="80px" @submit.native.prevent>
      <el-form-item label="标签" prop="label">
        <el-input v-model="inputForm.label" placeholder="标签"></el-input>
      </el-form-item>
      <el-form-item label="键值" prop="value">
        <el-input v-model="inputForm.value" placeholder="键值"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input-number  :step="1" v-model="inputForm.sort" placeholder="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        inputForm: {
          dictValueId: '',
          dictType: {
            id: ''
          },
          label: '',
          value: '',
          sort: 1
        },
        dataRule: {
          label: [
            {required: true, message: '标签不能为空', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '键值不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (method, obj) {
        this.inputForm.dictValueId = obj.dictValueId
        this.inputForm.dictType.id = obj.dictTypeId
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/sys/dict/queryDictValue?dictValueId=${this.inputForm.dictValueId}`,
              method: 'get',
              loading: false
            }).then(({data}) => {
              if (data && data.success) {
                this.inputForm = this.recover(this.inputForm, data.dictValue)
                this.inputForm.dictValueId = obj.dictValueId
              }
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        if (!this.groupId) {
          this.groupWrong = '请选择分组'
        }
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/sys/dict/saveDictValue`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$message({
                  message: data.msg,
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
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
