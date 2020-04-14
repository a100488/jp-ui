<template>
 <div>
        <fm-generate-form 
        v-loading="loading"
        v-if="visible"
              :data="options" 
              :edit="edit"
              :value = "formData"
              ref="generateForm"
            >
        </fm-generate-form>
        
        <!-- <el-form v-if="resourceVisible" style="padding:15px">
          <el-form-item  prop="resource">
            <resource-select :limit='2' size="small" :value="resourceArra" @getValue='(value) => {resourceArra=value}'></resource-select>
          </el-form-item>
        </el-form> -->
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
        resourceArra: [],
        options: {'list': [], 'config': {'labelWidth': 100, 'labelPosition': 'right', 'size': 'small', 'customClass': ''}}
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
                    this.formData[`${item.id}`] = (item.value === undefined ? (item.id === 'fileupload' ? [] : '') : (item.value === '[]' ? [] : item.value))
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
      submitStartFormData (vars, callback) {
        console.log(this.resourceArra)
        this.$refs.generateForm.getData().then(data => {
          data.resource = JSON.stringify(this.resourceArra)
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