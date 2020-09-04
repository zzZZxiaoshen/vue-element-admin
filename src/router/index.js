import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)




/* eslint-disable */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]


export const asyncRoutes = [
  {
    path:'/book',
    component: Layout,
    redirect:'/book/list',
    name:'Book',
    meta:{
      title:'图书管理',
      icon: 'documentation',
    },
    children:[
      {
        path:'list',
        component: ()=>import('@/views/book/list'),
        name:"BookList",
        meta:{
          title:'图书列表',
          icon:'list',
          noCache:true
        }
      },
      {
        path: 'create',
        component:()=>import('@/views/book/create'),
        name: 'CreateBook',
        meta: {title: '添加图书',icon: 'create',noCache: true, roles: ['admin'] }
      },
      {
        path: 'edit/:fileName(\\w+)',
        component:()=>import('@/views/book/edit'),
        name: 'EditBook',
        meta: {title: '编辑图书',icon: 'edit',noCache: true, roles: ['admin'] },
        hidden: true
      }
    ]

  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
