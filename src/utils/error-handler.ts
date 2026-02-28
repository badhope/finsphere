/**
 * 错误处理工具
 */
import { App } from 'vue'
import { ElMessage } from 'element-plus'

export function setupErrorHandler(app: App) {
  // 全局错误处理
  app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err)
    console.error('Component:', instance)
    console.error('Info:', info)
    
    // 显示用户友好的错误信息
    ElMessage.error('系统发生错误，请稍后重试')
  }

  // 全局警告处理
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue warning:', msg)
    console.warn('Component:', instance)
    console.warn('Trace:', trace)
  }

  // Promise未捕获错误
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    ElMessage.error('操作失败，请稍后重试')
    event.preventDefault()
  })

  // JavaScript运行时错误
  window.addEventListener('error', event => {
    console.error('JavaScript error:', event.error)
    // 避免重复显示错误信息
    if (!event.filename.includes('node_modules')) {
      ElMessage.error('页面出现错误，请刷新重试')
    }
  })
}