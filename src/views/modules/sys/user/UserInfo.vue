<template>
<el-tabs tab-position="left">
    <el-tab-pane label="基本信息">
      <h3 style="margin-left:40px">基本信息</h3>
      <el-form :model="generalForm" ref="generalForm" label-width="100px">
        <el-form-item label="姓名" :rules="[ { required: true, message: '必填项不能为空', trigger: 'blur' }]" prop="name">
          <el-input v-model="generalForm.name"></el-input>
        </el-form-item>
         <el-form-item label="签名" prop="sign">
          <el-input v-model="generalForm.sign"></el-input>
        </el-form-item>
         <el-form-item label="公司" prop="company.name">
          <el-input v-model="generalForm.company.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="office.name">
          <el-input v-model="generalForm.office.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="generalForm.remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGeneralForm()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="联系方式">
      <h3 style="margin-left:40px">联系方式</h3>
      <el-form :model="concatForm" ref="concatForm" label-width="100px">
        <el-form-item label="邮箱" :rules="[{type:'email', message:'请输入正确的邮箱地址', trigger:'blur'}]" prop="email">
          <el-input v-model="concatForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile" :rules="[{validator:validator.isMobile, trigger:'blur'}]">
          <el-input v-model="concatForm.mobile"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="phone" :rules="[{validator:validator.isPhone, trigger:'blur'}]">
          <el-input v-model="concatForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitConcatForm()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="我的头像">
      <h3 style="margin-left:40px">我的头像</h3>
      <el-upload
        class="avatar-uploader"
        :action="`${this.$http.BASE_URL}/sys/user/imageUpload`"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :headers="{token: $cookie.get('token')}"
        :before-upload="beforeAvatarUpload">
        <img v-if="photo" :src="photo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="修改密码">
      <h3 style="margin-left:40px">修改密码</h3>
      <el-form :model="pwdForm" ref="pwdForm" label-width="100px">
        <el-form-item label="旧密码" :rules="[ { required: true, message: '必填项不能为空', trigger: 'blur' }]" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword"></el-input>
        </el-form-item>
         <el-form-item label="新密码" :rules="[ { required: true, message: '必填项不能为空', trigger: 'blur' }]" prop="newPassword">
          <el-input v-model="pwdForm.newPassword"></el-input>
        </el-form-item>
         <el-form-item label="确认新密码" :rules="rule" prop="confirmNewPassword">
          <el-input v-model="pwdForm.confirmNewPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPwdForm()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="我的日志">
        <el-menu  default-active="1" mode="horizontal" @select="changeLog">
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">登陆日志</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>
            <span slot="title">访问日志</span>
          </el-menu-item>
        </el-menu>
        <el-table
          :data="dataList"
          border
          v-loading = "loading"
          class="table">
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label="操作菜单"> 
          </el-table-column>
           <el-table-column
            prop="createBy.company.name"
            header-align="center"
            align="center"
            label="公司">
          </el-table-column>
           <el-table-column
            prop="createBy.office.name"
            header-align="center"
            align="center"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="requestUri"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="URI">
          </el-table-column>
          <el-table-column
            prop="method"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="提交方式">
          </el-table-column>
           <el-table-column
            prop="remoteAddr"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="操作者IP">
          </el-table-column>
          <el-table-column
            prop="createDate"
            header-align="center"
            align="center"
            width="150"
            :show-overflow-tooltip="true"
            label="操作时间">
          </el-table-column> 
        </el-table>
       <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.pwdForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        id: '',
        type: '1',
        user: null,
        generalForm: {
          name: '',
          sign: '',
          company: {
            name: ''
          },
          office: {
            name: ''
          },
          remarks: ''
        },
        concatForm: {
          email: '',
          phone: '',
          mobile: ''
        },
        pwdForm: {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        photo: '',
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        rule: [{ required: true, message: '必填项不能为空', trigger: 'blur' }, {validator: validatePass2, trigger: 'blur'}]
      }
    },
    watch: {
      '$store.state.user.id': {
        handler (userId) {
          if (userId) {
            this.$http.get(`/sys/user/queryById?id=${userId}`).then(({data}) => {
              this.recover(this.generalForm, data.user)
              this.recover(this.concatForm, data.user)
              this.photo = data.user.photo
            })
            this.refreshList()
          }
        },
  
        immediate: true,
        deep: false
      }
    },
    methods: {
      submitGeneralForm () {
        this.$refs['generalForm'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$http({
              url: `/sys/user/saveInfo`,
              method: 'post',
              headers: {arrayFormat: 'repeat'},
              data: this.generalForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$store.commit('user/updateName', this.generalForm.name)
                this.$message.success(data.msg)
              }
              loading.close()
            })
          }
        })
      },
      submitConcatForm () {
        this.$refs['concatForm'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$http({
              url: `/sys/user/saveInfo`,
              method: 'post',
              headers: {arrayFormat: 'repeat'},
              data: this.concatForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)
              }
              loading.close()
            })
          }
        })
      },
      submitPwdForm () {
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$http({
              url: `/sys/user/savePwd`,
              method: 'post',
              headers: {arrayFormat: 'repeat'},
              data: this.pwdForm
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)
              }
              loading.close()
            })
          }
        })
      },
 // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: `/sys/log/data/mine?type=${this.type}`,
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      changeLog (index) {
        this.type = index
        this.refreshList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      handleAvatarSuccess (res, file) {
        this.photo = res.path
        this.$message.success(res.msg)
        this.$store.commit('user/updatePhoto', res.path)
      },

      beforeAvatarUpload (file) {
        const isJPG = file.type.indexOf('image/') >= 0
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!isJPG) {
          this.$message.error('上传头像只能是图片格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }
        return true
      }
    }
  }
</script>

