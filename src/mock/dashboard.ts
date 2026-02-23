import Mock from 'mockjs';

export function setupDashboardMock() {
  Mock.mock('/api/dashboard/stats', 'get', () => {
    return {
      code: 200,
      data: {
        totalAssets: 125000000,
        todayProfit: 35000,
        riskRate: '12.5%',
        activeUsers: 1024,
      }
    };
  });

  Mock.mock('/api/dashboard/chart', 'get', () => {
    const chartData = Mock.mock({
      'list|12': [{
        'month|+1': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        'value': '@float(10000, 50000, 2, 2)'
      }]
    }).list;
    return { code: 200, data: chartData };
  });
}
