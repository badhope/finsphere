/**
 * 认证相关工具函数
 */

import { localStore, sessionStore } from '@/utils/storage'
import {
  verifyJWTFormat,
  isTokenExpired,
  isTokenExpiringSoon as isExpiringSoon,
  parseJWT,
} from '@/utils/security/jwt'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

/**
 * 获取访问令牌
 */
export function getToken(): string | null {
  return sessionStore.get<string>(TOKEN_KEY) || localStore.get<string>(TOKEN_KEY)
}

/**
 * 设置访问令牌
 */
export function setToken(token: string, rememberMe: boolean = false): void {
  const expiresIn = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000

  const validationResult = verifyJWTFormat(token)
  if (!validationResult.valid) {
    console.warn('Invalid JWT token:', validationResult.error)
  }

  if (rememberMe) {
    localStore.set(TOKEN_KEY, token, { encrypt: true, expire: expiresIn })
  } else {
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
  localStore.set(REFRESH_TOKEN_KEY, token, { encrypt: true, expire: 30 * 24 * 60 * 60 * 1000 })
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
  localStore.set(USER_INFO_KEY, userInfo, { encrypt: true, expire: 24 * 60 * 60 * 1000 })
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
  const token = getToken()
  if (!token) return false

  return !isTokenExpired(token)
}

/**
 * 检查令牌是否即将过期
 */
export function isTokenExpiringSoon(expiresIn: number = 300): boolean {
  const token = getToken()
  if (!token) return true

  return isExpiringSoon(token, expiresIn)
}

/**
 * 验证令牌有效性
 */
export function validateToken(): { valid: boolean; error?: string } {
  const token = getToken()
  if (!token) {
    return { valid: false, error: '未找到访问令牌' }
  }

  const validationResult = verifyJWTFormat(token)
  if (!validationResult.valid) {
    return { valid: false, error: validationResult.error }
  }

  if (isTokenExpired(token)) {
    return { valid: false, error: '令牌已过期' }
  }

  return { valid: true }
}

/**
 * 从令牌中获取用户角色
 */
export function getUserRolesFromToken(): string[] {
  const token = getToken()
  if (!token) return []

  const payload = parseJWT(token)
  return payload?.roles || []
}
