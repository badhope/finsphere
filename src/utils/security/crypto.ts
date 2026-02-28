/**
 * 加密解密工具
 * 使用AES加密算法保护敏感数据
 */

import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'fin_sphere_default_key'

/**
 * AES加密
 */
export function encrypt(data: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption failed:', error)
    return data // 加密失败时返回原始数据
  }
}

/**
 * AES解密
 */
export function decrypt(encryptedData: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Decryption failed')
  }
}

/**
 * Base64编码
 */
export function base64Encode(str: string): string {
  try {
    return btoa(encodeURIComponent(str))
  } catch (error) {
    console.error('Base64 encoding failed:', error)
    return str
  }
}

/**
 * Base64解码
 */
export function base64Decode(str: string): string {
  try {
    return decodeURIComponent(atob(str))
  } catch (error) {
    console.error('Base64 decoding failed:', error)
    return str
  }
}

/**
 * SHA256哈希
 */
export function sha256(str: string): string {
  return CryptoJS.SHA256(str).toString()
}

/**
 * MD5哈希
 */
export function md5(str: string): string {
  return CryptoJS.MD5(str).toString()
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}