<template>
  <div class="web-manager">
    <!-- 顶部导航栏 -->
    <div class="header">
      <h1>🚀 FinSphere Pro 管理面板</h1>
      <div class="status-indicators">
        <span class="status-item" :class="{ 'active': isServerRunning }">
          🔧 服务器: {{ isServerRunning ? '运行中' : '已停止' }}
        </span>
        <span class="status-item" :class="{ 'active': isEnvironmentReady }">
          🌍 环境: {{ isEnvironmentReady ? '就绪' : '配置中' }}
        </span>
      </div>
    </div>

    <!-- 主要操作区域 -->
    <div class="main-content">
      <!-- 快速操作卡片 -->
      <div class="quick-actions">
        <div class="card" @click="startDevelopment">
          <div class="card-icon">🎮</div>
          <h3>启动开发服务器</h3>
          <p>一键启动本地开发环境</p>
          <button class="primary-btn" :disabled="isServerRunning">
            {{ isServerRunning ? '已运行' : '立即启动' }}
          </button>
        </div>

        <div class="card" @click="runEnvironmentCheck">
          <div class="card-icon">🔍</div>
          <h3>环境状态检测</h3>
          <p>全面检查项目环境状态</p>
          <button class="secondary-btn">
            开始检测
          </button>
        </div>

        <div class="card" @click="autoConfigure">
          <div class="card-icon">🔧</div>
          <h3>自动环境配置</h3>
          <p>一键配置完整开发环境</p>
          <button class="warning-btn" :disabled="isConfiguring">
            {{ isConfiguring ? '配置中...' : '开始配置' }}
          </button>
        </div>

        <div class="card" @click="openDocumentation">
          <div class="card-icon">📚</div>
          <h3>使用文档</h3>
          <p>查看详细使用说明</p>
          <button class="info-btn">
            查看文档
          </button>
        </div>
      </div>

      <!-- 实时日志显示 -->
      <div class="log-section">
        <div class="section-header">
          <h2>📋 实时日志</h2>
          <div class="log-controls">
            <button @click="clearLogs" class="small-btn">清空日志</button>
            <button @click="toggleAutoScroll" class="small-btn">
              {{ autoScroll ? '暂停滚动' : '自动滚动' }}
            </button>
          </div>
        </div>
        <div class="log-container" ref="logContainer">
          <div 
            v-for="(log, index) in logs" 
            :key="index" 
            class="log-entry"
            :class="log.type"
          >
            <span class="timestamp">[{{ log.timestamp }}]</span>
            <span class="log-type">{{ getLogIcon(log.type) }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>

      <!-- 环境状态概览 -->
      <div class="status-overview">
        <h2>📊 环境状态概览</h2>
        <div class="status-grid">
          <div class="status-card" :class="getStatusClass(systemStatus.nodejs)">
            <div class="status-icon">🟢</div>
            <div class="status-info">
              <h4>Node.js</h4>
              <p>{{ systemStatus.nodejs.message }}</p>
            </div>
          </div>
          
          <div class="status-card" :class="getStatusClass(systemStatus.npm)">
            <div class="status-icon">📦</div>
            <div class="status-info">
              <h4>NPM 包</h4>
              <p>{{ systemStatus.npm.message }}</p>
            </div>
          </div>
          
          <div class="status-card" :class="getStatusClass(systemStatus.environment)">
            <div class="status-icon">⚙️</div>
            <div class="status-info">
              <h4>环境配置</h4>
              <p>{{ systemStatus.environment.message }}</p>
            </div>
          </div>
          
          <div class="status-card" :class="getStatusClass(systemStatus.security)">
            <div class="status-icon">🔒</div>
            <div class="status-info">
              <h4>安全配置</h4>
              <p>{{ systemStatus.security.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>FinSphere Pro 智能管理面板 | 让前端开发更简单 🚀</p>
      <div class="quick-links">
        <a href="#" @click="openGitHub">GitHub</a>
        <a href="#" @click="openIssues">问题反馈</a>
        <a href="#" @click="openDocs">官方文档</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'

// 状态管理
const isServerRunning = ref(false)
const isEnvironmentReady = ref(false)
const isConfiguring = ref(false)
const autoScroll = ref(true)
const logs = ref<Array<{timestamp: string, type: string, message: string}>>([])

// 系统状态
const systemStatus = reactive({
  nodejs: { status: 'checking', message: '检测中...' },
  npm: { status: 'checking', message: '检测中...' },
  environment: { status: 'checking', message: '检测中...' },
  security: { status: 'checking', message: '检测中...' }
})

// 日志容器引用
const logContainer = ref<HTMLElement | null>(null)

// 方法定义
const addLog = (message: string, type: string = 'info') => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push({ timestamp, type, message })
  
  // 限制日志数量
  if (logs.value.length > 100) {
    logs.value.shift()
  }
  
  // 自动滚动到底部
  if (autoScroll.value) {
    nextTick(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight
      }
    })
  }
}

const getLogIcon = (type: string) => {
  const icons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  return icons[type] || '🔹'
}

const getStatusClass = (status: {status: string}) => {
  return {
    'status-ok': status.status === 'ok',
    'status-warning': status.status === 'warning',
    'status-error': status.status === 'error',
    'status-checking': status.status === 'checking'
  }
}

