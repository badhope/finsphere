import { describe, it, expect, beforeEach } from 'vitest'

import { localStore, sessionStore } from '@/utils/storage'

describe('Storage Utils', () => {
  const testKey = 'test_key'
  const testValue = { name: 'test', value: 123 }

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('localStore', () => {
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

    it('should clear all values', () => {
      localStore.set('key1', 'value1')
      localStore.set('key2', 'value2')
      localStore.clear()

      const result1 = localStore.get('key1')
      const result2 = localStore.get('key2')

      expect(result1).toBeNull()
      expect(result2).toBeNull()
    })

    it('should handle storage with expiration', () => {
      localStore.set(testKey, testValue, { expire: 1000 })
      const result = localStore.get<typeof testValue>(testKey)

      expect(result).toEqual(testValue)
    })
  })

  describe('sessionStore', () => {
    it('should set and get value correctly', () => {
      sessionStore.set(testKey, testValue)
      const result = sessionStore.get<typeof testValue>(testKey)

      expect(result).toEqual(testValue)
    })

    it('should return null for non-existent key', () => {
      const result = sessionStore.get('non_existent_key')
      expect(result).toBeNull()
    })
  })
})
