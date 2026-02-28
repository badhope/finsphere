/**
 * 金融数据相关类型定义
 */

export interface FinancialAsset {
  id: string
  name: string
  symbol: string
  type: AssetType
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  peRatio?: number
  dividendYield?: number
  lastUpdated: string
}

export enum AssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  COMMODITY = 'COMMODITY',
  FOREX = 'FOREX'
}

export interface Portfolio {
  id: string
  name: string
  userId: string
  totalValue: number
  totalChange: number
  totalChangePercent: number
  assets: PortfolioAsset[]
  createdAt: string
  updatedAt: string
}

export interface PortfolioAsset {
  id: string
  assetId: string
  quantity: number
  averageCost: number
  currentPrice: number
  currentValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface Transaction {
  id: string
  portfolioId: string
  assetId: string
  type: TransactionType
  quantity: number
  price: number
  totalAmount: number
  fee: number
  date: string
  notes?: string
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  INTEREST = 'INTEREST'
}

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  prevClose: number
  timestamp: string
}

export interface CandlestickData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface PerformanceMetrics {
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
}