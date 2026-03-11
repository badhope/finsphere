/**
 * 登录安全策略
 * 提供登录失败次数限制和账户锁定功能
 */

import { localStore } from '@/utils/storage'

interface LoginAttempt {
  count: number
  firstAttempt: number
  lastAttempt: number
  lockedUntil?: number
}

interface SecurityConfig {
  maxAttempts: number
  lockoutDuration: number
  attemptWindow: number
  progressiveDelay: boolean
}

const DEFAULT_CONFIG: SecurityConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,
  attemptWindow: 15 * 60 * 1000,
  progressiveDelay: true,
}

const LOGIN_ATTEMPTS_KEY = 'login_attempts'
const LOCKOUT_KEY = 'account_lockout'

export function recordLoginAttempt(username: string, success: boolean): void {
  const attempts = getLoginAttempts(username)
  const now = Date.now()

  if (success) {
    clearLoginAttempts(username)
    return
  }

  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return
  }

  if (now - attempts.firstAttempt > DEFAULT_CONFIG.attemptWindow) {
    attempts.count = 0
    attempts.firstAttempt = now
  }

  attempts.count++
  attempts.lastAttempt = now

  if (attempts.count >= DEFAULT_CONFIG.maxAttempts) {
    attempts.lockedUntil = now + DEFAULT_CONFIG.lockoutDuration
  }

  saveLoginAttempts(username, attempts)
}

export function getLoginAttempts(username: string): LoginAttempt {
  const key = `${LOGIN_ATTEMPTS_KEY}_${username.toLowerCase()}`
  const stored = localStore.get<LoginAttempt>(key)

  if (!stored) {
    return {
      count: 0,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
    }
  }

  return stored
}

export function saveLoginAttempts(username: string, attempts: LoginAttempt): void {
  const key = `${LOGIN_ATTEMPTS_KEY}_${username.toLowerCase()}`
  localStore.set(key, attempts, { expire: DEFAULT_CONFIG.lockoutDuration * 2 })
}

export function clearLoginAttempts(username: string): void {
  const key = `${LOGIN_ATTEMPTS_KEY}_${username.toLowerCase()}`
  localStore.remove(key)
}

export function isAccountLocked(username: string): { locked: boolean; remainingTime?: number } {
  const attempts = getLoginAttempts(username)
  const now = Date.now()

  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return {
      locked: true,
      remainingTime: Math.ceil((attempts.lockedUntil - now) / 1000),
    }
  }

  if (attempts.lockedUntil && now >= attempts.lockedUntil) {
    clearLoginAttempts(username)
  }

  return { locked: false }
}

export function getRemainingAttempts(username: string): number {
  const attempts = getLoginAttempts(username)
  return Math.max(0, DEFAULT_CONFIG.maxAttempts - attempts.count)
}

export function getLoginDelay(username: string): number {
  const attempts = getLoginAttempts(username)

  if (!DEFAULT_CONFIG.progressiveDelay) {
    return 0
  }

  if (attempts.count < 3) {
    return 0
  }

  return Math.min(Math.pow(2, attempts.count - 2) * 1000, 30000)
}

export function clearAllLoginAttempts(): void {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.includes(LOGIN_ATTEMPTS_KEY)) {
      localStorage.removeItem(key)
    }
  })
}
