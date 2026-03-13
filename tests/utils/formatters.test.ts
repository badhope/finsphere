import { describe, it, expect } from 'vitest'

import { formatDate, formatDateTime, formatRelativeTime } from '@/utils/formatters/date'
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatVolume,
} from '@/utils/formatters/number'

describe('Number Formatters', () => {
  describe('formatCurrency', () => {
    it('should format as CNY by default', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
    })

    it('should format as USD', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('US$1,234.56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('¥0.00')
    })
  })

  describe('formatPercentage', () => {
    it('should format positive percentage with + sign', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%')
    })

    it('should format negative percentage', () => {
      expect(formatPercentage(-3.25)).toBe('-3.25%')
    })

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('+0.00%')
    })

    it('should handle custom decimal places', () => {
      expect(formatPercentage(10.123, 1)).toBe('+10.1%')
    })
  })

  describe('formatLargeNumber', () => {
    it('should format numbers in billions', () => {
      expect(formatLargeNumber(100000000)).toBe('1.00亿')
    })

    it('should format numbers in ten thousands', () => {
      expect(formatLargeNumber(50000)).toBe('5.00万')
    })

    it('should format small numbers with thousands separator', () => {
      expect(formatLargeNumber(1234)).toBe('1,234')
    })
  })

  describe('formatVolume', () => {
    it('should format volume in hundred millions', () => {
      expect(formatVolume(100000000)).toBe('1.00亿手')
    })

    it('should format volume in ten thousands', () => {
      expect(formatVolume(50000)).toBe('5.00万手')
    })

    it('should format small volume with separator', () => {
      expect(formatVolume(1234)).toBe('1,234手')
    })
  })
})

describe('Date Formatters', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBe('2024-01-15')
    })
  })

  describe('formatDateTime', () => {
    it('should format datetime with default format', () => {
      const result = formatDateTime('2024-01-15 10:30:00')
      expect(result).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format relative time for past date', () => {
      const now = new Date()
      const pastDate = new Date(now.getTime() - 3600000)
      const result = formatRelativeTime(pastDate)
      expect(result).toBeTruthy()
    })
  })
})
