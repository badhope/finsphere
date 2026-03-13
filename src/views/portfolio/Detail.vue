<script setup lang="ts">
import { ArrowUp, ArrowDown, Back } from '@element-plus/icons-vue'
import {
  ElCard,
  ElRow,
  ElCol,
  ElStatistic,
  ElTable,
  ElTableColumn,
  ElButton,
  ElMessage,
} from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import { FinanceAPI } from '@/api/finance'
import type { Portfolio, PortfolioAsset } from '@/types/finance'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const portfolio = ref<Portfolio | null>(null)
const assets = ref<PortfolioAsset[]>([])

const loadPortfolioDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('组合ID不存在')
    return
  }

  loading.value = true
  try {
    const response = await FinanceAPI.getPortfolio(id)
    portfolio.value = response
    assets.value = response.assets || []
  } catch (error) {
    console.error('Failed to load portfolio:', error)
    ElMessage.error('加载组合详情失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push('/portfolio/list')
}

onMounted(() => {
  loadPortfolioDetail()
})
</script>

<template>
  <div class="portfolio-detail">
    <ElCard v-loading="loading" class="header-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <ElButton :icon="Back" @click="handleBack">返回</ElButton>
            <h2 class="portfolio-name">{{ portfolio?.name || '组合详情' }}</h2>
          </div>
        </div>
      </template>

      <ElRow v-if="portfolio" :gutter="20">
        <ElCol :span="6">
          <ElStatistic title="总市值" :value="portfolio.totalValue" prefix="¥" :precision="2" />
        </ElCol>
        <ElCol :span="6">
          <div class="statistic-wrapper">
            <ElStatistic
              title="今日盈亏"
              :value="portfolio.totalChange"
              prefix="¥"
              :precision="2"
            />
            <div :class="portfolio.totalChange >= 0 ? 'trend-up' : 'trend-down'">
              <component :is="portfolio.totalChange >= 0 ? ArrowUp : ArrowDown" />
              <span>{{ Math.abs(portfolio.totalChangePercent).toFixed(2) }}%</span>
            </div>
          </div>
        </ElCol>
        <ElCol :span="6">
          <ElStatistic title="持仓数量" :value="assets.length" suffix="只" />
        </ElCol>
        <ElCol :span="6">
          <ElStatistic
            title="收益率"
            :value="portfolio.totalChangePercent"
            suffix="%"
            :precision="2"
          />
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard class="assets-card" style="margin-top: 20px">
      <template #header>
        <span class="card-title">持仓明细</span>
      </template>

      <ElTable :data="assets" stripe>
        <ElTableColumn prop="assetId" label="资产代码" min-width="100" />
        <ElTableColumn prop="quantity" label="持仓数量" min-width="100">
          <template #default="{ row }">
            {{ row.quantity?.toLocaleString() }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="averageCost" label="成本价" min-width="100">
          <template #default="{ row }"> ¥{{ row.averageCost?.toFixed(2) }} </template>
        </ElTableColumn>
        <ElTableColumn prop="currentPrice" label="现价" min-width="100">
          <template #default="{ row }"> ¥{{ row.currentPrice?.toFixed(2) }} </template>
        </ElTableColumn>
        <ElTableColumn prop="currentValue" label="市值" min-width="120">
          <template #default="{ row }"> ¥{{ row.currentValue?.toLocaleString() }} </template>
        </ElTableColumn>
        <ElTableColumn prop="profitLoss" label="盈亏" min-width="120">
          <template #default="{ row }">
            <span :class="row.profitLoss >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.profitLoss >= 0 ? '+' : '' }}¥{{ row.profitLoss?.toLocaleString() }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="profitLossPercent" label="收益率" min-width="100">
          <template #default="{ row }">
            <span :class="row.profitLossPercent >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.profitLossPercent >= 0 ? '+' : '' }}{{ row.profitLossPercent?.toFixed(2) }}%
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.portfolio-detail {
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

        .portfolio-name {
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

  .assets-card {
    .card-title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .finance-positive {
    color: #f56c6c;
    font-weight: 500;
  }

  .finance-negative {
    color: #67c23a;
    font-weight: 500;
  }
}
</style>
