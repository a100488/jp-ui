<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
            <el-form-item label="设备类型" prop="className"
                :rules="[
                  {required: true, message:'设备类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.classCode" style="width: 100%" placeholder="请选择">
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
        <el-col :span="12">
          <el-form-item label="序列号" prop="serialNumber"
                :rules="[
                  {required: true, message:'序列号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.serialNumber" placeholder="请填写序列号"></el-input>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row  :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="wassxm">
              <el-input v-model="inputForm.wassxm" placeholder="请填写所属项目"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-form-item label="固定资产编号" prop="wagdzc">
            <el-input v-model="inputForm.wagdzc" placeholder="请填写固定资产编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
            <el-form-item label="资产名称" prop="name"
                :rules="[
                  {required: true, message:'资产名称不能为空', trigger:'blur'}
                 ]">
                 <el-input v-model="inputForm.name" placeholder="请填写资产名称"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="使用厂商" prop="wasycs">
              <el-input v-model="inputForm.wasycs" placeholder="请填写使用厂商"></el-input>
           </el-form-item>
            
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
          <el-form-item label="Ip地址" prop="ip">
              <el-input v-model="inputForm.ip" placeholder="请填写名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="Model">
                <el-input v-model="inputForm.Model" placeholder="请填写型号"></el-input>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
            <el-form-item label="机房位置" prop="wajf">
                <el-input v-model="inputForm.wajf" placeholder="请填写机房位置"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="机柜位置" prop="wajg">
                    <el-input v-model="inputForm.wajg" placeholder="请填写机柜位置"></el-input>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
            <el-form-item label="起止U位" prop="waqsus">
                <el-input v-model="inputForm.waqsus" placeholder="请填写起止U位"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="终止U位" prop="wazzus">
              <el-input v-model="inputForm.wazzus" placeholder="请填写终止U位"></el-input>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-bottom: 17px">
        <el-col :span="12">
            <el-form-item label="负责民警" prop="wafzmj">
              <el-input v-model="inputForm.wafzmj" placeholder="请填写负责民警"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label-width="160px" label="使用厂商联系人及电话" prop="wafzmj">
              <el-input v-model="inputForm.wasycslxrjdh" placeholder="请填写负责民警"></el-input>
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
      init (type, row) {
        if (type === 'view') {
          this.title = `添加设备`
        } else if (type === 'edit') {
          this.title = `修改设备`
          this.inputForm = row
        }
        this.fileArra = []
        this.resourceArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.testDataMainFormTab = '0'
          this.inputForm.testDataChild21List = []
          this.inputForm.testDataChild22List = []
          this.inputForm.testDataChild23List = []
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
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/test/onetomany/testDataMainForm/save`,
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
<style>

</style>