<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { RouterView } from 'vue-router'

const appStore = useAppStore()
const userStore = useUserStore()

onMounted(() => {
  userStore.checkAuthStatus()

  document.title = import.meta.env.VITE_APP_TITLE

  const loadingEl = document.querySelector('.loading-container')
  if (loadingEl) {
    loadingEl.style.opacity = '0'
    setTimeout(() => {
      loadingEl.remove()
    }, 300)
  }
})
</script>

<template>
  <ElConfigProvider :locale="zhCn" :size="appStore.elementSize">
    <RouterView />
  </ElConfigProvider>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e4e7ed;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
