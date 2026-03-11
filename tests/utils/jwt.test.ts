import { describe, it, expect } from 'vitest'
import {
  parseJWT,
  isTokenExpired,
  isTokenExpiringSoon,
  verifyJWTFormat,
} from '@/utils/security/jwt'

describe('JWT Utils', () => {
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsiYWRtaW4iXSwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  describe('parseJWT', () => {
    it('should parse valid JWT token', () => {
      const payload = parseJWT(validToken)

      expect(payload).toBeDefined()
      expect(payload?.sub).toBe('1234567890')
      expect(payload?.name).toBe('John Doe')
      expect(payload?.roles).toEqual(['admin'])
    })

    it('should return null for invalid token format', () => {
      const payload = parseJWT('invalid.token')
      expect(payload).toBeNull()
    })

    it('should return null for empty string', () => {
      const payload = parseJWT('')
      expect(payload).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for non-expired token', () => {
      const result = isTokenExpired(validToken)
      expect(result).toBe(false)
    })

    it('should return true for expired token', () => {
      const result = isTokenExpired(expiredToken)
      expect(result).toBe(true)
    })

    it('should return true for invalid token', () => {
      const result = isTokenExpired('invalid')
      expect(result).toBe(true)
    })
  })

  describe('isTokenExpiringSoon', () => {
    it('should check if token is expiring within threshold', () => {
      const result = isTokenExpiringSoon(validToken, 300)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('verifyJWTFormat', () => {
    it('should validate correct JWT format', () => {
      const result = verifyJWTFormat(validToken)
      expect(result.valid).toBe(true)
    })

    it('should reject token with wrong number of parts', () => {
      const result = verifyJWTFormat('invalid.token')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject empty string', () => {
      const result = verifyJWTFormat('')
      expect(result.valid).toBe(false)
    })
  })
})
