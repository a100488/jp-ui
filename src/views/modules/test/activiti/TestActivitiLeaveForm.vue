<template>
<div>
    <el-form :model="inputForm" ref="inputForm" v-loading="loading"   :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="请假类型" prop="leaveType"
                :rules="[
                  {required: true, message:'请假类型不能为空', trigger:'blur'}
                 ]">
                    <el-radio-group v-model="inputForm.leaveType">
                        <el-radio v-for="item in $dictUtils.getDictList('oa_leave_type')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
                    </el-radio-group>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="请假开始时间" prop="startTime"
                :rules="[
                  {required: true, message:'请假开始时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.startTime"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="请假结束时间" prop="endTime"
                :rules="[
                  {required: true, message:'请假结束时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.endTime"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
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
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        inputForm: {
          id: '',
          leaveType: '',
          startTime: '',
          endTime: '',
          reason: ''
        }
      }
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      formReadOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/test/activiti/testActivitiLeave/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.testActivitiLeave)
              this.loading = false
            })
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/test/activiti/testActivitiLeave/save`,
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