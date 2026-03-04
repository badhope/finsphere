import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import './styles/index.scss'

function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  
  // 注册Pinia
  app.use(pinia)
  
  // 挂载应用
  app.mount('#app')
  
  console.log('🚀 DATA started')
}

bootstrap().catch((error) => {
  console.error('Application bootstrap failed:', error)
})