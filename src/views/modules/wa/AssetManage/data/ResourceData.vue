<template>
  <div>
    <el-row>
      <el-col :span="4"
              style="padding: 0px 10px">
        <el-tree class="filter-tree"
                 node-key="label"
                 :default-expanded-keys="expandedKeys"
                 :default-expand-all=true
                 :data="TreeData"
                 @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <!-- 服务器设备 -->
      <el-col :span="20"
              v-if="classCode === 'fwqzc'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="设备名称:"
                            prop="name">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="wassxitong"
                             header-align="center"
                             align="center"
                             :formatter="sysFormat"
                             show-overflow-tooltip
                             label="所属系统">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
      <!-- 存储设备 -->
      <el-col :span="20"
              v-if="classCode === 'ccsb'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="设备名称:"
                            prop="name">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="wassxitong"
                             header-align="center"
                             align="center"
                             :formatter="sysFormat"
                             show-overflow-tooltip
                             label="所属系统">
            </el-table-column>
            <el-table-column prop="wawlxtp"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="物理系统盘">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
      <!-- 路由器 -->
      <el-col :span="20"
              v-if="classCode === 'lyq'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="设备名称:"
                            prop="name">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号:"
                            prop="Model">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="Model"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备型号">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
      <!-- 交换机 -->
      <el-col :span="20"
              v-if="classCode === 'jhj'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="设备名称:"
                            prop="name">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号:"
                            prop="Model">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
      <!-- 安全设备 -->
      <el-col :span="20"
              v-if="classCode === 'swxwgl' | classCode=== 'fdq' |  classCode=== 'gzgm' | classCode=== 'blj' | classCode=== 'fhq' | classCode=== 'lljksjsb'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="设备名称:"
                            prop="name">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
      <!-- 云桌面终端 计算机终端 -->
      <el-col :span="20"
              v-if="classCode === 'yzmzd' | classCode === 'jsjzd'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="Model"
                            label="设备型号:">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="SYQK"
                            label="使用情况:">
                <el-select size="small"
                           v-model="searchForm.SYQK"
                           placeholder="请选择使用情况"
                           clearable>
                  <el-option v-for="item in attrs.SYQK"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="symj"
                            label="使用民警:">
                <el-input size="small"
                          v-model="searchForm.symj"
                          placeholder="请输入使用民警"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="网络:"
                            prop="wawl"
                            :rules="[
                                    ]">
                <el-select size="small"
                           v-model="searchForm.wawl"
                           placeholder="请选择网络"
                           clearable>
                  <el-option v-for="item in attrs.wawl"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="Model"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="型号">
            </el-table-column>
            <el-table-column prop="SYQK"
                             header-align="center"
                             align="center"
                             :formatter="happFomatter"
                             show-overflow-tooltip
                             label="使用情况">
            </el-table-column>
            <el-table-column prop="symj"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用民警">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="terminalTrace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <terminal-dialog ref="terminalDialog"
                         :attrs="attrs"
                         @refreshResouceList="refreshResouceList"></terminal-dialog>
      </el-col>
      <!-- 智能警务终端 -->
      <el-col :span="20"
              v-if="classCode === 'ZNJWZD'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="SYQK"
                            label="使用情况:">
                <el-select size="small"
                           v-model="searchForm.SYQK"
                           placeholder="请选择使用情况"
                           clearable>
                  <el-option v-for="item in attrs.SYQK"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="symj"
                            label="使用民警:">
                <el-input size="small"
                          v-model="searchForm.symj"
                          placeholder="请输入使用民警"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="网络:"
                            prop="wawl"
                            :rules="[
                                    ]">
                <el-select size="small"
                           v-model="searchForm.wawl"
                           placeholder="请选择网络"
                           clearable>
                  <el-option v-for="item in attrs.wawl"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="SYQK"
                             header-align="center"
                             align="center"
                             :formatter="happFomatter"
                             show-overflow-tooltip
                             label="使用情况">
            </el-table-column>
            <el-table-column prop="symj"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用民警">
            </el-table-column>
            <el-table-column prop="wawl"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="网络">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="terminalTrace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <terminal-dialog ref="terminalDialog"
                         :attrs="attrs"
                         @refreshResouceList="refreshResouceList"></terminal-dialog>
      </el-col>
      <!-- 显示器 -->
      <el-col :span="20"
              v-if="classCode === 'display'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号:"
                            prop="Model">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位:"
                            prop="wadw"
                            :rules="[
                                    ]">
                <el-select size="small"
                           v-model="searchForm.wadw"
                           placeholder="请选择单位"
                           clearable>
                  <el-option v-for="item in attrs.wadw"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="SYQK"
                            label="使用情况:">
                <el-select size="small"
                           v-model="searchForm.SYQK"
                           placeholder="请选择使用情况"
                           clearable>
                  <el-option v-for="item in attrs.SYQK"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="symj"
                            label="使用民警:">
                <el-input size="small"
                          v-model="searchForm.symj"
                          placeholder="请输入使用民警"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="SYQK"
                             header-align="center"
                             align="center"
                             :formatter="happFomatter"
                             show-overflow-tooltip
                             label="使用情况">
            </el-table-column>
            <el-table-column prop="symj"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用民警">
            </el-table-column>
            <el-table-column prop="wawl"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="网络">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="terminalTrace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <terminal-dialog ref="terminalDialog"
                         :attrs="attrs"
                         @refreshResouceList="refreshResouceList"></terminal-dialog>
      </el-col>
      <!-- 移动介质 -->
      <el-col :span="20"
              v-if="classCode === 'ydjz'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品牌:"
                            prop="Ubrand"
                            :rules="[
                                    ]">
                <el-input size="small"
                          v-model="searchForm.Ubrand"
                          placeholder="请填写品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号:"
                            prop="Model">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="symj"
                            label="使用民警:">
                <el-input size="small"
                          v-model="searchForm.symj"
                          placeholder="请输入使用民警"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位:"
                            prop="wadw"
                            :rules="[
                                    ]">
                <el-select size="small"
                           v-model="searchForm.wadw"
                           placeholder="请选择单位"
                           clearable>
                  <el-option v-for="item in attrs.wadw"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="Ubrand"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="品牌">
            </el-table-column>
            <el-table-column prop="symj"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用民警">
            </el-table-column>
            <el-table-column prop="wawl"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="网络">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="terminalTrace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <terminal-dialog ref="terminalDialog"
                         :attrs="attrs"
                         @refreshResouceList="refreshResouceList"></terminal-dialog>
      </el-col>
      <!-- 打印机 -->
      <el-col :span="20"
              v-if="classCode === 'dyj'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品牌:"
                            prop="Ubrand"
                            :rules="[
                                    ]">
                <el-input size="small"
                          v-model="searchForm.Ubrand"
                          placeholder="请填写品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号:"
                            prop="Model">
                <el-input size="small"
                          v-model="searchForm.Model"
                          placeholder="请输入设备型号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="symj"
                            label="使用民警:">
                <el-input size="small"
                          v-model="searchForm.symj"
                          placeholder="请输入使用民警"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="SYQK"
                            label="使用情况:">
                <el-select size="small"
                           v-model="searchForm.SYQK"
                           placeholder="请选择使用情况"
                           clearable>
                  <el-option v-for="item in attrs.SYQK"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位:"
                            prop="wadw"
                            :rules="[
                                    ]">
                <el-select size="small"
                           v-model="searchForm.wadw"
                           placeholder="请选择单位"
                           clearable>
                  <el-option v-for="item in attrs.wadw"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="Ubrand"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="品牌">
            </el-table-column>
            <el-table-column prop="symj"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用民警">
            </el-table-column>
            <el-table-column prop="SYQK"
                             header-align="center"
                             align="center"
                             :formatter="happFomatter"
                             show-overflow-tooltip
                             label="使用情况">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="terminalTrace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <terminal-dialog ref="terminalDialog"
                         :attrs="attrs"
                         @refreshResouceList="refreshResouceList"></terminal-dialog>
      </el-col>

      <!-- 传输设备 -->
      <el-col :span="20"
              v-if="classCode === 'cssb'">
        <el-row>
          <el-form :inline="true"
                   ref="searchForm"
                   :model="searchForm"
                   label-width="100px"
                   lable-position="right"
                   @keyup.enter.native="refreshList()"
                   @submit.native.prevent>
            <el-col :span="6">
              <el-form-item prop="name"
                            label="设备名称:">
                <el-input size="small"
                          v-model="searchForm.name"
                          placeholder="请输入设备名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="ip"
                            label="ip地址:">
                <el-input size="small"
                          v-model="searchForm.ip"
                          placeholder="请输入iP地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="serialNumber"
                            label="序列号:">
                <el-input size="small"
                          v-model="searchForm.serialNumber"
                          placeholder="请输入序列号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasycs"
                            label="使用厂商:">
                <el-select size="small"
                           v-model="searchForm.wasycs"
                           placeholder="请选择使用厂商"
                           clearable>
                  <el-option v-for="item in attrs.companyAttrs"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wanf"
                            label="年份:">
                <el-select size="small"
                           v-model="searchForm.wanf"
                           placeholder="请选择年份"
                           clearable>
                  <el-option v-for="item in attrs.years"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="wasmzqzt"
                            label="生命周期状态:">
                <el-select size="small"
                           v-model="searchForm.wasmzqzt"
                           placeholder="请选择生命周期状态">
                  <el-option v-for="item in attrs.lifeCycleState"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="jfjggx"
                            label="机房位置:">
                <el-cascader size="small"
                             v-model="searchForm.jfjggx"
                             :options="attrs.roomAttrs"
                             :props="{ expandTrigger: 'hover' }"
                             clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-form-item style="float: right;margin: 5px 40px;">
              <el-button size="small">导出</el-button>
              <el-button size="small"
                         @click="resetForm()">重置</el-button>
              <el-button size="small"
                         type="primary"
                         @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table border
                    :data="resourceList"
                    style="width: 100%">
            <el-table-column prop="name"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="设备名称">
            </el-table-column>
            <el-table-column prop="ip"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="IP地址">
            </el-table-column>
            <el-table-column prop="serialNumber"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="序列号">
            </el-table-column>
            <el-table-column prop="wasycs"
                             header-align="center"
                             align="center"
                             show-overflow-tooltip
                             label="使用厂商">
            </el-table-column>
            <el-table-column prop="wasmzqzt"
                             header-align="center"
                             align="center"
                             :formatter="lifeStatuFormat"
                             show-overflow-tooltip
                             label="生命周期状态">
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="trace(scope.row)">查看</el-button>
                <!-- <el-button  type="text" size="small" @click="trace(scope.row)">编辑</el-button>
                <el-button  type="text" size="small" @click="trace(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageNo"
                         :page-sizes="[5, 10, 50, 100]"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
        <resources-dialog ref="resourcesDialog"
                          :attrs="attrs"
                          @refreshResouceList="refreshResouceList"></resources-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import commom from '@/utils/common'
