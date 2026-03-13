import { describe, it, expect, vi, beforeAll } from 'vitest'

import {
  sha256,
  md5,
  generateRandomString,
  base64Encode,
  base64Decode,
} from '@/utils/security/crypto'

beforeAll(() => {
  vi.stubEnv('VITE_ENCRYPTION_KEY', 'test_encryption_key_32_bytes_long!')
})

describe('Crypto Utils', () => {
  describe('sha256', () => {
    it('should generate consistent SHA256 hash', () => {
      const input = 'test string'
      const hash1 = sha256(input)
      const hash2 = sha256(input)

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64)
    })

    it('should generate different hashes for different inputs', () => {
      const hash1 = sha256('input1')
      const hash2 = sha256('input2')

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('md5', () => {
    it('should generate consistent MD5 hash', () => {
      const input = 'test string'
      const hash1 = md5(input)
      const hash2 = md5(input)

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(32)
    })

    it('should generate different hashes for different inputs', () => {
      const hash1 = md5('input1')
      const hash2 = md5('input2')

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('generateRandomString', () => {
    it('should generate random string with default length', () => {
      const result = generateRandomString()
      expect(result).toHaveLength(32)
    })

    it('should generate random string with custom length', () => {
      const result = generateRandomString(16)
      expect(result).toHaveLength(16)
    })

    it('should generate unique strings', () => {
      const result1 = generateRandomString()
      const result2 = generateRandomString()
      expect(result1).not.toBe(result2)
    })
  })

  describe('base64Encode and base64Decode', () => {
    it('should encode and decode string correctly', () => {
      const original = 'Hello World'
      const encoded = base64Encode(original)
      const decoded = base64Decode(encoded)

      expect(decoded).toBe(original)
    })

    it('should handle empty string', () => {
      const encoded = base64Encode('')
      const decoded = base64Decode(encoded)
      expect(decoded).toBe('')
    })

    it('should handle special characters', () => {
      const original = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const encoded = base64Encode(original)
      const decoded = base64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('should handle unicode characters', () => {
      const original = '你好世界 🌍'
      const encoded = base64Encode(original)
      const decoded = base64Decode(encoded)
      expect(decoded).toBe(original)
    })
  })
})
