<template>
  <div class="el-drawer"
       v-cloak>
    <el-drawer :visible.sync="drawer"
               :before-close="handleClose"
               size='60%'>
      <el-row>
        <div class="nav-bar">
          {{title}}
        </div>
        <el-row style="margin: 40px 15px 20px 10px;">
          <el-button size="small"
                     type="warning"
                     @click="editClick()">编辑</el-button>
          <el-button size="small"
                     type="danger">删除</el-button>
          <el-button size="small"
                     @click="closeClick()"
                     type="primary">关闭</el-button>
        </el-row>
        <el-form :model="inputForm"
                 ref="inputForm"
                 label-width="160px"
                 v-if="!isEdit">
          <!-- 基本信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>基本信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="名称:"
                                prop="name"
                                :rules="[
                               ]">
                    <p>{{ inputForm.name }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年份:"
                                prop="wanf"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wanf }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属项目:"
                                prop="wassxm"
                                :rules="[
                              ]">
                    <p>{{ inputForm.wassxm }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用厂商:"
                                prop="wasycs"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wasycs }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用厂商联系人及电话:"
                                prop="wasycslxrjdh"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wasycslxrjdh }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备类型:"
                                prop="wasblx"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wasblx }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备来源:"
                                prop="wasbly"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wasbly }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="合同编号:"
                                prop="wahtbh"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wahtbh }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="固定资产编号:"
                                prop="wagdzc"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wagdzc }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注:"
                                prop="wabz"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wabz }}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 设备信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>设备信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-col :span="8">
                <el-form-item label="设备厂商:"
                              prop="wasbcs"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wasbcs }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号:"
                              prop="Model"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.Model }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="序列号:"
                              prop="serialNumber"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.serialNumber }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="CPU型号:"
                              prop="wacpuxh"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wacpuxh }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="CPU核数型号:"
                              prop="wacpuhs"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wacpuhs }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="内存:"
                              prop="wanc"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wanc }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物理系统盘:"
                              prop="wawlxtp"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wawlxtp }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物理存储盘:"
                              prop="wawlccp"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wawlccp }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="可用存储:"
                              prop="wakycc"
                              :rules="[
                                    ]">
                  <p>{{ inputForm.wakycc }}</p>
                </el-form-item>
              </el-col>
            </div>
          </el-card>
          <!-- 配置信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>配置信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="IP地址:"
                                prop="ip"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.ip }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其他IP:"
                                prop="waqtip"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.waqtip }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户名:"
                                prop="wayhm"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wayhm }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密码:"
                                prop="wamm"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wamm }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属系统:"
                                prop="wassxitong"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wassxitong }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="功能模块:"
                                prop="wagnmk"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wagnmk }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色用途:"
                                prop="wajsyt"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wajsyt }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="接入网络:"
                                prop="wajrwl"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wajrwl }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统版本:"
                                prop="waczxtbb"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.waczxtbb }}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 位置信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>位置信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="机房机柜关系:"
                                prop="jfjggx"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.jfjggx | arrayFormat }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机房位置:"
                                prop="wajf"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wajf }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机柜位置:"
                                prop="wajg"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wajg }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="起始U位:"
                                prop="waqsus"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.waqsus }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="终止U位:"
                                prop="wazzus"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wazzus }}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 维保信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>维保信息</span>
              <i @click="waClick('wa')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':waIsActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="wa">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="生命周期状态:"
                                prop="wasmzqzt"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wasmzqzt }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="采购日期:"
                                prop="wacgrq"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wacgrq | timeFormat }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="维保结束时间:"
                                prop="maintenanceEndTime"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.maintenanceEndTime | dateFormat }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="负责民警:"
                                prop="wafzmj"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wafzmj }}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-form>

        <!-- 编辑 -->
        <el-form :model="inputForm"
                 ref="inputForm"
                 label-width="160px"
                 v-if="isEdit">

          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>基本信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="名称:"
                                prop="name"
                                :rules="[
                               ]">
                    <el-input size="small"
                              v-model="inputForm.name"
                              placeholder="请填写名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wanf"
                                label="年份:">
                    <el-select size="small"
                               v-model="inputForm.wanf"
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
                <el-col :span="8">
                  <el-form-item label="所属项目:"
                                prop="wassxm"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wassxm"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wasycs"
                                label="使用厂商:">
                    <el-select size="small"
                               v-model="inputForm.wasycs"
                               placeholder="请选择设备来源"
                               clearable>
                      <el-option v-for="item in attrs.companyAttrs"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用厂商联系人及电话:"
                                prop="wasycslxrjdh"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wasycslxrjdh"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wasblx"
                                label="设备类型:">
                    <el-select size="small"
                               v-model="inputForm.wasblx"
                               placeholder="请选择设备类型"
                               clearable>
                      <el-option v-for="item in attrs.wasblx"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wasbly"
                                label="设备来源:">
                    <el-select size="small"
                               v-model="inputForm.wasbly"
                               placeholder="请选择设备来源"
                               clearable>
                      <el-option v-for="item in attrs.devsource"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="合同编号:"
                                prop="wahtbh"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wahtbh"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="固定资产编号:"
                                prop="wagdzc"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wagdzc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注"
                                prop="wabz"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wabz"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 设备信息 -->

          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>设备信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item prop="wasbcs"
                                label="设备厂商:">
                    <el-select size="small"
                               v-model="inputForm.wasbcs"
                               placeholder="请选择设备厂商"
                               clearable>
                      <el-option v-for="item in attrs.wasbcs"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="型号:"
                                prop="Model"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.Model"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="序列号"
                                prop="serialNumber"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.serialNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="CPU型号"
                                prop="wacpuxh"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wacpuxh"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="CPU核数型号"
                                prop="wacpuhs"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wacpuhs"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="内存"
                                prop="wanc"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wanc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物理系统盘"
                                prop="wawlxtp"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wawlxtp"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="物理存储盘"
                                prop="wawlccp"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wawlccp"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="可用存储"
                                prop="wakycc"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wakycc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 配置信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>配置信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="IP地址:"
                                prop="ip"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.ip"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其他IP:"
                                prop="waqtip"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.waqtip"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户名:"
                                prop="wayhm"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wayhm"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密码:"
                                prop="wamm"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wamm"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wassxitong"
                                label="所属系统:">
                    <el-select size="small"
                               v-model="inputForm.wassxitong"
                               placeholder="请选择所属系统"
                               clearable>
                      <el-option v-for="item in attrs.wassxitong"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wagnmk"
                                label="功能模块:">
                    <el-select size="small"
                               v-model="inputForm.wagnmk"
                               placeholder="请选择功能模块"
                               clearable>
                      <el-option v-for="item in attrs.wagnmk"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="角色用途:"
                                prop="wajsyt"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wajsyt"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wajrwl"
                                label="接入网络:">
                    <el-select size="small"
                               v-model="inputForm.wajrwl"
                               placeholder="请选择接入网络"
                               clearable>
                      <el-option v-for="item in attrs.wajrwl"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="waczxtbb"
                                label="操作系统版本:">
                    <el-select size="small"
                               v-model="inputForm.waczxtbb"
                               placeholder="请选择操作系统版本"
                               clearable>
                      <el-option v-for="item in attrs.waczxtbb"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 位置信息 -->
          <el-card shadow="always"
                   style="margin: 10px;">
            <div slot="header"
                 class="clearfix">
              <span>位置信息</span>
              <i @click="actClick('tres')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':isActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="tres">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item prop="jfjggx"
                                label="机房机柜关系:">
                    <el-cascader size="small"
                                 v-model="inputForm.jfjggx"
                                 :options="attrs.roomAttrs"
                                 :props="{ expandTrigger: 'hover' }"
                                 clearable></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wajf"
                                label="机房位置:">
                    <el-select size="small"
                               v-model="inputForm.wajf"
                               placeholder="请选择机房位置"
                               clearable>
                      <el-option v-for="item in attrs.wajf"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wajg"
                                label="机柜位置:">
                    <el-select size="small"
                               v-model="inputForm.wajg"
                               placeholder="请选择机柜位置"
                               clearable>
                      <el-option v-for="item in attrs.wajg"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="waqsus"
                                label="起始U位:">
                    <el-select size="small"
                               v-model="inputForm.waqsus"
                               placeholder="请选择起始U位"
                               clearable>
                      <el-option v-for="item in attrs.waqsus"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="wazzus"
                                label="终止U位:">
                    <el-select size="small"
                               v-model="inputForm.wazzus"
                               placeholder="请选择终止U位"
                               clearable>
                      <el-option v-for="item in attrs.wazzus"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 维保信息 -->
          <el-card shadow="always"
                   style="margin-bottom:40px;">
            <div slot="header"
                 class="clearfix">
              <span>维保信息</span>
              <i @click="waClick('wa')"
                 class="el-collapse-item__arrow el-icon-arrow-right"
                 :class="{'is-active':waIsActive}"
                 style="float: right; padding: 3px 0"></i>
            </div>
            <div id="wa">
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item prop="wasmzqzt"
                                label="生命周期状态:">
                    <el-select size="small"
                               v-model="inputForm.wasmzqzt"
                               placeholder="请选择生命周期状态"
                               clearable>
                      <el-option v-for="item in attrs.lifeCycleState"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="采购日期"
                                prop="wacgrq"
                                :rules="[
                                    ]">
                    <el-date-picker v-model="inputForm.wacgrq"
                                    type="datetime"
                                    placeholder="选择采购日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="维保结束时间"
                                prop="maintenanceEndTime"
                                :rules="[
                                    ]">
                    <el-date-picker v-model="inputForm.maintenanceEndTime"
                                    size="small"
                                    type="datetime"
                                    placeholder="选择维保结束时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="负责民警:"
                                prop="wafzmj"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.wafzmj"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <div class="btnav">
            <el-button size="small"
                       @click="callClick()"
                       type="primary">确定</el-button>
            <el-button size="small"
                       @click="recallClick()">取消</el-button>
          </div>
        </el-form>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
