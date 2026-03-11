import { describe, it, expect, beforeEach } from 'vitest'
import { SecureStorage, localStore, sessionStore } from '@/utils/storage'

describe('Storage Utils', () => {
  const testKey = 'test_key'
  const testValue = { name: 'test', value: 123 }

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('SecureStorage', () => {
    it('should set and get value correctly', () => {
      localStore.set(testKey, testValue)
      const result = localStore.get<typeof testValue>(testKey)

      expect(result).toEqual(testValue)
    })

    it('should return null for non-existent key', () => {
      const result = localStore.get('non_existent_key')
      expect(result).toBeNull()
    })

    it('should return default value for non-existent key', () => {
      const defaultValue = 'default'
      const result = localStore.get('non_existent_key', defaultValue)
      expect(result).toBe(defaultValue)
    })

    it('should remove value correctly', () => {
      localStore.set(testKey, testValue)
      localStore.remove(testKey)

      const result = localStore.get(testKey)
      expect(result).toBeNull()
    })

    it('should handle encrypted storage', () => {
      localStore.set(testKey, testValue, { encrypt: true })
      const result = localStore.get<typeof testValue>(testKey)

      expect(result).toEqual(testValue)
    })

    it('should handle expiration', async () => {
      localStore.set(testKey, testValue, { expire: 100 })

      const result1 = localStore.get<typeof testValue>(testKey)
      expect(result1).toEqual(testValue)

      await new Promise(resolve => setTimeout(resolve, 150))

      const result2 = localStore.get<typeof testValue>(testKey)
      expect(result2).toBeNull()
    })

    it('should clear all data', () => {
      localStore.set('key1', 'value1')
      localStore.set('key2', 'value2')
      localStore.clear()

      expect(localStore.get('key1')).toBeNull()
      expect(localStore.get('key2')).toBeNull()
    })
  })

  describe('sessionStore', () => {
    it('should use sessionStorage', () => {
      sessionStore.set(testKey, testValue)
      const result = sessionStore.get<typeof testValue>(testKey)

      expect(result).toEqual(testValue)
      expect(sessionStorage.getItem('fin_' + testKey)).toBeDefined()
    })
  })
})
