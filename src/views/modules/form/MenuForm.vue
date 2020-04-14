<template>
<div>
  <el-dialog
    title="创建菜单"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="inputForm"  ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
        <el-form-item label="上级菜单" prop="parent.id" :rules="[{required: true, message: '请选择上级菜单', trigger: 'blur'}]">
             <SelectTree 
             ref="menuParentTree"
             :props="{
                value: 'id',             // ID字段名
                label: 'name',         // 显示名称
                children: 'childNodes'    // 子级字段名
              }"
            :data="menuList"
            :value="inputForm.parent.id"
            :clearable="true" 
            :accordion="true"
            @getValue="(value) => {inputForm.parent.id=value}"/>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{required: true, message: '名称不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.name" 
                  placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item v-if="inputForm.type !== '2'" label="菜单图标" prop="icon">
            <el-input v-model="inputForm.icon" @focus="selectIcon" clearable :readonly="true" style="width:100%" placeholder="菜单图标名称"></el-input>
        </el-form-item>
    
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
  <Icon ref="icon" @getValue="value => inputForm.icon = value"></Icon>
</div>
</template>

<script>
  import Icon from '@/components/icon'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        visible: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'childNodes'
        },
        inputForm: {
          parent: {
            id: ''
          },
          name: '',
          id: '',
          icon: '',
          formId: ''
        }
      }
    },
    components: {
      SelectTree,
      Icon
    },
    methods: {
      init (form) {
        this.inputForm.name = form.name
        this.inputForm.formId = form.id
        this.$http({
          url: `/sys/menu/treeData`,
          method: 'get'
        }).then(({data}) => {
          this.menuList = data.treeData
        })
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          this.$refs.menuParentTree.clearHandle()
        })
      },
       // 图标选中
      iconActiveHandle (iconName) {
        this.inputForm.icon = iconName
      },
      selectIcon () {
        this.$refs.icon.visible = true
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$http.post('/form/make/createMenu',
               this.inputForm
            ).then(({data}) => {
              if (data && data.success) {
                this.$message.success({dangerouslyUseHTMLString: true,
                  message: data.msg})
                this.visible = false
              }
            })
          }
        })
      }
    }
  }
</script>