<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="国名" prop="name"
                :rules="[
                  {required: true, message:'国名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写国名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="人口" prop="sum"
                :rules="[
                  {required: true, message:'人口不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.sum" placeholder="请填写人口"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属洲" prop="continent.id"
                :rules="[
                  {required: true, message:'所属洲不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择所属洲"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.continent.id"
            :limit="1"
            @getValue='(value) => {inputForm.continent.id=value}'
            :columns="[
            {
              prop: 'name',
              label: '洲名'
            },
            {
              prop: 'remarks',
              label: '备注'
            }
            ]"
            :searchs="[
            {
              prop: 'name',
              label: '洲名'
            },
            {
              prop: 'remarks',
              label: '备注'
            }
            ]"
            dataListUrl="/test/grid/testContinent/list"
            entityBeanName="testContinent"
            queryEntityUrl="/test/grid/testContinent/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>
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
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          name: '',
          sum: '',
          continent: {
            id: ''
          },
          remarks: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建国家`
        } else if (method === 'edit') {
          this.title = '修改国家'
        } else if (method === 'view') {
          this.title = '查看国家'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/test/grid/testCountry/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.testCountry)
              this.loading = false
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
              url: `/test/grid/testCountry/save`,
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