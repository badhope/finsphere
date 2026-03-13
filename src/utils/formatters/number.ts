/**
 * 数字格式化工具
 */

import numeral from 'numeral'

/**
 * 格式化货币金额
 */
export function formatCurrency(value: number, currency: string = 'CNY'): string {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(value)
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return (value >= 0 ? '+' : '') + value.toFixed(decimals) + '%'
}

/**
 * 格式化大数字（带单位）
 */
export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿'
  } else if (Math.abs(value) >= 10000) {
    return (value / 10000).toFixed(2) + '万'
  } else {
    return value.toLocaleString()
  }
}

/**
 * 格式化成交量
 */
export function formatVolume(volume: number): string {
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(2) + '亿手'
  } else if (volume >= 10000) {
    return (volume / 10000).toFixed(2) + '万手'
  } else {
    return volume.toLocaleString() + '手'
  }
}

/**
 * 格式化涨跌幅颜色
 */
export function getPriceChangeClass(change: number): string {
  if (change > 0) {
    return 'price-up'
  } else if (change < 0) {
    return 'price-down'
  } else {
    return 'price-neutral'
  }
}

/**
 * 格式化涨跌幅箭头
 */
export function getPriceChangeArrow(change: number): string {
  if (change > 0) {
    return '↑'
  } else if (change < 0) {
    return '↓'
  } else {
    return '-'
  }
}
