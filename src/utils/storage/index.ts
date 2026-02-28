/**
 * 存储工具类
 * 支持localStorage和sessionStorage，包含加密和过期时间功能
 */

import { encrypt, decrypt } from '@/utils/security/crypto'

interface StorageOptions {
  encrypt?: boolean // 是否加密存储
  expire?: number // 过期时间(毫秒)
}

interface StorageItem<T = any> {
  data: T
  timestamp: number
  expire?: number
}

class SecureStorage {
  private storage: Storage
  private prefix: string

  constructor(storage: Storage, prefix: string = 'fin_') {
    this.storage = storage
    this.prefix = prefix
  }

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    const { encrypt = false, expire } = options
    
    const item: StorageItem<T> = {
      data: value,
      timestamp: Date.now(),
      expire: expire ? Date.now() + expire : undefined
    }

    let stringValue = JSON.stringify(item)
    
    // 加密处理
    if (encrypt) {
      stringValue = encrypt(stringValue)
    }

    try {
      this.storage.setItem(this.prefix + key, stringValue)
    } catch (error) {
      console.error('Storage set error:', error)
      // 如果localStorage满了，尝试清理过期数据
      if (this.storage === localStorage) {
        this.clearExpired()
        try {
          this.storage.setItem(this.prefix + key, stringValue)
        } catch (retryError) {
          console.error('Storage set failed after cleanup:', retryError)
        }
      }
    }
  }

  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue?: T): T | null {
    const storedValue = this.storage.getItem(this.prefix + key)
    
    if (storedValue === null) {
      return defaultValue !== undefined ? defaultValue : null
    }

    try {
      let parsedValue = storedValue
      
      // 尝试解密
      try {
        parsedValue = decrypt(storedValue)
      } catch {
        // 如果解密失败，可能是未加密的数据
      }

      const item: StorageItem<T> = JSON.parse(parsedValue)
      
      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return defaultValue !== undefined ? defaultValue : null
      }

      return item.data
    } catch (error) {
      console.error('Storage get error:', error)
      this.remove(key)
      return defaultValue !== undefined ? defaultValue : null
    }
  }

  /**
   * 删除存储项
   */
  remove(key: string): void {
    this.storage.removeItem(this.prefix + key)
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    const keysToRemove: string[] = []
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      this.storage.removeItem(key)
    })
  }

  /**
   * 检查是否存在指定key
   */
  has(key: string): boolean {
    return this.storage.getItem(this.prefix + key) !== null
  }

  /**
   * 获取所有keys
   */
  keys(): string[] {
    const keys: string[] = []
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length))
      }
    }
    
    return keys
  }

  /**
   * 清理过期数据
   */
  clearExpired(): void {
    const now = Date.now()
    const keysToRemove: string[] = []
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        try {
          const storedValue = this.storage.getItem(key)
          if (storedValue) {
            let parsedValue = storedValue
            
            // 尝试解密
            try {
              parsedValue = decrypt(storedValue)
            } catch {
              // 如果解密失败，可能是未加密的数据
            }

            const item: StorageItem = JSON.parse(parsedValue)
            
            if (item.expire && now > item.expire) {
              keysToRemove.push(key)
            }
          }
        } catch (error) {
          // 解析失败的数据也删除
          keysToRemove.push(key!)
        }
      }
    }
    
    keysToRemove.forEach(key => {
      this.storage.removeItem(key)
    })
  }

  /**
   * 获取存储使用情况
   */
  getUsage(): { used: number; total: number; percentage: number } {
    let total = 0
    let used = 0
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      const value = this.storage.getItem(key!)
      if (key && value) {
        total += key.length + value.length
      }
    }
    
    // 估算总容量(5MB)
    const capacity = 5 * 1024 * 1024
    used = total * 2 // UTF-16编码，每个字符占2字节
    
    return {
      used,
      total: capacity,
      percentage: Math.round((used / capacity) * 100)
    }
  }
}

// 创建localStorage实例
export const localStore = new SecureStorage(localStorage, 'fin_local_')

// 创建sessionStorage实例
export const sessionStore = new SecureStorage(sessionStorage, 'fin_session_')

// 默认导出localStorage实例
export default localStore