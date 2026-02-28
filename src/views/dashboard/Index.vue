<script setup lang="ts">
import { ElCard, ElRow, ElCol, ElStatistic, ElDatePicker } from 'element-plus'
import { ArrowUp, ArrowDown, User, Coin, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const { t } = useI18n()

// 统计数据
const statistics = ref([
  {
    title: '总资产',
    value: 1286450.50,
    prefix: '¥',
    precision: 2,
    trend: 'up',
    trendValue: 2.34
  },
  {
    title: '今日收益',
    value: 15680.25,
    prefix: '¥',
    precision: 2,
    trend: 'up',
    trendValue: 1.87
  },
  {
    title: '持仓数量',
    value: 24,
    suffix: '只',
    precision: 0,
    trend: 'down',
    trendValue: 0.5
  },
  {
    title: '收益率',
    value: 12.68,
    suffix: '%',
    precision: 2,
    trend: 'up',
    trendValue: 3.21
  }
])

// 图表实例引用
const assetChartRef = ref<HTMLDivElement>()
const performanceChartRef = ref<HTMLDivElement>()

// 图表数据
const chartData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  values: [1200000, 1250000, 1280000, 1320000, 1350000, 1380000, 1420000, 1450000, 1480000, 1520000, 1560000, 1586450]
}

onMounted(() => {
  initCharts()
})

// 初始化图表
const initCharts = () => {
  // 资产趋势图
  if (assetChartRef.value) {
    const assetChart = echarts.init(assetChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0]
          return `${param.name}<br/>资产总额: ¥${param.value.toLocaleString()}`
        }
      },
      xAxis: {
        type: 'category',
        data: chartData.dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 10000).toFixed(0)}万`
        }
      },
      series: [{
        data: chartData.values,
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        lineStyle: {
          width: 3
        }
      }],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }
    assetChart.setOption(option)
    
    // 响应式调整
    window.addEventListener('resize', () => {
      assetChart.resize()
    })
  }

  // 收益表现图
  if (performanceChartRef.value) {
    const performanceChart = echarts.init(performanceChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center'
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
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 45, name: '股票' },
            { value: 25, name: '基金' },
            { value: 15, name: '债券' },
            { value: 10, name: '现金' },
            { value: 5, name: '其他' }
          ]
        }
      ]
    }
    performanceChart.setOption(option)
    
    window.addEventListener('resize', () => {
      performanceChart.resize()
    })
  }
}
</script>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="mb-20">
      <ElCol 
        v-for="(stat, index) in statistics" 
        :key="index" 
        :xs="24" 
        :sm="12" 
        :md="6"
      >
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
      </ElCol>
    </ElRow>

    <!-- 图表区域 -->
    <ElRow :gutter="20">
      <!-- 资产趋势图 -->
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

      <!-- 资产配置图 -->
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

    <!-- 快捷操作 -->
    <ElRow :gutter="20" class="mt-20">
      <ElCol :xs="24" :sm="12" :md="6">
        <ElCard class="quick-action-card" shadow="hover">
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
        <ElCard class="quick-action-card" shadow="hover">
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
        <ElCard class="quick-action-card" shadow="hover">
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
        <ElCard class="quick-action-card" shadow="hover">
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
  .stat-card {
    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.trend-up {
      color: $finance-green;
    }
    
    &.trend-down {
      color: $finance-red;
    }
  }

  .trend-icon {
    font-size: 14px;
  }

  .chart-card {
    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    
    .header-icon {
      color: var(--el-color-primary);
    }
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
    
    &:hover {
      transform: translateY(-4px);
    }
    
    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .quick-action {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .action-icon {
      font-size: 32px;
      color: var(--el-color-primary);
      flex-shrink: 0;
    }
    
    .action-content {
      h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
      
      p {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .mb-20 {
    margin-bottom: 20px;
  }

  .mt-20 {
    margin-top: 20px;
  }
}
</style>