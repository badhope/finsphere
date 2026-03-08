/**
 * JWT 工具类
 * 提供 JWT 解析、验证等功能
 */

import { sha256 } from './crypto'

export interface JWTPayload {
  sub?: string
  name?: string
  roles?: string[]
  exp?: number
  iat?: number
  iss?: string
  [key: string]: any
}

export interface JWTVerifyResult {
  valid: boolean
  payload?: JWTPayload
  error?: string
}

/**
 * 解析 JWT（不验证签名）
 * ⚠️ 仅用于获取 payload 信息，不验证真实性
 */
export function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

/**
 * 验证 JWT 是否过期
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) {
    return true
  }

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * 检查 JWT 是否即将过期
 * @param token - JWT token
 * @param thresholdSeconds - 阈值（秒），默认 5 分钟
 */
export function isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) {
    return true
  }

  const now = Math.floor(Date.now() / 1000)
  return payload.exp - now < thresholdSeconds
}

/**
 * 验证 JWT 签名
 * ⚠️ 注意：前端无法完全验证 JWT 签名，因为密钥不能暴露在前端
 * 这个方法仅用于基本格式验证，真正的签名验证应在后端进行
 */
export function verifyJWTFormat(token: string): JWTVerifyResult {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return {
        valid: false,
        error: 'JWT 格式错误：必须包含 3 个部分',
      }
    }

    const [header, payload, signature] = parts

    // 验证 header
    const decodedHeader = atob(header.replace(/-/g, '+').replace(/_/g, '/'))
    const headerObj = JSON.parse(decodedHeader)

    if (!headerObj.alg || !headerObj.typ) {
      return {
        valid: false,
        error: 'JWT header 缺少必要字段',
      }
    }

    // 验证 payload
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const payloadObj = JSON.parse(decodedPayload)

    if (!payloadObj.exp) {
      return {
        valid: false,
        error: 'JWT payload 缺少过期时间',
      }
    }

    // 检查是否过期
    const now = Math.floor(Date.now() / 1000)
    if (payloadObj.exp < now) {
      return {
        valid: false,
        error: 'JWT 已过期',
      }
    }

    // 验证签名（基本验证，无法完全验证）
    if (!signature || signature.length === 0) {
      return {
        valid: false,
        error: 'JWT 签名缺失',
      }
    }

    return {
      valid: true,
      payload: payloadObj,
    }
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'JWT 验证失败',
    }
  }
}

/**
 * 获取 JWT 中的用户信息
 */
export function getUserInfoFromToken(
  token: string
): { username?: string; roles?: string[] } | null {
  const payload = parseJWT(token)
  if (!payload) {
    return null
  }

  return {
    username: payload.name || payload.sub || undefined,
    roles: payload.roles || [],
  }
}

/**
 * 计算 JWT 签名（用于测试）
 * ⚠️ 实际应用中不应在前端计算签名
 */
export function calculateSignature(header: string, payload: string, secret: string): string {
  const message = `${header}.${payload}`
  return sha256(message + secret)
}
