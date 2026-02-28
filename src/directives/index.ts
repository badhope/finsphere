/**
 * 全局指令注册
 */
import { App } from 'vue'

export function setupDirectives(app: App) {
  // 权限指令
  app.directive('permission', {
    mounted(el, binding) {
      const { value } = binding
      const userStore = useUserStore()
      
      if (value && !userStore.hasPermission(value)) {
        el.style.display = 'none'
      }
    },
    updated(el, binding) {
      const { value } = binding
      const userStore = useUserStore()
      
      if (value && !userStore.hasPermission(value)) {
        el.style.display = 'none'
      } else {
        el.style.display = ''
      }
    }
  })

  // 角色指令
  app.directive('role', {
    mounted(el, binding) {
      const { value } = binding
      const userStore = useUserStore()
      
      if (value && !userStore.hasRole(value)) {
        el.style.display = 'none'
      }
    }
  })

  // 防抖指令
  app.directive('debounce', {
    mounted(el, binding) {
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return
      
      const callback = binding.value
      const delay = binding.arg ? parseInt(binding.arg) : 300
      
      let timeoutId: number | null = null
      
      const debouncedHandler = () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = window.setTimeout(() => {
          callback(el.value)
        }, delay)
      }
      
      el.addEventListener('input', debouncedHandler)
      
      // 清理函数
      el._debounceCleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        el.removeEventListener('input', debouncedHandler)
      }
    },
    unmounted(el) {
      if (el._debounceCleanup) {
        el._debounceCleanup()
        delete el._debounceCleanup
      }
    }
  })

  // 拖拽指令
  app.directive('drag', {
    mounted(el) {
      let isDragging = false
      let startX = 0
      let startY = 0
      let initialX = 0
      let initialY = 0

      const dragStart = (e: MouseEvent) => {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        initialX = el.offsetLeft
        initialY = el.offsetTop
        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
      }

      const dragMove = (e: MouseEvent) => {
        if (!isDragging) return
        
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        
        el.style.left = initialX + dx + 'px'
        el.style.top = initialY + dy + 'px'
      }

      const dragEnd = () => {
        isDragging = false
        el.style.cursor = 'grab'
        el.style.userSelect = ''
      }

      el.style.cursor = 'grab'
      el.style.position = 'absolute'
      
      el.addEventListener('mousedown', dragStart)
      document.addEventListener('mousemove', dragMove)
      document.addEventListener('mouseup', dragEnd)
      
      // 清理函数
      el._dragCleanup = () => {
        el.removeEventListener('mousedown', dragStart)
        document.removeEventListener('mousemove', dragMove)
        document.removeEventListener('mouseup', dragEnd)
      }
    },
    unmounted(el) {
      if (el._dragCleanup) {
        el._dragCleanup()
        delete el._dragCleanup
      }
    }
  })
}