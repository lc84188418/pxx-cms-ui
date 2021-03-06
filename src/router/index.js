import Vue from 'vue'
import Router from 'vue-router'

//通过vue.user(插件)来安装插件
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: 'index',
        meta: { title: '首页145', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'system',
    children: [
      {
        path: 'system/user',
        component: (resolve) => require(['@/views/system/user'], resolve),
        name: 'user',
        meta: { title: '用户管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/role',
        component: (resolve) => require(['@/views/system/role'], resolve),
        name: 'role',
        meta: { title: '角色管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/dept',
        component: (resolve) => require(['@/views/system/dept'], resolve),
        name: 'dept',
        meta: { title: '部门管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/post',
        component: (resolve) => require(['@/views/system/post'], resolve),
        name: 'post',
        meta: { title: '岗位管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/menu',
        component: (resolve) => require(['@/views/system/menu'], resolve),
        name: 'menu',
        meta: { title: '权限管理', icon: 'dashboard', affix: true }
      },
      
      {
        path: 'system/param',
        component: (resolve) => require(['@/views/system/param'], resolve),
        name: 'param',
        meta: { title: '参数配置', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/log/operate',
        component: (resolve) => require(['@/views/system/log/operate'], resolve),
        name: 'operate',
        meta: { title: '操作日志', icon: 'dashboard', affix: true }
      },
      {
        path: 'system/log/exception',
        component: (resolve) => require(['@/views/system/log/exception'], resolve),
        name: 'exception',
        meta: { title: '异常日志', icon: 'dashboard', affix: true }
      },
      {
        path: 'dictionary/xzqh/province',
        component: (resolve) => require(['@/views/dictionary/xzqh/province'], resolve),
        name: 'province',
        meta: { title: '省份管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'dictionary/xzqh/city',
        component: (resolve) => require(['@/views/dictionary/xzqh/city'], resolve),
        name: 'city',
        meta: { title: '城市管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'dictionary/xzqh/area',
        component: (resolve) => require(['@/views/dictionary/xzqh/area'], resolve),
        name: 'area',
        meta: { title: '区域管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'dictionary/xzqh/street',
        component: (resolve) => require(['@/views/dictionary/xzqh/street'], resolve),
        name: 'street',
        meta: { title: '街道管理', icon: 'dashboard', affix: true }
      },
      {
        path: 'dictionary/xzqh/county',
        component: (resolve) => require(['@/views/dictionary/xzqh/county'], resolve),
        name: 'county',
        meta: { title: '乡镇管理', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/register',
    component: (resolve) => require(['@/views/register'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: (resolve) => require(['@/views/system/user/authRole'], resolve),
        name: 'authRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: (resolve) => require(['@/views/system/role/authUser'], resolve),
        name: 'authUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'jobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'genEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#，他默认的是hash值，就带有#
  scrollBehavior: () => ({ y: 0 }),
  //配置路由和组件之间的映射关系
  routes: constantRoutes
})
