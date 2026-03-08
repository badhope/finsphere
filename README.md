# FinSphere Pro

<div align="center">

![Vue Version](https://img.shields.io/badge/Vue-3.5+-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Vite](https://img.shields.io/badge/Vite-5.2+-purple)
![License](https://img.shields.io/badge/License-MIT-green)

**企业级金融数据管理平台**

[English](README_EN.md) | 简体中文

</div>

---

## � 项目简介

FinSphere Pro 是一个基于 **Vue 3 + TypeScript + Vite** 构建的现代化企业级金融数据管理平台。项目采用最新的前端技术栈，提供完整的资产管理、投资组合、行情分析和交易记录功能。

### ✨ 核心特性

- 🏗️ **现代化架构** - Vue 3 Composition API + TypeScript + Pinia
- � **金融数据可视化** - ECharts 5 专业图表库
- 🔐 **安全认证** - JWT Token + AES 加密 + RBAC 权限控制
- 🎨 **UI 组件库** - Element Plus 企业级组件
- 🌐 **国际化支持** - 中英文多语言切换
- � **主题切换** - 深色/浅色模式 + 自定义主题色
- 📱 **响应式设计** - 完美适配 PC、平板、移动端
- ⚡ **性能优化** - 代码分割、懒加载、Gzip 压缩
- 🦴 **骨架屏** - 加载状态优化，提升用户体验
- 🔒 **JWT 验证** - 完整的 Token 验证和过期处理

---

## 🛠️ 技术栈

### 核心框架
| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue](https://vuejs.org/) | 3.5+ | 渐进式 JavaScript 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.0+ | 静态类型检查 |
| [Vite](https://vitejs.dev/) | 5.2+ | 下一代构建工具 |
| [Pinia](https://pinia.vuejs.org/) | 2.1+ | Vue 官方状态管理 |
| [Vue Router](https://router.vuejs.org/) | 4.3+ | 路由管理 |

### UI 与可视化
| 技术 | 版本 | 说明 |
|------|------|------|
| [Element Plus](https://element-plus.org/) | 2.6+ | Vue 3 UI 组件库 |
| [ECharts](https://echarts.apache.org/) | 5.5+ | 数据可视化图表 |
| [SCSS](https://sass-lang.com/) | 1.71+ | CSS 预处理器 |

### 工具库
| 技术 | 版本 | 说明 |
|------|------|------|
| [Axios](https://axios-http.com/) | 1.6+ | HTTP 客户端 |
| [VueUse](https://vueuse.org/) | 10.9+ | Composition API 工具集 |
| [Day.js](https://day.js.org/) | 1.11+ | 日期处理库 |
| [CryptoJS](https://cryptojs.com/) | 4.2+ | 加密解密库 |
| [Lodash ES](https://lodash.com/) | 4.17+ | JavaScript 工具库 |

### 开发工具
- **ESLint** + **Prettier** + **Stylelint** - 代码质量检查
- **Husky** + **lint-staged** - Git 钩子管理
- **Vitest** - 单元测试框架

---

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **pnpm** >= 8.0.0

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/YOUR_USERNAME/finsphere-pro.git
cd finsphere-pro

# 2. 安装依赖
npm install
# 或
pnpm install

# 3. 复制环境变量文件
cp .env.example .env.development

# 4. 配置环境变量（重要！）
# 编辑 .env.development，设置 VITE_ENCRYPTION_KEY
# 生成密钥：openssl rand -hex 32

# 5. 启动开发服务器
npm run dev

# 6. 访问应用
# http://localhost:5173
```

### 默认账户
```
用户名：admin
密码：123456
```

---

## 📁 项目结构

```
finsphere-pro/
├── .vscode/              # VS Code 配置
├── public/               # 静态资源
├── src/
│   ├── api/              # API 接口定义
│   ├── components/       # 全局组件
│   ├── composables/      # Composition API 工具
│   ├── directives/       # 自定义指令
│   ├── layouts/          # 页面布局
│   ├── locales/          # 国际化配置
│   ├── mock/             # Mock 数据
│   ├── router/           # 路由配置
│   ├── services/         # 业务服务层
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 样式文件
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   │   ├── http/         # HTTP 客户端封装
│   │   ├── security/     # 安全相关（加密、JWT）
│   │   └── storage/      # 存储封装
│   ├── views/            # 页面视图
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── .env.development      # 开发环境配置
├── .env.production       # 生产环境配置
├── .env.example          # 环境变量示例
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目文档
```

---

## 🎯 功能模块

### 🏠 工作台 (Dashboard)
- 资产概览统计（总资产、今日收益、持仓数量、收益率）
- 资产趋势折线图
- 资产配置饼图
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

---

## 🔧 配置说明

### 环境变量

```bash
# 应用配置
VITE_APP_TITLE=FinSphere Pro
VITE_BASE_URL=/

# API 配置
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_ENABLED=true

# 安全配置（⚠️ 生产环境必须修改！）
VITE_ENCRYPTION_KEY=your_secure_encryption_key_here
VITE_TOKEN_EXPIRES_IN=7200

# 功能开关
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false

# 第三方服务
VITE_AMAP_KEY=your_amap_api_key_here
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### 生成安全密钥

```bash
# 使用 OpenSSL 生成 32 字节随机密钥
openssl rand -hex 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 安全特性

### 认证安全
- ✅ JWT Token 认证机制
- ✅ Refresh Token 自动续期
- ✅ SessionStorage 优先存储（更安全）
- ✅ 敏感数据 AES-256 加密
- ✅ Token 过期自动检测和处理

### 权限控制
- ✅ RBAC 角色权限模型
- ✅ 路由级别权限验证
- ✅ 组件级别权限控制
- ✅ API 请求权限拦截

### 数据保护
- ✅ XSS 攻击防护
- ✅ CSRF 攻击防护
- ✅ SQL 注入防护
- ✅ 敏感信息脱敏显示

### JWT 验证
- ✅ Token 格式验证
- ✅ 过期时间检查
- ✅ 签名基本验证
- ✅ 自动刷新令牌

---

## 📱 浏览器支持

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |
| Edge | >= 90 |
| iOS Safari | >= 14 |
| Android Chrome | >= 90 |

---

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────────────────┐
│         Components (视图层)          │
├─────────────────────────────────────┤
│         Stores (状态管理层)          │
├─────────────────────────────────────┤
│       Services (业务逻辑层)          │
├─────────────────────────────────────┤
│      HTTP Client (网络请求层)        │
├─────────────────────────────────────┤
│       Utils (工具函数层)             │
└─────────────────────────────────────┘
```

### 状态管理

- **App Store** - 应用设置、主题配置、加载状态
- **User Store** - 用户认证、信息管理、权限控制
- ~~Theme Store~~ (已合并到 App Store，避免重复)

---

## 📊 性能优化

### 构建优化
- ✅ ES2020 目标，减少 polyfill
- ✅ 代码分割和按需加载
- ✅ Gzip 压缩
- ✅ Tree Shaking
- ✅ 第三方库分块打包

### 运行时优化
- ✅ 组件懒加载
- ✅ ECharts 按需导入
- ✅ 图片懒加载
- ✅ 防抖节流
- ✅ 骨架屏加载状态

### 缓存策略
- ✅ 静态资源缓存
- ✅ API 响应缓存
- ✅ 本地数据持久化

---

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具链相关

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [ECharts](https://echarts.apache.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)

---

## 📞 联系我们

- **项目主页**: [https://github.com/YOUR_USERNAME/finsphere-pro](https://github.com/YOUR_USERNAME/finsphere-pro)
- **问题反馈**: [Issues](https://github.com/YOUR_USERNAME/finsphere-pro/issues)
- **邮箱**: your.email@example.com

---

<div align="center">

**Made with ❤️ by FinSphere Team**

⭐ 如果这个项目对你有帮助，请给一个 Star 支持！

</div>
