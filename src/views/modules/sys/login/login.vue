<template>

  <div class="login-container">
       <vue-particles
        color="#fff"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="4"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="lizi"
      >
      </vue-particles>
    <div class="login-weaper animated bounceInDown" style="z-index:100">
      <div class="login-left">

        <div class="login-time">
          {{time}}
        </div>
        <img class="img"
             :src="logo"
             alt="">
        <p class="title">{{productName}}</p>
      </div>
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
           用户登录
          </h4>
            <el-form ref="inputForm" :model="inputForm" :rules="rules" label-width="80px" @keyup.enter.native="login()" @submit.native.prevent>
              <el-form-item label="账号" prop="username">
                <el-input type="text" placeholder="请输入账号" v-model="inputForm.username"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="inputForm.password"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" class="login-submit" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        time: '',
        logo: '',
        productName: '',
        loading: false,
        inputForm: {
          username: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        rules: {
          username: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getTime()
      setInterval(() => {
        this.getTime()
      }, 1000)
    },
    mounted () {
      this.$http.get('/sys/sysConfig/queryById').then(({data}) => {
        this.logo = data.config.logo
        this.productName = data.config.productName
      })
    },
    methods: {
      // 提交表单
      login () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: '/sys/login',
              method: 'post',
              data: {
                'userName': this.inputForm.username,
                'password': this.inputForm.password
              }
            }).then(({data}) => {
              if (data && data.success) {
                this.$cookie.set('token', data.token)
                this.$cookie.set('refreshToken', data.refreshToken)
                this.$router.push({name: 'home'})
              } else {
                this.loading = false
                // this.getCaptcha()
              }
            })
          }
        })
      },
      getTime () {
        this.time = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      // 获取验证码
      getCaptcha () {
        this.captchaPath = this.$http.BASE_URL + `/captcha.jpg`
      }
    }
  }
</script>

<style lang="scss">
@import '~@/assets/scss/login.scss';

</style>