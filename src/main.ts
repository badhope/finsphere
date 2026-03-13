import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

import createI18n from '@/locales'
import './styles/index.scss'

function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  const i18n = createI18n()

  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)
  app.use(i18n)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')

  console.log('🚀 FinSphere Pro started')
}

bootstrap().catch(error => {
  console.error('Application bootstrap failed:', error)
})
