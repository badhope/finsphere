/**
 * 认证服务层
 * 用于处理认证相关的业务逻辑，避免 HTTP 层与 Store 层的循环依赖
 */

import { getToken, removeToken, setToken } from '@/utils/auth'
import { localStore } from '@/utils/storage'

const USER_INFO_KEY = 'user_info'

export const authService = {
  /**
   * 获取当前认证 token
   */
  getToken(): string | null {
    return getToken()
  },

  /**
   * 保存 token
   */
  saveToken(token: string, rememberMe = false): void {
    setToken(token, rememberMe)
  },

  /**
   * 清除 token
   */
  clearToken(): void {
    removeToken()
    localStore.remove(USER_INFO_KEY)
  },

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  /**
   * 获取用户信息
   */
  getUserInfo(): any {
    return localStore.get(USER_INFO_KEY)
  },

  /**
   * 保存用户信息
   */
  saveUserInfo(userInfo: any): void {
    localStore.set(USER_INFO_KEY, userInfo)
  },

  /**
   * 清除用户信息
   */
  clearUserInfo(): void {
    localStore.remove(USER_INFO_KEY)
  }
}
