<script setup lang="ts">
import { ArrowUp, ArrowDown, User, Coin, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'
import { ElCard, ElRow, ElCol, ElStatistic, ElMessage, ElSkeleton } from 'element-plus'

import { FinanceAPI } from '@/api/finance'

const { t } = useI18n()

const loading = ref(false)
const statistics = ref<
  Array<{
    title: string
    value: number
    prefix?: string
    suffix?: string
    precision: number
    trend: 'up' | 'down'
    trendValue: number
  }>
>([])

const chartData = ref({
  dates: [] as string[],
  values: [] as number[],
})

const allocationData = ref([
  { value: 0, name: '股票' },
  { value: 0, name: '基金' },
  { value: 0, name: '债券' },
  { value: 0, name: '现金' },
  { value: 0, name: '其他' },
])

const loadDashboardData = async () => {
  loading.value = true
  try {
    const data = await FinanceAPI.getDashboardStatistics()

    statistics.value = [
      {
        title: '总资产',
        value: data.totalAssets,
        prefix: '¥',
        precision: 2,
        trend: data.todayProfit >= 0 ? 'up' : 'down',
        trendValue: Math.abs((data.todayProfit / data.totalAssets) * 100),
      },
      {
        title: '今日收益',
        value: data.todayProfit,
        prefix: '¥',
        precision: 2,
        trend: data.todayProfit >= 0 ? 'up' : 'down',
        trendValue: Math.abs(data.todayProfit),
      },
      {
        title: '持仓数量',
        value: data.positions,
        suffix: '只',
        precision: 0,
        trend: 'up',
        trendValue: 0,
      },
      {
        title: '收益率',
        value: data.totalReturn,
        suffix: '%',
        precision: 2,
        trend: data.totalReturn >= 0 ? 'up' : 'down',
        trendValue: Math.abs(data.totalReturn),
      },
    ]

    chartData.value = {
      dates: data.assetTrend.map(item => item.date),
      values: data.assetTrend.map(item => item.value),
    }

    allocationData.value = data.assetAllocation
  } catch (error: any) {
    console.error('Failed to load dashboard data:', error)
    ElMessage.error(error.message || '加载数据失败，使用模拟数据')

    statistics.value = [
      {
        title: '总资产',
        value: 1286450.5,
        prefix: '¥',
        precision: 2,
        trend: 'up',
        trendValue: 2.34,
      },
      {
        title: '今日收益',
        value: 15680.25,
        prefix: '¥',
        precision: 2,
        trend: 'up',
        trendValue: 1.87,
      },
      { title: '持仓数量', value: 24, suffix: '只', precision: 0, trend: 'down', trendValue: 0.5 },
      { title: '收益率', value: 12.68, suffix: '%', precision: 2, trend: 'up', trendValue: 3.21 },
    ]

    chartData.value = {
      dates: [
        '1 月',
        '2 月',
        '3 月',
        '4 月',
        '5 月',
        '6 月',
        '7 月',
        '8 月',
        '9 月',
        '10 月',
        '11 月',
        '12 月',
      ],
      values: [
        1200000, 1250000, 1280000, 1320000, 1350000, 1380000, 1420000, 1450000, 1480000, 1520000,
        1560000, 1586450,
      ],
    }
  } finally {
    loading.value = false
  }
}

const checkConfig = (feature: string) => {
  const configStatus = {
    buy: false,
    analysis: true,
    profile: true,
    report: false,
  }

  if (!configStatus[feature as keyof typeof configStatus]) {
    let message = ''
    switch (feature) {
      case 'buy':
        message = '买入资产功能未配置，请先设置交易账户信息'
        break
      case 'report':
        message = '投资报告功能未配置，请先设置报告模板'
        break
      default:
        message = '功能未配置，请联系管理员'
    }
    ElMessage.warning(message)
    return false
  }
  return true
}

const handleQuickAction = (action: string) => {
  if (!checkConfig(action)) {
    return
  }
  ElMessage.success(`执行${action}操作`)
}

const assetChartRef = ref<HTMLDivElement>()
const performanceChartRef = ref<HTMLDivElement>()

let assetChart: any = null
let performanceChart: any = null
let resizeHandler: (() => void) | null = null

const loadECharts = async () => {
  const echarts = await import('echarts')
  return echarts.default
}

const initCharts = async () => {
  try {
    const echarts = await loadECharts()

    if (assetChartRef.value) {
      assetChart = echarts.init(assetChartRef.value)
      assetChart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const param = params[0]
            return `${param.name}<br/>资产总额：¥${param.value.toLocaleString()}`
          },
        },
        xAxis: {
          type: 'category',
          data: chartData.value.dates,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => `¥${(value / 10000).toFixed(0)}万`,
          },
        },
        series: [
          {
            data: chartData.value.values,
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 },
            lineStyle: { width: 3 },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
      })
    }

    if (performanceChartRef.value) {
      performanceChart = echarts.init(performanceChartRef.value)
      performanceChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          bottom: '5%',
          left: 'center',
        },
        series: [
          {
            name: '资产配置',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: allocationData.value,
          },
        ],
      })
    }

    resizeHandler = () => {
      assetChart?.resize()
      performanceChart?.resize()
    }

    window.addEventListener('resize', resizeHandler)
  } catch (error) {
    console.error('Failed to load echarts:', error)
  }
}

