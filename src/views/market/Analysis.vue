<script setup lang="ts">
import { ArrowUp, ArrowDown, Back } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {
  ElCard,
  ElRow,
  ElCol,
  ElStatistic,
  ElButton,
  ElMessage,
} from 'element-plus'
import { onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { FinanceAPI } from '@/api/finance'
import type { MarketData, CandlestickData } from '@/types/finance'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const symbol = ref('')
const marketData = ref<MarketData | null>(null)
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const loadMarketData = async () => {
  symbol.value = route.params.symbol as string
  if (!symbol.value) {
    ElMessage.error('股票代码不存在')
    return
  }

  loading.value = true
  try {
    const data = await FinanceAPI.getMarketData([symbol.value])
    marketData.value = data[0] || null
    await loadChartData()
  } catch (error) {
    console.error('Failed to load market data:', error)
    ElMessage.error('加载行情数据失败')
  } finally {
    loading.value = false
  }
}

const loadChartData = async () => {
  try {
    const klineData = await FinanceAPI.getCandlestickData(symbol.value, '1d', 60)
    renderChart(klineData)
  } catch (error) {
    console.error('Failed to load chart data:', error)
  }
}

const renderChart = (data: CandlestickData[]) => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['K线', '成交量'],
    },
    grid: [
      { left: '10%', right: '8%', height: '50%' },
      { left: '10%', right: '8%', top: '65%', height: '20%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: data.map(item => new Date(item.timestamp).toLocaleDateString()),
        boundaryGap: false,
        axisLine: { onZero: false },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.map(item => new Date(item.timestamp).toLocaleDateString()),
        boundaryGap: false,
        axisLine: { onZero: false },
      },
    ],
    yAxis: [
      { scale: true, splitArea: { show: true } },
      { scale: true, gridIndex: 1, splitNumber: 2 },
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: data.map(item => [item.open, item.close, item.low, item.high]),
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.map(item => item.volume),
      },
    ],
  }

  chartInstance.setOption(option)
}

const handleBack = () => {
  router.push('/market/watchlist')
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  loadMarketData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="market-analysis">
    <ElCard v-loading="loading" class="header-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <ElButton :icon="Back" @click="handleBack">返回</ElButton>
            <h2 class="stock-name">{{ marketData?.symbol || symbol }}</h2>
          </div>
        </div>
      </template>

      <ElRow v-if="marketData" :gutter="20">
        <ElCol :span="4">
          <ElStatistic title="最新价" :value="marketData.price" prefix="¥" :precision="2" />
        </ElCol>
        <ElCol :span="4">
          <div class="statistic-wrapper">
            <ElStatistic title="涨跌额" :value="marketData.change" :precision="2" />
            <div :class="marketData.change >= 0 ? 'trend-up' : 'trend-down'">
              <component :is="marketData.change >= 0 ? ArrowUp : ArrowDown" />
              <span>{{ Math.abs(marketData.changePercent).toFixed(2) }}%</span>
            </div>
          </div>
        </ElCol>
        <ElCol :span="4">
          <ElStatistic title="最高" :value="marketData.high" prefix="¥" :precision="2" />
        </ElCol>
        <ElCol :span="4">
          <ElStatistic title="最低" :value="marketData.low" prefix="¥" :precision="2" />
        </ElCol>
        <ElCol :span="4">
          <ElStatistic title="开盘" :value="marketData.open" prefix="¥" :precision="2" />
        </ElCol>
        <ElCol :span="4">
          <ElStatistic
            title="成交量"
            :value="marketData.volume / 10000"
            suffix="万"
            :precision="0"
          />
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard class="chart-card" style="margin-top: 20px">
      <template #header>
        <span class="card-title">K线图</span>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.market-analysis {
  padding: 20px;

  .header-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .stock-name {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }

  .statistic-wrapper {
    position: relative;

    .trend-up,
    .trend-down {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      font-size: 12px;
    }

    .trend-up {
      color: #f56c6c;
    }

    .trend-down {
      color: #67c23a;
    }
  }

  .chart-card {
    .card-title {
      font-size: 16px;
      font-weight: 600;
    }

    .chart-container {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
