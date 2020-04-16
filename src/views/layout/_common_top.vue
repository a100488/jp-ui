<template>
  <nav ref="navbar" style="background:#245893;display: flex;" :class="'jp-navbar  jp-navbar--' + navbarLayoutType " >
    <div class="jp-navbar__header">
      <!-- <h1 class="jp-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="jp-navbar__brand-lg" href="javascript:;">
          <img height="50px" src='../../assets/img/logo.png'/>
        </a>
        <a class="jp-navbar__brand-mini" href="javascript:;">
          <img :src="logo" height="40px" width="40px"/>
        </a>
      </h1> -->
      <h1 class="jp-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="jp-navbar__brand-lg" href="javascript:;"> <img src='../../assets/img/jh.png' height="40px" width="40px"/> 
        <!-- {{productName}} -->
        网安总队运维系统
        </a>
        <a class="jp-navbar__brand-mini" href="javascript:;">
          <img src='../../assets/img/jh.png' height="40px" width="40px"/>
        </a>
      </h1>
    </div>
    <!-- <div style="height: 60px;width: 58px;">
      <el-menu
        class="jp-navbar__menu"
        mode="horizontal">
        <el-menu-item class="jp-navbar__switch"  @click="sidebarFold = !sidebarFold">
          <i  :class="sidebarFold ? 'fa fa-reorder':'fa fa-long-arrow-left'"></i>
        </el-menu-item>
      </el-menu>
    </div> -->
    <!-- class="jp-navbar__body clearfix" -->
    <div  style="height: 60px;flex:1;text-align: left;">
      <h3 style="color: #fff"></h3>
    </div>
      <!-- <el-menu class="jp-navbar__menu" style="" :default-active="topMenuActiveIndex" ref="topMenu"  mode="horizontal"> -->
        <!-- <el-menu-item  class="el_menu_item" v-for="menu in topMenuList"
          :index="menu.id"
          :key="menu.id"
          @click="showLeftMenu(menu)"
          :ref="menu.id"
          :menu="menu">
           <i :class="`${menu.icon} jp-sidebar__menu-icon`" style="display: inline-block!important;"></i>
          {{menu.name}}
          </el-menu-item>

        <el-submenu index="2" v-if="topHideMenuList.length != 0">
          <template slot="title">更多</template>
          <el-menu-item  v-for="menu in topHideMenuList"
          :index="menu.id"
          :key="menu.id"
          :ref="menu.id"
          @click="showLeftMenu(menu)"
          :menu="menu">
           <i :class="`${menu.icon} jp-sidebar__menu-icon`" style="display: inline-block!important;"></i>
          {{menu.name}}
          </el-menu-item>
        </el-submenu> -->
        <!-- <h3>运维系统</h3> -->
      <!-- </el-menu> -->
    <div style="width: 160px;height: 60px;">
      <el-menu
        class="jp-navbar__menu jp-navbar__menu--right"
        mode="horizontal">
         <!-- <el-menu-item>
          <template slot="title">
                <color-picker></color-picker>
          </template>
        </el-menu-item> -->
        <el-menu-item>
          <template slot="title">
                <notice-icon
                    class="action notice"
                    :tabs="noticeTabs" >
              </notice-icon>
          </template>
        </el-menu-item>
        <el-menu-item class="jp-navbar__avatar">
          <el-dropdown :show-timeout="0" placement="bottom" style="height: 52px;">
            <span class="el-dropdown-link">
              <!-- <img :src="photo === ''?'/static/img/avatar.png':photo">{{ userName }} -->
              <img :src="'/static/img/avatar.png'">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <!-- <el-menu-item  @click="showRight">
          <template slot="title">
               <i class="el-icon-more rotate-90" @click="showRight"></i>
          </template>
        </el-menu-item> -->
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './UpdatePassword'
  import {clearLoginInfo} from '@/utils'
  import NoticeIcon from '@/components/NoticeIcon'
  import ColorPicker from '@/components/colors/ColorPicker'

  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        activeIndex: '',
        topMenuList: [],
        topHideMenuList: [],
        allMenuList: [],
        screenWidth: document.body.clientWidth,
        noticeTabs: [
          {
            title: '通知',
            count: 0,
            list: [
            ],
            emptyText: '你已查看所有通知',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
          },
          {
            title: '站内信',
            count: 0,
            list: [
            ],
            emptyText: '你已读完所有消息',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg'
          }
        ]
      }
    },
    components: {
      UpdatePassword,
      ColorPicker,
      NoticeIcon
    },
    computed: {
      navbarLayoutType () {
        return this.$store.state.common.navbarLayoutType
      },
      topMenuActiveIndex: {
        get () {
          return this.$store.state.common.topMenuActiveIndex
        },
        set (val) {
          this.$store.commit('common/updateTopMenuActiveIndex', val)
        }
      },
      sidebarFold: {
        get () {
          return this.$store.state.common.sidebarFold
        },
        set (val) {
          this.$store.commit('common/updateSidebarFold', val)
        }
      },
      mainTabs: {
        get () {
          return this.$store.state.common.mainTabs
        },
        set (val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      userName: {
        get () {
          return this.$store.state.user.name
        }
      },
      photo: {
        get () {
          return this.$store.state.user.photo
        }
      },
      logo () {
        return this.$store.state.config.logo
      },
      defaultTheme () {
        return this.$store.state.config.defaultTheme
      },
      productName () {
        return this.$store.state.config.productName
      },
      defaultLayout () {
        return this.$store.state.config.defaultLayout
      }
    },
    created () {
      this.allMenuList = JSON.parse(sessionStorage.getItem('allMenuList') || '[]')
      console.log(this.defaultLayout)
      // if (this.defaultLayout === 'top') {
      //   this.topMenuActiveIndex = this.allMenuList[0].id
      //   this.showLeftMenu(this.allMenuList[0])
      // } else {
      this.$store.commit('common/updateLeftMenuList', this.allMenuList)
      // }
      this.$http({
        url: '/notify/oaNotify/self/data?pageNo=1&pageSize=10&isSelf=true&readFlag=0',
        method: 'get'
      }).then(({data}) => {
        this.noticeTabs[0].count = data.page.count
        this.noticeTabs[0].url = '/notify/MyNotifyList'
        this.noticeTabs[0].list = data.page.list.map((item) => {
          return {
            id: item.id,
            avatar: item.createBy.photo,
            title: item.title,
            description: item.content,
            datetime: item.createDate,
            type: '通知'
          }
        })
      })
      this.$http({
        url: '/mailBox/list?pageNo=1&pageSize=10&mail.title=&readstatus=0',
        method: 'get'
      }).then(({data}) => {
        this.noticeTabs[1].count = data.page.count
        this.noticeTabs[1].url = '/mailbox/index'
        this.noticeTabs[1].list = data.page.list.map((item) => {
          return {
            id: item.id,
            avatar: item.sender.photo,
            title: item.mail.title,
            description: item.mail.content,
            datetime: item.sendtime,
            type: '站内信'
          }
        })
      })
    },
    mounted () {
      if (this.defaultLayout === 'top') {
        this.fixTopMenu()
      }
    },
    watch: {
      topMenuActiveIndex (val) {
        this.topMenuList.forEach((menu) => {
          if (menu.id === val) {
            this.showLeftMenu(menu)
          }
        })
        this.topHideMenuList.forEach((menu) => {
          if (menu.id === val) {
            this.showLeftMenu(menu)
          }
        })
      },
      defaultLayout (val) {
        // if (this.defaultLayout === 'top') {
        //   let needSetLeft = true
        //   this.allMenuList.forEach((item) => {
        //     if (item.id === this.topMenuActiveIndex) {
        //       this.showLeftMenu(item)
        //       needSetLeft = false
        //     }
        //   })
        //   if (needSetLeft) {
        //     this.topMenuActiveIndex = this.allMenuList[0].id
        //     this.showLeftMenu(this.allMenuList[0])
        //   }
        //   this.fixTopMenu()
        // } else {
        this.topMenuList = []
        this.topHideMenuList = []
        this.$store.commit('common/updateLeftMenuCategory', '')
        this.$store.commit('common/updateLeftMenuList', this.allMenuList)
        // }
      }
    },
    methods: {
      fixTopMenu () {
        let width = window.getComputedStyle(this.$refs.navbar).width
        let size = (parseInt(width) - 700) / 124
        this.topMenuList = []
        this.topHideMenuList = []
        this.allMenuList.forEach((item, index) => {
          if (index < size - 1) {
            this.topMenuList.push(item)
          } else {
            this.topHideMenuList.push(item)
          }
        })
      },
      showRight () {
        this.$emit('showRight', true)
      },
      showLeftMenu (menu) {
        this.$store.commit('common/updateLeftMenuList', menu.childNodes)
        this.$store.commit('common/updateLeftMenuCategory', menu.name)
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/sys/logout',
            method: 'get'
          }).then(({data}) => {
            if (data && data.success) {
              clearLoginInfo()
              this.$router.replace({name: 'login'})
            }
          })
        })
      }
    }
  }
</script>
