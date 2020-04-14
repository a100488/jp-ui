<template>
  <div style="padding:10px">
    <el-form :model="inputForm" status-icon v-loading="loading" ref="inputForm" @keyup.enter.native="inputFormSubmit()"
             label-width="120px" @submit.native.prevent>
       <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item size="mini" label="功能权限" prop="menuIds">
            <el-scrollbar style="height: 600px">
              <el-tree
                :data="menuList"
                :props=" {
                    label: 'name',
                    children: 'childNodes'
                  }"
                node-key="id"
                ref="menuListTree"
                :default-expanded-keys="['1']"
                :default-checked-keys="menuCheckedKeys"
                show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item size="mini" label="数据权限">
             <el-scrollbar style="height: 600px">
              <el-tree
                :data="dataRuleList"
                :props=" {
                  label: 'name',
                  children: 'childNodes'
                }"
                node-key="id"
                ref="dataRuleTree"
                :default-expanded-keys="['1']"
                :default-checked-keys="dataRuleCheckedKeys"
                show-checkbox>
              </el-tree>
             </el-scrollbar>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item>
               <el-button type="primary" icon="el-icon-check" size="small" plain @click="inputFormSubmit()" v-noMoreClick>保存</el-button>
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
        visible: false,
        loading: false,
        title: '',
        menuList: [],
        dataRuleList: [],
        menuCheckedKeys: [],
        dataRuleCheckedKeys: [],
        inputForm: {
          id: '',
          menuIds: '',
          dataRuleIds: '',
          oldName: '',
          oldEname: ''
        }
      }
    },
    methods: {
      init (id) {
        this.inputForm.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$refs.menuListTree.setCheckedKeys([])
          this.$refs.dataRuleTree.setCheckedKeys([])
          let p1 = this.$http({
            url: '/sys/menu/treeData',
            method: 'get'
          })
          let p2 = this.$http({
            url: `/sys/dataRule/treeData`,
            method: 'get'
          })
          if (this.inputForm.id) {
            this.loading = true
            let p3 = this.$http({
              url: `/sys/role/queryById?id=${this.inputForm.id}`,
              method: 'get'
            })
            Promise.all([p1, p2, p3]).then((result) => {
              this.menuList = result[0].data.treeData
              this.dataRuleList = result[1].data.treeData
              let data = result[2].data
              if (data && data.success) {
                this.loading = false
                this.inputForm = this.recover(this.inputForm, data.role)
                this.inputForm.oldName = data.role.name
                this.inputForm.oldEnname = data.role.enname
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIds.split(','))
                this.$refs.dataRuleTree.setCheckedKeys(data.role.dataRuleIds.split(','))
              }
            })
          } else {
            Promise.all([p1, p2]).then((result) => {
              this.menuList = result[0].data.treeData
              this.dataRuleList = result[1].data.treeData
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      inputFormSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          this.inputForm.menuIds = this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys()).join(',')
          this.inputForm.dataRuleIds = this.$refs.dataRuleTree.getCheckedKeys().concat(this.$refs.dataRuleTree.getHalfCheckedKeys()).join(',')
          if (valid) {
            this.loading = true
            this.$http({
              url: `/sys/role/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)
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

<style lang="scss" scoped>
 
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
 
 
  .el-scrollbar {
    height: 100%;
  }
</style>