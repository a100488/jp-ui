<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover" style="margin:10px">
            <div slot="header" class="clearfix">
                <span>导入资产(请先下载对应资产模板)</span>
            </div>
            <el-row :gutter="5">
                <el-col :span="8">
                    <el-form>
                        <el-form-item label="设备类型" prop="classCode" style="margin-bottom: 17px"
                            :rules="[
                            {required: true, message:'设备类型不能为空', trigger:'blur'}
                            ]">
                            <el-select v-model="classCode" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <el-upload
                        class="upload-demo"
                        drag
                        :action="httpurl+'/wa/cmdb/generate?classCode='+classCode"
                        name="file"
                        :before-upload="beforeUpload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" style="margin-top: 5px">仅支持模板格式Excel表格上传，请勿上传其他文件。</div>
                    </el-upload>
                    <!-- <p><a :href="'http://192.168.3.244:8082/wa/cmdb/generate?classCode='+classCode">点击获取模板</a></p> -->
                </el-col>
            </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover" style="margin:10px">
            <div slot="header" class="clearfix">
                <span>下载对应资产模板</span>
            </div>
            <el-row :gutter="5">
                <el-col :span="4" v-for="data in options" :key="data.value">
                  <el-card class="box-card" style="margin-bottom:10px">
                      <div class="actCard" style="text-align: center">
                        <p>{{data.label}}模板   <a :href="httpurl+'/wa/cmdb/generate?classCode='+data.value">点击下载</a></p>
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
        interval: 2000,
        classCode: '',
        httpurl: this.$http.BASE_URL,
        options: [{
          value: 'cssb',
          label: '传输设备'
        }, {
          value: 'Firewall',
          label: '防火墙'
        }, {
          value: 'networkDevice',
          label: '网络设备资产'
        }, {
          value: 'servermanage',
          label: '服务器资产'
        }, {
          value: 'aqsb',
          label: '安全设备'
        }, {
          value: 'Switch',
          label: '交换机'
        }, {
          value: 'Router',
          label: '路由器'
        }]
      }
    },
    components: {

    },
    activated () {
      // this.showNoticeForm()
    },
    methods: {
      showNoticeForm () {
        console.log('发布通告')
      },
      beforeUpload: function (file) {
        if (this.inputForm.classCode === '') {
          this.$message.error('请选择设备类型')
          return false
        }
      }
    }
  }
</script>