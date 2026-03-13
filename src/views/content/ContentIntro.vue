<template>
  <div class="content-intro">
    <header class="header">
      <div class="container">
        <div class="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="40" height="40" rx="8" fill="#409EFF"/>
            <path d="M14 24L20 30L34 16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">data</span>
        </div>
        <nav class="nav">
          <a href="#features">功能特性</a>
          <a href="#tech">技术架构</a>
          <a href="#contact">联系我们</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container">
          <h1>企业级数据管理平台</h1>
          <p class="subtitle">现代化前端技术栈构建的高效数据管理与分析解决方案</p>
        </div>
      </section>

      <section id="features" class="features">
        <div class="container">
          <h2>核心功能</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <h3>数据可视化分析</h3>
              <p>提供丰富的数据可视化组件，支持多种图表类型，帮助用户快速理解数据趋势。</p>
            </div>
            <div class="feature-card">
              <h3>投资组合管理</h3>
              <p>支持多维度投资组合配置与管理，满足不同业务场景需求。</p>
            </div>
            <div class="feature-card">
              <h3>市场行情监控</h3>
              <p>实时市场数据监控与分析，帮助用户把握市场动态。</p>
            </div>
            <div class="feature-card">
              <h3>交易记录追踪</h3>
              <p>完整的交易历史记录与管理，支持多维度查询统计。</p>
            </div>
            <div class="feature-card">
              <h3>安全认证体系</h3>
              <p>完善的JWT认证与加密机制，保障系统安全。</p>
            </div>
            <div class="feature-card">
              <h3>响应式设计</h3>
              <p>完美适配PC、平板、移动端设备，提升用户体验。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tech" class="tech">
        <div class="container">
          <h2>技术架构</h2>
          <div class="tech-list">
            <div class="tech-item">
              <span class="tech-name">Vue 3</span>
              <span class="tech-desc">前端框架</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">TypeScript</span>
              <span class="tech-desc">类型安全</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Vite</span>
              <span class="tech-desc">构建工具</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Pinia</span>
              <span class="tech-desc">状态管理</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Element Plus</span>
              <span class="tech-desc">UI组件库</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">ECharts</span>
              <span class="tech-desc">数据可视化</span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="contact">
        <div class="container">
          <h2>联系我们</h2>
          <p>如有任何问题，请联系我们的技术支持团队。</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <p class="copyright">© 2024 data. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo svg {
  width: 36px;
  height: 36px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav a {
  color: #606266;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.nav a:hover {
  color: #409EFF;
}

.hero {
  padding: 160px 0 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  opacity: 0.9;
}

.features, .tech, .contact {
  padding: 80px 0;
}

.features {
  background: #f5f7fa;
}

.features h2, .tech h2, .contact h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 48px;
  color: #303133;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.feature-card h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px;
  background: #f5f7fa;
  border-radius: 8px;
}

.tech-name {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
}

.tech-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.contact {
  background: #303133;
  color: white;
  text-align: center;
}

.contact h2 {
  color: white;
}

.contact p {
  font-size: 16px;
  opacity: 0.8;
}

.footer {
  background: #1a1a1a;
  padding: 24px 0;
  text-align: center;
}

.copyright {
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 32px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .nav {
    display: none;
  }
}
</style>
