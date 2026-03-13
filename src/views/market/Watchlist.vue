<script setup lang="ts">
import { Search, Star, StarFilled, Delete } from '@element-plus/icons-vue'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElMessage,
  ElTag,
  ElEmpty,
} from 'element-plus'

import { FinanceAPI } from '@/api/finance'
import type { FinancialAsset } from '@/types/finance'

const loading = ref(false)
const searchQuery = ref('')
const watchlist = ref<FinancialAsset[]>([])

const loadWatchlist = async () => {
  loading.value = true
  try {
    const response = await FinanceAPI.getAssets({ page: 1, pageSize: 50 })
    watchlist.value = response.items
  } catch (error) {
    console.error('Failed to load watchlist:', error)
    ElMessage.error('加载自选股失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    loadWatchlist()
    return
  }

  loading.value = true
  try {
    const response = await FinanceAPI.getAssets({
      page: 1,
      pageSize: 50,
      search: searchQuery.value,
    })
    watchlist.value = response.items
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

const handleViewAnalysis = (symbol: string) => {
  window.location.href = `/market/analysis/${symbol}`
}

const handleRemove = (asset: FinancialAsset) => {
  const index = watchlist.value.findIndex(item => item.id === asset.id)
  if (index > -1) {
    watchlist.value.splice(index, 1)
    ElMessage.success('已从自选股移除')
  }
}

onMounted(() => {
  loadWatchlist()
})
</script>

<template>
  <div class="watchlist">
    <ElCard class="watchlist-card">
      <template #header>
        <div class="card-header">
          <span class="title">自选股</span>
          <div class="search-wrapper">
            <ElInput
              v-model="searchQuery"
              placeholder="搜索股票代码或名称"
              :prefix-icon="Search"
              clearable
              style="width: 300px"
              @keyup.enter="handleSearch"
              @clear="loadWatchlist"
            />
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
          </div>
        </div>
      </template>

      <ElTable v-loading="loading" :data="watchlist" stripe>
        <ElTableColumn prop="symbol" label="代码" min-width="100" />
        <ElTableColumn prop="name" label="名称" min-width="120" />
        <ElTableColumn prop="currentPrice" label="现价" min-width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.currentPrice?.toFixed(2) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="change" label="涨跌额" min-width="100">
          <template #default="{ row }">
            <span :class="row.change >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.change >= 0 ? '+' : '' }}{{ row.change?.toFixed(2) }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="changePercent" label="涨跌幅" min-width="100">
          <template #default="{ row }">
            <span :class="row.changePercent >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.changePercent >= 0 ? '+' : '' }}{{ row.changePercent?.toFixed(2) }}%
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="volume" label="成交量" min-width="100">
          <template #default="{ row }"> {{ (row.volume / 10000).toFixed(0) }}万 </template>
        </ElTableColumn>
        <ElTableColumn prop="marketCap" label="市值" min-width="120">
          <template #default="{ row }">
            {{ row.marketCap ? (row.marketCap / 100000000).toFixed(2) + '亿' : '-' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" link size="small" @click="handleViewAnalysis(row.symbol)">
              分析
            </ElButton>
            <ElButton type="danger" link size="small" :icon="Delete" @click="handleRemove(row)">
              移除
            </ElButton>
          </template>
        </ElTableColumn>
        <template #empty>
          <ElEmpty description="暂无自选股" />
        </template>
      </ElTable>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.watchlist {
  padding: 20px;

  .watchlist-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 18px;
        font-weight: 600;
      }

      .search-wrapper {
        display: flex;
        gap: 10px;
      }
    }
  }

  .price {
    font-weight: 600;
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
