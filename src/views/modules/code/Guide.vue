<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in dataList" :key="item.id" style="padding-bottom:10px">
        <el-card class="box-card jp-card jp-card-bordered" shadow="hover" >
            <div class="">
                <div class="jp-card-cover1">
                    <i :class="item.icon" style="font-size: 64px;color:#409EFF;margin-right:20px"></i>
                    <font style="font-weight: 700"> {{item.name}}</font>
                </div>

                <div class="jp-card-body">
                    <div class="jp-card-meta">
                        <div class="jp-card-meta-detail">
                            <div class="jp-card-meta-description">{{item.remarks}}</div>
                        </div>
                    </div>
                </div>
                <ul class="jp-card-actions">
                    <li style="width: 100%">
                      <el-tooltip :content="item.tip" placement="top">
                          <router-link :to="item.path" :disabled="item.disabled">
                            <i class="fa fa-folder-open-o" :style="`${item.disabled?'color:grey':''}`"></i>
                          </router-link>
                      </el-tooltip>
                    </li>
                </ul>
            </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataList: [
          {
            name: '代码生成',
            tip: '打开代码生成器',
            remarks: '通过设置生成增删改查功能。',
            icon: 'fa fa-code',
            disabled: false,
            path: '/gen/GenTableList'
          },
          {
            name: '图表开发',
            tip: '即将上线，敬请期待',
            remarks: '快速可视化开发图表',
            icon: 'fa fa-area-chart',
            disabled: true,
            path: ''

          },
          {
            name: '报表开发',
            tip: '打开报表设计器',
            remarks: '通过设置快速开发报表。',
            icon: 'fa fa-file-excel-o',
            disabled: false,
            path: '/reports/index'

          },
          {
            name: '表单开发',
            tip: '打开表单设计器',
            remarks: '通过设置快速开发自定义表单。',
            icon: 'fa fa-wpforms',
            disabled: false,
            path: '/form/MakeFormList'
          },
          {
            name: '仪表盘开发',
            tip: '即将上线，敬请期待',
            remarks: '通过设置快速开发仪表盘。',
            icon: 'fa fa-dashboard',
            disabled: true,
            path: ''
          },
          {
            name: '数据管理',
            tip: '打开数据管理',
            remarks: '通过sql语句快速创建模型。',
            icon: 'fa fa-database',
            disabled: false,
            path: '/database/datamodel/DataSetList'
          }
        ]
      }
    },
    methods: {
      // 新增
      add () {
        this.$refs.templateForm.init('add', '')
      }
    }
  }
</script>
<style>

.jp-card {
    /* font-family: "Helvetica Neue", Helvetica, Tahoma, Arial, "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif; */
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0, 0, 0, .65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    background: #fff;
    border-radius: 2px;
    position: relative;
    -webkit-transition: all .3s;
    transition: all .3s
}
.jp-card .el-card__body {
   padding: 0px !important;
}
.jp-card-hoverable {
    cursor: pointer
}

.jp-card-hoverable:hover {
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    border-color: rgba(0, 0, 0, .09)
}

.jp-card-bordered.el-card {
    border: 1px solid #ccc
}

.jp-card-head {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    border-radius: 2px 2px 0 0;
    zoom: 1;
    margin-bottom: -1px;
    min-height: 48px
}

.jp-card-head:after, .jp-card-head:before {
    content: "";
    display: table
}

.jp-card-head:after {
    clear: both
}

.jp-card-head-wrapper {
    display: -ms-flexbox;
    display: flex
}

.jp-card-head-title {
    font-size: 16px;
    padding: 16px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: rgba(0, 0, 0, .85);
    font-weight: 500;
    display: inline-block;
    -ms-flex: 1 1;
    flex: 1 1
}

.jp-card-head .jp-tabs {
    margin-bottom: -17px;
    clear: both
}

.jp-card-head .jp-tabs-bar {
    border-bottom: 1px solid #e8e8e8
}

.jp-card-extra {
    float: right;
    padding: 17.5px 0;
    text-align: right;
    margin-left: auto
}

.jp-card-body {
    padding: 24px;
    zoom: 1
}

.jp-card-body:after, .jp-card-body:before {
    content: "";
    display: table
}

