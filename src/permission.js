import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {

  //启动进度条
  NProgress.start()

  //修改页面标题
  document.title = getPageTitle(to.meta.title)

  //从cookie中获取token
  const hasToken = getToken()
  // 判断 Token 是否存在
  if (hasToken) {
    // 如果当前路径为 login 则直接重定向至首页
    if (to.path === '/login') {

      next({ path: '/' })
      NProgress.done()
    } else {
      //判断用户角色是否存在（路由与权限的关系 在路由中配置所需角色 ， 获取用户拥有的角色进行匹配）
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      //如果存在则直接访问
      if (hasRoles) {
        next()
      } else {
        try {
          // 异步获取用户角色
          const { roles } = await store.dispatch('user/getInfo')
          // 根据用户角色动态生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 调用 router.addRoutes 动态添加路由（动态路由）
          router.addRoutes(accessRoutes)
          // 使用 replace 访问路由，不会在 history 中留下记录
          next({ ...to, replace: true })
        } catch (error) {
          //出现异常移除token 数据
          await store.dispatch('user/resetToken')
          //显示错误提示
          Message.error(error || 'Has Error')
          //重定向至登录页面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //如果访问url在白名单中则直接访问
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
    // 如果访问的 URL 不在白名单中，则直接重定向到登录页面，并将访问的 URL 添加到 redirect 参数中
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 停止进度条
  NProgress.done()
})
