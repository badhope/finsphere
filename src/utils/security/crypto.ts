/**
 * 加密解密工具
 * 使用 AES 加密算法保护敏感数据
 */

import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY

if (!SECRET_KEY) {
  console.warn('⚠️ VITE_ENCRYPTION_KEY is not set! Encryption is disabled for security.')
}

export function encrypt(data: string): string {
  if (!SECRET_KEY) {
    throw new Error(
      'Encryption key is not configured. Please set VITE_ENCRYPTION_KEY in environment variables.'
    )
  }

  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Data encryption failed due to a technical error')
  }
}

export function decrypt(encryptedData: string): string {
  if (!SECRET_KEY) {
    throw new Error(
      'Encryption key is not configured. Please set VITE_ENCRYPTION_KEY in environment variables.'
    )
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (!result) {
      throw new Error('Decryption result is empty')
    }
    return result
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Data decryption failed. The data may be corrupted or the key is incorrect.')
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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
