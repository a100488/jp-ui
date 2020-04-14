<template>
  <el-container style=" border: 1px solid #eee">
  <el-aside width="200px">
     
    <el-menu @select="select" style="border:0">
      <el-button size="small" style="width:100%" type="primary" @click="sendLetter">
        写信
        </el-button>
        <el-menu-item-group>
          <template slot="title">我的信箱</template>
          <el-menu-item index="1">收件箱 ({{' '+ noReadCount}}/{{mailBoxCount + ' ' }})</el-menu-item>
          <el-menu-item index="2">已发送 ({{' '+ mailComposeCount +' '}})</el-menu-item>
          <el-menu-item index="3">草稿箱 ({{' '+ mailDraftCount+' ' }})</el-menu-item>
        </el-menu-item-group>
   
        
    </el-menu>
  </el-aside>
  
  <el-container>
    <el-header style="height:30px">
      <el-row>
        <el-col :span="10">
      <el-dropdown @command="changeReadStatus">
        <el-button size="small" type="primary">
          过滤<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">未读</el-dropdown-item>
          <el-dropdown-item command="1">已读</el-dropdown-item>
          <el-dropdown-item command="">全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" type="primary" @click="refreshList">
        <i class="el-icon-refresh"></i>
        </el-button>
        <el-button  type="danger" size="small" icon="el-icon-delete" @click="del()" plain>删除
        </el-button>
        </el-col>
        <el-col :span="14">
        <el-input v-model="searchForm.mail.title" placeholder="请输入标题">
           <el-button slot="append" icon="el-icon-search" @click="refreshList"></el-button>
        </el-input>
        </el-col>
      </el-row>
    </el-header>
    
    <el-main>
      <el-table
          :data="dataList"
          v-loading="loading"
          border
          height="620px"
          @selection-change="selectionChangeHandle"
          @sort-change="sortChangeHandle"
          class="table">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
          <el-table-column prop="status"  v-if="index === '2' || index === '3'" label="状态" >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === '1'">已发送</el-tag>
              <el-tag type="danger" v-if="scope.row.status === '0'">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="readstatus" v-if="index === '1'" label="状态" >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.readstatus === '1'">已读</el-tag>
              <el-tag type="danger" v-if="scope.row.readstatus === '0'">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sender.name" v-if="index === '1'" label="发件人" >
        </el-table-column>
        <el-table-column prop="receiverNames"  v-if="index !== '1'" label="收件人">
        </el-table-column>
        <el-table-column prop="mail.title" show-overflow-tooltip label="标题">
        </el-table-column>
         <el-table-column show-overflow-tooltip prop="sendtime" label="时间" >
        </el-table-column>
         <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="210"
            label="操作">
            <template slot-scope="scope">
              <el-button  type="text"  size="mini"  icon="el-icon-view" 
                        @click="view(scope.row.id)">查阅
              </el-button>
              <el-button v-if="index === '1'" type="text" icon="el-icon-edit" size="mini" @click="reply(scope.row)">
                回复
              </el-button>
              <el-button type="text" icon="el-icon-delete"  size="mini"  @click="del(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
      </el-table>
       <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-main>
  </el-container>
  <SendEmail @refreshList="refreshList" ref="sendEmail"></SendEmail>
  <SentMailDetail @refreshList="refreshList" ref="sentMailDetail"></SentMailDetail>
  <ReceivedMailDetail @refreshList="refreshList" ref="receivedMailDetail"></ReceivedMailDetail>
</el-container>
</template>
<script>
  import SendEmail from './SendEmail'
  import ReceivedMailDetail from './ReceivedMailDetail'
  import SentMailDetail from './SentMailDetail'
  export default {
    data () {
      return {
        searchForm: {
          mail: {
            title: ''
          },
          readstatus: '' // 0未读 1已读 2全部
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        index: '1', // 1收件箱 2发件箱 3草稿箱
        dataListSelections: [],
        dataUrl: '/mailBox/list',
        delUrl: '/mailBox/delete',
        loading: false,
        noReadCount: 0,
        mailBoxCount: 0,
        mailComposeCount: 0,
        mailDraftCount: 0

      }
    },
    components: {
      SendEmail,
      SentMailDetail,
      ReceivedMailDetail
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 查询状态
      queryStatus () {
        this.$http.get('/mailBox/queryStatus').then(({data}) => {
          this.noReadCount = data.noReadCount
          this.mailBoxCount = data.mailBoxCount
          this.mailComposeCount = data.mailComposeCount
          this.mailDraftCount = data.mailDraftCount
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.queryStatus()
        this.$http({
          url: this.dataUrl,
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      select (val) {
        this.index = val
        if (val === '1') {
          this.dataUrl = '/mailBox/list'
          this.delUrl = '/mailBox/delete'
        } else if (val === '2') {
          this.dataUrl = '/mailCompose/list?status=1'
          this.delUrl = '/mailCompose/delete'
        } else if (val === '3') {
          this.dataUrl = '/mailCompose/list?status=0'
          this.delUrl = '/mailCompose/delete'
        }
        this.refreshList()
      },

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      changeReadStatus (status) {
        this.searchForm.readstatus = status
        this.refreshList()
      },
      // 发信
      sendLetter () {
        this.$refs.sendEmail.init('add', '')
      },
      // 查看
      view (id) {
        if (this.index === '1') {
          this.$refs.receivedMailDetail.init(id)
        } else if (this.index === '2') {
          this.$refs.sentMailDetail.init(id)
        } else if (this.index === '3') {
          this.$refs.sendEmail.init('edit', id)
        }
      },
      reply (row) {
        let content = `<br/><br/><br/>------------------ 原始邮件 ------------------<br/>发件人:${row.sender.name}<br/>` +
            `发送时间:${row.sendtime}<br/>` +
          `收件人:${row.receiverNames}<br/>` +
            `主题:${row.mail.title}<br/>` +
          this.$utils.unescapeHTML(row.mail.content)
        let obj = {
          sender: {
            id: row.sender.id
          },
          title: '回复:' + row.mail.title,
          content: content
        }
        this.$refs.sendEmail.init('reply', obj)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.delUrl, {params: {
            ids: ids
          }}).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>

<style>
  .el-header {
    color: #333;
    line-height: 60px;
    height: 30px;
  }
  
  .el-aside {
    color: #333;
    border-right: 1px solid rgb(238, 238, 238);
  }
</style>