import dictUtils from '@/utils/dictUtils.js'
import commom from '@/utils/common.js'

export default {
  data () {
    return {
      drawer: false,
      title: '',
      inputForm: {},
      classCode: '',
      modelData: [],
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      isActive: true,
      waIsActive: true,
      isEdit: false
    }
  },
  props: {
    'attrs': {
      default () {
        return {
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
            wasmzqzt: []
          }
        }
      }
    }
  },
  methods: {
    init (row) {
      console.log(row)
      this.drawer = true
      this.inputForm = row
      this.title = row.name
      this.classCode = row.classCode
    },
    wanf () {
      let wanf = dictUtils.getDictList('wanf')
      for (let item of wanf) {
        if (item.label === this.inputForm.wanf) {
          this.inputForm.wanf = item.value
        }
      }
    },
    handleClose () {
      this.drawer = false
      this.isActive = true
      this.isEdit = false
      this.inputForm = {}
    },
    actClick (val) {
      let dv = document.getElementById(val)
      if (dv.className === 'show') {
        dv.removeAttribute('class')
        this.isActive = true
      } else {
        dv.setAttribute('class', 'show')
        this.isActive = false
      }
    },
    waClick (val) {
      let dv = document.getElementById(val)
      if (dv.className === 'show') {
        dv.removeAttribute('class')
        this.waIsActive = true
      } else {
        dv.setAttribute('class', 'show')
        this.waIsActive = false
      }
    },
    load () { },
    editClick () {
      this.isEdit = true
    },
    recallClick () {
      this.isEdit = false
    },
    callClick () {
      this.inputForm.wacgrq = commom.formatTime(this.inputForm.wacgrq).replace(/^\s+|\s+$/g, '')
      this.inputForm.maintenanceEndTime = commom.formatDate(this.inputForm.maintenanceEndTime).replace(/^\s+|\s+$/g, '')
      console.log(this.inputForm.wacgrq)
      this.$axios({
        url: `/cmdb/resource/update`,
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(this.inputForm)
      }).then(({ data }) => {
        if (data && data.success) {
          this.$emit('refreshResouceList')
          this.drawer = false
          this.isActive = true
          this.isEdit = false
          this.inputForm = {}
        }
      })
    },
    closeClick () {
      this.drawer = false
      this.isActive = true
      this.isEdit = false
      this.inputForm = {}
    }
  },
  mounted () {
    this.wanf()
  },
  filters: {
    timeFormat (value) {
      if (!commom.isEmpty(value)) {
        return commom.formatTime(value)
      }
    },
    dateFormat (value) {
      if (!commom.isEmpty(value)) {
        return commom.formatDate(value)
      }
    },
    arrayFormat (value) {
      if (!commom.isEmpty(value)) {
        return value[0] + '/' + value[1]
      }
    }
  }
}
</script>
<style lang="scss">
.el-drawer.rtl {
  overflow: scroll;
  overflow-x: hidden;
}
.nav-bar {
  position: fixed;
  height: 60px;
  width: 60%;
  right: 0px;
  top: 0px;
  padding: 21px;
  z-index: 999;
  color: #fff;
  background: rgb(36, 88, 147);
}
.show {
  display: none;
}
p {
  padding: 0px;
  margin: 0px;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
}
.btnav {
  position: fixed;
  height: 60px;
  width: 60%;
  right: 0px;
  bottom: 0px;
  padding: 21px;
  z-index: 999;
  text-align: center;
  background: #fff;
  opacity: 0.9;
}
.btnav button {
  margin: -10px 30px;
}
.el-col {
  margin-bottom: -20px;
}
</style>