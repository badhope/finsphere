import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupRouter } from './router'
import { setupI18n } from './locales'
import { setupGlobalComponents } from './components'
import { setupDirectives } from './directives'
import { setupErrorHandler } from './utils/error-handler'
import { setupPerformanceMonitor } from './utils/performance-monitor'
import { setupMock } from './mock'

import App from './App.vue'

import './styles/index.scss'
import 'nprogress/nprogress.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  
  // 启用Mock数据（仅开发环境）
  if (import.meta.env.DEV) {
    setupMock()
  }
  
  // 注册Pinia
  app.use(pinia)
  
  // 设置国际化
  await setupI18n(app)
  
  // 设置路由
  await setupRouter(app)
  
  // 注册全局组件
  setupGlobalComponents(app)
  
  // 注册全局指令
  setupDirectives(app)
  
  // 设置错误处理
  setupErrorHandler(app)
  
  // 设置性能监控
  setupPerformanceMonitor()
  
  // 挂载应用
  app.mount('#app')
  
  // 设置全局属性
  window.__FINSPHERE__ = {
    version: __APP_VERSION__,
    buildTime: __BUILD_TIME__,
    env: import.meta.env.MODE
  }
  
  console.log(`🚀 FinSphere Pro v${__APP_VERSION__} started`)
  console.log(`🏗️ Build time: ${__BUILD_TIME__}`)
  console.log(`🔧 Environment: ${import.meta.env.MODE}`)
}

bootstrap().catch((error) => {
  console.error('Application bootstrap failed:', error)
})