<template>
  <div>
  <el-row :gutter="10">
    <el-col :span="5">
    <el-card  shadow="never" :body-style="contentViewHeight">
     <el-tag
        closable
        size="small" 
        style="margin-bottom:5px"
        v-if="selectCategoryName"
        :disable-transitions="false"
        @close="handleNodeClose">
        {{selectCategoryName}}
      </el-tag>
      <el-input
        placeholder="输入关键字进行过滤"
        size="small"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="categoryTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'name',         // 显示名称
              children: 'childNodes'    // 子级字段名
            }"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="categoryTree">
      </el-tree>
    </el-card>
    </el-col>
    <el-col :span="19">
      <el-card  shadow="never" :body-style="contentViewHeight">
      <el-form :inline="true"   class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item label="流程名称" prop="name">
            <el-input v-model="searchForm.name" size="small" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="12">
        <el-col :span="8" v-for="data in dataList2" :key="data.id">
          <el-card class="box-card" style="margin-bottom:10px">
              <!-- <div slot="header" class="clearfix">
                <span> {{data.category }}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="start(data)">启动</el-button>
              </div> -->
              <div class="actCard">
                <img src='@/assets/img/Scheme.png'/>
                <el-button style="color:#409EFF;margin-left:10px;"  type="text" @click="start(data)">{{data.name+' '+data.version}}</el-button>
              </div>
          </el-card>
        </el-col>
      </el-row>
      </el-card>
    </el-col>
  </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          category: '',
          name
        },
        filterText: '',
        selectCategoryName: '',
        dataList: [],
        categoryTreeData: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        isSearchCollapse: false,
        loading: false,
        visible: false,
        dataListSelections: [],
        processPhotoUrl: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    watch: {
      filterText (val) {
        this.$refs.categoryTree.filter(val)
      }
    },
    computed: {
      dataList2 () {
        return this.dataList.filter((data) => {
          return data.name.indexOf(this.searchForm.name) >= 0
        })
      },
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
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
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/flowable/process/list',
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
      handleNodeClose () {
        this.selectCategoryName = ''
        this.searchForm.category = ''
        this.refreshList()
      },
      start (row) {
              // 读取流程表单
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procDefId: row.id,
          status: 'start'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {procDefId: row.id, procDefKey: row.key, status: 'start', title: `发起流程【${row.name}】`, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: `${row.name}`}
            })
          }
        })
      },
      handleNodeClick (data) {
        this.searchForm.category = data.name
        this.selectCategoryName = '已选类型: ' + data.name
        this.refreshList()
      },
      resetSearch () {
        this.selectCategoryName = ''
        this.$refs.searchForm.resetFields()
        this.$nextTick(() => {
          this.refreshList()
        })
      }
    }
  }
</script>
<style scoped>
.actCard{
 padding: 0px;
}
</style>
