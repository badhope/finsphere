import { describe, it, expect } from 'vitest'

import { validatePassword, DEFAULT_POLICY, getPasswordStrength, generateSecurePassword } from '@/utils/security/password'

describe('Password Validation Utils', () => {
  describe('validatePassword', () => {
    it('should validate a strong password', () => {
      const result = validatePassword('StrongP@ssw0rd')
      expect(result.valid).toBe(true)
      expect(result.score).toBeGreaterThan(60)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('123456')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should require minimum length', () => {
      const result = validatePassword('Ab1@')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码长度至少需要 8 个字符')
    })

    it('should require uppercase letters', () => {
      const result = validatePassword('lowercase1@')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含至少一个大写字母')
    })

    it('should require lowercase letters', () => {
      const result = validatePassword('UPPERCASE1@')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含至少一个小写字母')
    })

    it('should require numbers', () => {
      const result = validatePassword('NoNumbers@')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含至少一个数字')
    })

    it('should require special characters', () => {
      const result = validatePassword('NoSpecial1')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含至少一个特殊字符')
    })

    it('should reject common passwords', () => {
      const result = validatePassword('password123', {}, {
        ...DEFAULT_POLICY,
        preventCommonPasswords: true,
      })
      expect(result.valid).toBe(false)
    })

    it('should accept password with user info when prevented', () => {
      const result = validatePassword('John123@', { username: 'john', email: 'john@example.com' }, {
        ...DEFAULT_POLICY,
        preventUserInfoInPassword: true,
      })
      expect(result.valid).toBe(false)
    })

    it('should calculate score based on password complexity', () => {
      const weak = validatePassword('weak')
      const strong = validatePassword('VeryStr0ng@Pass')

      expect(strong.score).toBeGreaterThan(weak.score)
    })
  })

  describe('getPasswordStrength', () => {
    it('should return "weak" for score < 30', () => {
      expect(getPasswordStrength(10)).toBe('weak')
    })

    it('should return "fair" for score 30-50', () => {
      expect(getPasswordStrength(40)).toBe('fair')
    })

    it('should return "good" for score 50-75', () => {
      expect(getPasswordStrength(60)).toBe('good')
    })

    it('should return "strong" for score >= 75', () => {
      expect(getPasswordStrength(80)).toBe('strong')
    })
  })

  describe('generateSecurePassword', () => {
    it('should generate password with default length', () => {
      const password = generateSecurePassword()
      expect(password.length).toBe(16)
    })

    it('should generate password with custom length', () => {
      const password = generateSecurePassword(24)
      expect(password.length).toBe(24)
    })

    it('should include uppercase, lowercase, numbers and special chars', () => {
      const password = generateSecurePassword(32)
      expect(/[A-Z]/.test(password)).toBe(true)
      expect(/[a-z]/.test(password)).toBe(true)
      expect(/[0-9]/.test(password)).toBe(true)
      expect(/[!@#$%^&*()_+\-={}|;:,.<>?]/.test(password)).toBe(true)
    })

    it('should generate different passwords each time', () => {
      const passwords = new Set<string>()
      for (let i = 0; i < 10; i++) {
        passwords.add(generateSecurePassword())
      }
      expect(passwords.size).toBeGreaterThan(1)
    })
  })
})
