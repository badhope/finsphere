/**
 * 路由配置
 */
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      title: '注册',
      hidden: true,
    },
  },
  {
    path: '/content-intro',
    name: 'ContentIntro',
    component: () => import('@/views/content/ContentIntro.vue'),
    meta: {
      title: '产品介绍',
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面未找到',
      hidden: true,
    },
  },
]

// 动态路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'DashboardIndex',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: {
          title: '工作台',
          icon: 'Odometer',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/portfolio/list',
    meta: {
      title: '投资组合',
      icon: 'Collection',
    },
    children: [
      {
        path: 'list',
        name: 'PortfolioList',
        component: () => import('@/views/portfolio/List.vue'),
        meta: {
          title: '组合列表',
          icon: 'List',
        },
      },
      {
        path: 'detail/:id',
        name: 'PortfolioDetail',
        component: () => import('@/views/portfolio/Detail.vue'),
        meta: {
          title: '组合详情',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/market',
    name: 'Market',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/market/watchlist',
    meta: {
      title: '市场行情',
      icon: 'TrendCharts',
    },
    children: [
      {
        path: 'watchlist',
        name: 'Watchlist',
        component: () => import('@/views/market/Watchlist.vue'),
        meta: {
          title: '自选股',
          icon: 'Star',
        },
      },
      {
        path: 'analysis/:symbol',
        name: 'MarketAnalysis',
        component: () => import('@/views/market/Analysis.vue'),
        meta: {
          title: '行情分析',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/trade/history',
    meta: {
      title: '交易记录',
      icon: 'Document',
    },
    children: [
      {
        path: 'history',
        name: 'TradeHistory',
        component: () => import('@/views/trade/History.vue'),
        meta: {
          title: '交易历史',
          icon: 'Clock',
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/system/profile',
    meta: {
      title: '系统设置',
      icon: 'Setting',
      roles: ['admin'],
    },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/system/Profile.vue'),
        meta: {
          title: '个人资料',
          icon: 'User',
        },
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/Settings.vue'),
        meta: {
          title: '系统配置',
          icon: 'Tools',
          roles: ['admin'],
        },
      },
    ],
  },
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const appStore = useAppStore()

  document.title = to.meta.title
    ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
    : import.meta.env.VITE_APP_TITLE

  const whiteList = ['/login', '/register', '/404']

  if (whiteList.includes(to.path)) {
    NProgress.done()
    next()
    return
  }

  if (!userStore.token) {
    NProgress.done()
    next(`/login?redirect=${to.fullPath}`)
    return
  }

  if (to.meta.roles && to.meta.roles.length > 0) {
    const hasPermission = to.meta.roles.some((role: string) => userStore.userRoles.includes(role))

    if (!hasPermission) {
      NProgress.done()
      next('/404')
      return
    }
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
  appStore.setLoading(false)
})

export function resetRouter() {
  const routes = router.getRoutes()
  const extraRoutes = routes.filter(route => !constantRoutes.some(r => r.path === route.path))

  extraRoutes.forEach(route => {
    router.removeRoute(route.name)
  })
}

export default router
