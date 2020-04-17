<template>
  <div>
    <el-dialog :title="title"
               :close-on-click-modal="false"
               :visible.sync="visible"
               width="30%">
      <el-form v-loading="loading"
               :class="method==='view'?'readonly':''"
               :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="19">
            <el-form-item>
              <el-upload class="upload-demo"
                         drag
                         :action="`${this.$http.BASE_URL}/cmdb/resource/import?classCode=${classCode}`"
                         name="file">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip"
                     style="margin-top: -10px">仅支持模板格式Excel表格上传，请勿上传其他文件。</div>
              </el-upload>
              <p><a :href="baseUrl+`/cmdb/resource/exportTemplate?classCode=${classCode}`">点击获取模板</a></p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary"
                   @click="subClick()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      baseUrl: this.$http.BASE_URL,
      classCodes: this.classCode,
      limit: 1,
      testDataMainFormTab: '0',
      fileArra: [],
      resourceArra: []
    }
  },
  props: {
    'classCode': {
      default () {
        return ''
      }
    }
  },
  components: {
  },
  methods: {
    init () {
      this.title = `批量上传`
      this.limit = 1
      this.fileArra = []
      this.resourceArra = []
      this.visible = true
      this.loading = false
    },
    subClick () {
      this.visible = false
    }
  }
}
</script>
