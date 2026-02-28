/**
 * 性能监控工具
 */

export function setupPerformanceMonitor() {
  if (!import.meta.env.PROD) {
    return
  }

  // 页面加载性能监控
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = perfData.loadEventEnd - perfData.fetchStart
      
      console.log(`📈 Page load time: ${loadTime}ms`)
      
      // 发送到监控服务（这里可以集成Sentry等）
      if (loadTime > 3000) {
        console.warn('⚠️ Page load time is too slow:', loadTime + 'ms')
      }
    }, 0)
  })

  // 首屏渲染时间监控
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`🎨 First paint: ${entry.startTime}ms`)
    }
  }).observe({ entryTypes: ['paint'] })

  // 资源加载监控
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if ((entry as PerformanceResourceTiming).duration > 1000) {
        console.warn('⚠️ Slow resource load:', entry.name, (entry as PerformanceResourceTiming).duration + 'ms')
      }
    }
  }).observe({ entryTypes: ['resource'] })
}