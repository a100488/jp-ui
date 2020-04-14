<template>
<div>
      <el-button type="primary" @click="showResourceSelect" size="small">选择设备</el-button>
      <el-button type="primary" @click="showResourceUpload" size="small">批量上传</el-button>
      <el-button type="primary" @click="showResourceForm" size="small">添加设备</el-button>
      <el-table
      border
      size="medium"
      :data="selectData"
      style="width: 100%">
      <el-table-column
        prop="className"
        align="center"
        label="设备类型">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="wasycs"
        align="center"
        label="使用厂商">
      </el-table-column>
      <el-table-column
        prop="wajg"
        align="center"
        label="机柜位置">
      </el-table-column>
      <el-table-column
        prop="cameraState"
        header-align="center"
        align="center"
        
        label="设备状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cameraState === 'using'" size="small" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.cameraState === '0'" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small" type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        show-overflow-tooltip
        width="80"
        label="">
        <template  slot-scope="scope">
          <el-button type="text"  icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        <!-- <el-button type="default" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
      </el-table-column>
    </el-table>
    <!-- </el-input> -->
    <user-select ref="userSelect" @doSubmit="selectUsersToInput" :limit="limit" :selectData="selectData"></user-select>
    <resource-form  ref="resourceForm" @doSubmit="selectUsersToInput"></resource-form>
    <resource-upload  ref="resourceUpload" @doSubmit="selectUsersToInput"></resource-upload>
</div>
</template>
<script>
import userSelect from './UserSelectDialog'
import resourceForm from './ResourceForm'
import resourceUpload from './ResourceUpload'
export default {
  data () {
    return {
      name: '',
      selectData: this.value
    }
  },
  props: {
    limit: Number,
    value: Array,
    size: String,
    tableData: Array,
    readonly: {
      type: Boolean,
      default: () => { return false }
    },
    disabled: {
      type: Boolean,
      default: () => { return false }
    }
  },
  components: {
    userSelect,
    resourceForm,
    resourceUpload
  },
  created () {
    console.log(this.value)
  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = newVal
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    selectUsersToInput (dataList) {
      console.log(dataList)
      this.selectData = dataList
      this.$emit('getValue', this.selectData, this.name)
    },
    showResourceSelect () {
      this.$refs.userSelect.init()
    },
    showResourceForm () {
      this.$refs.resourceForm.init('view', '')
    },
    showResourceUpload () {
      this.$refs.resourceUpload.init()
    },
    handleDelete (index, row) {
      console.log(index, row)
      this.selectData.splice(index, 1)
      console.log(this.selectData)
    }
  }
}
</script>
<style>
  .el-form-item__content .el-input-group {
      vertical-align: middle;
  }
 .el-tag + .el-tag {
    margin-left: 5px;
    margin-bottom: 5px;
  }
</style>