import resourcesDialog from './ResourceDialog'
import terminalDialog from './TerminalDialog'
export default {
  data () {
    return {
      interval: 2000,
      isCollapse: true,
      classCode: '',
      resourceList: [],
      total: 0,
      pageSize: 10,
      pageNo: 1,
      deviceName: 'pc服务器',
      searchForm: {
        name: '',
        serialNumber: '',
        ip: '',
        wanf: '',
        wasycs: '',
        wasmzqzt: '',
        jfjggx: '',
        Model: '',
        SYQK: '',
        symj: '',
        wawl: ''
      },
      statu: '',
      TreeData: [
        {
          'label': '计算设备',
          'children': [
            {
              'label': '服务器设备',
              'code': 'fwqzc'
            },
            {
              'label': '存储设备',
              'code': 'ccsb'
            }
          ]
        },
        {
          'label': '网络设备',
          'children': [
            {
              'label': '路由器',
              'code': 'lyq'
            },
            {
              'label': '交换机',
              'code': 'jhj'
            }
          ]
        },
        {
          'label': '安全设备',
          'children': [
            {
              'label': '上网行为管理',
              'code': 'swxwgl'
            },
            {
              'label': '防毒墙',
              'code': 'fdq'
            },
            {
              'label': '光闸光码',
              'code': 'gzgm'
            },
            {
              'label': '堡垒机',
              'code': 'blj'
            },
            {
              'label': '防火墙',
              'code': 'fhq'
            },
            {
              'label': '流量监控审计设备',
              'code': 'lljksjsb'
            }
          ]
        },
        {
          'label': '终端设备',
          'children': [
            {
              'label': '云桌面终端',
              'code': 'yzmzd'
            },
            {
              'label': '计算机终端',
              'code': 'jsjzd'
            },
            {
              'label': '智能警务终端',
              'code': 'ZNJWZD'
            },
            {
              'label': '显示器',
              'code': 'display'
            },
            {
              'label': '移动介质',
              'code': 'ydjz'
            },
            {
              'label': '打印机',
              'code': 'dyj'
            }
          ]
        },
        {
          'label': '传输设备',
          'children': [
            {
              'label': '传输设备',
              'code': 'cssb'
            }
          ]
        }
      ],
      dataForm: {
        pageSize: 0,
        pageNum: 1,
        conditions: []
      },
      expandedKeys: [],
      // 计算设备 , '终端设备', '网络设备', '安全设备', '传输设备', '链路信息', '通信设备', '机房信息'
      initTreeFile: ['计算设备', '终端设备', '网络设备', '安全设备', '传输设备', '链路信息', '通信设备', '机房信息'],
      attrs: {
        lifeCycleState: [],
        companyAttrs: [],
        roomAttrs: [],
        years: [],
        devsource: [],
        wajf: [],
        wajg: [],
        waqsus: [],
        wazzus: [],
        wassxitong: [],
        wagnmk: [],
        wajrwl: [],
        wasblx: [],
        waczxtbb: [],
        wasbcs: [],
        wasmzqzt: [],
        wadw: [],
        SYQK: [],
        zcsmzq: [],
        wawl: [],
        waczxt: [],
        isDelete: []
      },
      row: {}
    }
  },
  components: {
    resourcesDialog,
    terminalDialog
  },
  activated () {
  },
  methods: {
    getAll () {
      // this.loading = true
      // this.$http({
      //   url: '/cmdb/categories/repoClassTree',
      //   methods: 'get'
      // }).then(({ data }) => {
      //   if (data && data.success) {
      //     let rt = data.data
      //     let children = []
      //     for (let item of rt) {
      //       children = []
      //       for (let i = 0; i < this.initTreeFile.length; i++) {
      //         if (this.initTreeFile[i] === item.name) {
      //           for (let temp of item.children) {
      //             children.push({ 'label': temp.name, 'code': temp.code })
      //           }
      //           this.TreeData.push({ 'label': item.name, 'children': children })
      //         }
      //       }
      //     }
      //     this.loading = false
      //   }
      this.expandedKeys = [this.TreeData[0].label]
      this.classCode = this.TreeData[0].children[0].code
      this.query(this.pageSize, this.pageNo, this.classCode)
      // })
    },
    query (pageSize, pageNo, classCode) {
      this.dataForm.pageSize = pageSize
      this.dataForm.pageNum = pageNo
      this.dataForm.conditions = [{
        'field': 'classCode',
        'value': classCode,
        'operator': 'EQ'
      }]
      if (!commom.isEmpty(this.searchForm.ip)) {
        this.dataForm.conditions.push({ 'field': 'ip', 'value': this.searchForm.ip, 'operator': 'LIKE' })
      }
      if (!commom.isEmpty(this.searchForm.name)) {
        this.dataForm.conditions.push({ 'field': 'name', 'value': this.searchForm.name, 'operator': 'LIKE' })
      }
      if (!commom.isEmpty(this.searchForm.wasmzqzt)) {
        this.dataForm.conditions.push({ 'field': 'wasmzqzt', 'value': this.searchForm.wasmzqzt, 'operator': 'LIKE' })
      }
      if (!commom.isEmpty(this.searchForm.jfjggx)) {
        console.log(this.searchForm.jfjggx)
        this.dataForm.conditions.push({ 'field': 'jfjggx', 'value': this.searchForm.jfjggx[0] + '/' + this.searchForm.jfjggx[1], 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.serialNumber)) {
        this.dataForm.conditions.push({ 'field': 'serialNumber', 'value': this.searchForm.serialNumber, 'operator': 'LIKE' })
      }
      if (!commom.isEmpty(this.searchForm.wanf)) {
        this.dataForm.conditions.push({ 'field': 'wanf', 'value': this.searchForm.wanf, 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.wasycs)) {
        this.dataForm.conditions.push({ 'field': 'wasycs', 'value': this.searchForm.wasycs, 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.Model)) {
        this.dataForm.conditions.push({ 'field': 'Model', 'value': this.searchForm.Model, 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.SYQK)) {
        this.dataForm.conditions.push({ 'field': 'SYQK', 'value': this.searchForm.SYQK, 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.wawl)) {
        this.dataForm.conditions.push({ 'field': 'wawl', 'value': this.searchForm.wawl, 'operator': 'EQ' })
      }
      if (!commom.isEmpty(this.searchForm.symj)) {
        this.dataForm.conditions.push({ 'field': 'symj', 'value': this.searchForm.symj, 'operator': 'LIKE' })
      }
      this.$http({
        url: `/cmdb/resources/query`,
        method: 'post',
        data: this.dataForm
      }).then(({ data }) => {
        if (data && data.success) {
          this.total = data.data.totalRecords
          this.resourceList = data.data.dataList
          this.classCode = classCode
        }
      })
    },
    refreshResouceList () {
      this.query(this.pageSize, this.pageNo, this.classCode)
    },
    filterNode (value, data) {
    },
    handleNodeClick (data) {
      let classCode = data.code
      if (!commom.isEmpty(classCode)) {
        this.query(this.pageSize, this.pageNo, classCode)
        this.deviceName = data.name
      }
    },
    onSubmit () {
      this.query(this.pageSize, this.pageNo, this.classCode)
    },
    resetForm () {
      this.searchForm.ip = ''
      this.searchForm.name = ''
      this.searchForm.wasmzqzt = ''
      this.searchForm.jfjggx = ''
      this.searchForm.serialNumber = ''
      this.searchForm.wanf = ''
      this.searchForm.wasycs = ''
      this.$refs.searchForm.resetFields()
      this.refreshResouceList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshResouceList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNo, this.classCode)
      this.refreshResouceList()
    },
    trace (row) {
      this.$refs.resourcesDialog.init(row)
    },
    terminalTrace (row) {
      this.$refs.terminalDialog.init(row)
    },
    sysFormat (row, column) {
      let attr = this.attrs.wassxitong
      for (let item of attr) {
        if (item.code === row.wassxitong) {
          return item.name
        }
      }
    },
    lifeStatuFormat (row, column) {
      let attr = this.attrs.wasmzqzt
      for (let item of attr) {
        if (item.code === row.wasmzqzt) {
          return item.name
        }
      }
    },
    happFomatter (row, column) {
      let attr = this.attrs.SYQK
      for (let item of attr) {
        if (item.code === row.SYQK) {
          return item.name
        }
      }
    },
    getLifeCycle () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasmzqzt'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.lifeCycleState = data.data.params.options
        }
      })
    },
    getCompanyAttrs () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasycs'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.companyAttrs = data.data.params.options
        }
      })
    },
    getRoomAttrs () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'jfjggx'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          for (let opt of data.data.params.options) {
            let children = []
            for (let item of opt.children) {
              children.push({ 'label': item.name, 'value': item.code })
            }
            this.attrs.roomAttrs.push({ 'label': opt.name, 'value': opt.code, 'children': children })
          }
        }
      })
    },
    getYear () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wanf'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.years = data.data.params.options
        }
      })
    },
    getDevSource () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasbly'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.devsource = data.data.params.options
        }
      })
    },
    getwajf () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wajf'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wajf = data.data.params.options
        }
      })
    },
    getwajg () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wajg'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wajg = data.data.params.options
        }
      })
    },
    getwaqsus () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'waqsus'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.waqsus = data.data.params.options
        }
      })
    },
    getwazzus () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wazzus'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wazzus = data.data.params.options
        }
      })
    },
    getwassxitong () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wassxitong'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wassxitong = data.data.params.options
        }
      })
    },
    getwagnmk () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wagnmk'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wagnmk = data.data.params.options
        }
      })
    },
    getwajrwl () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wajrwl'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wajrwl = data.data.params.options
        }
      })
    },
    getwasblx () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasblx'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wasblx = data.data.params.options
        }
      })
    },
    getwaczxtbb () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'waczxtbb'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.waczxtbb = data.data.params.options
        }
      })
    },
    getwasbcs () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasbcs'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wasbcs = data.data.params.options
        }
      })
    },
    getwasmzqzt () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wasmzqzt'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wasmzqzt = data.data.params.options
        }
      })
    },
    getwadw () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wadw'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wadw = data.data.params.options
        }
      })
    },
    getSYQK () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'SYQK'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.SYQK = data.data.params.options
        }
      })
    },
    getzcsmzq () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'SYQK'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.zcsmzq = data.data.params.options
        }
      })
    },
    getwawl () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'wawl'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.wawl = data.data.params.options
        }
      })
    },
    getwaczxt () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'waczxt'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.waczxt = data.data.params.options
        }
      })
    },
    getisDelete () {
      this.$http({
        url: `/cmdb/attrs/get`,
        method: 'get',
        params: {
          'code': 'isDelete'
        }
      }).then(({ data }) => {
        if (data && data.success) {
          this.attrs.isDelete = data.data.params.options
        }
      })
    }
  },
  mounted () {
    this.getAll()
    this.getLifeCycle()
    this.getCompanyAttrs()
    this.getRoomAttrs()
    this.getYear()
    this.getDevSource()
    this.getwajf()
    this.getwajg()
    this.getwaqsus()
    this.getwazzus()
    this.getwassxitong()
    this.getwagnmk()
    this.getwajrwl()
    this.getwasblx()
    this.getwaczxtbb()
    this.getwasbcs()
    this.getwasmzqzt()
    this.getwadw()
    this.getSYQK()
    this.getzcsmzq()
    this.getwawl()
    this.getwaczxt()
    this.getisDelete()
  }
}
</script>