onMounted(() => {
  loadDashboardData()
  initCharts()
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (assetChart) {
    assetChart.dispose()
  }
  if (performanceChart) {
    performanceChart.dispose()
  }
})
</script>

<template>
  <div class="dashboard">
    <ElRow :gutter="20" class="mb-20">
      <ElCol v-for="(stat, index) in statistics" :key="index" :xs="24" :sm="12" :md="6">
        <ElSkeleton :loading="loading" animated>
          <template #template>
            <ElCard class="stat-card" shadow="hover">
              <div class="skeleton-stat">
                <div class="skeleton-title"></div>
                <div class="skeleton-value"></div>
              </div>
            </ElCard>
          </template>
          <template #default>
            <ElCard class="stat-card" shadow="hover">
              <ElStatistic
                :title="stat.title"
                :value="stat.value"
                :precision="stat.precision"
                :prefix="stat.prefix"
                :suffix="stat.suffix"
              >
                <template #suffix>
                  <div class="stat-trend" :class="`trend-${stat.trend}`">
                    <ArrowUp v-if="stat.trend === 'up'" class="trend-icon" />
                    <ArrowDown v-else class="trend-icon" />
                    {{ stat.trendValue }}%
                  </div>
                </template>
              </ElStatistic>
            </ElCard>
          </template>
        </ElSkeleton>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xs="24" :lg="16">
        <ElCard class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <TrendCharts class="header-icon" />
              <span>资产变化趋势</span>
            </div>
          </template>
          <div ref="assetChartRef" class="chart-container"></div>
        </ElCard>
      </ElCol>

      <ElCol :xs="24" :lg="8">
        <ElCard class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <DataAnalysis class="header-icon" />
              <span>资产配置</span>
            </div>
          </template>
          <div ref="performanceChartRef" class="chart-container pie-chart"></div>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" class="mt-20">
      <ElCol :xs="24" :sm="12" :md="6">
        <ElCard class="quick-action-card" shadow="hover" @click="handleQuickAction('buy')">
          <div class="quick-action">
            <Coin class="action-icon" />
            <div class="action-content">
              <h3>买入资产</h3>
              <p>快速购买股票、基金等</p>
            </div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ElCard class="quick-action-card" shadow="hover" @click="handleQuickAction('analysis')">
          <div class="quick-action">
            <TrendCharts class="action-icon" />
            <div class="action-content">
              <h3>市场分析</h3>
              <p>查看实时行情和分析</p>
            </div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ElCard class="quick-action-card" shadow="hover" @click="handleQuickAction('profile')">
          <div class="quick-action">
            <User class="action-icon" />
            <div class="action-content">
              <h3>个人中心</h3>
              <p>管理个人信息和设置</p>
            </div>
          </div>
        </ElCard>
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <ElCard class="quick-action-card" shadow="hover" @click="handleQuickAction('report')">
          <div class="quick-action">
            <DataAnalysis class="action-icon" />
            <div class="action-content">
              <h3>投资报告</h3>
              <p>查看详细的分析报告</p>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  animation: page-fade-in 0.8s ease-out;

  @keyframes page-fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stat-card {
    :deep(.el-card__body) {
      padding: 24px;
    }
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

      &::before {
        opacity: 1;
      }
    }
  }

  .skeleton-stat {
    padding: 8px 0;

    .skeleton-title {
      height: 16px;
      background: var(--el-skeleton-color);
      border-radius: 4px;
      width: 60%;
      margin-bottom: 16px;
    }

    .skeleton-value {
      height: 32px;
      background: var(--el-skeleton-color);
      border-radius: 4px;
      width: 80%;
    }
  }

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;

    &.trend-up {
      color: $finance-green;
    }

    &.trend-down {
      color: $finance-red;
    }
  }

  .chart-card {
    :deep(.el-card__body) {
      padding: 0;
    }
    border-radius: 12px;
    overflow: hidden;

    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    padding: 20px;
    background: rgba(245, 247, 250, 0.8);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .chart-container {
    height: 300px;
    width: 100%;

    &.pie-chart {
      height: 350px;
    }
  }

  .quick-action-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }

    :deep(.el-card__body) {
      padding: 30px;
    }
  }

  .quick-action {
    display: flex;
    align-items: center;
    gap: 20px;

    .action-icon {
      font-size: 40px;
      color: var(--el-color-primary);
      flex-shrink: 0;
    }

    .action-content {
      h3 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 600;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .mb-20 {
    margin-bottom: 24px;
  }

  .mt-20 {
    margin-top: 24px;
  }
}
</style>
