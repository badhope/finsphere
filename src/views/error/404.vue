<script setup lang="ts">
import { ElCard, ElResult, ElButton } from 'element-plus'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <ElCard class="not-found-card">
      <ElResult status="404" title="404" sub-title="抱歉，您访问的页面不存在">
        <template #extra>
          <ElButton type="primary" @click="goHome"> 返回首页 </ElButton>
        </template>
      </ElResult>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: var(--el-bg-color-page);
}

.not-found-card {
  width: 100%;
  max-width: 500px;

  :deep(.el-card__body) {
    padding: 40px 20px;
  }
}
</style>
