<template>
  <div>
      <el-row>
        <el-button v-if="hasPermission('extension:actCategory:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
      </el-row>
    <el-table
      :data="dataList"
      border
      v-loading="loading"
      row-key="id"
      size = "medium"
      class="table">
      <table-tree-column
        prop="name"
        ref="actCategoryTree"
        treeKey="id"
        parentKey="parentId"
        label="名称">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('extension:actCategory:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('extension:actCategory:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </table-tree-column>
	  <el-table-column
        prop="remarks"
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('extension:actCategory:view')" type="text" icon="el-icon-view" size="mini" @click="view(scope.row.id)">
            查看
          </el-button>
          <el-button v-if="hasPermission('extension:actCategory:edit')" type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">
            修改
          </el-button>
          <el-button v-if="hasPermission('extension:actCategory:del')" type="text" size="mini" icon="el-icon-delete"  @click="del(scope.row.id)">
            删除
          </el-button>
          <el-button v-if="hasPermission('extension:actCategory:del')" type="text" size="mini" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">
            添加下级
          </el-button>
        </template>
      </el-table-column>
    </el-table>
        <!-- 弹窗, 新增 / 修改 -->
    <ActCategoryForm  ref="actCategoryForm" @refreshDataList="refreshList"></ActCategoryForm>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import ActCategoryForm from './ActCategoryForm'
  export default {
    data () {
      return {
        dataList: [],
        loading: false
      }
    },
    components: {
      TableTreeColumn,
      ActCategoryForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/extension/actCategory/list',
          method: 'get'
        }).then(({data}) => {
          this.dataList = this.treeDataTranslate(data.list, 'id', 'parentId', 'childrens')
          this.loading = false
        })
      },
      // 新增下级
      addChild (id, name) {
        this.$refs.actCategoryForm.init('addChild', {id: '', parent: {id: id, name: name}})
      },
      // 新增
      add () {
        this.$refs.actCategoryForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      edit (id) {
        this.$refs.actCategoryForm.init('edit', {id: id, parent: {id: '', name: ''}})
      },
      // 查看
      view (id) {
        this.$refs.actCategoryForm.init('view', {id: id, parent: {id: '', name: ''}})
      },
      // 删除
      del (id) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/extension/actCategory/delete',
            method: 'delete',
            params: {'id': id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      }
    }
  }
</script>