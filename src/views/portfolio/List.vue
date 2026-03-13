<script setup lang="ts">
import { Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElTag,
  ElEmpty,
} from 'element-plus'

import { FinanceAPI } from '@/api/finance'
import type { Portfolio } from '@/types/finance'

const router = useRouter()

const loading = ref(false)
const portfolios = ref<Portfolio[]>([])
const total = ref(0)
const pagination = reactive({
  page: 1,
  pageSize: 10,
})

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const formData = reactive({
  id: '',
  name: '',
  description: '',
})

const formRules = {
  name: [
    { required: true, message: '请输入组合名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度应在2-50个字符之间', trigger: 'blur' },
  ],
}

const loadPortfolios = async () => {
  loading.value = true
  try {
    const response = await FinanceAPI.getPortfolios(pagination)
    portfolios.value = response.items
    total.value = response.total
  } catch (error) {
    console.error('Failed to load portfolios:', error)
    ElMessage.error('加载组合列表失败')
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  dialogType.value = 'create'
  formData.id = ''
  formData.name = ''
  formData.description = ''
  dialogVisible.value = true
}

const handleEdit = (row: Portfolio) => {
  dialogType.value = 'edit'
  formData.id = row.id
  formData.name = row.name
  formData.description = ''
  dialogVisible.value = true
}

const handleView = (row: Portfolio) => {
  router.push(`/portfolio/detail/${row.id}`)
}

const handleDelete = async (row: Portfolio) => {
  try {
    await FinanceAPI.deletePortfolio(row.id)
    ElMessage.success('删除成功')
    loadPortfolios()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (dialogType.value === 'create') {
          await FinanceAPI.createPortfolio({
            name: formData.name,
            description: formData.description,
          })
          ElMessage.success('创建成功')
        } else {
          await FinanceAPI.updatePortfolio(formData.id, {
            name: formData.name,
            description: formData.description,
          })
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        loadPortfolios()
      } catch (error) {
        ElMessage.error(dialogType.value === 'create' ? '创建失败' : '更新失败')
      }
    }
  })
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadPortfolios()
}

const handlePageSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadPortfolios()
}

onMounted(() => {
  loadPortfolios()
})
</script>

<template>
  <div class="portfolio-list">
    <ElCard class="list-card">
      <template #header>
        <div class="card-header">
          <span class="title">投资组合</span>
          <ElButton type="primary" :icon="Plus" @click="handleCreate"> 新建组合 </ElButton>
        </div>
      </template>

      <ElTable v-loading="loading" :data="portfolios" stripe>
        <ElTableColumn prop="name" label="组合名称" min-width="150" />
        <ElTableColumn prop="totalValue" label="总市值" min-width="120">
          <template #default="{ row }">
            <span class="finance-value">¥{{ row.totalValue?.toLocaleString() || '0' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="totalChange" label="今日盈亏" min-width="120">
          <template #default="{ row }">
            <span :class="row.totalChange >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.totalChange >= 0 ? '+' : '' }}¥{{ row.totalChange?.toLocaleString() || '0' }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="totalChangePercent" label="收益率" min-width="100">
          <template #default="{ row }">
            <span :class="row.totalChangePercent >= 0 ? 'finance-positive' : 'finance-negative'">
              {{ row.totalChangePercent >= 0 ? '+' : ''
              }}{{ row.totalChangePercent?.toFixed(2) || '0' }}%
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="创建时间" min-width="150">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleDateString() }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" link :icon="View" @click="handleView(row)">查看</ElButton>
            <ElButton type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</ElButton>
            <ElButton type="danger" link :icon="Delete" @click="handleDelete(row)">删除</ElButton>
          </template>
        </ElTableColumn>
        <template #empty>
          <ElEmpty description="暂无投资组合" />
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

    <ElDialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建组合' : '编辑组合'"
      width="500px"
    >
      <ElForm ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <ElFormItem label="名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入组合名称" />
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入组合描述（可选）"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.portfolio-list {
  padding: 20px;

  .list-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .finance-value {
    font-weight: 500;
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
