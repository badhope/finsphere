/**
 * 主题状态管理
 */
import { defineStore } from 'pinia'
import type { ThemeConfig } from '@/types/system'
import { localStore } from '@/utils/storage'

const THEME_KEY = 'theme_config'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const theme = ref<ThemeConfig>({
    mode: 'light',
    primaryColor: '#409eff',
    fontSize: 'medium',
    sidebarCollapsed: false,
    showBreadcrumb: true
  })

  const isDark = computed(() => theme.value.mode === 'dark')

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStore.get<ThemeConfig>(THEME_KEY)
    if (savedTheme) {
      theme.value = { ...theme.value, ...savedTheme }
    }
    
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    // 设置CSS变量
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', theme.value.primaryColor)
    
    // 设置暗色模式类
    if (theme.value.mode === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
    
    // 设置字体大小
    document.body.classList.remove('font-small', 'font-medium', 'font-large')
    document.body.classList.add(`font-${theme.value.fontSize}`)
  }

  // 更新主题
  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    theme.value = { ...theme.value, ...newTheme }
    localStore.set(THEME_KEY, theme.value)
    applyTheme()
  }

  // 切换主题模式
  const toggleThemeMode = () => {
    const newMode = theme.value.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newMode })
  }

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    updateTheme({ primaryColor: color })
  }

  // 设置字体大小
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    updateTheme({ fontSize: size })
  }

  // 切换侧边栏折叠状态
  const toggleSidebar = () => {
    updateTheme({ sidebarCollapsed: !theme.value.sidebarCollapsed })
  }

  // Actions
  return {
    // 状态
    theme,
    isDark,
    
    // 方法
    initTheme,
    updateTheme,
    toggleThemeMode,
    setPrimaryColor,
    setFontSize,
    toggleSidebar
  }
})