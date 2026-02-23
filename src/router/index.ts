import { createRouter, createWebHistory } from 'vue-router';
import { constantRoutes, asyncRoutes } from './routes';
import { getToken } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes],
});

// 简单的白名单逻辑
const whiteList = ['/login', '/register'];

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} | FinSphere Pro`;
  const hasToken = getToken();
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' }); // 已登录去登录页，重定向到首页
    } else {
      next(); // 放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next(); // 未登录但在白名单，放行
    } else {
      next(`/login?redirect=${to.path}`); // 其他拦截到登录页
    }
  }
});

export default router;
