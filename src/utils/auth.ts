/**
 * 认证相关工具函数
 */

import { localStore, sessionStore } from '@/utils/storage'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

/**
 * 获取访问令牌
 */
export function getToken(): string | null {
  // 优先从sessionStorage获取（更安全）
  return sessionStore.get<string>(TOKEN_KEY) || localStore.get<string>(TOKEN_KEY)
}

/**
 * 设置访问令牌
 */
export function setToken(token: string, rememberMe: boolean = false): void {
  if (rememberMe) {
    // 记住我时存储到localStorage
    localStore.set(TOKEN_KEY, token, { encrypt: true, expire: 7 * 24 * 60 * 60 * 1000 }) // 7天过期
  } else {
    // 否则存储到sessionStorage
    sessionStore.set(TOKEN_KEY, token, { encrypt: true })
  }
}

/**
 * 移除访问令牌
 */
export function removeToken(): void {
  localStore.remove(TOKEN_KEY)
  sessionStore.remove(TOKEN_KEY)
}

/**
 * 获取刷新令牌
 */
export function getRefreshToken(): string | null {
  return localStore.get<string>(REFRESH_TOKEN_KEY)
}

/**
 * 设置刷新令牌
 */
export function setRefreshToken(token: string): void {
  localStore.set(REFRESH_TOKEN_KEY, token, { encrypt: true, expire: 30 * 24 * 60 * 60 * 1000 }) // 30天过期
}

/**
 * 移除刷新令牌
 */
export function removeRefreshToken(): void {
  localStore.remove(REFRESH_TOKEN_KEY)
}

/**
 * 获取用户信息
 */
export function getUserInfo<T = any>(): T | null {
  return localStore.get<T>(USER_INFO_KEY)
}

/**
 * 设置用户信息
 */
export function setUserInfo(userInfo: any): void {
  localStore.set(USER_INFO_KEY, userInfo, { encrypt: true, expire: 24 * 60 * 60 * 1000 }) // 1天过期
}

/**
 * 移除用户信息
 */
export function removeUserInfo(): void {
  localStore.remove(USER_INFO_KEY)
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  removeToken()
  removeRefreshToken()
  removeUserInfo()
}

/**
 * 检查是否已认证
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * 检查令牌是否即将过期
 */
export function isTokenExpiringSoon(expiresIn: number = 300): boolean {
  // 这里可以根据实际的token结构来判断
  // 简单实现：假设token是JWT格式
  const token = getToken()
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp
    if (!exp) return false
    
    const now = Math.floor(Date.now() / 1000)
    return exp - now < expiresIn
  } catch {
    return false
  }
}