<template>
  <div class="demo-showcase">
    <!-- 顶部展示区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">🌟 FinSphere Pro 功能演示</h1>
        <p class="hero-subtitle">一站式金融数据管理平台</p>
        <div class="feature-tags">
          <span class="tag">Vue 3</span>
          <span class="tag">TypeScript</span>
          <span class="tag">ECharts</span>
          <span class="tag">Ant Design</span>
        </div>
      </div>
    </div>

    <!-- 功能展示区域 -->
    <div class="features-section">
      <h2>🚀 核心功能展示</h2>
      
      <div class="feature-grid">
        <!-- 数据可视化 -->
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>数据可视化</h3>
          <p>使用ECharts实现专业的金融数据图表展示，支持实时数据更新和交互操作。</p>
          <div class="demo-chart">
            <div class="chart-placeholder">
              📈 资产趋势图占位符<br/>
              （实际项目中会显示真实的ECharts图表）
            </div>
          </div>
        </div>

        <!-- 权限管理 -->
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>权限控制系统</h3>
          <p>基于RBAC的完整权限管理体系，支持角色动态路由和细粒度权限控制。</p>
          <div class="permission-demo">
            <div class="role-selector">
              <label>切换用户角色：</label>
              <select v-model="currentRole" @change="handleRoleChange">
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
                <option value="guest">访客</option>
              </select>
            </div>
            <div class="menu-preview">
              <div v-for="item in getMenuItems()" :key="item.key" 
                   class="menu-item" 
                   :class="{ 'accessible': item.accessible }">
                {{ item.name }}
                <span class="access-indicator" :class="{ 'yes': item.accessible, 'no': !item.accessible }">
                  {{ item.accessible ? '✓' : '✗' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 响应式设计 -->
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>响应式设计</h3>
          <p>适配各种设备屏幕，从桌面到移动端都能提供优秀的用户体验。</p>
          <div class="responsive-demo">
            <div class="device-screens">
              <div class="screen desktop">
                <div class="screen-label">🖥️ 桌面端</div>
                <div class="screen-content">完整功能展示</div>
              </div>
              <div class="screen tablet">
                <div class="screen-label">📱 平板端</div>
                <div class="screen-content">优化布局</div>
              </div>
              <div class="screen mobile">
                <div class="screen-label">📱 手机端</div>
                <div class="screen-content">简洁界面</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 开发体验 -->
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>开发者友好</h3>
          <p>完善的TypeScript支持、热重载、组件化架构，提升开发效率。</p>
          <div class="dev-tools">
            <div class="tool-item">
              <span class="tool-icon">🔄</span>
              <span>热重载</span>
            </div>
            <div class="tool-item">
              <span class="tool-icon">🛡️</span>
              <span>TypeScript</span>
            </div>
            <div class="tool-item">
              <span class="tool-icon">🧩</span>
              <span>组件化</span>
            </div>
            <div class="tool-item">
              <span class="tool-icon">🎨</span>
              <span>UI组件库</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交互演示区域 -->
    <div class="interactive-section">
      <h2>🎮 交互体验演示</h2>
      
      <div class="demo-container">
        <!-- 模拟登录 -->
        <div class="demo-box">
          <h3>🔐 用户登录演示</h3>
          <div class="login-form">
            <input v-model="loginForm.username" placeholder="用户名" class="form-input"/>
            <input v-model="loginForm.password" type="password" placeholder="密码" class="form-input"/>
            <button @click="simulateLogin" class="demo-btn primary">登录</button>
            <div v-if="loginMessage" class="login-message" :class="loginMessageType">
              {{ loginMessage }}
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="demo-box">
          <h3>📈 实时数据统计</h3>
          <div class="stats-demo">
            <div class="stat-card" v-for="stat in stats" :key="stat.name">
              <div class="stat-value" :style="{ color: stat.color }">
                {{ formatNumber(stat.value) }}
              </div>
              <div class="stat-name">{{ stat.name }}</div>
              <div class="stat-change" :class="stat.change > 0 ? 'positive' : 'negative'">
                {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
              </div>
            </div>
          </div>
          <button @click="updateStats" class="demo-btn secondary">刷新数据</button>
        </div>
      </div>
    </div>

    <!-- 技术栈展示 -->
    <div class="tech-stack-section">
      <h2>🛠️ 技术栈一览</h2>
      <div class="tech-grid">
        <div v-for="tech in technologies" :key="tech.name" class="tech-item">
          <div class="tech-logo">{{ tech.logo }}</div>
          <div class="tech-name">{{ tech.name }}</div>
          <div class="tech-desc">{{ tech.description }}</div>
        </div>
      </div>
    </div>

    <!-- 快速开始 -->
    <div class="cta-section">
      <h2>🚀 立即开始您的开发之旅</h2>
      <div class="cta-buttons">
        <button @click="startDevelopment" class="cta-btn primary">
          🎮 启动开发环境
        </button>
        <button @click="viewDocumentation" class="cta-btn secondary">
          📚 查看详细文档
        </button>
        <button @click="tryWebManager" class="cta-btn accent">
          🌐 使用Web管理面板
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 响应式数据
const currentRole = ref('user')
const loginForm = reactive({ username: '', password: '' })
const loginMessage = ref('')
const loginMessageType = ref('')

// 模拟统计数据
const stats = ref([
  { name: '总资产', value: 12850000, change: 2.5, color: '#1890ff' },
  { name: '今日收益', value: 325000, change: 5.2, color: '#52c41a' },
  { name: '风险指数', value: 15, change: -1.8, color: '#faad14' },
  { name: '活跃用户', value: 1248, change: 8.3, color: '#722ed1' }
])

// 技术栈数据
const technologies = [
  { name: 'Vue 3', logo: '🟢', description: '渐进式JavaScript框架' },
  { name: 'TypeScript', logo: '📘', description: 'JavaScript超集语言' },
  { name: 'Vite', logo: '⚡', description: '下一代构建工具' },
  { name: 'Ant Design Vue', logo: '🐜', description: '企业级UI组件库' },
  { name: 'ECharts', logo: '📊', description: '数据可视化图表库' },
  { name: 'Pinia', logo: '🍍', description: 'Vue状态管理库' }
]

// 方法
const handleRoleChange = () => {
  // 角色切换逻辑
}

const getMenuItems = () => {
  const menus = {
    admin: [
      { name: '工作台', accessible: true, key: 'dashboard' },
      { name: '系统管理', accessible: true, key: 'system' },
      { name: '用户管理', accessible: true, key: 'users' },
      { name: '数据分析', accessible: true, key: 'analytics' }
    ],
    user: [
      { name: '工作台', accessible: true, key: 'dashboard' },
      { name: '系统管理', accessible: false, key: 'system' },
      { name: '用户管理', accessible: false, key: 'users' },
      { name: '数据分析', accessible: true, key: 'analytics' }
    ],
    guest: [
      { name: '工作台', accessible: true, key: 'dashboard' },
      { name: '系统管理', accessible: false, key: 'system' },
      { name: '用户管理', accessible: false, key: 'users' },
      { name: '数据分析', accessible: false, key: 'analytics' }
    ]
  }
  return menus[currentRole.value as keyof typeof menus] || []
}

const simulateLogin = () => {
  if (loginForm.username && loginForm.password) {
    loginMessage.value = '登录成功！欢迎回来 🎉'
    loginMessageType.value = 'success'
    setTimeout(() => {
      loginMessage.value = ''
    }, 3000)
  } else {
    loginMessage.value = '请输入用户名和密码 ❌'
    loginMessageType.value = 'error'
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const updateStats = () => {
  // 模拟数据更新
  stats.value.forEach(stat => {
    const change = (Math.random() - 0.5) * 10
    stat.value = Math.max(0, stat.value * (1 + change / 100))
    stat.change = parseFloat(change.toFixed(1))
  })
}

const startDevelopment = () => {
  alert('开发环境启动功能已在Web管理面板中实现！')
}

const viewDocumentation = () => {
  window.open('BEGINNER_GUIDE.md', '_blank')
}

const tryWebManager = () => {
  window.open('http://localhost:8080', '_blank')
}
</script>

<style scoped>
.demo-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  margin-bottom: 40px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-title {
  font-size: 3rem;
  margin: 0 0 15px 0;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin: 0 0 25px 0;
  opacity: 0.9;
}

.feature-tags {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

/* 功能展示 */
.features-section h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 30px;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
}

.feature-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* 演示元素样式 */
.demo-chart {
  height: 150px;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
}

.chart-placeholder {
  text-align: center;
  color: #95a5a6;
}

.permission-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.role-selector {
  margin-bottom: 15px;
}

.role-selector label {
  margin-right: 10px;
  font-weight: 500;
}

.role-selector select {
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.menu-preview {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eee;
}

.menu-item.accessible {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
}

.access-indicator {
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.access-indicator.yes {
  background: #27ae60;
  color: white;
}

.access-indicator.no {
  background: #e74c3c;
  color: white;
}

.responsive-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.device-screens {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 15px;
}

.screen {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 100px;
}

.screen.desktop { border-top: 5px solid #3498db; }
.screen.tablet { border-top: 5px solid #f39c12; }
.screen.mobile { border-top: 5px solid #e74c3c; }

.screen-label {
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.screen-content {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.dev-tools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.tool-icon {
  font-size: 1.2rem;
}

/* 交互演示 */
.interactive-section {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 40px;
  margin: 40px 0;
}

.interactive-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.demo-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.demo-box {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.demo-box h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.login-form {
  display: grid;
  gap: 15px;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.login-message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.login-message.success {
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
  border: 1px solid #27ae60;
}

.login-message.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.stats-demo {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-name {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

.demo-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.demo-btn.primary {
  background: #3498db;
  color: white;
}

.demo-btn.primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.demo-btn.secondary {
  background: #95a5a6;
  color: white;
}

.demo-btn.secondary:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
}

/* 技术栈 */
.tech-stack-section {
  margin: 50px 0;
}

.tech-stack-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.tech-item {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.tech-logo {
  font-size: 3rem;
  margin-bottom: 15px;
}

.tech-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.tech-desc {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 行动号召 */
.cta-section {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  color: white;
  margin: 50px 0;
}

.cta-section h2 {
  margin: 0 0 30px 0;
  font-size: 2.2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: white;
  color: #3498db;
}

.cta-btn.primary:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.cta-btn.secondary:hover {
  background: white;
  color: #3498db;
}

.cta-btn.accent {
  background: #f39c12;
  color: white;
}

.cta-btn.accent:hover {
  background: #e67e22;
  transform: translateY(-3px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-demo {
    grid-template-columns: 1fr;
  }
  
  .dev-tools {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 80%;
  }
}
</style>