<template>
  <div>
    <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
        <fm-generate-form 
            v-if="visible"
              :edit="method !== 'view'"
              :data="options" 
              :value="initData" 
              :class="method==='view'?'readonly':''"
              ref="generateForm"
            >
        </fm-generate-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">关闭</el-button>
          <el-button type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
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
        beanId: '',
        visible: false,
        initData: {},
        dataBindFields: [],
        dataBindMap: new Map(),
        options: {list: []}
      }
    },
    created () {
      // this.createForm()
    },
    activated () {
      this.createForm()
    },
    components: {
    },
    methods: {
      init (method, formId, beanId) {
        this.method = method
        this.beanId = beanId
        this.initData = {}
        if (method === 'add') {
          this.title = `新建`
        } else if (method === 'edit') {
          this.title = '修改'
        } else if (method === 'view') {
          this.title = '查看'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.generateForm.reset()
          if (beanId) {
            this.loading = true
            this.$http({
              url: `/form/generate/queryById?formId=${formId}&id=${beanId}`,
              method: 'get'
            }).then(({data}) => {
              this.loading = false
              for (let key in data.obj) {
                if (this.dataBindMap.get(key) === 'checkbox' ||
                this.dataBindMap.get(key) === 'imgupload' ||
                this.dataBindMap.get(key) === 'table' ||
                this.dataBindMap.get(key) === 'fileupload') {
                  data.obj[key] = JSON.parse(data.obj[key])
                }
              }
              this.initData = data.obj
            })
          }
        })
      },
      generateModel (genList) {
        for (let i = 0; i < genList.length; i++) {
          if (genList[i].type === 'grid') {
            genList[i].columns.forEach(item => {
              this.generateModel(item.list)
            })
          } else if (genList[i].type === 'tabs') {
            genList[i].tabs.forEach(item => {
              this.generateModel(item.list)
            })
          } else {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (genList[i].options.dataBind) {
              this.dataBindFields.push({'model': genList[i].model, 'name': genList[i].name, 'type': genList[i].type})
              this.dataBindMap.set(genList[i].model, genList[i].type)
            }
          }
        }
        return this.dataBindFields
      },
      createForm () {
        this.$http({
          url: `/form/make/queryById?id=${this.$route.query.id}`,
          method: 'get'
        }).then(({data}) => {
          this.options = JSON.parse(data.form.source)
          this.dataBindMap.clear()
          this.dataBindFields = []
          this.generateModel(this.options.list)
        })
      },

      // 表单提交
      doSubmit () {
        this.$refs.generateForm.getData().then(data => {
          if (this.beanId) {
            data.id = this.beanId
          }
          this.$http({
            url: `/form/generate/save`,
            method: 'post',
            data: {formId: this.$route.query.id, data: JSON.stringify(data), fields: JSON.stringify(this.dataBindFields)}
          }).then(({data}) => {
            if (data && data.success) {
              this.visible = false
              this.$message.success(data.msg)
              this.$emit('refreshDataList')
            }
          })
        }).catch(e => {
        })
      }
    }
  }
</script>