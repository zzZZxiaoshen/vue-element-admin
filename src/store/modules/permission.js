import { asyncRoutes, constantRoutes } from '@/router'


function hasPermission(roles, route) {
  //检查路由是否包含meta和meta.role属性
  if (route.meta && route.meta.roles) {
    //判断route.meta.roles中是否包含角色roles中任何一个权限，如果包含则返回true
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果路由没有 meta 或 meta.roles 属性，则视为该路由不需要进行权限控制，所有用户对该路由都具有访问权限
    return true
  }
}


export function filterAsyncRoutes(routes, roles) {
  const res = []
  // 遍历全部路由
  routes.forEach(route => {
    // 对路由进行浅拷贝，注意 children 不会拷贝，因为不需要对 children 进行判断，所以可以使用浅拷贝
    const tmp = { ...route }
    //查看是否拥有权限如果拥有权限则 将路由添加到数组中形成动态路由
    if (hasPermission(roles, tmp)) {
      // 当路由具有访问权限时，判断路由是否具备 children 属性
      if (tmp.children) {
        //递归子路由
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 当路由具有访问权限时，将 tmp 保存到 res 中
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 将 routes 保存到 state 中的 addRoutes
    state.addRoutes = routes
    // 将 routes 集成到 src/router/index.js 的 constantRoutes 中
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
        // 如果角色中包含 admin，则直接跳过判断，直接将 asyncRoutes 全部返回
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果角色中没有包含 admin，则调用 filterAsyncRoutes 过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