// 操作方法
const startDevelopment = async () => {
  if (isServerRunning.value) return
  
  addLog('正在启动开发服务器...', 'info')
  try {
    // 这里应该调用实际的启动命令
    // 模拟启动过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    isServerRunning.value = true
    addLog('开发服务器启动成功！访问地址: http://localhost:3000', 'success')
  } catch (error) {
    addLog(`启动失败: ${error}`, 'error')
  }
}

const runEnvironmentCheck = async () => {
  addLog('开始环境检测...', 'info')
  
  // 模拟检测过程
  const checks = [
    { name: 'Node.js环境', delay: 800 },
    { name: 'NPM包状态', delay: 600 },
    { name: '配置文件', delay: 400 },
    { name: '安全配置', delay: 500 }
  ]
  
  for (const check of checks) {
    addLog(`检测 ${check.name}...`, 'info')
    await new Promise(resolve => setTimeout(resolve, check.delay))
    addLog(`${check.name} 检测完成`, 'success')
  }
  
  addLog('环境检测完成！', 'success')
}

const autoConfigure = async () => {
  if (isConfiguring.value) return
  
  isConfiguring.value = true
  addLog('开始自动环境配置...', 'warning')
  
  try {
    // 模拟配置过程
    const steps = [
      '检查系统环境...',
      '下载 Node.js...',
      '安装 NPM 包...',
      '配置开发工具...',
      '设置环境变量...'
    ]
    
    for (let i = 0; i < steps.length; i++) {
      addLog(steps[i], 'info')
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    }
    
    addLog('环境配置完成！🎉', 'success')
    isEnvironmentReady.value = true
  } catch (error) {
    addLog(`配置失败: ${error}`, 'error')
  } finally {
    isConfiguring.value = false
  }
}

const openDocumentation = () => {
  addLog('打开使用文档...', 'info')
  // 这里应该打开实际的文档页面
}

const clearLogs = () => {
  logs.value = []
  addLog('日志已清空', 'info')
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
  addLog(`自动滚动${autoScroll.value ? '已启用' : '已禁用'}`, 'info')
}

const openGitHub = (e: Event) => {
  e.preventDefault()
  addLog('打开 GitHub 仓库...', 'info')
}

const openIssues = (e: Event) => {
  e.preventDefault()
  addLog('打开问题反馈页面...', 'info')
}

const openDocs = (e: Event) => {
  e.preventDefault()
  addLog('打开官方文档...', 'info')
}

// 初始化
onMounted(() => {
  addLog('欢迎使用 FinSphere Pro 管理面板！', 'success')
  addLog('点击上方卡片开始您的开发之旅 🚀', 'info')
  
  // 模拟初始状态检测
  setTimeout(() => {
    systemStatus.nodejs = { status: 'ok', message: 'v18.18.0 已安装' }
    systemStatus.npm = { status: 'warning', message: '部分包需要更新' }
    systemStatus.environment = { status: 'ok', message: '配置完整' }
    systemStatus.security = { status: 'warning', message: '建议启用HTTPS' }
  }, 1000)
})
</script>

<style scoped>
.web-manager {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.status-indicators {
  display: flex;
  gap: 15px;
}

.status-item {
  padding: 8px 15px;
  border-radius: 20px;
  background: #ecf0f1;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.status-item.active {
  background: #27ae60;
  color: white;
}

.main-content {
  display: grid;
  gap: 30px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.card p {
  color: #7f8c8d;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.primary-btn, .secondary-btn, .warning-btn, .info-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.primary-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #2980b9, #1f618d);
  transform: scale(1.05);
}

.secondary-btn {
  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  color: white;
}

.warning-btn {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
}

.info-btn {
  background: linear-gradient(45deg, #1abc9c, #16a085);
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.log-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.log-controls {
  display: flex;
  gap: 10px;
}

.small-btn {
  padding: 8px 15px;
  border: 1px solid #bdc3c7;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.small-btn:hover {
  background: #ecf0f1;
}

.log-container {
  height: 300px;
  overflow-y: auto;
  background: #2c3e50;
  border-radius: 10px;
  padding: 15px;
  font-family: 'Courier New', monospace;
}

.log-entry {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.log-entry.info { background: rgba(52, 152, 219, 0.2); color: #3498db; }
.log-entry.success { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
.log-entry.warning { background: rgba(241, 196, 15, 0.2); color: #f39c12; }
.log-entry.error { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

.timestamp {
  font-size: 0.8rem;
  opacity: 0.8;
  min-width: 80px;
}

.log-type {
  font-size: 1.2rem;
}

.status-overview {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.status-overview h2 {
  margin-top: 0;
  color: #2c3e50;
  text-align: center;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.status-card.status-ok { background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; }
.status-card.status-warning { background: linear-gradient(45deg, #f39c12, #e67e22); color: white; }
.status-card.status-error { background: linear-gradient(45deg, #e74c3c, #c0392b); color: white; }
.status-card.status-checking { background: linear-gradient(45deg, #95a5a6, #7f8c8d); color: white; }

.status-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.status-info h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.status-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.footer p {
  margin: 0 0 15px 0;
  color: #7f8c8d;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.quick-links a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-links a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .status-indicators {
    justify-content: center;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .log-controls {
    width: 100%;
    justify-content: center;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>