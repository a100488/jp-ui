<template>
<div>
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="readOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="员工姓名" prop="user.id"
                :rules="[
                  {required: true, message:'员工姓名不能为空', trigger:'blur'}
                 ]">
                <user-select :limit='1' :value="inputForm.user.id" @getValue='(value) => {inputForm.user.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="报销费用" prop="cost"
                :rules="[
                  {required: true, message:'报销费用不能为空', trigger:'blur'},
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.cost" placeholder="请填写报销费用"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="归属部门" prop="office.id"
                :rules="[
                  {required: true, message:'归属部门不能为空', trigger:'blur'}
                 ]">
          <SelectTree
                      ref="office"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'childNodes'    // 子级字段名
                        }"

                      url="/sys/office/treeData?type=2"
                      :value="inputForm.office.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.office.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="报销事由" prop="reason"
                :rules="[
                  {required: true, message:'报销事由不能为空', trigger:'blur'}
                 ]">
          <el-input type="textarea" v-model="inputForm.reason" placeholder="请填写报销事由"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        inputForm: {
          id: '',
          user: {
            id: ''
          },
          cost: '',
          office: {
            id: ''
          },
          reason: ''
        }
      }
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      UserSelect,
      SelectTree
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$refs.inputForm.resetFields()
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      init (id) {
        this.$refs.inputForm.resetFields()
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$http({
            url: `/test/activiti/testActivitiExpense/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.testActivitiExpense)
            this.loading = false
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/test/activiti/testActivitiExpense/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      }
    }
  }
</script>