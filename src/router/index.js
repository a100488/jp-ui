/**
 * 全站路由配置
 * 代码中路由统一使用path属性跳转
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import {isURL} from '@/utils/validate'
import {clearLoginInfo} from '@/utils'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
// 开发环境不使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)
// 全局路由
const globalRoutes = [
  {path: '/login', component: _import('modules/sys/login/login'), name: 'login', meta: {title: '登录'}}
]

// 主入口路由
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: {name: 'home'},
  meta: {title: '整体布局'},
  children: [
    {path: '/home', component: _import('modules/sys/dashboard/analysis/index'), name: 'home', meta: {title: '首页', backgroundType: '2'}},
    {path: '/form/generateList', component: _import('modules/form/GenerateList'), name: 'form-preview-list', meta: {title: '列表'}},
    {path: '/maintenanceManage/order', component: _import('modules/wa/maintenanceManage/maintenOrder/MaintenOrder'), name: 'order-manage-list', meta: {title: '运维工单'}},
    {path: '/maintenanceManage/overview', component: _import('modules/wa/maintenanceManage/overview/OverView'), name: 'order-manage-view', meta: {title: '工单总览'}},
    {path: '/wa/task/TaskForm', component: _import('modules/wa/maintenanceManage/maintenOrder/TaskForm'), name: 'task-form', meta: {title: '流程表单'}},
    {path: '/wa/task/TaskFormDetail', component: _import('modules/wa/maintenanceManage/maintenOrder/TaskFormDetail'), name: 'wa-form-detail', meta: {title: '流程表单详情'}},
    {path: '/maintenanceManage/report/order', component: _import('modules/wa/maintenanceManage/report/OrderReport'), name: 'order-report-order', meta: {title: '工单综合统计报表'}},
    {path: '/maintenanceManage/report/personal', component: _import('modules/wa/maintenanceManage/report/PersonalReport'), name: 'order-report-personal', meta: {title: '个人工单统计报表'}},

    {path: '/maintenanceManage/notice', component: _import('modules/wa/maintenanceManage/notice/Notice'), name: 'order-manage-notice', meta: {title: '通知公告'}},
    {path: '/assetManage/overview', component: _import('modules/wa/AssetManage/overview/OverView'), name: 'asset-manage-view', meta: {title: '资产总览'}},
    {path: '/assetManage/export', component: _import('modules/wa/AssetManage/export/ResourceExport'), name: 'asset-manage-export', meta: {title: '资产导入'}},
    {path: '/assetManage/data', component: _import('modules/wa/AssetManage/data/ResourceData'), name: 'asset-manage-data', meta: {title: '资产数据'}},
    {path: '/assetManage/report/resource', component: _import('modules/wa/AssetManage/report/ResourceReport'), name: 'asset-report-resource', meta: {title: '按资产种类统计'}},
    {path: '/assetManage/report/room', component: _import('modules/wa/AssetManage/report/RoomReport'), name: 'asset-report-room', meta: {title: '按机房统计'}},
    {path: '/assetManage/report/business', component: _import('modules/wa/AssetManage/report/BusinessReport'), name: 'asset-report-business', meta: {title: '按业务统计'}},

    {path: '/monitor/situation', component: _import('modules/wa/operationMonitoring/situation/Situation'), name: 'monitor-situation', meta: {title: '运行态势'}},
    {path: '/monitor/business', component: _import('modules/wa/operationMonitoring/business/Business'), name: 'monitor-business', meta: {title: '业务监控'}},
    {path: '/monitor/alert', component: _import('modules/wa/operationMonitoring/alert/Alert'), name: 'monitor-alert', meta: {title: '告警分析'}},
    {path: '/monitor/network', component: _import('modules/wa/operationMonitoring/network/NetWork'), name: 'monitor-network', meta: {title: '网络监测'}},
    {path: '/flowable/task/TaskForm', component: _import('modules/flowable/task/TaskForm'), name: 'wa-task-form', meta: {title: '流程表单'}},
    {path: '/flowable/task/TaskFormDetail', component: _import('modules/flowable/task/TaskFormDetail'), name: 'task-form-detail', meta: {title: '流程表单详情'}},
    {path: '/form/generateList', component: _import('modules/form/GenerateList'), name: 'form-preview-list', meta: {title: '列表'}},
    {path: '/404', component: _import('common/404'), name: '404', meta: {title: '404未找到'}}

  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({name: 'login'})
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: '/sys/user/getMenus',
      method: 'get'
    }).then(({data}) => {
      if (data && data.success) {
        fnAddDynamicMenuRoutes(data.routerList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('allMenuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        sessionStorage.setItem('dictList', JSON.stringify(data.dictList || '[]'))
        next({...to, replace: true})
      } else {
        sessionStorage.setItem('allMenuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        sessionStorage.setItem('dictList', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  let temp = []
  for (let i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].childNodes && globalRoutes[i].childNodes.length >= 1) {
      temp = temp.concat(globalRoutes[i].childNodes)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].childNodes && menuList[i].childNodes.length >= 1) {
      temp = temp.concat(menuList[i].childNodes)
    }

    if (menuList[i].href && /\S/.test(menuList[i].href)) {
      menuList[i].href = menuList[i].href.replace(/[/]$/, '')
      const route = {
        path: menuList[i].href.split('?')[0],
        component: null,
        name: menuList[i].href.replace(/^\//g, '').replace(/[/]/g, '-').replace(/[?]/g, '-').replace(/&/g, '-').replace(/=/g, '-'),
        meta: {
          parentIds: menuList[i].parentIds,
          menuId: menuList[i].id,
          title: menuList[i].name,
          isDynamic: true,
          type: menuList[i].target,
          backgroundType: menuList[i].backgroundType,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].href)) {
        route.path = '/' + route.path
        route.meta.iframeUrl = menuList[i].href
        route['meta']['type'] = 'iframe'
      } else if (menuList[i].target === 'iframe') {
        route['meta']['iframeUrl'] = `${process.env.VUE_APP_SERVER_URL}${menuList[i].href}`
      } else {
        try {
          route['component'] = _import(`modules${menuList[i].href.split('?')[0]}`) || null
        } catch (e) {
          console.log(e)
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {path: '*', redirect: {name: '404'}}
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || []))
  }
}

export default router
