<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover" style="margin:10px">
            <div slot="header" class="clearfix">
                <span>通知信息</span>
                <el-button type="primary" @click="showNoticeForm()" size="small" style="float: right">发布通知</el-button>
            </div>
            <el-row :gutter="12">
                <el-carousel height="100px" direction="vertical" :interval="interval">
                    <el-carousel-item v-for="data in dataList" :key="data.id">
                        <!-- <h3 class="medium">{{ data.name }}</h3> -->
                        <el-col :span="24">
                            <el-card class="box-card" style="margin-bottom:10px">
                                <div class="actCard">
                                    <el-button style="color:#409EFF;"  type="text" @click="start(data)">{{data.name}}</el-button>
                                </div>
                            </el-card>
                        </el-col>
                    </el-carousel-item>
                </el-carousel>
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
        interval: 2000,
        dataList: [
          {
            id: '1',
            name: '通知：xxx创建了工单给xxx'
          },
          {
            id: '2',
            name: '通知：yyy改派了工单给xxx'
          },
          {
            id: '3',
            name: '通知：mmm提交了工单给xxx'
          }
        ]
      }
    },
    components: {

    },
    methods: {
      showNoticeForm () {
        console.log('发布通告')
      }
    }
  }
</script>