/**
 * Mock数据配置
 */
import Mock from 'mockjs'

// 启用Mock
export function setupMock() {
  if (import.meta.env.VITE_MOCK_ENABLED !== 'true') {
    return
  }

  // 用户登录
  Mock.mock('http://localhost:8000/auth/login', 'post', (options: any) => {
    const { username, password } = JSON.parse(options.body)
    
    if (username === 'admin' && password === '123456') {
      return {
        code: 200,
        data: {
          accessToken: Mock.Random.string(32),
          refreshToken: Mock.Random.string(32),
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@finsphere.com',
            avatar: '',
            nickname: '管理员',
            roles: [
              {
                id: '1',
                name: '管理员',
                code: 'admin'
              }
            ],
            permissions: [
              { id: '1', name: '所有权限', code: '*' }
            ]
          },
          expiresIn: 7200
        },
        message: '登录成功',
        timestamp: Date.now()
      }
    } else {
      return {
        code: 401,
        data: null,
        message: '用户名或密码错误',
        timestamp: Date.now()
      }
    }
  })

  // 获取用户信息
  Mock.mock('http://localhost:8000/user/info', 'get', {
    code: 200,
    data: {
      id: '1',
      username: 'admin',
      email: 'admin@finsphere.com',
      avatar: '',
      nickname: '管理员',
      roles: [
        {
          id: '1',
          name: '管理员',
          code: 'admin'
        }
      ],
      permissions: [
        { id: '1', name: '所有权限', code: '*' }
      ]
    },
    message: '获取成功',
    timestamp: Date.now()
  })

  // 获取资产列表
  Mock.mock('http://localhost:8000/assets', 'get', {
    code: 200,
    data: {
      items: [
        {
          id: '1',
          name: '贵州茅台',
          symbol: '600519.SH',
          type: 'STOCK',
          currentPrice: 1785.50,
          change: 25.30,
          changePercent: 1.44,
          volume: 12580000,
          marketCap: 2245000000000,
          peRatio: 28.5,
          dividendYield: 1.2
        },
        {
          id: '2',
          name: '招商银行',
          symbol: '600036.SH',
          type: 'STOCK',
          currentPrice: 42.85,
          change: -0.45,
          changePercent: -1.04,
          volume: 8950000,
          marketCap: 1056000000000,
          peRatio: 9.8,
          dividendYield: 3.1
        },
        {
          id: '3',
          name: '沪深300ETF',
          symbol: '510300.SH',
          type: 'ETF',
          currentPrice: 4.256,
          change: 0.032,
          changePercent: 0.76,
          volume: 156800000,
          marketCap: 89500000000
        }
      ],
      total: 3,
      page: 1,
      pageSize: 10,
      totalPages: 1
    },
    message: '获取成功',
    timestamp: Date.now()
  })

  // 获取投资组合
  Mock.mock('http://localhost:8000/portfolios', 'get', {
    code: 200,
    data: {
      items: [
        {
          id: '1',
          name: '稳健增长组合',
          userId: '1',
          totalValue: 1286450.50,
          totalChange: 15680.25,
          totalChangePercent: 1.23,
          assets: [
            {
              id: '1',
              assetId: '1',
              quantity: 200,
              averageCost: 1750.20,
              currentPrice: 1785.50,
              currentValue: 357100,
              profitLoss: 7060,
              profitLossPercent: 2.01
            },
            {
              id: '2',
              assetId: '2',
              quantity: 5000,
              averageCost: 41.20,
              currentPrice: 42.85,
              currentValue: 214250,
              profitLoss: 8250,
              profitLossPercent: 4.01
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1
    },
    message: '获取成功',
    timestamp: Date.now()
  })

  // 获取实时行情
  Mock.mock('http://localhost:8000/market/realtime', 'post', {
    code: 200,
    data: [
      {
        symbol: '600519.SH',
        price: 1785.50,
        change: 25.30,
        changePercent: 1.44,
        volume: 12580000,
        high: 1792.80,
        low: 1765.20,
        open: 1768.20,
        prevClose: 1760.20,
        timestamp: new Date().toISOString()
      }
    ],
    message: '获取成功',
    timestamp: Date.now()
  })

  // 登出
  Mock.mock('http://localhost:8000/auth/logout', 'post', {
    code: 200,
    data: null,
    message: '登出成功',
    timestamp: Date.now()
  })

  // 刷新令牌
  Mock.mock('http://localhost:8000/auth/refresh', 'post', {
    code: 200,
    data: {
      accessToken: Mock.Random.string(32)
    },
    message: '刷新成功',
    timestamp: Date.now()
  })

  console.log(' Mock server started')
}