<template>
<div>
 <el-row>
 <el-button  type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
 </el-row>
  <el-table
    class="table"
    size = "medium"
    :data="dataList">
     <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="name"
      label="报表名">
    </el-table-column>
    <el-table-column
      prop="updateDate"
      label="更新日期">
      <template slot-scope="scope">
         {{moment(scope.row.updateDate).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
         <el-button
          size="mini"
          type="text"
          @click="pre(scope.row)" >预览</el-button>
           <el-divider direction="vertical"></el-divider>
        <el-button
          size="mini"
          type="text"
          @click="design(scope.row)" >设计</el-button>
           <el-divider direction="vertical"></el-divider>
        <el-button
          size="mini"
          type="text"
          @click="del(scope.row)" >删除</el-button>
           <el-divider direction="vertical"></el-divider>
           <el-button
          size="mini"
          type="text"
          @click="download(scope.row)" >导出</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
export default {
  data () {
    return {
      dataList: []
    }
  },
  activated () {
    this.refreshList()
  },
  methods: {
      // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/reports/list',
        method: 'get'
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.reports
          this.loading = false
        }
      })
    },
    add () {
      this.$router.push({path: '/ureport/designer', query: {title: '新建报表'}})
    },
    pre (report) {
      this.$router.push(`/ureport/preview?_u=file:${report.name}`)
    },
    design (report) {
      this.$router.push({path: `/ureport/designer?_u=file:${report.name}`, query: {title: '编辑报表'}})
    },
  // 删除
    del (report) {
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/reports/delete',
          method: 'delete',
          params: {'id': `file:${report.name}`}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    download (report) {
      window.open(`${this.$http.BASE_URL}/ureport/word?_u=file:${report.name}`)
    }

  }
}
</script>