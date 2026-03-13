/**
 * 应用状态管理（包含主题管理）
 */
import { defineStore } from 'pinia'

import type { AppSettings, ThemeConfig } from '@/types/system'
import { localStore } from '@/utils/storage'

const SETTINGS_KEY = 'app_settings'

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    theme: {
      mode: 'light',
      primaryColor: '#409eff',
      fontSize: 'medium',
      sidebarCollapsed: false,
      showBreadcrumb: true,
    },
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'thousands',
    enableNotifications: true,
    autoRefreshInterval: 30000,
  })

  const isLoading = ref(false)

  const elementSize = computed(() =>
    settings.value.theme.fontSize === 'large'
      ? 'large'
      : settings.value.theme.fontSize === 'small'
        ? 'small'
        : 'default'
  )

  const isDark = computed(() => settings.value.theme.mode === 'dark')

  const initSettings = () => {
    const savedSettings = localStore.get<AppSettings>(SETTINGS_KEY)
    if (savedSettings) {
      settings.value = { ...settings.value, ...savedSettings }
    }
    applyTheme()
  }

  const applyTheme = () => {
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', settings.value.theme.primaryColor)

    if (settings.value.theme.mode === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    document.body.classList.remove('font-small', 'font-medium', 'font-large')
    document.body.classList.add(`font-${settings.value.theme.fontSize}`)
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    localStore.set(SETTINGS_KEY, settings.value)
    applyTheme()
  }

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    settings.value.theme = { ...settings.value.theme, ...theme }
    localStore.set(SETTINGS_KEY, settings.value)
    applyTheme()
  }

  const toggleThemeMode = () => {
    const newMode = settings.value.theme.mode === 'light' ? 'dark' : 'light'
    updateTheme({ mode: newMode })
  }

  const setPrimaryColor = (color: string) => {
    updateTheme({ primaryColor: color })
  }

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    updateTheme({ fontSize: size })
  }

  const toggleSidebar = () => {
    updateTheme({ sidebarCollapsed: !settings.value.theme.sidebarCollapsed })
  }

  const resetSettings = () => {
    localStore.remove(SETTINGS_KEY)
    initSettings()
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    settings,
    isLoading,
    elementSize,
    isDark,

    initSettings,
    updateSettings,
    updateTheme,
    toggleThemeMode,
    setPrimaryColor,
    setFontSize,
    toggleSidebar,
    resetSettings,
    setLoading,
  }
})
