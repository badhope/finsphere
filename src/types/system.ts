/**
 * 系统相关类型定义
 */

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  timestamp: number
}

export interface PaginationRequest {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    permissions?: string[]
  }
}

export interface RouteMeta {
  title: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  roles?: string[]
  permissions?: string[]
  breadcrumb?: boolean
}

export interface BreadcrumbItem {
  title: string
  path?: string
  disabled?: boolean
}

export interface Notification {
  id: string
  title: string
  content: string
  type: 'success' | 'warning' | 'error' | 'info'
  read: boolean
  createdAt: string
  relatedId?: string
  relatedType?: string
}

export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  sidebarCollapsed: boolean
  showBreadcrumb: boolean
}

export interface AppSettings {
  theme: ThemeConfig
  language: string
  timezone: string
  currency: string
  dateFormat: string
  numberFormat: 'thousands' | 'dots'
  enableNotifications: boolean
  autoRefreshInterval: number
}