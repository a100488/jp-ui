<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible" width="30%">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="18">
            <el-form-item label="设备类型" prop="classCode" style="margin-bottom: 17px"
                :rules="[
                  {required: true, message:'设备类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.classCode" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="19">
            <el-form-item>
                  <el-upload
                    class="upload-demo"
                    drag
                    :action="`${this.$http.BASE_URL}/wa/cmdb/import?classCode=${inputForm.classCode}`"
                    name="file"
                    :before-upload="beforeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" style="margin-top: -10px">仅支持模板格式Excel表格上传，请勿上传其他文件。</div>
                  </el-upload>
                  <p><a @click="notnull()" href="`${this.$http.BASE_URL}/wa/cmdb/generate?classCode=${inputForm.classCode}`">点击获取模板</a></p>
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
        limit: 1,
        options: [{
          value: 'cssb',
          label: '传输设备'
        }, {
          value: 'Firewall',
          label: '防火墙'
        }, {
          value: 'networkDevice',
          label: '网络设备资产'
        }, {
          value: 'servermanage',
          label: '服务器资产'
        }, {
          value: 'aqsb',
          label: '安全设备'
        }, {
          value: 'Switch',
          label: '交换机'
        }, {
          value: 'Router',
          label: '路由器'
        }],
        testDataMainFormTab: '0',
        fileArra: [],
        resourceArra: [],
        inputForm: {
          classCode: '',
          name: '',
          sex: '',
          file: '',
          inDate: '',
          remarks: ''
        }
      }
    },
    components: {
    },
    methods: {
      init () {
        this.title = `批量上传`
        this.limit = 1
        this.fileArra = []
        this.resourceArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
        })
      },
      saveTestDataChild21Row (child) {
        if (child[0] === '') {
          this.inputForm.testDataChild21List.push(child[1])
        } else {
          this.inputForm.testDataChild21List.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.testDataChild21List.splice(index, 1, child[1])
            }
          })
        }
      },
      notnull () {
        if (this.inputForm.classCode === '') {
          this.$message.error('请选择设备类型')
          return false
        }
      },
      beforeUpload: function (file) {
        if (this.inputForm.classCode === '') {
          this.$message.error('请选择设备类型')
          return false
        }
      },
      addTestDataChild21Row (child) {
        this.$refs.testDataChild21Form.init('add')
      },
      viewTestDataChild21Row (child) {
        this.$refs.testDataChild21Form.init('view', child)
      },
      editTestDataChild21Row (child) {
        this.$refs.testDataChild21Form.init('edit', child)
      },
      delTestDataChild21Row (child) {
        this.inputForm.testDataChild21List.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.testDataChild21List.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.testDataChild21List.splice(index, 1, item)
          }
        })
      },
      saveTestDataChild22Row (child) {
        if (child[0] === '') {
          this.inputForm.testDataChild22List.push(child[1])
        } else {
          this.inputForm.testDataChild22List.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.testDataChild22List.splice(index, 1, child[1])
            }
          })
        }
      },
      addTestDataChild22Row (child) {
        this.$refs.testDataChild22Form.init('add')
      },
      viewTestDataChild22Row (child) {
        this.$refs.testDataChild22Form.init('view', child)
      },
      editTestDataChild22Row (child) {
        this.$refs.testDataChild22Form.init('edit', child)
      },
      delTestDataChild22Row (child) {
        this.inputForm.testDataChild22List.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.testDataChild22List.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.testDataChild22List.splice(index, 1, item)
          }
        })
      },
      saveTestDataChild23Row (child) {
        if (child[0] === '') {
          this.inputForm.testDataChild23List.push(child[1])
        } else {
          this.inputForm.testDataChild23List.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.testDataChild23List.splice(index, 1, child[1])
            }
          })
        }
      },
      addTestDataChild23Row (child) {
        this.$refs.testDataChild23Form.init('add')
      },
      viewTestDataChild23Row (child) {
        this.$refs.testDataChild23Form.init('view', child)
      },
      editTestDataChild23Row (child) {
        this.$refs.testDataChild23Form.init('edit', child)
      },
      delTestDataChild23Row (child) {
        this.inputForm.testDataChild23List.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.testDataChild23List.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.testDataChild23List.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.inputForm.resourceString = JSON.stringify(this.resourceArra)
        console.log(this.inputForm)
        this.$refs['inputForm'].validate((valid) => {
          // if (valid) {
          //   this.loading = true
          //   this.$http({
          //     url: `/test/onetomany/testDataMainForm/save`,
          //     method: 'post',
          //     data: this.inputForm
          //   }).then(({data}) => {
          //     if (data && data.success) {
          //       this.visible = false
          //       this.$message.success(data.msg)
          //       this.$emit('refreshDataList')
          //     }
          //     this.loading = false
          //   })
          // }
        })
      }
    }
  }
</script>