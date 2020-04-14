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
                  <el-form-item label="是否可用:"
                                prop="isDelete"
                                :rules="[
                               ]">
                    <p>{{ inputForm.isDelete }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="资产编号:"
                                prop="ZDZCBM"
                                :rules="[
                               ]">
                    <p>{{ inputForm.ZDZCBM }}</p>
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
                  <el-form-item label="使用民警:"
                                prop="symj"
                                :rules="[
                               ]">
                    <p>{{ inputForm.symj }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位:"
                                prop="wadw"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wadw }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="警号:"
                                prop="jinghao"
                                :rules="[
                              ]">
                    <p>{{ inputForm.jinghao }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途:"
                                prop="yongtu"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.yongtu }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目名称:"
                                prop="xmmc"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.xmmc }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用情况:"
                                prop="SYQK"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.SYQK }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="资产生命周期:"
                                prop="zcsmzq"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.zcsmzq }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密级:"
                                prop="serlevel"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.serlevel }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="生产时间:"
                                prop="scsj"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.scsj | timeFormat }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="配发时间:"
                                prop="pfsj"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.pfsj | timeFormat }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="IP地址:"
                                prop="ip"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.ip }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="网络:"
                                prop="wawl"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.wawl }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="品牌:"
                                prop="Ubrand"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.Ubrand }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统:"
                                prop="waczxt"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.waczxt }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="型号:"
                                prop="Model"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.waczxt }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注:"
                                prop="SBBZ"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.SBBZ }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="CPU型号:"
                                prop="cupModel"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.cupModel }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="内存信息:"
                                prop="NCXX"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.NCXX }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="内存总容量:"
                                prop="memoryCapacity"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.memoryCapacity }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最小有效MAC地址:"
                                prop="minMacAddr"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.minMacAddr }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="硬盘序列号:"
                                prop="ypxlh"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.ypxlh }}</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="硬盘容量:"
                                prop="YPRL"
                                :rules="[
                                    ]">
                    <p>{{ inputForm.YPRL }}</p>
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
                    <el-input size="small"
                              v-model="inputForm.name"
                              placeholder="请填写名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否可用:"
                                prop="isDelete"
                                :rules="[
                               ]">
                    <el-radio-group size="small"
                                    v-model="inputForm.isDelete">
                      <el-radio v-for="item in attrs.isDelete"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="资产编号:"
                                prop="ZDZCBM"
                                :rules="[
                               ]">
                    <el-input size="small"
                              v-model="inputForm.ZDZCBM"
                              placeholder="请填写资产编号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="序列号:"
                                prop="serialNumber"
                                :rules="[
                               ]">
                    <el-input size="small"
                              v-model="inputForm.serialNumber"
                              placeholder="请填写序列号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用民警:"
                                prop="symj"
                                :rules="[
                               ]">
                    <el-input size="small"
                              v-model="inputForm.symj"
                              placeholder="请填写使用民警"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位:"
                                prop="wadw"
                                :rules="[
                                    ]">
                    <el-select size="small"
                               v-model="inputForm.wadw"
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
                <el-col :span="8">
                  <el-form-item label="警号:"
                                prop="jinghao"
                                :rules="[
                              ]">
                    <el-input size="small"
                              v-model="inputForm.jinghao"
                              placeholder="请填写警号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途:"
                                prop="yongtu"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.yongtu"
                              placeholder="请填写用途"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目名称:"
                                prop="xmmc"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.xmmc"
                              placeholder="请填写项目名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用情况:"
                                prop="SYQK"
                                :rules="[
                                    ]">
                    <el-select size="small"
                               v-model="inputForm.SYQK"
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
                <el-col :span="8">
                  <el-form-item label="资产生命周期:"
                                prop="zcsmzq"
                                :rules="[
                                    ]">
                    <el-select size="small"
                               v-model="inputForm.zcsmzq"
                               placeholder="请选择资产生命周期"
                               clearable>
                      <el-option v-for="item in attrs.zcsmzq"
                                 :key="item.code"
                                 :label="item.name"
                                 :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密级:"
                                prop="serlevel"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.serlevel"
                              placeholder="请填写密级"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="生产时间:"
                                prop="scsj"
                                :rules="[
                                    ]">
                    <el-date-picker v-model="inputForm.scsj"
                                    type="datetime"
                                    placeholder="请填写生产时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="配发时间:"
                                prop="pfsj"
                                :rules="[
                                    ]">
                    <el-date-picker v-model="inputForm.pfsj"
                                    type="datetime"
                                    placeholder="请填写配发时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="IP地址:"
                                prop="ip"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.ip"
                              placeholder="请填写IP地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="网络:"
                                prop="wawl"
                                :rules="[
                                    ]">
                    <el-select size="small"
                               v-model="inputForm.wawl"
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
                <el-col :span="8">
                  <el-form-item label="品牌:"
                                prop="Ubrand"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.Ubrand"
                              placeholder="请填写品牌"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统:"
                                prop="waczxt"
                                :rules="[
                                    ]">
                    <el-select size="small"
                               v-model="inputForm.waczxt"
                               placeholder="请选择操作系统"
                               clearable>
                      <el-option v-for="item in attrs.waczxt"
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
                              v-model="inputForm.Model"
                              placeholder="请填写型号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注:"
                                prop="SBBZ"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.SBBZ"
                              placeholder="请填写备注"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="CPU型号:"
                                prop="cupModel"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.cupModel"
                              placeholder="请填写CPU型号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="内存信息:"
                                prop="NCXX"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.NCXX"
                              placeholder="请填写内存信息"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="内存总容量:"
                                prop="memoryCapacity"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.memoryCapacity"
                              placeholder="请填写内存总容量"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最小有效MAC地址:"
                                prop="minMacAddr"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.minMacAddr"
                              placeholder="请填写最小有效MAC地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="硬盘序列号:"
                                prop="ypxlh"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.ypxlh"
                              placeholder="请填写硬盘序列号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="硬盘容量:"
                                prop="YPRL"
                                :rules="[
                                    ]">
                    <el-input size="small"
                              v-model="inputForm.YPRL"
                              placeholder="请填写硬盘容量"></el-input>
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
            wasmzqzt: [],
            wadw: [],
            SYQK: [],
            zcsmzq: [],
            wawl: [],
            waczxt: [],
            isDelete: []
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
      this.inputForm.scsj = commom.formatTime(this.inputForm.scsj).replace(/^\s+|\s+$/g, '')
      this.inputForm.pfsj = commom.formatDate(this.inputForm.pfsj).replace(/^\s+|\s+$/g, '')
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