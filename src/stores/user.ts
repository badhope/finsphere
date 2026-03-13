/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'

import type { User, LoginRequest, RegisterRequest } from '@/types/user'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  clearAuth,
  isAuthenticated,
} from '@/utils/auth'
import { http } from '@/utils/http/client'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggingIn = ref(false)
  const loginError = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userRoles = computed(() => user.value?.roles.map(role => role.code) || [])
  const userPermissions = computed(
    () => user.value?.permissions.map(permission => permission.code) || []
  )

  // 初始化认证状态
  const initAuth = () => {
    const savedToken = getToken()
    const savedUser = getUserInfo<User>()

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    }
  }

  // 检查认证状态
  const checkAuthStatus = () => {
    if (isAuthenticated()) {
      initAuth()
    }
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    try {
      isLoggingIn.value = true
      loginError.value = null

      const response = await http.post('/auth/login', loginData)

      const { accessToken, refreshToken, user: userData } = response

      // 保存认证信息
      token.value = accessToken
      user.value = userData

      setToken(accessToken, loginData.rememberMe)
      setUserInfo(userData)

      // 如果有刷新令牌，也保存
      if (refreshToken) {
        // 这里可以单独处理刷新令牌
      }

      return response
    } catch (error: any) {
      loginError.value = error.message || '登录失败'
      throw error
    } finally {
      isLoggingIn.value = false
    }
  }

  // 注册
  const register = async (registerData: RegisterRequest) => {
    const response = await http.post('/auth/register', registerData)
    return response
  }

  // 登出
  const logout = async () => {
    try {
      // 调用登出API
      await http.post('/auth/logout')
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // 清除本地认证信息
      clearAuth()
      token.value = null
      user.value = null
      loginError.value = null
    }
  }

  // 刷新令牌
  const refreshToken = async () => {
    try {
      const response = await http.post('/auth/refresh')
      const { accessToken } = response

      token.value = accessToken
      setToken(accessToken)

      return accessToken
    } catch (error) {
      // 刷新失败，执行登出
      await logout()
      throw error
    }
  }

  // 更新用户信息
  const updateUserProfile = async (userData: Partial<User>) => {
    const response = await http.put('/user/profile', userData)
    user.value = { ...user.value, ...response } as User
    setUserInfo(user.value)
    return response
  }

  // 修改密码
  const changePassword = async (passwordData: { oldPassword: string; newPassword: string }) => {
    const response = await http.put('/user/password', passwordData)
    return response
  }

  // 检查权限
  const hasPermission = (permissionCode: string): boolean => {
    return userPermissions.value.includes(permissionCode)
  }

  // 检查角色
  const hasRole = (roleCode: string): boolean => {
    return userRoles.value.includes(roleCode)
  }

  // Actions
  return {
    // 状态
    user,
    token,
    isLoggingIn,
    loginError,

    // Getters
    isLoggedIn,
    userRoles,
    userPermissions,

    // 方法
    initAuth,
    checkAuthStatus,
    login,
    register,
    logout,
    refreshToken,
    updateUserProfile,
    changePassword,
    hasPermission,
    hasRole,
  }
})