.jp-card-body:after {
    clear: both
}

.jp-card-contain-grid:not(.jp-card-loading) {
    margin: -1px 0 0 -1px;
    padding: 0
}

.jp-card-grid {
    border-radius: 0;
    border: 0;
    -webkit-box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8, 1px 0 0 0 #e8e8e8 inset, 0 1px 0 0 #e8e8e8 inset;
    box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8, inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
    width: 33.33%;
    float: left;
    padding: 24px;
    -webkit-transition: all .3s;
    transition: all .3s
}

.jp-card-grid:hover {
    position: relative;
    z-index: 1;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .15)
}

.jp-card-contain-tabs .jp-card-head-title {
    padding-bottom: 0;
    min-height: 32px
}

.jp-card-contain-tabs .jp-card-extra {
    padding-bottom: 0
}

.jp-card-cover > * {
    width: 100%;
    display: block
}
.jp-card-cover1{
  padding: 20px;
}

.jp-card-actions {
    border-top: 1px solid #e8e8e8;
    background: #f5f8fa;
    zoom: 1;
    list-style: none;
    margin: 0;
    padding: 0
}

.jp-card-actions:after, .jp-card-actions:before {
    content: "";
    display: table
}

.jp-card-actions:after {
    clear: both
}

.jp-card-actions > li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, .45)
}

.jp-card-actions > li > span {
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    line-height: 22px;
    min-width: 32px;
    position: relative
}

.jp-card-actions > li > span:hover {
    color: #1890ff;
    -webkit-transition: color .3s;
    transition: color .3s
}

.jp-card-actions > li > span > .jp-icon {
    font-size: 16px;
    line-height: 22px;
    display: block;
    width: 100%
}

.jp-card-actions > li > span a {
    color: rgba(0, 0, 0, .45);
    line-height: 22px;
    display: inline-block;
    width: 100%
}

.jp-card-actions > li > span a:hover {
    color: #1890ff
}

.jp-card-actions > li:not(:last-child) {
    border-right: 1px solid #e8e8e8
}

.jp-card-wider-padding .jp-card-head {
    padding: 0 32px
}

.jp-card-wider-padding .jp-card-body {
    padding: 24px 32px
}

.jp-card-padding-transition .jp-card-body, .jp-card-padding-transition .jp-card-head {
    -webkit-transition: padding .3s;
    transition: padding .3s
}

.jp-card-type-inner .jp-card-head {
    padding: 0 24px;
    background: #fafafa
}

.jp-card-type-inner .jp-card-head-title {
    padding: 12px 0;
    font-size: 14px
}

.jp-card-type-inner .jp-card-body {
    padding: 16px 24px
}

.jp-card-type-inner .jp-card-extra {
    padding: 13.5px 0
}

.jp-card-meta {
    margin: -4px 0;
    zoom: 1
}

.jp-card-meta:after, .jp-card-meta:before {
    content: "";
    display: table
}

.jp-card-meta:after {
    clear: both
}

.jp-card-meta-avatar {
    padding-right: 16px;
    float: left
}

.jp-card-meta-detail {
    overflow: hidden
}

.jp-card-meta-detail > div:not(:last-child) {
    margin-bottom: 8px
}

.jp-card-meta-title {
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: rgba(0, 0, 0, .85);
    font-weight: 500
}

.jp-card-meta-description {
    color: rgba(0, 0, 0, .45)
}

.jp-card-loading .jp-card-body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.jp-card-loading-content p {
    margin: 0
}

.jp-card-loading-block {
    height: 14px;
    margin: 4px 0;
    border-radius: 2px;
    background: -webkit-gradient(linear, left top, right top, from(rgba(207, 216, 220, .2)), color-stop(rgba(207, 216, 220, .4)), to(rgba(207, 216, 220, .2)));
    background: linear-gradient(90deg, rgba(207, 216, 220, .2), rgba(207, 216, 220, .4), rgba(207, 216, 220, .2));
    -webkit-animation: card-loading 1.4s ease infinite;
    animation: card-loading 1.4s ease infinite;
    background-size: 600% 600%
}
.jp-card{
    position: relative;
    float: left;
    width: 300px;
    border: 1px solid #ccc;
    margin: 20px 0 20px 20px;
}

</style>
