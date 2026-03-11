<script setup lang="ts">
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElMessage,
  ElTag,
  ElEmpty,
} from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { FinanceAPI } from '@/api/finance'
import type { Transaction } from '@/types/finance'

const loading = ref(false)
const transactions = ref<Transaction[]>([])
const total = ref(0)
const pagination = reactive({
  page: 1,
  pageSize: 10,
})

const dateRange = ref<[Date, Date] | null>(null)
const transactionType = ref('')

const loadTransactions = async () => {
  loading.value = true
  try {
    const response = await FinanceAPI.getTransactions({
      ...pagination,
      type: transactionType.value || undefined,
      startDate: dateRange.value?.[0]?.toISOString(),
      endDate: dateRange.value?.[1]?.toISOString(),
    })
    transactions.value = response.items
    total.value = response.total
  } catch (error) {
    console.error('Failed to load transactions:', error)
    ElMessage.error('加载交易记录失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadTransactions()
}

const handleReset = () => {
  dateRange.value = null
  transactionType.value = ''
  pagination.page = 1
  loadTransactions()
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadTransactions()
}

const handlePageSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadTransactions()
}

const getTransactionTypeTag = (type: string) => {
  const typeMap: Record<
    string,
    { type: 'success' | 'danger' | 'warning' | 'info'; label: string }
  > = {
    BUY: { type: 'danger', label: '买入' },
    SELL: { type: 'success', label: '卖出' },
    DIVIDEND: { type: 'warning', label: '分红' },
    INTEREST: { type: 'info', label: '利息' },
  }
  return typeMap[type] || { type: 'info', label: type }
}

onMounted(() => {
  loadTransactions()
})
</script>

<template>
  <div class="trade-history">
    <ElCard class="history-card">
      <template #header>
        <div class="card-header">
          <span class="title">交易历史</span>
          <div class="filter-wrapper">
            <ElDatePicker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 260px"
            />
            <ElSelect
              v-model="transactionType"
              placeholder="交易类型"
              clearable
              style="width: 120px"
            >
              <ElOption label="买入" value="BUY" />
              <ElOption label="卖出" value="SELL" />
              <ElOption label="分红" value="DIVIDEND" />
              <ElOption label="利息" value="INTEREST" />
            </ElSelect>
            <ElButton type="primary" @click="handleSearch">查询</ElButton>
            <ElButton @click="handleReset">重置</ElButton>
            <ElButton type="success" :icon="Download" @click="handleExport">导出</ElButton>
          </div>
        </div>
      </template>

      <ElTable :data="transactions" v-loading="loading" stripe>
        <ElTableColumn prop="assetId" label="资产代码" min-width="100" />
        <ElTableColumn prop="type" label="交易类型" min-width="80">
          <template #default="{ row }">
            <ElTag :type="getTransactionTypeTag(row.type).type" size="small">
              {{ getTransactionTypeTag(row.type).label }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="quantity" label="数量" min-width="100">
          <template #default="{ row }">
            {{ row.quantity?.toLocaleString() }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="price" label="价格" min-width="100">
          <template #default="{ row }"> ¥{{ row.price?.toFixed(2) }} </template>
        </ElTableColumn>
        <ElTableColumn prop="totalAmount" label="金额" min-width="120">
          <template #default="{ row }">
            <span :class="row.type === 'BUY' ? 'finance-negative' : 'finance-positive'">
              {{ row.type === 'BUY' ? '-' : '+' }}¥{{ row.totalAmount?.toLocaleString() }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="fee" label="手续费" min-width="80">
          <template #default="{ row }"> ¥{{ row.fee?.toFixed(2) }} </template>
        </ElTableColumn>
        <ElTableColumn prop="date" label="交易时间" min-width="150">
          <template #default="{ row }">
            {{ new Date(row.date).toLocaleString() }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="notes" label="备注" min-width="150" show-overflow-tooltip />
        <template #empty>
          <ElEmpty description="暂无交易记录" />
        </template>
      </ElTable>

      <div class="pagination-wrapper">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.trade-history {
  padding: 20px;

  .history-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .title {
        font-size: 18px;
        font-weight: 600;
      }

      .filter-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
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

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
