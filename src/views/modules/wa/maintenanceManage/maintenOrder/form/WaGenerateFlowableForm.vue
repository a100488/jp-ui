<template>
 <div>
    <!-- <fm-generate-form 
    v-loading="loading"
    v-if="visible"
          :data="options" 
          :edit="edit"
          :value = "formData"
          :remote-option="dynamicData"
          ref="generateForm"
        >
    </fm-generate-form> -->
    <fm-generate-form 
    v-loading="loading"
    v-if="visible"
          :data="options"
          :edit="edit"
          :remote-option="dynamicData"
          :value = "formData"
          ref="generateForm"
        >
    </fm-generate-form>
    <el-row type="flex"  justify="space-around">
      <el-col :span="18">
        <el-form v-if="resourceVisible" style="padding:15px">
          <el-form-item  prop="resource">
            <resource-select :limit='2' size="small" :value="resourceArra" @getValue='(value) => {resourceArra=value}'></resource-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import ResourceSelect from '@/components/resourceSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        resourceVisible: false,
        resourceEdit: false,
        loading: false,
        formData: {},
        gdbs: '',
        resourceArra: [],
        options: {'list': []},
        dynamicData: {
          sjjf: [
            {value: '机房1', label: '机房1'},
            {value: '机房2', label: '机房2'},
            {value: '机房3', label: '机房3'},
            {value: '机房4', label: '机房4'},
            {value: '电信武胜机房', label: '电信武胜机房'},
            {value: '电信民生机房', label: '电信民生机房'},
            {value: '电信横滨路机房', label: '电信横滨路机房'},
            {value: '电信四川北路机房', label: '电信四川北路机房'},
            {value: '移动民生机房', label: '移动民生机房'},
            {value: '移动钦州路机房', label: '移动钦州路机房'},
            {value: '移动迎春路机房', label: '移动迎春路机房'},
            {value: '联通周浦机房', label: '联通周浦机房'},
            {value: '联通金桥机房', label: '联通金桥机房'},
            {value: '联通新黄浦机房', label: '联通新黄浦机房'},
            {value: '联通西安路机房', label: '联通西安路机房'},
            {value: '联通江场路机房', label: '联通江场路机房'},
            {value: '联通包头路机房', label: '联通包头路机房'},
            {value: '宝信机房', label: '宝信机房'},
            {value: '99号4楼弱电间', label: '99号4楼弱电间'},
            {value: '99号5楼弱电间', label: '99号5楼弱电间'},
            {value: '99号7楼弱电间', label: '99号7楼弱电间'},
            {value: '99号8楼弱电间', label: '99号8楼弱电间'},
            {value: '30号5楼弱电间', label: '30号5楼弱电间'},
            {value: '30号6楼弱电间', label: '30号6楼弱电间'},
            {value: '30号7楼弱电间', label: '30号7楼弱电间'}
          ],
          xlps: [
            {value: '公安网', label: '公安网'},
            {value: '加密网', label: '加密网'},
            {value: '网安专网', label: '网安专网'},
            {value: '互联网', label: '互联网'},
            {value: '图像网', label: '图像网'},
            {value: '其他', label: '其他'}
          ]
        }
      }
    },
    props: {
      processDefinitionId: {
        type: String,
        required: true
      },
      taskFormData: {
        type: Array,
        required: false,
        default: []
      },
      edit: {
        type: Boolean,
        default: true
      }
    },
    components: {
      ResourceSelect
    },
    methods: {
      createForm (id) {
        if (id) {
          this.loading = true
          this.$http({
            url: `/extension/formDefinition/queryByJsonId?jsonId=${id}`,
            method: 'get'
          }).then(({data}) => {
            if (data.success) {
              this.options = JSON.parse(data.formDefinition.formDefinitionJson.json)
              console.log(this.options)
              this.loading = false
              this.visible = false
              setTimeout(() => {
                this.visible = true
                this.$nextTick(() => {
                  let disabledArra = []
                  let showArra = []
                  console.log(this.taskFormData)
                  this.taskFormData.forEach((item) => {
                    if (item.id === 'resource') {
                      this.resourceVisible = true
                      if (item.value !== undefined) {
                        this.resourceArra = JSON.parse(item.value)
                      } else {
                        this.resourceEdit = true
                      }
                    }
                    if (item.id === 'gdbs' && item.value === undefined) {
                      this.gdbs = this.get_uuid()
                    } else if (item.id === 'gdbs' && item.value !== undefined) {
                      this.gdbs = this.get_uuid()
                    }
                    this.formData[`${item.id}`] = (item.value === undefined ? '' : item.value)
                    // 多选框特殊处理
                    if (item.id === 'sjjf' || item.id === 'xlps' || item.id === 'wljr' || item.id === 'file') {
                      console.log(item.value)
                      this.formData[`${item.id}`] = item.value === undefined || item.value === '' ? [] : JSON.parse(item.value)
                    }
                    if (item.readable === true) {
                      showArra.push(`${item.id}`)
                    }
                    if (item.writable === false) {
                      disabledArra.push(`${item.id}`)
                    }
                  })
                  let hideArra = this.$refs.generateForm.getDataBindFields().filter((field) => {
                    if (!showArra.includes(field)) {
                      return true
                    }
                  })
                  this.$refs.generateForm.hide(hideArra)
                  this.$refs.generateForm.disabled(disabledArra, true)
                  // this.formData.wljr = ['其他']
                  console.log(this.formData)
                  this.$refs.generateForm.setData(this.formData)
                })
              }, 100)
            } else {
              this.loading = false
              this.visible = true
            }
          })
        } else {
          this.$message.info('没有关联流程表单!')
          this.visible = true
        }
      },
      S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      },
      get_uuid () {
        return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
      },
      submitStartFormData (vars, callback) {
        console.log(this.vars)
        this.$refs.generateForm.getData().then(data => {
          data.resource = JSON.stringify(this.resourceArra) // 赋值关联设备
          data.gdbs = this.gdbs
          this.loading = true
          this.$http({
            url: `/flowable/form/submitStartFormData`,
            method: 'post',
            data: {
              id: this.id,
              ...vars,
              processDefinitionId: this.processDefinitionId,
              data: JSON.stringify(data)
            }
          }).then(({data}) => {
            if (data && data.success) {
              this.visible = false
              this.loading = false
              this.$message.success(data.msg)
              callback(data)
            }
          })
        }).catch(e => {
        })
      },
      submitTaskFormData (vars, taskId, callback) {
        this.$refs.generateForm.getData().then(data => {
          data = {...vars, ...data}
          console.log(data)
          this.loading = true
          this.$http({
            url: `/wa/flowable/form/submitTaskFormData`,
            method: 'post',
            data: {
              id: this.id,
              taskId: taskId,
              data: JSON.stringify(data)
            }
          }).then(({data}) => {
            if (data && data.success) {
              this.visible = false
              this.loading = false
              this.$message.success(data.msg)
              callback(data)
            }
          })
        }).catch(e => {
        })
      }
    }
  }
</script>
<style>
  .check .el-checkbox {
    width: 120px;
  }
  .sbcrk .el-form-item--small .el-form-item__content, .sbcrk .el-form-item--small .el-form-item__label {
    font-size: 17px;
  }
  .sbcrk .el-checkbox__label {
    font-size: 16px;
  }
  .dhwb textarea, .sbcrk textarea {
    font-size: 16px;
    height: 60px;
    width: 400px;
  }
</style>