import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/user';

// 常规路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
  },
];

// 需要权限的路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '金融驾驶舱', icon: 'dashboard' },
      },
      {
        path: 'system',
        name: 'System',
        meta: { title: '系统管理', icon: 'setting' },
        children: [
          {
            path: 'user',
            name: 'UserManage',
            component: () => import('@/views/system/user.vue'),
            meta: { title: '用户管理' },
          }
        ]
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const token = userStore.token;

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

export default router;
