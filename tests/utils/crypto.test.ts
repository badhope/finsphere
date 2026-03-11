import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  encrypt,
  decrypt,
  sha256,
  md5,
  generateRandomString,
  base64Encode,
  base64Decode,
} from '@/utils/security/crypto'

vi.mock('import.meta', () => ({
  env: {
    VITE_ENCRYPTION_KEY: 'test_encryption_key_32_bytes_long!',
  },
}))

describe('Crypto Utils', () => {
  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt string correctly', () => {
      const original = 'sensitive data'
      const encrypted = encrypt(original)

      expect(encrypted).toBeDefined()
      expect(encrypted).not.toBe(original)

      const decrypted = decrypt(encrypted)
      expect(decrypted).toBe(original)
    })

    it('should produce different ciphertext for same input', () => {
      const data = 'test data'
      const encrypted1 = encrypt(data)
      const encrypted2 = encrypt(data)

      expect(encrypted1).not.toBe(encrypted2)
    })

    it('should handle empty string', () => {
      const original = ''
      const encrypted = encrypt(original)
      const decrypted = decrypt(encrypted)
      expect(decrypted).toBe(original)
    })

    it('should handle special characters', () => {
      const original = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const encrypted = encrypt(original)
      const decrypted = decrypt(encrypted)
      expect(decrypted).toBe(original)
    })

    it('should handle unicode characters', () => {
      const original = '你好世界 🌍 مرحبا'
      const encrypted = encrypt(original)
      const decrypted = decrypt(encrypted)
      expect(decrypted).toBe(original)
    })
  })

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
  })

  describe('generateRandomString', () => {
    it('should generate string of specified length', () => {
      const length = 16
      const result = generateRandomString(length)
      expect(result).toHaveLength(length)
    })

    it('should generate different strings', () => {
      const str1 = generateRandomString(32)
      const str2 = generateRandomString(32)
      expect(str1).not.toBe(str2)
    })

    it('should use default length of 32', () => {
      const result = generateRandomString()
      expect(result).toHaveLength(32)
    })
  })

  describe('base64Encode and base64Decode', () => {
    it('should encode and decode correctly', () => {
      const original = 'Hello, World!'
      const encoded = base64Encode(original)
      const decoded = base64Decode(encoded)
      expect(decoded).toBe(original)
    })

    it('should handle unicode characters', () => {
      const original = '你好世界'
      const encoded = base64Encode(original)
      const decoded = base64Decode(encoded)
      expect(decoded).toBe(original)
    })
  })
})
