<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Dashboard from './views/dashboard/Index.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 初始化应用
onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  
  // 检查用户认证状态
  userStore.checkAuthStatus()
  
  // 设置页面标题
  document.title = import.meta.env.VITE_APP_TITLE
  
  // 移除加载动画
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
    <Dashboard />
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>