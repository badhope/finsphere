# FinSphere Pro 快速启动指南

## 🚀 一键启动

### Windows 用户
双击运行 `setup-dev.ps1` 脚本，或在PowerShell中执行：
```powershell
.\setup-dev.ps1
```

### Mac/Linux 用户
在终端中执行：
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

## 🛠️ 手动安装

### 1. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
打开浏览器访问：http://localhost:3000

## 🔐 默认账户

- **用户名**: admin
- **密码**: 123456

## 📁 项目结构说明

```
src/
├── api/           # API接口定义
├── assets/        # 静态资源文件
├── components/    # 全局组件
├── composables/   # Composition API工具函数
├── layouts/       # 页面布局组件
├── locales/       # 国际化配置
├── mock/          # Mock数据
├── pages/         # 页面组件
├── router/        # 路由配置
├── stores/        # 状态管理(Pinia)
├── styles/        # 样式文件
├── types/         # TypeScript类型定义
├── utils/         # 工具函数
└── views/         # 视图组件
```

## 🎯 开发建议

1. **推荐IDE**: VS Code + Volar插件
2. **代码规范**: 项目已配置ESLint和Prettier
3. **Git提交**: 使用`npm run commit`进行规范化提交
4. **测试**: 使用`npm run test`运行单元测试

## 📞 技术支持

如遇到问题，请查看：
- [完整文档](README.md)
- [Issues](https://github.com/badhope/finsphere/issues)

---
祝您开发愉快！✨