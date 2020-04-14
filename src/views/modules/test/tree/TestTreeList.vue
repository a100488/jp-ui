<template>
  <div>
      <el-row>
        <el-button v-if="hasPermission('test:tree:testTree:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
      </el-row>
    <el-table
      :data="dataList"
      size="medium"
      row-key="id"
      v-loading="loading"
      class="table">
	  <table-tree-column
        prop="name"
        treeKey="id"
        align="left"
        parentKey="parentId"
        show-overflow-tooltip
        label="名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:tree:testTree:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:tree:testTree:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </table-tree-column>
	  <el-table-column
        prop="remarks"
        show-overflow-tooltip
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:tree:testTree:view')" type="text" size="small" icon="el-icon-view" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:tree:testTree:edit')" type="text" size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:tree:testTree:del')" type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="hasPermission('test:tree:testTree:add')" type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">添加下级组织机构</el-button>
        </template>
      </el-table-column>
    </el-table>
        <!-- 弹窗, 新增 / 修改 -->
    <TestTreeForm  ref="testTreeForm" @refreshDataList="refreshList"></TestTreeForm>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import TestTreeForm from './TestTreeForm'
  export default {
    data () {
      return {
        dataList: [],
        loading: false
      }
    },
    components: {
      TableTreeColumn,
      TestTreeForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/tree/testTree/list',
          method: 'get'
        }).then(({data}) => {
          this.dataList = this.treeDataTranslate(data.list, 'id', 'parentId', 'children')
          console.log(this.dataList)
          this.loading = false
        })
      },
        // 新增下级
      addChild (id, name) {
        this.$refs.testTreeForm.init('addChild', {id: '', parent: {id: id, name: name}})
      },
       // 新增
      add () {
        this.$refs.testTreeForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      edit (id) {
        this.$refs.testTreeForm.init('edit', {id: id, parent: {id: '', name: ''}})
      },
      // 查看
      view (id) {
        this.$refs.testTreeForm.init('view', {id: id, parent: {id: '', name: ''}})
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
            url: '/test/tree/testTree/delete',
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