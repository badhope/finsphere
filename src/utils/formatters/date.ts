/**
 * 日期时间格式化工具
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string | Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date | number, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date | number): string {
  return dayjs(date).fromNow()
}

/**
 * 格式化金融时间（交易时间）
 */
export function formatTradingTime(date: string | Date | number): string {
  const d = dayjs(date)
  const now = dayjs()
  
  // 如果是今天
  if (d.isSame(now, 'day')) {
    return d.format('HH:mm')
  }
  
  // 如果是昨天
  if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天 ' + d.format('HH:mm')
  }
  
  // 其他情况
  return d.format('MM-DD HH:mm')
}

/**
 * 判断是否为交易日
 */
export function isTradingDay(date: string | Date | number): boolean {
  const d = dayjs(date)
  const dayOfWeek = d.day()
  
  // 周末不是交易日
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false
  }
  
  // 这里可以添加节假日判断逻辑
  return true
}

/**
 * 获取最近的交易日
 */
export function getLastTradingDay(): dayjs.Dayjs {
  let date = dayjs()
  
  // 如果今天不是交易日，往前找
  while (!isTradingDay(date)) {
    date = date.subtract(1, 'day')
  }
  
  return date
}