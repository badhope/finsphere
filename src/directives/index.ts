/**
 * 全局指令注册
 */
import type { App, Directive, DirectiveBinding } from 'vue'

import { useUserStore } from '@/stores/user'

function checkPermission(value: string | string[]): boolean {
  const userStore = useUserStore()
  const permissions = userStore.userPermissions

  if (!value) return true

  if (Array.isArray(value)) {
    return value.some(v => permissions.includes(v))
  }

  return permissions.includes(value)
}

function checkRole(value: string | string[]): boolean {
  const userStore = useUserStore()
  const roles = userStore.userRoles

  if (!value) return true

  if (Array.isArray(value)) {
    return value.some(v => roles.includes(v))
  }

  return roles.includes(value)
}

const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding
    if (!checkPermission(value)) {
      el.style.display = 'none'
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding
    if (!checkPermission(value)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  },
}

const roleDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding
    if (!checkRole(value)) {
      el.style.display = 'none'
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding
    if (!checkRole(value)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  },
}

const debounceDirective: Directive<HTMLInputElement, () => void> = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding<() => void>) {
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return

    const callback = binding.value
    const delay = binding.arg ? parseInt(binding.arg, 10) : 300

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    el.addEventListener('input', () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        callback()
      }, delay)
    })
  },
}

const throttleDirective: Directive<HTMLInputElement, () => void> = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding<() => void>) {
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return

    const callback = binding.value
    const delay = binding.arg ? parseInt(binding.arg, 10) : 300

    let lastTime = 0

    el.addEventListener('input', () => {
      const now = Date.now()
      if (now - lastTime >= delay) {
        lastTime = now
        callback()
      }
    })
  },
}

const clickOutsideDirective: Directive<HTMLElement, () => void> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
    const callback = binding.value

    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        callback()
      }
    }

    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: HTMLElement) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
    }
  },
}

declare module '@vue/runtime-core' {
  interface HTMLElement {
    _clickOutsideHandler?: (event: MouseEvent) => void
  }
}

export function setupDirectives(app: App): void {
  app.directive('permission', permissionDirective)
  app.directive('role', roleDirective)
  app.directive('debounce', debounceDirective)
  app.directive('throttle', throttleDirective)
  app.directive('click-outside', clickOutsideDirective)
}
