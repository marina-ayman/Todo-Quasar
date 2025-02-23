import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(() => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    console.log(`navigate to: ${to.path}`)

    const token = localStorage.getItem('token') || ''

    const isAuthenticated = !!token

    if (to.meta.requiresAuth && !isAuthenticated && !to.path.includes('/dashboard')) {
      return next('/auth/login')
    }

    if (isAuthenticated && ['/auth/login', '/auth/reg'].includes(to.path)) {
      return next('/profile')
    }

    const adminToken = localStorage.getItem('adminToken') || ''
    const isAdminAuthenticated = !!adminToken
    // to.path.includes('/dashboard') ? '/dashboard/auth/login' :
    if (to.meta.requiresAuth && !isAdminAuthenticated && to.path.includes('/dashboard')) {
      return next('/dashboard/auth/login')
    }

    if (isAdminAuthenticated && to.path === '/dashboard/auth/login') {
      return next('/dashboard')
    }

    next()
  })

  return Router
})
