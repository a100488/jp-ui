<template>
  <el-dialog
    title="请选择流程分类"
    :close-on-click-modal="false"
    :visible.sync="visible" width="500px">
    {{selectCategoryName}}
     <el-tree
        class="filter-tree"
        :data="categoryTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'name',         // 显示名称
              children: 'childNodes'    // 子级字段名
            }"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="categoryTree">
      </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" :disabled="!inputForm.category" @click="inputFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        categoryTreeData: [],
        selectCategoryName: '',
        inputForm: {
          id: '',
          category: ''
        }
      }
    },
    methods: {
      init (id, category) {
        this.visible = true
        this.inputForm.id = id
        this.inputForm.category = ''
        this.$nextTick(() => {
          this.selectCategoryName = ''
          this.refreshTree()
        })
      },
         // 获取树数据
      refreshTree () {
        this.$http({
          url: '/extension/actCategory/treeData',
          method: 'get'
        }).then(({data}) => {
          this.categoryTreeData = data.treeData
        })
      },
      handleNodeClick (data) {
        this.inputForm.category = data.name
        this.selectCategoryName = '已选类型: ' + data.name
      },
      // 表单提交
      inputFormSubmit () {
        if (!this.inputForm.category) {
          this.$message.error('请选择一个分类!')
          return
        }
        this.$http.post(`/flowable/model/updateCategory?id=${this.inputForm.id}&category=${this.inputForm.category}`).then(({data}) => {
          if (data && data.success) {
            this.$message.success({dangerouslyUseHTMLString: true,
              message: data.msg})
            this.$emit('refreshList')
            this.visible = false
          }
        })
      }
    }
  }
</script>
