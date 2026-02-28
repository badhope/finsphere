/**
 * 应用状态管理
 */
import { defineStore } from 'pinia'
import type { AppSettings, ThemeConfig } from '@/types/system'
import { localStore } from '@/utils/storage'

const SETTINGS_KEY = 'app_settings'

export const useAppStore = defineStore('app', () => {
  // 状态
  const settings = ref<AppSettings>({
    theme: {
      mode: 'light',
      primaryColor: '#409eff',
      fontSize: 'medium',
      sidebarCollapsed: false,
      showBreadcrumb: true
    },
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'thousands',
    enableNotifications: true,
    autoRefreshInterval: 30000
  })

  const isLoading = ref(false)
  const elementSize = computed(() => settings.value.theme.fontSize === 'large' ? 'large' : 
                                 settings.value.theme.fontSize === 'small' ? 'small' : 'default')

  // 初始化设置
  const initSettings = () => {
    const savedSettings = localStore.get<AppSettings>(SETTINGS_KEY)
    if (savedSettings) {
      settings.value = { ...settings.value, ...savedSettings }
    }
  }

  // 更新设置
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    localStore.set(SETTINGS_KEY, settings.value)
  }

  // 更新主题
  const updateTheme = (theme: Partial<ThemeConfig>) => {
    settings.value.theme = { ...settings.value.theme, ...theme }
    localStore.set(SETTINGS_KEY, settings.value)
  }

  // 切换主题模式
  const toggleThemeMode = () => {
    const newMode = settings.value.theme.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newMode })
  }

  // 重置设置
  const resetSettings = () => {
    localStore.remove(SETTINGS_KEY)
    initSettings()
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Actions
  return {
    // 状态
    settings,
    isLoading,
    elementSize,
    
    // 方法
    initSettings,
    updateSettings,
    updateTheme,
    toggleThemeMode,
    resetSettings,
    setLoading
  }
})