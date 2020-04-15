<template>
  <div>
      <el-row style="margin:10px" :gutter="10">
        <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="data in dataListTj" :key="data.id">
          <el-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:10px">
            <div class="actCard" style="disply:flex">
              <div :style="'height: 80px;float:left;width: 80px;text-align: center;line-height: 75px;background: '+data.color+';'">
                <i :class="data.icon" style="transform: scale(1.8)"></i>
              </div>
              <div style="height: 80px;flex:1;text-align: center;line-height: 40px;rgba(106, 146, 103, 0.1);">
                <div><span style="font-size:18px">{{data.name}}</span></div>
                <div><span class="numStyle">{{data.num}}</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="12"  style="disply:flex;margin: 20px 10px 10px;">
        <el-popover
          placement="right"
          width="500"
          trigger="click">
            <template v-for="data in dataList2">
              <!-- <el-button-group  :key="data.id"> -->
                <!-- <el-card v-if="data.id.substring(0,2) === 'WA'" class="box-card"  style="width: 180px;text-align: center;margin-bottom:10px"> -->
                  <el-col :span="12"  :key="data.id" style="text-align: center;">
                    <el-button round  title="发起流程" style="margin:5px;font-size:18px;width: 200px;" v-if="data.id.substring(0,2) === 'WA'" size="medium"  type="primary" @click="start(data)">{{data.name}}</el-button>
                  </el-col>
                <!-- </el-card> -->
              <!-- </el-button-group> -->
            </template>
            <el-button type="primary" size="medium" style="font-size:16px;" slot="reference">创建工单</el-button>
          </el-popover>
        <!-- <el-input size="small" v-model="searchForm.title" style="margin-right: 10px;width:200px" placeholder="请输入工单标题" clearable></el-input>
        <el-button
          size="small"
          type="text"
          @click="isSearchCollapse = !isSearchCollapse, isCreateCollapse=false">
          更多筛选
        </el-button>
        <el-button type="primary" icon="el-icon-search" @click="refreshList()" size="small">查询</el-button> -->
        <!-- </el-popover> -->
        <div class="pull-right">
          <el-input size="medium" v-model="searchForm.title" style="margin-right: 10px;height: 36.42px;width:200px" placeholder="请输入工单标题" clearable></el-input>
          <el-button
            size="small"
            type="text"
            @click="isSearchCollapse = !isSearchCollapse, isCreateCollapse=false">
            更多筛选
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="refreshList()" size="medium">查询</el-button>
          <!-- <el-button
            type="default"
            size="small"
            title="查询"
            icon="el-icon-search"
            @click="isSearchCollapse = !isSearchCollapse, isCreateCollapse=false">
          </el-button>
          <el-button v-if="hasPermission('test:onetomany:testDataMainForm:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
          <el-button v-if="hasPermission('test:onetomany:testDataMainForm:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
          <el-button
            type="default"
            size="small"
            title="刷新"
            icon="el-icon-refresh"
            @click="refreshList">
          </el-button> -->
        </div>
      </el-row>
      <el-collapse-transition>
        <div v-show="isSearchCollapse">
        <el-form :inline="true"  label-width="120px" label-position="right" label-suffix="：" class="gd-query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
              <!-- 搜索框-->
          <!-- <el-row style="display:flex">
            <el-col :xs="24" :sm="16" :md="10" :lg="8" :xl="6" > -->
              <el-form-item label="创单人" prop="vars.userName">
                  <!-- <user-select :limit='2' size="small" :value="searchForm.vars.userName" @getValue='(value) => {searchForm.vars.userName=value}'></user-select> -->
                  <el-input size="small" v-model="vars[0].value" placeholder="请输入创单人" clearable></el-input>
              </el-form-item>
            <!-- </el-col>
            <el-col :xs="24" :sm="16" :md="10" :lg="8" :xl="6"> -->
              <!-- <el-form-item label="工单标题" prop="title">
                  <el-input size="small" v-model="searchForm.title" placeholder="请输入工单标题" clearable></el-input>
              </el-form-item> -->
            <!-- </el-col>
            <el-col :xs="24" :sm="16" :md="10" :lg="8" :xl="6"> -->
              <el-form-item prop="sex" label="流程名称">
                <el-select v-model="searchForm.procDefKey" size="small" clearable placeholder="请选择">
                    <el-option
                      v-for="item in dataList2"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <!-- <el-input size="small" v-model="searchForm.procDefKey" placeholder="请输入流程名称" clearable></el-input> -->
              </el-form-item>
            <!-- </el-col>
            <el-col :xs="24" :sm="16" :md="10" :lg="8" :xl="6"> -->
              <el-form-item prop="sex1" label="流程状态">
                <el-input size="small" v-model="searchForm.status" placeholder="请输入流程状态" clearable></el-input>
              </el-form-item>
            <!-- </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8" > -->
              <el-form-item prop="searchDates" label="创建时间">
                <el-date-picker
                  v-model="searchDates"
                  type="daterange"
                  size="small"
                  align="right"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            <!-- </el-col>
          </el-row> -->
          <!-- <el-row style="text-align:center">
            <el-form-item>
              <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
              <el-button @click="resetSearch()" size="small">重置</el-button>
            </el-form-item>
          </el-row> -->
        </el-form>
        </div>
      </el-collapse-transition>
      <!-- <el-row>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-circle-plus-outline"
              title="报修"
              @click="isCreateCollapse = !isCreateCollapse, isSearchCollapse=false">
            </el-button>
            <el-button
              type="default"
              size="small"
              title="查询"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isCreateCollapse=false">
            </el-button>
             <el-button v-if="hasPermission('test:onetomany:testDataMainForm:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('test:onetomany:testDataMainForm:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
            <el-button
              type="default"
              size="small"
              title="刷新"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row> -->

      <el-col :span="24" style="margin:10px">
        <el-tabs id="tabs" v-model="tabName" @tab-click="handleClick">
          <el-tab-pane label="我的代办" name="todo">
              <el-table
                border
                :data="tabData.todoList"
                style="width: 100%">
                <el-table-column
                  prop="vars.title"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="工单标题">
                </el-table-column>
                <el-table-column
                  prop="procDef.name"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="流程名称">
                </el-table-column>
                <el-table-column
                    prop="vars.userName"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="创建人">
                  </el-table-column>
                <el-table-column
                  prop="status"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="状态">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.code === 0 
                    || scope.row.code === 3
                    || scope.row.code === 4 
                    || scope.row.code === 5"  type="danger">{{scope.row.status}}</el-tag>  <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span>
                    <el-tag v-if="scope.row.code === 1" type="primary">{{scope.row.status}}</el-tag>
                    <el-tag v-if="scope.row.code === 2" type="success">{{scope.row.status}}</el-tag>
                    <el-tag v-else type="success">运行中[{{scope.row.status}}]</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="task.name"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="当前环节">
                  <template slot-scope="scope">
                      <el-tag>{{scope.row.task.name}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="task.createTime"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="创单时间">
                  <template slot-scope="scope">
                    {{scope.row.task.createTime | formatDate}}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 'claim'" type="text" size="small" @click="claim(scope.row)">办理</el-button>
                    <el-button v-if="scope.row.status === 'todo'" type="text" size="small" @click="todo(scope.row)">办理</el-button>
                    <!-- <el-button v-if="scope.row.status === 'todo'" type="text" size="small" @click="transferTask(scope.row)">委派</el-button> -->
                    <!-- <el-button v-if="scope.row.claimTime" type="text" size="small" @click="unclaim(scope.row)">取消签收</el-button> -->
                    <el-button  type="text" size="small" @click="trace(scope.row)">进度</el-button>
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
            </el-tab-pane>
          <el-tab-pane label="我参与的" name="partin">
            <el-table
              border
              :data="tabData.partInList"
              style="width: 100%">
              <el-table-column
                prop="vars.title"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="工单标题">
              </el-table-column>
              <el-table-column
                prop="proc.name"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="流程名称">
              </el-table-column>
              <el-table-column
                prop="vars.userName"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="创建人">
              </el-table-column>
              <el-table-column
                prop="status"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.code === 0 
                  || scope.row.code === 3
                  || scope.row.code === 4 
                  || scope.row.code === 5"  type="danger">{{scope.row.status}}</el-tag>  <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span>
                  <el-tag v-if="scope.row.code === 1" type="primary">{{scope.row.status}}</el-tag>
                  <el-tag v-if="scope.row.code === 2" type="success">{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                  prop="task.name"
                  header-align="center"
                  align="center"
                  show-overflow-tooltip
                  label="办理环节">
                  <template slot-scope="scope">
                      <el-tag>{{scope.row.task.name}}</el-tag>
                  </template>
                </el-table-column>
              <el-table-column
                prop="task.endTime"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="完成时间">
                <template slot-scope="scope">
                  {{scope.row.task.endTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button  type="text" size="small"
                    @click="detail(scope.row)">历史
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
          </el-tab-pane>
          <el-tab-pane label="全部工单" name="all">
            <el-table
              border
              :data="tabData.allList"
              style="width: 100%">
              <el-table-column
                prop="processVariables.title"
                align="center"
                label="标题">
              </el-table-column>
              <el-table-column
                prop="processDefinitionName"
                align="center"
                label="流程名称">
              </el-table-column>
              <el-table-column
                prop="processVariables.userName"
                align="center"
                label="流程发起人">
              </el-table-column> 
              <el-table-column
                prop="startTime"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="创单时间">
                <template slot-scope="scope">
                  {{scope.row.startTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                label="当前环节">
              </el-table-column> 
              <el-table-column
                prop="excutionName"
                align="center"
                label="当前处理人">
              </el-table-column>
              <el-table-column
                prop="deleteReason"
                align="center"
                label="状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.endTime === undefined" type="primary">运行中</el-tag>
                  <el-tag v-else-if="scope.row.deleteReason === undefined" type="success">正常结束</el-tag>
                  <el-tag v-else-if="scope.row.deleteReason === '用户撤销'" type="danger">用户撤销</el-tag>
                  <div v-else><el-tag type="danger">流程作废 </el-tag> <span v-if="scope.row.deleteReason">原因: {{scope.row.deleteReason}}</span></div>
                </template>
              </el-table-column>       
              <el-table-column
                  fixed="right"
                  header-align="center"
                  align="center"
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button  type="text" size="small"
                        @click="trace(scope.row)">流程图
                    </el-button>
                    <el-button  type="text" size="small"
                              @click="details(scope.row)">历史
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
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 查看进度 弹窗 -->
    <el-dialog
      title="查看进度"
      :close-on-click-modal="true"
      :visible.sync="visible"
      width="70%"
      height="600px">
      
        <flow-chart ref="preview" :processInstanceId="processInstanceId"></flow-chart>
      </el-dialog>
  </div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import pick from 'lodash.pick'
  import ResourceSelect from '@/components/resourceSelect'
  export default {
    data () {
      return {
        vars: [
          {
            'key': 'userName',
            'value': ''
          }
        ],
        searchForm: {
          beginDate: '',
          endDate: '',
          vars: {
            keys: '',
            values: ''
          },
          name: '',
          sex: '',
          inDate: ''
        },
        searchDates: '',
        tabName: 'todo',
        tabData: {
          todoList: [],
          partInList: [],
          allList: []
        },
        visible: false,
        processInstanceId: '',
        dataList: [],
        dataList2: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: true,
        isCreateCollapse: false,
        loading: false,
        dataListTj: []
      }
    },
    components: {
      UserSelect,
      ResourceSelect
    },
    activated () {
      this.refreshList()
      this.refreshType()
      this.refreshSumList()
    },
    watch: {
      searchDates () {
        if (this.searchDates) {
          this.searchForm.beginDate = this.searchDates[0]
          this.searchForm.endDate = this.searchDates[1]
        } else {
          this.searchForm.beginDate = ''
          this.searchForm.endDate = ''
        }
      }
    },
    methods: {
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      // 获取工单类型列表
      refreshType () {
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
            this.dataList2 = data.page.list
            // this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 获取数据列表
      refreshList () {
        this.searchForm.vars.keys = ''
        this.searchForm.vars.values = ''
        this.searchForm.vars.types = ''
        for (let i = 0; i < this.vars.length; i++) {
          if (this.vars[i].value !== '') {
            this.searchForm.vars.keys += this.vars[i].key + ','
            this.searchForm.vars.values += this.vars[i].value + ','
            this.searchForm.vars.types += 'S' + ','
          }
        }
        if (this.searchForm.vars.keys.length > 1) {
          this.searchForm.vars.keys = this.searchForm.vars.keys.substring(0, this.searchForm.vars.keys.length - 1)
          this.searchForm.vars.values = this.searchForm.vars.values.substring(0, this.searchForm.vars.values.length - 1)
        }
        // this.resetSearch()
        if (this.tabName === 'todo') {
          this.refreshToDoList()
        } else if (this.tabName === 'partin') {
          this.refreshPartList()
        } else {
          this.refreshAllList()
        }
      },
      refreshSumList () {
        this.dataListTj = [{'name': '今日新增', 'num': this.random(0, 8), 'color': '#3883F8', 'icon': 'el-icon-circle-plus-outline'},
        {'name': '本周待处理', 'num': this.random(0, 8), 'color': '#FFCD3D', 'icon': 'el-icon-time'},
        {'name': '本周逾期数', 'num': this.random(0, 8), 'color': '#FF4848', 'icon': 'fa fa-frown-o'},
        {'name': '工单解决率', 'num': (this.random(10, 80) + '%'), 'color': '#3CD768', 'icon': 'el-icon-circle-check'}]
      },
      // 切换tabs
      handleClick (tab, event) {
        console.log(tab.name)
        if (tab.name === 'todo') {
          this.refreshToDoList()
        } else if (tab.name === 'partin') {
          this.refreshPartList()
        } else {
          this.refreshAllList()
        }
      },
      // 代办工单列表
      refreshToDoList () {
        this.loading = true
        this.$http({
          url: '/wa/flowable/task/todo',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.todoList = data.page.list
            this.total = data.page.count
            console.log(data.page.list)
            this.loading = false
          }
        })
      },
      // 参与数据列表
      refreshPartList () {
        this.loading = true
        this.$http({
          url: '/wa/flowable/task/historic/',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.partInList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 所有工单列表
      refreshAllList () {
        this.loading = true
        this.$http({
          url: '/wa/flowable/task/query',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.allList = data.page.list
            this.total = data.page.count
            console.log(data.page.list)
            this.loading = false
          }
        })
      },
      start (row) {
        // 读取流程表单
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procDefId: row.id,
          status: 'start'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/wa/task/TaskForm',
              query: {procDefId: row.id, procDefKey: row.key, status: 'start', title: `发起流程【${row.name}】`, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: `${row.name}`}
            })
          }
        })
      },
      todo (row) {
        // 处理
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskId: row.task.id,
          taskName: row.task.name,
          taskDefKey: row.task.taskDefinitionKey,
          procInsId: row.task.processInstanceId,
          procDefId: row.task.processDefinitionId,
          status: row.status
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/wa/task/TaskForm',
              query: {formTitle: `${row.vars.title}`, title: `审批【${row.task.name || ''}】`, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      trace (row) {
        // 查看进度
        this.processInstanceId = row.processInstanceId || row.task.processInstanceId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.preview.init()
        })
      },
      claim (row) {
        // 签收任务
        this.$http.post('/flowable/task/claim', {taskId: row.task.id}).then(({data}) => {
          if (data.success) {
            // this.$message.success(data.msg)
            this.todo(row) // 签收后处理
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

      // 排序
      // sortChangeHandle (obj) {
      //   if (obj.order === 'ascending') {
      //     this.orderBy = obj.prop + ' asc'
      //   } else if (obj.order === 'descending') {
      //     this.orderBy = obj.prop + ' desc'
      //   } else {
      //     this.orderBy = ''
      //   }
      //   this.refreshList()
      // },
      // 新增
      add () {
        this.$refs.testDataMainFormForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.testDataMainFormForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.testDataMainFormForm.init('view', id)
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
          this.loading = true
          this.$http({
            url: '/test/onetomany/testDataMainForm/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
     // 查看历史
      detail (row) {
        console.log(row)
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.processInstanceId || row.proc.processInstanceId,
          procDefId: row.processDefinitionId || row.proc.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/wa/task/TaskFormDetail',
              query: {readOnly: true, title: row.vars.title, formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      details (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.processInstanceId,
          procDefId: row.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/wa/task/TaskFormDetail',
              query: {readOnly: true, title: row.processVariables.title, formTitle: row.processVariables.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/test/onetomany/testDataMainForm/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        // this.refreshList()
      }
    }
  }
</script>
<style>
  .gd-query-form {
    margin:10px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    padding: 25px 25px 0px;
  }
  #tabs .el-tabs__item {
    font-size: 18px;
  }
</style>