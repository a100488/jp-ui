<template>
  <el-table-column :prop="prop" v-bind="$attrs">
    <template slot-scope="scope">
          <span @click.prevent="toggleHandle(scope.$index, scope.row)" :style="childStyles(scope.row)">
                <i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i> 
          </span>
          <span style="padding-left: 10px;">
            <slot :data="scope.row"  v-bind="scope">
                      {{ scope.row[prop] }}
            </slot>
          </span>
    </template>
    
  </el-table-column>
</template>

<script>
  import isArray from 'lodash/isArray'

  export default {
    name: 'table-tree-column',
    props: {
      prop: {
        type: String
      },
      treeKey: {
        type: String,
        default: 'id'
      },
      parentKey: {
        type: String,
        default: 'parentId'
      },
      levelKey: {
        type: String,
        default: '_level'
      },
      childKey: {
        type: String,
        default: 'childrens'
      }
    },
    methods: {
      childStyles (row) {
        let size = row.parentIds.split(',').length - 1
        return {'padding-left': (size > 0 ? size * 10 : 0) + 'px'}
      },
      iconClasses (row) {
        return [!row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom']
      },
      iconStyles (row) {
        return {'visibility': this.hasChild(row) ? 'visible' : 'hidden'}
      },
      hasChild (row) {
        return (isArray(row[this.childKey]) && row[this.childKey].length >= 1) || false
      },
      // 切换处理
      toggleHandle (index, row) {
        if (this.hasChild(row)) {
          let data = this.$parent.store.states.data.slice(0)
          data[index]._expanded = !data[index]._expanded
          if (data[index]._expanded) {
            data = data.splice(0, index + 1).concat(row[this.childKey]).concat(data)
          } else {
            data = this.removeChildNode(data, row[this.treeKey])
          }
          this.$parent.store.commit('setData', data)
          this.$nextTick(() => {
            this.$parent.doLayout()
          })
        }
      },
      // 移除子节点
      removeChildNode (data, parentId) {
        let parentIds = isArray(parentId) ? parentId : [parentId]
        if (parentId.length <= 0) {
          return data
        }
        let ids = []
        for (let i = 0; i < data.length; i++) {
          if (parentIds.indexOf(data[i][this.parentKey]) !== -1 && parentIds.indexOf(data[i][this.treeKey]) === -1) {
            ids.push(data.splice(i, 1)[0][this.treeKey])
            i--
          }
        }
        return this.removeChildNode(data, ids)
      }
    }
  }
</script>
