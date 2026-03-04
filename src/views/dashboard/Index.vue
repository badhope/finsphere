<script setup lang="ts">
import { ElCard, ElRow, ElCol, ElStatistic, ElDatePicker, ElMessage } from 'element-plus'
import { ArrowUp, ArrowDown, User, Coin, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'

const { t } = useI18n()

// 检查配置状态
const checkConfig = (feature: string) => {
  // 模拟配置检查逻辑
  const configStatus = {
    buy: false, // 买入资产功能未配置
    analysis: true, // 市场分析功能已配置
    profile: true, // 个人中心功能已配置
    report: false // 投资报告功能未配置
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

// 快捷操作处理函数
const handleQuickAction = (action: string) => {
  if (!checkConfig(action)) {
    return
  }
  
  // 这里可以添加实际的功能逻辑
  ElMessage.success(`执行${action}操作`)
}

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

// 图表实例
let assetChart: any = null
let performanceChart: any = null

// 图表数据
const chartData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  values: [1200000, 1250000, 1280000, 1320000, 1350000, 1380000, 1420000, 1450000, 1480000, 1520000, 1560000, 1586450]
}

// 懒加载echarts
const loadECharts = async () => {
  const echarts = await import('echarts')
  return echarts.default
}

// 初始化图表
const initCharts = async () => {
  try {
    const echarts = await loadECharts()
    
    // 资产趋势图
    if (assetChartRef.value) {
      assetChart = echarts.init(assetChartRef.value)
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
      const handleResize = () => {
        assetChart?.resize()
        performanceChart?.resize()
      }
      
      window.addEventListener('resize', handleResize)
      
      // 在组件卸载时移除事件监听器
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
      })
    }

    // 收益表现图
    if (performanceChartRef.value) {
      performanceChart = echarts.init(performanceChartRef.value)
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
    }
  } catch (error) {
    console.error('Failed to load echarts:', error)
  }
}

onMounted(() => {
  // 延迟初始化图表，优先加载页面内容
  setTimeout(initCharts, 100)
})

onUnmounted(() => {
  // 清理图表实例和事件监听器
  if (assetChart) {
    assetChart.dispose()
  }
  if (performanceChart) {
    performanceChart.dispose()
  }
});</script>

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

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &.trend-up {
      color: $finance-green;
      animation: trend-up 0.5s ease;
      
      @keyframes trend-up {
        from {
          transform: translateY(5px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
    
    &.trend-down {
      color: $finance-red;
      animation: trend-down 0.5s ease;
      
      @keyframes trend-down {
        from {
          transform: translateY(-5px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }

  .trend-icon {
    font-size: 14px;
    transition: transform 0.3s ease;
    
    .stat-card:hover & {
      transform: scale(1.2);
    }
  }

  .chart-card {
    :deep(.el-card__body) {
      padding: 0;
    }
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    
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
    
    .header-icon {
      color: var(--el-color-primary);
      font-size: 18px;
      transition: transform 0.3s ease;
      
      .chart-card:hover & {
        transform: rotate(10deg);
      }
    }
  }

  .chart-container {
    height: 300px;
    width: 100%;
    transition: height 0.3s ease;
    
    &.pie-chart {
      height: 350px;
    }
    
    .chart-card:hover & {
      height: 320px;
      
      &.pie-chart {
        height: 370px;
      }
    }
  }

  .quick-action-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      
      &::before {
        opacity: 1;
      }
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
      transition: all 0.3s ease;
      
      .quick-action-card:hover & {
        transform: scale(1.2) rotate(10deg);
        color: #667eea;
      }
    }
    
    .action-content {
      h3 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        transition: color 0.3s ease;
        
        .quick-action-card:hover & {
          color: #667eea;
        }
      }
      
      p {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
        transition: color 0.3s ease;
        
        .quick-action-card:hover & {
          color: var(--el-text-color-primary);
        }
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