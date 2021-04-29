import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '@/views/Home.vue';

// 布局组件
import Layout from '@/components/Layout.vue';

// 路由组件
//'@'表示'src'，默认导入目录下的index.vue文件，等价于./views/login/index.vue
import Login from '@/views/login';
import Home from '@/views/home/index.vue';
import Member from '@/views/member';
import Supplier from '@/views/supplier';
import Goods from '@/views/goods';
import Staff from '@/views/staff';

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  // }
  {
    // 登录页
    path: '/login',
    name: 'login', //路由名称
    component: Login //路由组件对象
  },
  {
    // 基础布局
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home', //重定向到子路由
    children: [
      {
        // 首页
        path: '/home',
        component: Home,
        meta: {title: '首页'}
      },
    ]
  },
  {
    // 非嵌套路由必须包含前导斜杠字符'/'
    // 会员管理
    path: '/member',
    component: Layout,
    children: [
      {
        path: '/',
        component: Member,
        meta: {title: '会员管理'}
      }
    ]
  },
  {
    // 供应商管理
    path: '/supplier',
    component: Layout,
    children: [
      {
        path: '/',
        component: Supplier,
        meta: {title: '供应商管理'}
      }
    ]
  },
  {
    // 商品管理
    path: '/goods',
    component: Layout,
    children: [
      {
        path: '/',
        component: Goods,
        meta: {title: '商品管理'}
      }
    ]
  },
  {
    // 员工管理
    path: '/staff',
    component: Layout,
    children: [
      {
        path: '/',
        component: Staff,
        meta: {title: '员工管理'}
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
