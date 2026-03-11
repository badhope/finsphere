import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency, formatPercent } from '@/utils/formatters/number'
import { formatDate, formatDateTime, formatRelativeTime } from '@/utils/formatters/date'

describe('Number Formatters', () => {
  describe('formatNumber', () => {
    it('should format number with thousands separator', () => {
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should handle decimal places', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234.56)).toBe('-1,234.56')
    })
  })

  describe('formatCurrency', () => {
    it('should format as CNY by default', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
    })

    it('should format as USD', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567890.12)).toBe('¥1,234,567,890.12')
    })
  })

  describe('formatPercent', () => {
    it('should format as percentage', () => {
      expect(formatPercent(0.1234)).toBe('12.34%')
    })

    it('should handle custom decimal places', () => {
      expect(formatPercent(0.1234, 1)).toBe('12.3%')
    })

    it('should handle negative values', () => {
      expect(formatPercent(-0.0567)).toBe('-5.67%')
    })
  })
})

describe('Date Formatters', () => {
  const testDate = new Date('2024-03-15T10:30:00')

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD by default', () => {
      expect(formatDate(testDate)).toBe('2024-03-15')
    })

    it('should handle string input', () => {
      expect(formatDate('2024-03-15')).toBe('2024-03-15')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const result = formatDateTime(testDate)
      expect(result).toContain('2024')
      expect(result).toContain('03')
      expect(result).toContain('15')
    })
  })

  describe('formatRelativeTime', () => {
    it('should return "刚刚" for recent time', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('刚刚')
    })

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('5分钟前')
    })

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2小时前')
    })
  })
})
