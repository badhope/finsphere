/**
 * 密码验证工具
 * 提供密码强度验证和安全策略检查
 */

export interface PasswordValidationResult {
  valid: boolean
  score: number
  errors: string[]
  warnings: string[]
}

export interface PasswordPolicy {
  minLength: number
  maxLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecialChar: boolean
  minUniqueChars: number
  preventCommonPasswords: boolean
  preventUserInfoInPassword: boolean
}

const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  minUniqueChars: 4,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true,
}

const COMMON_PASSWORDS = new Set([
  '123456',
  'password',
  '12345678',
  'qwerty',
  '123456789',
  '12345',
  '1234',
  '111111',
  '1234567',
  'dragon',
  '123123',
  'baseball',
  'abc123',
  'football',
  'monkey',
  'letmein',
  '696969',
  'shadow',
  'master',
  '666666',
  'qwertyuiop',
  '123321',
  'mustang',
  '1234567890',
  'michael',
  '654321',
  'pussy',
  'superman',
  '1qaz2wsx',
  '7777777',
  'admin',
  'admin123',
  'root',
  'toor',
  'pass',
  'test',
  'guest',
  'login',
  'welcome',
  'hello',
])

export function validatePassword(
  password: string,
  userInfo: { username?: string; email?: string } = {},
  policy: Partial<PasswordPolicy> = {}
): PasswordValidationResult {
  const finalPolicy = { ...DEFAULT_POLICY, ...policy }
  const errors: string[] = []
  const warnings: string[] = []
  let score = 0

  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      score: 0,
      errors: ['密码不能为空'],
      warnings: [],
    }
  }

  if (password.length < finalPolicy.minLength) {
    errors.push(`密码长度至少需要 ${finalPolicy.minLength} 个字符`)
  } else if (password.length > finalPolicy.maxLength) {
    errors.push(`密码长度不能超过 ${finalPolicy.maxLength} 个字符`)
  } else {
    score += Math.min(password.length * 2, 20)
  }

  if (finalPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母')
  } else if (/[A-Z]/.test(password)) {
    score += 10
  }

  if (finalPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母')
  } else if (/[a-z]/.test(password)) {
    score += 10
  }

  if (finalPolicy.requireNumber && !/[0-9]/.test(password)) {
    errors.push('密码必须包含至少一个数字')
  } else if (/[0-9]/.test(password)) {
    score += 10
  }

  if (finalPolicy.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符')
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15
  }

  const uniqueChars = new Set(password.split('')).size
  if (uniqueChars < finalPolicy.minUniqueChars) {
    errors.push(`密码必须包含至少 ${finalPolicy.minUniqueChars} 个不同的字符`)
  } else {
    score += uniqueChars * 2
  }

  if (finalPolicy.preventCommonPasswords) {
    const lowerPassword = password.toLowerCase()
    if (COMMON_PASSWORDS.has(lowerPassword)) {
      errors.push('密码过于简单，请使用更复杂的密码')
      score = 0
    }
    for (const common of COMMON_PASSWORDS) {
      if (lowerPassword.includes(common)) {
        warnings.push('密码包含常见密码模式')
        score -= 10
        break
      }
    }
  }

  if (finalPolicy.preventUserInfoInPassword && userInfo) {
    const lowerPassword = password.toLowerCase()
    if (userInfo.username && lowerPassword.includes(userInfo.username.toLowerCase())) {
      errors.push('密码不能包含用户名')
      score -= 20
    }
    if (userInfo.email) {
      const emailPrefix = userInfo.email.split('@')[0]
      if (emailPrefix && lowerPassword.includes(emailPrefix.toLowerCase())) {
        errors.push('密码不能包含邮箱前缀')
        score -= 20
      }
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    warnings.push('密码包含连续重复的字符')
    score -= 5
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    warnings.push('密码仅包含字母，建议添加数字和特殊字符')
    score -= 5
  }

  if (/^[0-9]+$/.test(password)) {
    warnings.push('密码仅包含数字，建议添加字母和特殊字符')
    score -= 10
  }

  if (
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(
      password
    )
  ) {
    warnings.push('密码包含连续字母序列')
    score -= 5
  }

  if (/012|123|234|345|456|567|678|789|890/.test(password)) {
    warnings.push('密码包含连续数字序列')
    score -= 5
  }

  score = Math.max(0, Math.min(100, score))

  return {
    valid: errors.length === 0,
    score,
    errors,
    warnings,
  }
}

export function getPasswordStrength(score: number): 'weak' | 'fair' | 'good' | 'strong' {
  if (score < 30) return 'weak'
  if (score < 50) return 'fair'
  if (score < 75) return 'good'
  return 'strong'
}

export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'
  const numbers = '23456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = uppercase + lowercase + numbers + special

  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
