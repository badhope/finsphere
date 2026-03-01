# FinSphere Pro

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4+-brightgreen" alt="Vue Version">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue" alt="TypeScript Version">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/github/stars/badhope/finsphere" alt="Stars">
</p>

> 🚀 **企业级金融数据管理平台** - 开箱即用的现代化金融后台管理系统

## 📋 项目简介

FinSphere Pro 是一个基于 Vue 3 + TypeScript 的企业级金融数据管理平台，专为金融机构和投资者设计。通过现代化的技术栈和精心设计的用户体验，为用户提供专业的资产管理、行情分析和交易记录功能。

### 🎯 核心特性

- 💼 **资产管理** - 智能化的投资组合管理
- 📈 **行情分析** - 实时金融数据可视化
- 📊 **数据统计** - 多维度业绩分析报表
- 🔐 **权限控制** - 完善的角色权限管理体系
- 🌐 **国际化** - 多语言支持（中英文）
- 🎨 **主题切换** - 深色/浅色模式自由切换
- 📱 **响应式** - 完美适配各种设备屏幕

## 🛠️ 技术栈

### 前端技术
- **Vue 3.4+** - 渐进式JavaScript框架
- **TypeScript 5.0+** - 静态类型检查
- **Vite 5.2+** - 现代化构建工具
- **Pinia 2.1+** - 状态管理
- **Vue Router 4.3+** - 路由管理
- **Element Plus 2.6+** - UI组件库
- **ECharts 5.5+** - 数据可视化
- **Axios 1.6+** - HTTP客户端

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Stylelint** - CSS规范检查
- **Husky** - Git钩子管理
- **Commitizen** - 规范化提交
- **Vitest** - 单元测试框架

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 开发运行
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 运行测试
npm run test
```

### 项目结构
```
src/
├── api/           # API接口定义
├── assets/        # 静态资源
├── components/    # 全局组件
├── composables/   # Composition API函数
├── layouts/       # 页面布局
├── locales/       # 国际化配置
├── pages/         # 页面组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── styles/        # 样式文件
├── types/         # TypeScript类型定义
├── utils/         # 工具函数
└── views/         # 视图组件
```

## 📖 功能模块

### 🏠 工作台 (Dashboard)
- 资产概览统计
- 收益趋势图表
- 资产配置分析
- 快捷操作入口

### 💼 投资组合 (Portfolio)
- 组合列表管理
- 详细持仓分析
- 收益绩效计算
- 风险评估报告

### 📈 市场行情 (Market)
- 自选股管理
- 实时行情监控
- 技术分析工具
- 市场资讯聚合

### 📋 交易记录 (Trade)
- 交易历史查询
- 成交明细统计
- 盈亏分析报告
- 税费计算

### ⚙️ 系统设置 (System)
- 个人资料管理
- 系统偏好设置
- 安全认证配置
- 通知消息管理

## 🔧 配置说明

### 环境变量
项目支持多种环境配置：

```bash
# 开发环境
.env.development

# 生产环境
.env.production

# 本地环境
.env.local
```

### 主要配置项
```env
# 应用配置
VITE_APP_TITLE=FinSphere Pro
VITE_BASE_URL=/

# API配置
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_ENABLED=true

# 安全配置
VITE_ENCRYPTION_KEY=your_secret_key_here
VITE_TOKEN_EXPIRES_IN=7200

# 第三方服务
VITE_AMAP_KEY=your_amap_api_key
VITE_SENTRY_DSN=your_sentry_dsn
```

## 🎨 设计规范

### 色彩体系
- 主色调：`#409eff` (Element Blue)
- 成功色：`#67c23a` (Green)
- 警告色：`#e6a23c` (Orange)
- 危险色：`#f56c6c` (Red)
- 信息色：`#909399` (Gray)

### 金融专用色
- 涨幅色：`#00c853` (Financial Green)
- 跌幅色：`#ff5252` (Financial Red)
- 蓝色系：`#2979ff` (Financial Blue)

### 响应式断点
- XS: < 480px (移动端)
- SM: ≥ 576px (小屏)
- MD: ≥ 768px (平板)
- LG: ≥ 992px (桌面)
- XL: ≥ 1200px (大屏)
- XXL: ≥ 1600px (超大屏)

## 🔒 安全特性

### 认证安全
- JWT Token 认证机制
- Refresh Token 自动续期
- SessionStorage 优先存储
- 敏感数据 AES 加密

### 权限控制
- RBAC 角色权限模型
- 路由级别权限验证
- 组件级别权限控制
- API 请求权限拦截

### 数据保护
- XSS 攻击防护
- CSRF 攻击防护
- SQL 注入防护
- 敏感信息脱敏

## 📱 浏览器支持

- Chrome ≥ 80
- Firefox ≥ 74
- Safari ≥ 13
- Edge ≥ 80
- iOS Safari ≥ 13
- Android Chrome ≥ 80

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 遵循 ESLint 和 Stylelint 规则
- 使用 Conventional Commits 提交格式
- 编写单元测试覆盖核心功能
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [ECharts](https://echarts.apache.org/)
- [Vite](https://vitejs.dev/)

## 📞 联系我们

- 项目主页: [https://github.com/badhope/finsphere](https://github.com/badhope/finsphere)
- 问题反馈: [Issues](https://github.com/badhope/finsphere/issues)
- 邮箱: x18825407105@outlook.com

---

<p align="center">Made with ❤️ by FinSphere Team</p>
