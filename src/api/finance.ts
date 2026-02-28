/**
 * 金融数据相关API
 */
import { http } from '@/utils/http/client'
import type { 
  FinancialAsset, 
  Portfolio, 
  PortfolioAsset, 
  Transaction,
  MarketData,
  CandlestickData
} from '@/types/finance'
import type { PaginationRequest, PaginationResponse } from '@/types/system'

export class FinanceAPI {
  /**
   * 获取资产列表
   */
  static getAssets(params?: PaginationRequest & { 
    search?: string; 
    type?: string 
  }): Promise<PaginationResponse<FinancialAsset>> {
    return http.get('/assets', params)
  }

  /**
   * 获取单个资产详情
   */
  static getAsset(symbol: string): Promise<FinancialAsset> {
    return http.get(`/assets/${symbol}`)
  }

  /**
   * 获取实时行情
   */
  static getMarketData(symbols: string[]): Promise<MarketData[]> {
    return http.post('/market/realtime', { symbols })
  }

  /**
   * 获取K线数据
   */
  static getCandlestickData(
    symbol: string, 
    period: string = '1d',
    limit: number = 100
  ): Promise<CandlestickData[]> {
    return http.get(`/market/kline/${symbol}`, { period, limit })
  }

  /**
   * 获取投资组合列表
   */
  static getPortfolios(params?: PaginationRequest): Promise<PaginationResponse<Portfolio>> {
    return http.get('/portfolios', params)
  }

  /**
   * 创建投资组合
   */
  static createPortfolio(data: { name: string; description?: string }): Promise<Portfolio> {
    return http.post('/portfolios', data)
  }

  /**
   * 获取组合详情
   */
  static getPortfolio(id: string): Promise<Portfolio & { assets: PortfolioAsset[] }> {
    return http.get(`/portfolios/${id}`)
  }

  /**
   * 更新组合
   */
  static updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    return http.put(`/portfolios/${id}`, data)
  }

  /**
   * 删除组合
   */
  static deletePortfolio(id: string): Promise<any> {
    return http.delete(`/portfolios/${id}`)
  }

  /**
   * 获取交易记录
   */
  static getTransactions(params?: PaginationRequest & { 
    portfolioId?: string; 
    assetId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginationResponse<Transaction>> {
    return http.get('/transactions', params)
  }

  /**
   * 创建交易记录
   */
  static createTransaction(data: {
    portfolioId: string;
    assetId: string;
    type: string;
    quantity: number;
    price: number;
    fee?: number;
    date: string;
    notes?: string;
  }): Promise<Transaction> {
    return http.post('/transactions', data)
  }

  /**
   * 获取自选股列表
   */
  static getWatchlist(): Promise<FinancialAsset[]> {
    return http.get('/watchlist')
  }

  /**
   * 添加自选股
   */
  static addToWatchlist(symbol: string): Promise<any> {
    return http.post('/watchlist', { symbol })
  }

  /**
   * 从自选股移除
   */
  static removeFromWatchlist(symbol: string): Promise<any> {
    return http.delete(`/watchlist/${symbol}`)
  }
}